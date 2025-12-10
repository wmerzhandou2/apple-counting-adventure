import React, { useEffect, useState } from 'react';
import { AppPhase, OwlResponse } from '../types';
import { fetchOwlAdvice } from '../services/geminiService';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface OwlGuideProps {
  phase: AppPhase;
  stepData?: any;
}

export const OwlGuide: React.FC<OwlGuideProps> = ({ phase, stepData }) => {
  const [advice, setAdvice] = useState<OwlResponse>({ message: "你好呀！让我们一起来数苹果吧！", mood: 'happy' });
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // 移动端默认收起

  useEffect(() => {
    let isMounted = true;
    const getAdvice = async () => {
      setLoading(true);
      const result = await fetchOwlAdvice(phase, stepData);
      if (isMounted) {
        setAdvice(result);
        setLoading(false);
        // 新消息时在移动端自动展开
        if (window.innerWidth < 640) {
          setIsCollapsed(false);
          // 5秒后自动收起
          setTimeout(() => setIsCollapsed(true), 5000);
        }
      }
    };
    getAdvice();
    return () => { isMounted = false; };
  }, [phase, JSON.stringify(stepData)]); // Re-fetch when phase or stepData changes

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex items-end z-50">
      {/* 消息气泡 - 移动端可收缩 */}
      <div
        className={`bg-white border-2 border-amber-400 rounded-2xl rounded-br-none shadow-xl mb-4 mr-2 transform transition-all duration-300 
          ${loading ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}
          ${isCollapsed ? 'hidden sm:block sm:max-w-sm sm:p-4' : 'max-w-[260px] sm:max-w-sm p-3 sm:p-4'}`}
      >
        <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium leading-snug">
          {advice.message}
        </p>
      </div>

      {/* 猫头鹰主体 */}
      <div
        onClick={toggleCollapse}
        className={`relative flex-shrink-0 animate-bounce-slight cursor-pointer transition-all duration-300 active:scale-95
          ${isCollapsed ? 'w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24' : 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'}`}
      >
        {/* Simple CSS Owl Construction */}
        <div className="absolute inset-0 bg-amber-800 rounded-full border-2 sm:border-4 border-amber-900 overflow-hidden">
          <div className="absolute top-2 sm:top-4 left-1 sm:left-2 w-3 sm:w-6 h-3 sm:h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-1 sm:w-2 h-1 sm:h-2 bg-black rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-2 sm:top-4 right-1 sm:right-2 w-3 sm:w-6 h-3 sm:h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-1 sm:w-2 h-1 sm:h-2 bg-black rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-5 sm:top-10 left-1/2 transform -translate-x-1/2 w-2 sm:w-4 h-2 sm:h-4 bg-orange-400 rotate-45 rounded-sm"></div>
          <div className="absolute bottom-[-5px] sm:bottom-[-10px] left-1/2 transform -translate-x-1/2 w-8 sm:w-12 h-8 sm:h-12 bg-amber-200 rounded-full opacity-50"></div>
        </div>

        {/* 收缩指示器 - 仅移动端显示 */}
        <div className="absolute -top-1 -right-1 sm:hidden bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          {isCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </div>
    </div>
  );
};