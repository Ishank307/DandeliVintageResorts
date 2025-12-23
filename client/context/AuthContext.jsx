'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    requestOTP,
    verifyOTP,
    updateProfile,
    logout as apiLogout,
    getCurrentUser,
    isAuthenticated
} from '@/lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = () => {
            const authenticated = isAuthenticated();
            setIsAuth(authenticated);

            if (authenticated) {
                const currentUser = getCurrentUser();
                setUser(currentUser);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Request OTP for phone number
     */
    const sendOTP = async (phoneNumber) => {
        try {
            await requestOTP(phoneNumber);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    /**
     * Verify OTP and login
     */
    const login = async (phoneNumber, otp) => {
        try {
            const data = await verifyOTP(phoneNumber, otp);
            setUser(data.user);
            setIsAuth(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    
    const updateUserProfile = async (profileData) => {
        try {
            const data = await updateProfile(profileData);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        apiLogout();
        setUser(null);
        setIsAuth(false);
    };

    const value = {
        user,
        isAuth,
        loading,
        sendOTP,
        login,
        updateUserProfile,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
