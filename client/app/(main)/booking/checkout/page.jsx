import PaymentForm from "@/components/booking/PaymentForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Secure Payment</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <PaymentForm />
                </div>

                <div className="w-full lg:w-1/3">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <h3 className="font-bold">OYO Townhouse 123</h3>
                            <p className="text-sm text-muted-foreground">1 Room, 2 Guests</p>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>₹1433</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
