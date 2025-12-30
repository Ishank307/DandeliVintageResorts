// app/(dashboard)/layout.jsx - UPDATE THE LOGOUT BUTTON

"use client"

import Link from "next/link"
import Header from "@/components/layout/BookingHeader"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { User, Calendar, Settings, LogOut ,ChevronLeft} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }) {
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
                        <Link href="/">
                            <Button variant="ghost" className="w-full justify-start">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                 go back
                            </Button>
                        </Link>
                        <Link href="/profile">
                            <Button variant="ghost" className="w-full justify-start">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                        </Link>
                        <Link href="/bookings">
                            <Button variant="ghost" className="w-full justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                My Bookings
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}