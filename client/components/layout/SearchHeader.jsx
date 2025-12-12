"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Phone, User, Search, MapPin, Calendar, Users } from "lucide-react"
import { useState } from "react"
import DatePicker from "@/components/ui/DatePicker"
import { format } from "date-fns"

export default function SearchHeader() {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showRoomPicker, setShowRoomPicker] = useState(false)
    const [checkIn, setCheckIn] = useState(new Date())
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000)) // +1 day
    const [rooms, setRooms] = useState(1)
    const [guests, setGuests] = useState(1)

    const handleDateChange = (newCheckIn, newCheckOut) => {
        setCheckIn(newCheckIn)
        setCheckOut(newCheckOut)
        setShowDatePicker(false)
    }

    const incrementRooms = () => setRooms(Math.min(rooms + 1, 10))
    const decrementRooms = () => setRooms(Math.max(rooms - 1, 1))
    const incrementGuests = () => setGuests(Math.min(guests + 1, 20))
    const decrementGuests = () => setGuests(Math.max(guests - 1, 1))

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex flex-col items-start">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">Arovan</span>
                        <span className="text-xs text-gray-900">By Vintage Resorts</span>
                        <div className="h-0.5 w-full bg-yellow-500 mt-0.5"></div>
                    </Link>

                    {/* Compact Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="flex items-center justify-center gap-2 bg-white rounded-full shadow-md border border-gray-200 px-2">
                            <button className="flex-1 flex items-center space-x-2 p-3 rounded-full hover:bg-gray-50 text-left">
                                <MapPin className="text-primary h-5 w-5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Near me</p>
                                    <p className="text-xs text-gray-500 truncate">Hubli-Dharwad</p>
                                </div>
                            </button>

                            <div className="h-8 w-px bg-gray-200"></div>

                            <div className="relative flex-1">
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="w-full flex items-center space-x-2 p-3 rounded-full hover:bg-gray-50 text-left"
                                >
                                    <Calendar className="text-gray-500 h-5 w-5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm truncate">
                                            {format(checkIn, "EEE, dd MMM")} - {format(checkOut, "EEE, dd MMM")}
                                        </p>
                                    </div>
                                </button>
                                {showDatePicker && (
                                    <DatePicker
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                        onDateChange={handleDateChange}
                                        onClose={() => setShowDatePicker(false)}
                                    />
                                )}
                            </div>

                            <div className="h-8 w-px bg-gray-200"></div>

                            <div className="relative flex-1">
                                <button
                                    onClick={() => setShowRoomPicker(!showRoomPicker)}
                                    className="w-full flex items-center space-x-2 p-3 rounded-full hover:bg-gray-50 text-left"
                                >
                                    <Users className="text-gray-500 h-5 w-5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm truncate">
                                            {rooms} Room{rooms > 1 ? 's' : ''}, {guests} Guest{guests > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </button>
                                {showRoomPicker && (
                                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl p-4 z-50 border border-gray-200 min-w-[200px]">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-2">Rooms</label>
                                                <div className="flex items-center space-x-3">
                                                    <button onClick={decrementRooms} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">-</button>
                                                    <span className="w-8 text-center font-medium">{rooms}</span>
                                                    <button onClick={incrementRooms} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">+</button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-2">Guests</label>
                                                <div className="flex items-center space-x-3">
                                                    <button onClick={decrementGuests} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">-</button>
                                                    <span className="w-8 text-center font-medium">{guests}</span>
                                                    <button onClick={incrementGuests} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">+</button>
                                                </div>
                                            </div>
                                            <Button onClick={() => setShowRoomPicker(false)} className="w-full bg-primary text-white">Done</Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="bg-primary text-white p-3 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        <a href="tel:+1234567890" className="hidden xl:flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-full text-sm">
                            <Phone className="h-4 w-4" />
                            <span>0124-6201611</span>
                        </a>
                        <Link href="/login" className="p-2 border border-gray-200 rounded-full">
                            <User className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
