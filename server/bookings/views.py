
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room, Resort, OTP, User, BookingAttempt, BookingAttemptRooms, GuestTemp, Payment, FinalBooking, BookingRoom, BookingGuest,Review, Coupon
from .serializers import RoomSerializer, ReviewSerializer
from django.db.models import Q, Sum
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.utils import timezone
from decimal import Decimal
import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.mail import send_mail
from bookings.tasks import send_invoice_email_enqueue


# Request OTP
@api_view(['POST'])
def request_otp(request):
    phone = request.data.get('phone_number')
    if not phone:
        return Response({"error": "Phone number is required"}, status=400)

    otp_code = OTP.generate_otp()
    OTP.objects.create(phone_number=phone, code=otp_code)

    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP code is {otp_code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[phone],  # Replace with actual SMS gateway email
        fail_silently=False,
    )
    
    print(f"🔐 OTP for {phone} is {otp_code}")  # For now: print in console

    return Response({"message": "OTP sent successfully"}, status=200)


# Verify OTP
@api_view(['POST'])
def verify_otp(request):
    phone = request.data.get('phone_number')
    otp = request.data.get('otp')

    if not phone or not otp:
        return Response({"error": "Phone and OTP required"}, status=400)

    try:
        otp_record = OTP.objects.filter(phone_number=phone).latest('created_at')
    except OTP.DoesNotExist:
        return Response({"error": "No OTP found"}, status=404)

    if not otp_record.is_valid():
        return Response({"error": "OTP expired"}, status=400)

    if otp_record.code != otp:
        return Response({"error": "Invalid OTP"}, status=400)

    user, created = User.objects.get_or_create(phone_number=phone)
    refresh = RefreshToken.for_user(user)
    
    is_first_login = created
    response = Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "phone_number": user.phone_number,
            "name": user.name,
            "email": user.email,
            "is_first_login": is_first_login
        }
    }, status=200)

    response.set_cookie(
        key="access_token",
        value=str(refresh.access_token),
        httponly=True,
        secure=True, 
        samesite="Lax"
    )

    return response
    

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        name = request.data.get('name')
        email = request.data.get('email')
        date_of_birth = request.data.get('date_of_birth')
        gender = request.data.get('gender')

        if not name or not email:
            return Response({"error": "Name and email are required"}, status=400)

        user.name = name
        user.email = email
        user.date_of_birth = date_of_birth
        user.gender = gender
        user.save()

        return Response({"message": "Profile updated successfully", "user": {
            "phone_number": user.phone_number,
            "name": user.name,
            "email": user.email,
        }}, status=200)




class HotelDetailView(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request, resort_id):
        try:
            resort = Resort.objects.get(pk=resort_id)
        except Resort.DoesNotExist:
            return Response({'error': 'Resort not found.'}, status=status.HTTP_404_NOT_FOUND)

        rooms = Room.objects.filter(resort=resort)
        serializer = RoomSerializer(rooms, many=True)

        resort_data = {
            'id': resort.id,
            'name': resort.name,
            'location': resort.location,
            'description': resort.description,
            'amenities': resort.aminities,
            'rooms': serializer.data,
            'lat' :resort.lat,
            'lng': resort.lng
        }

        return Response(resort_data, status=status.HTTP_200_OK)



class RoomSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        location = request.query_params.get('location')
        check_in_date_str = request.query_params.get('check_in_date')
        check_out_date_str = request.query_params.get('check_out_date')
        guests_str = request.query_params.get('guests')

        if not all([location, check_in_date_str, check_out_date_str, guests_str]):
            return Response({'error': 'Missing required query parameters (location, check_in_date, check_out_date, guests).'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            check_in_date = datetime.strptime(check_in_date_str, '%Y-%m-%d').date()
            check_out_date = datetime.strptime(check_out_date_str, '%Y-%m-%d').date()
            guests = int(guests_str)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid date format or guest number.'}, status=status.HTTP_400_BAD_REQUEST)

        if check_in_date >= check_out_date:
            return Response({'error': 'Check-out date must be after check-in date.'}, status=status.HTTP_400_BAD_REQUEST)

        resorts = Resort.objects.filter(location__icontains=location)
        if not resorts.exists():
            return Response({'message': 'No resorts found in the specified location.'}, status=status.HTTP_404_NOT_FOUND)

        results = []
        for resort in resorts:
            overlapping_bookings = FinalBooking.objects.filter(
                resort=resort,
                check_in__lt=check_out_date,
                check_out__gt=check_in_date,
                status='confirmed'
            )
            booked_room_pks = BookingRoom.objects.filter(booking__in=overlapping_bookings).values_list('room__pk', flat=True)

            available_rooms = Room.objects.filter(resort=resort).exclude(pk__in=booked_room_pks)
            
            total_capacity = available_rooms.aggregate(total_capacity=Sum('capacity'))['total_capacity'] or 0
            
            if total_capacity >= guests:
                resort_data = {
                    'resort_id': resort.id,
                    'resort_name': resort.name,
                    'location': resort.location,
                    'available_rooms': RoomSerializer(available_rooms, many=True).data
                }
                results.append(resort_data)

        if not results:
            return Response({'message': 'No rooms available for the selected criteria in this location.'}, status=status.HTTP_200_OK)

        return Response(results, status=status.HTTP_200_OK)

class SelectRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resort_id = request.data.get('resort_id')
        room_ids = request.data.get('room_ids')
        check_in_date_str = request.data.get('check_in_date')
        check_out_date_str = request.data.get('check_out_date')
        guests_str = request.data.get('guests')

        if not all([resort_id, room_ids, check_in_date_str, check_out_date_str, guests_str]):
            return Response({'error': 'Missing required fields (resort_id, room_ids, check_in_date, check_out_date, guests).'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            resort = Resort.objects.get(pk=resort_id)
            check_in_date = datetime.strptime(check_in_date_str, '%Y-%m-%d').date()
            check_out_date = datetime.strptime(check_out_date_str, '%Y-%m-%d').date()
            guests = int(guests_str)
            rooms = Room.objects.filter(pk__in=room_ids, resort=resort)
        except (Resort.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Invalid resort ID, date format or guest number.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(room_ids) != rooms.count():
            return Response({'error': 'Some selected rooms do not belong to the specified resort.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate room selection
        total_capacity = rooms.aggregate(Sum('capacity'))['capacity__sum'] or 0
        if total_capacity < guests:
            return Response({'error': 'The selected rooms do not have enough capacity for all guests.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Verify rooms are actually available
        overlapping_bookings = FinalBooking.objects.filter(
            resort=resort,
            check_in__lt=check_out_date,
            check_out__gt=check_in_date,
            status='confirmed'
        )
        booked_room_pks = BookingRoom.objects.filter(booking__in=overlapping_bookings).values_list('room__pk', flat=True)
        
        for room_id in room_ids:
            if room_id in booked_room_pks:
                return Response({'error': f'Room with id {room_id} is not available for the selected dates.'}, status=status.HTTP_400_BAD_REQUEST)


        # Create a booking attempt
        booking_attempt = BookingAttempt.objects.create(
            user=request.user,
            resort=resort,
            check_in=check_in_date,
            check_out=check_out_date,
            guest_count=guests,
            expires_at=timezone.now() + timedelta(minutes=30)
        )

        for room in rooms:
            BookingAttemptRooms.objects.create(attempt=booking_attempt, room=room)

        return Response({
            'message': 'Rooms selected successfully. Proceed to add guest details.',
            'booking_attempt_id': booking_attempt.id
        }, status=status.HTTP_200_OK)

class AddGuestDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_attempt_id = request.data.get('booking_attempt_id')
        guests = request.data.get('guests') # List of guest details

        if not booking_attempt_id or not guests:
            return Response({'error': 'Booking attempt ID and guest details are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking_attempt = BookingAttempt.objects.get(pk=booking_attempt_id, user=request.user)
        except BookingAttempt.DoesNotExist:
            return Response({'error': 'Invalid booking attempt ID.'}, status=status.HTTP_404_NOT_FOUND)

        for guest_data in guests:
            GuestTemp.objects.create(
                attempt=booking_attempt,
                room_id=guest_data['room_id'],
                name=guest_data['name'],
                age=guest_data['age']
            )

        return Response({'message': 'Guest details added successfully.'}, status=status.HTTP_200_OK)

class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_attempt_id = request.data.get("booking_attempt_id")
        payment_type = request.data.get("payment_type", "full")
        coupon_code = request.data.get("coupon_code")

        if not booking_attempt_id:
            return Response({"error": "Missing booking_attempt_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking_attempt = BookingAttempt.objects.get(pk=booking_attempt_id, user=request.user)
        except BookingAttempt.DoesNotExist:
            return Response({"error": "Invalid booking_attempt_id"}, status=status.HTTP_404_NOT_FOUND)

        # Calculate total amount
        total_price = Decimal(0)
        attempt_rooms = BookingAttemptRooms.objects.filter(attempt=booking_attempt)
        duration = (booking_attempt.check_out - booking_attempt.check_in).days
        for attempt_room in attempt_rooms:
            total_price += attempt_room.room.price_per_night * duration
        
        if total_price <= 0:
            return Response({"error": "Calculated amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Apply Coupon
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, active=True)
                discount_amount = (total_price * Decimal(coupon.discount_percentage)) / Decimal(100)
                total_price -= discount_amount
                booking_attempt.coupon = coupon
                booking_attempt.save()
            except Coupon.DoesNotExist:
                return Response({"error": "Invalid or expired coupon code."}, status=status.HTTP_400_BAD_REQUEST)
        
        if total_price < 0:
            total_price = Decimal(0)

        amount_to_pay = total_price
        if payment_type == 'partial':
             percentage = Decimal(settings.PARTIAL_PAYMENT_PERCENTAGE) / Decimal(100)
             amount_to_pay = total_price * percentage

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        # Razorpay expects amount in paise
        razorpay_order = client.order.create({
            "amount": int(amount_to_pay * 100),
            "currency": "INR",
            "receipt": f"booking_{booking_attempt.id}",
            "payment_capture": 1
        })

        # Create a payment record
        payment = Payment.objects.create(
            attempt=booking_attempt,
            amount=amount_to_pay,
            type=payment_type,
            provider="Razorpay",
            provider_payment_id=razorpay_order["id"], # Store Razorpay Order ID
            status="initiated",
        )

        return Response({
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
            "booking_attempt_id": booking_attempt.id,
            "payment_id": payment.id
        }, status=status.HTTP_201_CREATED)






class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        order_id = data.get("razorpay_order_id")
        payment_id = data.get("razorpay_payment_id")
        signature = data.get("razorpay_signature")

        if not all([order_id, payment_id, signature]):
            return Response(
                {"error": "Incomplete payment data."},
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        params_dict = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        }

        try:
            # Verify signature
            client.utility.verify_payment_signature(params_dict)

            # Fetch and update payment & booking
            payment = Payment.objects.filter(provider_payment_id=order_id).first()
            if not payment:
                return Response({"error": "Payment record not found."}, status=status.HTTP_404_NOT_FOUND)
            
            # Check if booking attempt belongs to the user
            booking_attempt = payment.attempt
            if booking_attempt.user != request.user:
                return Response({"error": "Booking does not belong to the authenticated user."}, status=status.HTTP_403_FORBIDDEN)
            payment.status = 'success'
            payment.save()
            
            # Finalize the booking
            final_booking = FinalBooking.objects.create(
                user=booking_attempt.user,
                resort=booking_attempt.resort,
                check_in=booking_attempt.check_in,
                check_out=booking_attempt.check_out,
                status='confirmed' if payment.type == 'full' else 'pending',
                payment=payment
            )
            print(1)
            for attempt_room in BookingAttemptRooms.objects.filter(attempt=booking_attempt):
                BookingRoom.objects.create(booking=final_booking, room=attempt_room.room)
            
            print(2)
            for guest_temp in GuestTemp.objects.filter(attempt=booking_attempt):
                BookingGuest.objects.create(
                    booking=final_booking,
                    room=guest_temp.room,
                    name=guest_temp.name,
                    age=guest_temp.age
                )
            print(3)
            booking_attempt.status = 'completed'
            
            
            print(4)
            booking_attempt.save()
            print(4.5)
            send_invoice_email_enqueue(final_booking.id)
            # TODO: Add a task to send booking confirmation emails
            # send_booking_emails_task.delay(final_booking.id)
            print(5)
            return Response({
                "success": True,
                "message": "Payment verified successfully",
                "booking_id": final_booking.id
            })
            print(6)
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"success": False, "message": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Generic error for any other issues
            print(f"Error during payment verification: {str(e)}")
            return Response(
                {"success": False, "message": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ExploreView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        rooms = Room.objects.all().order_by('?')
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)



class ReviewCreateView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        data = request.data
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class ReviewListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        reviews = Review.objects.filter(resort_id=pk)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    
    
class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = (
            FinalBooking.objects
            .filter(user=request.user)
            .select_related("resort", "payment")
            .prefetch_related("bookingroom_set__room")
            .order_by("-id")
        )

        booking_list = []

        for booking in bookings:
            rooms = [br.room for br in booking.bookingroom_set.all()]
            room_data = RoomSerializer(rooms, many=True).data

            booking_list.append({
                "booking_id": booking.id,
                "resort_name": booking.resort.name if booking.resort else None,
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "status": booking.status,
                "rooms": room_data,

                # ✅ expose payment info (NO calculations)
                "payment_status": booking.payment.status if booking.payment else "N/A",
                "payment_type": booking.payment.type if booking.payment else None,
                "payment": {
                    "amount": float(booking.payment.amount)
                } if booking.payment else None,
            })

        return Response(booking_list, status=status.HTTP_200_OK)

class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        # Fetch the booking and ensure it belongs to the logged-in user
        try:
            booking = FinalBooking.objects.select_related(
                "resort", "payment", "payment__attempt"
            ).prefetch_related(
                "bookingroom_set__room__images",
                "bookingguest_set"
            ).get(id=booking_id, user=request.user)
        except FinalBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found or does not belong to you."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get all rooms for this booking
        booking_rooms = booking.bookingroom_set.all()
        rooms_data = []
        
        for br in booking_rooms:
            room = br.room
            room_images = []
            
            # Get room images
            for img in room.images.all():
                room_images.append(request.build_absolute_uri(img.image.url))
            
            rooms_data.append({
                "id": room.id,
                "room_number": room.room_number,
                "room_type": f"{room.capacity} Person Room",  # You can customize this
                "capacity": room.capacity,
                "price_per_night": float(room.price_per_night),
                "amenities": room.room_aminities or "",
                "images": room_images[:1] if room_images else []  # First image only
            })

        # Calculate stay duration
        check_in = booking.check_in
        check_out = booking.check_out
        nights = (check_out - check_in).days

        # Get guest count from BookingGuest
        total_guests = booking.bookingguest_set.count()

        # Calculate total price
        total_price = Decimal(0)
        for room in booking_rooms:
            total_price += room.room.price_per_night * nights

        # Payment details
        payment_data = None
        if booking.payment:
            payment_data = {
                "id": booking.payment.id,
                "amount": float(booking.payment.amount),
                "status": booking.payment.get_status_display(),
                "payment_method": booking.payment.provider,
                "payment_type": booking.payment.get_type_display(),
                "transaction_id": booking.payment.provider_payment_id,
                "paid_at":  None  
            }

        # Build response
        response_data = {
            "booking_id": booking.id,
            "booking_status": booking.get_status_display(),
            "resort": {
                "id": booking.resort.id,
                "name": booking.resort.name,
                "location": booking.resort.location,
                "description": booking.resort.description or "",
                "amenities": booking.resort.aminities or "",
                "lat": float(booking.resort.lat) if booking.resort.lat else None,
                "lng": float(booking.resort.lng) if booking.resort.lng else None,
            },
            "check_in_date": check_in.isoformat(),
            "check_out_date": check_out.isoformat(),
            "nights": nights,
            "number_of_guests": total_guests,
            "rooms": rooms_data,
            "total_price": float(total_price),
            "payment": payment_data,
            "created_at": None,
        }

        return Response(response_data, status=status.HTTP_200_OK)
