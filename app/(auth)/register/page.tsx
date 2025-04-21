// app/(auth)/register/page.tsx
import React from 'react';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';
import RegisterForm from '../../components/RegisterForm'; // Adjust path: ../../components/RegisterForm

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-black/95 to-black/90 p-4">
      <div className="w-full max-w-lg bg-black/40 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-xl relative">
        <Link href="/" className="absolute top-4 left-4 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors">
            <FaChevronLeft size={20} /><span className="sr-only">Back to Home</span>
        </Link>
        <div className="mb-8 text-center pt-8 sm:pt-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Register to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export const metadata = { title: 'Register - Smart Helmet' };