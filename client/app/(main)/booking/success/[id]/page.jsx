"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, Home, FileText } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function BookingSuccess({ params }) {
    const router = useRouter()
    const [isAnimated, setIsAnimated] = useState(false)
    // just did this
    // Unwrap params Promise for Next.js 15+
    const { id: bookingId } = use(params)

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setIsAnimated(true), 100)
    }, [])
    //trigger animation after component mounts .
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className={`max-w-2xl w-full transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Animated Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`w-24 h-24 bg-green-100 rounded-full flex items-center justify-center transition-transform duration-500 ${isAnimated ? 'scale-100' : 'scale-0'}`}>
                            <CheckCircle className="h-14 w-14 text-green-600 animate-pulse" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        🎉 Booking Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your reservation has been successfully confirmed. Get ready for an amazing experience!
                    </p>

                    {/* Booking ID Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-blue-100">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Booking Reference
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 tracking-wider">
                            #{bookingId}
                        </p>
                    </div>

                    {/* Info Message */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-8 text-left">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">📧 Confirmation email sent!</span>
                            <br />
                            We've sent your booking details and receipt to your email address.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Link href="/bookings" className="block">
                            <Button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">
                                <Calendar className="h-6 w-6" />
                                Go to My Bookings
                            </Button>
                        </Link>

                        <Link href="/search" className="block">
                            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                                <Home className="h-6 w-6" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Footer Message */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help? Contact us at{" "}
                            <a href="tel:1234567890" className="text-[#0066FF] font-semibold hover:underline">
                                123-456-7890
                            </a>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="text-center mt-6 text-gray-400 text-sm">
                    Thank you for choosing us! 🏖️ Have an amazing trip!
                </div>
            </div>
        </div>
    )
}
