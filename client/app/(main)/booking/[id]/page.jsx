"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Lock, Phone, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function BookingPage({ params }) {
    const [currentStep, setCurrentStep] = useState(1) // 1 = Guest Details, 2 = Payment Options
    const [paymentMethod, setPaymentMethod] = useState("property")
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [showCouponInput, setShowCouponInput] = useState(false)

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

    // Sample data - replace with actual data from API
    const bookingData = {
        hotel: {
            name: "Dandeli Nature Resort",
            rating: 4.5,
            reviews: 188,
            image: "/images/placeholder-room.jpg",
        },
        booking: {
            checkIn: "30 Dec",
            nights: 1,
            roomType: "Deluxe"
        },
        pricing: {
            roomCharge: 3425,
            instantDiscount: 774,
            wizardDiscount: 60,
            couponDiscount: appliedCoupon ? 500 : 0
        }
    }

    const total = bookingData.pricing.roomCharge -
        bookingData.pricing.instantDiscount -
        bookingData.pricing.wizardDiscount -
        bookingData.pricing.couponDiscount

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
                                            onClick={handleContinue}
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
                                                onClick={handleConfirmBooking}
                                                className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3 mt-4"
                                            >
                                                Confirm Reservation
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
