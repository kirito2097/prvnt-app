import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronDown, FileText, Calendar, Clock, TrendingUp, TrendingDown, Minus, AlertCircle, UserCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { reports, upcomingTests, appointment } from '../data/mockData';
import type { UserUpload } from '../App';

interface ReportsScreenProps { onUpload?: () => void; userUploads?: UserUpload[]; }

/* ── Helpers ─────────────────────────────────────────────── */
const statusColor = (s: string) =>
  s === 'optimal' ? '#30D158' : s === 'fair' ? '#FF9F0A' : '#FF375F';
const statusBg = (s: string) =>
  s === 'optimal' ? 'rgba(48,209,88,0.12)' : s === 'fair' ? 'rgba(255,159,10,0.12)' : 'rgba(255,55,95,0.12)';

/* ── Score Ring ──────────────────────────────────────────── */
const ScoreRing: React.FC<{ score: number; color: string; size?: number; stroke?: number }> = ({
  score, color, size = 80, stroke = 7,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c}
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - score / 100) }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotate: -90, transformOrigin: `${size/2}px ${size/2}px` }} />
      <text x={size/2} y={size/2 + 6} textAnchor="middle"
        fill={color} fontSize={18} fontWeight={800} fontFamily="Inter">{score}</text>
    </svg>
  );
};

/* ── Health Score Hero Card ──────────────────────────────── */
const BODY_SYSTEMS = [
  { label: 'Cardiovascular', emoji: '❤️', score: 82, color: '#FF375F' },
  { label: 'Metabolic',      emoji: '⚡', score: 91, color: '#FF9F0A' },
  { label: 'Hormonal',       emoji: '🧬', score: 74, color: '#BF5AF2' },
  { label: 'Nutritional',    emoji: '🥦', score: 87, color: '#30D158' },
  { label: 'Inflammatory',   emoji: '🔥', score: 95, color: '#FF6B35' },
  { label: 'Renal',          emoji: '💧', score: 98, color: '#32D2FF' },
];

const HealthScoreCard: React.FC = () => {
  const optimal = BODY_SYSTEMS.filter(s => s.score >= 90).length;
  const good    = BODY_SYSTEMS.filter(s => s.score >= 80 && s.score < 90).length;
  const fair    = BODY_SYSTEMS.filter(s => s.score < 80).length;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>

      {/* Top section: ring + text */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <ScoreRing score={88} color="#30D158" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 5 }}>Overall Health Score</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.1, marginBottom: 4 }}>
            Looking Good, Alex
          </p>
          <p style={{ fontSize: 12, color: 'var(--t2)' }}>
            {BODY_SYSTEMS.length} systems tracked · May 2026
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Bottom strip: 3 status counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        {[
          { label: 'Optimal', count: optimal, color: '#30D158' },
          { label: 'Good',    count: good,    color: '#FF9F0A' },
          { label: 'Fair',    count: fair,    color: '#FF375F' },
        ].map(({ label, count, color }, i) => (
          <div key={label} style={{ padding: '14px 0', textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{count}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase',
              letterSpacing: '0.05em' }}>{label}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

/* ── Body Systems Score Tiles ────────────────────────────── */
const SystemsGrid: React.FC = () => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
    <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Body Systems</p>
        <p style={{ fontSize: 12, color: 'var(--t2)' }}>6 biomarker system scores</p>
      </div>
      <div style={{ padding: '5px 12px', borderRadius: 10, background: 'rgba(48,209,88,0.12)' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#30D158' }}>88 / 100</span>
      </div>
    </div>
    <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {BODY_SYSTEMS.map((sys, i) => {
        const isOptimal = sys.score >= 90;
        const isGood    = sys.score >= 80;
        const status    = isOptimal ? 'Optimal' : isGood ? 'Good' : 'Fair';
        const sClr      = isOptimal ? '#30D158' : isGood ? '#FF9F0A' : '#FF375F';
        return (
          <motion.div key={sys.label}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: `linear-gradient(145deg, ${sys.color}14, ${sys.color}05)`,
              border: `1px solid ${sys.color}22`,
              borderRadius: 16, padding: '13px 11px',
              display: 'flex', flexDirection: 'column', gap: 7,
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{sys.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: sClr, letterSpacing: '0.02em',
                background: `${sClr}18`, borderRadius: 5, padding: '2px 6px' }}>
                {status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: sys.color, lineHeight: 1 }}>{sys.score}</span>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>/100</span>
            </div>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--t2)', lineHeight: 1.2 }}>{sys.label}</p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

/* ── Biomarker Reference Range Bar ───────────────────────── */
const RangeBar: React.FC<{ value: number; low: number; high: number; color: string; unit: string }> = ({ value, low, high, color, unit }) => {
  const total = high * 1.4;
  const pct = Math.min((value / total) * 100, 100);
  const lowPct = (low / total) * 100;
  const highPct = (high / total) * 100;
  const trend = value < low ? 'low' : value > high ? 'high' : 'normal';
  const TrendIcon = trend === 'low' ? TrendingDown : trend === 'high' ? TrendingUp : Minus;
  const trendColor = trend === 'normal' ? '#30D158' : '#FF9F0A';
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ position: 'relative', height: 6, borderRadius: 3, background: 'var(--bg)', overflow: 'visible', marginBottom: 6 }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0,
          left: `${lowPct}%`, width: `${highPct - lowPct}%`,
          background: 'rgba(48,209,88,0.2)', borderRadius: 3 }} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: color, borderRadius: 3 }} />
        <motion.div initial={{ left: 0 }} animate={{ left: `calc(${pct}% - 5px)` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: -3, width: 12, height: 12, borderRadius: '50%', background: color, border: '2px solid var(--surface)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 500 }}>Low {low} {unit}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <TrendIcon size={10} color={trendColor} />
          <span style={{ fontSize: 10, color: trendColor, fontWeight: 700, textTransform: 'capitalize' }}>{trend}</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 500 }}>High {high} {unit}</span>
      </div>
    </div>
  );
};

/* ── 6-Month Biomarker Trends ────────────────────────────── */
const trendData = [
  { month: 'Dec', hdl: 51, ldl: 162, glucose: 101 },
  { month: 'Jan', hdl: 52, ldl: 158, glucose: 98  },
  { month: 'Feb', hdl: 54, ldl: 153, glucose: 97  },
  { month: 'Mar', hdl: 56, ldl: 148, glucose: 95  },
  { month: 'Apr', hdl: 58, ldl: 145, glucose: 94  },
  { month: 'May', hdl: 61, ldl: 142, glucose: 92  },
];

type BioKey = 'hdl' | 'ldl' | 'glucose';

const BIOMARKERS: {
  key: BioKey; label: string; short: string; unit: string;
  color: string; improving: boolean; tag: string;
}[] = [
  { key: 'hdl',     label: 'HDL Cholesterol', short: 'HDL',     unit: 'mg/dL', color: '#30D158', improving: true,  tag: 'Good cholesterol' },
  { key: 'ldl',     label: 'LDL Cholesterol', short: 'LDL',     unit: 'mg/dL', color: '#FF375F', improving: false, tag: 'Bad cholesterol'  },
  { key: 'glucose', label: 'Fasting Glucose',  short: 'Glucose', unit: 'mg/dL', color: '#FFD60A', improving: false, tag: 'Blood sugar'       },
];

const BiomarkerTrends: React.FC = () => {
  const [active, setActive] = useState<BioKey>('hdl');
  const bm     = BIOMARKERS.find(b => b.key === active)!;
  const data   = trendData.map(d => ({ month: d.month, value: d[active] }));
  const first  = data[0].value;
  const last   = data[data.length - 1].value;
  const delta  = last - first;
  const isGood = (bm.improving && delta > 0) || (!bm.improving && delta < 0);
  const deltaColor = isGood ? '#30D158' : delta === 0 ? 'var(--t3)' : '#FF9F0A';
  const deltaArrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
      <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>6-Month Trends</p>
            <p style={{ fontSize: 12, color: 'var(--t2)' }}>Key biomarker progression</p>
          </div>
          <div style={{ padding: '4px 11px', borderRadius: 10, background: 'rgba(10,132,255,0.1)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0A84FF' }}>Dec – May</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--bg)', borderRadius: 14 }}>
          {BIOMARKERS.map(b => (
            <motion.button key={b.key} whileTap={{ scale: 0.94 }}
              onClick={() => setActive(b.key)}
              style={{ flex: 1, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: 12, fontWeight: 700,
                background: active === b.key ? b.color : 'transparent',
                color:      active === b.key ? '#fff'  : 'var(--t3)',
                boxShadow:  active === b.key ? `0 2px 12px ${b.color}50` : 'none',
                transition: 'all 0.18s ease' }}>
              {b.short}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ padding: '18px 20px 0' }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.05em',
                textTransform: 'uppercase', marginBottom: 5 }}>{bm.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: bm.color, lineHeight: 1 }}>{last}</span>
                <span style={{ fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>{bm.unit}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>{bm.tag}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                background: isGood ? 'rgba(48,209,88,0.1)' : delta === 0 ? 'rgba(156,163,175,0.1)' : 'rgba(255,159,10,0.1)',
                borderRadius: 20, paddingInline: 10, paddingBlock: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: deltaColor }}>
                  {deltaArrow} {Math.abs(delta)} {bm.unit}
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>
                {isGood ? '✓ Improving' : delta === 0 ? '— Stable' : '⚠ Watch'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        <ResponsiveContainer width="100%" height={148}>
          <AreaChart data={data} margin={{ top: 4, right: 10, left: 10, bottom: 4 }}>
            <defs>
              <linearGradient id={`bmGrad-${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={bm.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={bm.color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <YAxis domain={['auto', 'auto']} hide width={0} />
            <XAxis dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--t3)', fontFamily: 'Inter', fontWeight: 600 }}
              axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, fontSize: 12, color: 'var(--t1)', fontFamily: 'Inter', padding: '6px 10px' }}
              formatter={(v: number) => [`${v} ${bm.unit}`, bm.label]}
              labelStyle={{ color: 'var(--t3)', fontSize: 11 }}
              cursor={{ stroke: bm.color, strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area type="monotone" dataKey="value" stroke={bm.color} strokeWidth={2.5}
              fill={`url(#bmGrad-${active})`} dot={false}
              activeDot={{ r: 5, fill: bm.color, stroke: 'var(--surface)', strokeWidth: 2.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border)', marginTop: 4 }}>
        {([
          { label: 'Dec 2025', val: first,                            color: 'var(--t2)' },
          { label: 'May 2026', val: last,                             color: bm.color    },
          { label: '6-mo Δ',   val: (delta >= 0 ? '+' : '') + delta, color: deltaColor  },
        ] as { label: string; val: number | string; color: string }[]).map(({ label, val, color }, i) => (
          <div key={label} style={{ padding: '14px 0', textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.05em',
              textTransform: 'uppercase', marginBottom: 5 }}>{label}</p>
            <p style={{ fontSize: 17, fontWeight: 800, color, lineHeight: 1 }}>
              {val}<span style={{ fontSize: 10, fontWeight: 500, color: 'var(--t3)', marginLeft: 2 }}>{bm.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Screen ─────────────────────────────────────────── */
const ReportsScreen: React.FC<ReportsScreenProps> = ({ onUpload, userUploads = [] }) => {
  const [openReport, setOpenReport] = useState<number | null>(null);
  const [openUpload, setOpenUpload] = useState<number | null>(null);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
      <div style={{ height: 48 }} />

      {/* Header */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.015em', lineHeight: 1 }}>Reports</h1>
          <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>Lab results & health records</p>
        </div>
        {/* Last lab result date */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '6px 11px' }}>
            <Calendar size={12} color="var(--accent)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Last lab</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>Apr 15, 2026</span>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ① Overall health score hero */}
        <HealthScoreCard />

        {/* ② Body Systems — breakdown of the score above */}
        <SystemsGrid />

        {/* ③ Lab Results */}
        <div>
          <p className="sec-label" style={{ paddingLeft: 2, marginBottom: 12 }}>Lab Results</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* ── User-uploaded results (shown first) ── */}
            {userUploads.map((r) => {
              const isOpen = openUpload === r.id;
              return (
                <motion.div key={r.id} layout
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: 'var(--surface)', border: '1px solid rgba(10,132,255,0.25)', borderRadius: 24, overflow: 'hidden' }}>
                  <button onClick={() => setOpenUpload(isOpen ? null : r.id)}
                    style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13,
                      background: 'rgba(10,132,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} color="#0A84FF" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>{r.name}</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)',
                          borderRadius: 7, padding: '2px 7px', flexShrink: 0 }}>
                          <UserCircle size={11} color="#0A84FF" />
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#0A84FF' }}>Uploaded by you</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--t2)' }}>You · {r.date}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ background: 'rgba(48,209,88,0.1)', borderRadius: 8, padding: '3px 8px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#30D158' }}>
                          {r.markers.filter(m => m.status === 'optimal').length}/{r.markers.length} optimal
                        </span>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} color="var(--t3)" />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                            {r.markers.map((m) => (
                              <div key={m.name}
                                style={{ padding: '14px 16px', borderRadius: 16, background: 'var(--bg)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%',
                                    background: statusColor(m.status), flexShrink: 0 }} />
                                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{m.name}</span>
                                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginRight: 8 }}>{m.value}</span>
                                  <div style={{ background: statusBg(m.status), borderRadius: 8, padding: '3px 9px' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700,
                                      color: statusColor(m.status), textTransform: 'capitalize' }}>
                                      {m.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* ── Doctor / clinic reports ── */}
            {reports.map((r) => {
              const isOpen = openReport === r.id;
              return (
                <motion.div key={r.id} layout
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
                  <button onClick={() => setOpenReport(isOpen ? null : r.id)}
                    style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13,
                      background: 'rgba(10,132,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} color="#0A84FF" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{r.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--t2)' }}>{r.doctor} · {r.date}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ background: 'rgba(48,209,88,0.1)', borderRadius: 8, padding: '3px 8px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#30D158' }}>
                          {r.markers.filter(m => m.status === 'optimal').length}/{r.markers.length} optimal
                        </span>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} color="var(--t3)" />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                            {r.markers.map((m) => (
                              <div key={m.name}
                                style={{ padding: '14px 16px', borderRadius: 16, background: 'var(--bg)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%',
                                    background: statusColor(m.status), flexShrink: 0 }} />
                                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{m.name}</span>
                                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginRight: 8 }}>{m.value}</span>
                                  <div style={{ background: statusBg(m.status), borderRadius: 8, padding: '3px 9px' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700,
                                      color: statusColor(m.status), textTransform: 'capitalize' }}>
                                      {m.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ④ 6-Month Biomarker Trends */}
        <BiomarkerTrends />

        {/* ⑤ Next Appointment */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>
          <p className="sec-label" style={{ marginBottom: 14 }}>Next Appointment</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14,
              background: 'rgba(10,132,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={22} color="#0A84FF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>
                {appointment.type} · {appointment.doctor}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} color="var(--t3)" />
                <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>
                  {appointment.date} at {appointment.time}
                </span>
              </div>
            </div>
            <div style={{ background: 'rgba(48,209,88,0.12)', borderRadius: 10, padding: '4px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#30D158' }}>Confirmed</span>
            </div>
          </div>
        </div>

        {/* ⑥ Upcoming Tests */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>
          <p className="sec-label" style={{ marginBottom: 14 }}>Upcoming Tests</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingTests.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 14, background: 'var(--bg)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0A84FF', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{t.name}</span>
                <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>in {t.dueIn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ⑦ Reminder alert */}
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 18,
          background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.2)' }}>
          <AlertCircle size={18} color="#FF9F0A" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#FF9F0A', marginBottom: 3 }}>
              Reminder: Annual bloodwork due
            </p>
            <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
              Your comprehensive metabolic panel is recommended every 12 months. Last drawn: Nov 2025.
            </p>
          </div>
        </div>

      </div>

    </div>

      {/* Upload FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 380, damping: 22 }}
        whileTap={{ scale: 0.9 }}
        onClick={onUpload}
        style={{
          position: 'absolute', bottom: 112, right: 20,
          height: 50, paddingInline: 20,
          borderRadius: 25, border: 'none', cursor: 'pointer',
          background: '#0A84FF',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(10,132,255,0.45), 0 1px 4px rgba(0,0,0,0.3)',
          zIndex: 50,
        }}>
        <Upload size={17} color="#fff" strokeWidth={2.5} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Inter' }}>Upload</span>
      </motion.button>

    </div>
  );
};

export default ReportsScreen;
