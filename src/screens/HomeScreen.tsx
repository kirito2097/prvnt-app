import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle, Plus, ChevronRight, Check, ArrowRight, Zap, Calendar, FlaskConical, X, Flame, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { user, todayScores, vitals, insights, tasks, weeklyHRVTrend, upcomingTests, appointment } from '../data/mockData';
import type { Tab } from '../types/navigation';
import type { ActiveHabit } from '../types/habits';

interface HomeScreenProps {
  onNavigate:      (tab: Tab) => void;
  onOpenSubScreen: (s: string) => void;
  onOpenAI:        () => void;
  activeHabits:    ActiveHabit[];
  onToggleHabit:   (id: string) => void;
  onRemoveHabit:   (id: string) => void;
}

/* ─── Activity Ring ─────────────────────────────────────── */
const ActivityRing: React.FC<{ score: number; color: string; size: number; strokeWidth: number }> = ({ score, color, size, strokeWidth }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(score, 100) / 100);
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${color}22`} strokeWidth={strokeWidth} />
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
    </svg>
  );
};

const TripleRing: React.FC<{ recovery: number; sleep: number; readiness: number }> = ({ recovery, sleep, readiness }) => {
  const rings = [
    { score: recovery,  color: '#30D158', size: 130, sw: 10 },
    { score: sleep,     color: '#0A84FF', size: 104, sw: 10 },
    { score: readiness, color: '#BF5AF2', size: 78,  sw: 10 },
  ];
  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      {rings.map(({ score, color, size, sw }, i) => (
        <div key={i} style={{ position: i === 0 ? 'relative' : 'absolute', top: i === 0 ? 0 : (130 - size) / 2, left: i === 0 ? 0 : (130 - size) / 2 }}>
          <ActivityRing score={score} color={color} size={size} strokeWidth={sw} />
        </div>
      ))}
    </div>
  );
};

/* ─── Step bars ─────────────────────────────────────────── */
const StepBars: React.FC = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const vals  = [6200, 8900, 7400, 9800, 5300, 11200, 9800];
  const max   = Math.max(...vals);
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 64 }}>
      {vals.map((v, i) => {
        const isToday = i === 6;
        const aboveGoal = v >= 10000;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(v / max) * 100}%` }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', borderRadius: 4, background: isToday ? (aboveGoal ? '#30D158' : '#FFD60A') : aboveGoal ? 'rgba(48,209,88,0.5)' : 'rgba(255,255,255,0.15)' }}
              />
            </div>
            <span style={{ fontSize: 9, color: isToday ? 'var(--t2)' : 'var(--t3)', fontWeight: isToday ? 700 : 500 }}>{days[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Weather ───────────────────────────────────────────── */
const getCondition = (code: number) => {
  if (code === 0)                    return 'Sunny';
  if (code <= 2)                     return 'Partly Cloudy';
  if (code === 3)                    return 'Cloudy';
  if (code <= 48)                    return 'Foggy';
  if (code <= 55)                    return 'Drizzle';
  if (code <= 67)                    return 'Rainy';
  if (code <= 77)                    return 'Snowy';
  if (code <= 82)                    return 'Rainy';
  if (code <= 99)                    return 'Stormy';
  return 'Cloudy';
};

const useWeather = () => {
  const [weather, setWeather] = React.useState<{ temp: string; condition: string } | null>(null);
  React.useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
        );
        const data = await res.json();
        setWeather({
          temp: `${Math.round(data.current.temperature_2m)}°F`,
          condition: getCondition(data.current.weather_code),
        });
      } catch { /* keep fallback */ }
    }, () => { /* permission denied — keep fallback */ });
  }, []);
  return weather;
};

const SunIcon: React.FC = () => (
  <div style={{ position: 'relative', width: 36, height: 36 }}>
    <motion.svg width="36" height="36" viewBox="0 0 36 36"
      animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', inset: 0 }}>
      {[0,45,90,135,180,225,270,315].map(a => (
        <line key={a} x1="18" y1="2" x2="18" y2="6" stroke="#FFD60A" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${a} 18 18)`} />
      ))}
    </motion.svg>
    <motion.div animate={{ scale: [1,1.1,1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle,#FFE066,#FFD60A)', boxShadow: '0 0 8px rgba(255,214,10,0.7)' }} />
    </motion.div>
  </div>
);

const RainIcon: React.FC = () => (
  <div style={{ position: 'relative', width: 36, height: 36 }}>
    {/* Cloud */}
    <motion.div animate={{ x: [-1,1,-1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: 2, left: 3, width: 30, height: 13, background: '#8E9BB5', borderRadius: 10 }} />
    {/* Drops */}
    {[5,11,17,23,29].map((x, i) => (
      <motion.div key={i}
        animate={{ y: [0, 18], opacity: [0.9, 0] }}
        transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.14, ease: 'linear' }}
        style={{ position: 'absolute', top: 17, left: x, width: 2.5, height: 7, background: '#5B9BFF', borderRadius: 3 }} />
    ))}
  </div>
);

const CloudyIcon: React.FC = () => (
  <motion.div animate={{ x: [-2,2,-2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
      <ellipse cx="17" cy="16" rx="15" ry="6" fill="#A0AABB"/>
      <ellipse cx="12" cy="13" rx="9"  ry="7" fill="#B8C2D0"/>
      <ellipse cx="21" cy="12" rx="8"  ry="7" fill="#B8C2D0"/>
      <ellipse cx="17" cy="10" rx="7"  ry="6" fill="#C8D2DE"/>
    </svg>
  </motion.div>
);

const PartlyCloudyIcon: React.FC = () => (
  <div style={{ position: 'relative', width: 36, height: 36 }}>
    {/* Mini sun */}
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: 0, left: 0, width: 22, height: 22 }}>
      <svg width="22" height="22" viewBox="0 0 22 22">
        {[0,60,120,180,240,300].map(a => (
          <line key={a} x1="11" y1="1" x2="11" y2="4" stroke="#FFD60A" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 11 11)`} />
        ))}
        <circle cx="11" cy="11" r="5" fill="#FFD60A"/>
      </svg>
    </motion.div>
    {/* Cloud overlay */}
    <motion.div animate={{ x: [-1,1,-1] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: 2, right: 0, width: 24, height: 12, background: '#B8C2D0', borderRadius: 8 }} />
  </div>
);

const SnowIcon: React.FC = () => (
  <div style={{ position: 'relative', width: 36, height: 36 }}>
    <motion.div animate={{ x: [-1,1,-1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: 2, left: 3, width: 30, height: 13, background: '#A0AABB', borderRadius: 10 }} />
    {[5,11,17,23,29].map((x, i) => (
      <motion.div key={i}
        animate={{ y: [0,18], opacity: [0.9,0], rotate: [0,180] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: 'linear' }}
        style={{ position: 'absolute', top: 17, left: x, width: 5, height: 5, background: '#C8E4FF', borderRadius: '50%' }} />
    ))}
  </div>
);

const StormIcon: React.FC = () => (
  <div style={{ position: 'relative', width: 36, height: 36 }}>
    <div style={{ position: 'absolute', top: 2, left: 3, width: 30, height: 13, background: '#6B7280', borderRadius: 10 }} />
    {/* Rain */}
    {[6,14,22].map((x, i) => (
      <motion.div key={i}
        animate={{ y: [0,16], opacity: [0.8,0] }}
        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18, ease: 'linear' }}
        style={{ position: 'absolute', top: 17, left: x, width: 2, height: 6, background: '#8BB8FF', borderRadius: 3 }} />
    ))}
    {/* Lightning */}
    <motion.svg width="10" height="16" viewBox="0 0 10 16"
      animate={{ opacity: [0,1,0,0,0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
      style={{ position: 'absolute', top: 14, left: 13 }}>
      <polyline points="7,0 3,8 6,8 2,16" stroke="#FFD60A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </motion.svg>
  </div>
);

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return <RainIcon />;
  if (c.includes('storm'))   return <StormIcon />;
  if (c.includes('snow'))    return <SnowIcon />;
  if (c.includes('partly'))  return <PartlyCloudyIcon />;
  if (c.includes('cloud') || c.includes('fog')) return <CloudyIcon />;
  return <SunIcon />;
};

/* ─── Main screen ────────────────────────────────────────── */
/* ─── Mock notifications ─────────────────────────────────── */
const NOTIFICATIONS = [
  { id: 'n1', icon: '📉', color: '#FF375F', title: 'HRV dipped overnight',      body: 'Your HRV dropped 14% — prioritise recovery today.',     time: '8 min ago',   unread: true  },
  { id: 'n2', icon: '🧪', color: '#BF5AF2', title: 'Blood panel ready',          body: 'Your latest results have been processed. Tap to review.', time: '2 hrs ago',   unread: true  },
  { id: 'n3', icon: '🌙', color: '#0A84FF', title: 'Sleep goal streak: 14 days', body: 'You\'ve hit your sleep target 14 nights in a row. 🎉',    time: 'Yesterday',   unread: false },
  { id: 'n4', icon: '💊', color: '#FF9F0A', title: 'Supplement reminder',        body: 'Omega-3 + Vitamin D — best taken with your morning meal.',  time: 'Yesterday',   unread: false },
  { id: 'n5', icon: '🏃', color: '#30D158', title: 'Weekly step goal hit!',      body: 'You\'ve exceeded 70,000 steps this week. Keep it up.',     time: '2 days ago',  unread: false },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenAI, activeHabits, onToggleHabit, onRemoveHabit }) => {
  const liveWeather = useWeather();
  const weatherTemp      = liveWeather?.temp      ?? '72°F';
  const weatherCondition = liveWeather?.condition ?? 'Sunny';

  const [taskList,        setTaskList]        = useState(tasks);
  const [removing,        setRemoving]        = useState<string | null>(null);
  const [showNotifs,      setShowNotifs]      = useState(false);
  const [readIds,         setReadIds]         = useState<Set<string>>(new Set());
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;

  const hour     = new Date().getHours();
  const greeting = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const completedTasks   = taskList.filter(t => t.done).length;
  const progressPct      = Math.round((completedTasks / taskList.length) * 100);
  const allDone          = completedTasks === taskList.length;
  const completedHabits  = activeHabits.filter(h => h.doneToday).length;

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 };

  const recoveryScore = todayScores.recovery;
  const recoveryLabel = recoveryScore >= 80 ? 'Optimal' : recoveryScore >= 60 ? 'Moderate' : 'Rest Needed';
  const recoveryColor = recoveryScore >= 80 ? '#30D158' : recoveryScore >= 60 ? '#FFD60A' : '#FF375F';

  const handleRemove = (id: string) => {
    setConfirmRemoveId(null);
    setRemoving(id);
    setTimeout(() => { onRemoveHabit(id); setRemoving(null); }, 300);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 110 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ height: 48 }} />

      {/* Row 1: PRVNT logo + icons */}
      <div style={{ padding: '10px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.01em', lineHeight: 1, display: 'flex', alignItems: 'center', height: 38 }}>PRVNT</span>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {/* AI Chat */}
          <motion.button whileTap={{ scale: 0.88 }} onClick={onOpenAI}
            style={{ width: 38, height: 38, borderRadius: 13, cursor: 'pointer',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={16} color="var(--t2)" />
          </motion.button>

          {/* Bell — notifications */}
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => { setShowNotifs(v => !v); setReadIds(new Set(NOTIFICATIONS.map(n => n.id))); }}
            style={{ width: 38, height: 38, borderRadius: 13, cursor: 'pointer',
              background: showNotifs ? 'var(--accent)' : 'var(--surface)',
              border: `1px solid ${showNotifs ? 'var(--accent)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Bell size={16} color={showNotifs ? '#fff' : 'var(--t2)'} />
            {unreadCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                  borderRadius: '50%', background: '#FF375F',
                  border: '1.5px solid var(--bg)' }}
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Row 2: Greeting + Weather */}
      <div style={{ padding: '14px 20px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>

        {/* Left: greeting block */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {greeting}, {user.name}! 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {/* Sync status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '5px 10px', alignSelf: 'flex-start', marginTop: 2 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 10 }}>
              <RefreshCw size={12} color="var(--accent)" />
            </motion.div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Synced · just now</span>
          </div>
        </div>

        {/* Right: Live Weather widget */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 18, padding: '10px 14px' }}>
          <WeatherIcon condition={weatherCondition} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{weatherTemp}</span>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, lineHeight: 1 }}>{weatherCondition}</span>
          </div>
        </div>
      </div>

      {/* ── Notifications Panel ────────────────────────────── */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div
            key="notif-panel"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', top: 118, left: 16, right: 16, zIndex: 50,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 22, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Notifications</p>
              <button onClick={() => setShowNotifs(false)}
                style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={13} color="var(--t3)" />
              </button>
            </div>
            {NOTIFICATIONS.map((n, i) => {
              const isUnread = n.unread && !readIds.has(n.id);
              return (
                <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 18px',
                  borderTop: '1px solid var(--border)',
                  background: isUnread ? 'rgba(255,55,95,0.03)' : 'transparent' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, fontSize: 18,
                    background: `${n.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {n.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', flex: 1,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {n.title}
                      </p>
                      {isUnread && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF375F', flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45, marginBottom: 4 }}>{n.body}</p>
                    <p style={{ fontSize: 11, color: 'var(--t3)' }}>{n.time}</p>
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button onClick={() => setShowNotifs(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Activity Rings Card ────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '20px 20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <TripleRing recovery={todayScores.recovery} sleep={todayScores.sleep} readiness={todayScores.readiness} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Recovery',  score: todayScores.recovery,  color: '#30D158' },
                { label: 'Sleep',     score: todayScores.sleep,     color: '#0A84FF' },
                { label: 'Readiness', score: todayScores.readiness, color: '#BF5AF2' },
              ].map(({ label, score, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>{score}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>Today's Status</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${recoveryColor}18`, borderRadius: 20, padding: '4px 12px' }}>
              <Zap size={11} color={recoveryColor} />
              <span style={{ fontSize: 12, fontWeight: 700, color: recoveryColor }}>{recoveryLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Row ────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'HRV',        value: `${todayScores.hrv}`,          unit: 'ms',  color: '#32D2FF' },
            { label: 'Resting HR', value: `${vitals.restingHR.value}`,   unit: 'bpm', color: '#FF375F' },
            { label: 'SpO₂',       value: `${vitals.bloodOxygen.value}`, unit: '%',   color: '#30D158' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ ...card, padding: '14px 12px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1, marginBottom: 2 }}>
                {value}<span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', marginLeft: 2 }}>{unit}</span>
              </p>
              <p style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase', marginTop: 5 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's Plan ───────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Today's Plan</p>
          <div style={{ padding: '4px 12px', borderRadius: 20, background: allDone ? 'rgba(48,209,88,0.12)' : 'var(--surface)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: allDone ? '#30D158' : 'var(--t2)' }}>{completedTasks}/{taskList.length} done</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', marginBottom: 14 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%', borderRadius: 2, background: allDone ? '#30D158' : 'var(--accent)' }} />
        </div>

        <div style={{ ...card, overflow: 'hidden' }}>
          {taskList.map((task, i) => (
            <motion.button key={task.id} whileTap={{ scale: 0.99 }}
              onClick={() => setTaskList(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                borderBottom: i < taskList.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, fontSize: 18,
                background: task.done ? 'rgba(48,209,88,0.12)' : 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                {task.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', opacity: task.done ? 0.38 : 1,
                  textDecoration: task.done ? 'line-through' : 'none', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                  {task.title}
                </p>
                <p style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, marginTop: 2 }}>{task.time}</p>
              </div>
              <motion.div
                animate={{ scale: task.done ? [0.7, 1.2, 1] : 1, backgroundColor: task.done ? '#30D158' : 'transparent' }}
                transition={{ duration: 0.25 }}
                style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: task.done ? 'none' : '1.5px solid var(--border-md)' }}>
                <AnimatePresence>
                  {task.done && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                      <Check size={13} color="#000" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Steps Card ─────────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ ...card, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, marginBottom: 3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Steps Today</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, letterSpacing: '-0.02em' }}>{vitals.steps.value.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>/ 10,000</span>
              </div>
            </div>
            <div style={{ background: `${vitals.steps.value >= 10000 ? '#30D158' : '#FFD60A'}18`, borderRadius: 10, padding: '4px 10px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: vitals.steps.value >= 10000 ? '#30D158' : '#FFD60A' }}>
                {Math.round((vitals.steps.value / 10000) * 100)}%
              </span>
            </div>
          </div>
          <StepBars />
          <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 10 }}>🔥 4.2 km · 312 cal · 56 active min</p>
        </div>
      </div>

      {/* ── Sleep Card ─────────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ ...card, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Last Night</p>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>10:28 – 5:42</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, letterSpacing: '-0.02em' }}>{vitals.sleep.value}</span>
            <span style={{ fontSize: 13, color: 'var(--t3)' }}>hrs</span>
            <span style={{ fontSize: 12, color: 'var(--t3)', marginLeft: 2 }}>/ 8h goal</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: 'var(--border)', marginBottom: 14, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(vitals.sleep.value / 8) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: '100%', borderRadius: 3, background: '#0A84FF' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#0A84FF', lineHeight: 1, marginBottom: 4 }}>{todayScores.sleep}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)' }}>Sleep Score</p>
              </div>
              <span style={{ fontSize: 22 }}>😴</span>
            </div>
            <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, marginBottom: 4 }}>2h 22m</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)' }}>Deep Sleep</p>
              </div>
              <span style={{ fontSize: 22 }}>🥱</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── HRV Trend ──────────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ ...card, padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Heart Rate Variability</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, letterSpacing: '-0.02em' }}>{todayScores.hrv}</span>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>ms</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              <div style={{ background: 'rgba(50,210,255,0.12)', borderRadius: 10, padding: '4px 10px' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#32D2FF' }}>↑ Improving</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>7-day avg · 66ms</span>
            </div>
          </div>
          {(() => {
            const avg = Math.round(weeklyHRVTrend.reduce((a, b) => a + b.value, 0) / weeklyHRVTrend.length);
            return (
              <ResponsiveContainer width="100%" height={88}>
                <AreaChart data={weeklyHRVTrend} margin={{ top: 4, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrv-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#32D2FF" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#32D2FF" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <YAxis domain={['auto', 'auto']} hide width={0} />
                  <XAxis dataKey="day"
                    tick={{ fontSize: 10, fill: 'var(--t3)', fontFamily: 'Inter', fontWeight: 600 }}
                    axisLine={false} tickLine={false}
                    interval={0} padding={{ left: 8, right: 8 }} />
                  <ReferenceLine y={avg} stroke="var(--border)" strokeDasharray="3 3" strokeWidth={1} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 10, fontSize: 12, color: 'var(--t1)', fontFamily: 'Inter', padding: '5px 10px' }}
                    formatter={(v: number) => [`${v} ms`, 'HRV']}
                    labelStyle={{ color: 'var(--t3)', fontSize: 11 }}
                    cursor={{ stroke: '#32D2FF', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="value" stroke="#32D2FF" strokeWidth={2.5}
                    fill="url(#hrv-grad)" dot={false}
                    activeDot={{ r: 4, fill: '#32D2FF', stroke: 'var(--surface)', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>

      {/* ── My Habits ──────────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>My Habits</p>
            {activeHabits.length > 0 && (
              <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 1 }}>
                {completedHabits}/{activeHabits.length} completed today
              </p>
            )}
          </div>
          <button onClick={() => onNavigate('discover')}
            style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} />Add habit
          </button>
        </div>

        {activeHabits.length === 0 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onNavigate('discover')}
            style={{ width: '100%', padding: '24px 20px', borderRadius: 20, cursor: 'pointer',
              background: 'rgba(10,132,255,0.04)', border: '1.5px dashed rgba(10,132,255,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 28 }}>🌱</span>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>Start a habit from Discover</p>
            <p style={{ fontSize: 12, color: 'var(--t2)' }}>Habits you start will appear here to track daily</p>
          </motion.button>
        ) : (
          <div style={{ ...card, overflow: 'hidden' }}>
            <AnimatePresence initial={false}>
              {activeHabits.map((habit, i) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: removing === habit.id ? 0 : 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ borderBottom: i < activeHabits.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => onToggleHabit(habit.id)}
                      style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, fontSize: 20,
                        background: habit.doneToday ? `${habit.color}22` : 'var(--bg)',
                        border: `1.5px solid ${habit.doneToday ? habit.color : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transition: 'all 0.2s' }}>
                      {habit.doneToday ? <Check size={18} color={habit.color} strokeWidth={2.5} /> : habit.icon}
                    </motion.button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)',
                        textDecoration: habit.doneToday ? 'line-through' : 'none',
                        opacity: habit.doneToday ? 0.45 : 1, transition: 'all 0.2s',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {habit.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Flame size={10} color="#FF9F0A" />
                        <span style={{ fontSize: 11, color: '#FF9F0A', fontWeight: 600 }}>{habit.streak} day streak</span>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => setConfirmRemoveId(habit.id)}
                      style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={12} color="var(--t3)" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => onNavigate('discover')}
              style={{ width: '100%', padding: '12px 18px', background: 'var(--bg)',
                border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Plus size={13} color="var(--accent)" />
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Explore more habits in Discover</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Coming Up ──────────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Coming Up</p>
          <button onClick={() => onNavigate('reports')}
            style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            Reports <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <motion.div whileTap={{ scale: 0.98 }} onClick={() => onNavigate('reports')}
            style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(10,132,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={20} color="#0A84FF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>
                {appointment.type} · {appointment.doctor}
              </p>
              <p style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 500 }}>{appointment.date} at {appointment.time}</p>
            </div>
            <div style={{ padding: '3px 9px', borderRadius: 8, background: 'rgba(48,209,88,0.1)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#30D158' }}>Confirmed</span>
            </div>
          </motion.div>
          {upcomingTests.slice(0, 2).map((t, i) => (
            <motion.div key={i} whileTap={{ scale: 0.98 }} onClick={() => onNavigate('reports')}
              style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(191,90,242,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FlaskConical size={19} color="#BF5AF2" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{t.name}</p>
                <p style={{ fontSize: 12, color: 'var(--t2)' }}>Due in {t.dueIn}</p>
              </div>
              <ChevronRight size={15} color="var(--t3)" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Today's Insight ────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Today's Insight</p>
          <button onClick={() => onNavigate('discover')}
            style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            See all <ArrowRight size={13} />
          </button>
        </div>
        {insights.slice(0, 1).map(ins => (
          <motion.div key={ins.id} whileTap={{ scale: 0.99 }} onClick={() => onNavigate('discover')}
            style={{ ...card, padding: '18px 18px', display: 'flex', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {ins.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>{ins.title}</p>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 10 }}>{ins.body}</p>
              <button onClick={e => { e.stopPropagation(); onNavigate('discover'); }}
                style={{ height: 30, paddingInline: 14, borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: `${ins.color}18`, color: ins.color, fontWeight: 700, fontSize: 12,
                  fontFamily: 'Inter', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {ins.action} <ChevronRight size={11} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>

    {/* ── Remove habit confirm popup ──────────────────────── */}
    <AnimatePresence>
      {confirmRemoveId && (() => {
        const habit = activeHabits.find(h => h.id === confirmRemoveId);
        if (!habit) return null;
        return (
          <motion.div
            key="confirm-remove"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, zIndex: 60,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setConfirmRemoveId(null)}
              style={{ position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{    opacity: 0, scale: 0.88, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{ position: 'relative', width: '100%', maxWidth: 310,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 28, padding: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 15, background: habit.bg,
                  flexShrink: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24 }}>
                  {habit.icon}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{habit.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={11} color="#FF9F0A" />
                    <span style={{ fontSize: 12, color: '#FF9F0A', fontWeight: 600 }}>{habit.streak} day streak</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 22 }}>
                Remove this habit from your daily tracking? Your streak will be lost.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setConfirmRemoveId(null)}
                  style={{ flex: 1, height: 48, borderRadius: 14,
                    border: '1.5px solid var(--border)', background: 'transparent',
                    fontSize: 14, fontWeight: 700, color: 'var(--t2)',
                    cursor: 'pointer', fontFamily: 'Inter' }}>
                  Keep it
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleRemove(confirmRemoveId)}
                  style={{ flex: 1, height: 48, borderRadius: 14, border: 'none',
                    background: 'rgba(255,55,95,0.12)',
                    fontSize: 14, fontWeight: 700, color: '#FF375F',
                    cursor: 'pointer', fontFamily: 'Inter' }}>
                  Remove
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>

    </div>
  );
};

export default HomeScreen;
