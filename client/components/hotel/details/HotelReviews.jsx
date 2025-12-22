"use client"

import { Star } from "lucide-react"
import { useState } from "react"

export default function HotelReviews({ rating, totalReviews, reviews }) {
    const [showAll, setShowAll] = useState(false)

    const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

    const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length
        const percent = totalReviews
            ? Math.round((count / totalReviews) * 100)
            : 0
        return { star, percent }
    })

    return (
        <section className="mb-12">
            {/* ================= Rating Summary ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-xl p-6 mb-10">
                {/* Left */}
                <div className="flex flex-col justify-center">
                    <div className="bg-green-700 text-white w-fit px-4 py-2 rounded-lg text-xl font-bold flex items-center gap-1">
                        {rating}
                        <Star className="h-5 w-5 fill-white" />
                    </div>
                    <p className="mt-2 font-semibold text-gray-900">
                        EXCELLENT
                    </p>
                    <p className="text-sm text-gray-500">
                        {totalReviews} ratings
                    </p>
                </div>

                {/* Right */}
                <div className="space-y-2">
                    {ratingBreakdown.map(({ star, percent }) => (
                        <div key={star} className="flex items-center gap-2">
                            <span className="w-6 text-sm text-gray-600">
                                {star}★
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded">
                                <div
                                    className="h-2 bg-orange-400 rounded"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <span className="w-10 text-sm text-gray-500">
                                {percent}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= Reviews ================= */}
            <div className="space-y-8">
                {visibleReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {/* Show more */}
            {reviews.length > 3 && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="mt-8 font-semibold underline text-gray-900"
                >
                    Show more reviews
                </button>
            )}
        </section>
    )
}

/* ================= Review Card ================= */

function ReviewCard({ review }) {
    const [expanded, setExpanded] = useState(false)

    const text =
        review.comment.length > 180 && !expanded
            ? review.comment.slice(0, 180) + "..."
            : review.comment

    return (
        <div>
            {/* User */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                    {review.user?.name?.charAt(0) || "G"}
                </div>

                <div>
                    <p className="font-semibold text-gray-900">
                        {review.user?.name || "Guest"}
                    </p>
                </div>
            </div>

            {/* Rating & Date */}
            <div className="flex items-center gap-2 text-sm mb-2">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${
                                i < review.rating
                                    ? "fill-black text-black"
                                    : "text-gray-300"
                            }`}
                        />
                    ))}
                </div>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </span>
            </div>

            {/* Comment */}
            <p className="text-gray-800 text-sm leading-relaxed">
                {text}
            </p>

            {review.comment.length > 180 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-1 text-sm font-semibold underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    )
}
