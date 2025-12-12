"use client"

import { useState, useEffect, useRef } from "react"
import { Minus, Plus, Users, Bed, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function RoomGuestPicker({ rooms, onRoomsChange, onClose, insidePanel = false }) {
    const [activeTab, setActiveTab] = useState("rooms")
    const [roomData, setRoomData] = useState(rooms)
    const pickerRef = useRef(null)

    useEffect(() => {
        if (insidePanel) return // Skip outside click when inside panel

        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose, insidePanel])

    const addRoom = () => {
        if (roomData.length < 5) { // Max 5 rooms
            setRoomData([...roomData, { guests: 1 }])
        }
    }

    const deleteRoom = (index) => {
        if (roomData.length > 1) { // Minimum 1 room
            const newRoomData = roomData.filter((_, i) => i !== index)
            setRoomData(newRoomData)
        }
    }

    const updateGuests = (index, delta) => {
        const newRoomData = [...roomData]
        const newGuestCount = newRoomData[index].guests + delta

        // Each room should have at least 1 guest and max 6 guests
        if (newGuestCount >= 1 && newGuestCount <= 6) {
            newRoomData[index].guests = newGuestCount
            setRoomData(newRoomData)
        }
    }

    const handleApply = () => {
        onRoomsChange(roomData)
        onClose()
    }

    const totalRooms = roomData.length
    const totalGuests = roomData.reduce((sum, room) => sum + room.guests, 0)

    return (
        <div
            ref={pickerRef}
            className={insidePanel
                ? "bg-white rounded-xl overflow-hidden w-full"
                : "absolute top-full right-0 mt-2 bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 z-50 w-[340px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            }
        >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Select Rooms & Guests
                </h3>
            </div>

            {/* Modern Tabs */}
            <div className="flex gap-2 p-3 bg-gray-50/50">
                <button
                    type="button"
                    onClick={() => setActiveTab("rooms")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === "rooms"
                        ? "bg-white text-emerald-600 shadow-md scale-[1.02]"
                        : "text-gray-600 hover:bg-white/50"
                        }`}
                >
                    <Bed className="h-3.5 w-3.5" />
                    Rooms
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("guests")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === "guests"
                        ? "bg-white text-emerald-600 shadow-md scale-[1.02]"
                        : "text-gray-600 hover:bg-white/50"
                        }`}
                >
                    <Users className="h-3.5 w-3.5" />
                    Guests
                </button>
            </div>

            {/* Content */}
            <div className="p-3 max-h-[340px] overflow-y-auto custom-scrollbar">
                {activeTab === "rooms" ? (
                    <div className="space-y-3">
                        {roomData.map((room, index) => (
                            <div
                                key={index}
                                className="group relative p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Bed className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-800 block">Room {index + 1}</span>
                                            <span className="text-xs text-gray-500">{room.guests} {room.guests === 1 ? 'guest' : 'guests'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-white rounded-full shadow-sm border border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => updateGuests(index, -1)}
                                                disabled={room.guests <= 1}
                                                className="h-6 w-6 rounded-full hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group/btn"
                                            >
                                                <Minus className="h-2.5 w-2.5 text-gray-600 group-hover/btn:text-emerald-600" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-bold text-gray-800">{room.guests}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateGuests(index, 1)}
                                                disabled={room.guests >= 6}
                                                className="h-6 w-6 rounded-full hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group/btn"
                                            >
                                                <Plus className="h-2.5 w-2.5 text-gray-600 group-hover/btn:text-emerald-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {roomData.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => deleteRoom(index)}
                                        className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        {roomData.length < 5 && (
                            <button
                                type="button"
                                onClick={addRoom}
                                className="w-full py-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-md border-2 border-dashed border-emerald-300 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                            >
                                + Add Another Room
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="text-center py-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-3">
                                <Users className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                                {totalGuests}
                            </div>
                            <div className="text-sm font-medium text-gray-600">Total Guests</div>
                        </div>
                        <div className="space-y-3">
                            {roomData.map((room, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Bed className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">Room {index + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white rounded-full shadow-sm border border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => updateGuests(index, -1)}
                                            disabled={room.guests <= 1}
                                            className="h-7 w-7 rounded-full hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                                        >
                                            <Minus className="h-3 w-3 text-gray-600 group-hover:text-emerald-600" />
                                        </button>
                                        <span className="w-6 text-center text-xs font-bold text-gray-800">{room.guests}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateGuests(index, 1)}
                                            disabled={room.guests >= 6}
                                            className="h-7 w-7 rounded-full hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                                        >
                                            <Plus className="h-3 w-3 text-gray-600 group-hover:text-emerald-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modern Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-3 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-medium">Your Selection</span>
                    <span className="text-xs font-bold text-gray-800">
                        {totalRooms} {totalRooms === 1 ? 'Room' : 'Rooms'} • {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                    </span>
                </div>
                <Button
                    type="button"
                    onClick={handleApply}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-6 py-2 text-xs rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                >
                    Apply
                </Button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #10b981, #14b8a6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #059669, #0d9488);
                }
            `}</style>
        </div>
    )
}
