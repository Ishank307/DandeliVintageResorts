from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from bookings.models import User, Resort, Room, BookingAttempt, BookingAttemptRooms
from unittest.mock import patch
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

class PaymentDiscountTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(phone_number='9876543210')
        self.client.force_authenticate(user=self.user)
        self.resort = Resort.objects.create(name='Test Resort Discount', location='Test Location')
        # Room price: 1000.00
        self.room = Room.objects.create(resort=self.resort, room_number='101', capacity=2, price_per_night=1000.00)
        
        # Create a booking attempt
        self.check_in = timezone.now().date() + timedelta(days=1)
        self.check_out = timezone.now().date() + timedelta(days=2) # 1 night
        self.booking_attempt = BookingAttempt.objects.create(
            user=self.user,
            resort=self.resort,
            check_in=self.check_in,
            check_out=self.check_out,
            guest_count=1,
            expires_at=timezone.now() + timedelta(minutes=30)
        )
        BookingAttemptRooms.objects.create(attempt=self.booking_attempt, room=self.room)
        # Total price for 1 night = 1000.00

    @patch('razorpay.Client')
    def test_full_payment_discount(self, mock_razorpay_client):
        # Mocking razorpay response
        mock_order = {'id': 'order_full', 'amount': 98000, 'currency': 'INR'} # 1000 * 0.98 * 100 = 98000 paise
        mock_razorpay_client.return_value.order.create.return_value = mock_order

        url = reverse('create-order')
        data = {
            'booking_attempt_id': self.booking_attempt.id,
            'payment_type': 'full'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the calculation: 1000 * 0.98 = 980.00
        # Razorpay expects it in paise (int)
        expected_amount_paise = int(Decimal('1000.00') * Decimal('0.98') * 100)
        mock_razorpay_client.return_value.order.create.assert_called_once()
        args, kwargs = mock_razorpay_client.return_value.order.create.call_args
        self.assertEqual(kwargs['amount'], expected_amount_paise)
        self.assertEqual(kwargs['amount'], 98000)

    @patch('razorpay.Client')
    def test_partial_payment_no_discount(self, mock_razorpay_client):
        # Mocking razorpay response
        # settings.PARTIAL_PAYMENT_PERCENTAGE is 25
        # 1000 * 0.25 * 100 = 25000 paise
        mock_order = {'id': 'order_partial', 'amount': 25000, 'currency': 'INR'} 
        mock_razorpay_client.return_value.order.create.return_value = mock_order

        url = reverse('create-order')
        data = {
            'booking_attempt_id': self.booking_attempt.id,
            'payment_type': 'partial'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the calculation: 1000 * 0.25 = 250.00
        expected_amount_paise = int(Decimal('1000.00') * (Decimal(settings.PARTIAL_PAYMENT_PERCENTAGE) / Decimal(100)) * 100)
        mock_razorpay_client.return_value.order.create.assert_called_once()
        args, kwargs = mock_razorpay_client.return_value.order.create.call_args
        self.assertEqual(kwargs['amount'], expected_amount_paise)
        self.assertEqual(kwargs['amount'], 25000)
