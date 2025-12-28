"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Check, Calendar } from "lucide-react"
import { useState } from "react"
import DatePicker from "@/components/ui/DatePicker"
import { format } from "date-fns"

export default function HotelBookingCard({
  hotelName,
  location,
  originalPrice,
  discountedPrice,
  discountPercentage,
  hotelId,
  selectedRoom,
  isAvailable, // This now reflects if the SELECTED room is available

  /* 🔑 NEW PROPS */
  checkIn,
  checkOut,
  guests,
  onDateChange,
  onGuestsChange,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  /* ---------------- BOOKING STATE ---------------- */
  // Check if we have a selected room AND if it's available
  const bookingState =
    !selectedRoom || !isAvailable ? "SOLD_OUT" : "AVAILABLE"

  /* ---------------- Pricing ---------------- */
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

  const handleBookNow = () => {
    if (bookingState !== "AVAILABLE") return
    window.location.href =
      `/booking/${hotelId}` +
      `?room_id=${selectedRoom.id}` +
      `&checkIn=${format(checkIn, "yyyy-MM-dd")}` +
      `&checkOut=${format(checkOut, "yyyy-MM-dd")}` +
      `&guests=${guests}`
  }

  return (
    <div className="lg:sticky lg:top-20">
      <Card className="p-6 shadow-lg border border-gray-200 bg-blue-50/50">

        {/* Hotel Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {hotelName}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Selected Room Info */}
        {selectedRoom && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Selected Room</p>
            <p className="text-sm font-semibold text-gray-900">{selectedRoom.room_type}</p>
          </div>
        )}

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-gray-900">
              ₹{basePrice}
            </span>
            <span className="text-lg text-gray-400 line-through">
              ₹{originalTotal}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            for {nights} night{nights > 1 ? "s" : ""}
          </p>
        </div>

        {/* Date Picker */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:border-gray-300 transition-colors"
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
              onDateChange={(ci, co) => {
                onDateChange(ci, co) // 🔑 notify parent
                setShowDatePicker(false)
              }}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </div>

        {/* Guests */}
        <div className="bg-white border rounded-lg p-3 mb-4">
          <label className="text-xs text-gray-500 mb-1 block">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => onGuestsChange(Number(e.target.value))}
            className="w-full text-sm font-medium outline-none bg-transparent"
          >
            {[1, 2, 3, 4].map(g => (
              <option key={g} value={g}>
                {g} guest{g > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {savings > 0 && (
          <div className="bg-blue-100 border border-blue-200 rounded-md p-2.5 mb-3 flex gap-2">
            <Check className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-xs font-semibold text-blue-900">
              You're saving ₹{savings}
            </p>
          </div>
        )}
    
        {/* Breakdown */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="flex justify-between">
            <span>Room × {nights} nights</span>
            <span>₹{basePrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & fees</span>
            <span>₹{taxesAndFees}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      
        {/* Sold out text */}
        {bookingState === "SOLD_OUT" && (
          <p className="text-xs text-red-600 text-center mb-2 font-medium">
            {!selectedRoom 
              ? "Please select a room" 
              : "This room is not available for selected dates"}
          </p>
        )}

        {/* CTA */}
        <Button
          onClick={handleBookNow}
          disabled={bookingState !== "AVAILABLE"}
          className={`w-full py-3 text-base font-semibold rounded-lg transition-colors
            ${
              bookingState === "AVAILABLE"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }
          `}
        >
          {bookingState === "AVAILABLE" ? "Book now" : "Sold out"}
        </Button>

      </Card>
    </div>
  )
}