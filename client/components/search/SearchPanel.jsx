"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, X, MapPin } from "lucide-react"
import { Input } from "@/components/ui/Input"
import DatePicker from "@/components/ui/DatePicker"
import RoomGuestPicker from "@/components/ui/RoomGuestPicker"
import { Button } from "@/components/ui/Button"

const STEPS = {
    location: { index: 0, title: "Where to?" },
    dates: { index: 1, title: "When's your trip?" },
    guests: { index: 2, title: "Who's coming?" }
}

export default function SearchPanel({
    mode,
    location,
    checkIn,
    checkOut,
    rooms,
    onLocationChange,
    onDateChange,
    onRoomsChange,
    onClose
}) {
    const [currentStep, setCurrentStep] = useState(STEPS[mode]?.index || 0)
    const panelRef = useRef(null)

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const goToStep = (stepIndex) => {
        setCurrentStep(stepIndex)
    }

    const handleDateChangeInternal = (newCheckIn, newCheckOut) => {
        onDateChange(newCheckIn, newCheckOut)
        // Auto-advance to guests step
        setCurrentStep(2)
    }

    const handleRoomsChangeInternal = (newRooms) => {
        onRoomsChange(newRooms)
        onClose()
    }

    const getCurrentStepTitle = () => {
        const stepKeys = Object.keys(STEPS)
        const stepKey = stepKeys.find(key => STEPS[key].index === currentStep)
        return STEPS[stepKey]?.title || ""
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 pt-20 px-4">
            <div
                ref={panelRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={goBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        )}
                        <h2 className="text-xl font-semibold">{getCurrentStepTitle()}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sliding Container */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentStep * 100}%)`,
                            width: '300%'
                        }}
                    >
                        {/* Step 1: Location */}
                        <div className="w-full p-6" style={{ width: 'calc(100% / 3)' }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search destinations
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            value={location}
                                            onChange={(e) => onLocationChange(e.target.value)}
                                            placeholder="Where are you going?"
                                            className="pl-10 h-12 text-base"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => goToStep(1)}
                                    className="w-full bg-primary hover:bg-primary/90 text-white h-12"
                                >
                                    Continue to Dates
                                </Button>
                            </div>
                        </div>

                        {/* Step 2: Dates */}
                        <div className="w-full p-6" style={{ width: 'calc(100% / 3)' }}>
                            <DatePicker
                                checkIn={checkIn}
                                checkOut={checkOut}
                                onDateChange={handleDateChangeInternal}
                                onClose={onClose}
                                insidePanel={true}
                            />
                        </div>

                        {/* Step 3: Guests */}
                        <div className="w-full p-6" style={{ width: 'calc(100% / 3)' }}>
                            <RoomGuestPicker
                                rooms={rooms}
                                onRoomsChange={handleRoomsChangeInternal}
                                onClose={onClose}
                                insidePanel={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
