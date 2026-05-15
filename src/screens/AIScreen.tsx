import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, ChevronLeft, Clock, MessageSquare, LifeBuoy, Star, Calendar } from 'lucide-react';
import { aiMessages, user } from '../data/mockData';
import BookingScreen, { type AppPlan } from './BookingScreen';

interface AIScreenProps { onClose: () => void; }

type ChatMode = 'hub' | 'ai' | 'doctor' | 'support' | 'booking';
type Message  = { id: number; role: 'user' | 'assistant'; content: string; time: string };

/* ─── Mock doctor messages ───────────────────────────────── */
const DOCTOR_MESSAGES: Message[] = [
  { id: 1, role: 'assistant', time: 'Yesterday 4:12 PM',
    content: "Hi Alex! I've reviewed your latest blood panel. Your Vitamin D came in at 32 ng/mL — slightly low. I'd suggest 2,000 IU daily taken with a fatty meal to improve absorption." },
  { id: 2, role: 'user',      time: 'Yesterday 4:38 PM',
    content: "Thanks Dr. Mitchell! Should I retest in 3 months?" },
  { id: 3, role: 'assistant', time: 'Yesterday 5:01 PM',
    content: "Yes, exactly. Retest at 12 weeks and we'll adjust from there. Your HRV trend is genuinely impressive by the way — the Zone 2 work is paying off 🎉" },
];

const SUPPORT_MESSAGES: Message[] = [
  { id: 1, role: 'assistant', time: '10:22 AM',
    content: "Hi there! I'm the PRVNT support team. How can I help you today?" },
];

const DOCTOR_SUGGESTED  = ['Review my blood panel', 'Question about my meds', 'Schedule a call', 'Clarify my results'];
const AI_SUGGESTED      = ['Why is my HRV low?', 'Optimize my sleep', "Today's training plan", 'Explain my lab results'];
const SUPPORT_SUGGESTED = ['Billing question', 'Technical issue', 'Data & privacy', 'Upgrade my plan'];

const AI_REPLY = "Based on your current biometrics, I'd recommend focusing on sleep quality and keeping today's training at a moderate Zone 2 intensity. Your HRV suggests your body is in recovery mode.";
const DOC_REPLY = "Good question — let me look into that for you. I'll get back to you by end of day with a proper answer based on your records.";
const SUP_REPLY = "Thanks for reaching out! I've flagged this to the right person and we'll get back to you within a few hours. Is there anything else I can help with right now?";

/* ─── Typing indicator ───────────────────────────────────── */
const TypingDots: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
    {[0, 1, 2].map(i => (
      <motion.div key={i} animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
        style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
    ))}
  </div>
);

/* ─── Avatar ─────────────────────────────────────────────── */
const Avatar: React.FC<{ mode: ChatMode; size?: number }> = ({ mode, size = 32 }) => {
  const r = size * 0.28;
  if (mode === 'ai') return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
      background: 'linear-gradient(135deg, #5B7FFF 0%, #A07BFF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Sparkles size={size * 0.44} color="#FFF" />
    </div>
  );
  if (mode === 'doctor') return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
      background: 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.38, fontWeight: 800, color: '#FFF' }}>SM</span>
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
      background: 'linear-gradient(135deg, #FF9F0A 0%, #FF375F 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LifeBuoy size={size * 0.44} color="#FFF" />
    </div>
  );
};

/* ─── Shared chat view ───────────────────────────────────── */
const ChatView: React.FC<{
  mode: 'ai' | 'doctor' | 'support';
  onBack: () => void;
  onClose: () => void;
}> = ({ mode, onBack, onClose }) => {
  const initMessages: Message[] =
    mode === 'ai'      ? (aiMessages as Message[]) :
    mode === 'doctor'  ? DOCTOR_MESSAGES :
    SUPPORT_MESSAGES;

  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const accentColor =
    mode === 'ai'      ? '#5B7FFF' :
    mode === 'doctor'  ? '#0A84FF' :
    '#FF9F0A';

  const bubbleColor =
    mode === 'ai'      ? '#5B7FFF' :
    mode === 'doctor'  ? '#0A84FF' :
    '#FF9F0A';

  const replyText =
    mode === 'ai'     ? AI_REPLY :
    mode === 'doctor' ? DOC_REPLY :
    SUP_REPLY;

  const suggested =
    mode === 'ai'     ? AI_SUGGESTED :
    mode === 'doctor' ? DOCTOR_SUGGESTED :
    SUPPORT_SUGGESTED;

  const name =
    mode === 'ai'     ? 'PRVNT AI' :
    mode === 'doctor' ? 'Dr. Sarah Mitchell' :
    'PRVNT Support';

  const statusText =
    mode === 'ai'     ? 'Always available' :
    mode === 'doctor' ? 'Replies within 2 hrs' :
    'Mon – Fri, 9 am – 6 pm';

  const statusColor =
    mode === 'ai'     ? '#30D158' :
    mode === 'doctor' ? '#F97316' :
    '#30D158';

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { id: Date.now(), role: 'user', content: text.trim(), time: now }]);
    setInput('');
    setTyping(true);
    const delay = mode === 'ai' ? 1600 : 2400;
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', content: replyText, time: now }]);
      setTyping(false);
    }, delay);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        paddingTop: 56, paddingBottom: 14, paddingInline: 16,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ChevronLeft size={18} color="var(--t2)" />
        </motion.button>

        <Avatar mode={mode} size={42} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
            <p style={{ fontSize: 11, color: 'var(--t2)' }}>{statusText}</p>
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <X size={16} color="var(--t2)" />
        </motion.button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Doctor unavailability notice */}
        {mode === 'doctor' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start',
            background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 14, padding: '10px 14px' }}>
            <Clock size={14} color="#F97316" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
              Dr. Mitchell is currently away. Your message will be delivered and she typically responds within 2 hours.
              For urgent matters, contact <span style={{ color: accentColor, fontWeight: 600 }}>support</span>.
            </p>
          </div>
        )}

        {/* Suggested chips */}
        {messages.length <= 3 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
            {suggested.map(s => (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => sendMessage(s)}
                style={{ height: 34, paddingInline: 14, borderRadius: 20,
                  border: `1px solid ${accentColor}30`, background: `${accentColor}0D`,
                  color: 'var(--t1)', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer' }}>
                {s}
              </motion.button>
            ))}
          </div>
        )}

        {messages.map(msg => {
          const isAgent = msg.role === 'assistant';
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: isAgent ? 'row' : 'row-reverse',
                gap: 10, alignItems: 'flex-end' }}>
              {isAgent && <Avatar mode={mode} size={32} />}
              <div style={{ maxWidth: '78%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: isAgent ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                  background: isAgent ? 'var(--surface)' : bubbleColor,
                  border: isAgent ? '1px solid var(--border)' : 'none',
                }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: isAgent ? 'var(--t1)' : '#FFF', margin: 0 }}>
                    {msg.content}
                  </p>
                </div>
                <p style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4, fontWeight: 500,
                  textAlign: isAgent ? 'left' : 'right', paddingInline: 4 }}>{msg.time}</p>
              </div>
              {!isAgent && (
                <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#FFF' }}>{user.name.charAt(0)}</span>
                </div>
              )}
            </motion.div>
          );
        })}

        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <Avatar mode={mode} size={32} />
              <TypingDots color={accentColor} />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '12px 16px 34px', background: 'var(--surface)',
        borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 20, display: 'flex', alignItems: 'center', paddingInline: 16, height: 48 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={
              mode === 'ai'     ? 'Ask about your health…' :
              mode === 'doctor' ? 'Message Dr. Mitchell…' :
              'How can we help?'
            }
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--t1)', fontFamily: 'Inter' }}
          />
        </div>
        <motion.button whileTap={{ scale: 0.88 }}
          onClick={() => sendMessage(input)} disabled={!input.trim() || typing}
          style={{ width: 48, height: 48, borderRadius: 16, border: 'none',
            cursor: input.trim() && !typing ? 'pointer' : 'default',
            background: input.trim() && !typing ? accentColor : 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.2s ease' }}>
          <Send size={18} color={input.trim() && !typing ? '#FFF' : 'var(--t3)'} />
        </motion.button>
      </div>
    </div>
  );
};

/* ─── Hub card ───────────────────────────────────────────── */
const HubCard: React.FC<{
  mode: 'ai' | 'doctor' | 'support';
  onClick: () => void;
}> = ({ mode, onClick }) => {
  const isAI      = mode === 'ai';
  const isDoctor  = mode === 'doctor';
  const isSupport = mode === 'support';

  const gradient =
    isAI      ? 'linear-gradient(135deg, #5B7FFF 0%, #A07BFF 100%)' :
    isDoctor  ? 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)' :
    'linear-gradient(135deg, #FF9F0A 0%, #FF375F 100%)';

  const accentBg =
    isAI      ? 'rgba(91,127,255,0.08)'  :
    isDoctor  ? 'rgba(10,132,255,0.08)'  :
    'rgba(255,159,10,0.08)';

  const accentBorder =
    isAI      ? 'rgba(91,127,255,0.18)'  :
    isDoctor  ? 'rgba(10,132,255,0.18)'  :
    'rgba(255,159,10,0.18)';

  const title =
    isAI      ? 'PRVNT AI' :
    isDoctor  ? 'Dr. Sarah Mitchell' :
    'Support';

  const subtitle =
    isAI      ? 'Instant health insights & guidance' :
    isDoctor  ? 'Your assigned preventive medicine doctor' :
    'Billing, technical help & account';

  const badge =
    isAI      ? { text: 'Online', color: '#30D158' } :
    isDoctor  ? { text: 'Away · ~2 hr', color: '#F97316' } :
    { text: 'Available', color: '#30D158' };

  const specialty =
    isDoctor ? 'Preventive Medicine & Longevity' : null;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
        background: accentBg, border: `1px solid ${accentBorder}`,
        borderRadius: 20, cursor: 'pointer', textAlign: 'left' }}
    >
      {/* Avatar with gradient */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isAI     && <Sparkles size={24} color="#FFF" />}
          {isDoctor && <span style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }}>SM</span>}
          {isSupport && <LifeBuoy size={24} color="#FFF" />}
        </div>
        {/* Online dot */}
        <div style={{ position: 'absolute', bottom: 2, right: 2,
          width: 11, height: 11, borderRadius: '50%',
          background: badge.color, border: '2px solid var(--bg)' }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
          {isDoctor && <Star size={11} fill="#FFD60A" color="#FFD60A" />}
        </div>
        {specialty && <p style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, marginBottom: 3 }}>{specialty}</p>}
        <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{subtitle}</p>
      </div>

      {/* Status badge + chevron */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, paddingInline: 8, paddingBlock: 3,
          borderRadius: 20, background: `${badge.color}18`, color: badge.color }}>
          {badge.text}
        </span>
        <span style={{ fontSize: 18, color: 'var(--t3)', lineHeight: 1 }}>›</span>
      </div>
    </motion.button>
  );
};

/* ─── Hub (landing) ──────────────────────────────────────── */
const Hub: React.FC<{ onSelect: (m: ChatMode) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
    {/* Header */}
    <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      paddingTop: 56, paddingBottom: 16, paddingInline: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>Messages</p>
        <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>AI, your doctor & support</p>
      </div>
      <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
        style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg)',
          border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer' }}>
        <X size={18} color="var(--t2)" />
      </motion.button>
    </div>

    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Section label */}
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em',
        textTransform: 'uppercase', paddingInline: 4, marginBottom: 2 }}>Choose who to talk to</p>

      <HubCard mode="ai"      onClick={() => onSelect('ai')}      />
      <HubCard mode="doctor"  onClick={() => onSelect('doctor')}  />
      <HubCard mode="support" onClick={() => onSelect('support')} />

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBlock: 4 }} />

      {/* Book appointment card */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => onSelect('booking')}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px',
          background: 'rgba(48,209,88,0.07)', border: '1px solid rgba(48,209,88,0.2)',
          borderRadius: 20, cursor: 'pointer', textAlign: 'left' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
          background: 'linear-gradient(135deg,#30D158,#0A84FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={24} color="#FFF" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>Book Appointment</p>
          <p style={{ fontSize: 12, color: 'var(--t2)' }}>Schedule a consultation or coaching session</p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, paddingInline: 8, paddingBlock: 3,
            borderRadius: 20, background: 'rgba(48,209,88,0.15)', color: '#30D158' }}>
            Book now
          </span>
          <span style={{ fontSize: 18, color: 'var(--t3)', lineHeight: 1 }}>›</span>
        </div>
      </motion.button>

      {/* Info note */}
      <div style={{ marginTop: 8, padding: '14px 16px', borderRadius: 16,
        background: 'rgba(10,132,255,0.05)', border: '1px solid rgba(10,132,255,0.12)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <MessageSquare size={14} color="#0A84FF" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700, color: 'var(--t1)' }}>PRVNT AI</span> gives instant, always-on responses.
            Your <span style={{ fontWeight: 700, color: 'var(--t1)' }}>doctor</span> reviews your records and provides
            personalised medical guidance. <span style={{ fontWeight: 700, color: 'var(--t1)' }}>Support</span> handles
            account, billing and technical issues.
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Root ───────────────────────────────────────────────── */
const AIScreen: React.FC<AIScreenProps> = ({ onClose }) => {
  const [mode, setMode] = useState<ChatMode>('hub');
  // Mock plan — swap to 'privilege' to test unlimited flow
  const plan: AppPlan = 'access';
  const T = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <AnimatePresence mode="wait">
        {mode === 'hub' ? (
          <motion.div key="hub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={T}
            style={{ position: 'absolute', inset: 0 }}>
            <Hub onSelect={setMode} onClose={onClose} />
          </motion.div>
        ) : mode === 'booking' ? (
          <motion.div key="booking" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={T}
            style={{ position: 'absolute', inset: 0 }}>
            <BookingScreen plan={plan} onBack={() => setMode('hub')} onClose={onClose} />
          </motion.div>
        ) : (
          <motion.div key={mode} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={T}
            style={{ position: 'absolute', inset: 0 }}>
            <ChatView mode={mode as 'ai' | 'doctor' | 'support'}
              onBack={() => setMode('hub')} onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIScreen;
