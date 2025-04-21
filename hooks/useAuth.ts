// hooks/useAuth.ts
'use client'; // <<<=== ADD THIS DIRECTIVE AT THE VERY TOP ===<<<

import { useState, useEffect } from 'react';

const AUTH_KEY = 'isLoggedIn'; // Or 'smartHelmetAuthUser' if you changed it

// Your existing useAuth hook definition
export function useAuth() {
    // Initialize state to null to clearly indicate "loading" or "unknown" status
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        // This effect runs ONLY on the client, AFTER initial mount
        let currentLoginStatus = false; // Default assumption
        try {
            const storedValue = localStorage.getItem(AUTH_KEY);
            currentLoginStatus = storedValue === 'true';
        } catch (error) {
            console.error("Error reading auth status from localStorage", error);
        } finally {
            setIsLoggedIn(currentLoginStatus);
            setIsLoading(false); // Loading finished
        }
    }, []); // Empty dependency array ensures it runs once on mount

    // Login function might need name if TopNavbar uses it
    const login = (/* name?: string */) => { // Remove name param if not storing user object
        try {
            localStorage.setItem(AUTH_KEY, 'true'); // Just store 'true'
            setIsLoggedIn(true); // Update state immediately
             // console.log(`AuthContext: User ${name} logged in.`); // Remove if not storing name
        } catch (error) {
            console.error("Error saving auth status to localStorage", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem(AUTH_KEY);
            setIsLoggedIn(false); // Update state immediately
            console.log('Auth state cleared.');
            // Optional: Force immediate client-side redirect
             if (typeof window !== 'undefined') {
                 window.location.href = '/login'; // Simple browser redirect
             }
        } catch (error) {
            console.error("Error removing auth status from localStorage", error);
        }
    };

    // Return loading status along with login status
    // Return only isLoggedIn if not storing user object
    return { isLoggedIn, login, logout, isLoading };
}

// Helper function (optional)
// export function checkAuthStatus(): boolean { ... } // Keep if needed elsewhere