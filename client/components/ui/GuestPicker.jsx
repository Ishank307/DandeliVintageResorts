"use client"

import { useState, useEffect, useRef } from "react"
import { Minus, Plus, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function GuestPicker({ guests, onGuestsChange, onClose, insidePanel = false }) {
    const [guestCount, setGuestCount] = useState(guests || 2)
    const pickerRef = useRef(null)

    useEffect(() => {
        if (insidePanel) return

        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose, insidePanel])

    useEffect(() => {
        setGuestCount(guests || 2)
    }, [guests])

    const updateGuests = (delta) => {
        const newCount = guestCount + delta
        if (newCount >= 1 && newCount <= 20) {
            setGuestCount(newCount)
        }
    }

    const handleApply = () => {
        onGuestsChange(guestCount)
        onClose()
    }

    return (
        <div
            ref={pickerRef}
            className={insidePanel
                ? "bg-white rounded-xl overflow-hidden w-full"
                : "absolute top-full right-0 mt-2 bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 z-50 w-[300px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            }
        >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Select Guests
                </h3>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center py-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-3">
                        <Users className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                        {guestCount}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Total Guests</div>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button
                        type="button"
                        onClick={() => updateGuests(-1)}
                        disabled={guestCount <= 1}
                        className="h-12 w-12 rounded-full border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                    >
                        <Minus className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
                    </button>

                    <button
                        type="button"
                        onClick={() => updateGuests(1)}
                        disabled={guestCount >= 20}
                        className="h-12 w-12 rounded-full border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                    >
                        <Plus className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-3 flex items-center justify-end">
                <Button
                    type="button"
                    onClick={handleApply}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                >
                    Apply
                </Button>
            </div>
        </div>
    )
}
