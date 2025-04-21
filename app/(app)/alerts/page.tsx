// Required for useState, event handlers
'use client';

import React, { useState, ChangeEvent } from 'react'; // Added ChangeEvent
import Image from 'next/image'; // For placeholder use if needed, though not in target
import { FaSearch, FaTimes } from 'react-icons/fa'; // Added FaTimes

// Define the structure for alert data
type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Crucial';

interface AlertData {
  id: number;
  name: string;
  time: string;
  severity: SeverityLevel;
  type: string;
  details?: string;
  location?: string;
}

// Placeholder Mock Data with more details
const mockAlerts: AlertData[] = [
  { id: 1, name: 'Mohamed Abdelaty', time: '4:18', severity: 'High', type: 'Blood Pressure', details: 'Systolic reading above threshold (185 mmHg).', location: 'Sector 7 Bridge' },
  { id: 2, name: 'Mohamed Abdelaty', time: '4:18', severity: 'Moderate', type: 'Blood Pressure', details: 'Diastolic reading elevated (95 mmHg).', location: 'Main St & 2nd Ave' },
  { id: 3, name: 'Rider Alpha', time: '5:02', severity: 'Moderate', type: 'Heart Rate', details: 'Heart rate exceeded 150 bpm during ride.', location: 'Highway 101 Exit 5' },
  { id: 4, name: 'Driver Beta', time: '5:15', severity: 'High', type: 'Impact Detected', details: 'Significant G-force detected (8g). Possible fall.', location: 'Industrial Park Rd' },
  { id: 5, name: 'Mohamed Abdelaty', time: '5:30', severity: 'High', type: 'Blood Pressure', details: 'Sustained high systolic pressure.', location: 'Downtown Tunnel' },
  { id: 6, name: 'Rider Gamma', time: '5:31', severity: 'Crucial', type: 'SOS Button', details: 'Manual SOS button activated by rider.', location: 'Near Lake View Point' },
  { id: 7, name: 'Driver Delta', time: '5:45', severity: 'Low', type: 'Low Battery', details: 'Helmet battery below 15%.', location: 'City Center Plaza' },
];

// Helper function to get Tailwind text color class based on severity
const getSeverityClass = (severity: AlertData['severity']): string => {
  switch (severity) {
    case 'Low': return 'text-green-500';
    case 'Moderate': return 'text-green-500';
    case 'High': return 'text-red-500';
    case 'Crucial': return 'text-red-500';
    default: return 'text-white';
  }
};

// === AlertCard Component (Ensure this definition exists ONLY ONCE) ===
interface AlertCardProps {
  alert: AlertData;
  onViewDetails: (alert: AlertData) => void; // Prop to handle click
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewDetails }) => {
  return (
    <div className="bg-orange-950/20 p-5 rounded-lg shadow-md flex flex-col justify-between h-full border border-orange-800/30">
      {/* Details Section */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Name:</span>
          <span className="text-white font-medium">{alert.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Id:</span>
          <span className="text-white font-medium">{alert.id}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="text-gray-400">Time:</span>
           <span className="text-white font-medium">{alert.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Severity Level:</span>
          <span className={`font-semibold ${getSeverityClass(alert.severity)}`}>
             {alert.severity}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Type:</span>
          <span className="text-white font-medium">{alert.type}</span>
        </div>
      </div>

      {/* Button Section - Calls onViewDetails prop */}
      <button
        onClick={() => onViewDetails(alert)} // Call handler passed from parent
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 mt-auto"
      >
        View Details
      </button>
    </div>
  );
};
// ======================================================================

// ViewAlertModal Component (No changes needed from previous version)
interface ViewAlertModalProps { isOpen: boolean; onClose: () => void; alert: AlertData | null; }
const ViewAlertModal: React.FC<ViewAlertModalProps> = ({ isOpen, onClose, alert }) => { if (!isOpen || !alert) return null; const additionalInfo = { location: alert.location || 'N/A', details: alert.details || 'No additional details.' }; return ( <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg relative border border-gray-700"><button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white" aria-label="Close modal"><FaTimes size={20} /></button><h3 className="text-xl font-semibold text-white mb-6 text-center">Alert Details</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
  <div className="space-y-3"><div className='border-b border-gray-700 pb-1'><p className="text-gray-400">Name</p><p className="text-white text-base font-medium">{alert.name}</p></div>
  <div className='border-b border-gray-700 pb-1'><p className="text-gray-400">id</p><p className="text-white text-base font-medium">{alert.id}</p></div>
  <div className='border-b border-gray-700 pb-1'><p className="text-gray-400">Severity Level</p><p className={`text-base font-semibold ${getSeverityClass(alert.severity)}`}>{alert.severity}</p></div><div className='border-b border-gray-700 pb-1'><p className="text-gray-400">Location</p><p className="text-white">{additionalInfo.location}</p></div></div><div className="space-y-3"><div className='border-b border-gray-700 pb-1'><p className="text-gray-400">Time</p><p className="text-white text-base font-medium">{alert.time}</p></div><div className='border-b border-gray-700 pb-1'><p className="text-gray-400">Type</p><p className="text-white text-base font-medium">{alert.type}</p></div><div className='border-b border-gray-700 pb-1'><p className="text-gray-400">Details</p><p className="text-white">{additionalInfo.details}</p></div></div></div><div className="mt-8 flex justify-end"><button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm">Close</button></div></div></div> ); };
// ================================


// --- Main Alerts Page Component ---
export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sensitivityFilter, setSensitivityFilter] = useState<SeverityLevel | 'All'>('All');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

  // Use mock data for now
  const alerts = mockAlerts;

  // Filtering Logic
  const filteredAlerts = alerts.filter(alert => {
      const searchMatch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        alert.id.toString().includes(searchTerm) ||
                        alert.type.toLowerCase().includes(searchTerm.toLowerCase());
      const sensitivityMatch = sensitivityFilter === 'All' || alert.severity === sensitivityFilter;
      return searchMatch && sensitivityMatch;
  });

  // Modal handlers
  const handleViewDetailsClick = (alert: AlertData) => { setSelectedAlert(alert); setIsViewModalOpen(true); };
  const closeModal = () => { setIsViewModalOpen(false); setSelectedAlert(null); }

  // Handler for select change
  const handleSensitivityChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setSensitivityFilter(e.target.value as SeverityLevel | 'All');
  };

  return (
    <>
      {/* Heading */}
      <h2 className="text-xl font-medium text-white mb-4">Alerts</h2>

      {/* Filter/Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sensitivity Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="sensitivity-filter" className="text-sm text-gray-400 flex-shrink-0">Sensitivity</label>
            <select id="sensitivity-filter" value={sensitivityFilter} onChange={handleSensitivityChange} className="bg-orange-950/20 border border-orange-800/30 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-orange-950/40 min-w-[120px] focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none pr-8 flex-grow" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}>
                <option value="All">All</option><option value="Low">Low</option><option value="Moderate">Moderate</option><option value="High">High</option><option value="Crucial">Crucial</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-auto sm:flex-grow">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"><FaSearch /></span>
            <input type="text" placeholder="Search driver name, ID, or type" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-orange-950/20 border border-orange-800/30 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" />
          </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onViewDetails={handleViewDetailsClick} />
        ))}
        {/* Empty State Messages */}
        {filteredAlerts.length === 0 && (alerts.length > 0 || searchTerm || sensitivityFilter !== 'All') && (<p className="text-gray-400 col-span-full text-center py-10">No alerts found matching criteria.</p>)}
        {alerts.length === 0 && (<p className="text-gray-400 col-span-full text-center py-10">No alerts available.</p>)}
      </div>

       {/* Render the View Modal */}
      <ViewAlertModal isOpen={isViewModalOpen} onClose={closeModal} alert={selectedAlert} />
    </>
  );
}