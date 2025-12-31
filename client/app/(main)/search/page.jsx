"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { searchRooms } from "@/lib/api"
import RoomCard from "@/components/RoomCard"

function SearchContent() {
  const searchParams = useSearchParams()

  const location = searchParams.get("location") || "Dandeli"
  const checkInDate = searchParams.get("check_in") || "2024-03-15"
  const checkOutDate = searchParams.get("check_out") || "2024-03-18"
  const guests = Number(searchParams.get("guests")) || 2

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Price filter state
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)

        const data = await searchRooms({
          location,
          checkInDate,
          checkOutDate,
          guests,
        })

        if (Array.isArray(data)) {
          const validResorts = data.filter(resort => {
            const availableRooms = resort.available_rooms || []
            const totalCapacity = availableRooms.reduce(
              (sum, room) => sum + (room.capacity || 0),
              0
            )
            return totalCapacity >= guests
          })

          setResults(validResorts)

          if (validResorts.length > 0) {
            const prices = validResorts.flatMap(resort =>
              resort.available_rooms.map(room => room.price_per_night)
            )
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            setMinPrice(Math.floor(min / 500) * 500)
            setMaxPrice(Math.ceil(max / 500) * 500)
            setPriceRange([Math.floor(min / 500) * 500, Math.ceil(max / 500) * 500])
          }

          if (validResorts.length === 0) {
            setError(`No resorts found with capacity for ${guests} guests in ${location}`)
          }
        } else {
          setResults([])
          setError(data?.message || "No resorts found")
        }
      } catch (err) {
        setError(err.message || "Something went wrong")
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

  const adaptedRooms = results
    .map((resort) => {
      const availableRooms = resort.available_rooms || []
      const cheapestRoom = availableRooms[0] || null
      const totalCapacity = availableRooms.reduce(
        (sum, room) => sum + (room.capacity || 0),
        0
      )

      return {
        id: `${resort.resort_id}-${cheapestRoom?.id || "sold-out"}`,
        price_per_night: cheapestRoom?.price_per_night || 0,
        images: cheapestRoom?.images || [],
        isAvailable: availableRooms.length > 0,
        totalCapacity: totalCapacity,
        availableRoomCount: availableRooms.length,
        resort: {
          id: resort.resort_id,
          name: resort.resort_name,
          location: resort.location,
        },
      }
    })
    .filter(room =>
      room.price_per_night >= priceRange[0] &&
      room.price_per_night <= priceRange[1]
    )

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange]
    newRange[index] = Number(value)

    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1]
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0]
    }

    setPriceRange(newRange)
  }

  const resetPriceFilter = () => {
    setPriceRange([minPrice, maxPrice])
  }

  const hasActiveFilters = priceRange[0] !== minPrice || priceRange[1] !== maxPrice

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 animate-pulse">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-700 text-lg font-medium">
            Finding the best stays for you...
          </p>
          <p className="text-gray-500 text-sm mt-1">This won't take long</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your search criteria or selecting a different location
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 lg:py-8">

        {/* Header with Search Summary */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl  border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Stays in {location}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{checkInDate} → {checkOutDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{guests} guest{guests > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{adaptedRooms.length} available</span>
                  </div>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">1</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* FILTERS SIDEBAR */}
          <aside className={`lg:col-span-3 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl  border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={resetPriceFilter}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-4 block flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Price per night
                    </label>

                    {/* Price Range Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-5">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">Minimum</div>
                          <div className="text-lg font-bold text-gray-900">
                            ₹{priceRange[0].toLocaleString()}
                          </div>
                        </div>
                        <div className="text-gray-400">—</div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">Maximum</div>
                          <div className="text-lg font-bold text-gray-900">
                            ₹{priceRange[1].toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Range Slider */}
                    <div className="relative h-2 bg-gray-200 rounded-full mb-8">
                      <div
                        className="absolute h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-200"
                        style={{
                          left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                          right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={500}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                      />
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={500}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                      />
                    </div>

                    {/* Manual Input Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-2 block font-medium">Minimum</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                          <input
                            type="number"
                            min={minPrice}
                            max={priceRange[1]}
                            step={500}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(0, e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-2 block font-medium">Maximum</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                          <input
                            type="number"
                            min={priceRange[0]}
                            max={maxPrice}
                            step={500}
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(1, e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={resetPriceFilter}
                      className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <section className="lg:col-span-9">
            {adaptedRooms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gray-100">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No stays match your filters
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your price range to see more options
                </p>
                <button
                  onClick={resetPriceFilter}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {adaptedRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    context="search"
                    searchParams={{ checkInDate, checkOutDate, guests }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  )
}