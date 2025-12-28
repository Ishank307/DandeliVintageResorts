"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Users, Plus, Minus } from "lucide-react"

export default function HotelRoomSelection({
  categories,
  selectedRoomCounts,
  availableRoomIds,
  onAddRoom,
  onRemoveRoom,
  nights,
  mediaBaseUrl,
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Select Your Rooms
      </h2>
      <p className="text-gray-600 mb-6">
        Choose the best combination for your stay. Rooms are automatically selected based on your guest count.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const count = selectedRoomCounts[category.capacity] || 0
          const maxAvailable = category.rooms.filter(r => availableRoomIds.has(r.id)).length
          const sampleRoom = category.rooms[0]
          const totalPrice = category.minPrice * count * nights

          return (
            <Card 
              key={category.capacity}
              className={`overflow-hidden transition-all ${
                count > 0 ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
              }`}
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={`${mediaBaseUrl}${sampleRoom.images[0]?.image}`}
                  alt={`${category.capacity} guest room`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">
                    {category.capacity} Guest Room
                  </h3>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Users className="h-4 w-4" />
                    <span>Sleeps {category.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{category.minPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {maxAvailable} available
                  </p>
                </div>

                {count > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {count} × {nights} nights
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Counter */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    onClick={() => onRemoveRoom(category.capacity)}
                    disabled={count === 0}
                    variant="outline"
                    className="flex-1 h-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="px-4 py-2 bg-gray-100 rounded-lg min-w-[60px] text-center">
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                  
                  <Button
                    onClick={() => onAddRoom(category.capacity)}
                    disabled={count >= maxAvailable}
                    className="flex-1 h-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}