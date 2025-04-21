// app/components/TopNavbar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { FaBell, FaQuestionCircle, FaFontAwesome, FaRing } from 'react-icons/fa'; // Included potentially unused icons from your version
import { useAuthContext } from '../../context/AuthContext'; // Use context hook (adjust path)

const TopNavbar = () => { const { authUser, isLoading } = useAuthContext(); const userInitial = authUser?.name ? authUser.name.charAt(0).toUpperCase() : null;
    return ( <nav className="bg-black text-white p-4 shadow-md flex justify-between items-center h-[61px]"><Link href="/" className="text-xl font-semibold hover:text-gray-300">Smart Helmet</Link><div className="flex items-center gap-x-3"><button className="bg-gray-700 h-8 w-8 flex items-center justify-center rounded-full text-white text-sm font-bold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500" aria-label="User options" onClick={() => alert(authUser ? `User: ${authUser.name}`: 'Not logged in')}>{isLoading ? '' : (userInitial || 'A')}</button><button className="bg-gray-700 rounded-full p-1.5 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 relative" aria-label="Notifications" onClick={() => alert('Notifications clicked!')}><FaBell size={18} /></button>{/* Removed En button for brevity, add back if needed */}</div></nav> );
};
export default TopNavbar;