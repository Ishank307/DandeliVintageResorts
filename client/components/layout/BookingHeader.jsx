import Link from "next/link"

export default function BookingHeader() {
    return (
        <header className="w-full bg-white border-b">
            <div className="container mx-auto px-4 h-16 flex items-center">
                {/* Logo Only */}
                <Link href="/" className="flex items-center">
                    <span className="text-4xl font-extrabold text-primary tracking-tighter">Rivaan</span>
                </Link>
            </div>
        </header>
    )
}
