from bookings.utils import generate_invoice_pdf
from django.core.mail import EmailMessage
from django.conf import settings
from background_task import background

@background(schedule=60)
def send_invoice_email_enqueue(booking):
    """
    Generates an invoice PDF and sends it via email to the user.
    """
    user = booking.user
    invoice_number = f"INV-{booking.id:06d}"
    amount = booking.total_amount
    pdf_buffer = generate_invoice_pdf(invoice_number, user.name or user.phone_number, amount)

    email = EmailMessage(
        subject=f"Your Invoice #{invoice_number}",
        body=f"Dear {user.name or user.phone_number},\n\nPlease find attached the invoice for your booking #{booking.id}.\n\nThank you for choosing our service!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach(f"Invoice_{invoice_number}.pdf", pdf_buffer.getvalue(), 'application/pdf')
    email.send(fail_silently=False)