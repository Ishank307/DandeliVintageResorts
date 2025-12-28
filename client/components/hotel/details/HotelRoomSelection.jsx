"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"

export default function HotelRoomSelection({
  rooms,
  mediaBaseUrl,
  selectedRoomId,
  onSelectRoom,
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Choose your room
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoomId
          const isAvailable = room.isAvailable

          return (
            <div
              key={room.id}
              className={`relative rounded-xl overflow-hidden transition
                ${isSelected
                  ? "ring-2 ring-blue-600"
                  : "ring-1 ring-gray-200"}
                ${!isAvailable && "opacity-60"}
              `}
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={`${mediaBaseUrl}${room.images[0]?.image}`}
                  alt={`Room ${room.room_number}`}
                  fill
                  className="object-cover"
                />

                {/* FULL overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/50 
                                  flex items-center justify-center 
                                  text-white text-lg font-bold">
                    FULL
                  </div>
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t 
                                from-black/80 via-black/40 to-transparent" />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold">
                    Room {room.room_number}
                  </h3>
                  <p className="text-sm opacity-90">
                    Capacity: {room.capacity} guests
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    ₹{room.price_per_night}
                    <span className="text-sm font-normal">
                      {" "}per night
                    </span>
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-white">
                <Button
                  disabled={!isAvailable}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full font-semibold
                    ${isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"}
                    ${!isAvailable && "cursor-not-allowed"}
                  `}
                >
                  {!isAvailable
                    ? "Fully Booked"
                    : isSelected
                    ? "Selected"
                    : "Select Room"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
