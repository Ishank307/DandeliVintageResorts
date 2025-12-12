import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Star, MapPin, Wifi, Zap, Coffee } from "lucide-react"

export default function HotelCard({ id, name, location, rating, price, originalPrice, discount }) {
    return (
        <Card className="overflow-hidden flex flex-col md:flex-row h-full md:h-[280px] border rounded-none hover:shadow-lg transition-shadow">
            {/* Image Section */}
            <img src="https://images.oyoroomscdn.com/uploads/hotel_image/304846/large/xhteuluuvlny.jpg">
            
            </img>
            <div className="relative w-full md:w-[35%] h-48 md:h-full bg-gray-200 shrink-0">
                <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 rounded-sm z-10">
                    Company-Serviced
                </div>
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-300">
                    Hotel Image
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-4 justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{name}</h3>
                    </div>

                    <p className="text-sm text-gray-500 mt-1 truncate">{location}</p>

                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center bg-[#4caf50] text-white px-1.5 py-0.5 rounded text-xs font-bold gap-1">
                            {rating} <Star className="h-3 w-3 fill-current" />
                        </div>
                        <span className="text-xs text-gray-500">(2 Ratings) · Excellent</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1"><div className="w-4 h-4 border rounded-sm flex items-center justify-center">E</div> Elevator</div>
                        <div className="flex items-center gap-1"><Wifi className="h-3 w-3" /> Free Wifi</div>
                        <div className="flex items-center gap-1"><Zap className="h-3 w-3" /> Geyser</div>
                        <Link href={`/hotels/${id}`}>
                            <span className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer hover:underline">+ 4 more</span>
                        </Link>
                    </div>

                    <div className="mt-3">
                        <span className="text-[10px] font-bold border border-gray-300 px-1 py-0.5 rounded text-gray-600 uppercase">WIZARD MEMBER</span>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-4 md:mt-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-black">₹{price}</span>
                            <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                            <span className="text-sm text-orange-500 font-bold">{discount}% off</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">+ ₹290 taxes & fees · per room per night</p>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/hotels/${id}`}>
                            <Button variant="outline" className="h-10 px-6 font-bold text-black border-black hover:bg-gray-50 rounded-sm">View Details</Button>
                        </Link>
                        <Link href={`/booking/${id}`}>
                            <Button className="h-10 px-8 bg-[#1ab64f] hover:bg-[#17a346] text-white font-bold rounded-sm">Book Now</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    )
}
