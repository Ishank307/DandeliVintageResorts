"use client"

import { usePathname } from "next/navigation"
import LandingHeader from "@/components/layout/LandingHeader"
import SearchHeader from "@/components/layout/SearchHeader"
import BookingHeader from "@/components/layout/BookingHeader"
import Footer from "@/components/layout/Footer"

export default function MainLayout({ children }) {
    const pathname = usePathname()

    // Determine which header to show based on route
    const isBookingPage = pathname?.startsWith('/booking')
    const isSearchOrHotelPageOrExplore = pathname?.startsWith('/search') || pathname?.startsWith('/hotels') || pathname?.startsWith('/explore')
    const isLandingPage = pathname === '/'

    return (
        <div className="flex min-h-screen flex-col">
            {isBookingPage && <BookingHeader />}
            {isSearchOrHotelPageOrExplore && <SearchHeader />}
            {isLandingPage && <LandingHeader />}
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
