export default function BookingSuccess({ params }) {
    const { booking_id } = params
    
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>🎉 Booking Successful!</h1>
            <p>Your booking ID is:</p>
            <h2>{booking_id}</h2>

            <p>Thank you for booking with us. Have an amazing trip! 🏖️</p>
        </div>
    )
}
