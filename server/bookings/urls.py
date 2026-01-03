from django.urls import path
from .views import (
    AddGuestDetailsView,
    CreateRazorpayOrderView,
    HotelDetailView,
    VerifyPaymentView,
    ReviewCreateView,
    ReviewListView,
    ExploreView,
    MyBookingsView,
    BookingDetailView,
    check_coupon,
    request_otp,
    verify_otp,
    UpdateProfileView,
    RoomSearchView,
    SelectRoomView,
    get_banners
    # test
)

urlpatterns = [
    path("auth/otp/request/", request_otp, name="request_otp"),
    path("auth/otp/verify/", verify_otp, name="verify_otp"),
    path("auth/profile/update/", UpdateProfileView.as_view(), name="update_profile"),
    path("rooms/search/", RoomSearchView.as_view(), name="room-search"),
    path("booking/select-rooms/", SelectRoomView.as_view(), name="select-rooms"),
    path("booking/add-guests/", AddGuestDetailsView.as_view(), name="add-guests"),
    path(
        "booking/create-order/", CreateRazorpayOrderView.as_view(), name="create-order"
    ),
    path("booking/verify-payment/", VerifyPaymentView.as_view(), name="verify-payment"),
    path("hotels/<int:resort_id>/", HotelDetailView.as_view(), name="hotel-detail"),
    path("explore/", ExploreView.as_view(), name="explore"),
    path("reviews/create/", ReviewCreateView.as_view(), name="review-create"),
    path("reviews/<int:pk>/", ReviewListView.as_view(), name="review-list"),
    path("my-bookings/", MyBookingsView.as_view(), name="my-bookings"),
    path(
        "my-bookings/<int:booking_id>/",
        BookingDetailView.as_view(),
        name="booking-detail",
    ),
    path("coupon/", check_coupon, name="check-coupon"),
    path("banners/", get_banners, name="banners"),
    # path("test/", test, name="test"),
]
