import React from 'react';

interface AppleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isGhost?: boolean; // For "missing" apples
  className?: string;
  style?: React.CSSProperties;
}

export const Apple: React.FC<AppleProps> = ({ size = 'md', isGhost = false, className = '', style = {} }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${sizeClasses[size]} ${isGhost ? 'opacity-30' : 'text-red-500 drop-shadow-sm'} ${className} inline-block transition-all`}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        className={isGhost ? "stroke-red-400 stroke-2" : "fill-current"}
        strokeDasharray={isGhost ? "2 2" : "none"}
      />
      {/* Leaf */}
      <path
        d="M12 3C12 3 14 0.5 17 2"
        className="stroke-green-600 stroke-2"
        strokeLinecap="round"
      />
      {!isGhost && <path d="M14 6L16 5" className="stroke-white opacity-40 stroke-2" />}
    </svg>
  );
};