import { Wifi, Tv, Coffee, Utensils, Waves, Dumbbell, Plane, WashingMachine } from "lucide-react"

const amenityIcons = {
    "Wi-Fi": Wifi,
    "Swimming Pool": Waves,
    "Breakfast Buffet": Utensils,
    "Smart TV": Tv,
    "Spa": Dumbbell,
    "Airport Pickup": Plane,
    "Beach": Waves,
    "Laundry Service": WashingMachine,
}

export default function HotelAmenities({ amenities }) {
     const amenitiesArray =
        typeof amenities === "string"
            ? amenities.split(",").map(a => a.trim())
            : []

    if (amenitiesArray.length === 0) return null
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesArray.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Coffee
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Icon className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">{amenity}</span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
