"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function ProfileSetupPage() {
    const router = useRouter()
    const { updateUserProfile, user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date_of_birth: "",
        gender: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!formData.name || !formData.email) {
            setError("Name and Email are required")
            return
        }

        setIsLoading(true)

        try {
            const result = await updateUserProfile(formData)

            if (result.success) {
                router.push("/")
            } else {
                setError(result.error || "Failed to update profile")
            }
        } catch (err) {
            setError("Failed to update profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/images/login-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/40"></div>
            </div>

            {/* Header */}
            <header className="w-full px-6 py-4 sm:px-10 relative z-10">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex flex-col items-start">
                        <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">Vintza</span>
                        <span className="text-xs text-white/90 drop-shadow-md">By Vintage Resorts</span>
                        <div className="h-0.5 w-full bg-yellow-500 mt-0.5"></div>
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center flex-grow py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="w-full max-w-md">
                    <div className="p-8 space-y-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                        {/* Title */}
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-center text-white drop-shadow-lg sm:text-3xl">
                                Complete Your Profile
                            </h2>
                            <p className="mt-2 text-sm text-center text-white/90 drop-shadow-md">
                                Tell us a bit more about yourself to get started.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-white font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white drop-shadow-md">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="block w-full px-3 py-2 mt-1 placeholder-slate-400 bg-white/90 backdrop-blur-sm border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white sm:text-sm"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white drop-shadow-md">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john.doe@example.com"
                                        className="block w-full px-3 py-2 mt-1 placeholder-slate-400 bg-white/90 backdrop-blur-sm border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white sm:text-sm"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-white drop-shadow-md">
                                        Date of Birth (Optional)
                                    </label>
                                    <input
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]}
                                        className="block w-full px-3 py-2 mt-1 placeholder-slate-400 bg-white/90 backdrop-blur-sm border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white sm:text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-white drop-shadow-md">
                                        Gender (Optional)
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 mt-1 placeholder-slate-400 bg-white/90 backdrop-blur-sm border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white sm:text-sm"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex justify-center w-full px-4 py-3 text-sm font-semibold text-white border border-transparent rounded-lg shadow-sm bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Complete Profile"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Note */}
                        <p className="text-xs text-center text-white/80 drop-shadow-md">
                            * Required fields
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
