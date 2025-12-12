export default function HotelAbout({ description }) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </section>
    )
}
