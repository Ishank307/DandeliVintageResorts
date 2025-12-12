"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()

    useEffect(() => {
        router.push("/login")
    }, [router])

    return (
        <div className="flex items-center justify-center p-8">
            <p>Redirecting to login...</p>
        </div>
    )
}
