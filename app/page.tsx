// app/page.tsx (Public Landing Page)
import Link from 'next/link';
import Image from 'next/image'; // Import Image component

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black/95 to-black/90 p-4 text-white">
      <div className="text-center max-w-md w-full">
        {/* === REPLACE Icon with Image === */}
        <Image
          src="/images/helmet.png" // Path to your helmet image in /public/images
          alt="Smart Helmet Logo"
          width={120} // Adjust width as needed
          height={120} // Adjust height as needed
          className="mx-auto mb-6" // Keep centering and margin
          priority // Good to prioritize main branding image
        />
        {/* =============================== */}

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Welcome to Smart Helmet
        </h1>
        <p className="text-xl text-gray-400 mb-8">Monitor your rides safely.</p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register"
             className="inline-block w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:from-red-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold rounded-md transition-colors duration-200"
          >
            Register Now
          </Link>
          <Link href="/login"
             className="inline-block w-full sm:w-auto px-6 py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold rounded-md transition-colors duration-200"
          >
             Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: 'Welcome - Smart Helmet' };