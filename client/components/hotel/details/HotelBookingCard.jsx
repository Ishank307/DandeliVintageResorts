"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Calendar, Users, Plus, Minus } from "lucide-react"
import { useState, useMemo } from "react"
import HotelDatePicker from "@/components/ui/HotelDatePicker"
import { format } from "date-fns"

export default function HotelBookingCard({
  hotelName,
  location,
  hotelId,
  selectedRoomCounts,
  selectedRoomDetails,
  categories,
  totalCapacity,
  checkIn,
  checkOut,
  guests,
  nights,
  onDateChange,
  onGuestsChange,
  maxPossibleCapacity, // NEW: Total capacity from all available rooms
}) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Calculate pricing
  const basePrice = Object.entries(selectedRoomCounts).reduce((sum, [capacity, count]) => {
    const category = categories.find(c => c.capacity === Number(capacity))
    return sum + (category ? category.minPrice * count * nights : 0)
  }, 0)

  const TAX_RATE = 0.18
  const taxesAndFees = Math.round(basePrice * TAX_RATE)
  const totalPrice = basePrice + taxesAndFees
  const totalRooms = Object.values(selectedRoomCounts).reduce((sum, count) => sum + count, 0)

  // Validation
  const hasEnoughCapacity = totalCapacity >= guests
  const hasSelectedRooms = totalRooms > 0
  const canBook = hasSelectedRooms && hasEnoughCapacity

  const getValidationMessage = () => {
    if (!hasSelectedRooms) return "Please select at least one room"
    if (!hasEnoughCapacity) return `Need ${guests - totalCapacity} more guest capacity`
    return null
  }

  const validationMessage = getValidationMessage()

  const handleBookNow = () => {
    if (!canBook) return

    const roomIds = selectedRoomDetails.map(r => r.id).join(',')
    window.location.href =
      `/booking/${hotelId}` +
      `?room_ids=${roomIds}` +
      `&checkIn=${format(checkIn, "yyyy-MM-dd")}` +
      `&checkOut=${format(checkOut, "yyyy-MM-dd")}` +
      `&guests=${guests}`
  }

  const handleGuestIncrement = () => {
    if (guests < maxPossibleCapacity) {
      onGuestsChange(guests + 1)
    }
  }

  const handleGuestDecrement = () => {
    if (guests > 1) {
      onGuestsChange(guests - 1)
    }
  }

  return (
    <div className="lg:sticky lg:top-20">
      <Card className="p-6 shadow-lg border border-gray-200">
        {/* Hotel Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{hotelName}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Quick Summary */}
        {hasSelectedRooms && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Rooms</span>
                <span className="font-semibold">{totalRooms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Capacity</span>
                <span className={`font-semibold ${hasEnoughCapacity ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {totalCapacity} guests
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Nights</span>
                <span className="font-semibold">{nights}</span>
              </div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-gray-900">
              ₹{basePrice.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            for {nights} night{nights > 1 ? "s" : ""}
            {hasSelectedRooms && ` • ${totalRooms} room${totalRooms > 1 ? 's' : ''}`}
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
            <HotelDatePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onDateChange={(ci, co) => {
                onDateChange(ci, co)
                setShowDatePicker(false)
              }}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </div>

        {/* Guests Counter - NEW DESIGN */}
        <div className="bg-white border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Guests
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGuestDecrement}
                disabled={guests <= 1}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease guests"
              >
                <Minus className="h-4 w-4 text-gray-700" />
              </button>

              <span className="font-bold text-xl min-w-[45px] text-center text-gray-900">
                {guests}
              </span>

              <button
                onClick={handleGuestIncrement}
                disabled={guests >= maxPossibleCapacity}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase guests"
              >
                <Plus className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-right">
            Max: {maxPossibleCapacity} guests
          </p>
        </div>

        {/* Price Breakdown */}
        {hasSelectedRooms && (
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & fees (18%)</span>
              <span>₹{taxesAndFees.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Validation Message */}
        {validationMessage && (
          <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-xs text-amber-800 font-medium text-center">
              {validationMessage}
            </p>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleBookNow}
          disabled={!canBook}
          className={`w-full py-3 text-base font-semibold rounded-lg transition-colors
            ${canBook
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }
          `}
        >
          {canBook ? "Continue to Book" : "Complete Selection"}
        </Button>
      </Card>
    </div>
  )
}