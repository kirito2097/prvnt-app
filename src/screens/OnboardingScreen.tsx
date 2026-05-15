import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Shield, Zap } from 'lucide-react';
import type { Plan } from '../context/ThemeContext';

interface OnboardingScreenProps {
  onComplete: (plan: Plan) => void;
}

const introSlides = [
  {
    title: 'Your body has\na story.',
    sub: 'PRVNT reads your wearable data, lab results, and daily patterns to surface what matters most.',
  },
  {
    title: 'Science, not\nguesswork.',
    sub: 'Every recommendation is grounded in peer-reviewed research and your own biological data.',
  },
];

const goalOptions = [
  { id: 'longevity',   icon: '🧬', label: 'Longevity',     sub: 'Live longer, healthier' },
  { id: 'performance', icon: 'âš¡', label: 'Performance',   sub: 'Optimise output' },
  { id: 'sleep',       icon: '🌙', label: 'Better Sleep',  sub: 'Rest & recovery' },
  { id: 'stress',      icon: '🧘', label: 'Stress Relief', sub: 'Calm nervous system' },
  { id: 'weight',      icon: '⚖️', label: 'Body Goals',    sub: 'Composition focus' },
  { id: 'energy',      icon: '☀️', label: 'More Energy',   sub: 'Fight fatigue' },
];

const deviceOptions = [
  { id: 'apple_watch',  icon: '⌚', label: 'Apple Watch' },
  { id: 'oura',         icon: '💍', label: 'Oura Ring' },
  { id: 'whoop',        icon: '📿', label: 'WHOOP' },
  { id: 'garmin',       icon: '🏃', label: 'Garmin' },
  { id: 'apple_health', icon: '🍎', label: 'Apple Health' },
  { id: 'none',         icon: '📱', label: 'No device' },
];

const plans: { id: Plan; name: string; price: string; sub: string; icon: React.ReactNode; features: string[]; badge?: string }[] = [
  {
    id: 'access', name: 'PRVNT Access', price: '$99', sub: 'per month',
    icon: <Shield size={20} />,
    features: ['Health score & blueprint', 'Lab report analysis', 'AI health assistant', 'Basic wearable sync'],
  },
  {
    id: 'privilege', name: 'PRVNT Privilege', price: '$299', sub: 'per month',
    icon: <Zap size={20} />,
    features: ['Everything in Access', 'GP telehealth included', 'Premium dark theme', 'Priority AI responses', 'Specialist referrals'],
    badge: 'Most Popular',
  },
];

/* Animated score ring for intro slide 0 */
const IntroRing: React.FC = () => {
  const r = 44; const c = 2 * Math.PI * r;
  return (
    <svg width={110} height={110} style={{ overflow: 'visible' }}>
      <circle cx={55} cy={55} r={r} fill="none" stroke="rgba(91,127,255,0.15)" strokeWidth={9} />
      <motion.circle cx={55} cy={55} r={r} fill="none" stroke="#5B7FFF" strokeWidth={9}
        strokeLinecap="round" strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * 0.18 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotate: -90, transformOrigin: '55px 55px', filter: 'drop-shadow(0 0 8px rgba(91,127,255,0.5))' }}
      />
      <text x={55} y={62} textAnchor="middle" fill="#5B7FFF" fontSize={22} fontWeight={800} fontFamily="Inter">82</text>
    </svg>
  );
};

const fade = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };
const dark = '#0D0D12'; const sub_ = '#6B6B82'; const dim = '#A0A0B5';

const chip = (sel: boolean): React.CSSProperties => ({
  background: sel ? dark : '#FFFFFF',
  border: `1.5px solid ${sel ? dark : 'rgba(0,0,0,0.08)'}`,
  borderRadius: 18,
  transition: 'all 0.15s ease',
});

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step,     setStep]     = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [goals,    setGoals]    = useState<string[]>([]);
  const [devices,  setDevices]  = useState<string[]>([]);
  const [plan,     setPlan]     = useState<Plan>('access');

  const toggle = (arr: string[], set: React.Dispatch<React.SetStateAction<string[]>>, id: string) =>
    set(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const canContinue = () => step === 1 ? goals.length > 0 : step === 2 ? devices.length > 0 : true;

  const next = () => {
    if (step === 0 && slideIdx < introSlides.length - 1) { setSlideIdx(s => s + 1); return; }
    setStep(s => s + 1); setSlideIdx(0);
  };
  const back = () => {
    if (step === 0 && slideIdx > 0) { setSlideIdx(s => s - 1); return; }
    if (step > 0) setStep(s => s - 1);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F4F3EE', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Progress */}
      <div style={{ height: 48 }} />
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ height: 3, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
            style={{ height: '100%', background: dark, borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: dim, marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Step {step + 1} of 4
        </p>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">

          {/* Intro */}
          {step === 0 && (
            <motion.div key={`intro-${slideIdx}`} {...fade} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
              <div style={{ marginBottom: 36 }}>
                {slideIdx === 0 ? <IntroRing /> : (
                  <div style={{ fontSize: 64, lineHeight: 1 }}>🔬</div>
                )}
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 800, color: dark, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14, whiteSpace: 'pre-line' }}>
                {introSlides[slideIdx].title}
              </h1>
              <p style={{ fontSize: 16, color: sub_, lineHeight: 1.65, maxWidth: 280 }}>
                {introSlides[slideIdx].sub}
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 32 }}>
                {introSlides.map((_, i) => (
                  <motion.div key={i} animate={{ width: i === slideIdx ? 20 : 6, background: i === slideIdx ? dark : 'rgba(0,0,0,0.15)' }}
                    style={{ height: 6, borderRadius: 3 }} transition={{ duration: 0.3 }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Goals */}
          {step === 1 && (
            <motion.div key="goals" {...fade} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
              style={{ height: '100%', overflowY: 'auto', padding: '0 20px 20px' }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: dark, letterSpacing: '-0.015em', marginBottom: 6 }}>What are your goals?</h2>
              <p style={{ fontSize: 14, color: sub_, marginBottom: 20 }}>Select all that apply.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {goalOptions.map(({ id, icon, label, sub }) => {
                  const sel = goals.includes(id);
                  return (
                    <motion.button key={id} whileTap={{ scale: 0.96 }} onClick={() => toggle(goals, setGoals, id)}
                      style={{ ...chip(sel), padding: '16px 14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 24 }}>{icon}</span>
                        {sel && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={11} color="#FFF" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: sel ? '#FFF' : dark }}>{label}</span>
                      <span style={{ fontSize: 12, color: sel ? 'rgba(255,255,255,0.55)' : dim }}>{sub}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Devices */}
          {step === 2 && (
            <motion.div key="devices" {...fade} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
              style={{ height: '100%', overflowY: 'auto', padding: '0 20px 20px' }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: dark, letterSpacing: '-0.015em', marginBottom: 6 }}>Connect your devices</h2>
              <p style={{ fontSize: 14, color: sub_, marginBottom: 20 }}>More data, smarter insights.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {deviceOptions.map(({ id, icon, label }) => {
                  const sel = devices.includes(id);
                  return (
                    <motion.button key={id} whileTap={{ scale: 0.96 }} onClick={() => toggle(devices, setDevices, id)}
                      style={{ ...chip(sel), padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <span style={{ fontSize: 28 }}>{icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.3, color: sel ? '#FFF' : dark }}>{label}</span>
                      {sel && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={9} color="#FFF" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Plan */}
          {step === 3 && (
            <motion.div key="plan" {...fade} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
              style={{ height: '100%', overflowY: 'auto', padding: '0 20px 20px' }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: dark, letterSpacing: '-0.015em', marginBottom: 6 }}>Choose your plan</h2>
              <p style={{ fontSize: 14, color: sub_, marginBottom: 20 }}>You can change anytime in settings.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plans.map((p) => {
                  const sel = plan === p.id;
                  return (
                    <motion.button key={p.id as string} whileTap={{ scale: 0.98 }} onClick={() => setPlan(p.id)}
                      style={{ width: '100%', padding: 20, textAlign: 'left', borderRadius: 24, position: 'relative', overflow: 'hidden', cursor: 'pointer',
                        background: sel ? dark : '#FFF', border: `1.5px solid ${sel ? dark : 'rgba(0,0,0,0.08)'}`, transition: 'all 0.2s ease' }}>
                      {p.badge && (
                        <div style={{ position: 'absolute', top: 14, right: 14, background: '#F59E0B', borderRadius: 20, padding: '2px 10px' }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#FFF', letterSpacing: '0.04em' }}>{p.badge}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: sel ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: sel ? '#FFF' : dark }}>
                          {p.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: sel ? '#FFF' : dark, marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: 13, color: sel ? 'rgba(255,255,255,0.5)' : sub_ }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: sel ? 'rgba(255,255,255,0.9)' : dark }}>{p.price}</span>{' '}{p.sub}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {p.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Check size={14} color={sel ? 'rgba(255,255,255,0.5)' : '#00C48C'} strokeWidth={2.5} />
                            <span style={{ fontSize: 13, color: sel ? 'rgba(255,255,255,0.7)' : '#374151' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div style={{ padding: '12px 20px 36px', display: 'flex', gap: 12 }}>
        {(step > 0 || slideIdx > 0) && (
          <button onClick={back} style={{ width: 52, height: 52, borderRadius: 16, background: '#FFF', border: '1.5px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
            <ChevronLeft size={20} color={dark} />
          </button>
        )}
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={step === 3 ? () => onComplete(plan) : next}
          disabled={!canContinue()}
          style={{ flex: 1, height: 52, borderRadius: 16, cursor: canContinue() ? 'pointer' : 'default',
            background: canContinue() ? dark : 'rgba(0,0,0,0.08)',
            color: canContinue() ? '#FFF' : dim,
            fontWeight: 700, fontSize: 15, fontFamily: 'Inter',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s ease' }}>
          {step === 3 ? 'Get started' : 'Continue'}
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default OnboardingScreen;

