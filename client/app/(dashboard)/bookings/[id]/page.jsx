"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Lock, Phone, User, Calendar, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BookingDetailsPage({ params }) {
    const router = useRouter()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)

    // Simulated booking data - replace with actual API call
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setBooking({
                id: params.id,
                hotel: {
                    name: "Townhouse Oak Dharwad Bus Terminal",
                    rating: 4.5,
                    reviews: 188,
                    image: "/images/hotel-room.jpg",
                    roomType: "Classic"
                },
                guest: {
                    name: "Ishank",
                    email: "ishankkumar307@gmail.com",
                    phone: "816881740"
                },
                dates: {
                    checkIn: "30 Dec",
                    nights: 1
                },
                pricing: {
                    roomCharge: 3425,
                    instantDiscount: -3774,
                    couponDiscount: -3244,
                    wizardDiscount: -60,
                    total: 2124
                }
            })
            setLoading(false)
        }, 500)
    }, [params.id])

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <Link
                    href="/bookings"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="ml-1 text-sm font-medium">Back to bookings</span>
                </Link>
                <div className="flex items-center text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span className="ml-2 text-sm font-medium">Secure checkout</span>
                </div>
            </header>

            <main>
                <h1 className="text-3xl font-bold mb-6">Review & Confirm Stay</h1>

                {/* Call to Action Banner */}
                <div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg mb-8 border border-blue-200">
                    <div className="flex items-center">
                        <Phone className="text-primary mr-3 h-5 w-5" />
                        <div>
                            <p className="font-semibold text-gray-800">Call us and get more offer</p>
                            <p className="text-sm text-gray-600">Our team is happy to help you with your booking.</p>
                        </div>
                    </div>
                    <a
                        href="tel:1234567890"
                        className="text-primary font-semibold text-sm whitespace-nowrap hover:underline"
                    >
                        123-456-7890
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Guest Details & Payment Options */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Guest Details */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Guest details</h2>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <User className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold">{booking.guest.name}</p>
                                        <p className="text-sm text-gray-500">{booking.guest.email}</p>
                                        <p className="text-sm text-gray-500">{booking.guest.phone}</p>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-primary hover:underline">
                                    Edit details
                                </button>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-4">
                            {/* Pay 25% Option */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-primary">
                                <label className="flex items-start cursor-pointer" htmlFor="pay-split">
                                    <input
                                        type="radio"
                                        id="pay-split"
                                        name="payment-option"
                                        defaultChecked
                                        className="h-5 w-5 text-primary mt-1"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <h3 className="font-semibold">Pay 25% now and the rest at the property</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay ₹{Math.round(booking.pricing.total * 0.25)} now, and the remaining amount at the hotel.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Pay Full Option */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <label className="flex items-start cursor-pointer" htmlFor="pay-full">
                                    <input
                                        type="radio"
                                        id="pay-full"
                                        name="payment-option"
                                        className="h-5 w-5 text-primary mt-1"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <h3 className="font-semibold">Pay complete amount</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay the full amount of ₹{booking.pricing.total} now.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
                            {/* Hotel Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-grow pr-4">
                                    <h3 className="font-bold text-lg">{booking.hotel.name}</h3>
                                    <div className="flex items-center mt-2">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">
                                            {booking.hotel.rating}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            ({booking.hotel.reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                                <img
                                    src={booking.hotel.image}
                                    alt="Hotel room"
                                    className="w-16 h-16 object-cover rounded-md"
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/64x64?text=Room"
                                    }}
                                />
                            </div>

                            {/* Booking Details */}
                            <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{booking.dates.checkIn} - {booking.dates.nights} Night</span>
                                <span className="mx-2">•</span>
                                <span>{booking.hotel.roomType}</span>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Room charge</span>
                                    <span>₹{booking.pricing.roomCharge}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Instant discount</span>
                                    <span>₹{booking.pricing.instantDiscount}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Coupon applied</span>
                                    <span>₹{booking.pricing.couponDiscount}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Wizard discount</span>
                                    <span>₹{booking.pricing.wizardDiscount}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-baseline mb-2 pt-6 border-t border-gray-200">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold">₹{booking.pricing.total}</span>
                            </div>
                            <p className="text-xs text-gray-500 text-right mb-6">
                                Taxes included, No hidden charges
                            </p>

                            {/* Confirm Button */}
                            <Button className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700">
                                Confirm Reservation
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
