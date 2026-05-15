import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Wind } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { insights, weeklyHRVTrend, weeklyRecoveryTrend, weeklySleepTrend, weeklyGoals, weeklyHRV, weeklySleep, weeklyRecovery } from '../data/mockData';

interface InsightsScreenProps {
  onOpenAI: () => void;
}

/* â"€â"€ Breathing modal â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
type BreathPhase = 'inhale' | 'hold' | 'exhale';
const PHASES: { phase: BreathPhase; label: string; dur: number }[] = [
  { phase: 'inhale', label: 'Inhale',    dur: 4 },
  { phase: 'hold',   label: 'Hold',      dur: 7 },
  { phase: 'exhale', label: 'Exhale',    dur: 8 },
];

const BreathingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [phaseIdx, setPhaseIdx]   = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].dur);
  const [running, setRunning]     = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = PHASES[phaseIdx];

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          setPhaseIdx(i => {
            const next = (i + 1) % PHASES.length;
            setCountdown(PHASES[next].dur);
            return next;
          });
          return PHASES[(phaseIdx + 1) % PHASES.length].dur;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIdx]);

  const ringScale = current.phase === 'inhale' ? 1.18 : current.phase === 'exhale' ? 0.84 : 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(8,8,20,0.92)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 56, right: 20, width: 36, height: 36,
        borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={18} color="#FFF" />
      </button>

      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: 48 }}>4-7-8 Breathing</p>

      {/* Ring */}
      <div style={{ position: 'relative', marginBottom: 48 }}>
        <motion.div animate={{ scale: running ? ringScale : 1 }}
          transition={{ duration: current.phase === 'inhale' ? current.dur : current.phase === 'exhale' ? current.dur : 0.3, ease: 'easeInOut' }}
          style={{ width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(91,127,255,0.25) 0%, rgba(91,127,255,0.06) 70%)',
            border: '2px solid rgba(91,127,255,0.4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>{countdown}</span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{current.label}</span>
        </motion.div>
      </div>

      {/* Phase indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
        {PHASES.map((p, i) => (
          <div key={p.phase} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <motion.div animate={{ background: i === phaseIdx && running ? '#5B7FFF' : 'rgba(255,255,255,0.12)' }}
              style={{ width: 6, height: 6, borderRadius: '50%' }} transition={{ duration: 0.3 }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{p.dur}s</span>
          </div>
        ))}
      </div>

      <motion.button whileTap={{ scale: 0.96 }}
        onClick={() => { setRunning(r => !r); if (!running) { setPhaseIdx(0); setCountdown(PHASES[0].dur); } }}
        style={{ width: 160, height: 50, borderRadius: 16, border: 'none', cursor: 'pointer',
          background: running ? 'rgba(255,255,255,0.1)' : '#5B7FFF',
          color: '#FFF', fontWeight: 700, fontSize: 15, fontFamily: 'Inter' }}>
        {running ? 'Pause' : 'Start'}
      </motion.button>
    </motion.div>
  );
};

/* â"€â"€ Tiny sparkline bar chart â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
const MiniBar: React.FC<{ data: { day: string; value: number }[]; color: string; unit?: string }> = ({ data, color, unit }) => (
  <ResponsiveContainer width="100%" height={64}>
    <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--t3)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, color: 'var(--t1)', fontFamily: 'Inter' }}
        formatter={(v: number) => [`${v}${unit ?? ''}`, '']} />
      <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#g-${color.replace('#','')})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

/* â"€â"€ Main screen â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
const InsightsScreen: React.FC<InsightsScreenProps> = ({ onOpenAI }) => {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [showBreathing, setShowBreathing]     = useState(false);

  const avgHRV      = Math.round(weeklyHRV.reduce((a, b) => a + b, 0) / weeklyHRV.length);
  const avgSleep    = (weeklySleep.reduce((a, b) => a + b, 0) / weeklySleep.length).toFixed(1);
  const avgRecovery = Math.round(weeklyRecovery.reduce((a, b) => a + b, 0) / weeklyRecovery.length);

  const card: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflowY: 'auto', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ height: 48 }} />
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.015em', marginBottom: 2 }}>Insights</h1>
          <p style={{ fontSize: 13, color: 'var(--t2)' }}>Week of May 5–11, 2026</p>
        </div>
        <motion.button whileTap={{ scale: 0.93 }} onClick={onOpenAI}
          style={{ height: 38, paddingInline: 16, borderRadius: 20, border: 'none', cursor: 'pointer',
            background: 'var(--accent)', color: '#FFF', fontWeight: 700, fontSize: 13, fontFamily: 'Inter',
            display: 'flex', alignItems: 'center', gap: 6 }}>
          Ask AI
          <ChevronRight size={14} />
        </motion.button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* â"€â"€ Weekly summary â"€â"€â"€ */}
        <div style={{ ...card, padding: 20 }}>
          <p className="sec-label" style={{ marginBottom: 16 }}>This Week</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'Avg HRV',      value: `${avgHRV}ms`,    color: 'var(--c-hrv)',      delta: '+6ms' },
              { label: 'Avg Sleep',    value: `${avgSleep}h`,   color: 'var(--c-sleep)',    delta: '+0.4h' },
              { label: 'Avg Recovery', value: `${avgRecovery}%`, color: 'var(--c-recovery)', delta: '-5%' },
            ].map(({ label, value, color, delta }) => (
              <div key={label} style={{ background: 'var(--bg)', borderRadius: 16, padding: '14px 12px' }}>
                <p style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.04em',
                  textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 2 }}>{value}</p>
                <p style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>{delta} vs prev</p>
              </div>
            ))}
          </div>
        </div>

        {/* â"€â"€ AI insights â"€â"€â"€ */}
        <div>
          <p className="sec-label" style={{ marginBottom: 12, paddingLeft: 2 }}>AI Insights</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.map((ins) => {
              const isOpen = expandedInsight === ins.id;
              return (
                <motion.div key={ins.id} layout style={{ ...card }}>
                  <button onClick={() => setExpandedInsight(isOpen ? null : ins.id)}
                    style={{ width: '100%', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${ins.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                      {ins.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{ins.title}</p>
                      {!isOpen && (
                        <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.body}</p>
                      )}
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={16} color="var(--t3)" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 18px 18px', paddingLeft: 72 }}>
                          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65, marginBottom: 14 }}>{ins.body}</p>
                          <button style={{ height: 34, paddingInline: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: `${ins.color}18`, color: ins.color, fontWeight: 700, fontSize: 12, fontFamily: 'Inter' }}>
                            {ins.action}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* â"€â"€ HRV trend â"€â"€â"€ */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p className="sec-label" style={{ marginBottom: 4 }}>HRV Trend</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--c-hrv)' }}>68</span>
                <span style={{ fontSize: 13, color: 'var(--t2)' }}>ms · today</span>
              </div>
            </div>
            <div style={{ background: 'rgba(6,182,212,0.1)', borderRadius: 10, padding: '4px 10px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-hrv)' }}>+6ms vs last wk</span>
            </div>
          </div>
          <MiniBar data={weeklyHRVTrend} color="#06B6D4" unit="ms" />
        </div>

        {/* â"€â"€ Recovery trend â"€â"€â"€ */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p className="sec-label" style={{ marginBottom: 4 }}>Recovery Trend</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--c-recovery)' }}>78</span>
                <span style={{ fontSize: 13, color: 'var(--t2)' }}>% · today</span>
              </div>
            </div>
            <div style={{ background: 'rgba(0,196,140,0.1)', borderRadius: 10, padding: '4px 10px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-recovery)' }}>-5% vs last wk</span>
            </div>
          </div>
          <MiniBar data={weeklyRecoveryTrend} color="#00C48C" unit="%" />
        </div>

        {/* â"€â"€ Sleep trend â"€â"€â"€ */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p className="sec-label" style={{ marginBottom: 4 }}>Sleep Duration</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--c-sleep)' }}>7.2</span>
                <span style={{ fontSize: 13, color: 'var(--t2)' }}>hrs · last night</span>
              </div>
            </div>
            <div style={{ background: 'rgba(123,159,255,0.1)', borderRadius: 10, padding: '4px 10px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-sleep)' }}>+0.4h vs prev wk</span>
            </div>
          </div>
          <MiniBar data={weeklySleepTrend} color="#7B9FFF" unit="h" />
        </div>

        {/* â"€â"€ Weekly goals â"€â"€â"€ */}
        <div style={{ ...card, padding: 20 }}>
          <p className="sec-label" style={{ marginBottom: 16 }}>Weekly Goals</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {weeklyGoals.map((g) => {
              const pct = (g.progress / g.total) * 100;
              return (
                <div key={g.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{g.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>{g.progress}/{g.total}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: g.color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* â"€â"€ Mindfulness â"€â"€â"€ */}
        <div style={{ ...card, padding: 20 }}>
          <p className="sec-label" style={{ marginBottom: 14 }}>Mindfulness</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { icon: '🌬️', label: 'Breathe',  sub: '4-7-8',     action: () => setShowBreathing(true) },
              { icon: '🔔', label: 'Journal',   sub: '5 min',     action: () => {} },
              { icon: '🧘', label: 'Meditate',  sub: '10 min',    action: () => {} },
            ].map(({ icon, label, sub, action }) => (
              <motion.button key={label} whileTap={{ scale: 0.94 }} onClick={action}
                style={{ padding: '16px 10px', borderRadius: 18, background: 'var(--bg)',
                  border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <span style={{ fontSize: 26 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{label}</span>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>{sub}</span>
              </motion.button>
            ))}
          </div>
        </div>

      </div>

      {/* Breathing modal */}
      <AnimatePresence>
        {showBreathing && <BreathingModal onClose={() => setShowBreathing(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default InsightsScreen;

