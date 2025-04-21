// app/(auth)/login/page.tsx
import React from 'react';
import LoginForm from '../../components/LoginForm'; // Adjust path: ../../components/LoginForm

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-black/95 to-black/90 p-4">
      <div className="w-full max-w-lg bg-black/40 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2">Login to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export const metadata = { title: 'Login - Smart Helmet' };