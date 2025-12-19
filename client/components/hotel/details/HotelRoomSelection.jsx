"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"

export default function HotelRoomSelection({ rooms, mediaBaseUrl }) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose your room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, index) => (
                    <div
                        key={index}
                        className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                    >
                        {/* Room Image */}
                        <div className="relative h-48">
                            <Image
                                src={`${mediaBaseUrl}${room.images[0].image}`}
                                alt={room.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Room Details on Image */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-xl font-bold mb-1">{room.name}</h3>
                                <p className="text-sm mb-2">{room.description}</p>
                                <p className="text-lg font-semibold">
                                    ₹{room.price} <span className="text-sm font-normal">per night • rooms are</span>
                                </p>
                            </div>
                        </div>

                        {/* Select Button */}
                        <div className="p-4 bg-white">
                            <Button className="w-full bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white font-semibold">
                                Selected
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
