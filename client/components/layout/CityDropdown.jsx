"use client"

import { useState } from "react"
import Link from "next/link"

export default function CityDropdown({ city, localities }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="hover:text-primary transition-colors flex items-center text-sm">
                {city} <span className="ml-1 text-[10px]">∨</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] z-50 py-3 px-4">
                    <h4 className="font-bold mb-3 text-sm text-gray-800">Popular Localities in {city}</h4>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                        {localities.map((locality) => (
                            <Link
                                key={locality}
                                href={`/search?location=${encodeURIComponent(locality + ', ' + city)}`}
                                className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                                {locality}
                            </Link>
                        ))}
                    </div>
                    <Link
                        href={`/search?location=${encodeURIComponent(city)}`}
                        className="block mt-3 pt-3 border-t border-gray-200 text-sm text-red-500 font-medium hover:underline"
                    >
                        All of {city} →
                    </Link>
                </div>
            )}
        </div>
    )
}
