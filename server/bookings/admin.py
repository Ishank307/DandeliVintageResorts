from django.contrib import admin
from .models import (
    User,
    Resort,
    Room,
    BookingAttempt,
    BookingAttemptRooms,
    RoomImage,
    GuestTemp,
    Payment,
    FinalBooking,
    BookingRoom,
    BookingGuest,
)

admin.site.register(User)
admin.site.register(Resort)

admin.site.register(BookingAttempt)
admin.site.register(BookingAttemptRooms)
admin.site.register(GuestTemp)
admin.site.register(Payment)
admin.site.register(FinalBooking)
admin.site.register(BookingRoom)
admin.site.register(BookingGuest)

class RoomImageInline(admin.StackedInline):
    model = RoomImage
    extra = 1          # number of empty image slots
    min_num = 1  
    
    
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    inlines = [RoomImageInline]