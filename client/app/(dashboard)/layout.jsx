import Link from "next/link"
import Header from "@/components/layout/BookingHeader"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { User, Calendar, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
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
                        <Link href="/settings">
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
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
