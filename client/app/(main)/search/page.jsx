"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { MapPin, Star, Wifi, Droplets, Zap } from "lucide-react"

export default function SearchPage() {
    const [showMapView, setShowMapView] = useState(false)
    const [sortBy, setSortBy] = useState("popularity")

    const hotels = [
        {
            id: 1,
            name: "Townhouse Oak Dharwad New Bus Terminal",
            location: "Dharwad, Hubli-Dharwad",
            distance: "3.0 km",
            rating: 4.8,
            reviews: 5,
            ratingText: "Excellent",
            price: 1886,
            originalPrice: 8425,
            discount: 74,
            taxes: 238,
            badge: "Company-Serviced",
            amenities: ["Elevator", "Free Wifi", "Geyser"],
            moreAmenities: 4,
            soldOut: false
        },
        {
            id: 2,
            name: "Super Collection O Hubli City Center",
            location: "Deshpande Nagar, Hubli-Dharwad",
            distance: "15.8 km",
            rating: 4.8,
            reviews: 1884,
            ratingText: "Excellent",
            price: 3162,
            originalPrice: 13867,
            discount: 74,
            taxes: 333,
            badge: "Company-Serviced",
            amenities: ["Elevator", "Free Wifi", "Geyser"],
            moreAmenities: 9,
            soldOut: false
        }
    ]

    return (
        <main className="container mx-auto px-4 pt-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-3">
                    <div className="sticky top-28">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Filters</h2>
                            <button className="text-primary hover:text-blue-700 font-medium text-sm">Clear All</button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold mb-3">Price</h3>
                                <div className="relative h-1 bg-gray-200 rounded-full">
                                    <div className="absolute h-1 bg-primary rounded-full" style={{ left: "0%", width: "100%" }}></div>
                                </div>
                                <div className="flex justify-between text-sm mt-2 text-gray-500">
                                    <span>₹1886</span>
                                    <span>₹3477</span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <h3 className="font-bold mb-3">Collections</h3>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                                    <span className="text-sm">Your friendly neighbourhood stay</span>
                                </label>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <h3 className="font-bold mb-3">Accommodation Type</h3>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                                    <span className="text-sm">Hotel</span>
                                </label>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <h3 className="font-bold mb-3">Hotel Facilities</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                                        <span className="text-sm">Parking facility</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                                        <span className="text-sm">Swimming Pool</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">4 Resorts in Around me</h2>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">Map View</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showMapView}
                                    onChange={() => setShowMapView(!showMapView)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border-gray-200 bg-white rounded-lg text-sm px-3 py-2"
                            >
                                <option value="popularity">Popularity</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                                <div className="md:w-2/5 flex">
                                    <div className="w-2/3">
                                        <img
                                            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop"
                                            alt="Hotel"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-1/3 flex flex-col">
                                        <img
                                            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200&h=150&fit=crop"
                                            alt="Room"
                                            className="h-1/2 object-cover"
                                        />
                                        <img
                                            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=150&fit=crop"
                                            alt="Amenity"
                                            className="h-1/2 object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded mb-2">
                                            🏢 {hotel.badge}
                                        </div>
                                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            {hotel.location}
                                            <span className="mx-2">•</span>
                                            <MapPin className="text-primary h-4 w-4 mr-1" />
                                            {hotel.distance}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">{hotel.rating} ★</span>
                                            <span className="text-sm">({hotel.reviews} Ratings) · {hotel.ratingText}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3 border-t border-gray-200 pt-3">
                                            {hotel.amenities.map((amenity, idx) => (
                                                <span key={idx} className="flex items-center">
                                                    {amenity === "Free Wifi" && <Wifi className="h-4 w-4 mr-1" />}
                                                    {amenity}
                                                </span>
                                            ))}
                                            <span>+ {hotel.moreAmenities} more</span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        <div>
                                            <p className="text-2xl font-bold">
                                                ₹{hotel.price} <span className="text-base text-gray-400 line-through">₹{hotel.originalPrice}</span> <span className="text-lg text-secondary font-bold">{hotel.discount}% off</span>
                                            </p>
                                            <p className="text-xs text-gray-500">+ ₹{hotel.taxes} taxes & fees</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={`/hotels/${hotel.id}`}>
                                                <Button variant="outline" className="px-6 py-2 border-primary text-primary hover:bg-primary hover:text-white">View Details</Button>
                                            </Link>
                                            <Link href={`/booking/${hotel.id}`}>
                                                <Button className="px-6 py-2 bg-primary text-white hover:bg-blue-700">Book Now</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
