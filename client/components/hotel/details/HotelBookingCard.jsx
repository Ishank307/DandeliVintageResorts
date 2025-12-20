"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Check, Calendar } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DatePicker from "@/components/ui/DatePicker"
import { format } from "date-fns"

export default function HotelBookingCard({
    hotelName,
    location,
    originalPrice,
    discountedPrice,
    discountPercentage,
    hotelId
}) {
    const router = useRouter()
    const [checkIn, setCheckIn] = useState(new Date())
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000))
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [roomType, setRoomType] = useState("classic")
    const [guests, setGuests] = useState(2)

    const taxesAndFees = Math.round(discountedPrice * 0.18)
    const totalPrice = discountedPrice + taxesAndFees
    const savings = originalPrice - discountedPrice

    const handleDateChange = (newCheckIn, newCheckOut) => {
        setCheckIn(newCheckIn)
        setCheckOut(newCheckOut)
        setShowDatePicker(false)
    }

   const handleBookNow = () => {
        router.push(
            `/booking/${hotelId}` +
            `?checkIn=${format(checkIn, "yyyy-MM-dd")}` +
            `&checkOut=${format(checkOut, "yyyy-MM-dd")}` +
            `&guests=${guests}` +
            `&roomType=${roomType}`
        )
    }


    return (
        <div className="lg:sticky lg:top-20">
            <Card className="p-6 shadow-lg border border-gray-200 bg-blue-50/50">
                {/* Hotel Name & Location */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotelName}</h3>
                    <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{location}</span>
                    </div>
                </div>

                {/* Price Section */}
                <div className="mb-5">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-gray-900">₹{discountedPrice}</span>
                        <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                            {discountPercentage}% off
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">+Taxes & feeds</p>
                </div>

                {/* Check-in/Check-out Section */}
                <div className="relative mb-4">
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Check in</p>
                                        <p className="text-sm font-medium">{format(checkIn, "EEE, dd MMM")}</p>
                                    </div>
                                    <div className="text-gray-400">→</div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Check out</p>
                                        <p className="text-sm font-medium">{format(checkOut, "EEE, dd MMM")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                    {showDatePicker && (
                        <DatePicker
                            checkIn={checkIn}
                            checkOut={checkOut}
                            onDateChange={handleDateChange}
                            onClose={() => setShowDatePicker(false)}
                        />
                    )}
                </div>

                {/* Room Type & Guests */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <label className="text-xs text-gray-500 block mb-1">Room type</label>
                        <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className="w-full text-sm font-medium border-none outline-none bg-white"
                        >
                            <option value="classic">classic</option>
                            <option value="deluxe">deluxe</option>
                            <option value="suite">suite</option>
                        </select>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <label className="text-xs text-gray-500 block mb-1">Guests</label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full text-xs font-medium border-none outline-none bg-white"
                        >
                            <option value="1">1 guest</option>
                            <option value="2">2 guests</option>
                            <option value="3">3 guests</option>
                            <option value="4">4 guests</option>
                        </select>
                    </div>
                </div>

                {/* Referral Message */}
                <div className="bg-blue-100 border border-blue-200 rounded-md p-2.5 mb-3 flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-blue-900">Referral applied, You're saving!</p>
                        <p className="text-[10px] text-blue-700">amount saved : saved amt</p>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Your savings</span>
                        <span className="font-medium text-green-600">₹{savings}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Total price</span>
                        <span className="font-medium">₹{totalPrice}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">including taxes</p>
                </div>

                {/* Book Now Button */}
                <Button
                    onClick={handleBookNow}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold rounded-lg"
                >
                    Book Now
                </Button>

                {/* Policies */}
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                    <p className="text-[10px] text-gray-600 font-medium">Cancellation Policy</p>
                    <p className="text-[10px] text-gray-500">
                        Follow safety measures advised at the hotel
                    </p>
                    <p className="text-[10px] text-gray-500">
                        By proceeding, you agree to our policies
                    </p>
                </div>
            </Card>
        </div>
    )
}
