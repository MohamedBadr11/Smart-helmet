// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '../context/AuthContext'; // Import using alias

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'Smart Helmet Dashboard', description: 'Dashboard for Smart Helmet monitoring' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider> {/* Wrap children */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}