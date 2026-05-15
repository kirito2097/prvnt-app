import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ── Animated metric icons ───────────────────────────────── */
const IconHRV: React.FC<{ color: string }> = ({ color }) => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" style={{ overflow: 'visible' }}>
    <motion.path
      d="M1 9 L5 9 L7 2 L9.5 16 L12 5 L14 12 L16 9 L23 9"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
      transition={{ duration: 2, times: [0, 0.7, 1], repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
    />
  </svg>
);

const IconHeart: React.FC<{ color: string }> = ({ color }) => (
  <motion.svg width="22" height="20" viewBox="0 0 22 20" fill="none"
    animate={{ scale: [1, 1.28, 0.95, 1.15, 1] }}
    transition={{ duration: 0.75, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}>
    <path d="M11 18S2 12.5 2 6.5C2 3.97 4.01 2 6.5 2C8.1 2 9.5 2.85 11 4.5C12.5 2.85 13.9 2 15.5 2C17.99 2 20 3.97 20 6.5C20 12.5 11 18 11 18Z"
      fill={`${color}28`} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

const IconMoon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <motion.path
      d="M18 12.5C17 15.1 14.6 17 11.7 17C7.9 17 4.8 13.9 4.8 10.1C4.8 7.2 6.7 4.8 9.3 3.8C6.1 4.6 3.8 7.6 3.8 11C3.8 15.3 7.3 18.8 11.6 18.8C15 18.8 17.9 16.5 18.8 13.3C18.6 13.1 18.3 12.8 18 12.5Z"
      fill={`${color}22`} stroke={color} strokeWidth="1.5" strokeLinecap="round"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.circle cx="16" cy="5" r="1.1" fill={color}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
      transition={{ duration: 2.2, repeat: Infinity, delay: 0.4, ease: 'easeInOut' }} />
    <motion.circle cx="13" cy="3" r="0.75" fill={color}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
      transition={{ duration: 2.2, repeat: Infinity, delay: 1.1, ease: 'easeInOut' }} />
    <motion.circle cx="18.5" cy="8" r="0.65" fill={color}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
      transition={{ duration: 2.2, repeat: Infinity, delay: 1.8, ease: 'easeInOut' }} />
  </svg>
);

const IconZap: React.FC<{ color: string }> = ({ color }) => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <motion.path
      d="M11 1L2 13H9.5L7 21L16 9H8.5L11 1Z"
      fill={`${color}25`} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      animate={{ opacity: [1, 0.2, 1, 1, 0.2, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.path
      d="M11 1L2 13H9.5L7 21L16 9H8.5L11 1Z"
      fill={color} strokeWidth="0"
      animate={{ opacity: [0, 0.35, 0, 0, 0.35, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
  </svg>
);

const IconDroplets: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <motion.path
      d="M11 3C11 3 5.5 10 5.5 14.5C5.5 17.5 8 20 11 20C14 20 16.5 17.5 16.5 14.5C16.5 10 11 3 11 3Z"
      fill={`${color}25`} stroke={color} strokeWidth="1.6" strokeLinecap="round"
      animate={{ scaleY: [1, 1.06, 0.96, 1.03, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '11px 20px' }} />
    <motion.ellipse cx="9" cy="14" rx="1.2" ry="1.8" fill="white" opacity={0.35}
      animate={{ opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
  </svg>
);

const IconWind: React.FC<{ color: string }> = ({ color }) => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
    {[
      { d: 'M1 5C5 5 9 5 12 5C14.8 5 17 3 15 1.2C13.2 -0.4 10.5 1.2 10.5 3.5', delay: 0 },
      { d: 'M1 10L17 10',                                                           delay: 0.25 },
      { d: 'M1 15C5 15 9 15 12 15C14.8 15 17 17 15 18.8C13.2 20.4 10.5 18.8 10.5 16.5', delay: 0.5 },
    ].map(({ d, delay }, i) => (
      <motion.path key={i} d={d}
        stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, delay, ease: 'easeInOut' }} />
    ))}
  </svg>
);

const IconFootprints: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <motion.g animate={{ opacity: [0.25, 1, 0.25] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="6.5" cy="17" rx="3" ry="4" fill={`${color}30`} stroke={color} strokeWidth="1.4" />
      <circle cx="4.8" cy="12.5" r="1.1" fill={color} opacity={0.75} />
      <circle cx="7.5" cy="12" r="0.9" fill={color} opacity={0.7} />
      <circle cx="6" cy="11" r="0.8" fill={color} opacity={0.6} />
    </motion.g>
    <motion.g animate={{ opacity: [1, 0.25, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="15.5" cy="8" rx="3" ry="4" fill={`${color}30`} stroke={color} strokeWidth="1.4" />
      <circle cx="13.8" cy="3.5" r="1.1" fill={color} opacity={0.75} />
      <circle cx="16.5" cy="3" r="0.9" fill={color} opacity={0.7} />
      <circle cx="15" cy="2" r="0.8" fill={color} opacity={0.6} />
    </motion.g>
  </svg>
);

const IconFlame: React.FC<{ color: string }> = ({ color }) => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <motion.path
      d="M9 21C5.5 21 3 18.3 3 15C3 11.5 5.5 9.5 7.5 7.5C7.5 9.5 8.5 10.5 9 10.5C9.5 10.5 10.5 9 9.5 7C11.5 9 15 11.5 15 15C15 18.3 12.5 21 9 21Z"
      fill={`${color}28`} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      animate={{ scaleX: [1, 0.93, 1.07, 0.96, 1], scaleY: [1, 1.04, 0.97, 1.04, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '9px 21px' }} />
    <motion.path
      d="M9 21C7.4 21 6.5 19.8 6.5 18.5C6.5 17 7.5 16 8.5 15C8.5 16 9 16.5 9 16.5C9 16.5 9.5 15.5 9 14C10.5 15.5 11.5 17 11.5 18.5C11.5 19.8 10.6 21 9 21Z"
      fill={color} opacity={0.55}
      animate={{ opacity: [0.55, 0.9, 0.45, 0.85, 0.55] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
  </svg>
);
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { vitals, weeklyHRVTrend, monthlyHeartRate, sleepStages, todayScores } from '../data/mockData';

/* â"€â"€ Score ring â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
const ScoreRing: React.FC<{ score: number; color: string; size?: number; stroke?: number }> = ({
  score, color, size = 52, stroke = 5,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c}
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotate: -90, transformOrigin: `${size/2}px ${size/2}px` }} />
      <text x={size/2} y={size/2 + 4} textAnchor="middle" fill={color} fontSize={13} fontWeight={800} fontFamily="Inter">{score}</text>
    </svg>
  );
};

/* â"€â"€ Metric row â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
interface VitalMeta { label: string; key: keyof typeof vitals; color: string; Icon: React.FC<{ color: string }>; unit?: string }

const VITALS_META: VitalMeta[] = [
  { label: 'HRV',          key: 'hrv',             color: '#32D2FF', Icon: IconHRV       },
  { label: 'Sleep',        key: 'sleep',           color: '#0A84FF', Icon: IconMoon      },
  { label: 'Recovery',     key: 'recovery',        color: '#30D158', Icon: IconZap       },
  { label: 'Resting HR',   key: 'restingHR',       color: '#FF375F', Icon: IconHeart     },
  { label: 'Blood Oxygen', key: 'bloodOxygen',     color: '#BF5AF2', Icon: IconDroplets  },
  { label: 'Resp. Rate',   key: 'respiratoryRate', color: '#30D158', Icon: IconWind      },
  { label: 'Steps',        key: 'steps',           color: '#F59E0B', Icon: IconFootprints},
  { label: 'Calories',     key: 'calories',        color: '#F97316', Icon: IconFlame     },
];

/* ── 7-day sparkline data per metric ─────────────────────── */
type TrendPoint = { day: string; v: number };
const METRIC_TRENDS: Record<string, TrendPoint[]> = {
  hrv:             [{ day:'Mon',v:58 },{ day:'Tue',v:62 },{ day:'Wed',v:55 },{ day:'Thu',v:67 },{ day:'Fri',v:71 },{ day:'Sat',v:65 },{ day:'Sun',v:68 }],
  sleep:           [{ day:'Mon',v:6.8},{ day:'Tue',v:7.2},{ day:'Wed',v:6.5},{ day:'Thu',v:7.8},{ day:'Fri',v:8.1},{ day:'Sat',v:7.4},{ day:'Sun',v:7.6}],
  recovery:        [{ day:'Mon',v:72 },{ day:'Tue',v:68 },{ day:'Wed',v:75 },{ day:'Thu',v:80 },{ day:'Fri',v:78 },{ day:'Sat',v:83 },{ day:'Sun',v:81 }],
  restingHR:       [{ day:'Mon',v:58 },{ day:'Tue',v:56 },{ day:'Wed',v:59 },{ day:'Thu',v:54 },{ day:'Fri',v:55 },{ day:'Sat',v:53 },{ day:'Sun',v:54 }],
  bloodOxygen:     [{ day:'Mon',v:97 },{ day:'Tue',v:98 },{ day:'Wed',v:97 },{ day:'Thu',v:99 },{ day:'Fri',v:98 },{ day:'Sat',v:99 },{ day:'Sun',v:98 }],
  respiratoryRate: [{ day:'Mon',v:16 },{ day:'Tue',v:15 },{ day:'Wed',v:16 },{ day:'Thu',v:14 },{ day:'Fri',v:15 },{ day:'Sat',v:14 },{ day:'Sun',v:14 }],
  steps:           [{ day:'Mon',v:7200},{ day:'Tue',v:9400},{ day:'Wed',v:6800},{ day:'Thu',v:10200},{ day:'Fri',v:8900},{ day:'Sat',v:11300},{ day:'Sun',v:9600}],
  calories:        [{ day:'Mon',v:1920},{ day:'Tue',v:2280},{ day:'Wed',v:1840},{ day:'Thu',v:2450},{ day:'Fri',v:2100},{ day:'Sat',v:2600},{ day:'Sun',v:2340}],
};

/* ── Per-metric feedback ──────────────────────────────────── */
interface MetricFeedback {
  headline: string;
  body: string;
  tip?: string;
  sentiment: 'positive' | 'neutral' | 'caution';
}

function getMetricFeedback(key: keyof typeof vitals): MetricFeedback {
  const v = vitals[key];
  const isOptimal = v.status === 'optimal';
  const trendDir  = v.trend > 0 ? 'up' : v.trend < 0 ? 'down' : 'flat';

  const map: Record<string, MetricFeedback> = {
    hrv: isOptimal
      ? {
          headline: trendDir === 'up' ? `↑ Up ${v.trend}% from last week — trending well` : trendDir === 'flat' ? 'Holding steady this week' : `↓ Dipped ${Math.abs(v.trend)}% but still in a healthy range`,
          body: `HRV of ${v.value}ms places you in a well-recovered state. High HRV means your autonomic nervous system can handle stress efficiently — your body is primed for both performance and recovery today.`,
          tip: 'Consistent sleep times and low evening stress are your biggest HRV boosters.',
          sentiment: 'positive',
        }
      : {
          headline: `↓ Down ${Math.abs(v.trend)}% — below your baseline`,
          body: `Your HRV is running lower than usual, which signals your body may be under-recovered. This can follow intense training, poor sleep, or elevated stress.`,
          tip: 'Prioritise 8+ hours tonight and skip high-intensity training today.',
          sentiment: 'caution',
        },

    sleep: isOptimal
      ? {
          headline: trendDir === 'up' ? `↑ Improved ${v.trend}% this week` : trendDir === 'flat' ? 'Consistent sleep this week' : 'Good overall, minor dip this week',
          body: `${v.value} hours with a sleep score of ${todayScores.sleep}/100. You're hitting the 7–9 hour sweet spot associated with optimal memory consolidation, immune function, and next-day performance.`,
          tip: 'Maintaining a fixed wake time — even on weekends — reinforces your circadian rhythm.',
          sentiment: 'positive',
        }
      : {
          headline: `Below your sleep target this week`,
          body: `You're averaging under 7 hours, which measurably impacts reaction time, mood, and recovery speed. Even one extra hour tonight can begin restoring baseline cognitive function.`,
          tip: 'Dim screens 60 min before bed and set a consistent 10:30 PM wind-down alarm.',
          sentiment: 'caution',
        },

    recovery: v.score >= 75
      ? {
          headline: trendDir === 'down' ? `↓ Down ${Math.abs(v.trend)}% — monitor closely` : `Recovery score looking solid`,
          body: `At ${v.value}%, your body has good capacity for today's demands. Use this window for moderate-to-high intensity training or tackle cognitively demanding work.`,
          tip: trendDir === 'down' ? 'The downward trend suggests accumulated fatigue. Schedule an easy day in the next 48 hours.' : undefined,
          sentiment: trendDir === 'down' ? 'neutral' : 'positive',
        }
      : {
          headline: `↓ Down ${Math.abs(v.trend)}% — rest day recommended`,
          body: `A recovery score below 70% signals your body hasn't fully bounced back. Pushing hard today risks deeper fatigue and slower long-term adaptation.`,
          tip: 'Light walking, stretching, or a rest day is optimal. Focus on sleep quality tonight.',
          sentiment: 'caution',
        },

    restingHR: isOptimal
      ? {
          headline: trendDir === 'flat' ? `Stable — holding at a strong baseline` : trendDir === 'down' ? `↓ Trending lower — cardiovascular fitness improving` : `Slightly elevated but within optimal range`,
          body: `${v.value} bpm resting heart rate puts you in the top performance tier. Endurance athletes typically sit between 40–60 bpm. Lower values reflect stronger cardiac output per beat.`,
          tip: 'Zone 2 cardio (conversational pace) 3× per week is the most effective way to lower resting HR over time.',
          sentiment: 'positive',
        }
      : {
          headline: `Elevated resting HR this week`,
          body: `A resting HR above 70 bpm can reflect dehydration, stress, illness onset, or insufficient aerobic base. Track whether this persists across 3+ days.`,
          tip: 'Stay well-hydrated, reduce caffeine after midday, and consider a relaxation session tonight.',
          sentiment: 'caution',
        },

    bloodOxygen: isOptimal
      ? {
          headline: `Excellent — well above the 95% health threshold`,
          body: `${v.value}% SpO₂ means your lungs are efficiently delivering oxygen to your blood. Values consistently above 97% indicate strong respiratory and cardiovascular health.`,
          sentiment: 'positive',
        }
      : {
          headline: `Slightly below optimal — worth monitoring`,
          body: `SpO₂ below 95% can indicate respiratory strain, altitude effects, or poor sleep quality. If this persists for multiple days, consult a physician.`,
          tip: 'Deep diaphragmatic breathing exercises can improve lung efficiency over time.',
          sentiment: 'caution',
        },

    respiratoryRate: isOptimal
      ? {
          headline: trendDir === 'down' ? `↓ Slightly lower — sign of relaxed baseline` : `Within normal range and stable`,
          body: `${v.value} breaths/min is calm and controlled. A lower resting respiratory rate often correlates with better cardiovascular fitness and parasympathetic tone — your nervous system is in a relaxed state.`,
          tip: 'Box breathing (4s in / 4s hold / 4s out) practiced daily can lower your baseline respiratory rate.',
          sentiment: 'positive',
        }
      : {
          headline: `Slightly elevated respiratory rate`,
          body: `Higher than usual breathing rate can reflect stress, inflammation, or early illness. Normal range is 12–20 breaths/min at rest.`,
          tip: 'Practice slow nasal breathing and monitor over the next 24–48 hours.',
          sentiment: 'caution',
        },

    steps: v.score >= 70
      ? {
          headline: trendDir === 'up' ? `↑ Up ${v.trend}% from last week — building momentum` : `Solid activity level this week`,
          body: `${v.value.toLocaleString()} steps covers roughly ${(v.value * 0.00076).toFixed(1)} km. Research consistently shows 7,000–10,000 daily steps reduces cardiovascular risk by up to 40%. You're in a strong range.`,
          tip: v.value < 10000 ? `You're ${(10000 - v.value).toLocaleString()} steps from your goal — a 10-minute walk will close the gap.` : undefined,
          sentiment: 'positive',
        }
      : {
          headline: `Below your movement target this week`,
          body: `Low daily step counts are independently linked to metabolic slowdown and cardiovascular risk. Small habit changes — standing during calls, walking after meals — accumulate quickly.`,
          tip: 'Set a mid-afternoon reminder to take a 10-minute walk. It also improves post-lunch energy dips.',
          sentiment: 'caution',
        },

    calories: v.score >= 75
      ? {
          headline: trendDir === 'up' ? `↑ Active energy up ${v.trend}% this week` : `On track with energy output`,
          body: `${v.value.toLocaleString()} kcal burned reflects your activity level. Make sure your nutritional intake supports this output — under-fuelling slows recovery and degrades performance over time.`,
          tip: 'Prioritise protein within 30–60 min post-workout to support muscle repair.',
          sentiment: 'positive',
        }
      : {
          headline: `Energy output below your typical range`,
          body: `Lower caloric expenditure this week may reflect reduced activity, a rest day, or lower movement patterns. This is fine intentionally — ensure it aligns with your weekly training plan.`,
          sentiment: 'neutral',
        },
  };

  return map[key] ?? { headline: 'Data available', body: 'Check back for more personalised insights as your data history builds.', sentiment: 'neutral' };
}

/* ── Sentiment styles ─────────────────────────────────────── */
const sentimentStyle = {
  positive: { bg: 'rgba(48,209,88,0.08)',   border: 'rgba(48,209,88,0.2)',   color: '#30D158' },
  neutral:  { bg: 'rgba(255,214,10,0.08)',  border: 'rgba(255,214,10,0.2)',  color: '#FFD60A' },
  caution:  { bg: 'rgba(255,55,95,0.08)',   border: 'rgba(255,55,95,0.18)',  color: '#FF375F' },
};

/* ── VitalCard ────────────────────────────────────────────── */
const VitalCard: React.FC<{ meta: VitalMeta }> = ({ meta }) => {
  const [open, setOpen] = useState(false);
  const v = vitals[meta.key];
  const trendUp = v.trend > 0;
  const trendNone = v.trend === 0;
  const feedback = getMetricFeedback(meta.key);

  return (
    <motion.div layout style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '16px 18px', background: 'none',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: `${meta.color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          <meta.Icon color={meta.color} />
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', marginBottom: 3 }}>{meta.label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: meta.color }}>{v.value}</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>{v.unit}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!trendNone && (
            <span style={{ fontSize: 12, fontWeight: 700,
              color: trendUp ? '#00C48C' : '#F87171',
              background: trendUp ? 'rgba(0,196,140,0.1)' : 'rgba(248,113,113,0.1)',
              padding: '3px 8px', borderRadius: 8 }}>
              {trendUp ? '+' : ''}{v.trend}%
            </span>
          )}
          <ScoreRing score={v.score} color={meta.color} size={44} stroke={4} />
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} color="var(--t3)" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: '1px solid var(--border)' }}>

              {/* ── Sparkline chart ── */}
              <div style={{ padding: '14px 14px 0' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.06em',
                  textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>7-Day Trend</p>
                <ResponsiveContainer width="100%" height={94}>
                  <AreaChart data={METRIC_TRENDS[meta.key]} margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                    <defs>
                      <linearGradient id={`grad-${meta.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={meta.color} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={meta.color} stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['auto','auto']} hide width={0} />
                    <XAxis dataKey="day"
                      tick={{ fontSize: 10, fill: 'var(--t3)', fontFamily: 'Inter', fontWeight: 600 }}
                      axisLine={false} tickLine={false} interval={0}
                      padding={{ left: 8, right: 8 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 10, fontSize: 12, color: 'var(--t1)', fontFamily: 'Inter',
                        padding: '6px 10px' }}
                      formatter={(val: number) => [`${val} ${v.unit}`, '']}
                      labelStyle={{ color: 'var(--t3)', fontSize: 11 }}
                      cursor={{ stroke: meta.color, strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Area type="monotone" dataKey="v" stroke={meta.color} strokeWidth={2}
                      fill={`url(#grad-${meta.key})`} dot={false}
                      activeDot={{ r: 4, fill: meta.color, stroke: 'var(--surface)', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* ── 3 stat chips ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
                {[
                  { label: '7-day avg', val: v.weeklyAvg },
                  { label: 'Best',      val: v.best      },
                  { label: 'Lowest',    val: v.lowest    },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: 'var(--bg)', borderRadius: 12, padding: '9px 11px' }}>
                    <p style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, letterSpacing: '0.05em',
                      textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: meta.color }}>{val}
                      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t3)', marginLeft: 2 }}>{v.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Status + headline ── */}
              <div style={{ padding: '0 14px 14px' }}>
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.08 }}
                  style={{ borderRadius: 14, padding: '11px 14px',
                    background: sentimentStyle[feedback.sentiment].bg,
                    border: `1px solid ${sentimentStyle[feedback.sentiment].border}`,
                    display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: `${sentimentStyle[feedback.sentiment].color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {feedback.sentiment === 'positive'
                      ? (v.trend > 0 ? <TrendingUp  size={13} color={sentimentStyle[feedback.sentiment].color} />
                                     : <Minus       size={13} color={sentimentStyle[feedback.sentiment].color} />)
                      : feedback.sentiment === 'caution'
                        ? <TrendingDown size={13} color={sentimentStyle[feedback.sentiment].color} />
                        : <Minus        size={13} color={sentimentStyle[feedback.sentiment].color} />
                    }
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: sentimentStyle[feedback.sentiment].color,
                    lineHeight: 1.35, flex: 1 }}>
                    {feedback.headline}
                  </p>
                  {/* status dot */}
                  <span style={{ fontSize: 10, fontWeight: 700, paddingInline: 8, paddingBlock: 3,
                    borderRadius: 20, flexShrink: 0,
                    background: v.status === 'optimal' ? 'rgba(0,196,140,0.12)' : 'rgba(245,158,11,0.12)',
                    color: v.status === 'optimal' ? '#00C48C' : '#F59E0B',
                    textTransform: 'capitalize' }}>
                    {v.status}
                  </span>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* â"€â"€ Main screen â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
const VitalsScreen: React.FC = () => {
  const [hrPeriod, setHrPeriod] = useState<'7D'|'14D'|'30D'>('14D');

  const hrSlice =
    hrPeriod === '7D'  ? monthlyHeartRate.slice(0, 7) :
    hrPeriod === '14D' ? monthlyHeartRate.slice(0, 14) :
    monthlyHeartRate;

  const hrMin  = Math.min(...hrSlice.map(d => d.value));
  const hrMax  = Math.max(...hrSlice.map(d => d.value));
  const hrAvg  = Math.round(hrSlice.reduce((a, b) => a + b.value, 0) / hrSlice.length);
  const hrToday      = 54;   // mock today's value
  const hrYesterday  = 56;   // mock yesterday
  const hrDelta      = hrToday - hrYesterday; // negative = improved (lower resting HR)

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflowY: 'auto', paddingBottom: 100 }}>
      <div style={{ height: 48 }} />

      {/* Header */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em', lineHeight: 1 }}>Vitals</h1>
          <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>Live biometrics</p>
        </div>
        {/* Last synced indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '6px 11px' }}>
            <motion.svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 12 }}>
              <path d="M10 6A4 4 0 1 1 6 2V1M6 1L8 3M6 1L4 3" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Synced</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>5 min ago</span>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Score trio ─── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '22px 20px 20px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase',
            color: 'var(--t3)', marginBottom: 22 }}>Today's Body Score</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
            {[
              { label: 'Recovery',  score: todayScores.recovery,  color: '#30D158' },
              { label: 'Sleep',     score: todayScores.sleep,     color: '#0A84FF' },
              { label: 'Readiness', score: todayScores.readiness, color: '#BF5AF2' },
            ].map(({ label, score, color }, i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                borderRight: i < 2 ? '1px solid var(--border)' : 'none', padding: '0 8px' }}>
                <ScoreRing score={score} color={color} size={64} stroke={6} />
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)',
                  textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Heart rate chart ── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>

          {/* Row 1: label + period tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p className="sec-label">Heart Rate</p>
            <div style={{ display: 'flex', gap: 5 }}>
              {(['7D','14D','30D'] as const).map(p => (
                <motion.button key={p} whileTap={{ scale: 0.92 }} onClick={() => setHrPeriod(p)}
                  style={{ height: 26, paddingInline: 10, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: hrPeriod === p ? '#F87171' : 'var(--bg)',
                    color: hrPeriod === p ? '#FFF' : 'var(--t3)',
                    fontSize: 11, fontWeight: 700, fontFamily: 'Inter',
                    transition: 'all 0.15s ease' }}>
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Row 2: big value + yesterday comparison + badge */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#F87171', lineHeight: 1 }}>{hrToday}</span>
                <span style={{ fontSize: 13, color: 'var(--t2)' }}>bpm · resting</span>
              </div>
              {/* vs yesterday */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                background: hrDelta < 0 ? 'rgba(48,209,88,0.1)' : 'rgba(248,113,113,0.1)',
                borderRadius: 20, paddingInline: 9, paddingBlock: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700,
                  color: hrDelta < 0 ? '#30D158' : '#F87171' }}>
                  {hrDelta < 0 ? `↓ ${Math.abs(hrDelta)} bpm` : `↑ ${hrDelta} bpm`} vs yesterday
                </span>
              </div>
            </div>
            <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 10, padding: '4px 10px', alignSelf: 'flex-start' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F87171' }}>3-month low</span>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={hrSlice} margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#F87171" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#F87171" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide width={0} />
              <XAxis dataKey="day"
                tick={{ fontSize: 10, fill: 'var(--t3)', fontFamily: 'Inter', fontWeight: 600 }}
                axisLine={false} tickLine={false}
                interval={hrPeriod === '30D' ? 5 : hrPeriod === '14D' ? 1 : 0}
                padding={{ left: 10, right: 10 }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, fontSize: 12, color: 'var(--t1)', fontFamily: 'Inter', padding: '6px 10px' }}
                formatter={(v: number) => [`${Math.round(v)} bpm`, '']}
                labelStyle={{ color: 'var(--t3)', fontSize: 11 }}
                cursor={{ stroke: '#F87171', strokeWidth: 1, strokeDasharray: '3 3' }} />
              {/* avg reference line */}
              <ReferenceLine y={hrAvg} stroke="var(--border)" strokeDasharray="4 4" strokeWidth={1} />
              <Area type="monotone" dataKey="value" stroke="#F87171" strokeWidth={2.5}
                fill="url(#hrGrad)" dot={false}
                activeDot={{ r: 4, fill: '#F87171', stroke: 'var(--surface)', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'Today',     val: hrToday,     color: '#F87171', hi: false },
              { label: 'Average',   val: hrAvg,       color: 'var(--t1)', hi: false },
              { label: 'Lowest',    val: hrMin,       color: '#30D158', hi: false },
              { label: 'Highest',   val: hrMax,       color: '#FBBF24', hi: false },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 800, color, marginBottom: 3, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)',
                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sleep stages ─── */}
        {(() => {
          const total = sleepStages.reduce((a, b) => a + b.duration, 0);
          const STAGE_META: Record<string, { color: string }> = {
            'Awake': { color: '#F43F5E' },
            'REM':   { color: '#A78BFA' },
            'Light': { color: '#06B6D4' },
            'Deep':  { color: '#5856D6' },
          };
          return (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <p className="sec-label">Sleep Stages · Last Night</p>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#7B9FFF' }}>
                  {Math.floor(total / 60)}h {total % 60}m
                </span>
              </div>

              {/* Segmented bar */}
              <div style={{ display: 'flex', gap: 3, height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
                {sleepStages.map((s) => {
                  const { color } = STAGE_META[s.stage] ?? { color: s.color };
                  return <div key={s.stage} style={{ flex: s.duration / total, background: color, minWidth: 4, borderRadius: 2 }} />;
                })}
              </div>

              {/* 4-column compact legend */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {sleepStages.map((s) => {
                  const { color } = STAGE_META[s.stage] ?? { color: s.color };
                  const pct = Math.round((s.duration / total) * 100);
                  const hrs = Math.floor(s.duration / 60);
                  const mins = s.duration % 60;
                  return (
                    <div key={s.stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      background: 'var(--bg)', borderRadius: 12, padding: '10px 6px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                        {s.stage}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, textAlign: 'center' }}>
                        {hrs > 0 ? `${hrs}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`}
                      </p>
                      <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}15`, borderRadius: 20, paddingInline: 6, paddingBlock: 2 }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* â"€â"€ All vitals â"€â"€â"€ */}
        <p className="sec-label" style={{ paddingLeft: 2, marginBottom: -4 }}>All Metrics</p>
        {VITALS_META.map((meta) => <VitalCard key={meta.key} meta={meta} />)}

      </div>
    </div>
  );
};

export default VitalsScreen;

