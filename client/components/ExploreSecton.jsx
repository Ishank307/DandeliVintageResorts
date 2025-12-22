"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import RoomCard from "./RoomCard"

export default function ExploreSection({ title, rooms }) {
    const scrollRef = useRef(null)

    const scrollByCard = (direction) => {
        if (!scrollRef.current) return

        const container = scrollRef.current
        const firstCard = container.children[0]

        if (!firstCard) return

        const cardWidth = firstCard.getBoundingClientRect().width
        const gap = 16 // Tailwind gap-4 = 16px

        const scrollAmount = cardWidth + gap

        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        })
    }

    return (
        <section className="mb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {title}
                    <span className="text-gray-400">→</span>
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => scrollByCard("left")}
                        className="p-2 rounded-full border hover:bg-gray-100"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={() => scrollByCard("right")}
                        className="p-2 rounded-full border hover:bg-gray-100"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            >
                {rooms.map((room) => (
                    <div key={room.id} className="min-w-[260px]">
                        <RoomCard room={room} />
                    </div>
                ))}
            </div>
        </section>
    )
}
