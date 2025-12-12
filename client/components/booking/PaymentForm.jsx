"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function PaymentForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Expiry Date</label>
                        <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">CVV</label>
                        <Input placeholder="123" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Card Holder Name</label>
                    <Input placeholder="John Doe" />
                </div>
                <Button className="w-full mt-4">Pay Now</Button>
            </CardContent>
        </Card>
    )
}
