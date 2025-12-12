"use client"

import React, { useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Share, Heart } from "lucide-react"
import Image from "next/image"

export default function ImageCarouselModal({ images, initialIndex = 0, isOpen, onClose }) {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") handlePrevious()
            if (e.key === "ArrowRight") handleNext()
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, currentIndex])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                    <X className="h-6 w-6" />
                    <span className="text-sm font-medium">Close</span>
                </button>

                <div className="text-white text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <Share className="h-5 w-5" />
                    </button>
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <Heart className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Main Image */}
            <div className="h-full w-full flex items-center justify-center p-4">
                <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                    <Image
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
            )}

            {currentIndex < images.length - 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
            )}
        </div>
    )
}
