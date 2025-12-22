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
    Review
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

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "resort", "rating", "created_at")
    list_filter = ("rating", "resort")
    search_fields = ("user__name", "resort__name", "comment")
    ordering = ("-created_at",)