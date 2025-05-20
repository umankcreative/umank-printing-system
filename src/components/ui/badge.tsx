import React from 'react';

interface BadgeProps {
  text: string;
  className?: string;
}

const badge: React.FC<BadgeProps> = ({ text, className = '' }) => {
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${className}`}
    >
      {text}
    </span>
  );
};

export default badge;
