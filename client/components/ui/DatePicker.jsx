"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from "date-fns"

export default function DatePicker({ checkIn, checkOut, onDateChange, onClose, insidePanel = false }) {
    const [currentMonth, setCurrentMonth] = useState(checkIn || new Date())
    const [selectedCheckIn, setSelectedCheckIn] = useState(checkIn)
    const [selectedCheckOut, setSelectedCheckOut] = useState(checkOut)
    const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false)
    const calendarRef = useRef(null)

    const today = startOfDay(new Date())

    useEffect(() => {
        if (insidePanel) return // Skip outside click when inside panel

        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose, insidePanel])

    // Position calendar to prevent overflow
    useEffect(() => {
        if (!calendarRef.current || insidePanel) return

        const calendar = calendarRef.current
        
        // On mobile, use fixed positioning
        if (window.innerWidth < 640) {
            return // Fixed positioning handles it
        }

        const rect = calendar.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Reset styles first
        calendar.style.left = '0'
        calendar.style.right = 'auto'
        calendar.style.top = '100%'
        calendar.style.bottom = 'auto'
        calendar.style.marginTop = '1rem'
        calendar.style.marginBottom = '0'

        // Get updated rect after reset
        const updatedRect = calendar.getBoundingClientRect()

        // Check if calendar goes off right edge
        if (updatedRect.right > viewportWidth - 20) {
            calendar.style.left = 'auto'
            calendar.style.right = '0'
        }

        // Check if calendar goes off bottom edge
        if (updatedRect.bottom > viewportHeight - 20) {
            calendar.style.top = 'auto'
            calendar.style.bottom = '100%'
            calendar.style.marginBottom = '1rem'
            calendar.style.marginTop = '0'
        }
    }, [insidePanel, isSelectingCheckOut])

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const nextMonth = addMonths(currentMonth, 1)
    const nextMonthStart = startOfMonth(nextMonth)
    const nextMonthEnd = endOfMonth(nextMonth)
    const daysInNextMonth = eachDayOfInterval({ start: nextMonthStart, end: nextMonthEnd })

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const handleDateClick = (date) => {
        const normalizedDate = startOfDay(date)

        if (isBefore(normalizedDate, today)) {
            return // Don't allow selecting past dates
        }

        if (!isSelectingCheckOut) {
            // Selecting check-in date
            setSelectedCheckIn(normalizedDate)
            setSelectedCheckOut(null)
            setIsSelectingCheckOut(true)
        } else {
            // Selecting check-out date
            if (isBefore(normalizedDate, selectedCheckIn) || isSameDay(normalizedDate, selectedCheckIn)) {
                // If selected date is before or same as check-in, reset and start over
                setSelectedCheckIn(normalizedDate)
                setSelectedCheckOut(null)
            } else {
                setSelectedCheckOut(normalizedDate)
                // Call the callback with both dates
                onDateChange(selectedCheckIn, normalizedDate)
                setIsSelectingCheckOut(false)
            }
        }
    }

    const isInRange = (date) => {
        if (!selectedCheckIn || !selectedCheckOut) return false
        return isAfter(date, selectedCheckIn) && isBefore(date, selectedCheckOut)
    }

    const renderCalendar = (month, days, monthStart) => {
        const firstDayOfWeek = monthStart.getDay()
        const emptyCells = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null)

        return (
            <div className="flex-1 min-w-[280px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">{format(month, "MMMM yyyy")}</h3>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                    {emptyCells.map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}
                    {days.map((date) => {
                        const isCheckIn = selectedCheckIn && isSameDay(date, selectedCheckIn)
                        const isCheckOut = selectedCheckOut && isSameDay(date, selectedCheckOut)
                        const inRange = isInRange(date)
                        const isPast = isBefore(date, today)
                        const isToday = isSameDay(date, today)

                        return (
                            <button
                                key={date.toString()}
                                type="button"
                                onClick={() => handleDateClick(date)}
                                disabled={isPast}
                                className={`
                                    aspect-square rounded-lg text-sm font-medium transition-colors
                                    ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                                    ${isToday && !isCheckIn && !isCheckOut ? "border-2 border-[#1ab64f]" : ""}
                                    ${isCheckIn || isCheckOut ? "bg-[#1ab64f] text-white font-bold" : ""}
                                    ${inRange ? "bg-green-100" : ""}
                                    ${!isCheckIn && !isCheckOut && !isPast ? "hover:bg-gray-100" : ""}
                                `}
                            >
                                {format(date, "d")}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={calendarRef}
            className={insidePanel
                ? "bg-white rounded-lg p-6"
                : "fixed sm:absolute top-20 sm:top-full left-4 right-4 sm:left-0 sm:right-auto mt-0 sm:mt-4 bg-white rounded-lg shadow-2xl p-4 sm:p-6 z-[9999] border border-gray-200 w-auto sm:w-auto sm:min-w-[620px] max-h-[calc(100vh-6rem)] overflow-y-auto"
            }
        >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-6">
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-sm text-gray-600 font-medium">
                    {isSelectingCheckOut ? (
                        <span>Select check-out date</span>
                    ) : (
                        <span>Select check-in date</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    {!insidePanel && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close calendar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Calendars */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto">
                {renderCalendar(currentMonth, daysInMonth, monthStart)}
                <div className="hidden sm:block">
                    {renderCalendar(nextMonth, daysInNextMonth, nextMonthStart)}
                </div>
            </div>

            {/* Selected dates display */}
            {selectedCheckIn && !selectedCheckOut && (
                <div className="mt-4 text-sm text-gray-600 text-center font-medium">
                    Check-in: <span className="font-bold text-[#1ab64f]">{format(selectedCheckIn, "EEE, dd MMM")}</span>
                </div>
            )}
            {selectedCheckIn && selectedCheckOut && (
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600 font-medium">
                    <div>
                        Check-in: <span className="font-bold text-[#1ab64f]">{format(selectedCheckIn, "EEE, dd MMM")}</span>
                    </div>
                    <span>→</span>
                    <div>
                        Check-out: <span className="font-bold text-[#1ab64f]">{format(selectedCheckOut, "EEE, dd MMM")}</span>
                    </div>
                </div>
            )}
        </div>
    )
}