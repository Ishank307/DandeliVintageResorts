"use client"

import Image from "next/image"
import { useState } from "react"
import ImageCarouselModal from "./ImageCarouselModal"

export default function HotelImageGallery({ images = [], hotelName }) {
    const [isCarouselOpen, setIsCarouselOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const hasImages = Array.isArray(images) && images.length > 0
    console.log(images[0])
    const handleShowMore = () => {
        setSelectedImageIndex(0)
        setIsCarouselOpen(true)
    }

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index)
        setIsCarouselOpen(true)
    }

    // ✅ NO IMAGES → render placeholder instead of <Image />
    if (!hasImages) {
        return (
            <div className="w-full h-[280px] md:h-[350px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                No images available
            </div>
        )
    }
    console.log('this '+ images[0])

    return (
        <div>
            {/* Main Image */}
            <div className="relative w-full h-[280px] md:h-[350px] rounded-lg overflow-hidden mb-3">
                {images[0] &&<Image
                    src={images[0]}
                    alt={`${hotelName} - Main`}
                    fill
                    className="object-cover"
                    priority
                />}
            </div>

            {/* Thumbnail Images with Show More */}
            <div className="grid grid-cols-3 gap-2">
                {images.slice(1, 3).map((image, index) => (
                    <button
                        key={index}
                        onClick={() => handleThumbnailClick(index + 1)}
                        className="relative h-20 md:h-24 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src={image}
                            alt={`${hotelName} - Thumbnail ${index + 2}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}

                {/* Show More Button */}
                {images.length > 3 && (
                    <button
                        onClick={handleShowMore}
                        className="relative h-20 md:h-24 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                    >
                        <Image
                            src={images[3]}
                            alt="Show more"
                            fill
                            className="object-cover brightness-50"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                + Show more
                            </span>
                        </div>
                    </button>
                )}
            </div>

            {/* Carousel Modal */}
            <ImageCarouselModal
                images={images}
                initialIndex={selectedImageIndex}
                isOpen={isCarouselOpen}
                onClose={() => setIsCarouselOpen(false)}
            />
        </div>
    )
}
