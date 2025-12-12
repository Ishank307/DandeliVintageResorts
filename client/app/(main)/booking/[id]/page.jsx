import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { ChevronLeft, Calendar, Smartphone } from "lucide-react"

export default function BookingPage({ params }) {
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <Link href="/search" className="flex items-center text-red-500 font-medium mb-6 hover:underline">
                    <ChevronLeft className="h-5 w-5" /> Modify your booking
                </Link>

                {/* Savings Banner */}
                <div className="bg-orange-50 border border-orange-100 text-orange-500 p-3 rounded mb-6 flex items-center gap-2 text-sm font-medium">
                    <span>🎉</span> Yay! you just saved ₹7502 on this booking!
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Form */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        <Card className="border-none shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center font-bold text-sm">1</div>
                                    <h2 className="text-xl font-bold">Enter your details</h2>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 ml-9">We will use these details to share your booking information</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-9">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Full Name</label>
                                        <Input placeholder="Enter first and last name" className="bg-gray-50 border-gray-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Email Address</label>
                                        <Input type="email" placeholder="name@abc.com" className="bg-gray-50 border-gray-200" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold">Mobile Number</label>
                                        <div className="flex gap-4">
                                            <div className="w-24">
                                                <Input value="+91" readOnly className="bg-gray-50 border-gray-200 text-center" />
                                            </div>
                                            <Input placeholder="e.g. 1234567890" className="flex-1 bg-gray-50 border-gray-200" />
                                            <Button className="bg-gray-200 text-gray-400 hover:bg-gray-300 font-bold px-8" disabled>Send passcode</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side - Summary */}
                    <div className="w-full lg:w-1/3">
                        <Card className="border-none shadow-sm sticky top-24">
                            <div className="p-6">
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg leading-tight mb-2">Townhouse Oak Dharwad New Bus Terminal Formerly Hotel Aditya Inn</h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-[#4caf50] text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">4.8 <span className="text-[10px]">★</span></span>
                                            <span className="text-xs text-gray-500">(2 Ratings) · Excellent</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-800">1 Night</p>
                                    </div>
                                    <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden shrink-0">
                                        {/* Image placeholder */}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm font-bold text-gray-700 py-4 border-t border-b border-dashed">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        Fri, 12 Dec - Sat, 13 Dec
                                    </div>
                                    <div>2 Rooms, 4 Guests</div>
                                </div>

                                <div className="py-4 space-y-3 text-sm">
                                    <div className="flex items-center gap-2 font-bold text-gray-700">
                                        <Smartphone className="h-4 w-4 text-gray-400" /> Classic
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Room price for 1 Night X 4 Guests</span>
                                        <span className="font-bold text-black">₹17860</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Instant discount</span>
                                        <span className="font-bold text-black">-₹5357</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>60% Coupon Discount</span>
                                        <span className="font-bold text-black">-₹7502</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-dashed mt-2">
                                        <span className="font-bold text-gray-700">Payable Amount</span>
                                        <span className="text-2xl font-bold text-black">₹5001</span>
                                    </div>
                                </div>

                                <div className="mt-4 bg-red-50 text-red-500 text-xs font-bold p-3 rounded flex items-center justify-center gap-2">
                                    <span>⚡</span> 12 people booked this hotel today
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
