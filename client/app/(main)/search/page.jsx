"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { searchRooms } from "@/lib/api"
import RoomCard from "@/components/RoomCard"

export default function SearchPage() {
  const searchParams = useSearchParams()

  const location = searchParams.get("location") || "Dandeli"
  const checkInDate = searchParams.get("check_in") || "2024-03-15"
  const checkOutDate = searchParams.get("check_out") || "2024-03-18"
  const guests = Number(searchParams.get("guests")) || 2

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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
          // Filter resorts that have enough total capacity for guests
          const validResorts = data.filter(resort => {
            const availableRooms = resort.available_rooms || []
            const totalCapacity = availableRooms.reduce(
              (sum, room) => sum + (room.capacity || 0), 
              0
            )
            return totalCapacity >= guests
          })
          
          setResults(validResorts)
          
          // Calculate price range from results
          if (validResorts.length > 0) {
            const prices = validResorts.flatMap(resort => 
              resort.available_rooms.map(room => room.price_per_night)
            )
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            setMinPrice(Math.floor(min / 500) * 500) // Round down to nearest 500
            setMaxPrice(Math.ceil(max / 500) * 500) // Round up to nearest 500
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

  // Adapt results for RoomCard component and apply price filter
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
    
    // Ensure min doesn't exceed max and vice versa
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-600 text-lg">
          Finding the best stays for you…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-2">{error}</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your search criteria or selecting a different location
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 pt-6 pb-12 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* FILTERS */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                <button 
                  onClick={resetPriceFilter}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              )}
            </div>
            
            {/* Price Range Filter */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Price per night
                </label>
                
                {/* Price Range Display */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{priceRange[0].toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">—</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>

                {/* Dual Range Slider */}
                <div className="relative h-2 bg-gray-200 rounded-full mb-6">
                  <div 
                    className="absolute h-2 bg-blue-600 rounded-full"
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
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={500}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                  />
                </div>

                {/* Manual Input Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Min price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <input
                        type="number"
                        min={minPrice}
                        max={priceRange[1]}
                        step={500}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Max price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max={maxPrice}
                        step={500}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <section className="lg:col-span-9 space-y-5">
          <div className="border-b pb-3 bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              {adaptedRooms.length} stay{adaptedRooms.length !== 1 ? 's' : ''} in {location}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {checkInDate} → {checkOutDate} · {guests} guest{guests > 1 ? "s" : ""}
            </p>
          </div>

          {adaptedRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-600 text-lg mb-2">
                No resorts available in this price range
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting your price filters or search criteria
              </p>
              <button 
                onClick={resetPriceFilter}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
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
    </main>
  )
}