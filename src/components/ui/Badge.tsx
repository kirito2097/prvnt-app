import React from 'react';
import { clsx } from 'clsx';

type Status = 'optimal' | 'good' | 'fair' | 'poor';

interface BadgeProps {
  status?: Status;
  label?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
}

const statusConfig = {
  optimal: { bg: 'bg-emerald/10', text: 'text-emerald', dot: 'bg-emerald' },
  good: { bg: 'bg-cyan/10', text: 'text-cyan', dot: 'bg-cyan' },
  fair: { bg: 'bg-amber/10', text: 'text-amber', dot: 'bg-amber' },
  poor: { bg: 'bg-rose/10', text: 'text-rose', dot: 'bg-rose' },
};

const Badge: React.FC<BadgeProps> = ({ status = 'optimal', label, children, size = 'sm' }) => {
  const cfg = statusConfig[status];
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full font-medium', cfg.bg, cfg.text, size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs')}>
      <span className={clsx('rounded-full', cfg.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {label || children}
    </span>
  );
};

export default Badge;
