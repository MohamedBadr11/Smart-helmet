// Use client for state, date pickers, modals, and map interaction
'use client';

import React, { useState, useMemo } from 'react';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
// Import Recharts components
import {
  LineChart, Line, Area, ResponsiveContainer, PieChart, Pie, Cell,
   XAxis, YAxis, Dot
} from 'recharts';
// Import DatePicker and its CSS
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// Import date-fns for date comparison
import { isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
// Import dynamic for map
import dynamic from 'next/dynamic';

// --- Dynamic Import for Map Component ---
// Ensures Leaflet only loads on the client-side
const HeatMap = dynamic(() => import('../../components/HeatMap'), { // Adjust path if needed
    ssr: false, // Disable SSR is crucial
    loading: () => <div className="flex items-center justify-center h-full bg-gray-700 rounded"><p className="text-gray-400">Loading Map...</p></div> // Loading placeholder
});

// --- Placeholder Data ---
interface DatedChartData { date: string; uv: number; }
const datedChartData: DatedChartData[] = [
  { date: '2023-10-01', uv: 400 }, { date: '2023-10-02', uv: 300 }, { date: '2023-10-03', uv: 200 },
  { date: '2023-10-04', uv: 278 }, { date: '2023-10-05', uv: 189 }, { date: '2023-10-06', uv: 239 },
  { date: '2023-10-07', uv: 349 }, { date: '2023-10-08', uv: 410 }, { date: '2023-10-09', uv: 310 },
  { date: '2023-10-10', uv: 250 }, { date: '2023-10-11', uv: 290 }, { date: '2023-10-12', uv: 320 },
];
const severityData = [
  { name: 'Low', value: 400 }, { name: 'Moderate', value: 300 },
  { name: 'High', value: 300 }, { name: 'Crucial', value: 200 },
];
const severityColors = ['#22c55e', '#3b82f6', '#f97316', '#ef4444'];

// --- Reusable Stat Card Component ---
interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  valueClassName?: string;
  subValue?: string;
  children?: React.ReactNode;
  onNavigate?: () => void; // Used to open details modal
}
const StatCard: React.FC<StatCardProps> = ({ title, value, valueClassName = 'text-orange-500', subValue, children, onNavigate }) => (
  <div className="bg-gray-950 p-4 rounded-lg shadow-md flex flex-col h-full">
    <div className="flex justify-between items-start mb-1">
      <h3 className="text-sm text-white uppercase tracking-wider">{title}</h3>
      {onNavigate && ( <button onClick={onNavigate} className="text-orange-500 hover:text-orange-400"><FaArrowRight size={16} /></button> )}
    </div>
    <div className="mb-2">
      <p className={`text-2xl font-bold mt-1 ${valueClassName}`}>{value}</p>
      {subValue && <p className="text-xs text-green-500">{subValue}</p>}
    </div>
    <div className="flex-grow mt-auto">{children}</div>
  </div>
);

// --- Analysis Details Modal Component (Ensure only ONE definition) ---
interface AnalysisDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardTitle: string | null;
}
const AnalysisDetailsModal: React.FC<AnalysisDetailsModalProps> = ({ isOpen, onClose, cardTitle }) => {
    if (!isOpen || !cardTitle) return null;
    let modalContent = <p className="text-gray-300">Detailed information for {cardTitle} will be displayed here.</p>;
    // Example: Conditionally render the map in the modal if Heat Map card was clicked
    if (cardTitle === 'Heat Map') modalContent = <div className="h-80 w-full"><HeatMap /></div>;
     else if (cardTitle === 'Severity Distribution') modalContent = <p className="text-gray-300">Breakdown of severity levels and trends...</p>;
     else modalContent = <p className="text-gray-300">Displaying expanded chart, historical data, and insights for {cardTitle}...</p>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-xl relative border border-gray-700">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white" aria-label="Close modal"> <FaTimes size={20} /> </button>
                <h3 className="text-xl font-semibold text-white mb-6 text-center">{cardTitle} Details</h3>
                <div className="min-h-[200px]">{modalContent}</div>
                <div className="mt-6 flex justify-end"><button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm"> Close </button></div>
            </div>
        </div>
    );
};
// =======================================================================


// --- Main Analysis Page Component ---
export default function AnalysisPage() {
  const gradientId = "chartGradientFill";
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCardTitle, setSelectedCardTitle] = useState<string | null>(null);

  // Custom Dot component
  const renderLastDot = (props: any) => { const { cx, cy, index, data } = props; const currentDataLength = data?.length || 0; const isLastPoint = index === currentDataLength - 1; if (isLastPoint && currentDataLength > 0) { return (<Dot key={`line-dot-${index}`} cx={cx} cy={cy} r={3.5} fill="#ffffff" stroke={"#f97316"} strokeWidth={1.5} />); } return null; };

  // Filtered data based on selected dates
  const filteredChartData = useMemo(() => { const start = startDate ? startOfDay(startDate) : null; const end = endDate ? endOfDay(endDate) : null; return datedChartData.filter(item => { try { const itemDateParts = item.date.split('-'); const itemDate = new Date(parseInt(itemDateParts[0]), parseInt(itemDateParts[1]) - 1, parseInt(itemDateParts[2])); if (isNaN(itemDate.getTime())) return false; const afterStart = start ? !isBefore(itemDate, start) : true; const beforeEnd = end ? !isAfter(itemDate, end) : true; return afterStart && beforeEnd; } catch (e) { console.error("Error parsing date:", item.date, e); return false; } }); }, [startDate, endDate]);

  // --- Reusable Area Chart Component (Single Definition) ---
  const AreaChartCard = ({ data }: { data: DatedChartData[] }) => {
    const renderDotForThisChart = (props: any) => renderLastDot({...props, data});
    return ( <div className="h-24 w-full -ml-2 -mr-2"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.4}/><stop offset="95%" stopColor="#f97316" stopOpacity={0.8}/></linearGradient></defs><XAxis dataKey="date" hide /><YAxis hide domain={['auto', 'auto']} /><Area type="monotone" dataKey="uv" stroke="none" fill={`url(#${gradientId})`} /><Line type="monotone" dataKey="uv" stroke={"#f97316"} strokeWidth={1.5} dot={renderDotForThisChart} activeDot={false} /></LineChart></ResponsiveContainer></div>);
  };
  // =======================================================

  // Modal Handlers
  const openDetailsModal = (title: string) => { setSelectedCardTitle(title); setIsDetailsModalOpen(true); };
  const closeDetailsModal = () => { setIsDetailsModalOpen(false); setSelectedCardTitle(null); };

  return (
    <>
      {/* Heading */}
      <h2 className="text-xl font-medium text-white mb-6">Analysis</h2>
      {/* Filters Row with DatePickers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
         <div className="flex items-center gap-2 w-full sm:w-auto"><label htmlFor="date-from" className="text-sm text-gray-400 flex-shrink-0">From</label><DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} isClearable placeholderText="MM/DD/YYYY" dateFormat="MM/dd/yyyy" className="w-full sm:w-32 bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm" wrapperClassName="w-full sm:w-auto" /></div>
         <div className="flex items-center gap-2 w-full sm:w-auto"><label htmlFor="date-to" className="text-sm text-gray-400 flex-shrink-0">To</label><DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} isClearable placeholderText="MM/DD/YYYY" dateFormat="MM/dd/yyyy" className="w-full sm:w-32 bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm" wrapperClassName="w-full sm:w-auto"/></div>
      </div>
      {/* Stats Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Accidents" value="30% Less" onNavigate={() => openDetailsModal('Total Accidents')}> <AreaChartCard data={filteredChartData} /> </StatCard>
        <StatCard title="Active Riders" value={150} onNavigate={() => openDetailsModal('Active Riders')}> <AreaChartCard data={filteredChartData} /> </StatCard>
        <StatCard title="Average Heart Rate" value="85 bpm" onNavigate={() => openDetailsModal('Average Heart Rate')}> <AreaChartCard data={filteredChartData} /> </StatCard>
      </div>
      {/* Stats Grid - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard title="Total Riders" value="2000 Rider" valueClassName="text-white" onNavigate={() => openDetailsModal('Total Riders')}> <AreaChartCard data={filteredChartData} /> </StatCard>
        {/* Heat Map Card */}
        <div className="bg-orange-950/20 border border-orange-800/30 p-4 rounded-lg shadow-md relative flex flex-col h-full min-h-[250px]">
           <div className="flex justify-between items-start mb-2 flex-shrink-0"> <h3 className="text-sm text-white uppercase tracking-wider">Heat Map</h3> <button onClick={() => openDetailsModal('Heat Map')} className="text-orange-500 hover:text-orange-400"><FaArrowRight size={16} /></button> </div>
           <div className="flex-grow rounded overflow-hidden relative"> <HeatMap /> </div>
        </div>
      </div>
      {/* Stats Grid - Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
         <StatCard title="Severity Distribution" value="" valueClassName="text-white" onNavigate={() => openDetailsModal('Severity Distribution')}>
            <div className="flex items-center justify-between gap-x-4 h-32">
              <div className="w-2/3 h-full">{/* Chart */}<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={severityData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} fill="#8884d8" paddingAngle={2} dataKey="value" labelLine={false}>{severityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={severityColors[index % severityColors.length]} />))}</Pie></PieChart></ResponsiveContainer></div>
              <div className="w-1/3 text-xs space-y-1.5 text-gray-300">{/* Legend */}{severityData.map((entry, index) => (<div key={entry.name} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: severityColors[index % severityColors.length] }}></span><span>{entry.name}</span></div>))}</div>
            </div>
         </StatCard>
      </div>

      {/* Render the Details Modal */}
      <AnalysisDetailsModal isOpen={isDetailsModalOpen} onClose={closeDetailsModal} cardTitle={selectedCardTitle} />
    </>
  );
}