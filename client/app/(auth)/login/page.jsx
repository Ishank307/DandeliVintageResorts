"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
    const router = useRouter()
    const { sendOTP, login } = useAuth()
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState(["", "", "", ""])
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState("")
    const otpInputRefs = useRef([])

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10)
        setPhone(value)
    }

    const handleSendOtp = async () => {
        setError("")
        setIsLoading(true)

        try {
            const result = await sendOTP(phone)

            if (result.success) {
                setIsOtpSent(true)
                setTimeout(() => otpInputRefs.current[0]?.focus(), 100)
            } else {
                setError(result.error || "Failed to send OTP")
            }
        } catch (err) {
            setError("Failed to send OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value[0]

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 3) {
            otpInputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)

        if (pastedData.length === 4) {
            const newOtp = pastedData.split('')
            setOtp(newOtp)
            otpInputRefs.current[3]?.focus()
        }
    }

    const handleVerifyLogin = async () => {
        setError("")
        setIsVerifying(true)

        const otpCode = otp.join("")

        try {
            const result = await login(phone, otpCode)

            if (result.success) {
                // Check if first login (needs profile completion)
                if (result.user.is_first_login || !result.user.name || !result.user.email) {
                    router.push("/profile-setup")
                } else {
                    router.push("/")
                }
            } else {
                setError(result.error || "Invalid OTP")
            }
        } catch (err) {
            setError("Failed to verify OTP. Please try again.")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResendOtp = async () => {
        setError("")
        setOtp(["", "", "", ""])
        setIsLoading(true)

        try {
            const result = await sendOTP(phone)

            if (result.success) {
                otpInputRefs.current[0]?.focus()
            } else {
                setError(result.error || "Failed to resend OTP")
            }
        } catch (err) {
            setError("Failed to resend OTP. Please try again.")
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
                    <Link href="/" className="text-xl font-bold text-white drop-shadow-lg">
                        Vintage Resorts
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="hidden sm:block text-sm font-medium text-white/90 hover:text-white drop-shadow-md">
                            Explore
                        </Link>
                        <Link href="/" className="hidden sm:block text-sm font-medium text-white/90 hover:text-white drop-shadow-md">
                            Contact
                        </Link>
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md border border-white/30">
                            Login / Signup
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center flex-grow py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="w-full max-w-md">
                    <div className="p-8 space-y-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                        {/* Title */}
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-center text-white drop-shadow-lg sm:text-3xl">
                                Login with Mobile
                            </h2>
                            <p className="mt-2 text-sm text-center text-white/90 drop-shadow-md">
                                Enter your mobile number to receive a one-time password.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={(e) => { e.preventDefault(); handleVerifyLogin(); }} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-white font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Mobile Number */}
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-white drop-shadow-md">
                                        Mobile Number
                                    </label>
                                    <div className="flex items-center mt-1 space-x-3">
                                        <input
                                            id="mobile"
                                            name="mobile"
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            disabled={isOtpSent}
                                            className="block w-full px-3 py-2 placeholder-slate-400 bg-white/90 backdrop-blur-sm border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white sm:text-sm disabled:bg-white/50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={phone.length < 10 || isOtpSent || isLoading}
                                            className="px-4 py-2 text-sm font-medium text-white border rounded-lg whitespace-nowrap border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                                        </button>
                                    </div>
                                </div>

                                {/* OTP Input */}
                                {isOtpSent && (
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-white drop-shadow-md text-center">
                                            One-Time Password (OTP)
                                        </label>
                                        <div className="flex justify-center mt-1 space-x-3">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpInputRefs.current[index] = el)}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    onPaste={index === 0 ? handlePaste : undefined}
                                                    className="w-20 h-14 text-center text-lg font-semibold bg-white/90 backdrop-blur-sm border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white sm:text-xl"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-end mt-2 text-sm">
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={isLoading}
                                                className="font-medium text-white hover:text-white/80 drop-shadow-md disabled:opacity-50"
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Verify Button */}
                            {isOtpSent && (
                                <div>
                                    <button
                                        type="submit"
                                        disabled={otp.some(d => !d) || isVerifying}
                                        className="flex justify-center w-full px-4 py-3 text-sm font-semibold text-white border border-transparent rounded-lg shadow-sm bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify & Login"
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Info Note */}
                        <p className="mt-8 text-xs text-center text-white/80 drop-shadow-md">
                            New user? You'll be automatically registered when you verify your OTP.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
