// app/(app)/layout.tsx
'use client';
import React, { useEffect } from 'react';
import MainLayout from '../components/MainLayout'; // Import using alias
import { useAuthContext } from '../../context/AuthContext'; // Import using alias
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode; }) {
    const { authUser, isLoading } = useAuthContext();
    const router = useRouter();
    useEffect(() => { if (!isLoading && !authUser) { router.replace('/login'); } }, [authUser, isLoading, router]);
    if (isLoading) { return <div className="min-h-screen flex items-center justify-center bg-black text-white">Checking authentication...</div>; }
    if (authUser) { return <MainLayout>{children}</MainLayout>; }
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Redirecting...</div>;
}