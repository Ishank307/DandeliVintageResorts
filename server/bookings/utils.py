from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def generate_invoice_pdf(invoice_number, customer_name, amount):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    p.drawString(100, 800, f"Invoice #: {invoice_number}")
    p.drawString(100, 770, f"Customer: {customer_name}")
    p.drawString(100, 740, f"Amount: ₹{amount}")
    p.drawString(100, 700, "Status: PAID")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
