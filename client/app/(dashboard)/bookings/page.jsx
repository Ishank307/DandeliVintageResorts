"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { MapPin, Calendar, Loader2, Users, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserBookings } from "@/lib/api"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function BookingsPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        // Check if we have a token in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        
        if (!token) {
            router.push("/login")
            return
        }

        // Fetch user bookings
        const fetchBookings = async () => {
            try {
                const data = await getUserBookings()
                setBookings(data)
            } catch (err) {
                // If error is 401, redirect to login
                if (err.message.includes('401') || err.message.includes('Session expired')) {
                    router.push("/login")
                } else {
                    setError(err.message || "Failed to load bookings")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [router])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "completed":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <Link href="/explore">
                    <Button variant="outline">Book New Stay</Button>
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {bookings.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
                        <Link href="/search">
                            <Button>Explore Hotels</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const checkInDate = new Date(booking.check_in)
                        const checkOutDate = new Date(booking.check_out)
                        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))

                        // Calculate total amount from rooms
                        const totalAmount = booking.rooms.reduce((sum, room) => {
                            return sum + (parseFloat(room.price_per_night) * nights)
                        }, 0)

                        return (
                            <Card key={booking.booking_id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        {/* Left side - Booking info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">
                                                        {booking.resort_name || "Vintage Resort"}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span>Resort Booking</span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-700">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="font-medium">
                                                        {format(checkInDate, "MMM dd, yyyy")} - {format(checkOutDate, "MMM dd, yyyy")}
                                                    </span>
                                                    <span className="ml-2 text-gray-500">({nights} night{nights > 1 ? "s" : ""})</span>
                                                </div>

                                                <div className="flex items-center text-gray-700">
                                                    <Home className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span>{booking.rooms?.length || 0} Room{booking.rooms?.length > 1 ? "s" : ""}</span>
                                                </div>

                                                <div className="text-xs text-gray-500 mt-2">
                                                    Booking ID: #{booking.booking_id}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Price and action */}
                                        <div className="flex flex-col justify-between items-end min-w-[140px]">
<div className="text-right mb-4">
  {booking.payment_type === "partial" ? (
    <>
      <p className="text-sm text-gray-500">Amount paid</p>
      <p className="text-xl font-bold text-green-700">
        ₹{booking.payment.amount.toFixed(0)}
      </p>

      <p className="text-xs text-gray-500 mt-1">Remaining amount</p>
      <p className="text-sm font-semibold text-orange-600">
        ₹{(totalAmount - booking.payment.amount).toFixed(0)}
      </p>
    </>
  ) : (
    <>
      <p className="text-sm text-gray-500">Total paid</p>
      <p className="text-2xl font-bold text-gray-900">
        ₹{totalAmount.toFixed(0)}
      </p>
    </>
  )}

  <p
    className={`text-xs mt-1 font-medium ${
      booking.payment_status === "success"
        ? "text-green-600"
        : "text-yellow-600"
    }`}
  >
    Payment: {booking.payment_status}
  </p>
</div>

                                                

                                            <Link href={`/bookings/${booking.booking_id}`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}