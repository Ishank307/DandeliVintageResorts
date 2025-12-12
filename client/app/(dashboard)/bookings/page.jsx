"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { MapPin, Calendar, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserBookings } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function BookingsPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const { isAuth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuth) {
            router.push("/login")
            return
        }

        // Fetch user bookings
        const fetchBookings = async () => {
            try {
                const data = await getUserBookings()
                setBookings(data)
            } catch (err) {
                setError(err.message || "Failed to load bookings")
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [isAuth, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Bookings</h1>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {bookings.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-500 mb-4">You don't have any bookings yet</p>
                        <Link href="/search">
                            <Button>Browse Hotels</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const room = booking.room
                        const resort = room?.room_type?.resort

                        return (
                            <Card key={booking.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                Room {room?.room_number} - {room?.room_type?.name}
                                            </h3>
                                            <p className="text-muted-foreground flex items-center text-sm mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {resort?.name || "Vintage Resort"}
                                            </p>
                                            <div className="flex items-center gap-4 mt-4 text-sm">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                                    <span>{new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${booking.booking_status === "Confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.booking_status === "Pending"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {booking.booking_status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Guests: {booking.number_of_guests}
                                            </p>
                                        </div>

                                        <div className="flex flex-col justify-between items-end">
                                            <span className="font-bold text-lg">₹{booking.total_price}</span>
                                            <Link href={`/bookings/${booking.id}`}>
                                                <Button variant="outline" size="sm">View Details</Button>
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
