"use client"

import { Star } from "lucide-react"

export default function HotelReviews({ rating, totalReviews, reviews }) {
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews & rating</h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded-lg font-bold">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        {rating}
                    </div>
                    <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
                </div>
            </div>

            {/* Comment Section Placeholder */}
            <div className="bg-gray-100 rounded-xl p-12 text-center min-h-[300px] flex items-center justify-center">
                <div>
                    <h3 className="text-3xl font-bold text-gray-400 mb-2">Comment section</h3>
                    <p className="text-gray-500">Guest reviews will appear here</p>
                </div>
            </div>

            {/* If you want to display actual reviews, you can map through them here */}
            {reviews && reviews.length > 0 && (
                <div className="mt-6 space-y-4">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-gray-900">{review.userName}</p>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                                <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    {review.rating}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
