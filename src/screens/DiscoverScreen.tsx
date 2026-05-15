import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, ChevronDown, BookmarkCheck,
  Play, Wind, Brain, Dumbbell, Apple, Moon, Leaf,
  Clock, Star, TrendingUp, CheckCircle2, X, Flame, Plus,
} from 'lucide-react';
import type { ActiveHabit } from '../types/habits';

/* ─── Types ─────────────────────────────────────────────── */
interface HabitCard   { id: string; icon: string; title: string; subtitle: string; color: string; bg: string; progress: number; streak: number }
interface ArticleCard { id: string; tag: string; tagColor: string; title: string; readTime: string; emoji: string; gradient: string; body: string }
interface WellnessModule { id: string; emoji: string; icon: React.ReactNode; title: string; desc: string; color: string; bg: string }
interface Session     { emoji: string; title: string; duration: string; desc: string }
interface SheetData   { emoji: string; color: string; title: string; tag?: string; body?: string; sessions?: Session[]; steps?: { emoji?: string; text: string }[] }

/* ─── Data ──────────────────────────────────────────────── */
const habits: HabitCard[] = [
  { id: 'water',    icon: '💧', title: 'Drink More Water',   subtitle: '8 glasses daily',          color: '#0A84FF', bg: 'rgba(10,132,255,0.12)',  progress: 62, streak: 7  },
  { id: 'sleep',    icon: '🌙', title: 'Sleep by 10:30 PM',  subtitle: 'Improve deep sleep',        color: '#BF5AF2', bg: 'rgba(191,90,242,0.12)',  progress: 78, streak: 14 },
  { id: 'greens',   icon: '🥦', title: 'Eat More Greens',    subtitle: '5 servings of vegetables',  color: '#30D158', bg: 'rgba(48,209,88,0.12)',   progress: 45, streak: 3  },
  { id: 'stress',   icon: '🧘', title: 'Daily Mindfulness',  subtitle: '10 min daily mindfulness',  color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)',  progress: 55, streak: 5  },
  { id: 'smoke',    icon: '🚭', title: 'Quit Smoking',       subtitle: 'Track smoke-free days',     color: '#FF375F', bg: 'rgba(255,55,95,0.12)',   progress: 88, streak: 21 },
  { id: 'sugar',    icon: '🍬', title: 'Reduce Sugar',       subtitle: 'Under 25g added sugar',    color: '#FF6B35', bg: 'rgba(255,107,53,0.12)',  progress: 38, streak: 2  },
  { id: 'morning',  icon: '☀️', title: 'Morning Routine',    subtitle: '7 AM wake-up consistency',  color: '#FFD60A', bg: 'rgba(255,214,10,0.12)',  progress: 70, streak: 10 },
  { id: 'recovery', icon: '🔄', title: 'Active Recovery',    subtitle: 'Foam roll + stretch',       color: '#32D2FF', bg: 'rgba(50,210,255,0.12)',  progress: 50, streak: 4  },
];

const articles: ArticleCard[] = [
  { id: 'a1', tag: 'SLEEP',      tagColor: '#BF5AF2', emoji: '🌙', gradient: 'linear-gradient(135deg,#1a0a2e,#2d1054)', readTime: '4 min',
    title: 'Why Deep Sleep Is Your Body\'s Repair Mode',
    body: 'Deep sleep (slow-wave sleep) is when growth hormone is released and the glymphatic system clears neurotoxins—including amyloid-beta linked to Alzheimer\'s. Missing it impairs immune function and raises appetite hormones. To protect it: keep your room at 65–68°F, avoid alcohol within 3 hours of bed, and finish intense exercise before early evening.' },
  { id: 'a2', tag: 'NUTRITION',  tagColor: '#30D158', emoji: '🧬', gradient: 'linear-gradient(135deg,#0a1a12,#0d3320)', readTime: '6 min',
    title: 'The Gut-Brain Axis: Food That Fuels Focus',
    body: '95% of your serotonin is produced in the gut, not the brain. The vagus nerve carries signals bidirectionally between your microbiome and brain, shaping mood, focus, and stress resilience. A diet rich in diverse fibre and fermented foods strengthens this connection. Ultra-processed foods disrupt it within 24–48 hours.' },
  { id: 'a3', tag: 'HRV',        tagColor: '#32D2FF', emoji: '❤️', gradient: 'linear-gradient(135deg,#001a2c,#003050)', readTime: '5 min',
    title: 'HRV Explained: Reading Your Recovery Signal',
    body: 'HRV measures variation between heartbeats—high variation means your autonomic nervous system is healthy. Zone 2 exercise, quality sleep, and reduced alcohol are the three most evidence-backed ways to raise your baseline. Measure first thing in the morning before standing for the most accurate reading.' },
  { id: 'a4', tag: 'METABOLISM', tagColor: '#FF9F0A', emoji: '⚡', gradient: 'linear-gradient(135deg,#1a1000,#2e1e00)', readTime: '7 min',
    title: 'Metabolic Flexibility: Burning Fat Like an Athlete',
    body: 'Metabolic flexibility is the ability to switch efficiently between burning glucose and fat. Build it with Zone 2 cardio 3–4× per week, 12–16 hour time-restricted eating, and strength training to grow muscle mass. The payoff: stable energy, clearer thinking, and improved body composition—without relying on constant carb intake.' },
  { id: 'a5', tag: 'STRESS',     tagColor: '#FF375F', emoji: '🧠', gradient: 'linear-gradient(135deg,#1a000a,#2e0015)', readTime: '5 min',
    title: 'Cortisol Overload: Signs Your Body Is Overwhelmed',
    body: 'Cortisol should peak 30–45 min after waking then decline through the day. Chronic stress flattens this rhythm, keeping cortisol elevated at night—wrecking sleep and accelerating cellular ageing. Warning signs: afternoon crashes, belly fat, difficulty falling asleep. Fastest resets: morning sunlight, cold exposure, and box breathing.' },
];

const wellnessModules: WellnessModule[] = [
  { id: 'breath',   emoji: '💨', icon: <Wind size={22} />,     title: 'Breathing',  desc: '4-7-8 & Box breathing',    color: '#32D2FF', bg: 'rgba(50,210,255,0.12)'  },
  { id: 'meditate', emoji: '🧘', icon: <Brain size={22} />,    title: 'Meditation', desc: 'Guided focus sessions',     color: '#BF5AF2', bg: 'rgba(191,90,242,0.12)'  },
  { id: 'fitness',  emoji: '🏋️', icon: <Dumbbell size={22} />, title: 'Fitness',    desc: 'HIIT, strength & mobility', color: '#FF375F', bg: 'rgba(255,55,95,0.12)'   },
  { id: 'food',     emoji: '🥗', icon: <Apple size={22} />,    title: 'Nutrition',  desc: 'Meal plans & macros',       color: '#30D158', bg: 'rgba(48,209,88,0.12)'   },
  { id: 'sleep2',   emoji: '🌙', icon: <Moon size={22} />,     title: 'Sleep',      desc: 'Wind-down protocols',       color: '#0A84FF', bg: 'rgba(10,132,255,0.12)'  },
  { id: 'nature',   emoji: '🌿', icon: <Leaf size={22} />,     title: 'Lifestyle',  desc: 'Longevity & daily habits',  color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)'  },
];

const MODULE_SESSIONS: Record<string, Session[]> = {
  breath:   [
    { emoji: '📦', title: 'Box Breathing',   duration: '5 min',  desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Lowers acute stress fast.' },
    { emoji: '😴', title: '4-7-8 Sleep Prep',duration: '3 min',  desc: 'Inhale 4s → Hold 7s → Exhale 8s. Activates the parasympathetic system.' },
    { emoji: '💨', title: 'Wim Hof Power',   duration: '10 min', desc: '30 deep breaths → hold on empty → repeat 3 rounds. Boosts energy & focus.' },
  ],
  meditate: [
    { emoji: '🧘', title: 'Body Scan',        duration: '10 min', desc: 'Progressively relax each muscle group from feet to crown.' },
    { emoji: '🎯', title: 'Focus Anchor',     duration: '15 min', desc: 'Single-point attention training. Builds prefrontal control over distraction.' },
    { emoji: '❤️', title: 'Loving Kindness',  duration: '12 min', desc: 'Cultivate compassion toward yourself and others. Reduces social anxiety.' },
    { emoji: '😌', title: 'NSDR Protocol',    duration: '20 min', desc: 'Non-sleep deep rest. Restores dopamine and motor learning. Stanford-backed.' },
  ],
  fitness:  [
    { emoji: '⚡', title: 'HIIT Sprint',      duration: '20 min', desc: '8 rounds of 20s all-out effort + 40s recovery. VO2 max booster.' },
    { emoji: '🚶', title: 'Zone 2 Walk',      duration: '45 min', desc: 'Conversational pace. Builds mitochondrial density and fat oxidation.' },
    { emoji: '🤸', title: 'Mobility Flow',    duration: '30 min', desc: 'Hip openers, thoracic rotation, hamstring lengthening. Full-body range.' },
    { emoji: '💪', title: 'Strength Circuit', duration: '40 min', desc: 'Compound lifts: squat, hinge, push, pull. Preserves and builds muscle.' },
  ],
  food:     [
    { emoji: '🥗', title: 'Anti-Inflammatory Plate', duration: 'Meal guide', desc: 'Fatty fish, leafy greens, olive oil, walnuts, berries. Reduces CRP.' },
    { emoji: '⏰', title: 'Protein Timing',           duration: 'Daily',      desc: '40g+ within 2 hours of waking and post-workout for muscle synthesis.' },
    { emoji: '🍽️', title: 'Meal Prep Sunday',        duration: '90 min',     desc: 'Batch cook proteins and veg for the week. Eliminates decision fatigue.' },
    { emoji: '🕐', title: '14-Hour Fast',             duration: 'Daily',      desc: 'Finish by 8 PM, eat at 10 AM. Improves insulin sensitivity.' },
  ],
  sleep2:   [
    { emoji: '🌅', title: 'Morning Sunlight',   duration: '10 min AM',      desc: 'Outdoor light within 30 min of waking. Sets your circadian anchor.' },
    { emoji: '🌡️', title: 'Temperature Protocol',duration: 'Evening',       desc: 'Set room to 65–68°F. Warm shower triggers core temp drop for onset.' },
    { emoji: '📵', title: 'Blue Light Cutoff',  duration: '90 min before',  desc: 'Screens suppress melatonin. Use amber glasses or Night Shift mode.' },
    { emoji: '🌙', title: 'Wind-Down Ritual',   duration: '30 min',         desc: 'Dim lights → light stretching → reading. Signals the brain to power down.' },
  ],
  nature:   [
    { emoji: '☀️', title: 'Sunlight Anchor',    duration: '10 min AM', desc: 'Outdoor light sets circadian rhythm and boosts morning cortisol appropriately.' },
    { emoji: '🚿', title: 'Cold Shower',        duration: '2–3 min',   desc: 'Raises norepinephrine ~300%. Improves mood, alertness, and cold resilience.' },
    { emoji: '📓', title: 'Gratitude Journal',  duration: '5 min PM',  desc: '3 specific things you\'re grateful for. Lowers baseline cortisol over time.' },
    { emoji: '📵', title: 'Digital Detox Block',duration: '1 hr/day',  desc: 'Phone-free window. Rebuilds attention span and reduces ambient anxiety.' },
  ],
};

const STRESS_ITEMS = [
  { icon: '🧘', title: 'Body Scan',      desc: '10 min guided',    color: '#BF5AF2', bg: 'rgba(191,90,242,0.1)',
    steps: ['Lie or sit comfortably and close your eyes', 'Take 3 slow deep breaths to settle in', 'Bring attention to your feet — tense for 5s, release', 'Move upward: calves → thighs → abdomen → chest → arms → face', 'Rest in stillness for 2 minutes after the full scan'] },
  { icon: '📓', title: 'Journaling',     desc: 'Cognitive reframe', color: '#FFD60A', bg: 'rgba(255,214,10,0.1)',
    steps: ['Write 3 specific things you\'re grateful for today', 'Describe 1 challenge you\'re currently facing', 'Write a realistic, kinder reframe of that challenge', 'End with 1 action you can take tomorrow', 'Takes 5 minutes. Reduces cortisol measurably over 2+ weeks'] },
  { icon: '🌿', title: 'Nature Therapy', desc: '20 min outdoors',   color: '#30D158', bg: 'rgba(48,209,88,0.1)',
    steps: ['Step outside and leave your phone indoors or silent', 'Walk at an easy, unrushed pace for at least 20 minutes', 'Name 5 things you can see, 4 sounds, 3 textures you can touch', 'Awe exposure (trees, sky, water) reduces inflammatory markers', 'Even 20 min in green space lowers cortisol significantly'] },
  { icon: '🎵', title: 'Sound Bath',     desc: 'Theta brainwaves',  color: '#32D2FF', bg: 'rgba(50,210,255,0.1)',
    steps: ['Find a quiet space and lie down comfortably', 'Play theta-wave binaural beats (4–8 Hz) at low volume', 'Close your eyes and breathe at your natural rhythm', 'Let sounds and sensations pass without attachment', '20 minutes shifts brainwaves into a deeply restorative state'] },
];

const RECOVERY_STEPS = [
  { emoji: '💡', text: 'Stop blue-light 90 min before bed — use amber glasses or Night Shift mode' },
  { emoji: '🕯️', text: 'Dim all household lighting to warm/amber tones in the evening' },
  { emoji: '🌡️', text: 'Set room to 65–68°F — core temperature must drop for deep sleep onset' },
  { emoji: '🚿', text: 'Take a warm shower — the post-shower temp drop signals sleep readiness' },
  { emoji: '🍽️', text: 'No food or alcohol within 3 hours of your target bedtime' },
  { emoji: '🧘', text: 'Do a 10-min body scan or 4-7-8 breathing exercise to wind down' },
  { emoji: '⏰', text: 'Lights out at your consistent target time — regularity is everything' },
];

const scienceCards = [
  { id: 's1', emoji: '🔬', tag: 'BIOLOGY',  tagColor: '#32D2FF',
    title: 'How HRV Predicts Illness 2–3 Days Early',
    preview: 'Your autonomic nervous system broadcasts distress signals before symptoms appear.',
    content: 'Heart Rate Variability (HRV) reflects the balance between your sympathetic and parasympathetic nervous systems. When your body is fighting a pathogen or under stress, the sympathetic system dominates—reducing HRV. Studies show HRV drops measurably 24–72 hours before visible illness symptoms, making it a powerful early-warning biomarker. Tracking daily baselines lets PRVNT flag anomalies before you feel them.' },
  { id: 's2', emoji: '🧬', tag: 'GENETICS', tagColor: '#BF5AF2',
    title: 'VO2 Max and Longevity: The #1 Predictor',
    preview: 'Cardiorespiratory fitness is the strongest independent predictor of all-cause mortality.',
    content: 'A 2018 JAMA study found low cardiorespiratory fitness carries a higher mortality risk than smoking, diabetes, or hypertension. Every 1-MET increase in VO2 max is associated with a 13% reduction in all-cause mortality. The good news: VO2 max is highly trainable — consistent Zone 2 work improves it significantly in 8–12 weeks.' },
  { id: 's3', emoji: '🌙', tag: 'SLEEP',    tagColor: '#0A84FF',
    title: 'The Glymphatic System: Sleep Cleans Your Brain',
    preview: 'During deep sleep, cerebrospinal fluid flushes toxic metabolic waste from the brain.',
    content: 'Discovered in 2013, the glymphatic system is the brain\'s waste-clearance network — active almost exclusively during deep, slow-wave sleep. It flushes amyloid-beta, tau proteins, and other metabolic byproducts linked to Alzheimer\'s and cognitive decline. Just one night of poor sleep increases amyloid burden measurably. Deep sleep isn\'t optional — it\'s neurological maintenance.' },
];

const foodCards = [
  { emoji: '🫐', name: 'Blueberries', benefit: 'Antioxidants + cognitive function',  score: 98, color: '#BF5AF2' },
  { emoji: '🥑', name: 'Avocado',     benefit: 'Healthy fats + heart health',         score: 95, color: '#30D158' },
  { emoji: '🐟', name: 'Wild Salmon', benefit: 'Omega-3s + inflammation reduction',   score: 97, color: '#FF375F' },
  { emoji: '🥦', name: 'Broccoli',    benefit: 'Sulforaphane + detox support',        score: 94, color: '#30D158' },
  { emoji: '🫘', name: 'Black Beans', benefit: 'Fiber + blood sugar stability',       score: 91, color: '#FF9F0A' },
  { emoji: '🥜', name: 'Almonds',     benefit: 'Vitamin E + brain protection',        score: 90, color: '#FFD60A' },
];

/* ─── DragScroll ─────────────────────────────────────────── */
const DRAG_THRESHOLD = 5;
const DragScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref       = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);
  const didDrag   = useRef(false);
  const startX    = useRef(0);
  const startLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current  = true;
    didDrag.current   = false;
    startX.current    = e.clientX;
    startLeft.current = ref.current?.scrollLeft ?? 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging.current || !ref.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      didDrag.current = true;
      ref.current.scrollLeft = startLeft.current - dx;
    }
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (didDrag.current) { e.stopPropagation(); didDrag.current = false; }
  }, []);

  return (
    <div ref={ref} onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onClickCapture={onClickCapture}
      className="hide-scrollbar"
      style={{ overflowX: 'scroll', WebkitOverflowScrolling: 'touch' as any,
        marginLeft: -20, marginRight: -20, cursor: 'grab', userSelect: 'none' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
        paddingLeft: 20, paddingRight: 20, paddingBottom: 8, width: 'max-content' }}>
        {children}
      </div>
    </div>
  );
};

/* ─── Bottom Sheet ───────────────────────────────────────── */
const BottomSheet: React.FC<{ data: SheetData; onClose: () => void }> = ({ data, onClose }) => (
  <AnimatePresence>
    <motion.div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'var(--bg)', borderRadius: '24px 24px 0 0',
          maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-md)' }} />
        </div>
        {/* Header */}
        <div style={{ padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: `${data.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {data.emoji}
          </div>
          <div style={{ flex: 1 }}>
            {data.tag && <p style={{ fontSize: 10, fontWeight: 800, color: data.color, letterSpacing: '0.07em', marginBottom: 3 }}>{data.tag}</p>}
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.3 }}>{data.title}</p>
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--surface)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={15} color="var(--t2)" />
          </motion.button>
        </div>
        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '20px 20px 48px', WebkitOverflowScrolling: 'touch' as any }}>
          {data.body && (
            <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.8 }}>{data.body}</p>
          )}
          {data.sessions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.sessions.map((s, i) => (
                <motion.div key={i} whileTap={{ scale: 0.97 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${data.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {s.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{s.title}</p>
                      <span style={{ fontSize: 10, color: data.color, fontWeight: 700,
                        background: `${data.color}15`, padding: '2px 7px', borderRadius: 6 }}>{s.duration}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{s.desc}</p>
                  </div>
                  <Play size={14} color={data.color} />
                </motion.div>
              ))}
            </div>
          )}
          {data.steps && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {data.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${data.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontSize: s.emoji ? 16 : 13, fontWeight: 700, color: data.color }}>
                    {s.emoji ?? i + 1}
                  </div>
                  <p style={{ flex: 1, fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, paddingTop: 7 }}>{s.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─── Confirm Popup ──────────────────────────────────────── */
const ConfirmPopup: React.FC<{
  habit: HabitCard;
  isTracking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ habit, isTracking, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ position: 'absolute', inset: 0, zIndex: 130,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
    {/* Backdrop */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCancel}
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} />
    {/* Card */}
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      exit={{    opacity: 0, scale: 0.88, y: 20 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{ position: 'relative', width: '100%', maxWidth: 310,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 28, padding: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
      {/* Habit info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: habit.bg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
          {habit.icon}
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{habit.title}</p>
          <p style={{ fontSize: 12, color: 'var(--t2)' }}>{habit.subtitle}</p>
        </div>
      </div>
      {/* Message */}
      <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 22 }}>
        {isTracking
          ? 'Remove this habit from your Home screen daily tracking?'
          : 'Add this habit to your Home screen to track it every day?'}
      </p>
      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button whileTap={{ scale: 0.96 }} onClick={onCancel}
          style={{ flex: 1, height: 48, borderRadius: 14, border: '1.5px solid var(--border)',
            background: 'transparent', fontSize: 14, fontWeight: 700, color: 'var(--t2)',
            cursor: 'pointer', fontFamily: 'Inter' }}>
          Cancel
        </motion.button>
        <motion.button whileTap={{ scale: 0.96 }} onClick={onConfirm}
          style={{ flex: 1, height: 48, borderRadius: 14, border: 'none', cursor: 'pointer',
            background: isTracking ? 'rgba(255,55,95,0.12)' : habit.color,
            color: isTracking ? '#FF375F' : '#fff',
            fontSize: 14, fontWeight: 700, fontFamily: 'Inter' }}>
          {isTracking ? 'Remove' : 'Add to Home'}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── All Habits Overlay ─────────────────────────────────── */
const AllHabitsOverlay: React.FC<{
  activeHabitIds: Set<string>;
  onCardTap: (h: HabitCard, isTracking: boolean) => void;
  onClose: () => void;
}> = ({ activeHabitIds, onCardTap, onClose }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
    {/* Header */}
    <div style={{ paddingTop: 56, paddingBottom: 14, paddingInline: 20,
      display: 'flex', alignItems: 'center', gap: 14,
      borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
        style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg)',
          border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <ChevronLeft size={18} color="var(--t2)" />
      </motion.button>
      <div>
        <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>All Habits</p>
        <p style={{ fontSize: 12, color: 'var(--t2)' }}>{habits.length} habits · tap to track</p>
      </div>
    </div>
    {/* Grid */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px', WebkitOverflowScrolling: 'touch' as any }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {habits.map(h => {
          const tracking = activeHabitIds.has(h.id);
          return (
            <motion.button key={h.id} whileTap={{ scale: 0.96 }}
              onClick={() => onCardTap(h, tracking)}
              style={{ padding: '16px 14px', borderRadius: 20, textAlign: 'left', cursor: 'pointer',
                background: 'var(--surface)',
                border: `2px solid ${tracking ? h.color : 'var(--border)'}`,
                display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: h.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{h.icon}</div>
                {tracking
                  ? <CheckCircle2 size={16} color={h.color} />
                  : <div style={{ width: 24, height: 24, borderRadius: 8, background: `${h.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={13} color={h.color} />
                    </div>}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{h.title}</p>
                <p style={{ fontSize: 11, color: 'var(--t2)' }}>{h.subtitle}</p>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${h.progress}%`, borderRadius: 2, background: h.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {tracking
                  ? <><Flame size={10} color="#FF9F0A" /><span style={{ fontSize: 11, fontWeight: 700, color: h.color }}>{h.streak}d streak</span></>
                  : <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)' }}>Tap to track</span>}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  </motion.div>
);

/* ─── Habit Carousel ─────────────────────────────────────── */
const HabitCarousel: React.FC<{
  activeHabitIds: Set<string>;
  onCardTap: (h: HabitCard, isTracking: boolean) => void;
}> = ({ activeHabitIds, onCardTap }) => (
  <DragScroll>
    {habits.map(h => {
      const tracking = activeHabitIds.has(h.id);
      return (
        <motion.div key={h.id} whileTap={{ scale: 0.97 }}
          onClick={() => onCardTap(h, tracking)}
          style={{ width: 152, height: 188, padding: '16px 14px 14px', borderRadius: 20,
            background: 'var(--surface)',
            border: `2px solid ${tracking ? h.color : 'var(--border)'}`,
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', flexDirection: 'column' }}>
          {/* Icon row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: h.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{h.icon}</div>
            {tracking
              ? <div style={{ background: `${h.color}20`, borderRadius: 8, padding: '3px 6px' }}>
                  <CheckCircle2 size={14} color={h.color} />
                </div>
              : <div style={{ width: 26, height: 26, borderRadius: 8, background: `${h.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={13} color={h.color} />
                </div>}
          </div>
          {/* Text */}
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3, marginBottom: 4 }}>{h.title}</p>
          <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.35, flex: 1 }}>{h.subtitle}</p>
          {/* Progress */}
          <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', marginTop: 8, marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${h.progress}%`, borderRadius: 2, background: h.color }} />
          </div>
          {/* Status row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {tracking
              ? <><Flame size={11} color="#FF9F0A" /><span style={{ fontSize: 11, fontWeight: 700, color: h.color }}>{h.streak}d streak</span></>
              : <span style={{ fontSize: 11, fontWeight: 600, color: h.color }}>Tap to track</span>}
          </div>
        </motion.div>
      );
    })}
  </DragScroll>
);

/* ─── Article Carousel ───────────────────────────────────── */
const ArticleCarousel: React.FC<{ onOpenSheet: (d: SheetData) => void }> = ({ onOpenSheet }) => (
  <DragScroll>
    {articles.map(a => (
      <motion.div key={a.id} whileTap={{ scale: 0.97 }}
        onClick={() => onOpenSheet({ emoji: a.emoji, color: a.tagColor, title: a.title, tag: a.tag, body: a.body })}
        style={{ width: 220, height: 170, borderRadius: 20, background: a.gradient,
          border: '1px solid rgba(255,255,255,0.07)', padding: 18,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          cursor: 'pointer', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, bottom: -10, fontSize: 72, opacity: 0.15, pointerEvents: 'none' }}>{a.emoji}</div>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 6, background: `${a.tagColor}25`, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: a.tagColor, letterSpacing: '0.06em' }}>{a.tag}</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.35, paddingRight: 20 }}>{a.title}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={11} color="rgba(255,255,255,0.5)" />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{a.readTime}</span>
          <div style={{ flex: 1 }} />
          <div style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={11} color="#fff" fill="#fff" />
          </div>
        </div>
      </motion.div>
    ))}
  </DragScroll>
);

/* ─── Wellness Grid ──────────────────────────────────────── */
const WellnessGrid: React.FC<{ onOpenSheet: (d: SheetData) => void }> = ({ onOpenSheet }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
    {wellnessModules.map(m => (
      <motion.button key={m.id} whileTap={{ scale: 0.93 }}
        onClick={() => onOpenSheet({ emoji: m.emoji, color: m.color, title: m.title, sessions: MODULE_SESSIONS[m.id] })}
        style={{ padding: '14px 10px', borderRadius: 18, background: 'var(--surface)',
          border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: m.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>{m.icon}</div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>{m.title}</p>
        <p style={{ fontSize: 10, color: 'var(--t2)', margin: 0, textAlign: 'center', lineHeight: 1.3 }}>{m.desc}</p>
      </motion.button>
    ))}
  </div>
);

/* ─── Science Card ───────────────────────────────────────── */
const ScienceCard: React.FC<{ card: typeof scienceCards[0] }> = ({ card }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: `${card.tagColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{card.emoji}</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: card.tagColor, letterSpacing: '0.06em' }}>{card.tag}</span>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.35, marginBottom: 4, marginTop: 4 }}>{card.title}</p>
          <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{card.preview}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 2, flexShrink: 0 }}>
          <ChevronDown size={16} color="var(--t3)" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, marginTop: 14 }}>{card.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Food Grid ──────────────────────────────────────────── */
const FoodGrid: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {foodCards.map((f, i) => (
      <motion.div key={f.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
          borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: `${f.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.emoji}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{f.name}</p>
          <p style={{ fontSize: 12, color: 'var(--t2)' }}>{f.benefit}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${f.color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: f.color }}>{f.score}</span>
          </div>
          <span style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.04em' }}>SCORE</span>
        </div>
      </motion.div>
    ))}
  </div>
);

/* ─── Breathing Card ─────────────────────────────────────── */
const BreathingCard: React.FC = () => {
  const [phase, setPhase] = useState<'idle'|'inhale'|'hold'|'exhale'|'hold2'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null);
  const techniques = [
    { name: 'Box Breathing', steps: ['Inhale 4s','Hold 4s','Exhale 4s','Hold 4s'], color: '#0A84FF' },
    { name: '4-7-8 Calm',    steps: ['Inhale 4s','Hold 7s','Exhale 8s'],           color: '#BF5AF2' },
    { name: 'Wim Hof Power', steps: ['Inhale 2s','Brief hold','Exhale 2s'],        color: '#32D2FF' },
  ];
  const [active, setActive] = useState(0);
  const technique = techniques[active];
  const stop = () => { setPhase('idle'); if (timerRef.current) clearTimeout(timerRef.current); };
  const circleScale = phase === 'inhale' ? 1.35 : phase === 'exhale' ? 0.85 : 1.1;
  const phaseLabel  = phase === 'idle' ? 'Tap to begin' : phase === 'inhale' ? 'Breathe In...' : phase === 'hold' || phase === 'hold2' ? 'Hold...' : 'Breathe Out...';
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }} className="hide-scrollbar">
        {techniques.map((t, i) => (
          <button key={t.name} onClick={() => { setActive(i); stop(); }}
            style={{ padding: '6px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: active === i ? `${t.color}22` : 'var(--bg)',
              color: active === i ? t.color : 'var(--t2)', fontSize: 12, fontWeight: 700 }}>{t.name}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 120, height: 120 }} onClick={phase === 'idle' ? () => setPhase('inhale') : stop}>
          <motion.div animate={{ scale: circleScale, opacity: phase !== 'idle' ? 1 : 0.5 }}
            transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 4 : 0.3, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `${technique.color}18`, border: `2px solid ${technique.color}40` }} />
          <motion.div animate={{ scale: circleScale * 0.65 }}
            transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 4 : 0.3, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: '20%', borderRadius: '50%', background: `${technique.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Wind size={22} color={technique.color} />
          </motion.div>
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', textAlign: 'center' }}>{phaseLabel}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {technique.steps.map((s, i) => (
            <div key={i} style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg)', fontSize: 11, color: 'var(--t2)', fontWeight: 600 }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Daily Challenge ────────────────────────────────────── */
const DailyChallenge: React.FC = () => {
  const [done, setDone] = useState(false);

  return (
    <div style={{
      borderRadius: 24, overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(150deg, #01112B 0%, #021E4A 55%, #011428 100%)',
      border: '1px solid rgba(10,132,255,0.22)',
    }}>

      {/* ── Background glow orbs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Large soft blue orb — top right */}
        <div style={{ position: 'absolute', top: -40, right: -30, width: 180, height: 180,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,132,255,0.22) 0%, transparent 70%)',
          filter: 'blur(2px)' }} />
        {/* Smaller accent orb — bottom left */}
        <div style={{ position: 'absolute', bottom: -20, left: 20, width: 110, height: 110,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,132,255,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* ── Illustration area ── */}
      <div style={{ position: 'relative', height: 118, overflow: 'hidden' }}>
        <svg width="100%" height="118" viewBox="0 0 360 118"
          preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
          <defs>
            <radialGradient id="dc2-sun" cx="50%" cy="90%" r="55%">
              <stop offset="0%"   stopColor="#0A84FF" stopOpacity="0.28" />
              <stop offset="60%"  stopColor="#0A84FF" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dc2-horizon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#082550" stopOpacity="0" />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.14" />
            </linearGradient>
          </defs>

          {/* Horizon glow */}
          <rect width="360" height="118" fill="url(#dc2-sun)" />
          <rect width="360" height="118" fill="url(#dc2-horizon)" />

          {/* Subtle grid lines — depth effect */}
          {[40, 80, 130, 200, 290].map((x, i) => (
            <line key={`vl${i}`} x1={x} y1="60" x2={180} y2="118"
              stroke="rgba(10,132,255,0.07)" strokeWidth="1" />
          ))}
          {[40, 80, 130, 200, 290].map((x, i) => (
            <line key={`vr${i}`} x1={360 - x} y1="60" x2={180} y2="118"
              stroke="rgba(10,132,255,0.07)" strokeWidth="1" />
          ))}
          {[72, 84, 96, 108].map((y, i) => (
            <line key={`h${i}`} x1="0" y1={y} x2="360" y2={y}
              stroke="rgba(10,132,255,0.05)" strokeWidth="1" />
          ))}

          {/* Horizon line */}
          <line x1="0" y1="68" x2="360" y2="68"
            stroke="rgba(10,132,255,0.3)" strokeWidth="1" />

          {/* Sun disk on horizon */}
          <circle cx="180" cy="68" r="22"
            fill="rgba(10,132,255,0.0)"
            stroke="rgba(10,132,255,0.35)" strokeWidth="1.5" />
          <circle cx="180" cy="68" r="14"
            fill="rgba(10,132,255,0.12)"
            stroke="rgba(10,132,255,0.5)" strokeWidth="1" />
          <circle cx="180" cy="68" r="6" fill="rgba(255,255,255,0.55)" />

          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 180 + Math.cos(rad) * 18;
            const y1 = 68  + Math.sin(rad) * 18;
            const x2 = 180 + Math.cos(rad) * 28;
            const y2 = 68  + Math.sin(rad) * 28;
            return <line key={`ray${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(10,132,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />;
          })}

          {/* Distant city silhouette */}
          {([[60,58,12,10],[80,54,10,14],[98,60,8,8],[118,52,14,16],[140,56,10,12],
            [200,55,12,13],[220,50,16,18],[244,57,10,11],[262,53,12,15],[280,59,8,9]] as [number,number,number,number][]).map(([x,y,w,h],i) => (
            <rect key={`b${i}`} x={x} y={y} width={w} height={h}
              fill={`rgba(10,132,255,${0.10 + (i % 3) * 0.03})`} rx="1" />
          ))}

          {/* Reflection band below horizon */}
          <rect x="0" y="68" width="360" height="50" fill="rgba(10,132,255,0.04)" />

          {/* Walker silhouette — crisp white */}
          <circle cx="180" cy="84"  r="4"   fill="rgba(255,255,255,0.80)" />
          <line x1="180" y1="88"  x2="180" y2="100" stroke="rgba(255,255,255,0.70)" strokeWidth="2"   strokeLinecap="round" />
          <line x1="180" y1="92"  x2="175" y2="98"  stroke="rgba(255,255,255,0.60)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="180" y1="92"  x2="185" y2="98"  stroke="rgba(255,255,255,0.60)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="180" y1="100" x2="176" y2="110" stroke="rgba(255,255,255,0.60)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="180" y1="100" x2="184" y2="110" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" />

          {/* Tiny floating particles */}
          {([[60,22,0.35],[110,14,0.25],[240,18,0.3],[300,10,0.22],[40,40,0.2],[320,30,0.28]] as [number,number,number][]).map(([x,y,o],i) => (
            <circle key={`pt${i}`} cx={x} cy={y} r="1.5" fill="white" opacity={o} />
          ))}
        </svg>

        {/* DAILY CHALLENGE badge */}
        <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
          <motion.div animate={{ opacity: [1, 0.25, 1] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#0A84FF', boxShadow: '0 0 6px rgba(10,132,255,0.8)', flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#60ADFF', letterSpacing: '0.10em' }}>DAILY CHALLENGE</span>
        </div>

        {/* Day streak + time chip */}
        <div style={{ position: 'absolute', top: 12, right: 14,
          background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(10px)',
          borderRadius: 10, padding: '4px 10px',
          border: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flame size={11} color="#FF9F0A" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>Day 3</span>
          <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.18)' }} />
          <Clock size={10} color="rgba(255,255,255,0.45)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>14h left</span>
        </div>

        {/* Fade into card body */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
          background: 'linear-gradient(to bottom, transparent, #021E4A)', pointerEvents: 'none' }} />
      </div>

      {/* ── Text + CTA ── */}
      <div style={{ padding: '4px 16px 18px', position: 'relative' }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 5 }}>
          10-min Mindful Walk Without Phone
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.48)', lineHeight: 1.55, marginBottom: 16 }}>
          Leave your phone behind. Notice 5 things you see, 4 you hear, 3 you can touch.
        </p>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setDone(d => !d)}
          style={{
            width: '100%', height: 44, borderRadius: 13, cursor: 'pointer',
            fontFamily: 'Inter', fontSize: 13, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            ...(done
              ? { background: 'rgba(10,132,255,0.12)', color: '#60ADFF',
                  border: '1px solid rgba(10,132,255,0.28)', boxShadow: 'none' }
              : { background: '#0A84FF', color: '#fff', border: 'none',
                  boxShadow: '0 4px 20px rgba(10,132,255,0.38)' }),
          } as React.CSSProperties}>
          {done
            ? <><CheckCircle2 size={15} strokeWidth={2.5} /> Challenge Completed!</>
            : <><Star size={14} strokeWidth={2.5} /> Start Challenge</>}
        </motion.button>
      </div>
    </div>
  );
};

/* ─── Main Screen ────────────────────────────────────────── */
interface DiscoverScreenProps {
  activeHabitIds?: Set<string>;
  onStartHabit?:   (habit: ActiveHabit) => void;
  onRemoveHabit?:  (id: string) => void;
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  activeHabitIds = new Set(),
  onStartHabit   = () => {},
  onRemoveHabit  = () => {},
}) => {
  const [showAllHabits, setShowAllHabits] = useState(false);
  const [activeSheet,   setActiveSheet]   = useState<SheetData | null>(null);
  const [confirmHabit,  setConfirmHabit]  = useState<{ habit: HabitCard; isTracking: boolean } | null>(null);

  const handleCardTap = (h: HabitCard, isTracking: boolean) => {
    setConfirmHabit({ habit: h, isTracking });
  };

  const handleConfirm = () => {
    if (!confirmHabit) return;
    if (confirmHabit.isTracking) {
      onRemoveHabit(confirmHabit.habit.id);
    } else {
      const h = confirmHabit.habit;
      onStartHabit({ id: h.id, icon: h.icon, title: h.title, color: h.color, bg: h.bg, streak: h.streak, doneToday: false });
    }
    setConfirmHabit(null);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>

      {/* Scrollable content */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 108 }}>
        <div style={{ height: 48 }} />

        {/* Header */}
        <div style={{ padding: '12px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>Discover</h1>
            <p style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 500 }}>Habits, programs & challenges</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <TrendingUp size={14} color="var(--accent)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>Week 3</span>
          </div>
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Daily Challenge */}
          <DailyChallenge />

          {/* Healthy Habits */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Healthy Habits</p>
                <p style={{ fontSize: 12, color: 'var(--t2)' }}>Tap a card to start tracking</p>
              </div>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowAllHabits(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>See all</span>
                <ChevronRight size={14} color="var(--accent)" />
              </motion.button>
            </div>
            <HabitCarousel activeHabitIds={activeHabitIds} onCardTap={handleCardTap} />
          </section>

          {/* Health Reads */}
          <section>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Health Reads</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Tap any card to read the full article</p>
            </div>
            <ArticleCarousel onOpenSheet={setActiveSheet} />
          </section>

          {/* Wellness Toolkit */}
          <section>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Wellness Toolkit</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Tap a category to explore sessions</p>
            </div>
            <WellnessGrid onOpenSheet={setActiveSheet} />
          </section>

          {/* Breathing */}
          <section>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Breathing Techniques</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Activate your parasympathetic system</p>
            </div>
            <BreathingCard />
          </section>

          {/* Science Spotlight */}
          <section>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Science Spotlight</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Deep-dive biology & research</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scienceCards.map(c => <ScienceCard key={c.id} card={c} />)}
            </div>
          </section>

          {/* Power Foods */}
          <section>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Power Foods</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Ranked by bioavailability & impact</p>
            </div>
            <FoodGrid />
          </section>

          {/* Recovery Protocol */}
          <section>
            <motion.div whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSheet({ emoji: '🔄', color: '#32D2FF', title: '7-Step Sleep Optimization Routine', tag: 'RECOVERY PROTOCOL', steps: RECOVERY_STEPS })}
              style={{ borderRadius: 24, background: 'linear-gradient(135deg,#001a2c,#003050)',
                border: '1px solid rgba(50,210,255,0.15)', padding: 20,
                display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(50,210,255,0.1)', filter: 'blur(20px)' }} />
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(50,210,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🔄</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#32D2FF', letterSpacing: '0.07em', marginBottom: 5 }}>RECOVERY PROTOCOL</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: 4 }}>Tonight: 7-Step Sleep Optimization Routine</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Start 90 min before your target bedtime</p>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
            </motion.div>
          </section>

          {/* Stress Management */}
          <section style={{ paddingBottom: 8 }}>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>Stress Management</p>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>Tap any technique for a step-by-step guide</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {STRESS_ITEMS.map(item => (
                <motion.button key={item.title} whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveSheet({
                    emoji: item.icon, color: item.color, title: item.title,
                    steps: item.steps.map(s => ({ text: s })),
                  })}
                  style={{ padding: 16, borderRadius: 18, background: 'var(--surface)',
                    border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', gap: 8, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: item.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--t2)' }}>{item.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* All Habits Overlay */}
      <AnimatePresence>
        {showAllHabits && (
          <AllHabitsOverlay
            activeHabitIds={activeHabitIds}
            onCardTap={handleCardTap}
            onClose={() => setShowAllHabits(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {activeSheet && <BottomSheet data={activeSheet} onClose={() => setActiveSheet(null)} />}
      </AnimatePresence>

      {/* Confirm Add / Remove popup */}
      <AnimatePresence>
        {confirmHabit && (
          <ConfirmPopup
            habit={confirmHabit.habit}
            isTracking={confirmHabit.isTracking}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmHabit(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default DiscoverScreen;
