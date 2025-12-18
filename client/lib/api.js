// API Service for Dandeli Vintage Resorts Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper to get auth token
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

// Helper to handle responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }
    return response.json();
};

// ==================== Authentication APIs ====================

/**
 * Request OTP for phone number
 */
export const requestOTP = async (phoneNumber) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/request/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
    });
    return handleResponse(response);
};

/**
 * Verify OTP and login
 */
export const verifyOTP = async (phoneNumber, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            phone_number: phoneNumber,
            otp: otp
        }),
    });

    const data = await handleResponse(response);

    // Store tokens
    if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
    });

    const data = await handleResponse(response);

    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
};

/**
 * Logout user
 */
export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// ==================== Room Search API ====================

/**
 * Search for available rooms
 */
export const searchRooms = async ({ location, checkInDate, checkOutDate, guests }) => {
    const params = new URLSearchParams({
        location: location,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guests: guests.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/rooms/search/?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return handleResponse(response);
};

// ==================== Booking APIs ====================

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/bookings/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(bookingData),
    });

    return handleResponse(response);
};


/**
 * Get all bookings for current user
*/
export const getUserBookings = async () => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/bookings/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    });

    return handleResponse(response);
};

// ==================== Utility Functions ====================

/**
 * Format date to YYYY-MM-DD for API
 */
export const formatDateForAPI = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get full image URL
*/
export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;

    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${imageUrl}`;
};

// ==================== Hotel APIs ====================

/**
 * Get hotel details by ID
 */
export const getHotelDetails = async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return handleResponse(response);
};