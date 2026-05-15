import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Task   { label: string; done: boolean }
interface Domain { name: string; score: number; color: string; tasks: Task[] }

const initialDomains: Domain[] = [
  {
    name: 'Nutrition', score: 72, color: '#10B981',
    tasks: [
      { label: 'Track macros daily',        done: true  },
      { label: 'Reduce processed foods',    done: true  },
      { label: 'Add omega-3 supplement',    done: false },
    ],
  },
  {
    name: 'Movement', score: 65, color: '#6366F1',
    tasks: [
      { label: '30 min walk daily',         done: true  },
      { label: 'Strength training 3×/week', done: false },
      { label: 'Stretch 10 min',            done: false },
    ],
  },
  {
    name: 'Recovery', score: 81, color: '#F59E0B',
    tasks: [
      { label: 'Sleep 7–9 hrs',             done: true  },
      { label: 'Wind-down routine',         done: true  },
      { label: 'Limit screens 1hr pre-bed', done: true  },
    ],
  },
  {
    name: 'Mental Wellbeing', score: 78, color: '#EC4899',
    tasks: [
      { label: 'Daily breathwork 10 min',   done: false },
      { label: 'Journaling 3×/week',        done: true  },
      { label: 'Social connection',         done: false },
    ],
  },
  {
    name: 'Metabolic Health', score: 69, color: '#0EA5E9',
    tasks: [
      { label: 'Fasting glucose < 5.5',     done: true  },
      { label: 'HbA1c check this quarter',  done: false },
      { label: 'Limit alcohol 2× week',     done: true  },
    ],
  },
];

const BlueprintScreen: React.FC = () => {
  const { isDark, t } = useTheme();
  const [domains, setDomains]     = useState(initialDomains);
  const [expanded, setExpanded]   = useState<string | null>('Nutrition');

  const toggleTask = (domainName: string, taskIdx: number) => {
    setDomains(prev => prev.map(d =>
      d.name === domainName
        ? { ...d, tasks: d.tasks.map((tk, i) => i === taskIdx ? { ...tk, done: !tk.done } : tk) }
        : d
    ));
  };

  const totalScore = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length);
  const totalDone  = domains.flatMap(d => d.tasks).filter(tk => tk.done).length;
  const totalTasks = domains.flatMap(d => d.tasks).length;

  const bg      = t('#F2F1EC', '#080B12');
  const cardBg  = t('rgba(255,255,255,0.85)', 'rgba(255,255,255,0.055)');
  const border  = t('rgba(0,0,0,0.07)',        'rgba(255,255,255,0.08)');
  const divider = t('rgba(0,0,0,0.04)',        'rgba(255,255,255,0.05)');
  const barBg   = t('rgba(0,0,0,0.06)',        'rgba(255,255,255,0.08)');
  const textPri = t('#111827', '#F3F4F6');
  const textSec = t('#6B7280', '#9CA3AF');
  const textTer = t('#9CA3AF', '#6B7280');

  const cardStyle = {
    background: cardBg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${border}`,
    borderRadius: 20,
    overflow: 'hidden' as const,
  };

  return (
    <div className="page-scroll" style={{ paddingBottom: 100, background: bg }}>
      <div style={{ height: 52 }} />

      <div className="px-5 mb-4">
        <h1 className="text-2xl font-bold" style={{ color: textPri }}>Your Blueprint</h1>
        <p className="text-sm mt-0.5" style={{ color: textSec }}>Personalised health roadmap</p>
      </div>

      {/* Score hero */}
      <div className="px-5 mb-5">
        <div className="rounded-3xl p-5" style={{ background: t('linear-gradient(145deg, #1a1a2e 0%, #111827 100%)', 'linear-gradient(145deg, #0f172a 0%, #080B12 100%)'), border: `1px solid ${t('rgba(255,255,255,0.08)', 'rgba(255,255,255,0.1)')}` }}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white text-4xl font-bold">{totalScore}</span>
            <span className="text-gray-400 text-lg">/100</span>
            <span className="text-emerald-400 text-sm ml-1">↑ 4 pts this week</span>
          </div>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Blueprint Score</p>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${totalScore}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{totalDone}/{totalTasks} tasks complete</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{totalScore}% complete</span>
          </div>
        </div>
      </div>

      {/* Domain cards */}
      <div className="px-5 space-y-3">
        {domains.map((domain) => {
          const isOpen   = expanded === domain.name;
          const doneTasks = domain.tasks.filter(tk => tk.done).length;
          return (
            <div key={domain.name} style={cardStyle}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5"
                onClick={() => setExpanded(isOpen ? null : domain.name)}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${domain.color}18` }}>
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: domain.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold" style={{ color: textPri }}>{domain.name}</p>
                  <p className="text-xs" style={{ color: textSec }}>{doneTasks}/{domain.tasks.length} tasks done</p>
                </div>
                <div className="rounded-full px-2.5 py-1 mr-2" style={{ background: `${domain.color}18` }}>
                  <span className="text-xs font-bold" style={{ color: domain.color }}>{domain.score}</span>
                </div>
                {isOpen
                  ? <ChevronUp   size={16} color={textTer} />
                  : <ChevronDown size={16} color={textTer} />}
              </button>

              {/* Progress bar */}
              <div className="mx-4 mb-3 h-1.5 rounded-full overflow-hidden" style={{ background: barBg }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.score}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: domain.color }}
                />
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-4 pb-4 space-y-0">
                      {domain.tasks.map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 py-2.5 cursor-pointer"
                          style={{ borderTop: `1px solid ${divider}` }}
                          onClick={() => toggleTask(domain.name, i)}
                        >
                          {task.done
                            ? <CheckCircle2 size={20} color={domain.color} />
                            : <Circle      size={20} color={textTer} />}
                          <span className="text-sm" style={{
                            color: task.done ? textTer : textPri,
                            textDecoration: task.done ? 'line-through' : 'none',
                          }}>
                            {task.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlueprintScreen;
