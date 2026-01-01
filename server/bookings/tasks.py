from bookings.utils import generate_invoice_pdf
from django.core.mail import EmailMessage
from django.conf import settings
from background_task import background
from bookings.models import FinalBooking
# from bookings.integrations.gsheets import append_booking_row 


@background()   # or @background() if you don't want delay
def send_invoice_email_enqueue(booking_id):
    """
    Generates a professional invoice PDF and emails it to the user.
    """

    # 1) Fetch booking + related data
    booking = FinalBooking.objects.select_related("user", "resort", "payment").get(id=booking_id)

    user = booking.user
    invoice_number = f"INV-{booking.id:06d}"

    # 2) Generate PDF (NEW SIGNATURE)
    pdf_buffer = generate_invoice_pdf(
        booking=booking,
        invoice_number=invoice_number
    )

    # 3) Send email
    email = EmailMessage(
        subject=f"Your Invoice #{invoice_number} – Vintza by Vintage Resorts",
        body=(
            f"Dear {user.name or user.username},\n\n"
            f"Thank you for your booking.\n"
            f"Please find your invoice attached for Booking ID #{booking.id}.\n\n"
            f"Warm regards,\n"
            f"Vintza by Vintage Resorts"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    email.attach(
        filename=f"Invoice_{invoice_number}.pdf",
        content=pdf_buffer.getvalue(),
        mimetype="application/pdf",
    )

    email.send(fail_silently=False)
    
    
    
# @background()  # runs ~5 sec later
# def push_booking_to_sheet_task(row):
    
#     append_booking_row(row)
