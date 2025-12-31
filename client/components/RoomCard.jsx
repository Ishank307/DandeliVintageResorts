"use client"

import Image from "next/image"
import { Star, MapPin, Wifi } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { parseISO, addDays } from "date-fns"
export default function RoomCard({ room, context = "search" }) {
  // Handle case where NEXT_PUBLIC_API_URL includes /api
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const MEDIA_BASE_URL = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
  const imageUrl = room.images?.[0]?.image
    ? `${MEDIA_BASE_URL}${room.images[0].image}`
    : "/placeholder-room.jpg"

  const router = useRouter()
  const searchParams = useSearchParams()

  const [checkIn, setCheckIn] = useState(() => {
    const ci = searchParams.get("check_in") || searchParams.get("checkIn")
    return ci ? parseISO(ci) : new Date()
  })

  const [checkOut, setCheckOut] = useState(() => {
    const co = searchParams.get("check_out") || searchParams.get("checkOut")
    return co ? parseISO(co) : addDays(new Date(), 1)
  })

  const MS_PER_DAY = 1000 * 60 * 60 * 24

  const nights = Math.max(
    1,
    Math.ceil((checkOut - checkIn) / MS_PER_DAY)
  )
  const isAvailable =
    context === "explore"
      ? true               // 🚨 IGNORE availability
      : room.isAvailable   // search / hotel



  const handleNavigate = () => {
    if (context !== "explore" && !isAvailable) return
    router.push(`/hotels/${room.resort.id}?${searchParams.toString()}`)
  }





  return (
    <div
      onClick={handleNavigate}
      className={`flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-8 rounded-2xl border transition shadow-sm
    ${isAvailable
          ? "bg-white border-gray-200 hover:shadow-md cursor-pointer"
          : "bg-slate-100 border-gray-300 opacity-60 cursor-not-allowed"
        }
  `}
    >
      {context !== "explore" && !isAvailable && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
          SOLD OUT
        </div>
      )}

      {/* IMAGE */}
      <div className="relative w-full md:w-60 h-48 md:h-auto md:self-stretch rounded-xl overflow-hidden bg-slate-200 shrink-0">
        {imageUrl && (
          <Image
            src={imageUrl}
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

        {/* Amenities - Enhanced to show more */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-sm text-slate-700 pt-1">
          <span className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border border-slate-400 rounded-sm flex items-center justify-center text-[10px] font-semibold">R</div>
            Reception
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-blue-500" /> Free WiFi
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Power backup
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border border-slate-400 rounded-sm flex items-center justify-center text-[10px] font-semibold">P</div>
            Parking
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            AC
          </span>
          <span className="text-blue-600 font-medium hover:underline cursor-pointer">+ more</span>
        </div>

        {/* Membership */}
        <span className="inline-block text-[11px] 
                     border border-blue-200 
                     text-blue-700 px-2 py-0.5 rounded">
          WIZARD MEMBER
        </span>
      </div>

      {/* PRICE + CTA */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto md:min-w-[180px]">
        <div className="text-left md:text-right space-y-0.5">
          <p className="text-2xl font-bold text-slate-900">
            ₹{room.price_per_night * nights}
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

        <div className="flex gap-3 md:mt-4">


          {isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNavigate()
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Book Now
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
            >
              Sold Out
            </button>
          )}

        </div>
      </div>
    </div>

  )
}
