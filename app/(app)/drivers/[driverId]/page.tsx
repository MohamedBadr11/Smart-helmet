// Needed for hooks like useParams, useState, useEffect
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaHeartbeat, FaTint, FaEdit, FaArrowLeft } from 'react-icons/fa';
// Import Recharts components
import { LineChart, Line, Area, ResponsiveContainer, XAxis, YAxis} from 'recharts';
// Import dynamic for map
import dynamic from 'next/dynamic';

// Dynamically import the Map component
const HeatMap = dynamic(() => import('../../../components/HeatMap'), { // Verify path
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-gray-700 rounded"><p className="text-gray-400">Loading Map...</p></div>
});

// --- Data Structure ---
interface DriverData { id: string; name: string; imageUrl: string; phoneNumber?: string; status: 'Online' | 'Offline'; age?: number; bloodType?: string; }
const LOCAL_STORAGE_KEY = 'smartHelmetDrivers';

// Helper function to get data from localStorage
const getDriverById = (id: string): DriverData | undefined => { if (typeof window === 'undefined') return undefined; const savedDrivers = localStorage.getItem(LOCAL_STORAGE_KEY); if (savedDrivers) { try { const drivers: DriverData[] = JSON.parse(savedDrivers); const decodedId = decodeURIComponent(id); return drivers.find(driver => driver.id === decodedId); } catch (e) { console.error("Failed to parse drivers", e); return undefined; } } return undefined; };

// --- Placeholder Data for Charts ---
const detailedChartData = [ { name: 'A', uv: 100 }, { name: 'B', uv: 150 }, { name: 'C', uv: 120 }, { name: 'D', uv: 180 }, { name: 'E', uv: 160 }, { name: 'F', uv: 200 }, { name: 'G', uv: 170 }, { name: 'H', uv: 210 } ];
const gradientIdDetail = "detailChartGradient";

// --- Reusable Vital Card Component ---
interface VitalCardProps { icon: React.ElementType; iconBgClass: string; title: string; value: string | number | React.ReactNode; status: string; statusClass: string; children: React.ReactNode; }
const VitalCard: React.FC<VitalCardProps> = ({ icon: Icon, iconBgClass, title, value, status, statusClass, children }) => ( <div className="bg-orange-950/20 border border-orange-800/30 p-4 rounded-lg shadow-md flex flex-col h-full"><div className="flex items-center gap-3 mb-2"><div className={`p-2 rounded-md ${iconBgClass}`}><Icon className="text-orange-400" size={20}/></div><span className="text-gray-300 text-sm font-medium">{title}</span></div><div className="text-white text-3xl font-bold mb-1">{value}</div><div className={`text-xs px-2 py-0.5 rounded-full self-start ${statusClass} text-gray-200`}>{status}</div><div className="flex-grow mt-auto h-16">{children}</div></div> );

// --- Reusable Mini Area Chart ---
const MiniAreaChart = ({ data }: { data: any[] }) => ( <div className="h-full w-full -ml-4 -mr-4 -mb-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}><defs><linearGradient id={gradientIdDetail} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.4}/><stop offset="95%" stopColor="#f97316" stopOpacity={0.8}/></linearGradient></defs><XAxis dataKey="name" hide /><YAxis hide domain={['auto', 'auto']} /><Area type="monotone" dataKey="uv" stroke="none" fill={`url(#${gradientIdDetail})`} /><Line type="monotone" dataKey="uv" stroke={"#f97316"} strokeWidth={1.5} dot={false} activeDot={false} /></LineChart></ResponsiveContainer></div>);

// --- Helmet Pressure Card Component ---
// Added specific min-height to encourage vertical space
const HelmetPressureCard = () => { const helmetStatus = "Connected"; const connectionPeriod = "6hrs"; return ( <div className="bg-orange-950/20 border border-orange-800/30 p-6 rounded-lg shadow-md w-full h-full flex flex-col items-center min-h-[300px]"> {/* Added min-h */} <h1 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Helmet Pressure</h1><div className="mb-4 flex-grow flex items-center justify-center w-full overflow-hidden relative bg-[radial-gradient(ellipse_at_center,_rgba(251,146,60,0.15)_0%,_rgba(0,0,0,0)_70%)]"><Image src="/images/helmet.png" alt="Helmet" width={200} height={200} priority={false} className="object-contain max-w-full max-h-[70%] relative z-10"/></div><div className="flex justify-between items-baseline w-full pt-4 flex-shrink-0 text-sm"><div className="text-left"><span className="text-gray-400 text-xs uppercase tracking-wider">Status</span><span className="text-white font-semibold ml-2">{helmetStatus}</span></div><div className="text-right"><span className="text-gray-400 text-xs uppercase tracking-wider">Connection period</span><span className="text-white font-semibold ml-2">{connectionPeriod}</span></div></div></div>); };


// --- Driver Detail Page Component ---
export default function DriverDetailPage() {
    const params = useParams();
    const router = useRouter();
    const driverId = typeof params.driverId === 'string' ? decodeURIComponent(params.driverId) : undefined;
    const [driver, setDriver] = useState<DriverData | null | undefined>(undefined);

    useEffect(() => { if (driverId) { const foundDriver = getDriverById(driverId); setDriver(foundDriver || null); } else { setDriver(null); } }, [driverId]);

    if (driver === undefined) { return <div className="text-white p-6 text-center">Loading driver data...</div>; }
    if (!driver) { return ( <div className="text-center p-6"><p className="text-red-500 text-xl mb-4">Driver not found</p><Link href="/drivers" className="text-orange-500 hover:underline inline-flex items-center gap-1"><FaArrowLeft size={12}/> Back to Drivers List</Link></div>); }

    const driverDetails = { age: driver.age || 20, bloodType: driver.bloodType || 'O-', phoneNumber: driver.phoneNumber || '+2012345678910' };

    return (
        <div className="space-y-6">
            {/* Top Title */}
            <div className="flex justify-between items-center"><h1 className="text-2xl font-semibold text-white">{driver.name} <span className="text-lg text-gray-400 font-normal">{driver.id}</span></h1></div>

            {/* === MODIFIED: Main Grid Layout (Simpler 2x2 + Driver Info) === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Stacking Vitals and Helmet Pressure) */}
                
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"> 
                    {/* <VitalCard icon={FaHeartbeat} iconBgClass="bg-red-900/30" title="Heart Rate" value={<>98 <span className="text-base font-normal text-gray-400">bpm</span></>} status="Normal" statusClass="bg-gray-600"><MiniAreaChart data={detailedChartData} /></VitalCard> */}
                    {/* <VitalCard icon={FaTint} iconBgClass="bg-blue-900/30" title="Blood Pressure" value={<>102<span className="text-base font-normal text-gray-400"> / 72 mmHg</span></>} status="Normal" statusClass="bg-gray-600"><MiniAreaChart data={detailedChartData} /></VitalCard> */}

                    <div className="sm:col-span-2"> 
                        <HelmetPressureCard />
                    </div>
                </div>

                {/* Right Column (Driver Info + Location) */}
                <div className="flex flex-col gap-6 h-full"> {/* Takes 1/3 width */}
                    {/* Driver Info Card */}
                    <div className="bg-orange-950/20 border border-orange-800/30 p-4 rounded-lg shadow-md flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 mb-3"><Image src={driver.imageUrl || '/images/man.png'} alt={`Profile picture of ${driver.name}`} width={80} height={80} className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = '/images/man.png')} /></div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm w-full mb-2">
                            <span className="text-gray-400 text-right">Name</span><span className="text-white font-medium">{driver.name}</span>
                            <span className="text-gray-400 text-right">id</span><span className="text-white font-medium">{driver.id}</span>
                            <span className="text-gray-400 text-right">Phone Number</span><span className="text-white font-medium">{driverDetails.phoneNumber}</span>
                            <span className="text-gray-400 text-right">Age</span><span className="text-white font-medium">{driverDetails.age}</span>
                            <span className="text-gray-400 text-right">Blood type</span><span className="text-white font-medium">{driverDetails.bloodType}</span>
                            <span className="text-gray-400 text-right">Status</span><span className={`${driver.status === 'Online' ? 'text-green-500' : 'text-red-500'} font-medium`}>{driver.status}</span>
                        </div>
                    </div>
                     {/* Location Card */}
                    <div className="bg-orange-950/20 border border-orange-800/30 p-4 rounded-lg shadow-md flex flex-col flex-grow">
                        <h3 className="text-sm text-white uppercase tracking-wider mb-2">Current Location</h3>
                        <div className="flex-grow rounded overflow-hidden relative min-h-[200px]">
                             <HeatMap />
                        </div>
                    </div>
                </div>

            </div>
             {/* ========================================================== */}
        </div>
    );
}