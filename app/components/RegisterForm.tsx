// app/components/RegisterForm.tsx
'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- Re-import DriverData and LOCAL_STORAGE_KEY ---
// Need the full structure to save the new user correctly
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
interface DriverData {
  id: string; name: string; imageUrl: string; phoneNumber: string;
  status: 'Online' | 'Offline'; email: string; age: number; bloodType: BloodType | '';
  password?: string; // Add password field
}
const LOCAL_STORAGE_KEY = 'smartHelmetDrivers'; // Use the SAME key as drivers page
// ----------------------------------------------------

// Define expected form data structure for THIS form
interface RegistrationFormData {
    name: string; email: string; password: string; licenseNumber: string; // Not currently saved to DriverData, but in form
    helmetId: string; age: string; bloodType: BloodType | '';
    phoneNumber: string; relativePhoneNumber: string; // Not currently saved to DriverData
}

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '', email: '', password: '', licenseNumber: '', helmetId: '', age: '',
    bloodType: '', phoneNumber: '', relativePhoneNumber: ''
  });
  const router = useRouter();
  const bloodTypes: Exclude<BloodType, ''>[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.bloodType) { alert('Please select a blood type.'); return; }
    if (formData.password.length < 6) { alert('Password must be at least 6 characters.'); return; }
    const ageNumber = parseInt(formData.age, 10);
     if (isNaN(ageNumber) || ageNumber <= 0) { alert('Please enter a valid positive age.'); return; }
     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailPattern.test(formData.email)) { alert('Please enter a valid email address.'); return; }


    setIsLoading(true);
    console.log("Registration attempt with:", formData);

    // --- TODO: Replace simulation with actual API call ---
    // Simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Simulate Saving User to localStorage (INSECURE DEMO) ---
    try {
        const savedDriversRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const existingDrivers: DriverData[] = savedDriversRaw ? JSON.parse(savedDriversRaw) : [];

        // Create a basic DriverData object from the form
        // **IMPORTANT**: Generate a unique ID properly here or on backend!
        const newDriverId = `#${Date.now().toString().slice(-6)}`;

        // Check if email or ID already exists (basic check)
        if (existingDrivers.some(d => d.email === formData.email)) {
            alert(`Email ${formData.email} is already registered.`);
            setIsLoading(false);
            return;
        }
         if (existingDrivers.some(d => d.id === newDriverId)) {
             alert(`Generated ID ${newDriverId} already exists (retry needed).`);
             setIsLoading(false);
             return;
         }

        const newUser: DriverData = {
            id: newDriverId, // Need a proper unique ID generation
            name: formData.name,
            email: formData.email,
            password: formData.password, // <<< SAVE PASSWORD (INSECURE)
            age: ageNumber,
            bloodType: formData.bloodType,
            phoneNumber: formData.phoneNumber,
            imageUrl: '/images/man.png', // Default image
            status: 'Offline' // Default status
            // Note: licenseNumber, helmetId, relativePhoneNumber are not in DriverData here
        };

        const updatedDrivers = [...existingDrivers, newUser];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDrivers));
        console.log("Simulated save complete for:", newUser.name);

        alert('Registration successful! Please log in.');
        router.push('/login'); // Redirect to login page

    } catch (error) {
        console.error("Error saving registration data:", error);
        alert('An error occurred during registration.');
    } finally {
        setIsLoading(false);
    }
    // --- End Simulation ---
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    // --- Include the full form JSX from previous steps ---
    <form onSubmit={handleSubmit} className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Name</label><input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div className="relative"><label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label><input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Enter your password" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 pr-10"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform translate-y-[25%] text-gray-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}</button></div><div><label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-200 mb-1">License Number</label><input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="Enter license number" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div><label htmlFor="helmetId" className="block text-sm font-medium text-gray-200 mb-1">Helmet ID</label><input id="helmetId" name="helmetId" value={formData.helmetId} onChange={handleChange} placeholder="Enter helmet ID" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div><label htmlFor="age" className="block text-sm font-medium text-gray-200 mb-1">Age</label><input id="age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Enter your age" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div><label htmlFor="bloodType" className="block text-sm font-medium text-gray-200 mb-1">Blood Type</label><select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}><option value="" disabled>Select...</option>{bloodTypes.map(type => ( <option key={type} value={type}>{type}</option> ))}</select></div><div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200 mb-1">Phone Number</label><input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div className="md:col-span-2"><label htmlFor="relativePhoneNumber" className="block text-sm font-medium text-gray-200 mb-1">Relative's Phone Number</label><input id="relativePhoneNumber" name="relativePhoneNumber" type="tel" value={formData.relativePhoneNumber} onChange={handleChange} placeholder="Enter relative's phone number" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div></div> <button type="submit" disabled={isLoading} className="w-full mt-6 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:from-red-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">{isLoading ? 'Registering...' : 'Register'}</button> <p className="text-center text-gray-400 text-sm pt-2"> Already have an account?{" "} <Link href="/login" className="text-red-500 hover:text-red-400 hover:underline"> Login here </Link> </p> </form>
  );
};

export default RegisterForm;