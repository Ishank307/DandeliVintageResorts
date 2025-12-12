"use client"

import SpotlightCard from "@/components/SpotlightCard"
import { Star } from "lucide-react"

const Reviews = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      location: "Mumbai",
      date: "December 2024",
      initials: "SJ",
      gradient: "from-blue-400 to-blue-600",
      spotlightColor: "rgba(26, 115, 232, 0.3)",
      review:
        "Absolutely wonderful experience! The room was spotless, the staff was incredibly friendly, and the location was perfect. Will definitely book again on my next visit.",
    },
    {
      name: "Rahul Kumar",
      location: "Bangalore",
      date: "November 2024",
      initials: "RK",
      gradient: "from-amber-400 to-amber-600",
      spotlightColor: "rgba(255, 193, 7, 0.3)",
      review:
        "Best value for money! The booking process was smooth, check-in was quick, and the amenities exceeded my expectations. Highly recommended for business travelers.",
    },
    {
      name: "Priya Mehta",
      location: "Delhi",
      date: "November 2024",
      initials: "PM",
      gradient: "from-purple-400 to-purple-600",
      spotlightColor: "rgba(156, 39, 176, 0.3)",
      review:
        "Perfect for a weekend getaway! The rooms had stunning views, breakfast was delicious, and the resort atmosphere was very relaxing. Can't wait to visit again!",
    },
    {
      name: "Amit Sharma",
      location: "Pune",
      date: "October 2024",
      initials: "AS",
      gradient: "from-emerald-400 to-emerald-600",
      spotlightColor: "rgba(16, 185, 129, 0.3)",
      review:
        "Outstanding service and pristine facilities. The team went above and beyond to make our anniversary special. The attention to detail was remarkable!",
    },
    {
      name: "Neha Patel",
      location: "Ahmedabad",
      date: "October 2024",
      initials: "NP",
      gradient: "from-rose-400 to-rose-600",
      spotlightColor: "rgba(251, 113, 133, 0.3)",
      review:
        "Exceptional experience from start to finish. The modern amenities, comfortable rooms, and helpful staff made this the best hotel stay I've had in years.",
    },
  ]

  // Duplicate for infinite scrolling
  const duplicatedReviews = [...reviews, ...reviews, ...reviews]

  return (
    <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900 text-center">
          What Our Guests Say
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4">
          Discover why thousands of travelers choose us for their perfect stay
        </p>

        {/* SCROLL WRAPPER - FIXED */}
        <div className="relative w-full overflow-hidden">

          {/* Infinite scroll */}
          <div className="flex gap-4 sm:gap-6 animate-infinite-scroll hover:pause-animation">
            {duplicatedReviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px]"
              >
                <SpotlightCard spotlightColor={review.spotlightColor}>
                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-white/95 mb-4 md:mb-6 leading-relaxed text-sm sm:text-base">
                    "{review.review}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-sm sm:text-base`}
                    >
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm sm:text-base">
                        {review.name}
                      </h4>
                      <p className="text-white/70 text-xs sm:text-sm">
                        {review.location} · {review.date}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

export default Reviews
