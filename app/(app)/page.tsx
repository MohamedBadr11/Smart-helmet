// app/(app)/page.tsx <- Renders for '/' AFTER login
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AppHomePage() {
  const helmetStatus = "Connected"; const connectionPeriod = "6hrs";
  const percentage1 = "85%"; const percentage2 = "40%"; const percentage3 = "20%";
  const circleSize = "w-20 h-20";
  const textStyle = "text-white text-xl font-semibold";
  const lineStyle = "absolute h-0.5 bg-orange-600 z-10 [filter:drop-shadow(0px_0px_4px_#ea580c)]";
  const [linesVisible, setLinesVisible] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState(false);
  useEffect(() => { const linesTimer = setTimeout(() => setLinesVisible(true), 2000); const circlesTimer = setTimeout(() => setCirclesVisible(true), 4000); return () => { clearTimeout(linesTimer); clearTimeout(circlesTimer); }; }, []);

  return (
    <div className="bg-black text-white rounded-xl shadow-lg p-6 md:p-8 w-full h-full flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex-shrink-0">Helmet Pressure</h1>
      <div className="my-6 md:my-8 flex-grow flex items-center justify-center w-full overflow-hidden relative bg-[radial-gradient(ellipse_at_center,_rgba(251,146,60,0.15)_0%,_rgba(0,0,0,0)_70%)]">
        {linesVisible && ( <> <div className={`${lineStyle} top-[50%] left-[24%] w-[15%]`}></div> <div className={`${lineStyle} top-[38%] right-[24%] w-[15%]`}></div> <div className={`${lineStyle} top-[62%] right-[24%] w-[15%]`}></div> </> )}
        {circlesVisible && ( <> <div className={`absolute top-[50%] left-[20.5%] ${circleSize} rounded-full border-2 border-orange-600 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0px_0px_12px_2px_var(--tw-shadow-color)] shadow-orange-600`}> <span className={textStyle}>{percentage1}</span> </div> <div className={`absolute top-[38%] right-[20.5%] ${circleSize} rounded-full border-2 border-orange-600 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 z-10 shadow-[0px_0px_12px_2px_var(--tw-shadow-color)] shadow-orange-600`}> <span className={textStyle}>{percentage2}</span> </div> <div className={`absolute top-[62%] right-[20.5%] ${circleSize} rounded-full border-2 border-orange-600 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 z-10 shadow-[0px_0px_12px_2px_var(--tw-shadow-color)] shadow-orange-600`}> <span className={textStyle}>{percentage3}</span> </div> </> )}
        <Image src="/images/helmet.png" alt="Helmet Visualization" width={400} height={400} priority className="object-contain max-w-full max-h-full relative z-20" />
      </div>
      <div className="flex justify-between items-baseline w-full pt-6 flex-shrink-0"> <div className="text-left"><span className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Status</span><span className="text-white text-lg md:text-xl font-semibold ml-2">{helmetStatus}</span></div> <div className="text-right"><span className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Connection period</span><span className="text-white text-lg md:text-xl font-semibold ml-2">{connectionPeriod}</span></div> </div>
    </div>
  );
}

export const metadata = { title: 'Dashboard - Smart Helmet' };