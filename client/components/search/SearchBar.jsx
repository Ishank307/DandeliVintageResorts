"use client"

import { Button } from "@/components/ui/Button"
import DatePicker from "@/components/ui/DatePicker"
import RoomGuestPicker from "@/components/ui/RoomGuestPicker"
import LocationPopover from "@/components/search/LocationPopover"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"

import { useSearchParams } from "next/navigation"
import { parseISO } from "date-fns"


export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
        // Popover states
        const [showLocation, setShowLocation] = useState(false)
        const [showDates, setShowDates] = useState(false)
        const [showGuests, setShowGuests] = useState(false)
    const [location, setLocation] = useState(
    searchParams.get("location") || "Dandeli, Karnataka, India"
    )

    const [checkInDate, setCheckInDate] = useState(
    searchParams.get("check_in")
        ? parseISO(searchParams.get("check_in"))
        : new Date()
    )

    const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get("check_out")
        ? parseISO(searchParams.get("check_out"))
        : addDays(new Date(), 1)
    )

    const [rooms, setRooms] = useState([
    { guests: Number(searchParams.get("guests")) || 2 },
    ])

    const handleSearch = (e) => {
        e.preventDefault()

        if (!location || !checkInDate || !checkOutDate || totalGuests < 1) {
            return
        }

        router.push(
            `/search?location=${encodeURIComponent(location)}&check_in=${format(checkInDate, "yyyy-MM-dd")}&check_out=${format(checkOutDate, "yyyy-MM-dd")}&guests=${totalGuests}`
        )
    }


    const handleDateChange = (checkIn, checkOut) => {
        setCheckInDate(checkIn)
        setCheckOutDate(checkOut)
        setShowDates(false)
    }

    const handleRoomsChange = (newRooms) => {
        setRooms(newRooms)
        setShowGuests(false)
    }

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation)
        setShowLocation(false)
    }

    const formattedDates =
        checkInDate && checkOutDate
            ? `${format(checkInDate, "MMM dd")} - ${format(checkOutDate, "MMM dd")}`
            : "Add dates"

    const totalGuests = rooms.reduce((sum, room) => sum + room.guests, 0)
    const formattedRoomsGuests = `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`

    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row bg-white rounded-lg md:rounded-full shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
        >
            {/* Where */}
            <div
                className="flex-[2] flex flex-col justify-center px-4 sm:px-6 py-3 
                border-b md:border-b-0 md:border-r border-gray-200 relative 
                hover:bg-gray-50 transition-colors cursor-pointer 
                rounded-t-lg md:rounded-l-full md:rounded-tr-none"
                onClick={() => {
                    setShowLocation(!showLocation)
                    setShowDates(false)
                    setShowGuests(false)
                }}
            >
                <label className="text-xs font-semibold text-gray-900 mb-0.5">Where</label>
                <div className="text-sm text-gray-600 truncate">{location}</div>

                {showLocation && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <LocationPopover
                            value={location}
                            onChange={handleLocationChange}
                            onClose={() => setShowLocation(false)}
                        />
                    </div>
                )}
            </div>

            {/* When */}
            <div
                className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-3 
                border-b md:border-b-0 md:border-r border-gray-200 relative 
                hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                    setShowDates(!showDates)
                    setShowLocation(false)
                    setShowGuests(false)
                }}
            >
                <label className="text-xs font-semibold text-gray-900 mb-0.5">When</label>
                <div className="text-sm text-gray-600">{formattedDates}</div>

                {showDates && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <DatePicker
                            checkIn={checkInDate}
                            checkOut={checkOutDate}
                            onDateChange={handleDateChange}
                            onClose={() => setShowDates(false)}
                        />
                    </div>
                )}
            </div>

            {/* Who */}
            <div
                className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-3 
                border-b md:border-b-0 border-gray-200 relative 
                hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                    setShowGuests(!showGuests)
                    setShowLocation(false)
                    setShowDates(false)
                }}
            >
                <label className="text-xs font-semibold text-gray-900 mb-0.5">Who</label>
                <div className="text-sm text-gray-600">{formattedRoomsGuests}</div>

                {showGuests && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <RoomGuestPicker
                            rooms={rooms}
                            onRoomsChange={handleRoomsChange}
                            onClose={() => setShowGuests(false)}
                        />
                    </div>
                )}
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-center md:justify-start px-4 py-3 md:pr-2 md:py-2 rounded-b-lg md:rounded-none">
                <Button
                    type="submit"
                    className="w-full md:w-12 h-12 rounded-lg md:rounded-full bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <Search className="h-5 w-5" />
                    <span className="md:hidden">Search</span>
                </Button>
            </div>
        </form>
    )
}