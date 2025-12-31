import gspread
from google.oauth2.service_account import Credentials
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file(
    "service_account.json",
    scopes=SCOPES
)

gc = gspread.authorize(creds)
SHEET = gc.open("Bookings Log").sheet1   # or open_by_key()

@receiver(post_save, sender=Booking)
def push_booking_to_sheet(sender, instance, created, **kwargs):
    if not created:
        return

    # Example fields — adjust to your model
    row = [
        str(instance.id),
        instance.user.email if instance.user else "",
        instance.resort.name,
        str(instance.total_amount),
        instance.created_at.strftime("%Y-%m-%d %H:%M"),
    ]

    try:
        SHEET.append_row(row)
    except Exception as e:
        # Avoid breaking booking flow
        print("Sheet sync failed:", e)
