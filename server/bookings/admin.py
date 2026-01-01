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
    Review,
    Coupon
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone_number", "is_staff", "is_active")
    search_fields = ("name", "email", "phone_number")
    list_filter = ("is_staff", "is_active")

@admin.register(Resort)
class ResortAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "contact_number")
    search_fields = ("name", "location")

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_percentage", "active")
    list_filter = ("active",)
    search_fields = ("code",)

# @admin.register(BookingAttempt)
# class BookingAttemptAdmin(admin.ModelAdmin):
#     list_display = ("id", "user", "resort", "status", "expires_at")
#     list_filter = ("status", "resort")
#     search_fields = ("user__name", "user__phone_number")

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "attempt", "get_coupon", "type", "amount", "status", "provider_payment_id")
    list_filter = ("status", "type")
    search_fields = ("provider_payment_id", "attempt__user__name", "attempt__coupon__code")

    @admin.display(description="Coupon Used")
    def get_coupon(self, obj):
        return obj.attempt.coupon if obj.attempt and obj.attempt.coupon else "No Coupon"

@admin.register(FinalBooking)
class FinalBookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "resort", "get_coupon", "check_in", "check_out", "status")
    list_filter = ("status", "resort", "check_in")
    search_fields = ("user__name", "user__phone_number", "id", "payment__attempt__coupon__code")
    date_hierarchy = "check_in"

    @admin.display(description="Coupon Used")
    def get_coupon(self, obj):
        if obj.payment and obj.payment.attempt and obj.payment.attempt.coupon:
            return obj.payment.attempt.coupon.code
        return "No Coupon"

class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("room_number", "resort", "capacity", "price_per_night")
    list_filter = ("resort", "capacity")
    inlines = [RoomImageInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "resort", "rating", "created_at")
    list_filter = ("rating", "resort")
    search_fields = ("user__name", "resort__name", "comment")
    ordering = ("-created_at",)

# Register remaining simple models
admin.site.register(BookingAttempt) # Re-enabled but simple
admin.site.register(BookingAttemptRooms)
admin.site.register(GuestTemp)
admin.site.register(BookingRoom)
admin.site.register(BookingGuest)