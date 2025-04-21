// app/(auth)/layout.tsx
'use client';
import React, { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext'; // Import using alias
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode; }) {
    const { authUser, isLoading } = useAuthContext();
    const router = useRouter();
    useEffect(() => { if (!isLoading && authUser) { router.replace('/analysis'); } }, [authUser, isLoading, router]);
    if (isLoading) { return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>; }
    if (!authUser) { return <>{children}</>; }
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Redirecting...</div>;
}