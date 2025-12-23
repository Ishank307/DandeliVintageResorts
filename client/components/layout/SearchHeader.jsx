"use client"

import Link from "next/link"
import { Phone, User, LogOut, Calendar } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import SearchBar from "@/components/search/SearchBar"
import { Button } from "@/components/ui/Button"

export default function SearchHeader() {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const { user, isAuth, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        setProfileMenuOpen(false)
        router.push("/")
    }

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex flex-col items-start">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">Vintza</span>
                        <span className="text-xs text-gray-900">By Vintage Resorts</span>
                        <div className="h-0.5 w-full bg-yellow-500 mt-0.5"></div>
                    </Link>

                    {/* Search Bar - Same as Landing Page */}
                    <div className="flex-1 max-w-4xl mx-8 hidden lg:block">
                        <SearchBar />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        <a href="tel:+1234567890" className="hidden xl:flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-full text-sm">
                            <Phone className="h-4 w-4" />
                            <span>0124-6201611</span>
                        </a>

                        {/* Show Profile Menu if logged in, otherwise show Login button */}
                        {isAuth ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    <User className="h-5 w-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user?.name || user?.phone_number}
                                            </p>
                                        </div>
                                        <Link
                                            href="/bookings"
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <Calendar className="h-4 w-4" />
                                            <span>My Bookings</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                <User className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
