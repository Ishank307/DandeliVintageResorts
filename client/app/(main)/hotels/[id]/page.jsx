"use client"

import { Suspense } from "react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import {
  getHotelDetails,
  getReviewsByResort,
  searchRooms,
} from "@/lib/api"
import Link from "next/link"
import { ChevronLeft } from 'lucide-react'
import HotelImageGallery from "@/components/hotel/details/HotelImageGallery"
import HotelBookingCard from "@/components/hotel/details/HotelBookingCard"
import HotelAbout from "@/components/hotel/details/HotelAbout"
import HotelAmenities from "@/components/hotel/details/HotelAmenities"
import HotelRoomSelection from "@/components/hotel/details/HotelRoomSelection"
import HotelLocation from "@/components/hotel/details/HotelLocation"
import HotelReviews from "@/components/hotel/details/HotelReviews"

// Helper: Categorize rooms by capacity
function categorizeRooms(rooms) {
  const categories = {}

  rooms.forEach(room => {
    const capacity = room.capacity
    if (!categories[capacity]) {
      categories[capacity] = []
    }
    categories[capacity].push(room)
  })

  return Object.entries(categories)
    .sort(([a], [b]) => Number(a) - Number(b))
    .slice(0, 3)
    .map(([capacity, rooms]) => ({
      capacity: Number(capacity),
      rooms: rooms.sort((a, b) => a.price_per_night - b.price_per_night),
      minPrice: Math.min(...rooms.map(r => r.price_per_night)),
      maxPrice: Math.max(...rooms.map(r => r.price_per_night)),
    }))
}

// Helper: Smart room selection - MINIMIZE COST
function smartSelectRooms(categories, guests, availableRoomIds) {
  const allCombinations = []

  function generateCombinations(remaining, categoryIndex, current, totalCost) {
    if (remaining <= 0) {
      allCombinations.push({
        combination: { ...current },
        totalCost
      })
      return
    }

    if (categoryIndex >= categories.length) {
      return
    }

    const category = categories[categoryIndex]
    const available = category.rooms.filter(r => availableRoomIds.has(r.id))
    const maxAvailable = available.length

    if (maxAvailable === 0) {
      generateCombinations(remaining, categoryIndex + 1, current, totalCost)
      return
    }

    const maxNeeded = Math.ceil(remaining / category.capacity)
    const maxToTry = Math.min(maxAvailable, maxNeeded + 1)

    for (let count = 0; count <= maxToTry; count++) {
      const newRemaining = remaining - (count * category.capacity)
      const newCost = totalCost + (count * category.minPrice)
      const newCurrent = { ...current }

      if (count > 0) {
        newCurrent[category.capacity] = count
      }

      generateCombinations(newRemaining, categoryIndex + 1, newCurrent, newCost)
    }
  }

  generateCombinations(guests, 0, {}, 0)

  const validCombinations = allCombinations.filter(combo => {
    const totalCapacity = Object.entries(combo.combination).reduce(
      (sum, [capacity, count]) => sum + (Number(capacity) * count),
      0
    )
    return totalCapacity >= guests && Object.keys(combo.combination).length > 0
  })

  if (validCombinations.length === 0) {
    return {}
  }

  const cheapest = validCombinations.reduce((min, combo) =>
    combo.totalCost < min.totalCost ? combo : min
  )

  return cheapest.combination
}

function HotelDetailsContent() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [hotel, setHotel] = useState(null)
  const [reviews, setReviews] = useState([])
  const [availableRoomIds, setAvailableRoomIds] = useState(new Set())
  const [selectedRoomCounts, setSelectedRoomCounts] = useState({})
  const [isInitialSelectionDone, setIsInitialSelectionDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const MEDIA_BASE_URL = "http://localhost:8000"

  /* ---------------- DATE CONTEXT ---------------- */
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
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)))

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

  /* ---------------- REFRESH AVAILABILITY ---------------- */
  useEffect(() => {
    if (!hotel || !hasDateContext) {
      setAvailableRoomIds(new Set())
      return
    }

    async function refreshAvailability() {
      try {
        const result = await searchRooms({
          location: hotel.location,
          checkInDate: format(checkIn, "yyyy-MM-dd"),
          checkOutDate: format(checkOut, "yyyy-MM-dd"),
          guests,
        })

        const currentResort = result.find(r => r.resort_id === hotel.id)

        if (currentResort) {
          setAvailableRoomIds(
            new Set(currentResort.available_rooms.map(r => r.id))
          )
        } else {
          setAvailableRoomIds(new Set())
        }
      } catch (err) {
        console.error("Error fetching availability:", err)
        setAvailableRoomIds(new Set())
      }
    }

    refreshAvailability()
  }, [hotel, checkIn?.getTime(), checkOut?.getTime(), guests, hasDateContext])

  /* ---------------- CATEGORIZE ROOMS ---------------- */
  const categories = useMemo(() => {
    if (!hotel) return []
    const available = hotel.rooms.filter(r => availableRoomIds.has(r.id))
    return categorizeRooms(available)
  }, [hotel, availableRoomIds])

  /* ---------------- CALCULATE MAX POSSIBLE CAPACITY ---------------- */
  const maxPossibleCapacity = useMemo(() => {
    if (!hotel) return 0
    return hotel.rooms
      .filter(r => availableRoomIds.has(r.id))
      .reduce((sum, room) => sum + room.capacity, 0)
  }, [hotel, availableRoomIds])

  /* ---------------- AUTO-SELECT CHEAPEST ROOMS ---------------- */
  useEffect(() => {
    if (isInitialSelectionDone || categories.length === 0) return

    // Ensure guests don't exceed max capacity
    const effectiveGuests = Math.min(guests, maxPossibleCapacity)

    const cheapestSelection = smartSelectRooms(categories, effectiveGuests, availableRoomIds)
    setSelectedRoomCounts(cheapestSelection)
    setIsInitialSelectionDone(true)
  }, [categories, guests, availableRoomIds, isInitialSelectionDone, maxPossibleCapacity])

  /* ---------------- RESET SELECTION ON GUEST CHANGE ---------------- */
  useEffect(() => {
    setIsInitialSelectionDone(false)
  }, [guests])

  /* ---------------- CALCULATE SELECTED ROOMS ---------------- */
  const selectedRoomDetails = useMemo(() => {
    const rooms = []
    Object.entries(selectedRoomCounts).forEach(([capacity, count]) => {
      const category = categories.find(c => c.capacity === Number(capacity))
      if (category) {
        const availableInCategory = category.rooms.filter(r => availableRoomIds.has(r.id))
        for (let i = 0; i < count && i < availableInCategory.length; i++) {
          rooms.push(availableInCategory[i])
        }
      }
    })
    return rooms
  }, [selectedRoomCounts, categories, availableRoomIds])

  const totalCapacity = useMemo(() =>
    selectedRoomDetails.reduce((sum, room) => sum + room.capacity, 0),
    [selectedRoomDetails]
  )

  /* ---------------- IMAGES ---------------- */
  const hotelImages = useMemo(() => {
    if (!hotel) return []
    return hotel.rooms.flatMap(room =>
      room.images.map(img => MEDIA_BASE_URL + img.image)
    )
  }, [hotel])

  /* ---------------- REVIEWS ---------------- */
  const totalReviews = reviews.length
  const rating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0"

  /* ---------------- UPDATE URL ---------------- */
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, value)
      }
    })
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  /* ---------------- HANDLERS ---------------- */
  const handleAddRoom = (capacity) => {
    const category = categories.find(c => c.capacity === capacity)
    if (!category) return

    const currentCount = selectedRoomCounts[capacity] || 0
    const maxAvailable = category.rooms.filter(r => availableRoomIds.has(r.id)).length

    if (currentCount < maxAvailable) {
      setSelectedRoomCounts(prev => ({
        ...prev,
        [capacity]: currentCount + 1
      }))
    }
  }

  const handleRemoveRoom = (capacity) => {
    const currentCount = selectedRoomCounts[capacity] || 0
    if (currentCount > 0) {
      setSelectedRoomCounts(prev => {
        const newCounts = { ...prev }
        if (currentCount === 1) {
          delete newCounts[capacity]
        } else {
          newCounts[capacity] = currentCount - 1
        }
        return newCounts
      })
    }
  }

  /* ---------------- LOADING / ERROR ---------------- */
  if (loading) {
    return <p className="text-center mt-20">Loading hotel…</p>
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-6">
        <Link
          href={`/search?location=${encodeURIComponent(searchParams.get('location'))}&check_in=${format(checkIn, "yyyy-MM-dd")}&check_out=${format(checkOut, "yyyy-MM-dd")}&guests=${guests}`}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-1 text-sm font-medium">Back to search page</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{hotel.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <HotelImageGallery images={hotelImages} hotelName={hotel.name} />
            <HotelAbout description={hotel.description} />
            <HotelAmenities amenities={hotel.amenities} />

            <HotelRoomSelection
              categories={categories}
              selectedRoomCounts={selectedRoomCounts}
              availableRoomIds={availableRoomIds}
              onAddRoom={handleAddRoom}
              onRemoveRoom={handleRemoveRoom}
              nights={nights}
              mediaBaseUrl={MEDIA_BASE_URL}
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

          <div className="lg:col-span-1">
            <HotelBookingCard
              hotelId={hotel.id}
              hotelName={hotel.name}
              location={hotel.location}
              selectedRoomCounts={selectedRoomCounts}
              selectedRoomDetails={selectedRoomDetails}
              categories={categories}
              totalCapacity={totalCapacity}
              maxPossibleCapacity={maxPossibleCapacity}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              nights={nights}
              onDateChange={(ci, co) => {
                updateUrlParams({
                  check_in: format(ci, "yyyy-MM-dd"),
                  check_out: format(co, "yyyy-MM-dd"),
                })
              }}
              onGuestsChange={(newGuests) => {
                updateUrlParams({ guests: newGuests.toString() })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HotelDetailsPage() {
  return (
    <Suspense fallback={<div>Loading hotel details...</div>}>
      <HotelDetailsContent />
    </Suspense>
  )
}