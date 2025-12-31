"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Lock, Phone, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useParams, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

import { useRouter } from "next/navigation"

import {
    getHotelDetails,
    getImageUrl,
    addGuestDetails,
    selectRooms,
    formatDateForAPI,
    createRazorpayOrder,
    verifyPayment,
    validateCoupon
} from "@/lib/api";
import { loadRazorpay } from "@/utils/loadRazorpay"
import { useAuth } from "@/context/AuthContext"


function BookingContent() {
    const [currentStep, setCurrentStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState("property")
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [showCouponInput, setShowCouponInput] = useState(false)
    const { id } = useParams();
    const searchParams = useSearchParams()
    const [bookingAttemptId, setBookingAttemptId] = useState(null)
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

    const [isPaying, setIsPaying] = useState(false)

    const checkInDate = searchParams.get("checkIn")
    const checkOutDate = searchParams.get("checkOut")
    const guests = Number(searchParams.get("guests"))
    const { user } = useAuth()  // Add this line to get the user

    // 🔑 UPDATED: Parse multiple room IDs from comma-separated string
    const roomIdsParam = searchParams.get("room_ids")
    const roomIds = roomIdsParam
        ? roomIdsParam.split(',').map(id => Number(id)).filter(id => !isNaN(id))
        : []

    const router = useRouter()

    // Guest details form
    const [guestDetails, setGuestDetails] = useState({
        name: "",
        email: "",
        phone: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: ""
    })

    const PARTIAL_PERCENTAGE = 25
    const [payNowType, setPayNowType] = useState("full")
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("bookingAttemptId")
        if (saved) setBookingAttemptId(saved)
    }, [])

    // 🔑 UPDATED: Handle multiple rooms
    useEffect(() => {
        if (!id || !checkInDate || !checkOutDate || roomIds.length === 0) return

        async function init() {
            const hotel = await getHotelDetails(id)
            console.log(hotel)
            // 🔑 Find all selected rooms
            const selectedRooms = hotel.rooms.filter(
                room => roomIds.includes(room.id)
            )

            if (selectedRooms.length === 0) {
                alert("Selected rooms are no longer available.")
                router.push(`/hotels/${id}`)
                return
            }

            // 🔑 Verify we got all requested rooms
            if (selectedRooms.length !== roomIds.length) {
                alert("Some selected rooms are no longer available.")
                router.push(`/hotels/${id}`)
                return
            }

            const nights =
                (new Date(checkOutDate) - new Date(checkInDate)) /
                (1000 * 60 * 60 * 24)

            // 🔑 Calculate total room charge from all selected rooms
            const totalRoomCharge = selectedRooms.reduce(
                (sum, room) => sum + (Number(room.price_per_night) * nights),
                0
            )

            // 🔑 Get first room's image for display (or you could show all)
            const primaryRoomImage = getImageUrl(selectedRooms[0].images[0]?.image)

            // 🔑 Create room type description
            const roomTypeDescription = selectedRooms.length === 1
                ? `Room ${selectedRooms[0].room_number}`
                : `${selectedRooms.length} Rooms (${selectedRooms.map(r => r.room_number).join(', ')})`

            setBookingData({
                hotel: {
                    name: hotel.name,
                    rating: 4.5,
                    reviews: 188,
                    image: primaryRoomImage,
                    phone_number: hotel.contact_number,
                },
                booking: {
                    checkIn: new Date(checkInDate).toDateString(),
                    nights,
                    roomType: roomTypeDescription,
                    guests,
                    selectedRooms, // 🔑 Store all room details
                },
                pricing: {
                    roomCharge: totalRoomCharge,
                    instantDiscount: 0,
                    wizardDiscount: 0,
                    couponDiscount: appliedCoupon ? (totalRoomCharge * appliedCoupon.discount_percentage) / 100 : 0,
                },
            })
        }

        init()
    }, [
        id,
        checkInDate,
        checkOutDate,
        guests,
        roomIds.join(','), // 🔑 Dependency on room IDs
        appliedCoupon
    ])

    if (!bookingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600 text-lg font-medium">
                    Loading booking details…
                </div>
            </div>
        );
    }

    const total =
        (bookingData?.pricing?.roomCharge ?? 0) -
        (bookingData?.pricing?.couponDiscount ?? 0);

    const totalAmount = total

    const payNowAmount =
        payNowType === "partial"
            ? Math.round((totalAmount * PARTIAL_PERCENTAGE) / 100)
            : totalAmount

    const remainingAmount = totalAmount - payNowAmount


    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code')
            return
        }

        setIsValidatingCoupon(true)

        try {


            const data = await validateCoupon(couponCode)
            console.log(data)

            setAppliedCoupon({
                code: couponCode.toUpperCase(),
                discount_percentage: data.discount_percentage
            })
            setShowCouponInput(false)
            toast.success(`Coupon applied! ${data.discount_percentage}% discount`)

        } catch (error) {
            console.error('Coupon validation error:', error)
            toast.error('Failed to validate coupon. Please try again.')
        } finally {
            setIsValidatingCoupon(false)
        }
    }
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode("")
    }

    const handleGuestDetailsChange = (e) => {
        setGuestDetails({
            ...guestDetails,
            [e.target.name]: e.target.value
        })
        setErrors({
            ...errors,
            [e.target.name]: ""
        })
    }

    const validateGuestDetails = () => {
        const newErrors = {}

        if (!guestDetails.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!guestDetails.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!guestDetails.phone.trim()) {
            newErrors.phone = "Phone is required"
        } else if (!/^\d{10}$/.test(guestDetails.phone)) {
            newErrors.phone = "Phone must be 10 digits"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }



    // 🔑 UPDATED: Handle multiple rooms
    const handleAddGuests = async () => {
        if (!validateGuestDetails()) {
            return;
        }

        const hotel = await getHotelDetails(id);

        if (!hotel?.rooms?.length) {
            alert("Room data not loaded yet. Please wait.");
            return;
        }

        // 🔑 Verify all selected rooms exist
        const selectedRooms = hotel.rooms.filter(
            room => roomIds.includes(room.id)
        )

        if (selectedRooms.length === 0) {
            alert("Selected rooms not found.")
            return
        }

        if (selectedRooms.length !== roomIds.length) {
            alert("Some selected rooms are no longer available.")
            return
        }

        // 🔑 Select multiple rooms
        const res = await selectRooms({
            resort_id: id,
            room_ids: roomIds, // 🔑 Pass array of all room IDs
            check_in_date: formatDateForAPI(checkInDate),
            check_out_date: formatDateForAPI(checkOutDate),
            guests,
        });

        const attemptId = res.booking_attempt_id;
        setBookingAttemptId(attemptId);
        localStorage.setItem("bookingAttemptId", attemptId);

        if (!attemptId) {
            alert("Booking session expired. Please start again.");
            return;
        }

        // 🔑 UPDATED: Create guest details for each room
        // Distribute guests across rooms (you may want to adjust this logic)
        const guestsPerRoom = Math.ceil(guests / selectedRooms.length)

        const guestDetailsList = []
        let remainingGuests = guests

        selectedRooms.forEach((room, index) => {
            const guestsForThisRoom = Math.min(guestsPerRoom, remainingGuests, room.capacity)

            for (let i = 0; i < guestsForThisRoom; i++) {
                guestDetailsList.push({
                    room_id: room.id,
                    name: guestDetails.name,
                    age: 25,
                })
            }

            remainingGuests -= guestsForThisRoom
        })

        await addGuestDetails({
            booking_attempt_id: attemptId,
            guests: guestDetailsList,
        });

        setCurrentStep(2);
    };
    const handlePayNow = async (paymentType = "full") => {
        // Validate booking data
        if (!bookingAttemptId) {
            toast.error("Booking session expired. Please start over.")
            setTimeout(() => {
                router.push(`/hotels/${hotelId}`)
            }, 2000)
            return
        }

        setIsPaying(true)

        try {
            // 1️⃣ Load Razorpay SDK
            const loaded = await loadRazorpay()
            if (!loaded) {
                toast.error("Payment gateway failed to load. Please refresh the page.")
                setIsPaying(false)
                return
            }

            // 2️⃣ Create Razorpay order
            toast.loading("Creating order...", { id: 'create-order' })

            const orderData = await createRazorpayOrder({
                booking_attempt_id: bookingAttemptId,
                payment_type: paymentType,
                coupon_code: appliedCoupon?.code || null,
            })

            toast.success("Order created", { id: 'create-order' })
            console.log("Order created:", orderData)

            // Validate order data
            if (!orderData.order_id || !orderData.key) {
                throw new Error("Invalid order data received")
            }

            // 3️⃣ Configure Razorpay Checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                order_id: orderData.order_id,

                name: bookingData.hotel.name,
                description: `Booking for ${bookingData.booking.nights} night${bookingData.booking.nights > 1 ? 's' : ''}${appliedCoupon ? ` (${appliedCoupon.discount_percentage}% off)` : ''}`,
                image: bookingData.hotel.image, // Optional

                prefill: {
                    name: guestDetails.name,
                    email: guestDetails.email,
                    contact: guestDetails.phone,
                },

                handler: async function (response) {
                    console.log("Payment successful:", response)

                    // Show verifying state
                    toast.loading("Verifying payment...", { id: 'verify-payment' })

                    try {
                        const verifyRes = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })

                        console.log("Verification response:", verifyRes)

                        if (verifyRes.success) {
                            toast.success("Payment verified! Redirecting...", { id: 'verify-payment' })

                            // Clean up
                            localStorage.removeItem("bookingAttemptId")

                            // Redirect to booking details
                            setTimeout(() => {
                                router.push(`/bookings/${verifyRes.booking_id}`)
                            }, 1000)
                        } else {
                            handleVerificationError(verifyRes)
                        }
                    } catch (error) {
                        console.error("Verification error:", error)
                        handleVerificationError({ error: error.message })
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log("Payment cancelled by user")
                        toast.error("Payment cancelled")
                        setIsPaying(false)
                    },
                    confirm_close: true // Ask user to confirm before closing
                },

                theme: {
                    color: "#0066FF",
                },

                retry: {
                    enabled: true,
                    max_count: 3
                }
            }

            console.log("Opening Razorpay checkout")
            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error)

                const errorMessage = response.error.description || "Payment failed"
                toast.error(errorMessage)

                // Navigate back with error info
                setTimeout(() => {
                    router.push(`/hotels/${hotelId}?payment_failed=true`)
                }, 2000)

                setIsPaying(false)
            })

            rzp.open()

        } catch (error) {
            console.error("Payment error:", error)
            toast.error(error.message || "Failed to initiate payment")

            // Navigate back to hotel page
            setTimeout(() => {
                router.push(`/hotels/${hotelId}?error=payment_failed`)
            }, 2000)

            setIsPaying(false)
        }
    }

    const handleVerificationError = (errorData) => {
        toast.dismiss('verify-payment')
        setIsPaying(false)

        const errorType = errorData.error
        const resortId = bookingData?.hotel?.id || hotelId

        switch (errorType) {
            case 'SIGNATURE_INVALID':
                toast.error(
                    "Payment verification failed. If amount was deducted, contact support.",
                    { duration: 6000 }
                )
                break

            case 'PAYMENT_NOT_FOUND':
                toast.error(
                    "Payment record not found. Please contact support.",
                    { duration: 5000 }
                )
                break

            case 'UNAUTHORIZED':
                toast.error("This payment does not belong to your account")
                break

            case 'SERVER_ERROR':
                toast.error(
                    "Server error occurred. Please contact support if amount was deducted.",
                    { duration: 6000 }
                )
                break

            default:
                toast.error(
                    errorData.message || "Payment verification failed. Please try again.",
                    { duration: 5000 }
                )
        }

        // Navigate back to hotel details page after delay
        setTimeout(() => {
            router.push(
                `/hotels/${resortId}?` +
                `check_in=${bookingData.booking.checkIn}&` +
                `check_out=${bookingData.booking.checkOut}&` +
                `guests=${bookingData.booking.guests}&` +
                `payment_error=${errorType || 'unknown'}`
            )
        }, 3000)
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <Link
                        href={`/hotels/${id}?location=${searchParams.get('location') || ''}&check_in=${checkInDate}&check_out=${checkOutDate}&guests=${guests}`}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="ml-1 text-sm font-medium">Back to hotel</span>
                    </Link>
                    <div className="flex items-center text-gray-600">
                        <Lock className="h-4 w-4" />
                        <span className="ml-2 text-sm font-medium">Secure checkout</span>
                    </div>
                </header>

                <main>
                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Review & Confirm Stay</h1>

                    {/* Call Banner */}
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
                        <div className="flex items-center">
                            <Phone className="h-5 w-5 text-[#0066FF] mr-3" />
                            <div>
                                <p className="font-semibold text-gray-800">Call us and get more offer</p>
                                <p className="text-sm text-gray-600">Our team is happy to help you with your booking.</p>
                            </div>
                        </div>
                        <a href="tel:1234567890" className="text-[#0066FF] font-semibold text-sm whitespace-nowrap">
                            {bookingData.hotel.phone_number}
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* STEP 1: Guest Details Form */}
                            {currentStep === 1 && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-[#0066FF] text-white rounded-full flex items-center justify-center font-bold">
                                            1
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Enter your details</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-6 ml-11">
                                        We will use these details to share your booking information
                                    </p>

                                    <div className="space-y-4 ml-11">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={guestDetails.name}
                                                onChange={handleGuestDetailsChange}
                                                placeholder="Enter first and last name"
                                                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={guestDetails.email}
                                                onChange={handleGuestDetailsChange}
                                                placeholder="name@example.com"
                                                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value="+91"
                                                    readOnly
                                                    className="w-20 text-center bg-gray-100"
                                                />
                                                <Input
                                                    type="tel"
                                                    name="phone"
                                                    value={guestDetails.phone}
                                                    onChange={handleGuestDetailsChange}
                                                    placeholder="1234567890"
                                                    className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => {
                                                if (!user) {
                                                    // Save current URL to return after login
                                                    const currentUrl = window.location.pathname + window.location.search
                                                    localStorage.setItem('returnUrl', currentUrl)
                                                    router.push('/login')
                                                } else {
                                                    handleAddGuests()
                                                }
                                            }}
                                            className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3 mt-4"
                                        >
                                            {!user ? 'Login to Continue' : 'Continue to Payment Options'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Payment Options */}
                            {currentStep === 2 && (
                                <>
                                    {/* Guest Summary */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                                ✓
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">Guest details</h2>
                                        </div>
                                        <div className="flex items-start justify-between ml-11">
                                            <div className="flex items-center">
                                                <div className="p-3 bg-gray-100 rounded-full">
                                                    <User className="h-6 w-6 text-gray-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="font-semibold text-gray-900">{guestDetails.name}</p>
                                                    <p className="text-sm text-gray-500">{guestDetails.email}</p>
                                                    <p className="text-sm text-gray-500">+91 {guestDetails.phone}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setCurrentStep(1)}
                                                className="text-sm font-medium text-[#0066FF] hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>

                                    {/* Payment Options */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-[#0066FF] text-white rounded-full flex items-center justify-center font-bold">
                                                2
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                Select payment option
                                            </h2>
                                        </div>

                                        <div className="space-y-4 ml-11">

                                            {/* Pay Full */}
                                            <label
                                                className={`p-5 rounded-lg border-2 cursor-pointer flex gap-4 ${payNowType === "full"
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment-type"
                                                    value="full"
                                                    checked={payNowType === "full"}
                                                    onChange={() => setPayNowType("full")}
                                                    className="h-5 w-5 text-[#0066FF] mt-1"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Pay full amount</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Pay the complete amount now and confirm your booking instantly.
                                                    </p>
                                                </div>
                                            </label>

                                            {/* Pay Partial */}
                                            <label
                                                className={`p-5 rounded-lg border-2 cursor-pointer flex gap-4 ${payNowType === "partial"
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment-type"
                                                    value="partial"
                                                    checked={payNowType === "partial"}
                                                    onChange={() => setPayNowType("partial")}
                                                    className="h-5 w-5 text-[#0066FF] mt-1"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        Pay partial amount
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Pay {PARTIAL_PERCENTAGE}% now to reserve your stay. Balance payable at property.
                                                    </p>
                                                </div>
                                            </label>

                                            <Button
                                                disabled={isPaying}
                                                onClick={() => handlePayNow(payNowType)}
                                                className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3 mt-4"
                                            >
                                                {isPaying ? "Processing payment..." : "Confirm & Pay"}
                                            </Button>
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>

                        {/* Right Column - Summary (Always Visible) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
                                {/* Hotel Info */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {bookingData.hotel.name}
                                        </h3>
                                        <div className="flex items-center">
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">
                                                {bookingData.hotel.rating}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                ({bookingData.hotel.reviews} reviews)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 relative rounded-md overflow-hidden ml-4 flex-shrink-0">
                                        <Image
                                            src={bookingData.hotel.image}
                                            alt={bookingData.hotel.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{bookingData.booking.checkIn} - {bookingData.booking.nights} Night</span>
                                    <span className="mx-2">•</span>
                                    <span>{bookingData.booking.roomType}</span>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Room charge</span>
                                        <span>₹{bookingData.pricing.roomCharge}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Coupon applied ({appliedCoupon.code})</span>
                                            <span>-₹{bookingData.pricing.couponDiscount}</span>
                                        </div>
                                    )}

                                </div>

                                {/* Apply Coupon - LARGER */}
                                {!appliedCoupon ? (
                                    <div className="mb-6">
                                        {!showCouponInput ? (
                                            <button
                                                onClick={() => setShowCouponInput(true)}
                                                className="w-full flex items-center justify-center gap-2 text-[#0066FF] text-base font-semibold hover:bg-blue-50 border-2 border-[#0066FF] rounded-lg py-3 transition-colors"
                                            >
                                                <Tag className="h-5 w-5" />
                                                Apply Coupon Code
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="w-full text-sm"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleApplyCoupon}
                                                        disabled={isValidatingCoupon || !couponCode.trim()}
                                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                                    >
                                                        {isValidatingCoupon ? 'Validating...' : 'Apply'}
                                                    </button>
                                                    <Button
                                                        onClick={() => {
                                                            setShowCouponInput(false)
                                                            setCouponCode("")
                                                        }}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mb-6 flex items-center justify-between bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                                        <div className="flex items-center text-green-700">
                                            <Tag className="h-5 w-5 mr-2" />
                                            <span className="text-sm font-semibold">{appliedCoupon.code} applied!</span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-600 text-sm font-medium hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-baseline mb-2 pt-6 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <div className="pt-6 border-t border-gray-200 space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-bold text-gray-900">
                                                {payNowType === "partial" ? "Pay now" : "Total"}
                                            </span>
                                            <span className="text-2xl font-bold text-gray-900">
                                                ₹{payNowAmount}
                                            </span>
                                        </div>

                                        {payNowType === "partial" && (
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Pay at property</span>
                                                <span>₹{remainingAmount}</span>
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-500 text-right">
                                            Taxes included · No hidden charges
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading booking...</div>}>
            <BookingContent />
        </Suspense>
    )
}
