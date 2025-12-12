import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/about" className="hover:text-white inline-block py-1">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white inline-block py-1">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-white inline-block py-1">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/help" className="hover:text-white inline-block py-1">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-white inline-block py-1">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-white inline-block py-1">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Destinations</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/hotels/bangalore" className="hover:text-white inline-block py-1">Bangalore</Link></li>
                            <li><Link href="/hotels/delhi" className="hover:text-white inline-block py-1">Delhi</Link></li>
                            <li><Link href="/hotels/mumbai" className="hover:text-white inline-block py-1">Mumbai</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Social</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white inline-block py-1">Facebook</a></li>
                            <li><a href="#" className="hover:text-white inline-block py-1">Twitter</a></li>
                            <li><a href="#" className="hover:text-white inline-block py-1">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 sm:mt-12 border-t border-gray-700 pt-6 sm:pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Vintage Resorts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
