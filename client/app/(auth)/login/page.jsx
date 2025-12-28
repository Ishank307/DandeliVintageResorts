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

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState(["", "", "", ""])
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState("")

    const otpInputRefs = useRef([])

    /* ---------------- EMAIL ---------------- */
    const handleEmailChange = (e) => {
        setEmail(e.target.value.trim())
    }

    /* ---------------- SEND OTP ---------------- */
    const handleSendOtp = async () => {
        setError("")
        setIsLoading(true)

        try {
            const result = await sendOTP(email)

            if (result.success) {
                setIsOtpSent(true)
                setTimeout(() => otpInputRefs.current[0]?.focus(), 100)
            } else {
                setError(result.error || "Failed to send OTP")
            }
        } catch {
            setError("Failed to send OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    /* ---------------- OTP INPUT ---------------- */
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return

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
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)

        if (pasted.length === 4) {
            setOtp(pasted.split(""))
            otpInputRefs.current[3]?.focus()
        }
    }

    /* ---------------- VERIFY ---------------- */
    const handleVerifyLogin = async () => {
        setError("")
        setIsVerifying(true)

        const otpCode = otp.join("")

        try {
            const result = await login(email, otpCode)

            if (result.success) {
                // Check if there's a return URL (from booking page)
                const returnUrl = localStorage.getItem('returnUrl')

                if (
                    result.user.is_first_login ||
                    !result.user.name ||
                    !result.user.email
                ) {
                    router.push("/profile-setup")
                } else if (returnUrl) {
                    // Remove returnUrl and redirect back
                    localStorage.removeItem('returnUrl')
                    router.push(returnUrl)
                } else {
                    router.push("/")
                }
            } else {
                setError(result.error || "Invalid OTP")
            }
        } catch {
            setError("Failed to verify OTP. Please try again.")
        } finally {
            setIsVerifying(false)
        }
    }

    /* ---------------- RESEND ---------------- */
    const handleResendOtp = async () => {
        setError("")
        setOtp(["", "", "", ""])
        setIsLoading(true)

        try {
            const result = await sendOTP(email)
            if (!result.success) {
                setError(result.error || "Failed to resend OTP")
            } else {
                otpInputRefs.current[0]?.focus()
            }
        } catch {
            setError("Failed to resend OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const isValidEmail = /^\S+@\S+\.\S+$/.test(email)

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url(/images/login-bg.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/40" />
            </div>

            {/* Header */}
            <header className="w-full px-6 py-4 sm:px-10 relative z-10">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex flex-col">
                        <span className="text-2xl font-bold text-white">Vintza</span>
                        <span className="text-xs text-white/90">By Vintage Resorts</span>
                        <div className="h-0.5 w-full bg-yellow-500 mt-0.5" />
                    </Link>
                </nav>
            </header>

            {/* Main */}
            <main className="flex items-center justify-center flex-grow px-4 relative z-10">
                <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                    <div>
                        <h2 className="text-3xl font-bold text-center text-white">
                            Login with Email
                        </h2>
                        <p className="mt-2 text-sm text-center text-white/90">
                            Enter your email to receive a one-time password
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!isOtpSent) {
                                handleSendOtp()
                            } else {
                                handleVerifyLogin()
                            }
                        }}
                        className="space-y-6"
                    >
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
                                <p className="text-sm text-white">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isOtpSent}
                                className="w-full px-4 py-3 bg-white/90 text-gray-900 placeholder:text-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={!isValidEmail || isOtpSent || isLoading}
                                className="w-full mt-3 px-4 py-3 text-white font-medium rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:bg-white/20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </div>

                        {/* OTP */}
                        {isOtpSent && (
                            <>
                                <div className="flex justify-center space-x-3">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => (otpInputRefs.current[i] = el)}
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleOtpChange(i, e.target.value)
                                            }
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            onPaste={i === 0 ? handlePaste : undefined}
                                            className="w-16 h-14 text-center text-lg rounded-lg bg-white/90"
                                        />
                                    ))}
                                </div>

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className="text-sm text-white"
                                    >
                                        Resend OTP
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={otp.some((d) => !d) || isVerifying}
                                    className="w-full py-3 text-white rounded-lg bg-primary"
                                >
                                    {isVerifying ? (
                                        <Loader2 className="mx-auto animate-spin" />
                                    ) : (
                                        "Verify & Login"
                                    )}
                                </button>
                            </>
                        )}
                    </form>

                    <p className="text-xs text-center text-white/80">
                        New users will be registered automatically
                    </p>
                </div>
            </main>
        </div>
    )
}
