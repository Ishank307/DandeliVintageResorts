"use client"

import SearchBar from "@/components/search/SearchBar"
import HotelCard from "@/components/hotel/HotelCard"
import { Button } from "@/components/ui/Button"
import Reviews from "@/components/Reviews"
import VacationPlanner from "@/components/VacationPlanner"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-50 text-slate-900 pt-8 md:pt-16 pb-12 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-slate-900 px-2">
            Discover Your Perfect Getaway - Luxury Resorts Worldwide
          </h1>
          <div className="w-full max-w-6xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="py-8 md:py-16 container mx-auto px-4">
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden bg-gray-900">
          {/* Resort Image on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Resort"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 h-full flex items-center px-6 sm:px-8 md:px-12">
            <div className="text-white max-w-md">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4">Book now &</h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8">get 20% off</h2>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-md">
                Book now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Peaceful Getaway Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Your peaceful getaway is here
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <p className="text-lg sm:text-xl text-gray-500 md:max-w-md">
              discover something anything<br />anywher im ready
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-md flex items-center gap-2">
              Explore →
            </Button>
          </div>
        </div>
      </section>



      {/* Map/Location Section (Placeholder) */}
      <section className="py-8 container mx-auto px-4">
        <div className="bg-gray-100 h-10 rounded"></div>
      </section>

      {/* Vacation Planner Section */}
      <VacationPlanner />

      {/* Customer Reviews Section */}
      <Reviews />
    </div>
  )
}
