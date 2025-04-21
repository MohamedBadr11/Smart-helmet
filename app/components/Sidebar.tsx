// app/components/Sidebar.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaChartBar, FaRegBell, FaUsers, FaSignOutAlt, FaCircle } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext'; // Use context hook (adjust path)

interface NavItem { href: string; icon: React.ElementType; label: string; }
const navItems: NavItem[] = [ { href: '/analysis', icon: FaChartBar, label: 'Analysis' }, { href: '/alerts', icon: FaRegBell, label: 'Alerts' }, { href: '/drivers', icon: FaUsers, label: 'Drivers' }, ];

const Sidebar = () => { const [isExpanded, setIsExpanded] = useState(false); const pathname = usePathname(); const router = useRouter(); const { logout } = useAuthContext(); const toggleSidebar = () => { setIsExpanded(!isExpanded); }; const handleLogout = () => { logout(); /* Redirect is handled by layout or optional force in hook */ };
    return ( <aside className={` flex flex-col h-full bg-black text-white transition-all duration-300 ease-in-out shadow-md ${isExpanded ? 'w-64' : 'w-20'} `}> <div className={`flex items-center p-4 h-[61px] ${isExpanded ? 'justify-end' : 'justify-center'} border-b border-gray-700`}><button onClick={toggleSidebar} className="p-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>{isExpanded ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}</button></div><nav className="flex-grow px-4 pt-4 overflow-y-auto"><ul className="space-y-2">{navItems.map((item) => { const isActive = pathname === '/' ? item.href === '/analysis' : pathname.startsWith(item.href); return ( <li key={item.href}><Link href={item.href} className={` flex items-center p-3 space-x-3 rounded-md transition-colors duration-200 relative group ${isActive ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white' } ${!isExpanded ? 'justify-center' : ''} `}><item.icon size={20} className="flex-shrink-0" />{isExpanded && <span className="font-medium flex-1 truncate">{item.label}</span>}{isActive && (<span className="absolute right-0 top-0 h-full w-1 bg-white rounded-l-sm"></span>)}</Link></li>); })}</ul></nav><div className="p-4 mt-auto border-t border-gray-700"><button onClick={handleLogout} className={` flex items-center w-full p-3 space-x-3 rounded-md transition-colors duration-200 text-gray-400 hover:bg-gray-700 hover:text-white ${!isExpanded ? 'justify-center' : ''} `}><FaSignOutAlt size={20} />{isExpanded && <span className="font-medium">Logout</span>}</button></div></aside> );
};
export default Sidebar;