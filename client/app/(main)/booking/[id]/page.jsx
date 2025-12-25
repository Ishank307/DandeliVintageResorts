"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Lock, Phone, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useParams, useSearchParams } from "next/navigation"

import { useRouter } from "next/navigation"

import { getHotelDetails, getImageUrl ,addGuestDetails,selectRooms,formatDateForAPI,createRazorpayOrder,verifyPayment} from "@/lib/api";
import { loadRazorpay } from "@/utils/loadRazorpay"

// const loadBookingData = async ({
//     resortId,
//     checkInDate,
//     checkOutDate,
//     selectedRoom,
//     appliedCoupon
// }) => {
//     const hotel = await getHotelDetails(resortId);

//     const nights =
//         (new Date(checkOutDate) - new Date(checkInDate)) /
//         (1000 * 60 * 60 * 24);

//     return {
//         hotel: {
//             name: hotel.name,
//             rating: 4.5,              // static for now (no backend field)
//             reviews: 188,             // static for now
//             image: getImageUrl(selectedRoom.image),
//         },

//         booking: {
//             checkIn: new Date(checkInDate).toDateString(),
//             nights,
//             roomType: selectedRoom.room_type,
//         },

//         pricing: {
//             roomCharge: selectedRoom.price_per_night * nights,
//             instantDiscount: 774,     // frontend logic
//             wizardDiscount: 60,
//             couponDiscount: appliedCoupon ? 500 : 0,
//         },
//     };
// };



export default function BookingPage() {
    const [currentStep, setCurrentStep] = useState(1) // 1 = Guest Details, 2 = Payment Options
    const [paymentMethod, setPaymentMethod] = useState("property")
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [showCouponInput, setShowCouponInput] = useState(false)
    const {id} = useParams();
    const searchParams = useSearchParams()
    const [bookingAttemptId, setBookingAttemptId] = useState(null)
    // const [selectedRoom, setSelectedRoom] = useState(null)

const [isPaying, setIsPaying] = useState(false)

    const checkInDate = searchParams.get("checkIn")
    const checkOutDate = searchParams.get("checkOut")
    const guests = Number(searchParams.get("guests"))
    const roomType = searchParams.get("roomType")
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

    const [bookingData, setBookingData] = useState(null);
    useEffect(() => {
        const saved = localStorage.getItem("bookingAttemptId")
        if (saved) setBookingAttemptId(saved)
    }, [])


    useEffect(() => {
        if (!id || !checkInDate || !checkOutDate) return

        async function init() {
            const hotel = await getHotelDetails(id)
            
            const selectedRoom =
                hotel.rooms.find(room => room.capacity >= guests) ||
                hotel.rooms[0]

            const nights =
                (new Date(checkOutDate) - new Date(checkInDate)) /
                (1000 * 60 * 60 * 24)

            setBookingData({
                hotel: {
                    name: hotel.name,
                    rating: 4.5,
                    reviews: 188,
                    image: getImageUrl(selectedRoom.images[0]?.image),
                },
                booking: {
                    checkIn: new Date(checkInDate).toDateString(),
                    nights,
                    roomType: `Room ${selectedRoom.room_number}`,
                    guests,
                },
                pricing: {
                    roomCharge: Number(selectedRoom.price_per_night) * nights,
                    instantDiscount: 774,
                    wizardDiscount: 60,
                    couponDiscount: appliedCoupon ? 500 : 0,
                },
            })
        }

        init()
    }, [
        id,
        checkInDate,
        checkOutDate,
        guests,
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
        (bookingData?.pricing?.instantDiscount ?? 0) -
        (bookingData?.pricing?.wizardDiscount ?? 0) -
        (bookingData?.pricing?.couponDiscount ?? 0);


    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "SAVE500") {
            setAppliedCoupon({
                code: couponCode,
                discount: 500
            })
            setShowCouponInput(false)
        } else {
            alert("Invalid coupon code!")
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
        // Clear error when user starts typing
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

    const handleContinue = () => {
        
        if (validateGuestDetails()) {
            setCurrentStep(2)
        }
    }

    const handleConfirmBooking = () => {
        // Handle booking confirmation
        alert("Booking confirmed!")
    }

//======================bookings
const handleSelectRooms = async () => {
    const hotel = await getHotelDetails(id)
            
            const selectedRoom =
                hotel.rooms.find(room => room.capacity >= guests) ||
                hotel.rooms[0]
    const res = await selectRooms({
        resort_id: id,
        room_ids: [selectedRoom.id],
        check_in_date: formatDateForAPI(checkInDate),
        check_out_date: formatDateForAPI(checkOutDate),
        guests,
    })

    setBookingAttemptId(res.booking_attempt_id)
    localStorage.setItem("bookingAttemptId", res.booking_attempt_id)
}




const handleAddGuests = async () => {
  // 🚫 STOP immediately if details are invalid
  if (!validateGuestDetails()) {
    return;
  }

  const hotel = await getHotelDetails(id);

  if (!hotel?.rooms?.length) {
    alert("Room data not loaded yet. Please wait.");
    return;
  }

  const selectedRoom =
    hotel.rooms.find(room => room.capacity >= guests) ||
    hotel.rooms[0];

  if (!selectedRoom) {
    alert("No suitable room found.");
    return;
  }

  const res = await selectRooms({
    resort_id: id,
    room_ids: [selectedRoom.id],
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

  const guestDetailsList = Array.from({ length: guests }, () => ({
    room_id: selectedRoom.id,
    name: guestDetails.name,
    age: 25,
  }));

  await addGuestDetails({
    booking_attempt_id: attemptId,
    guests: guestDetailsList,
  });

  setCurrentStep(2);
};



const handlePayNow = async () => {
    try {
        if (!bookingAttemptId) {
            alert("Booking session expired. Please start again.")
            return
        }

        setIsPaying(true)

        // 1️⃣ Load Razorpay SDK
        const loaded = await loadRazorpay()
        if (!loaded) {
            alert("Razorpay SDK failed to load")
            return
        }

        // 2️⃣ Create Razorpay order (backend)
        const orderData = await createRazorpayOrder({
            booking_attempt_id: bookingAttemptId,
        })

        /**
         * Backend returns:
         * {
         *   order_id,
         *   amount,
         *   currency,
         *   key,
         *   booking_attempt_id,
         *   payment_id
         * }
         */

        // 3️⃣ Open Razorpay Checkout
        const options = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.order_id,

            name: bookingData.hotel.name,
            description: `Booking Attempt #${orderData.booking_attempt_id}`,

            prefill: {
                name: guestDetails.name,
                email: guestDetails.email,
                contact: guestDetails.phone,
            },

            handler: async function (response) {
                // 4️⃣ Verify payment
                const verifyRes = await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                })

                if (verifyRes.success) {
                    localStorage.removeItem("bookingAttemptId")
                    router.push(`/booking/success/${verifyRes.booking_id}`)
                } else {
                    alert("Payment verification failed")
                }
            },

            theme: {
                color: "#0066FF",
            },
        }

        const rzp = new window.Razorpay(options)

        rzp.on("payment.failed", () => {
            alert("Payment failed. You can retry from My Bookings.")
        })

        rzp.open()
    } catch (err) {
        console.error(err)
        alert(err.message || "Payment failed")
    } finally {
        setIsPaying(false)
    }
}

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <Link href="/search" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="ml-1 text-sm font-medium">Back to booking</span>
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
                            123-456-7890
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
                                            onClick={handleAddGuests}
                                            className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3 mt-4"
                                        >
                                            Continue to Payment Options
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
                                            <h2 className="text-xl font-semibold text-gray-800">Select payment method</h2>
                                        </div>

                                        <div className="space-y-4 ml-11">
                                            {/* Pay at Property */}
                                            <div
                                                className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "property"
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200"
                                                    }`}
                                                onClick={() => setPaymentMethod("property")}
                                            >
                                                <label className="flex items-start cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="payment-option"
                                                        value="property"
                                                        checked={paymentMethod === "property"}
                                                        onChange={() => setPaymentMethod("property")}
                                                        className="h-5 w-5 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 mt-0.5"
                                                    />
                                                    <div className="ml-4">
                                                        <h3 className="font-semibold text-gray-900 text-base">Pay at property</h3>
                                                        <p className="text-sm text-gray-500 mt-1">We will hold your reservation securely. Pay when you arrive.</p>
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Pay Now */}
                                            <div
                                                className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "now"
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200"
                                                    }`}
                                                onClick={() => setPaymentMethod("now")}
                                            >
                                                <label className="flex items-start cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="payment-option"
                                                        value="now"
                                                        checked={paymentMethod === "now"}
                                                        onChange={() => setPaymentMethod("now")}
                                                        className="h-5 w-5 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 mt-0.5"
                                                    />
                                                    <div className="ml-4">
                                                        <h3 className="font-semibold text-gray-900 text-base">Pay now</h3>
                                                        <p className="text-sm text-gray-500 mt-1">Complete your payment securely online.</p>
                                                    </div>
                                                </label>
                                            </div>

                                            <Button
                                                disabled={isPaying}
                                                onClick={() => {
                                                    if (paymentMethod === "now") {
                                                        handlePayNow()
                                                    } else {
                                                        handleConfirmBooking()
                                                    }
                                                }}
                                                className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3 mt-4"
                                            >
                                                {isPaying ? "Processing payment..." : "Confirm Reservation"}
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
                                    <div className="flex justify-between text-green-600">
                                        <span>Instant discount</span>
                                        <span>-₹{bookingData.pricing.instantDiscount}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Coupon applied ({appliedCoupon.code})</span>
                                            <span>-₹{bookingData.pricing.couponDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-green-600">
                                        <span>Wizard discount</span>
                                        <span>-₹{bookingData.pricing.wizardDiscount}</span>
                                    </div>
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
                                                    <Button
                                                        onClick={handleApplyCoupon}
                                                        className="flex-1 bg-[#0066FF] hover:bg-blue-700 text-white text-sm px-4"
                                                    >
                                                        Apply
                                                    </Button>
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
                                    <span className="text-2xl font-bold text-gray-900">₹{total}</span>
                                </div>
                                <p className="text-xs text-gray-500 text-right">
                                    Taxes included, No/hidden charges
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
