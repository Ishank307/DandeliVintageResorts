"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/Input"

export default function LocationPopover({ value, onChange, onClose }) {
    const [searchText, setSearchText] = useState(value)
    const popoverRef = useRef(null)

    // Popular destinations
    const popularDestinations = [
        "Goa, India",
        "Mumbai, India",
        "Bangalore, India",
        "Delhi, India",
        "Jaipur, India",
        "Kerala, India"
    ]

    // Recent searches (mock data)
    const recentSearches = [
        "Hubli-Dharwad, Karnataka",
        "Goa Beach Resort"
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])

    const handleSelect = (destination) => {
        onChange(destination)
    }

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 z-50 w-[360px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search destinations"
                        className="pl-10 h-10 text-sm"
                        autoFocus
                    />
                </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Recent</div>
                    {recentSearches.map((search, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(search)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-900">{search}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Popular Destinations */}
            <div className="p-2 border-t border-gray-100">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Popular</div>
                {popularDestinations.map((destination, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(destination)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-gray-900">{destination}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
