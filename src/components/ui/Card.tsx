import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, onClick, padding = 'md', dark = false }) => {
  const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-5' };
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all duration-200',
        paddings[padding],
        dark ? 'bg-[#111827] text-white' : 'bg-white',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
