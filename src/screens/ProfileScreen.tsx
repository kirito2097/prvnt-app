import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Moon, Sun, Shield, Zap, Bell, Lock, HelpCircle,
  ClipboardList, Bluetooth, LogOut, X, Check,
  MessageCircle, Mail, Phone, BookOpen, Bug,
  Globe, Ruler, Star, Target, Heart,
  Download, Trash2, Fingerprint, Clock, FileText,
  AlertCircle, Info, CreditCard, User, Edit3, SlidersHorizontal,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { user } from '../data/mockData';
import type { SubScreen } from '../types/navigation';

interface ProfileScreenProps {
  onOpenSubScreen: (s: SubScreen) => void;
  onSignOut: () => void;
}

type Panel = 'notifications' | 'privacy' | 'help' | 'faq' | 'settings' | 'whats-new' | null;

/* ─── Toggle component ───────────────────────────────────── */
const Toggle: React.FC<{ on: boolean; onChange: () => void; disabled?: boolean }> = ({ on, onChange, disabled }) => (
  <motion.button
    whileTap={disabled ? {} : { scale: 0.92 }}
    onClick={disabled ? undefined : onChange}
    style={{
      width: 48, height: 27, borderRadius: 14, border: 'none',
      cursor: disabled ? 'default' : 'pointer', position: 'relative', flexShrink: 0,
      background: on ? (disabled ? '#86EFAC' : '#30D158') : 'rgba(120,120,128,0.22)',
      transition: 'background 0.25s ease', opacity: disabled ? 0.6 : 1,
    }}>
    <motion.div
      animate={{ x: on ? 22 : 2 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      style={{ position: 'absolute', top: 2.5, width: 22, height: 22, borderRadius: '50%',
        background: '#FFF', boxShadow: '0 1px 4px rgba(0,0,0,0.22)' }} />
  </motion.button>
);

/* ─── Panel header ───────────────────────────────────────── */
const PanelHeader: React.FC<{ title: string; sub?: string; onBack: () => void }> = ({ title, sub, onBack }) => (
  <div style={{ paddingTop: 56, padding: '56px 20px 18px', display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
    <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
      style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg)',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
      <ChevronLeft size={18} color="var(--t2)" />
    </motion.button>
    <div>
      <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>{title}</p>
      {sub && <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 1 }}>{sub}</p>}
    </div>
  </div>
);

/* ─── Settings row ───────────────────────────────────────── */
const SettingRow: React.FC<{
  icon: React.ReactNode; iconBg: string;
  label: string; sub?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}> = ({ icon, iconBg, label, sub, right, onPress, isLast }) => (
  <>
    <motion.button whileTap={onPress ? { scale: 0.985 } : {}} onClick={onPress}
      style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
        cursor: onPress ? 'pointer' : 'default', display: 'flex', alignItems: 'center',
        gap: 14, textAlign: 'left' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: sub ? 2 : 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--t3)' }}>{sub}</p>}
      </div>
      {right ?? (onPress ? <ChevronRight size={16} color="var(--t3)" /> : null)}
    </motion.button>
    {!isLast && <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />}
  </>
);

/* ══════════════════════════════════════════════════════════ */
/*  NOTIFICATIONS PANEL                                        */
/* ══════════════════════════════════════════════════════════ */
const NotificationsPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [master,    setMaster]    = useState(true);
  const [settings,  setSettings]  = useState({
    hrv:          true,
    sleep:        true,
    steps:        false,
    bookingConf:  true,
    apptReminder: true,
    followUp:     true,
    doctorMsg:    true,
    aiInsights:   false,
    support:      true,
    weeklyReport: true,
    monthlySumm:  false,
    marketing:    false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const groups: { label: string; items: { key: keyof typeof settings; label: string; sub: string }[] }[] = [
    {
      label: 'Health & Vitals',
      items: [
        { key: 'hrv',    label: 'HRV Alerts',        sub: 'Notify when HRV drops below your baseline' },
        { key: 'sleep',  label: 'Sleep Insights',     sub: 'Morning summary of last night\'s sleep' },
        { key: 'steps',  label: 'Steps Reminder',     sub: 'Nudge when you\'re behind on daily goal' },
      ],
    },
    {
      label: 'Appointments',
      items: [
        { key: 'bookingConf',  label: 'Booking Confirmations', sub: 'Instant notification when a booking is made' },
        { key: 'apptReminder', label: 'Appointment Reminders',  sub: '1 hour before your scheduled consultation' },
        { key: 'followUp',     label: 'Follow-up Reminders',    sub: 'Post-appointment summaries & actions' },
      ],
    },
    {
      label: 'Messages',
      items: [
        { key: 'doctorMsg',  label: 'Doctor Messages',  sub: 'When Dr. Mitchell replies to you' },
        { key: 'aiInsights', label: 'AI Insights',      sub: 'Proactive health suggestions from PRVNT AI' },
        { key: 'support',    label: 'Support Replies',  sub: 'Updates from the PRVNT support team' },
      ],
    },
    {
      label: 'Reports',
      items: [
        { key: 'weeklyReport', label: 'Weekly Health Report',  sub: 'Every Monday morning' },
        { key: 'monthlySumm',  label: 'Monthly Summary',       sub: 'Full breakdown on the 1st of each month' },
        { key: 'marketing',    label: 'Tips & Feature Updates', sub: 'New features, health tips & offers' },
      ],
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <PanelHeader title="Notifications" sub="Control what you're notified about" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* Master toggle */}
        <div style={{ margin: '18px 16px 6px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: master ? 'rgba(255,214,10,0.15)' : 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} color={master ? '#FFD60A' : 'var(--t3)'} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>All Notifications</p>
              <p style={{ fontSize: 12, color: 'var(--t3)' }}>{master ? 'Notifications are on' : 'All notifications muted'}</p>
            </div>
            <Toggle on={master} onChange={() => setMaster(v => !v)} />
          </div>
        </div>

        {/* Emergency notice */}
        <div style={{ margin: '8px 16px 16px', padding: '12px 14px', borderRadius: 14,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
          display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <AlertCircle size={14} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
            Emergency health alerts are always enabled and cannot be turned off for your safety.
          </p>
        </div>

        {/* Category toggles */}
        {groups.map(group => (
          <div key={group.label} style={{ margin: '0 16px 14px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{group.label}</p>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 18, overflow: 'hidden' }}>
              {group.items.map((item, i) => (
                <React.Fragment key={item.key}>
                  <div style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12,
                    opacity: master ? 1 : 0.45, transition: 'opacity 0.2s' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--t3)' }}>{item.sub}</p>
                    </div>
                    <Toggle on={settings[item.key] && master} onChange={() => toggle(item.key)} disabled={!master} />
                  </div>
                  {i < group.items.length - 1 && <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  PRIVACY PANEL                                             */
/* ══════════════════════════════════════════════════════════ */
const PrivacyPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [sharing, setSharing] = useState({ careTeam: true, research: false, analytics: true });
  const [security, setSecurity] = useState({ biometric: true });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <PanelHeader title="Privacy" sub="Data, security & permissions" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* Data sharing */}
        <div style={{ margin: '18px 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Data Sharing</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            {([
              { key: 'careTeam' as const, label: 'Share with Care Team',      sub: 'Doctors & coaches can view your health data',       color: '#0A84FF' },
              { key: 'research' as const, label: 'Anonymous Research',         sub: 'Contribute anonymised data to health research',     color: '#30D158' },
              { key: 'analytics' as const, label: 'App Analytics',             sub: 'Help improve PRVNT with usage insights',           color: '#BF5AF2' },
            ]).map((item, i, arr) => (
              <React.Fragment key={item.key}>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--t3)' }}>{item.sub}</p>
                  </div>
                  <Toggle on={sharing[item.key]} onChange={() => setSharing(p => ({ ...p, [item.key]: !p[item.key] }))} />
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Security</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(48,209,88,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fingerprint size={18} color="#30D158" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Biometric Lock</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Face ID / fingerprint to open the app</p>
              </div>
              <Toggle on={security.biometric} onChange={() => setSecurity(p => ({ ...p, biometric: !p.biometric }))} />
            </div>
            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(10,132,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="#0A84FF" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Auto-lock</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Lock after 5 minutes of inactivity</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)' }}>5 min</span>
              <ChevronRight size={15} color="var(--t3)" />
            </div>
          </div>
        </div>

        {/* Data rights */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Your Data Rights</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <motion.button whileTap={{ scale: 0.985 }} onClick={() => showToast('Preparing your data export…')}
              style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(10,132,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={17} color="#0A84FF" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Download My Data</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Export all your health records as a PDF</p>
              </div>
              <ChevronRight size={16} color="var(--t3)" />
            </motion.button>
            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />
            <motion.button whileTap={{ scale: 0.985 }} onClick={() => showToast('Contact support to request deletion')}
              style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={17} color="#EF4444" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', marginBottom: 2 }}>Delete My Account</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Permanently remove all data from PRVNT</p>
              </div>
              <ChevronRight size={16} color="var(--t3)" />
            </motion.button>
          </div>
        </div>

        {/* Links */}
        <div style={{ margin: '0 16px 14px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            {[
              { label: 'Privacy Policy',    sub: 'How we handle your data' },
              { label: 'Terms of Service',  sub: 'Usage terms & conditions' },
              { label: 'Cookie Policy',     sub: 'What we store locally', isLast: true },
            ].map((item, i, arr) => (
              <React.Fragment key={item.label}>
                <motion.button whileTap={{ scale: 0.985 }} onClick={() => showToast(`Opening ${item.label}…`)}
                  style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={17} color="var(--t2)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--t3)' }}>{item.sub}</p>
                  </div>
                  <ChevronRight size={16} color="var(--t3)" />
                </motion.button>
                {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: 'absolute', bottom: 40, left: 16, right: 16, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 14, padding: '13px 16px',
              display: 'flex', alignItems: 'center', gap: 10, zIndex: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <Check size={15} color="#30D158" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  FAQ PANEL                                                  */
/* ══════════════════════════════════════════════════════════ */
const FAQ_ITEMS: { q: string; a: string; cat: string }[] = [
  { cat: 'General', q: 'What is PRVNT?', a: 'PRVNT is a preventive health platform that connects you with your own doctor, AI health assistant, and coaching team — all in one place. We focus on keeping you healthy before problems arise.' },
  { cat: 'General', q: 'Who is my assigned doctor?', a: 'Based on your plan, you\'re assigned a PRVNT-affiliated preventive medicine doctor. You can view and message your doctor directly from the Messages tab.' },
  { cat: 'Health Data', q: 'How is my health data collected?', a: 'PRVNT collects data from connected wearables (Apple Watch, Oura Ring, etc.), manual entries, lab uploads, and appointment summaries. All data is end-to-end encrypted.' },
  { cat: 'Health Data', q: 'Can I export my health records?', a: 'Yes. Go to Profile → Privacy → Download My Data to request a full export of your health records in PDF format. Processing takes up to 24 hours.' },
  { cat: 'Health Data', q: 'Who can see my health data?', a: 'Only you and your assigned care team (doctor, coach) can see your data. You can control sharing permissions in Profile → Privacy → Data Sharing.' },
  { cat: 'Plans & Billing', q: 'What\'s included in PRVNT Access?', a: 'PRVNT Access includes AI health chat, basic vitals tracking, health records, wearable sync, and up to 2 scheduled appointments per billing period.' },
  { cat: 'Plans & Billing', q: 'What does Privilege add?', a: 'PRVNT Privilege includes unlimited appointments, priority doctor response (within 30 min), a dedicated health team, advanced AI insights, specialist referrals, and telehealth video calls.' },
  { cat: 'Plans & Billing', q: 'How do I cancel or change my plan?', a: 'You can manage your subscription from Profile → Subscription. Changes take effect at the end of your current billing cycle. Contact support for immediate cancellations.' },
  { cat: 'Technical', q: 'Why isn\'t my wearable syncing?', a: 'Make sure Bluetooth is enabled and your device is within range. Go to Profile → Connected Devices and tap "Scan for devices". If problems persist, try unpairing and re-pairing.' },
  { cat: 'Technical', q: 'The app feels slow or crashes — what should I do?', a: 'Try force-closing and reopening the app. Ensure you have the latest version installed. If the issue continues, tap Profile → Help & Support → Report a Bug and we\'ll investigate.' },
  { cat: 'Privacy', q: 'Is my data shared with third parties?', a: 'No. PRVNT never sells your personal health data. Anonymous, aggregated data may be used for research only with your explicit consent (toggled in Privacy settings).' },
  { cat: 'Privacy', q: 'How do I delete my account?', a: 'Go to Profile → Privacy → Delete My Account. Please note this action is irreversible and all health data will be permanently removed within 30 days per GDPR/HIPAA requirements.' },
];

const FAQPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const cats = Array.from(new Set(FAQ_ITEMS.map(f => f.cat)));
  const filtered = FAQ_ITEMS.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <PanelHeader title="FAQ" sub="Frequently asked questions" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* Search */}
        <div style={{ padding: '14px 16px 6px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
            display: 'flex', alignItems: 'center', paddingInline: 14, height: 44, gap: 10 }}>
            <HelpCircle size={16} color="var(--t3)" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search questions…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 14, color: 'var(--t1)', fontFamily: 'Inter' }} />
          </div>
        </div>

        {/* FAQ list */}
        {(search ? [{ cat: 'Results', items: filtered }] : cats.map(cat => ({ cat, items: FAQ_ITEMS.filter(f => f.cat === cat) }))).map(({ cat, items }) => (
          <div key={cat} style={{ margin: '14px 16px 0' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{cat}</p>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 18, overflow: 'hidden' }}>
              {items.map((item, i) => {
                const idx   = FAQ_ITEMS.indexOf(item);
                const isOpen = open === idx;
                return (
                  <div key={idx} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <motion.button whileTap={{ scale: 0.99 }}
                      onClick={() => setOpen(isOpen ? null : idx)}
                      style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                      <p style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.4 }}>
                        {item.q}
                      </p>
                      {isOpen ? <ChevronUp size={16} color="var(--t3)" /> : <ChevronDown size={16} color="var(--t3)" />}
                    </motion.button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div key="ans"
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}>
                          <p style={{ padding: '0 18px 16px', fontSize: 13, color: 'var(--t2)',
                            lineHeight: 1.65, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <HelpCircle size={40} color="var(--t3)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>No results found</p>
            <p style={{ fontSize: 13, color: 'var(--t2)' }}>Try a different search or contact support</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  HELP & SUPPORT PANEL                                       */
/* ══════════════════════════════════════════════════════════ */
const HelpPanel: React.FC<{ onBack: () => void; onFAQ: () => void }> = ({ onBack, onFAQ }) => {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <PanelHeader title="Help & Support" sub="We're here to help" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* Hero card */}
        <div style={{ margin: '18px 16px 18px', padding: '20px', borderRadius: 20,
          background: 'linear-gradient(135deg,rgba(10,132,255,0.12),rgba(191,90,242,0.08))',
          border: '1px solid rgba(10,132,255,0.18)' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>How can we help?</p>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 14 }}>
            Our support team is available Monday – Friday, 9 am – 6 pm. For urgent medical concerns, always contact emergency services.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => showToast('Opening chat support…')}
              style={{ flex: 1, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: '#0A84FF', color: '#FFF', fontSize: 13, fontWeight: 700, fontFamily: 'Inter',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <MessageCircle size={14} /> Chat Now
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => showToast('Composing email to help@prvnt.health')}
              style={{ flex: 1, height: 40, borderRadius: 12, cursor: 'pointer',
                background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--t1)', fontSize: 13, fontWeight: 700, fontFamily: 'Inter',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Mail size={14} /> Email Us
            </motion.button>
          </div>
        </div>

        {/* Contact options */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Contact</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <SettingRow icon={<MessageCircle size={17} color="#0A84FF" />} iconBg="rgba(10,132,255,0.1)"
              label="Live Chat" sub="Average response under 5 minutes"
              onPress={() => showToast('Opening live chat…')} />
            <SettingRow icon={<Mail size={17} color="#BF5AF2" />} iconBg="rgba(191,90,242,0.1)"
              label="Email Support" sub="help@prvnt.health"
              onPress={() => showToast('Composing email…')} />
            <SettingRow icon={<Phone size={17} color="#30D158" />} iconBg="rgba(48,209,88,0.1)"
              label="Schedule a Support Call" sub="Book a 15-min call with our team"
              onPress={() => showToast('Opening booking flow…')} isLast />
          </div>
        </div>

        {/* Resources */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Resources</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <SettingRow icon={<HelpCircle size={17} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)"
              label="FAQ" sub="Answers to common questions"
              onPress={onFAQ} />
            <SettingRow icon={<BookOpen size={17} color="#0A84FF" />} iconBg="rgba(10,132,255,0.1)"
              label="Help Centre" sub="Full guides and tutorials"
              onPress={() => showToast('Opening help centre…')} />
            <SettingRow icon={<Info size={17} color="#6366F1" />} iconBg="rgba(99,102,241,0.1)"
              label="What's New" sub="Latest features and updates"
              onPress={() => showToast('Opening release notes…')} isLast />
          </div>
        </div>

        {/* Report */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Feedback</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <SettingRow icon={<Star size={17} color="#FFD60A" />} iconBg="rgba(255,214,10,0.12)"
              label="Rate PRVNT" sub="Leave a review on the App Store"
              onPress={() => showToast('Opening App Store…')} />
            <SettingRow icon={<Bug size={17} color="#EF4444" />} iconBg="rgba(239,68,68,0.1)"
              label="Report a Bug" sub="Something not working? Let us know"
              onPress={() => showToast('Opening bug report form…')} isLast />
          </div>
        </div>

        {/* App info */}
        <div style={{ margin: '0 16px', padding: '14px 18px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 18, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 2 }}>PRVNT Health · Version 2.4.0</p>
          <p style={{ fontSize: 11, color: 'var(--t3)' }}>Build 2024.05.12 · help@prvnt.health</p>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: 'absolute', bottom: 40, left: 16, right: 16, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 14, padding: '13px 16px',
              display: 'flex', alignItems: 'center', gap: 10, zIndex: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <Check size={15} color="#30D158" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  WHAT'S NEW PANEL                                          */
/* ══════════════════════════════════════════════════════════ */
const WHATS_NEW: { version: string; date: string; items: { tag: string; tagColor: string; tagBg: string; text: string }[] }[] = [
  {
    version: '2.4.0',
    date: 'May 2026',
    items: [
      { tag: 'New',      tagColor: '#30D158', tagBg: 'rgba(48,209,88,0.12)',   text: 'Live weather widget on Home screen' },
      { tag: 'New',      tagColor: '#30D158', tagBg: 'rgba(48,209,88,0.12)',   text: 'Settings panel — app preferences & data management' },
      { tag: 'Improved', tagColor: '#0A84FF', tagBg: 'rgba(10,132,255,0.12)',  text: 'HRV trend chart now shows 30-day rolling average' },
      { tag: 'Improved', tagColor: '#0A84FF', tagBg: 'rgba(10,132,255,0.12)',  text: 'Faster wearable sync — reduced background battery usage' },
      { tag: 'Fix',      tagColor: '#FF9F0A', tagBg: 'rgba(255,159,10,0.12)', text: 'Fixed sleep score occasionally showing as 0' },
    ],
  },
  {
    version: '2.3.0',
    date: 'Apr 2026',
    items: [
      { tag: 'New',      tagColor: '#30D158', tagBg: 'rgba(48,209,88,0.12)',   text: 'Discover tab — browse & start personalised health habits' },
      { tag: 'New',      tagColor: '#30D158', tagBg: 'rgba(48,209,88,0.12)',   text: 'Lab result upload — scan or photograph blood work' },
      { tag: 'Improved', tagColor: '#0A84FF', tagBg: 'rgba(10,132,255,0.12)',  text: 'AI chat now references your latest vitals automatically' },
      { tag: 'Fix',      tagColor: '#FF9F0A', tagBg: 'rgba(255,159,10,0.12)', text: 'Notification badge count now clears on open' },
    ],
  },
];

const WhatsNewPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
    <PanelHeader title="What's New" sub="Latest features & bug fixes" onBack={onBack} />
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
      {WHATS_NEW.map(release => (
        <div key={release.version} style={{ margin: '18px 16px 0' }}>
          {/* Release header */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, paddingLeft: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>v{release.version}</span>
            <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>{release.date}</span>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', padding: '6px 0' }}>
            {release.items.map((item, i) => (
              <div key={i} style={{ padding: '10px 18px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.tagColor, background: item.tagBg,
                  padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 1, letterSpacing: '0.03em' }}>
                  {item.tag}
                </span>
                <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.5, fontWeight: 500 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)', margin: '24px 16px 0' }}>
        Full release notes at prvnt.health/changelog
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
/*  SETTINGS PANEL                                            */
/* ══════════════════════════════════════════════════════════ */
const LAUNCH_TABS = ['Home', 'Vitals', 'Reports', 'Discover', 'Profile'] as const;
const SYNC_OPTS   = ['Every 5 min', 'Every 15 min', 'Every 30 min', 'Manual only'] as const;

const SettingsPanel: React.FC<{ onBack: () => void; onWhatsNew: () => void }> = ({ onBack, onWhatsNew }) => {
  const [launchTab,     setLaunchTab]     = useState<typeof LAUNCH_TABS[number]>('Home');
  const [syncFreq,      setSyncFreq]      = useState<typeof SYNC_OPTS[number]>('Every 5 min');
  const [haptic,        setHaptic]        = useState(true);
  const [reduceMotion,  setReduceMotion]  = useState(false);
  const [bgRefresh,     setBgRefresh]     = useState(true);
  const [showLaunchPicker, setShowLaunchPicker] = useState(false);
  const [showSyncPicker,   setShowSyncPicker]   = useState(false);
  const [storageCleared,   setStorageCleared]   = useState(false);
  const [toast,            setToast]             = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const storageUsed = storageCleared ? '0.1 MB' : '24.3 MB';

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <PanelHeader title="Settings" sub="App preferences & data" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* ── App Preferences ── */}
        <div style={{ margin: '18px 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>App Preferences</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>

            {/* Default Launch Tab */}
            <motion.button whileTap={{ scale: 0.985 }} onClick={() => { setShowSyncPicker(false); setShowLaunchPicker(v => !v); }}
              style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Default Launch Tab</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Opens to this tab on launch</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginRight: 4 }}>{launchTab}</span>
              <motion.div animate={{ rotate: showLaunchPicker ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} color="var(--t3)" />
              </motion.div>
            </motion.button>

            {/* Launch tab inline picker */}
            <AnimatePresence initial={false}>
              {showLaunchPicker && (
                <motion.div key="launch-picker"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
                    {LAUNCH_TABS.map(tab => (
                      <motion.button key={tab} whileTap={{ scale: 0.985 }} onClick={() => { setLaunchTab(tab); setShowLaunchPicker(false); }}
                        style={{ width: '100%', padding: '11px 18px 11px 18px', background: 'none', border: 'none',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          textAlign: 'left' }}>
                        <span style={{ fontSize: 14, fontWeight: tab === launchTab ? 700 : 500,
                          color: tab === launchTab ? 'var(--accent)' : 'var(--t1)' }}>{tab}</span>
                        {tab === launchTab && <Check size={15} color="var(--accent)" />}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />

            {/* Haptic Feedback */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Haptic Feedback</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Vibration on interactions</p>
              </div>
              <Toggle on={haptic} onChange={() => setHaptic(v => !v)} />
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />

            {/* Reduce Motion */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Reduce Motion</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Minimise animations app-wide</p>
              </div>
              <Toggle on={reduceMotion} onChange={() => setReduceMotion(v => !v)} />
            </div>

          </div>
        </div>

        {/* ── Data Management ── */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Data Management</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>

            {/* Sync Frequency */}
            <motion.button whileTap={{ scale: 0.985 }} onClick={() => { setShowLaunchPicker(false); setShowSyncPicker(v => !v); }}
              style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Sync Frequency</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>How often wearables pull data</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginRight: 4 }}>{syncFreq}</span>
              <motion.div animate={{ rotate: showSyncPicker ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} color="var(--t3)" />
              </motion.div>
            </motion.button>

            {/* Sync picker */}
            <AnimatePresence initial={false}>
              {showSyncPicker && (
                <motion.div key="sync-picker"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
                    {SYNC_OPTS.map(opt => (
                      <motion.button key={opt} whileTap={{ scale: 0.985 }} onClick={() => { setSyncFreq(opt); setShowSyncPicker(false); }}
                        style={{ width: '100%', padding: '11px 18px', background: 'none', border: 'none',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          textAlign: 'left' }}>
                        <span style={{ fontSize: 14, fontWeight: opt === syncFreq ? 700 : 500,
                          color: opt === syncFreq ? 'var(--accent)' : 'var(--t1)' }}>{opt}</span>
                        {opt === syncFreq && <Check size={15} color="var(--accent)" />}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />

            {/* Background Refresh */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Background Refresh</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Sync data while app is closed</p>
              </div>
              <Toggle on={bgRefresh} onChange={() => setBgRefresh(v => !v)} />
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />

            {/* Export My Data */}
            <motion.button whileTap={{ scale: 0.985 }} onClick={() => showToast('Preparing your data export… check email in 24 h')}
              style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Export My Data</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Download all records as PDF</p>
              </div>
              <ChevronRight size={16} color="var(--t3)" />
            </motion.button>

            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />

            {/* Storage Used */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>Storage Used</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>{storageUsed} · cached data & media</p>
              </div>
              <motion.button whileTap={{ scale: 0.93 }}
                onClick={() => { setStorageCleared(true); showToast('Cache cleared — storage freed'); }}
                style={{ padding: '6px 12px', borderRadius: 9, border: '1px solid var(--border)',
                  background: 'var(--bg)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  color: storageCleared ? 'var(--t3)' : '#BF5AF2', fontFamily: 'Inter',
                  opacity: storageCleared ? 0.5 : 1 }}>
                {storageCleared ? 'Cleared' : 'Clear'}
              </motion.button>
            </div>

          </div>
        </div>

        {/* ── About ── */}
        <div style={{ margin: '0 16px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>About</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>

            {/* App Version — display only */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(255,214,10,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={17} color="#FFD60A" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>App Version</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Up to date</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>2.4.0</span>
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />

            {/* What's New */}
            <motion.button whileTap={{ scale: 0.985 }} onClick={onWhatsNew}
              style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(48,209,88,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={17} color="#30D158" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>What's New</p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Latest features & bug fixes</p>
              </div>
              {/* New badge */}
              <span style={{ fontSize: 10, fontWeight: 700, color: '#30D158',
                background: 'rgba(48,209,88,0.14)', padding: '3px 8px', borderRadius: 6, marginRight: 4 }}>
                v2.4.0
              </span>
              <ChevronRight size={16} color="var(--t3)" />
            </motion.button>

          </div>
        </div>

      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: 'absolute', bottom: 40, left: 16, right: 16, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 14, padding: '13px 16px',
              display: 'flex', alignItems: 'center', gap: 10, zIndex: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <Check size={15} color="#30D158" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  PROFILE SCREEN                                            */
/* ══════════════════════════════════════════════════════════ */
const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenSubScreen, onSignOut }) => {
  const { plan, isDark, toggleTheme } = useTheme();
  const isPremium = plan === 'privilege';
  const [panel,       setPanel]       = useState<Panel>(null);
  const [toast,       setToast]       = useState<string | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const card: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    overflow: 'hidden',
  };

  type RowItem = {
    icon: React.ReactNode; iconBg: string;
    label: string; sub?: string;
    action?: () => void;
    right?: React.ReactNode;
  };

  const settingsGroups: { title: string; rows: RowItem[] }[] = [
    {
      title: 'Health',
      rows: [
        { icon: <ClipboardList size={17} color="#0A84FF" />, iconBg: 'rgba(10,132,255,0.12)',
          label: 'Health Records', sub: 'Medical history & allergies',
          action: () => onOpenSubScreen('health-records') },
        { icon: <Bluetooth size={17} color="#32D2FF" />, iconBg: 'rgba(50,210,255,0.12)',
          label: 'Connected Devices', sub: '3 devices syncing',
          action: () => onOpenSubScreen('devices') },
        { icon: <Target size={17} color="#FF9F0A" />, iconBg: 'rgba(255,159,10,0.12)',
          label: 'Health Goals', sub: 'HRV, sleep, activity targets',
          action: () => showToast('Health Goals coming soon') },
      ],
    },
    {
      title: 'Account',
      rows: [
        { icon: <User size={17} color="#6366F1" />, iconBg: 'rgba(99,102,241,0.12)',
          label: 'Edit Profile', sub: 'Name, date of birth, photo',
          action: () => showToast('Edit Profile coming soon') },
        { icon: <CreditCard size={17} color="#30D158" />, iconBg: 'rgba(48,209,88,0.12)',
          label: 'Subscription', sub: `PRVNT ${isPremium ? 'Privilege' : 'Access'} · Manage plan`,
          action: () => showToast('Subscription management coming soon') },
      ],
    },
    {
      title: 'Preferences',
      rows: [
        { icon: <Bell size={17} color="#FFD60A" />, iconBg: 'rgba(255,214,10,0.12)',
          label: 'Notifications', sub: 'Reminders, alerts & reports',
          action: () => setPanel('notifications') },
        { icon: <Globe size={17} color="#0A84FF" />, iconBg: 'rgba(10,132,255,0.1)',
          label: 'Language & Region', sub: 'English (AU) · Metric',
          action: () => showToast('Language settings coming soon') },
        { icon: <Ruler size={17} color="#F59E0B" />, iconBg: 'rgba(245,158,11,0.1)',
          label: 'Units & Measurements', sub: 'kg · cm · °C',
          action: () => showToast('Units settings coming soon') },
      ],
    },
    {
      title: 'Privacy & Support',
      rows: [
        { icon: <Lock size={17} color="#30D158" />, iconBg: 'rgba(48,209,88,0.12)',
          label: 'Privacy', sub: 'Data, security & permissions',
          action: () => setPanel('privacy') },
        { icon: <HelpCircle size={17} color="#BF5AF2" />, iconBg: 'rgba(191,90,242,0.12)',
          label: 'Help & Support', sub: 'Chat, email & resources',
          action: () => setPanel('help') },
        { icon: <BookOpen size={17} color="#F59E0B" />, iconBg: 'rgba(245,158,11,0.1)',
          label: 'FAQ', sub: 'Frequently asked questions',
          action: () => setPanel('faq') },
      ],
    },
  ];

  const springT = { type: 'spring' as const, stiffness: 340, damping: 32 };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflow: 'hidden' }}>
      {/* ── Scrollable main content ── */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 100 }}>
        <div style={{ height: 48 }} />

        {/* Header */}
        <div style={{ padding: '12px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.015em', lineHeight: 1 }}>Profile</h1>
            <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>Account & preferences</p>
          </div>
          {/* Settings icon button */}
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setPanel('settings')}
            style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 13, cursor: 'pointer',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={16} color="var(--t2)" />
          </motion.button>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Avatar card */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 66, height: 66, borderRadius: 22, flexShrink: 0,
                  background: isPremium
                    ? 'linear-gradient(135deg, #0A84FF 0%, #BF5AF2 100%)'
                    : 'linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#FFF' }}>{user.name.charAt(0)}</span>
                </div>
                {/* Edit button */}
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => showToast('Edit Profile coming soon')}
                  style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 8,
                    background: 'var(--bg)', border: '1.5px solid var(--border)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit3 size={11} color="var(--t2)" />
                </motion.button>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{user.fullName}</p>
                <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>{user.email}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: isPremium ? 'rgba(10,132,255,0.12)' : 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px' }}>
                  {isPremium ? <Zap size={11} color="#0A84FF" /> : <Shield size={11} color="var(--t2)" />}
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                    color: isPremium ? '#0A84FF' : 'var(--t2)' }}>
                    PRVNT {isPremium ? 'Privilege' : 'Access'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'Days Active', val: user.daysActive,        color: '#0A84FF' },
                { label: 'Bio Age',     val: `${user.biologicalAge}`, color: '#30D158' },
                { label: 'Actual Age',  val: `${user.age}`,           color: 'var(--t2)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: 'var(--bg)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 4, lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.03em',
                    textTransform: 'uppercase', lineHeight: 1.3 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Member since */}
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12,
              background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={13} color="#EF4444" />
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Member since <strong style={{ color: 'var(--t1)' }}>January 2025</strong></p>
            </div>
          </div>

          {/* Dark mode toggle */}
          <div style={{ ...card, padding: '4px 0' }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: isDark ? 'rgba(255,214,10,0.12)' : 'rgba(10,132,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDark ? <Sun size={18} color="#FFD60A" /> : <Moon size={18} color="#0A84FF" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>Tap to switch appearance</p>
              </div>
              <Toggle on={isDark} onChange={toggleTheme} />
            </div>
          </div>

          {/* Settings groups */}
          {settingsGroups.map(group => (
            <div key={group.title}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                color: 'var(--t3)', marginBottom: 8, paddingLeft: 4 }}>{group.title}</p>
              <div style={{ ...card }}>
                {group.rows.map((row, i) => (
                  <React.Fragment key={row.label}>
                    <motion.button whileTap={{ scale: 0.985 }} onClick={row.action}
                      style={{ width: '100%', padding: '13px 18px', background: 'none', border: 'none',
                        cursor: row.action ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12,
                        background: row.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {row.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{row.label}</p>
                        {row.sub && <p style={{ fontSize: 12, color: 'var(--t3)' }}>{row.sub}</p>}
                      </div>
                      {row.right ?? (row.action ? <ChevronRight size={16} color="var(--t3)" /> : null)}
                    </motion.button>
                    {i < group.rows.length - 1 && (
                      <div style={{ height: 1, background: 'var(--border)', marginInline: 18 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}

          {/* Upgrade card */}
          {!isPremium && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(10,132,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} color="#0A84FF" />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Upgrade to Privilege</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 16 }}>
                Unlock unlimited appointments, GP telehealth, specialist referrals, priority AI insights and your dedicated care team.
              </p>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => showToast('Upgrade flow coming soon!')}
                style={{ width: '100%', height: 46, borderRadius: 13, border: 'none', cursor: 'pointer',
                  background: '#0A84FF', color: '#FFF', fontWeight: 700, fontSize: 15, fontFamily: 'Inter' }}>
                Upgrade · $299/mo
              </motion.button>
            </div>
          )}

          {/* Sign out */}
          <div style={{ ...card, padding: '4px 0' }}>
            <motion.button whileTap={{ scale: 0.985 }} onClick={() => setShowSignOut(true)}
              style={{ width: '100%', padding: '16px 18px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,55,95,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={18} color="#FF375F" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#FF375F' }}>Sign Out</span>
            </motion.button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)', paddingTop: 4, paddingBottom: 8 }}>
            PRVNT v2.4.0 · Privacy Policy · Terms of Service
          </p>
        </div>
      </div>

      {/* ── Panel overlays (slide in from right) ── */}
      <AnimatePresence>
        {panel && (
          <motion.div key={panel}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={springT}
            style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
            {panel === 'notifications' && <NotificationsPanel onBack={() => setPanel(null)} />}
            {panel === 'privacy'       && <PrivacyPanel       onBack={() => setPanel(null)} />}
            {panel === 'help'          && <HelpPanel          onBack={() => setPanel(null)} onFAQ={() => setPanel('faq')} />}
            {panel === 'faq'           && <FAQPanel           onBack={() => setPanel('help')} />}
            {panel === 'settings'      && <SettingsPanel      onBack={() => setPanel(null)} onWhatsNew={() => setPanel('whats-new')} />}
            {panel === 'whats-new'     && <WhatsNewPanel      onBack={() => setPanel('settings')} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sign out confirmation ── */}
      <AnimatePresence>
        {showSignOut && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 98 }}
              onClick={() => setShowSignOut(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ position: 'absolute', bottom: 24, left: 16, right: 16, zIndex: 99,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)' }}>Sign Out?</p>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowSignOut(false)}
                  style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg)',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} color="var(--t3)" />
                </motion.button>
              </div>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 20 }}>
                You'll be returned to the welcome screen. Your health data will remain synced.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSignOut(false)}
                  style={{ flex: 1, height: 46, borderRadius: 13, border: '1px solid var(--border)',
                    background: 'var(--bg)', color: 'var(--t1)', fontWeight: 600, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'Inter' }}>
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setShowSignOut(false); onSignOut(); }}
                  style={{ flex: 1, height: 46, borderRadius: 13, border: 'none',
                    background: '#FF375F', color: '#FFF', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'Inter', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6 }}>
                  <Check size={16} color="#FFF" /> Sign Out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'absolute', bottom: 110, left: 20, right: 20, zIndex: 200,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '14px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(48,209,88,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={15} color="#30D158" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', flex: 1 }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileScreen;
