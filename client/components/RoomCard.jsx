"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RoomCard({ room }) {
    const router = useRouter()

    const handleClick = () => {
        // Open hotel detail page
        router.push(`/hotels/${room.resort.id}`)
    }

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer group"
        >
            {/* Image */}
            <div className="relative h-56 w-full rounded-xl overflow-hidden bg-gray-200">
                {room.images?.[0]?.image ? (
                    <Image
                        src={room.images[0].image}
                        alt={room.resort.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {room.resort.name}
                    </h3>

                    <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-black text-black" />
                        <span>4.8</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-1">
                    {room.resort.location}
                </p>

                <p className="text-sm text-gray-700">
                    ₹{room.price_per_night}
                    <span className="text-gray-500"> / night</span>
                </p>
            </div>
        </div>
    )
}
