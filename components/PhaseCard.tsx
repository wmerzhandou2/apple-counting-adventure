
import React, { ReactNode } from 'react';

interface PhaseCardProps {
  title: string;
  children: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo' | 'teal';
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ title, children, color }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
    pink: 'border-pink-200 bg-pink-50',
    indigo: 'border-indigo-200 bg-indigo-50',
    teal: 'border-teal-200 bg-teal-50',
  };

  const headerClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl border-4 shadow-xl overflow-hidden ${colorClasses[color]} transition-all duration-500`}>
      <div className={`${headerClasses[color]} p-4 md:p-6 text-white text-center`}>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};
