"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { searchRooms } from "@/lib/api"
import RoomCard from "@/components/RoomCard"

export default function SearchPage() {
  const searchParams = useSearchParams()

  const location = searchParams.get("location")
  const checkInDate = searchParams.get("check_in")
  const checkOutDate = searchParams.get("check_out")
  const guests = searchParams.get("guests")

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)
        const data = await searchRooms({
          location,
          checkInDate,
          checkOutDate,
          guests: Number(guests),
        })

        if (Array.isArray(data)) {
          setResults(data)
        } else {
          setResults([])
          setError(data.message || "No resorts found")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (location && checkInDate && checkOutDate && guests) {
      fetchRooms()
    } else {
      setError("Missing search parameters")
      setLoading(false)
    }
  }, [location, checkInDate, checkOutDate, guests])

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-600">
        Finding the best stays for you…
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-600">
        {error}
      </p>
    )
  }

  const adaptedRooms = results.map((resort) => {
    const cheapestRoom = resort.available_rooms?.[0]

    return {
      id: `${resort.resort_id}-${cheapestRoom?.id || "room"}`,
      price_per_night: cheapestRoom?.price_per_night || 0,
      images: cheapestRoom?.images || [],
      resort: {
        id: resort.resort_id,
        name: resort.resort_name,
        location: resort.location,
      },
    }
  })

  return (
    <main className="container mx-auto px-4 pt-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* FILTERS (compact, OYO-style) */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-24 border border-gray-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold text-lg mb-3">Filters</h3>
            <p className="text-sm text-gray-500">
              Filters coming soon
            </p>
          </div>
        </aside>

        {/* RESULTS */}
        <section className="lg:col-span-9 space-y-5">
          {/* HEADER */}
          <div className="border-b pb-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {adaptedRooms.length} stays in {location}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {checkInDate} → {checkOutDate} · {guests} guest{guests > 1 ? "s" : ""}
            </p>
          </div>

          {/* LIST (IMPORTANT PART) */}
          <div className="space-y-6">
            {adaptedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
