import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X,
  Video, Phone,
  Star, Crown, Calendar, Clock,
  Trash2, Check, Shield, Zap, Sparkles, Bell,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */
export type AppPlan = 'access' | 'privilege';

type BookStep = 'home' | 'type' | 'provider' | 'date' | 'slot' | 'confirm' | 'success' | 'upgrade';

interface ConsultType  { id: string; label: string; duration: string; desc: string; color: string; }
interface Provider     {
  id: string; name: string; role: 'doctor'|'coach'; specialty: string;
  rating: number; reviews: number; initials: string; gradient: string;
  available: boolean; nextAvailable: string;
}
interface Appointment  { id: string; provider: Provider; type: ConsultType; dateLabel: string; slot: string; }
interface CalDate      { month: number; year: number; day: number; }

interface BookingScreenProps {
  onBack: () => void;
  onClose: () => void;
  plan: AppPlan;
  onBookingComplete?: () => void;
}

/* ─── Constants ──────────────────────────────────────────── */
const ACCESS_LIMIT   = 2;
const MONTHS_LONG    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT     = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const DAYS_LONG      = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const UNAVAIL_DAYS   = new Set([20, 27]); // specific dates blocked in May 2026
const UNAVAIL_SLOTS  = new Set(['8:30 AM','10:30 AM','1:00 PM','3:00 PM','5:30 PM','7:00 PM']);

/* ─── Mock data ──────────────────────────────────────────── */
const CONSULT_TYPES: ConsultType[] = [
  { id: 'video', label: 'Video Consultation', duration: '30 min', desc: 'Face-to-face via secure video call', color: '#0A84FF' },
  { id: 'phone', label: 'Phone Call',          duration: '20 min', desc: 'Quick voice consultation',           color: '#30D158' },
];

const PROVIDERS: Provider[] = [
  { id: 'sarah', name: 'Dr. Sarah Mitchell', role: 'doctor', specialty: 'Preventive Medicine & Longevity', rating: 4.9, reviews: 124, initials: 'SM', gradient: 'linear-gradient(135deg,#0A84FF,#30D158)',  available: true,  nextAvailable: 'Tomorrow, 10 AM' },
  { id: 'james', name: 'Dr. James Chen',     role: 'doctor', specialty: 'Cardiology & Heart Health',       rating: 4.8, reviews: 98,  initials: 'JC', gradient: 'linear-gradient(135deg,#5B7FFF,#A07BFF)',  available: true,  nextAvailable: 'Thu, May 15'     },
  { id: 'maya',  name: 'Coach Maya Patel',   role: 'coach',  specialty: 'Lifestyle & Nutrition Coach',     rating: 4.9, reviews: 213, initials: 'MP', gradient: 'linear-gradient(135deg,#FF9F0A,#FF375F)',  available: true,  nextAvailable: 'Today, 3 PM'     },
  { id: 'priya', name: 'Dr. Priya Sharma',   role: 'doctor', specialty: 'Functional Medicine',             rating: 4.7, reviews: 67,  initials: 'PS', gradient: 'linear-gradient(135deg,#30D158,#0A84FF)',  available: false, nextAvailable: 'Mon, May 19'     },
];

const TIME_SLOTS: Record<string, string[]> = {
  Morning:   ['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM'],
  Afternoon: ['12:00 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'],
  Evening:   ['5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM'],
};

const INIT_APPOINTMENTS: Appointment[] = [
  { id: 'appt-0', provider: PROVIDERS[0], type: CONSULT_TYPES[0], dateLabel: 'Wednesday, May 14', slot: '10:00 AM' },
];

/* ─── Helpers ────────────────────────────────────────────── */
function buildCalendar(year: number, month: number) {
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const todayTs      = new Date(2026, 4, 12).getTime(); // mock today

  const cells: Array<{ day: number | null; available: boolean; isToday: boolean }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, available: false, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const ts       = new Date(year, month, d).getTime();
    const dow      = new Date(year, month, d).getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isPast   = ts <= todayTs;
    const isToday  = ts === todayTs;
    const available = !isWeekend && !isPast && !(month === 4 && UNAVAIL_DAYS.has(d));
    cells.push({ day: d, available, isToday });
  }
  return cells;
}

function fmtDate(year: number, month: number, day: number): string {
  const d = new Date(year, month, day);
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS_LONG[month].slice(0, 3)} ${day}`;
}

/* ─── Small shared components ────────────────────────────── */
const ProviderAvatar: React.FC<{ p: Provider; size?: number }> = ({ p, size = 44 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
    background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ fontSize: size * 0.35, fontWeight: 800, color: '#FFF' }}>{p.initials}</span>
  </div>
);

const ConsultIcon: React.FC<{ id: string; size: number; color: string }> = ({ id, size, color }) => {
  if (id === 'video') return <Video size={size} color={color} />;
  if (id === 'phone') return <Phone size={size} color={color} />;
  return null;
};

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
  <div style={{ padding: '0 20px 22px', display: 'flex', gap: 5 }}>
    {[0,1,2,3,4].map(i => (
      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
        background: i <= step ? '#0A84FF' : 'var(--border)', transition: 'background 0.3s' }} />
    ))}
  </div>
);

const BackHeader: React.FC<{
  onBack: () => void; onClose?: () => void;
  title: string; sub?: string;
}> = ({ onBack, onClose, title, sub }) => (
  <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
      style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--surface)',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
      <ChevronLeft size={18} color="var(--t2)" />
    </motion.button>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>{title}</p>
      {sub && <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 1 }}>{sub}</p>}
    </div>
    {onClose && (
      <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
        style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)',
          border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <X size={16} color="var(--t2)" />
      </motion.button>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════ */
/*  ROOT                                                      */
/* ══════════════════════════════════════════════════════════ */
const BookingScreen: React.FC<BookingScreenProps> = ({ onBack, onClose, plan, onBookingComplete }) => {
  const [step,     setStep]     = useState<BookStep>('home');
  const [selType,  setSelType]  = useState<ConsultType | null>(null);
  const [selProv,  setSelProv]  = useState<Provider    | null>(null);
  const [calMonth, setCalMonth] = useState(4);   // May
  const [calYear,  setCalYear]  = useState(2026);
  const [calDate,  setCalDate]  = useState<CalDate | null>(null);
  const [selSlot,  setSelSlot]  = useState<string  | null>(null);
  const [appts,    setAppts]    = useState<Appointment[]>(INIT_APPOINTMENTS);
  const [cancelId, setCancelId] = useState<string  | null>(null);

  const atLimit   = plan === 'access' && appts.length >= ACCESS_LIMIT;
  const remaining = plan === 'access' ? Math.max(0, ACCESS_LIMIT - appts.length) : null;
  const T = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

  const go = (s: BookStep) => setStep(s);

  const startNew = () => {
    if (atLimit) { go('upgrade'); return; }
    setSelType(null); setSelProv(null); setCalDate(null); setSelSlot(null);
    go('type');
  };

  const confirmBooking = () => {
    if (!selType || !selProv || !calDate || !selSlot) return;
    setAppts(prev => [...prev, {
      id: `appt-${Date.now()}`,
      provider:  selProv,
      type:      selType,
      dateLabel: fmtDate(calDate.year, calDate.month, calDate.day),
      slot:      selSlot,
    }]);
    onBookingComplete?.();
    go('success');
  };

  const cancelAppt = (id: string) => {
    setAppts(prev => prev.filter(a => a.id !== id));
    setCancelId(null);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
    setCalDate(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
    setCalDate(null);
  };

  /* ── HOME ────────────────────────────────────────────────── */
  const HomeContent = (
    <div className="page-scroll" style={{ paddingBottom: 40 }}>
      <div style={{ height: 52 }} />
      {/* Header */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--surface)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={18} color="var(--t2)" />
          </motion.button>
          <div>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>Appointments</p>
            <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 1 }}>Schedule & manage consultations</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer' }}>
          <X size={16} color="var(--t2)" />
        </motion.button>
      </div>

      {/* Plan credits banner */}
      <div style={{ padding: '0 16px 18px' }}>
        {plan === 'access' ? (
          <div style={{ borderRadius: 20, padding: '16px 18px',
            background: atLimit ? 'rgba(249,115,22,0.08)' : 'rgba(10,132,255,0.07)',
            border: `1px solid ${atLimit ? 'rgba(249,115,22,0.22)' : 'rgba(10,132,255,0.2)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: atLimit ? 'rgba(249,115,22,0.15)' : 'rgba(10,132,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={17} color={atLimit ? '#F97316' : '#0A84FF'} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                    {atLimit ? 'Limit reached' : `${remaining} appointment${remaining !== 1 ? 's' : ''} left`}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 1 }}>PRVNT Access · {ACCESS_LIMIT} per period</p>
                </div>
              </div>
              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: 5 }}>
                {Array.from({ length: ACCESS_LIMIT }).map((_, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', transition: 'background 0.3s',
                    background: i < appts.length ? (atLimit ? '#F97316' : '#0A84FF') : 'var(--border)' }} />
                ))}
              </div>
            </div>
            {atLimit && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(249,115,22,0.15)' }}>
                <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 10 }}>
                  You've reached the appointment limit for your current <strong style={{ color: 'var(--t1)' }}>PRVNT Access</strong> plan.
                  Upgrade for unlimited bookings.
                </p>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => go('upgrade')}
                  style={{ height: 34, paddingInline: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#F97316,#EF4444)', color: '#FFF',
                    fontSize: 12, fontWeight: 700, fontFamily: 'Inter',
                    display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Crown size={12} /> Explore Privilege
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ borderRadius: 20, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(135deg,rgba(91,127,255,0.1),rgba(160,123,255,0.1))',
            border: '1px solid rgba(160,123,255,0.22)' }}>
            <Crown size={18} color="#A07BFF" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Unlimited appointments</p>
              <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 1 }}>PRVNT Privilege · Book as many as you need</p>
            </div>
          </div>
        )}
      </div>

      {/* Book button */}
      <div style={{ padding: '0 16px 24px' }}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={startNew}
          style={{ width: '100%', height: 52, borderRadius: 18, cursor: 'pointer',
            background: atLimit ? 'var(--surface)' : 'linear-gradient(135deg,#0A84FF,#30D158)',
            color: atLimit ? 'var(--t3)' : '#FFF',
            border: atLimit ? '1px solid var(--border)' : 'none',
            fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: atLimit ? 'none' : '0 4px 20px rgba(10,132,255,0.28)' }}>
          <Calendar size={17} color={atLimit ? 'var(--t3)' : '#FFF'} />
          {atLimit ? 'No bookings remaining' : 'Book New Appointment'}
        </motion.button>
      </div>

      {/* Upcoming list */}
      <div style={{ padding: '0 16px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: 12, paddingInline: 4 }}>Upcoming</p>

        {appts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '44px 20px', background: 'var(--surface)',
            borderRadius: 20, border: '1px solid var(--border)' }}>
            <Calendar size={36} color="var(--t3)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>No appointments yet</p>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>Book your first consultation to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {appts.map(a => (
              <motion.div key={a.id} layout
                style={{ background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ProviderAvatar p={a.provider} size={46} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.provider.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <ConsultIcon id={a.type.id} size={11} color={a.type.color} />
                      <p style={{ fontSize: 12, color: 'var(--t2)' }}>{a.type.label}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                      <Calendar size={11} color="var(--t3)" />
                      <p style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 500 }}>{a.dateLabel}</p>
                      <span style={{ color: 'var(--t3)', fontSize: 10 }}>·</span>
                      <Clock size={11} color="var(--t3)" />
                      <p style={{ fontSize: 12, color: 'var(--t2)' }}>{a.slot}</p>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => setCancelId(a.id)}
                    style={{ width: 32, height: 32, borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} color="#EF4444" />
                  </motion.button>
                </div>
                <div style={{ paddingInline: 16, paddingBottom: 12, display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, paddingInline: 8, paddingBlock: 3,
                    borderRadius: 20, background: `${a.type.color}15`, color: a.type.color }}>
                    {a.type.duration}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, paddingInline: 8, paddingBlock: 3,
                    borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                    Confirmed
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirm bottom sheet */}
      <AnimatePresence>
        {cancelId && (
          <motion.div key="cancel-sheet"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'flex-end',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
            onClick={() => setCancelId(null)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', background: 'var(--surface)', borderRadius: '24px 24px 0 0',
                padding: '24px 20px 44px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 20px' }} />
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(239,68,68,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Trash2 size={22} color="#EF4444" />
                </div>
                <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Cancel appointment?</p>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.55 }}>
                  This slot will open up and become available for rebooking.
                  {plan === 'access' && ' Your booking credit will be restored.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCancelId(null)}
                  style={{ flex: 1, height: 48, borderRadius: 14, cursor: 'pointer',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    fontSize: 14, fontWeight: 600, fontFamily: 'Inter', color: 'var(--t2)' }}>
                  Keep it
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => cancelAppt(cancelId)}
                  style={{ flex: 1, height: 48, borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: '#EF4444', color: '#FFF', fontSize: 14, fontWeight: 700, fontFamily: 'Inter' }}>
                  Yes, cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ── SELECT TYPE ─────────────────────────────────────────── */
  const TypeContent = (
    <div className="page-scroll" style={{ paddingBottom: 40 }}>
      <div style={{ height: 52 }} />
      <BackHeader onBack={() => go('home')} title="Consultation Type" sub="How would you like to connect?" />
      <ProgressBar step={0} />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CONSULT_TYPES.map(ct => (
          <motion.button key={ct.id} whileTap={{ scale: 0.97 }}
            onClick={() => { setSelType(ct); go('provider'); }}
            style={{ background: selType?.id === ct.id ? `${ct.color}08` : 'var(--surface)',
              border: selType?.id === ct.id ? `2px solid ${ct.color}` : '1px solid var(--border)',
              borderRadius: 18, padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0,
              background: `${ct.color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ConsultIcon id={ct.id} size={22} color={ct.color} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{ct.label}</p>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{ct.desc}</p>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: ct.color }}>{ct.duration}</p>
              <ChevronRight size={16} color="var(--t3)" style={{ marginTop: 4 }} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  /* ── SELECT PROVIDER ─────────────────────────────────────── */
  const ProviderContent = (
    <div className="page-scroll" style={{ paddingBottom: 40 }}>
      <div style={{ height: 52 }} />
      <BackHeader onBack={() => go('type')} title="Choose Provider"
        sub={selType ? `${selType.label} · ${selType.duration}` : ''} />
      <ProgressBar step={1} />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PROVIDERS.map(p => (
          <motion.button key={p.id} whileTap={{ scale: p.available ? 0.97 : 1 }}
            onClick={() => { if (!p.available) return; setSelProv(p); go('date'); }}
            style={{ background: selProv?.id === p.id ? 'rgba(10,132,255,0.05)' : 'var(--surface)',
              border: selProv?.id === p.id ? '2px solid #0A84FF' : '1px solid var(--border)',
              borderRadius: 18, padding: '16px', cursor: p.available ? 'pointer' : 'default',
              textAlign: 'left', opacity: p.available ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ProviderAvatar p={p} size={54} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  {p.role === 'doctor' && <Star size={11} fill="#FFD60A" color="#FFD60A" />}
                </div>
                <p style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 5 }}>{p.specialty}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>★ {p.rating}</span>
                  <span style={{ fontSize: 11, color: 'var(--t3)' }}>({p.reviews})</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <span style={{ fontSize: 10, fontWeight: 700, paddingInline: 8, paddingBlock: 3,
                  borderRadius: 20, display: 'block', marginBottom: 5,
                  background: p.available ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                  color: p.available ? '#059669' : 'var(--t3)' }}>
                  {p.available ? 'Available' : 'Away'}
                </span>
                <p style={{ fontSize: 11, color: 'var(--t3)' }}>{p.nextAvailable}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  /* ── SELECT DATE ─────────────────────────────────────────── */
  const cells = buildCalendar(calYear, calMonth);

  const DateContent = (
    <div className="page-scroll" style={{ paddingBottom: 40 }}>
      <div style={{ height: 52 }} />
      <BackHeader onBack={() => go('provider')} title="Select Date"
        sub={selProv?.name ?? ''} />
      <ProgressBar step={2} />
      <div style={{ padding: '0 16px' }}>
        {/* Calendar card */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Month nav */}
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)' }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth}
              style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg)',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={16} color="var(--t2)" />
            </motion.button>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
              {MONTHS_LONG[calMonth]} {calYear}
            </p>
            <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth}
              style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg)',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronRight size={16} color="var(--t2)" />
            </motion.button>
          </div>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '10px 10px 4px' }}>
            {DAYS_SHORT.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700,
                color: 'var(--t3)', paddingBlock: 4 }}>{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 10px 14px', gap: 2 }}>
            {cells.map((cell, idx) => {
              if (!cell.day) return <div key={idx} />;
              const isSel = calDate?.day === cell.day && calDate?.month === calMonth && calDate?.year === calYear;
              const isToday = cell.isToday;
              return (
                <motion.button key={idx}
                  whileTap={cell.available ? { scale: 0.85 } : {}}
                  onClick={() => cell.available && setCalDate({ day: cell.day!, month: calMonth, year: calYear })}
                  style={{ aspectRatio: '1', borderRadius: 10, border: 'none',
                    cursor: cell.available ? 'pointer' : 'default',
                    background: isSel ? '#0A84FF' : isToday ? 'rgba(10,132,255,0.1)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: isSel ? 800 : isToday ? 700 : 500, lineHeight: 1,
                    color: isSel ? '#FFF' : isToday ? '#0A84FF' : cell.available ? 'var(--t1)' : 'var(--t3)' }}>
                    {cell.day}
                  </span>
                  {cell.available && !isSel && (
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#30D158' }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingInline: 4 }}>
          {[['#30D158','Available'],['#0A84FF','Selected'],['var(--border)','Unavailable']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Continue */}
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => calDate && go('slot')} disabled={!calDate}
          style={{ width: '100%', height: 52, borderRadius: 18, marginTop: 22, border: 'none',
            cursor: calDate ? 'pointer' : 'default',
            background: calDate ? '#0A84FF' : 'var(--surface)',
            color: calDate ? '#FFF' : 'var(--t3)',
            outline: calDate ? 'none' : '1px solid var(--border)',
            fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
            boxShadow: calDate ? '0 4px 20px rgba(10,132,255,0.28)' : 'none',
            transition: 'all 0.2s ease' }}>
          {calDate ? 'Continue' : 'Select a date'}
        </motion.button>
      </div>
    </div>
  );

  /* ── SELECT SLOT ─────────────────────────────────────────── */
  const SlotContent = (() => {
    // Build only available slots per period
    const availablePeriods = Object.entries(TIME_SLOTS)
      .map(([period, slots]) => ({
        period,
        slots: slots.filter(s => !UNAVAIL_SLOTS.has(s)),
      }))
      .filter(p => p.slots.length > 0);

    return (
      <div className="page-scroll" style={{ paddingBottom: 40 }}>
        <div style={{ height: 52 }} />
        <BackHeader onBack={() => go('date')} title="Select Time" sub="Choose an available slot" />
        <ProgressBar step={3} />

        {/* Selected date chip */}
        {calDate && (
          <div style={{ padding: '0 20px 18px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
              paddingInline: 12, paddingBlock: 6, borderRadius: 20,
              background: 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.18)' }}>
              <Calendar size={12} color="#0A84FF" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0A84FF' }}>
                {fmtDate(calDate.year, calDate.month, calDate.day)}
              </span>
            </div>
          </div>
        )}

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {availablePeriods.map(({ period, slots }) => (
            <div key={period}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                {period}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {slots.map(slot => {
                  const isSel = selSlot === slot;
                  return (
                    <motion.button key={slot} whileTap={{ scale: 0.93 }}
                      onClick={() => setSelSlot(slot)}
                      style={{ height: 48, borderRadius: 14, cursor: 'pointer',
                        background: isSel ? '#0A84FF' : 'var(--surface)',
                        border: isSel ? 'none' : '1px solid var(--border)',
                        color: isSel ? '#FFF' : 'var(--t1)',
                        fontSize: 13, fontWeight: 600, fontFamily: 'Inter',
                        transition: 'all 0.15s ease',
                        boxShadow: isSel ? '0 2px 12px rgba(10,132,255,0.25)' : 'none' }}>
                      {slot}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '28px 16px 0' }}>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => selSlot && go('confirm')} disabled={!selSlot}
            style={{ width: '100%', height: 52, borderRadius: 18, border: 'none',
              cursor: selSlot ? 'pointer' : 'default',
              background: selSlot ? '#0A84FF' : 'var(--surface)',
              color: selSlot ? '#FFF' : 'var(--t3)',
              outline: selSlot ? 'none' : '1px solid var(--border)',
              fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
              boxShadow: selSlot ? '0 4px 20px rgba(10,132,255,0.28)' : 'none',
              transition: 'all 0.2s ease' }}>
            {selSlot ? 'Continue' : 'Select a time slot'}
          </motion.button>
        </div>
      </div>
    );
  })();

  /* ── CONFIRM ─────────────────────────────────────────────── */
  const ConfirmContent = (
    <div className="page-scroll" style={{ paddingBottom: 40 }}>
      <div style={{ height: 52 }} />
      <BackHeader onBack={() => go('slot')} title="Confirm Booking" sub="Review your appointment details" />
      <ProgressBar step={4} />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Summary card */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Provider row */}
          <div style={{ padding: '18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {selProv && <ProviderAvatar p={selProv} size={54} />}
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{selProv?.name}</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>{selProv?.specialty}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}>★ {selProv?.rating}</span>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>({selProv?.reviews} reviews)</span>
              </div>
            </div>
          </div>
          {/* Detail rows */}
          {[
            { label: 'Type',     value: selType?.label ?? '',   sub: selType?.duration,  icon: <ConsultIcon id={selType?.id ?? ''} size={14} color={selType?.color ?? '#0A84FF'} /> },
            { label: 'Date',     value: calDate ? fmtDate(calDate.year, calDate.month, calDate.day) : '', icon: <Calendar size={14} color="#0A84FF" /> },
            { label: 'Time',     value: selSlot ?? '',          icon: <Clock size={14} color="#0A84FF" /> },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ padding: '14px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {row.icon}
                <span style={{ fontSize: 13, color: 'var(--t2)' }}>{row.label}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{row.value}</p>
                {row.sub && <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 1 }}>{row.sub}</p>}
              </div>
            </div>
          ))}
        </div>
        {/* Reminder note */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '13px 16px', borderRadius: 16,
          background: 'rgba(10,132,255,0.06)', border: '1px solid rgba(10,132,255,0.15)' }}>
          <Bell size={14} color="#0A84FF" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.55 }}>
            You'll receive a reminder 1 hour before your appointment and a follow-up summary afterwards.
          </p>
        </div>
        {/* Confirm CTA */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={confirmBooking}
          style={{ width: '100%', height: 54, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#0A84FF,#30D158)', color: '#FFF',
            fontSize: 16, fontWeight: 800, fontFamily: 'Inter',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 24px rgba(10,132,255,0.32)' }}>
          <Check size={18} /> Confirm Appointment
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => go('home')}
          style={{ width: '100%', height: 44, borderRadius: 14, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--border)',
            fontSize: 14, fontWeight: 600, fontFamily: 'Inter', color: 'var(--t2)' }}>
          Cancel
        </motion.button>
      </div>
    </div>
  );

  /* ── SUCCESS ─────────────────────────────────────────────── */
  const SuccessContent = (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg)' }}>
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        style={{ width: 90, height: 90, borderRadius: 30, marginBottom: 24,
          background: 'linear-gradient(135deg,#0A84FF,#30D158)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(10,132,255,0.38)' }}>
        <Check size={42} color="#FFF" strokeWidth={2.5} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }} style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: 8 }}>
          You're booked!
        </p>
        <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, maxWidth: 270, margin: '0 auto' }}>
          Your appointment with{' '}
          <strong style={{ color: 'var(--t1)' }}>{selProv?.name}</strong>{' '}
          has been confirmed.
        </p>
      </motion.div>
      {/* Booking pill */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)',
          padding: '16px 20px', width: '100%', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          {selProv && <ProviderAvatar p={selProv} size={40} />}
          <span style={{ fontSize: 11, fontWeight: 700, paddingInline: 10, paddingBlock: 4,
            borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#059669' }}>Confirmed</span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>{selProv?.name}</p>
        <p style={{ fontSize: 13, color: 'var(--t2)' }}>
          {selType?.label} · {calDate ? fmtDate(calDate.year, calDate.month, calDate.day) : ''} at {selSlot}
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => go('home')}
          style={{ width: '100%', height: 52, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: '#0A84FF', color: '#FFF', fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
            boxShadow: '0 4px 20px rgba(10,132,255,0.3)' }}>
          View My Appointments
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
          style={{ width: '100%', height: 46, borderRadius: 16, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--border)',
            fontSize: 14, fontWeight: 600, fontFamily: 'Inter', color: 'var(--t2)' }}>
          Back to Messages
        </motion.button>
      </motion.div>
    </div>
  );

  /* ── UPGRADE ─────────────────────────────────────────────── */
  const UpgradeContent = (
    <div className="page-scroll" style={{ paddingBottom: 40 }}>
      <div style={{ height: 52 }} />
      <BackHeader onBack={() => go('home')} onClose={onClose} title="PRVNT Privilege" sub="Unlock unlimited access" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero */}
        <div style={{ borderRadius: 24, padding: '32px 24px', textAlign: 'center',
          background: 'linear-gradient(135deg,#0d0d1a 0%,#12162e 50%,#0a1a35 100%)',
          position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%',
            background: 'rgba(91,127,255,0.18)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(160,123,255,0.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            style={{ position: 'relative' }}>
            <Crown size={44} color="#FFD60A" style={{ marginBottom: 14 }} />
          </motion.div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#FFF', letterSpacing: '-0.03em', marginBottom: 8, position: 'relative' }}>
            PRVNT Privilege
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: 260, margin: '0 auto', position: 'relative' }}>
            You've used your 2 appointments on PRVNT Access.
            Privilege gives you unlimited bookings and a dedicated health team.
          </p>
        </div>

        {/* Features */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {[
            { icon: <Calendar size={15} color="#0A84FF" />,  title: 'Unlimited appointments',    desc: 'Book as many consultations as you need',        bg: 'rgba(10,132,255,0.12)' },
            { icon: <Video    size={15} color="#30D158" />,  title: 'Priority video calls',       desc: 'Same-day availability, no waiting',              bg: 'rgba(48,209,88,0.12)'  },
            { icon: <Shield   size={15} color="#A07BFF" />,  title: 'Dedicated health team',      desc: 'Your assigned doctor, coach & nutritionist',     bg: 'rgba(160,123,255,0.12)' },
            { icon: <Sparkles size={15} color="#FFD60A" />,  title: 'Advanced AI insights',       desc: 'Deeper analysis with your full health context',  bg: 'rgba(255,214,10,0.12)' },
            { icon: <Zap      size={15} color="#F97316" />,  title: 'Faster doctor responses',    desc: 'Replies within 30 minutes, guaranteed',          bg: 'rgba(249,115,22,0.12)' },
          ].map((feat, i, arr) => (
            <div key={feat.title} style={{ padding: '14px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{feat.title}</p>
                <p style={{ fontSize: 12, color: 'var(--t2)' }}>{feat.desc}</p>
              </div>
              <Check size={15} color="#30D158" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Plan comparison */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { name: 'PRVNT Access', isCurrent: true,  features: ['2 appts / period', 'AI chat access', 'Basic health tracking'] },
            { name: 'PRVNT Privilege', isCurrent: false, features: ['Unlimited appts', 'Priority doctor', 'Full health team'] },
          ].map(p => (
            <div key={p.name} style={{ flex: 1, borderRadius: 16, padding: '14px 12px',
              background: p.isCurrent ? 'var(--surface)' : 'rgba(91,127,255,0.08)',
              border: `1px solid ${p.isCurrent ? 'var(--border)' : 'rgba(160,123,255,0.3)'}` }}>
              <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 2,
                color: p.isCurrent ? 'var(--t2)' : '#A07BFF' }}>{p.name}</p>
              <p style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 10 }}>
                {p.isCurrent ? 'Your plan' : 'Upgrade'}
              </p>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
                    background: p.isCurrent ? 'var(--t3)' : '#A07BFF' }} />
                  <p style={{ fontSize: 11, color: p.isCurrent ? 'var(--t3)' : 'var(--t2)' }}>{f}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <motion.button whileTap={{ scale: 0.97 }}
          style={{ width: '100%', height: 54, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#5B7FFF,#A07BFF)', color: '#FFF',
            fontSize: 16, fontWeight: 800, fontFamily: 'Inter',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 24px rgba(91,127,255,0.4)' }}>
          <Crown size={18} /> Upgrade to Privilege
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => go('home')}
          style={{ width: '100%', height: 44, borderRadius: 14, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--border)',
            fontSize: 14, fontWeight: 600, fontFamily: 'Inter', color: 'var(--t2)' }}>
          Maybe later
        </motion.button>
      </div>
    </div>
  );

  /* ── RENDER ──────────────────────────────────────────────── */
  const stepContent: Record<BookStep, React.ReactNode> = {
    home:     HomeContent,
    type:     TypeContent,
    provider: ProviderContent,
    date:     DateContent,
    slot:     SlotContent,
    confirm:  ConfirmContent,
    success:  SuccessContent,
    upgrade:  UpgradeContent,
  };

  const slideDir = (s: BookStep) =>
    s === 'home' || s === 'success' ? 0 : 30;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: step === 'success' ? 0 : 30, scale: step === 'success' ? 0.96 : 1 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: step === 'success' ? 0 : -20 }}
          transition={T}
          style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
          {stepContent[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BookingScreen;
