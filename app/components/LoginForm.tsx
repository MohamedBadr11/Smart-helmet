// app/components/LoginForm.tsx
'use client';
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext'; // Import using alias
import { useRouter } from 'next/navigation';

// Interface and Key needed only for validation logic inside this component
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
interface DriverData { id: string; name: string; imageUrl: string; phoneNumber: string; status: 'Online' | 'Offline'; email: string; age: number; bloodType: BloodType | ''; password?: string; }
const LOCAL_STORAGE_KEY = 'smartHelmetDrivers'; // Key for driver list

const LoginForm = () => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext(); // Use context login
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setIsLoading(true); setError(null); try { const savedDriversRaw = localStorage.getItem(LOCAL_STORAGE_KEY); if (!savedDriversRaw) { setError('Registration data not found.'); setIsLoading(false); return; } const registeredUsers: DriverData[] = JSON.parse(savedDriversRaw); const user = registeredUsers.find(u => u.email?.toLowerCase() === email.toLowerCase()); if (user && user.password && user.password === password) { console.log('Login successful for:', user.name); login({ name: user.name, email: user.email }); router.replace('/analysis'); return; } else { setError('Incorrect email or password.'); } } catch (err) { console.error("Error during login check:", err); setError('An error occurred.'); } finally { setIsLoading(false); } };
  return ( <form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label><input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"/></div><div><label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 pr-10"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}</button></div></div>{error && ( <p className="text-sm text-red-500 text-center">{error}</p> )} <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:from-red-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">{isLoading ? 'Logging in...' : <><FaSignInAlt className="mr-2" size={16} /> Login</> }</button> <p className="text-center text-gray-400 text-sm"> Don't have an account?{" "} <Link href="/register" className="text-red-500 hover:text-red-400 hover:underline"> Register here </Link> </p> </form> );
};
export default LoginForm;