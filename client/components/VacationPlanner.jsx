"use client"

import Image from "next/image"

export default function VacationPlanner() {
    // Resort images from public folder
    const column1Images = [
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.19 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.21 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.23 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.25 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.27 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.28 PM (1).jpeg"),
    ]

    const column2Images = [
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.20 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.22 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.24 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.26 PM.jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.27 PM (2).jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.28 PM.jpeg"),
    ]

    const column3Images = [
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.20 PM (1).jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.21 PM (1).jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.22 PM (1).jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.24 PM (1).jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.26 PM (1).jpeg"),
        encodeURI("/WhatsApp Image 2025-12-04 at 9.47.27 PM (1).jpeg"),
    ]

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        Plan Your Vacations
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Discover something anything anywhere I'm ready
                    </p>
                </div>

                {/* Three Column Animated Grid */}
                <div className="relative max-w-7xl mx-auto h-[600px] overflow-hidden">
                    {/* Top Blur Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                    {/* Bottom Blur Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                    <div className="grid grid-cols-3 gap-4 md:gap-6 h-full">
                        {/* Column 1 - Scroll Up */}
                        <div className="flex flex-col gap-4 md:gap-6 animate-scroll-up">
                            {[...column1Images, ...column1Images].map((img, idx) => (
                                <div key={idx} className="relative h-64 md:h-80 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                                    <Image
                                        src={img}
                                        alt={`Resort ${idx + 1}`}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Column 2 - Scroll Down */}
                        <div className="flex flex-col gap-4 md:gap-6 animate-scroll-down">
                            {[...column2Images, ...column2Images].map((img, idx) => (
                                <div key={idx} className="relative h-64 md:h-80 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                                    <Image
                                        src={img}
                                        alt={`Resort ${idx + 1}`}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Column 3 - Scroll Up */}
                        <div className="flex flex-col gap-4 md:gap-6 animate-scroll-up">
                            {[...column3Images, ...column3Images].map((img, idx) => (
                                <div key={idx} className="relative h-64 md:h-80 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                                    <Image
                                        src={img}
                                        alt={`Resort ${idx + 1}`}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
