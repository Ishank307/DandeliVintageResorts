import Link from "next/link"

export default function BookingHeader() {
    return (
        <header className="w-full bg-white border-b">
            <div className="container mx-auto px-4 h-16 flex items-center">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-start">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">Vintza</span>
                    <span className="text-xs text-gray-900">By Vintage Resorts</span>
                    <div className="h-0.5 w-full bg-yellow-500 mt-0.5"></div>
                </Link>
            </div>
        </header>
    )
}
