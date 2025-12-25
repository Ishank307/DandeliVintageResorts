"use client"

import Image from "next/image"
import { Star, MapPin,Wifi } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { parseISO,addDays } from "date-fns"
export default function RoomCard({ room }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [checkIn, setCheckIn] = useState(() => {
    const ci = searchParams.get("check_in") || searchParams.get("checkIn")
    return ci ? parseISO(ci) : new Date()
  })

  const [checkOut, setCheckOut] = useState(() => {
    const co = searchParams.get("check_out") || searchParams.get("checkOut")
    return co ? parseISO(co) : addDays(new Date(), 1)})

    const MS_PER_DAY = 1000 * 60 * 60 * 24

  const nights = Math.max(
    1,
    Math.ceil((checkOut - checkIn) / MS_PER_DAY)
  )


  
  const handleNavigate = () => {
    router.push(`/hotels/${room.resort.id}?${searchParams.toString()}`)
  }

  return (
<div
  onClick={handleNavigate}
  className="flex gap-6 p-6 rounded-2xl bg-white 
             hover:bg-slate-50 transition 
             ring-1 ring-slate-200/70 hover:ring-slate-300 cursor-pointer"
>
  {/* IMAGE */}
<div className="relative w-60 self-stretch rounded-xl overflow-hidden bg-slate-200 shrink-0">
    {room.images?.[0]?.image && (
      <Image
        src={room.images[0].image}
        alt={room.resort.name}
        fill
        className="object-cover"
      />
    )}


  </div>

  {/* INFO */}
  <div className="flex-1 space-y-2">
    <h3 className="text-lg font-bold text-slate-900">
      {room.resort.name}
    </h3>

    <div className="flex items-center gap-1 text-sm text-slate-600">
      <MapPin className="h-4 w-4 text-blue-600" />
      <span>{room.resort.location}</span>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-1 
                       bg-blue-600 text-white 
                       text-xs font-semibold px-2 py-0.5 rounded">
        <Star className="h-3 w-3 fill-white" />
        4.8
      </span>
      <span className="text-slate-500">(49)</span>
      <span className="text-slate-500">Excellent</span>
    </div>

    {/* Amenities */}
    <div className="flex items-center gap-4 text-sm text-slate-600 pt-1">
      <span className="flex items-center gap-1">
        <Wifi className="h-4 w-4 text-blue-500" /> Free WiFi
      </span>
      <span className="text-slate-400">+ more</span>
    </div>

    {/* Membership */}
    <span className="inline-block text-[11px] 
                     border border-blue-200 
                     text-blue-700 px-2 py-0.5 rounded">
      WIZARD MEMBER
    </span>
  </div>

  {/* PRICE + CTA */}
  <div className="flex flex-col items-end justify-between min-w-[180px]">
    <div className="text-right space-y-0.5">
      <p className="text-2xl font-bold text-slate-900">
        ₹{room.price_per_night *nights}
      </p>
      <p className="text-sm text-slate-400 line-through">
        ₹{Math.round(room.price_per_night * nights * 1.7)}
      </p>
      <p className="text-sm font-semibold text-blue-600">
        73% off
      </p>
      <p className="text-[11px] text-slate-500">
        + taxes & fees
      </p>
    </div>

    <div className="flex gap-3 mt-4">
      {/* <button
        onClick={(e) => {
          e.stopPropagation()
          handleNavigate()
        }}
        className="px-4 py-2 rounded-md text-sm font-semibold
                   border border-slate-300 text-slate-700
                   hover:bg-slate-100"
      >
        View Details
      </button> */}

      <button
        onClick={(e) => {
          e.stopPropagation()
          handleNavigate()
        }}
        className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-blue-600 hover:bg-blue-700 text-white"
      >
        Book Now
      </button>
    </div>
  </div>
</div>

  )
}
