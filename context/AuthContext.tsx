// context/AuthContext.tsx
'use client'; // Essential for using hooks

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- Types ---
interface AuthUser {
    name: string;
    email: string;
}

interface AuthContextType {
    authUser: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- localStorage Key ---
const AUTH_STORAGE_KEY = 'smartHelmetAuthUser'; // Key for logged-in user info

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth status on mount
    useEffect(() => {
        let user: AuthUser | null = null;
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                 user = JSON.parse(storedUser);
                 if (!user || typeof user.name !== 'string' || typeof user.email !== 'string') {
                     user = null; localStorage.removeItem(AUTH_STORAGE_KEY);
                 }
            }
        } catch (error) { console.error("Error loading auth user", error); user = null; localStorage.removeItem(AUTH_STORAGE_KEY); }
        finally { setAuthUser(user); setIsLoading(false); }
    }, []);

    const login = (user: AuthUser) => {
        if (!user || !user.name || !user.email) { console.error("Invalid user data"); return; }
        try { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user)); setAuthUser(user); console.log(`AuthContext: User ${user.name} logged in.`); }
        catch (error) { console.error("Error saving auth user", error); }
    };

    const logout = () => {
         try { localStorage.removeItem(AUTH_STORAGE_KEY); setAuthUser(null); console.log('AuthContext: User logged out.'); if (typeof window !== 'undefined') { window.location.href = '/login'; } }
         catch (error) { console.error("Error removing auth user", error); }
    };

    const value = { authUser, isLoading, login, logout };

    return ( <AuthContext.Provider value={value}> {children} </AuthContext.Provider> );
};

// --- Custom Hook to use Auth Context ---
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};