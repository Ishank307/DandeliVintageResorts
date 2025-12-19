from django.core.management.base import BaseCommand
from bookings.models import Resort, Room, RoomImage, User, FinalBooking, BookingRoom, BookingGuest, Payment, BookingAttempt
from decimal import Decimal
from datetime import date, timedelta
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds the database with realistic dummy data for resorts, rooms, users, and bookings'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting database seeding...'))

        # Clean up existing data to avoid duplicates
        self.stdout.write('Cleaning up existing data...')
        BookingGuest.objects.all().delete()
        BookingRoom.objects.all().delete()
        FinalBooking.objects.all().delete()
        Payment.objects.all().delete()
        BookingAttempt.objects.all().delete()
        RoomImage.objects.all().delete()
        Room.objects.all().delete()
        Resort.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('✓ Cleaned up existing data'))

        # Create Resorts
        self.stdout.write('\nCreating resorts...')
        resorts_data = [
            {
                'name': 'Dandeli Nature Resort',
                'location': 'Dandeli, Karnataka, India',
                'description': 'Experience the wild beauty of Dandeli with our eco-friendly resort nestled in the heart of the Western Ghats. Perfect for adventure enthusiasts and nature lovers.',
                'aminities': 'Swimming Pool, Restaurant, Campfire Area, Parking, 24x7 Security, Front Desk, Laundry Service',
                'lat': Decimal('15.2610'),
                'lng': Decimal('74.6197'),
            },
            {
                'name': 'Goa Beach Paradise',
                'location': 'Calangute, Goa, India',
                'description': 'Luxurious beachfront resort offering stunning ocean views, water sports, and vibrant nightlife. Your perfect Goa getaway awaits.',
                'aminities': 'Private Beach, Swimming Pool, Spa, Gym, Restaurant, Bar, Parking, Room Service, Travel Desk',
                'lat': Decimal('15.5439'),
                'lng': Decimal('73.7553'),
            },
            {
                'name': 'Coorg Coffee Estate Retreat',
                'location': 'Madikeri, Coorg, Karnataka, India',
                'description': 'Wake up to the aroma of fresh coffee in our heritage estate. Explore lush green plantations, misty hills, and serene waterfalls.',
                'aminities': 'Coffee Plantation, Restaurant, Bonfire Area, Indoor Games, Library, Parking, Laundry Service',
                'lat': Decimal('12.4244'),
                'lng': Decimal('75.7382'),
            },
            {
                'name': 'Ooty Hill Station Cottages',
                'location': 'Ooty, Tamil Nadu, India',
                'description': 'Charming cottages perched on scenic hills offering panoramic views of tea gardens and valleys. Experience the queen of hill stations.',
                'aminities': 'Restaurant, Garden, Parking, Room Service, Travel Desk, Doctor on Call',
                'lat': Decimal('11.4064'),
                'lng': Decimal('76.6932'),
            },
            {
                'name': 'Hampi Heritage Village',
                'location': 'Hampi, Karnataka, India',
                'description': 'Stay amidst UNESCO World Heritage sites. Our resort blends modern comfort with ancient architecture, offering a unique cultural experience.',
                'aminities': 'Swimming Pool, Restaurant, Cycling, Parking, Cultural Shows, Travel Desk, 24x7 Security',
                'lat': Decimal('15.3350'),
                'lng': Decimal('76.4600'),
            },
            {
                'name': 'Munnar Valley Resort',
                'location': 'Munnar, Kerala, India',
                'description': 'Escape to the misty mountains of Munnar. Surrounded by rolling tea estates and spice plantations, perfect for a romantic retreat.',
                'aminities': 'Spa, Restaurant, Tea Garden Tours, Indoor Games, Parking, Room Service, Laundry',
                'lat': Decimal('10.0889'),
                'lng': Decimal('77.0595'),
            },
            {
                'name': 'Alleppey Backwater Homestay',
                'location': 'Alleppey, Kerala, India',
                'description': 'Experience authentic Kerala living by the serene backwaters. Enjoy houseboat rides, traditional cuisine, and warm hospitality.',
                'aminities': 'Restaurant, Boat Rides, Fishing, Parking, Ayurvedic Spa, Cultural Programs',
                'lat': Decimal('9.4981'),
                'lng': Decimal('76.3388'),
            },
            {
                'name': 'Jaipur Royal Palace Hotel',
                'location': 'Jaipur, Rajasthan, India',
                'description': 'Live like royalty in our heritage palace hotel. Experience Rajasthani culture, cuisine, and architecture in all its grandeur.',
                'aminities': 'Swimming Pool, Fine Dining Restaurant, Bar, Spa, Gym, Cultural Shows, Valet Parking, Banquet Hall',
                'lat': Decimal('26.9124'),
                'lng': Decimal('75.7873'),
            },
        ]

        resorts = []
        for data in resorts_data:
            resort = Resort.objects.create(**data)
            resorts.append(resort)
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created resort: {resort.name}'))

        # Create Rooms for each resort
        self.stdout.write('\nCreating rooms...')
        room_types = [
            {'name': 'Deluxe Room', 'capacity': 2, 'price_range': (2500, 3500), 'amenities': 'Attached Bathroom, AC, TV, WiFi, Geyser, Room Heater, Wardrobe, Study Table'},
            {'name': 'Premium Suite', 'capacity': 3, 'price_range': (4000, 5500), 'amenities': 'Attached Bathroom, AC, Smart TV, WiFi, Geyser, Mini Fridge, Balcony, Seating Area, Tea/Coffee Maker'},
            {'name': 'Family Suite', 'capacity': 4, 'price_range': (5500, 7500), 'amenities': 'Attached Bathroom, AC, Smart TV, WiFi, Geyser, Mini Fridge, Balcony, Dining Table, Sofa, Microwave'},
            {'name': 'Luxury Villa', 'capacity': 6, 'price_range': (8000, 12000), 'amenities': '2 Attached Bathrooms, AC in all rooms, Multiple TVs, WiFi, Geyser, Full Kitchen, Living Room, Dining Area, Private Balcony'},
        ]

        total_rooms = 0
        for resort in resorts:
            # Create 3-5 rooms per resort with different types
            import random
            num_rooms = random.randint(3, 5)
            
            for i in range(num_rooms):
                room_type = room_types[i % len(room_types)]
                price = Decimal(str(random.randint(room_type['price_range'][0], room_type['price_range'][1])))
                
                room = Room.objects.create(
                    resort=resort,
                    room_number=f'{room_type["name"][0]}{i+1}',
                    capacity=room_type['capacity'],
                    price_per_night=price,
                    room_aminities=room_type['amenities']
                )
                total_rooms += 1
                
                # Create 2-4 images per room using placeholder paths
                num_images = random.randint(2, 4)
                
                for j in range(num_images):
                    # Use placeholder image path - you can upload actual images later
                    # Format: room_images/resort_name_room_type_image_number.jpg
                    image_filename = f'room_images/{resort.name.replace(" ", "_")}_{room.room_number}_{j+1}.jpg'
                    
                    RoomImage.objects.create(
                        room=room,
                        image=image_filename
                    )

        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {total_rooms} rooms with images'))

        # Create Sample Users
        self.stdout.write('\nCreating sample users...')
        users_data = [
            {'phone_number': '+919876543210', 'name': 'Raj Kumar', 'email': 'raj.kumar@example.com', 'gender': 'Male'},
            {'phone_number': '+919876543211', 'name': 'Priya Sharma', 'email': 'priya.sharma@example.com', 'gender': 'Female'},
            {'phone_number': '+919876543212', 'name': 'Amit Patel', 'email': 'amit.patel@example.com', 'gender': 'Male'},
        ]

        users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                phone_number=user_data['phone_number'],
                defaults={
                    'name': user_data['name'],
                    'email': user_data['email'],
                    'gender': user_data['gender']
                }
            )
            if created:
                user.set_password('password123')  # Default password
                user.save()
                users.append(user)
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created user: {user.name}'))
            else:
                users.append(user)
                self.stdout.write(f'  → User already exists: {user.name}')

        # Create Sample Bookings
        if users:
            self.stdout.write('\nCreating sample bookings...')
            import random
            
            for i, user in enumerate(users):
                # Create 1-2 bookings per user
                num_bookings = random.randint(1, 2)
                
                for j in range(num_bookings):
                    resort = random.choice(resorts)
                    available_rooms = Room.objects.filter(resort=resort)
                    
                    if not available_rooms.exists():
                        continue
                    
                    room = random.choice(available_rooms)
                    
                    # Random check-in date (past or future)
                    days_offset = random.randint(-30, 60)
                    check_in = date.today() + timedelta(days=days_offset)
                    check_out = check_in + timedelta(days=random.randint(2, 7))
                    
                    # Calculate total price
                    num_nights = (check_out - check_in).days
                    total_amount = room.price_per_night * num_nights
                    
                    # Create Booking Attempt FIRST
                    attempt = BookingAttempt.objects.create(
                        user=user,
                        resort=resort,
                        check_in=check_in,
                        check_out=check_out,
                        guest_count=random.randint(1, room.capacity),
                        expires_at=timezone.now() + timedelta(hours=1),
                        status='completed'
                    )
                    
                    # Create Payment with the attempt
                    payment = Payment.objects.create(
                        attempt=attempt,
                        amount=total_amount,
                        provider='Razorpay',
                        provider_payment_id=f'pay_{random.randint(100000, 999999)}',
                        status='success'
                    )
                    
                    # Create Final Booking
                    status = 'confirmed' if days_offset >= 0 else 'confirmed'
                    booking = FinalBooking.objects.create(
                        user=user,
                        resort=resort,
                        check_in=check_in,
                        check_out=check_out,
                        status=status,
                        payment=payment
                    )
                    
                    # Create Booking Room
                    BookingRoom.objects.create(
                        booking=booking,
                        room=room
                    )
                    
                    # Create Booking Guests
                    num_guests = random.randint(1, room.capacity)
                    guest_names = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikas', 'Anjali']
                    for k in range(num_guests):
                        BookingGuest.objects.create(
                            booking=booking,
                            room=room,
                            name=random.choice(guest_names),
                            age=random.randint(18, 65)
                        )
                    
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Created booking for {user.name} at {resort.name}'))

        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('DATABASE SEEDING COMPLETE! 🎉'))
        self.stdout.write('='*60)
        self.stdout.write(f'  📍 Resorts created: {Resort.objects.count()}')
        self.stdout.write(f'  🏨 Rooms created: {Room.objects.count()}')
        self.stdout.write(f'  🖼️  Room images created: {RoomImage.objects.count()}')
        self.stdout.write(f'  👥 Users created: {len(users)}')
        self.stdout.write(f'  📅 Bookings created: {FinalBooking.objects.count()}')
        self.stdout.write('\n' + self.style.SUCCESS('Run "python manage.py runserver" to start testing!'))
        self.stdout.write('='*60 + '\n')
