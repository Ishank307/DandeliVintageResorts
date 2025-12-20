"use client"

import { useEffect, useState } from "react"
import { useParams,useSearchParams } from "next/navigation"
import { getHotelDetails } from "@/lib/api"

import HotelImageGallery from "@/components/hotel/details/HotelImageGallery"
import HotelBookingCard from "@/components/hotel/details/HotelBookingCard"
import HotelAbout from "@/components/hotel/details/HotelAbout"
import HotelAmenities from "@/components/hotel/details/HotelAmenities"
import HotelRoomSelection from "@/components/hotel/details/HotelRoomSelection"
import HotelLocation from "@/components/hotel/details/HotelLocation"
import HotelReviews from "@/components/hotel/details/HotelReviews"

export default function HotelDetailsPage({ params }) {
    const { id } = useParams()
    const [hotel, setHotel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)




    useEffect(() => {
        async function fetchHotel() {
            try {
                setLoading(true)
                const data = await getHotelDetails(id)
                setHotel(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchHotel()
    }, [id])

    if (loading) return <p className="text-center mt-20">Loading hotel…</p>
    if (error) return <p className="text-center mt-20 text-red-600">{error}</p>

    // yeh jugad hai cause mujhe backend nahi dekhna tha :)
    const MEDIA_BASE_URL = "http://localhost:8000"
    console.log(hotel.rooms[0]);
    const hotelImages = hotel.rooms.flatMap(room =>
        room.images.map(img => MEDIA_BASE_URL + img.image)
    )   
    console.log(hotelImages)
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-6">

                <h1 className="text-2xl md:text-3xl font-bold mb-6">
                    {hotel.name}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Temporary empty gallery */}
                        <HotelImageGallery images={hotelImages} hotelName={hotel.name} />

                        <HotelAbout description={hotel.description} />
                        {/* <HotelAmenities amenities={hotel.amenities} /> */}

                        {/* THIS feeds real room IDs */}
                        <HotelRoomSelection rooms={hotel.rooms} />
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <HotelBookingCard
                                hotelId={hotel.id}
                                hotelName={hotel.name}
                                location={hotel.location}
                                originalPrice={hotel.rooms[0]?.price_per_night}
                                discountedPrice={hotel.rooms[0]?.price_per_night}
                                discountPercentage={0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
