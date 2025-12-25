"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Check, Calendar } from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DatePicker from "@/components/ui/DatePicker"
import { format, parseISO, addDays } from "date-fns"

export default function HotelBookingCard({
  hotelName,
  location,
  originalPrice,
  discountedPrice,
  discountPercentage,
  hotelId,
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /* -------------------- Dates (URL → State) -------------------- */
  const [checkIn, setCheckIn] = useState(() => {
    const ci = searchParams.get("check_in") || searchParams.get("checkIn")
    return ci ? parseISO(ci) : new Date()
  })

  const [checkOut, setCheckOut] = useState(() => {
    const co = searchParams.get("check_out") || searchParams.get("checkOut")
    return co ? parseISO(co) : addDays(new Date(), 1)
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [roomType, setRoomType] = useState("classic")
  const [guests, setGuests] = useState(
    Number(searchParams.get("guests")) || 2
  )

  /* -------------------- Pricing Logic -------------------- */
  const MS_PER_DAY = 1000 * 60 * 60 * 24

  const nights = Math.max(
    1,
    Math.ceil((checkOut - checkIn) / MS_PER_DAY)
  )

  const basePrice = discountedPrice * nights
  const originalTotal = originalPrice * nights
  const savings = Math.max(0, originalTotal - basePrice)

  const TAX_RATE = 0.18
  const taxesAndFees = Math.round(basePrice * TAX_RATE)

  const totalPrice = basePrice + taxesAndFees

  /* -------------------- Handlers -------------------- */
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

  /* -------------------- UI -------------------- */
  return (
    <div className="lg:sticky lg:top-20">
      <Card className="p-6 shadow-lg border border-gray-200 bg-blue-50/50">
        {/* Hotel Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {hotelName}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Price Header */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-gray-900">
              ₹{basePrice}
            </span>
            <span className="text-lg text-gray-400 line-through">
              ₹{originalTotal}
            </span>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {discountPercentage}% off
            </span>
          </div>
          <p className="text-sm text-gray-500">
            for {nights} night{nights > 1 ? "s" : ""}
          </p>
        </div>

        {/* Date Picker */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="flex-1 flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Check in</p>
                  <p className="text-sm font-medium">
                    {format(checkIn, "EEE, dd MMM")}
                  </p>
                </div>
                <div className="text-gray-400">→</div>
                <div>
                  <p className="text-xs text-gray-500">Check out</p>
                  <p className="text-sm font-medium">
                    {format(checkOut, "EEE, dd MMM")}
                  </p>
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

        {/* Room & Guests */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border rounded-lg p-3">
            <label className="text-xs text-gray-500 mb-1 block">
              Room type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full text-sm font-medium outline-none"
            >
              <option value="classic">Classic</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div className="bg-white border rounded-lg p-3">
            <label className="text-xs text-gray-500 mb-1 block">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full text-sm font-medium outline-none"
            >
              {[1, 2, 3, 4].map(g => (
                <option key={g} value={g}>
                  {g} guest{g > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="bg-blue-100 border border-blue-200 rounded-md p-2.5 mb-3 flex gap-2">
            <Check className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900">
                You’re saving ₹{savings}
              </p>
              <p className="text-[10px] text-blue-700">
                compared to original price
              </p>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">
              ₹{discountedPrice} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>₹{basePrice}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Taxes & fees (18%)</span>
            <span>₹{taxesAndFees}</span>
          </div>

          <div className="border-t pt-2 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <p className="text-[10px] text-gray-500">
            Includes all applicable taxes
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={handleBookNow}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold rounded-lg"
        >
          Book Now
        </Button>

        {/* Policies */}
        <div className="mt-3 pt-3 border-t text-[10px] text-gray-500 space-y-1">
          <p className="font-medium text-gray-600">Cancellation Policy</p>
          <p>Follow safety measures advised at the hotel</p>
          <p>By proceeding, you agree to our policies</p>
        </div>
      </Card>
    </div>
  )
}
