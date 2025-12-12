"use client"

import HotelImageGallery from "@/components/hotel/details/HotelImageGallery"
import HotelBookingCard from "@/components/hotel/details/HotelBookingCard"
import HotelAbout from "@/components/hotel/details/HotelAbout"
import HotelAmenities from "@/components/hotel/details/HotelAmenities"
import HotelRoomSelection from "@/components/hotel/details/HotelRoomSelection"
import HotelLocation from "@/components/hotel/details/HotelLocation"
import HotelReviews from "@/components/hotel/details/HotelReviews"

// This would typically come from an API/database
// For now, using sample data with images from public folder
const getHotelData = (id) => {
    return {
        id: id,
        name: "Ocean view Retreat",
        location: "Goa, India",
        rating: 4.8,
        totalReviews: 245,
        originalPrice: 1887,
        discountedPrice: 887,
        discountPercentage: 75,
        description: "Nestled near seren beaches with mountain views, this resort offers private pools, guided tours, spa facilities, and premium dining. Experience luxury and tranquility with stunning ocean views and world-class amenities.",
        images: [
            "/WhatsApp Image 2025-12-04 at 9.47.19 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.20 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.20 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.21 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.21 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.22 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.22 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.23 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.24 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.24 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.25 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.26 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.26 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.27 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.27 PM (2).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.27 PM.jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.28 PM (1).jpeg",
            "/WhatsApp Image 2025-12-04 at 9.47.28 PM.jpeg",
        ],
        amenities: [
            "Wi-Fi",
            "Swimming Pool",
            "Breakfast Buffet",
            "Smart TV",
            "Spa & Wellness",
            "Airport Pickup",
            "Beach",
            "Laundry Service",
        ],
        rooms: [
            {
                name: "Classic",
                description: "Cozy room with garden view",
                price: 887,
                image: "/WhatsApp Image 2025-12-04 at 9.47.22 PM.jpeg",
            },
            {
                name: "Deluxe",
                description: "Spacious room with ocean view",
                price: 1287,
                image: "/WhatsApp Image 2025-12-04 at 9.47.23 PM.jpeg",
            },
            {
                name: "Suite",
                description: "Luxury suite with private pool",
                price: 2187,
                image: "/WhatsApp Image 2025-12-04 at 9.47.24 PM.jpeg",
            },
        ],
        coordinates: {
            lat: 15.2993,
            lng: 74.1240,
        },
        reviews: [], // Empty for now - will show placeholder
    }
}

export default function HotelDetailsPage({ params }) {
    const hotel = getHotelData(params.id)

    return (
        <div className="min-h-screen bg-white">
            {/* More horizontal padding as requested */}
            <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-6">
                {/* Hotel Name Header */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    {hotel.name}
                </h1>

                {/* Main Layout: Content on LEFT, Booking Card on RIGHT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* LEFT COLUMN - All Content (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <HotelImageGallery images={hotel.images} hotelName={hotel.name} />

                        {/* About Section */}
                        <HotelAbout description={hotel.description} />

                        {/* Amenities */}
                        <HotelAmenities amenities={hotel.amenities} />

                        {/* Room Selection */}
                        <HotelRoomSelection rooms={hotel.rooms} />

                        {/* Location */}
                        <HotelLocation location={hotel.location} coordinates={hotel.coordinates} />

                        {/* Reviews */}
                        <HotelReviews
                            rating={hotel.rating}
                            totalReviews={hotel.totalReviews}
                            reviews={hotel.reviews}
                        />
                    </div>

                    {/* RIGHT COLUMN - Sticky Booking Card (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 max-w-sm mx-auto lg:mx-0">
                            <HotelBookingCard
                                hotelId={hotel.id}
                                hotelName={hotel.name}
                                location={hotel.location}
                                originalPrice={hotel.originalPrice}
                                discountedPrice={hotel.discountedPrice}
                                discountPercentage={hotel.discountPercentage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
