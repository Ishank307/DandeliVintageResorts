"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ProfilePage() {
    const { user, updateUserProfile, loading } = useAuth()
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        const result = await updateUserProfile(formData)

        if (result.success) {
            toast.success("Profile updated successfully!")
        } else {
            toast.error(result.error || "Failed to update profile")
        }

        setIsSaving(false)
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    if (!user) {
        return <div className="text-center py-8">Please log in to view your profile.</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input
                                    name="phone_number"
                                    value={formData.phone_number}
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-xs text-gray-500">Cannot be changed for now</p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-gray-100"
                                    placeholder="Enter your email"
                                />
                                <p className="text-xs text-gray-500">Cannot be changed for now</p>
                            </div>
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
