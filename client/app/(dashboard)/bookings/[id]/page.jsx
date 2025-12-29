"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getBookingDetail } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
    ArrowLeft, 
    Calendar, 
    MapPin, 
    Users, 
    Home, 
    CreditCard, 
    CheckCircle, 
    Clock,
    XCircle,
    Loader2,
    Bed
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function BookingDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        
        if (!token) {
            router.push("/login")
            return
        }

        const fetchBooking = async () => {
            try {
                setLoading(true)
                const data = await getBookingDetail(id)
                setBooking(data)
            } catch (err) {
                if (err.message.includes('401') || err.message.includes('Session expired')) {
                    router.push("/login")
                } else {
                    setError(err.message || "Failed to load booking details")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBooking()
    }, [id, router])

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-600" />
            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-600" />
            default:
                return <Clock className="h-5 w-5 text-gray-600" />
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800 border-green-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <Card className="border-red-200">
                    <CardContent className="p-12 text-center">
                        <XCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-red-700">Error</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link href="/bookings">
                            <Button variant="outline">Back to Bookings</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!booking) return null

    const checkInDate = new Date(booking.check_in_date)
    const checkOutDate = new Date(booking.check_out_date)
const totalAmount = booking.total_price
const amountPaid = booking.payment?.amount || 0
const isPartial = booking.payment?.payment_type.toLowerCase() === "partial"
const remainingAmount = Math.max(totalAmount - amountPaid, 0)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/bookings">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Bookings
                        </Button>
                    </Link>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
                            <p className="text-gray-600">Booking ID: #{booking.booking_id}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(booking.booking_status)}`}>
                            {getStatusIcon(booking.booking_status)}
                            <span className="font-semibold">{booking.booking_status}</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Resort Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="h-5 w-5" />
                                Resort Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h3 className="text-xl font-bold">{booking.resort.name}</h3>
                                <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{booking.resort.location}</span>
                                </div>
                            </div>
                            {booking.resort.description && (
                                <p className="text-sm text-gray-600 mt-2">{booking.resort.description}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stay Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Stay Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Check-in</p>
                                    <p className="font-semibold">{format(checkInDate, "EEE, MMM dd, yyyy")}</p>
                                    <p className="text-xs text-gray-500 mt-1">After 2:00 PM</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Check-out</p>
                                    <p className="font-semibold">{format(checkOutDate, "EEE, MMM dd, yyyy")}</p>
                                    <p className="text-xs text-gray-500 mt-1">Before 11:00 AM</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                                    <p className="font-semibold">{booking.nights} Night{booking.nights > 1 ? "s" : ""}</p>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Users className="h-3 w-3 mr-1" />
                                        {booking.number_of_guests} Guest{booking.number_of_guests > 1 ? "s" : ""}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rooms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bed className="h-5 w-5" />
                                Room Details ({booking.rooms.length} Room{booking.rooms.length > 1 ? "s" : ""})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {booking.rooms.map((room) => (
                                    <div key={room.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        {room.images?.[0] ? (
                                            <img 
                                                src={room.images[0]} 
                                                alt={`Room ${room.room_number}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Bed className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{room.room_type}</h4>
                                            <p className="text-sm text-gray-600">Room {room.room_number}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <p className="text-sm text-gray-500">
                                                    <Users className="h-3 w-3 inline mr-1" />
                                                    Capacity: {room.capacity}
                                                </p>
                                                <p className="text-sm font-semibold text-primary">
                                                    ₹{room.price_per_night} / night
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    {booking.payment && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-semibold ${
                                            booking.payment.status?.toLowerCase() === "success" ? "text-green-600" : "text-yellow-600"
                                        }`}>
                                            {booking.payment.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span className="font-medium">{booking.payment.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Payment Type</span>
                                        <span className="font-medium">{booking.payment.payment_type}</span>
                                    </div>
                                    {booking.payment.transaction_id && (
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Transaction ID</span>
                                            <span className="text-sm font-mono">{booking.payment.transaction_id}</span>
                                        </div>
                                    )}
                                    {booking.payment.paid_at && (
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Paid On</span>
                                            <span className="font-medium">
                                                {format(new Date(booking.payment.paid_at), "MMM dd, yyyy hh:mm a")}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Price Breakdown */}
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-semibold mb-3">Price Breakdown</h4>
                                        {booking.rooms.map((room, index) => (
                                            <div key={room.id} className="flex justify-between text-sm py-1">
                                                <span className="text-gray-600">
                                                    Room {room.room_number} × {booking.nights} night{booking.nights > 1 ? "s" : ""}
                                                </span>
                                                <span>₹{(room.price_per_night * booking.nights).toFixed(0)}</span>
                                            </div>
                                        ))}
                                        <div className="mt-4 space-y-2">
                                        {/* Amount Paid */}
                                        <div className="flex justify-between py-3 bg-green-50 -mx-6 px-6 rounded">
                                            <span className="font-semibold text-lg text-green-800">
                                            Amount Paid
                                            </span>
                                            <span className="font-bold text-2xl text-green-700">
                                            ₹{amountPaid.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Remaining Amount – only for partial */}
                                        {isPartial && (
                                            <div className="flex justify-between py-3 bg-orange-50 -mx-6 px-6 rounded">
                                            <span className="font-semibold text-lg text-orange-800">
                                                Remaining Amount
                                            </span>
                                            <span className="font-bold text-xl text-orange-700">
                                                ₹{remainingAmount.toLocaleString()}
                                            </span>
                                            </div>
                                        )}
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    )
}