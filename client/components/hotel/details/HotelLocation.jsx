"use client"

export default function HotelLocation({ location, coordinates }) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>

            {/* Map Placeholder - Can be replaced with Google Maps or Mapbox */}
            <div className="w-full h-[300px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden relative">
                {/* Simple Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{location}</p>
                        {coordinates && (
                            <p className="text-xs text-gray-500 mt-1">
                                {coordinates.lat}, {coordinates.lng}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-600 mt-3">
                📍 {location}
            </p>
        </section>
    )
}
