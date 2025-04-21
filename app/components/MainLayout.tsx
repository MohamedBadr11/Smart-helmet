// app/components/MainLayout.tsx
import React from 'react';
import Sidebar from '../components/Sidebar'; // Adjust path
import TopNavbar from '../components/TopNavbar'; // Adjust path

interface MainLayoutProps { children: React.ReactNode; }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopNavbar />
            <div className="h-0.5 w-full bg-orange-600"></div>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="w-0.5 bg-orange-600"></div>
                <main className="flex-1 overflow-y-auto bg-black p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
export default MainLayout;