import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Image, Table2, CheckCircle2, Loader2, X, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

interface UploadResultsScreenProps {
  onBack: () => void;
  onUploadComplete?: (fileName: string) => void;
}

type FileType = 'pdf' | 'image' | 'csv';
type UploadStage = 'idle' | 'selected' | 'uploading' | 'analyzing' | 'done';

interface MockResult {
  marker: string;
  value: string;
  unit: string;
  status: 'optimal' | 'borderline' | 'attention';
  range: string;
}

const mockResults: MockResult[] = [
  { marker: 'Vitamin D',       value: '38',    unit: 'ng/mL',  status: 'optimal',    range: '30-80 ng/mL' },
  { marker: 'Total Cholesterol',value: '198',  unit: 'mg/dL',  status: 'optimal',    range: '<200 mg/dL'  },
  { marker: 'Fasting Glucose', value: '94',    unit: 'mg/dL',  status: 'optimal',    range: '70-99 mg/dL' },
  { marker: 'Ferritin',        value: '18',    unit: 'ng/mL',  status: 'borderline', range: '20-250 ng/mL' },
  { marker: 'TSH',             value: '3.8',   unit: 'uIU/mL', status: 'borderline', range: '0.4-4.0'      },
  { marker: 'LDL Cholesterol', value: '142',   unit: 'mg/dL',  status: 'attention',  range: '<100 mg/dL'  },
];

const statusConfig = {
  optimal:    { color: '#30D158', bg: 'rgba(48,209,88,0.12)',    label: 'Optimal'    },
  borderline: { color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)',   label: 'Borderline' },
  attention:  { color: '#FF375F', bg: 'rgba(255,55,95,0.12)',    label: 'Attention'  },
};

const fileTypeOptions: { id: FileType; icon: React.ReactNode; label: string; desc: string }[] = [
  { id: 'pdf',   icon: <FileText size={22} />, label: 'PDF Report',  desc: 'Lab printouts, doctor reports' },
  { id: 'image', icon: <Image    size={22} />, label: 'Photo / Scan', desc: 'JPG, PNG of lab results'      },
  { id: 'csv',   icon: <Table2   size={22} />, label: 'CSV / Data',   desc: 'Exported spreadsheet data'    },
];

const UploadResultsScreen: React.FC<UploadResultsScreenProps> = ({ onBack, onUploadComplete }) => {
  const [selectedType, setSelectedType] = useState<FileType>('pdf');
  const [stage, setStage] = useState<UploadStage>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (name: string) => {
    setFileName(name);
    setStage('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setStage('analyzing');
          setTimeout(() => setStage('done'), 2200);
          return 100;
        }
        return p + Math.random() * 18 + 5;
      });
    }, 120);
  };

  const handleFileSelect = () => {
    // Simulate file selection
    const fakeNames: Record<FileType, string> = {
      pdf:   'LabResults_May2026.pdf',
      image: 'BloodPanel_Scan.jpg',
      csv:   'HealthData_Export.csv',
    };
    simulateUpload(fakeNames[selectedType]);
  };

  const reset = () => {
    setStage('idle');
    setProgress(0);
    setFileName('');
  };

  const optimalCount = mockResults.filter(r => r.status === 'optimal').length;
  const attentionCount = mockResults.filter(r => r.status === 'attention').length;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflowY: 'auto', paddingBottom: 40 }}>
      <div style={{ height: 48 }} />

      {/* Header */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            width: 40, height: 40, borderRadius: 13,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="var(--t1)" />
        </motion.button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Upload Lab Results</h1>
          <p style={{ fontSize: 13, color: 'var(--t2)' }}>AI-powered biomarker analysis</p>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <AnimatePresence mode="wait">

          {/* ── IDLE / SELECTED stage ─────────────────── */}
          {(stage === 'idle' || stage === 'selected') && (
            <motion.div
              key="upload-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* File type selector */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 14 }}>Select file type</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {fileTypeOptions.map(opt => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(opt.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 16,
                        background: selectedType === opt.id ? 'rgba(10,132,255,0.08)' : 'var(--bg)',
                        border: `1.5px solid ${selectedType === opt.id ? 'rgba(10,132,255,0.3)' : 'var(--border)'}`,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 13,
                        background: selectedType === opt.id ? 'rgba(10,132,255,0.14)' : 'var(--surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: selectedType === opt.id ? '#0A84FF' : 'var(--t3)',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                      }}>
                        {opt.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{opt.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--t2)' }}>{opt.desc}</p>
                      </div>
                      {selectedType === opt.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                          <CheckCircle2 size={20} color="#0A84FF" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <motion.div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(); }}
                animate={{ scale: dragOver ? 1.01 : 1 }}
                style={{
                  padding: '36px 24px',
                  borderRadius: 24,
                  border: `2px dashed ${dragOver ? '#0A84FF' : 'rgba(10,132,255,0.3)'}`,
                  background: dragOver ? 'rgba(10,132,255,0.06)' : 'rgba(10,132,255,0.03)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={handleFileSelect}
              >
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(10,132,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={28} color="#0A84FF" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0A84FF', marginBottom: 5 }}>
                    {dragOver ? 'Drop it here!' : 'Tap or drag to upload'}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--t2)' }}>
                    {selectedType === 'pdf' ? 'PDF up to 20 MB' : selectedType === 'image' ? 'JPG or PNG up to 10 MB' : 'CSV up to 5 MB'}
                  </p>
                </div>
              </motion.div>

              {/* AI feature callout */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: 16, borderRadius: 18,
                background: 'var(--surface)', border: '1px solid var(--border)',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(191,90,242,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={18} color="#BF5AF2" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>AI Analysis Included</p>
                  <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
                    PRVNT reads your biomarkers, flags outliers, explains what each result means, and connects findings to your wearable data.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── UPLOADING stage ──────────────────────── */}
          {stage === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 40 }}
            >
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                {/* Progress ring */}
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="6" />
                  <motion.circle
                    cx="50" cy="50" r="44"
                    fill="none" stroke="#0A84FF" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.15s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>{Math.min(Math.round(progress), 100)}%</span>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Uploading...</p>
                <p style={{ fontSize: 13, color: 'var(--t2)' }}>{fileName}</p>
              </div>

              <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, color: 'var(--t2)', fontWeight: 600 }}>
                <X size={14} />
                Cancel
              </button>
            </motion.div>
          )}

          {/* ── ANALYZING stage ─────────────────────── */}
          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 40 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(191,90,242,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Sparkles size={28} color="#BF5AF2" />
              </motion.div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>AI Analyzing Results</p>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
                  Reading biomarkers, cross-referencing ranges,<br />and preparing personalized insights...
                </p>
              </div>

              {/* Animated dots */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#BF5AF2' }}
                  />
                ))}
              </div>

              {/* Mini status list */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Parsing document structure...', 'Extracting biomarker values...', 'Cross-referencing lab ranges...', 'Generating health insights...'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.45 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear', delay: i * 0.3 }}>
                      <Loader2 size={14} color="#BF5AF2" />
                    </motion.div>
                    <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── DONE stage ──────────────────────────── */}
          {stage === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Success banner */}
              <div style={{
                borderRadius: 24,
                background: 'linear-gradient(135deg, #0a2e1a 0%, #0d3320 100%)',
                border: '1px solid rgba(48,209,88,0.2)',
                padding: 20,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(48,209,88,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <CheckCircle2 size={26} color="#30D158" />
                </motion.div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Analysis Complete!</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
                    {fileName} · {mockResults.length} markers found
                  </p>
                </div>
              </div>

              {/* Summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Optimal',    value: optimalCount,                               color: '#30D158', bg: 'rgba(48,209,88,0.1)'  },
                  { label: 'Borderline', value: mockResults.filter(r => r.status === 'borderline').length, color: '#FF9F0A', bg: 'rgba(255,159,10,0.1)' },
                  { label: 'Attention',  value: attentionCount,                             color: '#FF375F', bg: 'rgba(255,55,95,0.1)'  },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 10px', borderRadius: 18, background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</span>
                    <span style={{ fontSize: 11, color: s.color, fontWeight: 700, opacity: 0.8 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Attention flag */}
              {attentionCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: 16, borderRadius: 18,
                    background: 'rgba(255,55,95,0.06)', border: '1px solid rgba(255,55,95,0.2)',
                  }}
                >
                  <AlertCircle size={18} color="#FF375F" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#FF375F', marginBottom: 3 }}>{attentionCount} marker{attentionCount > 1 ? 's' : ''} need attention</p>
                    <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
                      LDL Cholesterol is above the optimal range. Consider discussing with your doctor and reviewing your diet.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Marker results */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>Biomarker Results</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {mockResults.map((r, i) => {
                    const cfg = statusConfig[r.status];
                    return (
                      <motion.div
                        key={r.marker}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '14px 20px',
                          borderBottom: i < mockResults.length - 1 ? '1px solid var(--border)' : 'none',
                        }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>{r.marker}</p>
                          <p style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>Range: {r.range}</p>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginRight: 10 }}>
                          {r.value} <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>{r.unit}</span>
                        </p>
                        <div style={{ padding: '3px 9px', borderRadius: 8, background: cfg.bg }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* AI Insights */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(191,90,242,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color="#BF5AF2" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>AI Health Insights</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { emoji: '✅', text: 'Your metabolic markers (glucose, cholesterol total) are within healthy ranges — great lifestyle foundation.' },
                    { emoji: '⚠️', text: 'Ferritin is slightly low. Consider iron-rich foods (spinach, lentils, red meat) or discuss supplementation.' },
                    { emoji: '🔴', text: 'LDL cholesterol at 142 mg/dL exceeds optimal. Prioritize omega-3 intake, reduce saturated fats, and increase cardio activity.' },
                    { emoji: '💡', text: 'Your Vitamin D at 38 ng/mL is in the optimal zone — maintain sun exposure or your current supplement routine.' },
                  ].map((insight, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 14, background: 'var(--bg)' }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.emoji}</span>
                      <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.55 }}>{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={reset}
                  style={{ flex: 1, height: 50, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}
                >
                  Upload Another
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onUploadComplete ? onUploadComplete(fileName) : onBack()}
                  style={{
                    flex: 1, height: 50, borderRadius: 16,
                    background: 'var(--t1)', color: 'var(--inv)',
                    border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  View in Reports
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadResultsScreen;
