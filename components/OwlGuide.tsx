import React, { useEffect, useState } from 'react';
import { AppPhase, OwlResponse } from '../types';
import { fetchOwlAdvice } from '../services/geminiService';

interface OwlGuideProps {
  phase: AppPhase;
  stepData?: any;
}

export const OwlGuide: React.FC<OwlGuideProps> = ({ phase, stepData }) => {
  const [advice, setAdvice] = useState<OwlResponse>({ message: "你好呀！让我们一起来数苹果吧！", mood: 'happy' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getAdvice = async () => {
      setLoading(true);
      const result = await fetchOwlAdvice(phase, stepData);
      if (isMounted) {
        setAdvice(result);
        setLoading(false);
      }
    };
    getAdvice();
    return () => { isMounted = false; };
  }, [phase, JSON.stringify(stepData)]); // Re-fetch when phase or stepData changes

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex items-end z-50 max-w-[280px] md:max-w-sm">
      <div className={`bg-white border-2 border-amber-400 p-4 rounded-2xl rounded-br-none shadow-xl mb-4 mr-2 transform transition-all duration-300 ${loading ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}`}>
        <p className="text-gray-700 text-sm md:text-base font-medium leading-snug">
          {advice.message}
        </p>
      </div>
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 animate-bounce-slight">
        {/* Simple CSS Owl Construction */}
        <div className="absolute inset-0 bg-amber-800 rounded-full border-4 border-amber-900 overflow-hidden">
          <div className="absolute top-4 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-4 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rotate-45 rounded-sm"></div>
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-12 h-12 bg-amber-200 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};