import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import BottomNav from './components/navigation/BottomNav';
import type { Tab, SubScreen } from './types/navigation';
import type { ActiveHabit } from './types/habits';
import { defaultActiveHabits } from './types/habits';
import HomeScreen     from './screens/HomeScreen';
import VitalsScreen   from './screens/VitalsScreen';
import ReportsScreen  from './screens/ReportsScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ProfileScreen  from './screens/ProfileScreen';
import AIScreen       from './screens/AIScreen';
import HealthRecordsScreen   from './screens/HealthRecordsScreen';
import DevicesScreen         from './screens/DevicesScreen';
import UploadResultsScreen   from './screens/UploadResultsScreen';
import './index.css';

/* ─── iOS-style Status Bar ───────────────────────────────── */
const StatusBar: React.FC = () => {
  const { isDark } = useTheme();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      setTime(`${h12}:${m} ${ampm}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const fg = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#000000' : '#F4F3EE';

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 48,
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: 22,
      background: bg,
      transition: 'background 0.3s ease',
      pointerEvents: 'none',
    }}>
      {/* Time */}
      <span style={{ fontSize: 15, fontWeight: 700, color: fg, fontFamily: 'Inter', letterSpacing: '-0.01em' }}>
        {time}
      </span>

      {/* Right: signal + wifi + battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"   y="8"   width="3" height="4"  rx="0.8" fill={fg}/>
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill={fg}/>
          <rect x="9"   y="3"   width="3" height="9"  rx="0.8" fill={fg}/>
          <rect x="13.5" y="0"  width="3" height="12" rx="0.8" fill={fg} opacity="0.3"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <circle cx="8" cy="11" r="1.5" fill={fg}/>
          <path d="M4.5 7.5C5.5 6.4 6.7 5.8 8 5.8s2.5.6 3.5 1.7" stroke={fg} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          <path d="M1.5 4.5C3.2 2.8 5.5 1.8 8 1.8s4.8 1 6.5 2.7" stroke={fg} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45"/>
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 25, height: 12, borderRadius: 3.5, border: `1.5px solid ${fg}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 1.5, top: 1.5, bottom: 1.5, width: '72%', borderRadius: 2, background: fg }} />
          </div>
          <div style={{ width: 2, height: 5, borderRadius: '0 1px 1px 0', background: fg, opacity: 0.45 }} />
        </div>
      </div>
    </div>
  );
};

const slide = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -6 },
};
const slideUp = {
  initial:  { opacity: 0, y: '100%' },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: '100%' },
};
const T = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };
const TSpring = { type: 'spring' as const, stiffness: 320, damping: 32 };

export interface UserUpload {
  id: number;
  name: string;
  date: string;
  uploadedByUser: true;
  markers: { name: string; value: string; status: string }[];
}

function AppInner() {
  const [activeTab, setActiveTab]       = useState<Tab>('home');
  const [subScreen, setSubScreen]       = useState<SubScreen>(null);
  const [showAI, setShowAI]             = useState(false);
  const [activeHabits, setActiveHabits] = useState<ActiveHabit[]>(defaultActiveHabits);
  const [userUploads, setUserUploads]   = useState<UserUpload[]>([]);

  const handleUploadComplete = (fileName: string) => {
    const cleanName = fileName.replace(/\.[^.]+$/, '');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setUserUploads(prev => [{
      id: Date.now(),
      name: cleanName,
      date: today,
      uploadedByUser: true,
      markers: [
        { name: 'Vitamin D',         value: '38 ng/mL',   status: 'optimal' },
        { name: 'Total Cholesterol',  value: '198 mg/dL',  status: 'optimal' },
        { name: 'Fasting Glucose',    value: '94 mg/dL',   status: 'optimal' },
        { name: 'Ferritin',           value: '18 ng/mL',   status: 'fair'    },
        { name: 'TSH',                value: '3.8 uIU/mL', status: 'fair'    },
        { name: 'LDL Cholesterol',    value: '142 mg/dL',  status: 'poor'    },
      ],
    }, ...prev]);
    closeSubScreen();
  };

  const handleTabChange = (tab: Tab) => { setSubScreen(null); setActiveTab(tab); };
  const openSubScreen   = (s: SubScreen) => setSubScreen(s);
  const closeSubScreen  = () => setSubScreen(null);

  const handleStartHabit = (habit: ActiveHabit) => {
    setActiveHabits(prev =>
      prev.find(h => h.id === habit.id) ? prev : [...prev, { ...habit, doneToday: false }]
    );
  };
  const handleToggleHabit = (id: string) => {
    setActiveHabits(prev => prev.map(h => h.id === id ? { ...h, doneToday: !h.doneToday } : h));
  };
  const handleRemoveHabit = (id: string) => {
    setActiveHabits(prev => prev.filter(h => h.id !== id));
  };

  const renderMain = () => {
    switch (activeTab) {
      case 'home':     return <HomeScreen     onNavigate={handleTabChange} onOpenSubScreen={openSubScreen} onOpenAI={() => setShowAI(true)} activeHabits={activeHabits} onToggleHabit={handleToggleHabit} onRemoveHabit={handleRemoveHabit} />;
      case 'vitals':   return <VitalsScreen />;
      case 'reports':  return <ReportsScreen  onUpload={() => openSubScreen('upload-results')} userUploads={userUploads} />;
      case 'discover': return <DiscoverScreen activeHabitIds={new Set(activeHabits.map(h => h.id))} onStartHabit={handleStartHabit} onRemoveHabit={handleRemoveHabit} />;
      case 'profile':  return <ProfileScreen  onOpenSubScreen={openSubScreen} onSignOut={() => {}} />;
      default:         return <HomeScreen     onNavigate={handleTabChange} onOpenSubScreen={openSubScreen} onOpenAI={() => setShowAI(true)} activeHabits={activeHabits} onToggleHabit={handleToggleHabit} onRemoveHabit={handleRemoveHabit} />;
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: 'var(--bg)', transition: 'background 0.3s ease' }}>

      {/* iOS Status Bar — always on top */}
      <StatusBar />

      {/* Main content layer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <AnimatePresence mode="wait">
          {subScreen === 'health-records' ? (
            <motion.div key="health-records" {...slide} transition={T} style={{ height: '100%' }}>
              <HealthRecordsScreen onBack={closeSubScreen} />
            </motion.div>
          ) : subScreen === 'devices' ? (
            <motion.div key="devices" {...slide} transition={T} style={{ height: '100%' }}>
              <DevicesScreen onBack={closeSubScreen} />
            </motion.div>
          ) : subScreen === 'upload-results' ? (
            <motion.div key="upload-results" {...slide} transition={T} style={{ height: '100%' }}>
              <UploadResultsScreen onBack={closeSubScreen} onUploadComplete={handleUploadComplete} />
            </motion.div>
          ) : (
            <motion.div key={activeTab} {...slide} transition={T} style={{ height: '100%' }}>
              {renderMain()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      {!showAI && !subScreen && (
        <BottomNav active={activeTab} onTabChange={handleTabChange} />
      )}

      {/* AI Chat overlay — slides up from bottom */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            key="ai-overlay"
            {...slideUp}
            transition={TSpring}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <AIScreen onClose={() => setShowAI(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
