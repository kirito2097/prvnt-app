import React from 'react';
import { motion } from 'framer-motion';
import { Home, Activity, BarChart2, Grid2x2, User } from 'lucide-react';
import type { Tab } from '../../types/navigation';

export type { Tab };

interface BottomNavProps {
  active: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; Icon: React.FC<{ size: number; strokeWidth?: number; color?: string }> }[] = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'vitals',   label: 'Vitals',   Icon: Activity },
  { id: 'reports',  label: 'Reports',  Icon: BarChart2 },
  { id: 'discover', label: 'Discover', Icon: Grid2x2 },
  { id: 'profile',  label: 'Profile',  Icon: User },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onTabChange }) => (
  /* Floating glass pill — Material 3 Navigation Bar */
  <div
    style={{
      position: 'absolute',
      bottom: 16,
      left: 12,
      right: 12,
      zIndex: 50,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(40px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      borderRadius: 32,
      border: '1px solid var(--nav-border)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.10)',
      display: 'flex',
      alignItems: 'center',
      padding: '6px 4px',
    }}
  >
    {tabs.map(({ id, label, Icon }) => {
      const isActive = active === id;
      return (
        <motion.button
          key={id}
          onClick={() => onTabChange(id)}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '2px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {/* Material 3 active indicator pill */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{
                width:   isActive ? 56 : 0,
                opacity: isActive ? 1  : 0,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{
                position: 'absolute',
                height: 32,
                borderRadius: 16,
                background: 'var(--accent-s)',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1, padding: '4px 16px' }}>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.6}
                color={isActive ? 'var(--accent)' : 'var(--t3)'}
              />
            </div>
          </div>

          {/* Label */}
          <span
            style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--accent)' : 'var(--t3)',
              letterSpacing: 0.1,
              lineHeight: 1,
              transition: 'color 0.2s ease',
            }}
          >
            {label}
          </span>
        </motion.button>
      );
    })}
  </div>
);

export default BottomNav;
