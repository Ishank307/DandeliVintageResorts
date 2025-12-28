"use client"

import RoomCard from "./RoomCard"

export default function ExploreSection({ title, rooms }) {
  return (
    <section className="mb-16">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Handpicked stays you might love
        </p>
      </div>

      {/* Vertical list */}
      <div className="space-y-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            context="explore"   // 🔑 tells RoomCard to IGNORE availability
          />
        ))}
      </div>
    </section>
  )
}
