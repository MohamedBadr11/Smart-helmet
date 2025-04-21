// Required for useState, event handlers, and useEffect
'use client';

import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// ------------------------------
// Data Structure
// ------------------------------
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
interface DriverData {
  id: string; name: string; imageUrl: string; phoneNumber: string; status: 'Online' | 'Offline'; email: string; age: number; bloodType: BloodType | '';
}

// ------------------------------
// Initial Mock Data
// ------------------------------
const initialMockDrivers: DriverData[] = [ { id: '#1122589', name: 'Name 1', imageUrl: '/images/man.png', phoneNumber: '555-0101', status: 'Online', email: 'name1@example.com', age: 30, bloodType: 'A+' }, { id: '#1122590', name: 'Name 2', imageUrl: '/images/man.png', phoneNumber: '555-0102', status: 'Offline', email: 'name2@example.com', age: 25, bloodType: 'O-' }, { id: '#1122591', name: 'Name 3', imageUrl: '/images/man.png', phoneNumber: '555-0103', status: 'Online', email: 'name3@example.com', age: 41, bloodType: 'B+' }, { id: '#1122592', name: 'Name 4', imageUrl: '/images/man.png', phoneNumber: '555-0104', status: 'Online', email: 'name4@example.com', age: 29, bloodType: 'AB+'}, ];

// ------------------------------
// LocalStorage Key
// ------------------------------
const LOCAL_STORAGE_KEY = 'smartHelmetDrivers';

// ------------------------------
// Driver Card Component
// ------------------------------
interface DriverCardProps { driver: DriverData; onViewDetails: (driver: DriverData) => void; onDelete: (driver: DriverData) => void; onEdit: (driver: DriverData) => void; }
const DriverCard: React.FC<DriverCardProps> = ({ driver, onViewDetails, onDelete, onEdit }) => { const handleCallDriver = (id: string, phone?: string) => { if (phone) { alert(`Calling ${driver.name} at ${phone} (ID: ${id})`); } else { alert(`No phone number available for driver ID: ${id}`); } }; return ( <div className="bg-orange-950/20 border border-orange-800/30 p-6 rounded-lg shadow-md flex flex-col items-center space-y-4 h-full relative group"><div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10"><button onClick={(e) => { e.stopPropagation(); onEdit(driver); }} className="p-1.5 bg-blue-600/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700" aria-label={`Edit driver ${driver.name}`} title="Edit Driver"><FaEdit size={12} /></button><button onClick={(e) => { e.stopPropagation(); onDelete(driver); }} className="p-1.5 bg-red-600/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700" aria-label={`Delete driver ${driver.name}`} title="Delete Driver"><FaTrash size={12} /></button></div><div className="mt-8 w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700"><Image src={driver.imageUrl || '/images/man.png'} alt={`Profile picture of ${driver.name}`} width={96} height={96} className="object-cover w-full h-full" priority={false} onError={(e) => (e.currentTarget.src = '/images/man.png')} /></div><div className="text-center"><p className="text-white font-semibold text-lg">{driver.name}</p><p className="text-gray-400 text-sm">{driver.id}</p></div><div className="w-full flex flex-col space-y-3 mt-auto pt-4"><button onClick={() => onViewDetails(driver)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"> View Driver </button><button onClick={() => handleCallDriver(driver.id, driver.phoneNumber)} disabled={!driver.phoneNumber} className={`w-full bg-transparent hover:bg-orange-600/20 border font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm ${ driver.phoneNumber ? 'border-orange-600 text-white hover:text-gray-200' : 'border-gray-600 text-gray-600 cursor-not-allowed'}`}> Call Driver </button></div></div>); };

// ------------------------------
// Delete Confirmation Modal Component (Single Definition)
// ------------------------------
interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    driverName: string | undefined;
}
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, driverName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-sm relative border border-red-500/50">
                <h3 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to delete driver "{driverName || 'this driver'}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm"> Cancel </button>
                    <button type="button" onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm"> Delete </button>
                </div>
            </div>
        </div>
    );
};
// ============================================================= // End of Single DeleteConfirmModal definition

// ------------------------------
// Add/Edit Driver Form Modal Component
// ------------------------------
interface DriverFormModalProps { mode: 'add' | 'edit'; isOpen: boolean; onClose: () => void; onSubmit: (driverData: DriverData, originalId?: string) => void; initialData?: DriverData | null; }
const DriverFormModal: React.FC<DriverFormModalProps> = ({ mode, isOpen, onClose, onSubmit, initialData }) => { const [name, setName] = useState(''); const [imageUrl, setImageUrl] = useState(''); const [driverId, setDriverId] = useState(''); const [phoneNumber, setPhoneNumber] = useState(''); const [email, setEmail] = useState(''); const [age, setAge] = useState(''); const [bloodType, setBloodType] = useState<BloodType | ''>(''); const [status, setStatus] = useState<'Online'|'Offline'>('Offline'); const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']; useEffect(() => { if (isOpen) { if (mode === 'edit' && initialData) { setName(initialData.name); setImageUrl(initialData.imageUrl || ''); setDriverId(initialData.id); setPhoneNumber(initialData.phoneNumber || ''); setEmail(initialData.email || ''); setAge(initialData.age?.toString() || ''); setBloodType(initialData.bloodType || ''); setStatus(initialData.status); } else { setName(''); setImageUrl(''); setDriverId(''); setPhoneNumber(''); setEmail(''); setAge(''); setBloodType(''); setStatus('Offline');} } }, [isOpen, mode, initialData]); const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!name || !driverId || !phoneNumber || !email || !age || !bloodType) { alert(`Please fill in all required fields: Name, ID, Phone Number, Email, Age, and Blood Type.`); return; } const ageNumber = parseInt(age, 10); if (isNaN(ageNumber) || ageNumber <= 0) { alert('Please enter a valid positive number for age.'); return; } const urlPattern = /^(http|https):\/\/[^ "]+$/; if (imageUrl && !urlPattern.test(imageUrl)) { alert('Please enter a valid image URL or leave blank.'); return; } const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (email && !emailPattern.test(email)) { alert('Please enter a valid email address.'); return; } onSubmit({ id: driverId, name, imageUrl: imageUrl || '/images/man.png', phoneNumber, email, age: ageNumber, bloodType, status }, mode === 'edit' ? initialData?.id : undefined ); }; if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm"><div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg relative border border-gray-700"><button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white" aria-label="Close modal"> <FaTimes size={20} /> </button><h3 className="text-xl font-semibold text-white mb-6">{mode === 'add' ? 'Add New Driver' : 'Edit Driver'}</h3><form onSubmit={handleSubmit}><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6"><div><label htmlFor="driverName" className="block text-sm font-medium text-gray-300 mb-1"> Driver Name <span className="text-red-500">*</span> </label><input type="text" id="driverName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div><label htmlFor="driverId" className="block text-sm font-medium text-gray-300 mb-1"> Driver ID <span className="text-red-500">*</span> </label><input type="text" id="driverId" value={driverId} onChange={(e) => setDriverId(e.target.value)} required placeholder="#1234567" className={`w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500`}/></div><div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1"> Phone Number <span className="text-red-500">*</span> </label><input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="e.g., 555-0100" className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"/></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1"> Email <span className="text-red-500">*</span> </label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="driver@example.com" className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"/></div><div><label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1"> Age <span className="text-red-500">*</span> </label><input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} required min="1" placeholder="e.g., 25" className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"/></div><div><label htmlFor="bloodType" className="block text-sm font-medium text-gray-300 mb-1"> Blood Type <span className="text-red-500">*</span> </label><select id="bloodType" name="bloodType" value={bloodType} onChange={(e: ChangeEvent<HTMLSelectElement>) => setBloodType(e.target.value as BloodType | '')} required className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}><option value="" disabled>Select Blood Type</option>{bloodTypes.map(type => ( <option key={type} value={type}>{type}</option> ))}</select></div><div className="sm:col-span-2"><label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1"> Image URL (Optional) </label><input type="url" id="imageUrl" value={imageUrl} placeholder="https://example.com/image.png" onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500" /><p className="text-xs text-gray-500 mt-1">Enter URL or leave blank for default.</p></div></div><div className="flex justify-end gap-4 pt-2"><button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm"> Cancel </button><button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md text-sm"> {mode === 'add' ? 'Add Driver' : 'Save Changes'} </button></div></form></div></div>); };


// ------------------------------
// Main Drivers Page Component
// ------------------------------
export default function DriversPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'Offline'>('All');
    const [drivers, setDrivers] = useState<DriverData[]>(initialMockDrivers);
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
    const [driverToDelete, setDriverToDelete] = useState<DriverData | null>(null);

    // Load/Save Effects for localStorage
    useEffect(() => { const savedDrivers = localStorage.getItem(LOCAL_STORAGE_KEY); if (savedDrivers) { try { setDrivers(JSON.parse(savedDrivers)); } catch (e) { console.error("Failed to parse drivers", e); } } setIsLoaded(true); }, []);
    useEffect(() => { if (isLoaded) { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drivers)); } }, [drivers, isLoaded]);

    // Filtering Logic
    const filteredDrivers = drivers.filter(driver => { const searchMatch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || driver.id.toLowerCase().includes(searchTerm.toLowerCase()); const statusMatch = statusFilter === 'All' || driver.status === statusFilter; return searchMatch && statusMatch; });

    // --- Modal Open/Close Handlers ---
    const openAddModal = () => { setModalMode('add'); setSelectedDriver(null); setIsFormModalOpen(true); };
    const openEditModal = (driver: DriverData) => { setModalMode('edit'); setSelectedDriver(driver); setIsFormModalOpen(true); };
    const openDeleteModal = (driver: DriverData) => { setDriverToDelete(driver); setIsDeleteModalOpen(true); };
    const closeModal = () => { setIsFormModalOpen(false); setIsDeleteModalOpen(false); setSelectedDriver(null); setDriverToDelete(null); };

    // --- Data Handling Functions ---
    const handleFormSubmit = (driverData: DriverData, originalId?: string) => { const conflictingDriver = drivers.find(d => d.id === driverData.id && d.id !== originalId ); if (conflictingDriver) { alert(`Driver ID ${driverData.id} already exists for another driver. Please use a unique ID.`); return; } if (modalMode === 'add') { setDrivers(prev => [...prev, driverData]); } else if (modalMode === 'edit' && selectedDriver) { setDrivers(prev => prev.map(d => d.id === originalId ? driverData : d )); } closeModal(); }; // Use originalId to find element to replace
    const handleDeleteConfirm = () => { if (driverToDelete) { setDrivers(prev => prev.filter(d => d.id !== driverToDelete.id)); } closeModal(); };

    // Navigation handler
     const handleViewDetailsClick = (driver: DriverData) => { const encodedId = encodeURIComponent(driver.id); router.push(`/drivers/${encodedId}`); };

    if (!isLoaded) { return null; }

    return (
        <>
            <h2 className="text-xl font-medium text-white mb-6">Drivers</h2>
            <div className="flex flex-wrap items-center gap-4 mb-8">
                 <button onClick={openAddModal} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0"> <FaPlus size={12} /> Add driver </button>
                <div className='flex items-center gap-2 flex-shrink-0'><label htmlFor="status-filter" className="text-gray-400 text-sm">Status</label><select id="status-filter" value={statusFilter} onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'All' | 'Online' | 'Offline')} className="bg-orange-950/20 border border-orange-800/30 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-orange-950/40 min-w-[110px] focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none pr-8 flex-grow" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}> <option value="All">All</option> <option value="Online">Online</option> <option value="Offline">Offline</option> </select></div>
                <div className="relative flex-grow min-w-[200px]"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"><FaSearch /></span><input type="text" placeholder="Search driver by name or ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-orange-950/20 border border-orange-800/30 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDrivers.map((driver) => ( <DriverCard key={driver.id} driver={driver} onViewDetails={handleViewDetailsClick} onDelete={openDeleteModal} onEdit={openEditModal} /> ))}
                {filteredDrivers.length === 0 && (drivers.length > 0 || searchTerm || statusFilter !== 'All') && (<p className="text-gray-400 col-span-full text-center py-10">No drivers found matching criteria.</p>)}
                {drivers.length === 0 && (<p className="text-gray-400 col-span-full text-center py-10">No drivers added yet.</p>)}
            </div>
            <DriverFormModal mode={modalMode} isOpen={isFormModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} initialData={selectedDriver} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={closeModal} onConfirm={handleDeleteConfirm} driverName={driverToDelete?.name} />
        </>
    );
}