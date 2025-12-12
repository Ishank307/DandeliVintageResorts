"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
        const emptyCells = Array(firstDayOfWeek).fill(null)

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
                                    ${isToday && !isCheckIn && !isCheckOut ? "border border-[#1ab64f]" : ""}
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
                : "absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl p-6 z-50 border border-gray-200"
            }
        >
            <div className={`flex items-center justify-between ${insidePanel ? 'mb-6' : 'mb-6'}`}>
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
            <div className="flex gap-6">
                {renderCalendar(currentMonth, daysInMonth, monthStart)}
                {renderCalendar(nextMonth, daysInNextMonth, nextMonthStart)}
            </div>
            {selectedCheckIn && !selectedCheckOut && (
                <div className="mt-4 text-sm text-gray-600 text-center font-medium">
                    Check-in: <span className="font-bold">{format(selectedCheckIn, "EEE, dd MMM")}</span>
                </div>
            )}
        </div>
    )
}
