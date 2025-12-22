"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Wifi } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { searchRooms } from "@/lib/api"
import RoomCard from "@/components/RoomCard"


export default function SearchPage() {


    const [showMapView, setShowMapView] = useState(false)
    const [sortBy, setSortBy] = useState("popularity")

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
                    setError(data.message || data.error || "No resorts found")
                }
                // setResults(data)
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
        return <p className="text-center mt-20">Finding the best stays for you… 🏕️</p>
    }

    if (error) {
        return <p className="text-center mt-20 text-red-600">{error}</p>

    }
    const adaptedRooms = results.map((resort) => {
    const cheapestRoom = resort.available_rooms?.[0];

    return {
        id: `${resort.resort_id}-${cheapestRoom?.id || "room"}`, // ✅ unique key
        price_per_night: cheapestRoom?.price_per_night || 0,
        images: cheapestRoom?.images || [],
        resort: {
            id: resort.resort_id,
            name: resort.resort_name,
            location: resort.location,
        },
    };
});

    console.log(results)
    return (
        <main className="container mx-auto px-4 pt-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


                <aside className="lg:col-span-3 opacity-80">
                    <div className="sticky top-28">
                        <h2 className="text-2xl font-bold mb-4">Filters</h2>

                        <p className="text-sm text-gray-500 mb-4">
                            Filters coming soon
                        </p>

                        <div className="space-y-6 pointer-events-none">
                            <div>
                                <h3 className="font-bold mb-2">Price</h3>
                                <div className="h-1 bg-gray-200 rounded-full" />
                            </div>

                            <div>
                                <h3 className="font-bold mb-2">Facilities</h3>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" disabled />
                                    <span>Swimming Pool</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>


                <div className="lg:col-span-9 space-y-6">


                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {results.length} Resorts in {location}
                        </h2>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm">Map View</span>

                            <input
                                type="checkbox"
                                checked={showMapView}
                                onChange={() => setShowMapView(!showMapView)}
                            />

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="popularity">Popularity</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {adaptedRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
    ))}
</div>

                </div>
            </div>
        </main>
    )
}
