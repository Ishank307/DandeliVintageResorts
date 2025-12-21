"use client"

export default function HotelLocation({ location, coordinates }) {
    const hasCoords = coordinates?.lat && coordinates?.lng

    const mapUrl = hasCoords
        ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`
        : null

    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>

            <div className="w-full h-[300px] rounded-xl overflow-hidden border">
                {hasCoords ? (
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-[120px] rounded-lg border bg-gray-50 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>📍</span>
                        <span>{location}</span>
                    </div>
                </div>


                )}
            </div>

            {/* <div className="mt-3 space-y-1">
                <p className="text-sm text-gray-600">📍 {location}</p>

                {hasCoords && (
                    <a
                        href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Open in Google Maps →
                    </a>
                )}
            </div> */}
        </section>
    )
}
