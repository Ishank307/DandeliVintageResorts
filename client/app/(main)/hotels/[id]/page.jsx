"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import {
  getHotelDetails,
  getReviewsByResort,
  searchRooms,
} from "@/lib/api"

import HotelImageGallery from "@/components/hotel/details/HotelImageGallery"
import HotelBookingCard from "@/components/hotel/details/HotelBookingCard"
import HotelAbout from "@/components/hotel/details/HotelAbout"
import HotelAmenities from "@/components/hotel/details/HotelAmenities"
import HotelRoomSelection from "@/components/hotel/details/HotelRoomSelection"
import HotelLocation from "@/components/hotel/details/HotelLocation"
import HotelReviews from "@/components/hotel/details/HotelReviews"

export default function HotelDetailsPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [hotel, setHotel] = useState(null)
  const [reviews, setReviews] = useState([])
  const [availableRoomIds, setAvailableRoomIds] = useState(new Set())
  const [selectedRoomId, setSelectedRoomId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const MEDIA_BASE_URL = "http://localhost:8000"

  /* ---------------- DATE CONTEXT ---------------- */
  // Set default dates if not provided
  const checkIn = useMemo(() => {
    const ci = searchParams.get("check_in")
    if (ci) {
      try {
        return new Date(ci)
      } catch {
        return new Date()
      }
    }
    return new Date()
  }, [searchParams])

  const checkOut = useMemo(() => {
    const co = searchParams.get("check_out")
    if (co) {
      try {
        return new Date(co)
      } catch {
        return addDays(new Date(), 1)
      }
    }
    return addDays(checkIn, 1)
  }, [searchParams, checkIn])

  const guests = useMemo(() => {
    const g = Number(searchParams.get("guests"))
    return g > 0 ? g : 2
  }, [searchParams])

  const hasDateContext = Boolean(checkIn && checkOut && guests)

  /* ---------------- FETCH HOTEL + REVIEWS ---------------- */
  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true)
        const hotelData = await getHotelDetails(id)
        const reviewData = await getReviewsByResort(id)

        setHotel(hotelData)
        setReviews(reviewData)
      } catch (err) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchHotel()
  }, [id])

  /* ---------------- REFRESH AVAILABILITY WHEN DATES CHANGE ---------------- */
  useEffect(() => {
    if (!hotel || !hasDateContext || !checkIn || !checkOut) {
      setAvailableRoomIds(new Set())
      return
    }

    async function refreshAvailability() {
      try {
        // Format dates as yyyy-MM-dd strings for the API
        const formattedCheckIn = format(checkIn, "yyyy-MM-dd")
        const formattedCheckOut = format(checkOut, "yyyy-MM-dd")

        const result = await searchRooms({
          location: hotel.location,
          checkInDate: formattedCheckIn,
          checkOutDate: formattedCheckOut,
          guests,
        })

        const currentResort = result.find(
          (r) => r.resort_id === hotel.id
        )

        if (currentResort) {
          setAvailableRoomIds(
            new Set(currentResort.available_rooms.map((r) => r.id))
          )
        } else {
          // All rooms booked for selected dates
          setAvailableRoomIds(new Set())
        }
      } catch (err) {
        console.error("Error fetching room availability:", err)
        setAvailableRoomIds(new Set())
      }
    }

    refreshAvailability()
  }, [hotel, checkIn?.getTime(), checkOut?.getTime(), guests, hasDateContext])

  /* ---------------- ROOMS WITH AVAILABILITY ---------------- */
  const roomsWithAvailability = useMemo(() => {
    if (!hotel) return []

    return hotel.rooms.map((room) => ({
      ...room,
      isAvailable: hasDateContext
        ? availableRoomIds.has(room.id)
        : true, // no dates → don't mark unavailable
    }))
  }, [hotel, availableRoomIds, hasDateContext])

  /* ---------------- AUTO-SELECT FIRST AVAILABLE ROOM ---------------- */
  useEffect(() => {
    if (!roomsWithAvailability.length) return

    // If no room is selected, select the first available one
    if (!selectedRoomId) {
      const firstAvailable = roomsWithAvailability.find(
        (r) => r.isAvailable
      )
      if (firstAvailable) {
        setSelectedRoomId(firstAvailable.id)
      }
      return
    }

    // If currently selected room is still available, keep it
    const currentRoom = roomsWithAvailability.find(
      (r) => r.id === selectedRoomId
    )
    
    if (currentRoom && currentRoom.isAvailable) {
      return // Keep current selection
    }

    // If current room is no longer available, switch to first available
    const nextAvailable = roomsWithAvailability.find(
      (r) => r.isAvailable
    )

    setSelectedRoomId(nextAvailable?.id || null)
  }, [
    roomsWithAvailability.length,
    roomsWithAvailability.map(r => `${r.id}-${r.isAvailable}`).join(','),
    selectedRoomId
  ])

  /* ---------------- SELECTED ROOM DATA ---------------- */
  const selectedRoom = useMemo(() => 
    roomsWithAvailability.find((r) => r.id === selectedRoomId),
    [roomsWithAvailability, selectedRoomId]
  )

  // Check if the SPECIFIC selected room is available
  const isSelectedRoomAvailable = selectedRoom?.isAvailable ?? false

  /* ---------------- IMAGES ---------------- */
  const hotelImages = useMemo(() => {
    if (!hotel) return []
    return hotel.rooms.flatMap((room) =>
      room.images.map((img) => MEDIA_BASE_URL + img.image)
    )
  }, [hotel])

  /* ---------------- REVIEWS ---------------- */
  const totalReviews = reviews.length
  const rating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0"

  /* ---------------- UPDATE URL PARAMS ---------------- */
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, value)
      }
    })
    
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  /* ---------------- STATES ---------------- */
  if (loading) {
    return <p className="text-center mt-20">Loading hotel…</p>
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-600">
        {error}
      </p>
    )
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {hotel.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            <HotelImageGallery
              images={hotelImages}
              hotelName={hotel.name}
            />

            <HotelAbout description={hotel.description} />
            <HotelAmenities amenities={hotel.amenities} />

            <HotelRoomSelection
              rooms={roomsWithAvailability}
              mediaBaseUrl={MEDIA_BASE_URL}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
            />

            <HotelLocation
              location={hotel.location}
              coordinates={{ lat: hotel.lat, lng: hotel.lng }}
            />

            <HotelReviews
              rating={rating}
              totalReviews={totalReviews}
              reviews={reviews}
            />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <HotelBookingCard
              hotelId={hotel.id}
              hotelName={hotel.name}
              location={hotel.location}
              originalPrice={selectedRoom?.price_per_night || 0}
              discountedPrice={selectedRoom?.price_per_night || 0}
              discountPercentage={0}
              selectedRoom={selectedRoom}
              isAvailable={isSelectedRoomAvailable}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onDateChange={(ci, co) => {
                updateUrlParams({
                  check_in: format(ci, "yyyy-MM-dd"),
                  check_out: format(co, "yyyy-MM-dd"),
                })
              }}
              onGuestsChange={(newGuests) => {
                updateUrlParams({
                  guests: newGuests.toString(),
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}