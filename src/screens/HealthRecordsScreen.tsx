import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronDown, ChevronUp, Plus,
  AlertTriangle, Pill, Stethoscope, FileText, Heart,
  Download, Eye, X, FileImage, Upload, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HealthRecordsScreenProps { onBack: () => void; }
type SectionKey  = 'allergies' | 'conditions' | 'medications' | 'history' | 'vaccinations';
type DocType     = 'pdf' | 'image';
type UploadStage = 'idle' | 'uploading' | 'done';

/* ─── Static record data (display only) ────────────────────── */
const RECORDS = {
  allergies: [
    { id: 1, name: 'Penicillin',  severity: 'Severe',   reaction: 'Anaphylaxis',        noted: 'Jan 2019' },
    { id: 2, name: 'Shellfish',   severity: 'Moderate', reaction: 'Hives, swelling',    noted: 'Mar 2021' },
    { id: 3, name: 'Latex',       severity: 'Mild',     reaction: 'Contact dermatitis', noted: 'Jun 2022' },
  ],
  conditions: [
    { id: 1, name: 'Type 2 Diabetes', status: 'Active',  diagnosed: 'Feb 2020', doctor: 'Dr. Sarah Chen'  },
    { id: 2, name: 'Hypertension',    status: 'Managed', diagnosed: 'Nov 2018', doctor: 'Dr. James Liu'   },
    { id: 3, name: 'Sleep Apnoea',    status: 'Active',  diagnosed: 'Aug 2022', doctor: 'Dr. Maria Patel' },
  ],
  medications: [
    { id: 1, name: 'Metformin',  dose: '500mg',   frequency: 'Twice daily', prescriber: 'Dr. Sarah Chen', refill: 'Jun 2026' },
    { id: 2, name: 'Lisinopril', dose: '10mg',    frequency: 'Once daily',  prescriber: 'Dr. James Liu',  refill: 'Jul 2026' },
    { id: 3, name: 'Vitamin D3', dose: '2000 IU', frequency: 'Once daily',  prescriber: 'Self',           refill: '—' },
    { id: 4, name: 'Omega-3',    dose: '1000mg',  frequency: 'Twice daily', prescriber: 'Self',           refill: '—' },
  ],
  history: [
    { id: 1, event: 'Appendectomy',        date: 'Mar 2015', hospital: 'Sydney General Hospital', notes: 'Laparoscopic, uncomplicated'  },
    { id: 2, event: 'Fractured Wrist (R)', date: 'Sep 2011', hospital: 'Westmead Hospital',       notes: 'Cast for 6 weeks, full recovery' },
    { id: 3, event: 'COVID-19',            date: 'Jan 2022', hospital: 'Outpatient',              notes: 'Mild symptoms, 7-day isolation' },
    { id: 4, event: 'Annual Health Check', date: 'Dec 2024', hospital: 'PRVNT Clinic',            notes: 'All markers within range' },
  ],
  vaccinations: [
    { id: 1, name: 'COVID-19 Booster', date: 'Nov 2023', provider: 'PRVNT Clinic',   nextDue: 'Nov 2024' },
    { id: 2, name: 'Influenza',        date: 'Apr 2025', provider: 'GP Clinic',      nextDue: 'Apr 2026' },
    { id: 3, name: 'Hepatitis B',      date: 'Jun 2008', provider: 'School Program', nextDue: 'Complete' },
  ],
};

/* ─── Document data ─────────────────────────────────────────── */
interface DocFile { id: string; name: string; type: DocType; size: string; date: string; uploadedBy: string; }

const SEED_DOCS: Record<SectionKey, DocFile[]> = {
  allergies: [
    { id: 'd1', name: 'Allergy Panel Report 2023.pdf',  type: 'pdf',   size: '1.2 MB', date: 'Nov 2023', uploadedBy: 'PRVNT Clinic'   },
    { id: 'd2', name: 'Skin Prick Test Results.pdf',    type: 'pdf',   size: '0.8 MB', date: 'Mar 2021', uploadedBy: 'Dr. Sarah Chen' },
  ],
  conditions: [
    { id: 'd3', name: 'Diabetes Management Plan.pdf',   type: 'pdf',   size: '2.1 MB', date: 'Feb 2024', uploadedBy: 'Dr. Sarah Chen' },
    { id: 'd4', name: 'Blood Pressure Log Q1 2026.pdf', type: 'pdf',   size: '0.5 MB', date: 'Mar 2026', uploadedBy: 'You'            },
  ],
  medications: [
    { id: 'd5', name: 'Metformin Prescription.pdf',     type: 'pdf',   size: '0.3 MB', date: 'Jan 2026', uploadedBy: 'Dr. Sarah Chen' },
    { id: 'd6', name: 'Lisinopril Prescription.pdf',    type: 'pdf',   size: '0.3 MB', date: 'Jan 2026', uploadedBy: 'Dr. James Liu'  },
    { id: 'd7', name: 'Medication Schedule.pdf',        type: 'pdf',   size: '0.4 MB', date: 'Feb 2026', uploadedBy: 'You'            },
  ],
  history: [
    { id: 'd8',  name: 'Appendectomy Discharge Summary.pdf',  type: 'pdf',   size: '1.8 MB', date: 'Mar 2015', uploadedBy: 'Sydney General'   },
    { id: 'd9',  name: 'Annual Health Check Report 2024.pdf', type: 'pdf',   size: '3.2 MB', date: 'Dec 2024', uploadedBy: 'PRVNT Clinic'     },
    { id: 'd10', name: 'Wrist X-Ray Scan.jpg',                type: 'image', size: '4.1 MB', date: 'Sep 2011', uploadedBy: 'Westmead Hospital' },
  ],
  vaccinations: [
    { id: 'd11', name: 'Vaccination Certificate.pdf',   type: 'pdf',   size: '0.6 MB', date: 'Nov 2023', uploadedBy: 'PRVNT Clinic' },
    { id: 'd12', name: 'Immunisation History.pdf',      type: 'pdf',   size: '1.1 MB', date: 'Apr 2025', uploadedBy: 'GP Clinic'    },
  ],
};

const SECTION_FILENAME: Record<SectionKey, string> = {
  allergies:    'Allergy_Document',
  conditions:   'Condition_Record',
  medications:  'Prescription',
  history:      'Medical_History_Record',
  vaccinations: 'Vaccination_Certificate',
};

/* ─── Helpers ───────────────────────────────────────────────── */
const severityColor = (s: string) => {
  if (s === 'Severe')   return { bg: 'rgba(239,68,68,0.1)',  text: '#EF4444' };
  if (s === 'Moderate') return { bg: 'rgba(245,158,11,0.1)', text: '#D97706' };
  return                       { bg: 'rgba(16,185,129,0.1)', text: '#059669' };
};
const conditionStatusColor = (s: string) => {
  if (s === 'Active')   return { bg: 'rgba(239,68,68,0.08)',  text: '#DC2626' };
  if (s === 'Managed')  return { bg: 'rgba(16,185,129,0.08)', text: '#059669' };
  if (s === 'Resolved') return { bg: 'rgba(10,132,255,0.08)', text: '#0A84FF' };
  return                       { bg: 'rgba(107,114,128,0.08)',text: '#6B7280' };
};
const docCfg: Record<DocType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  pdf:   { icon: <FileText  size={18} />, color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  label: 'PDF'   },
  image: { icon: <FileImage size={18} />, color: '#0A84FF', bg: 'rgba(10,132,255,0.1)', label: 'Image' },
};

/* ─── Section meta (defined at module level, stable reference) ─ */
const SECTIONS: { key: SectionKey; label: string; color: string; icon: React.ReactNode }[] = [
  { key: 'allergies',    label: 'Allergies',       color: '#EF4444', icon: <AlertTriangle size={18} color="#EF4444" /> },
  { key: 'conditions',   label: 'Conditions',      color: '#6366F1', icon: <Heart         size={18} color="#6366F1" /> },
  { key: 'medications',  label: 'Medications',     color: '#10B981', icon: <Pill          size={18} color="#10B981" /> },
  { key: 'history',      label: 'Medical History', color: '#F59E0B', icon: <Stethoscope   size={18} color="#F59E0B" /> },
  { key: 'vaccinations', label: 'Vaccinations',    color: '#0EA5E9', icon: <FileText      size={18} color="#0EA5E9" /> },
];

/* ═══════════════════════════════════════════════════════════════
   Sub-components defined OUTSIDE the main component so their
   identity is stable across re-renders — no remount on each tick
   ═══════════════════════════════════════════════════════════════ */

/* ── DocRow ─────────────────────────────────────────────────── */
interface DocRowProps {
  doc: DocFile; isLast: boolean;
  downloading: string | null;
  onView: (d: DocFile) => void;
  onDownload: (d: DocFile) => void;
  border: string; textPri: string; textSec: string; textTer: string;
  t: (light: string, dark: string) => string;
}
const DocRow: React.FC<DocRowProps> = ({ doc, isLast, downloading, onView, onDownload, border, textPri, textTer, t }) => {
  const cfg      = docCfg[doc.type];
  const isLoading = downloading === doc.id;
  const byUser    = doc.uploadedBy === 'You';
  return (
    <div style={{ padding: '12px 16px', borderBottom: isLast ? 'none' : `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: textPri, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, paddingInline: 6, paddingBlock: 2, borderRadius: 6, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
          <span style={{ fontSize: 11, color: textTer }}>{doc.size}</span>
          <span style={{ fontSize: 10, color: textTer }}>·</span>
          <span style={{ fontSize: 11, color: textTer }}>{doc.date}</span>
        </div>
        <p style={{ fontSize: 11, marginTop: 3, color: byUser ? '#0A84FF' : textTer, fontWeight: byUser ? 600 : 400 }}>
          {byUser ? '↑ Uploaded by you' : `Uploaded by ${doc.uploadedBy}`}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => onView(doc)}
          style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', background: t('rgba(10,132,255,0.08)', 'rgba(10,132,255,0.15)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Eye size={15} color="#0A84FF" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => onDownload(doc)}
          style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', background: isLoading ? 'rgba(16,185,129,0.12)' : t('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.07)'), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease' }}>
          {isLoading
            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Download size={15} color="#10B981" /></motion.div>
            : <Download size={15} color={textTer} />}
        </motion.button>
      </div>
    </div>
  );
};

/* ── DocViewer ──────────────────────────────────────────────── */
interface DocViewerProps {
  doc: DocFile;
  onClose: () => void;
  onDownload: (d: DocFile) => void;
  border: string; textPri: string; textSec: string; textTer: string;
  t: (light: string, dark: string) => string;
}
const DocViewer: React.FC<DocViewerProps> = ({ doc, onClose, onDownload, border, textPri, textSec, textTer, t }) => {
  const cfg = docCfg[doc.type];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxHeight: '88vh', background: t('#FFFFFF', '#111827'), borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color }}>{cfg.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: textPri, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
            <p style={{ fontSize: 12, color: textSec, marginTop: 1 }}>{cfg.label} · {doc.size} · {doc.date}</p>
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: t('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} color={textSec} />
          </motion.button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {doc.type === 'image' ? (
            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16, background: t('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.05)'), border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <FileImage size={48} color={textTer} />
              <p style={{ fontSize: 13, color: textSec, fontWeight: 500 }}>Image preview</p>
              <p style={{ fontSize: 12, color: textTer }}>Tap download to save to your device</p>
            </div>
          ) : (
            <div style={{ background: t('#FFFFFF', '#1C2333'), borderRadius: 16, border: `1px solid ${border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color }}><FileText size={14} /></div>
                <div>
                  <div style={{ width: 140, height: 8, borderRadius: 4, background: t('rgba(0,0,0,0.12)', 'rgba(255,255,255,0.12)'), marginBottom: 5 }} />
                  <div style={{ width: 90,  height: 6, borderRadius: 4, background: t('rgba(0,0,0,0.07)', 'rgba(255,255,255,0.07)') }} />
                </div>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[85, 100, 92, 78].map((w, i) => <div key={i} style={{ width: `${w}%`, height: i === 0 ? 10 : 8, borderRadius: 4, background: t('rgba(0,0,0,0.07)', 'rgba(255,255,255,0.07)') }} />)}
                <div style={{ height: 8 }} />
                {[100, 95, 88, 72].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 7, borderRadius: 4, background: t('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)') }} />)}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '14px 20px 36px', borderTop: `1px solid ${border}`, display: 'flex', gap: 10, flexShrink: 0, background: t('rgba(255,255,255,0.95)', 'rgba(17,24,39,0.98)') }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            style={{ flex: 1, height: 48, borderRadius: 14, border: `1px solid ${border}`, cursor: 'pointer', background: 'transparent', fontSize: 14, fontWeight: 600, fontFamily: 'Inter', color: textSec }}>
            Close
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onDownload(doc)}
            style={{ flex: 2, height: 48, borderRadius: 14, border: 'none', cursor: 'pointer', background: '#0A84FF', color: '#FFF', fontSize: 14, fontWeight: 700, fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 16px rgba(10,132,255,0.28)' }}>
            <Download size={16} /> Download
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── UploadSheet ────────────────────────────────────────────── */
interface UploadSheetProps {
  sectionKey: SectionKey;
  uploadType: DocType;
  uploadStage: UploadStage;
  uploadPct: number;
  uploadedName: string;
  dragOver: boolean;
  onClose: () => void;
  onPickType: (t: DocType) => void;
  onTrigger: () => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
  border: string; textPri: string; textSec: string;
  t: (light: string, dark: string) => string;
  sheetBg: string;
}
const UploadSheet: React.FC<UploadSheetProps> = ({
  sectionKey, uploadType, uploadStage, uploadPct, uploadedName, dragOver,
  onClose, onPickType, onTrigger, onDragOver, onDragLeave, onDrop,
  border, textPri, textSec, t, sheetBg,
}) => {
  const sec     = SECTIONS.find(s => s.key === sectionKey)!;
  const circumf = 2 * Math.PI * 44;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={uploadStage === 'idle' ? onClose : undefined}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', background: sheetBg, borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: `${sec.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sec.icon}</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: textPri, lineHeight: 1.2 }}>Add Document</p>
              <p style={{ fontSize: 12, color: textSec }}>{sec.label}</p>
            </div>
          </div>
          {uploadStage === 'idle' && (
            <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: t('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color={textSec} />
            </motion.button>
          )}
        </div>

        <div style={{ padding: '20px 20px 48px' }}>
          <AnimatePresence mode="wait">

            {/* idle */}
            {uploadStage === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Type picker */}
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['pdf', 'image'] as DocType[]).map(dt => {
                    const active = uploadType === dt;
                    const ico    = dt === 'pdf' ? <FileText size={18} /> : <FileImage size={18} />;
                    const lbl    = dt === 'pdf' ? 'PDF Report'   : 'Photo / Scan';
                    const dsc    = dt === 'pdf' ? 'Documents, printouts' : 'JPG, PNG of your record';
                    return (
                      <motion.button key={dt} whileTap={{ scale: 0.97 }} onClick={() => onPickType(dt)}
                        style={{ flex: 1, padding: '14px 12px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                          background: active ? `${sec.color}12` : t('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.04)'),
                          border: `1.5px solid ${active ? sec.color + '55' : border}`,
                          transition: 'all 0.18s ease' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                          background: active ? `${sec.color}20` : t('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)'),
                          color: active ? sec.color : textSec }}>
                          {ico}
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: active ? sec.color : textPri, marginBottom: 2 }}>{lbl}</p>
                        <p style={{ fontSize: 11, color: textSec }}>{dsc}</p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Drop zone */}
                <motion.div animate={{ scale: dragOver ? 1.015 : 1 }}
                  onDragOver={e => { e.preventDefault(); onDragOver(); }}
                  onDragLeave={onDragLeave}
                  onDrop={e => { e.preventDefault(); onDrop(); }}
                  onClick={onTrigger}
                  style={{ padding: '32px 20px', borderRadius: 20, cursor: 'pointer', textAlign: 'center',
                    border: `2px dashed ${dragOver ? sec.color : sec.color + '50'}`,
                    background: dragOver ? `${sec.color}08` : `${sec.color}04`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s ease' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: `${sec.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={24} color={sec.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: sec.color, marginBottom: 4 }}>
                      {dragOver ? 'Drop it here!' : 'Tap or drag to upload'}
                    </p>
                    <p style={{ fontSize: 12, color: textSec }}>
                      {uploadType === 'pdf' ? 'PDF up to 20 MB' : 'JPG or PNG up to 10 MB'}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* uploading */}
            {uploadStage === 'uploading' && (
              <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingBlock: 20 }}>
                <div style={{ position: 'relative', width: 100, height: 100 }}>
                  <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="44" fill="none" stroke={border} strokeWidth="6" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke={sec.color} strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumf}
                      strokeDashoffset={circumf * (1 - Math.min(uploadPct, 100) / 100)}
                      style={{ transition: 'stroke-dashoffset 0.2s ease-out' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: textPri }}>{Math.min(Math.round(uploadPct), 100)}%</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: textPri, marginBottom: 5 }}>Uploading…</p>
                  <p style={{ fontSize: 13, color: textSec }}>{uploadedName}</p>
                </div>
              </motion.div>
            )}

            {/* done */}
            {uploadStage === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingBlock: 20 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.05 }}
                  style={{ width: 72, height: 72, borderRadius: 24, background: `${sec.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={36} color={sec.color} />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: textPri, marginBottom: 5 }}>Document Added!</p>
                  <p style={{ fontSize: 13, color: textSec }}>{uploadedName}</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Main screen
   ═══════════════════════════════════════════════════════════════ */
const HealthRecordsScreen: React.FC<HealthRecordsScreenProps> = ({ onBack }) => {
  const { t } = useTheme();

  const [docs,         setDocs]         = useState<Record<SectionKey, DocFile[]>>(SEED_DOCS);
  const [openSection,  setOpenSection]  = useState<SectionKey | null>('allergies');
  const [viewingDoc,   setViewingDoc]   = useState<DocFile | null>(null);
  const [downloading,  setDownloading]  = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<SectionKey | null>(null);
  const [uploadType,   setUploadType]   = useState<DocType>('pdf');
  const [uploadStage,  setUploadStage]  = useState<UploadStage>('idle');
  const [uploadPct,    setUploadPct]    = useState(0);
  const [uploadedName, setUploadedName] = useState('');
  const [dragOver,     setDragOver]     = useState(false);

  const bg      = t('#F2F1EC', '#080B12');
  const cardBg  = t('rgba(255,255,255,0.85)', 'rgba(255,255,255,0.055)');
  const border  = t('rgba(0,0,0,0.07)',        'rgba(255,255,255,0.08)');
  const textPri = t('#111827', '#F3F4F6');
  const textSec = t('#6B7280', '#9CA3AF');
  const textTer = t('#9CA3AF', '#6B7280');
  const sheetBg = t('#FFFFFF', '#0F172A');
  const cardStyle = { background: cardBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${border}`, borderRadius: 20 };

  const handleDownload = (doc: DocFile) => {
    setDownloading(doc.id);
    setTimeout(() => setDownloading(null), 1800);
  };

  const closeUploadSheet = () => {
    setUploadingFor(null);
    setUploadStage('idle');
    setUploadPct(0);
  };

  const openUploadSheet = (key: SectionKey) => {
    setUploadingFor(key);
    setUploadType('pdf');
    setUploadStage('idle');
    setUploadPct(0);
    setUploadedName('');
  };

  const runUpload = (section: SectionKey, type: DocType) => {
    const prefix = SECTION_FILENAME[section];
    const today  = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const name   = type === 'pdf'
      ? `${prefix}_${today.replace(' ', '')}.pdf`
      : `${prefix}_Scan_${today.replace(' ', '')}.jpg`;

    setUploadedName(name);
    setUploadStage('uploading');
    setUploadPct(0);

    /* local variable — never call side-effects inside a state updater */
    let pct = 0;
    const iv = setInterval(() => {
      const remaining = 88 - pct;
      if (remaining <= 0) return;
      pct = Math.min(pct + Math.random() * 7 + 4, 88);
      setUploadPct(pct);
    }, 130);

    setTimeout(() => {
      clearInterval(iv);
      setUploadPct(100);
      setUploadStage('done');
      setDocs(prev => ({
        ...prev,
        [section]: [...prev[section], {
          id:         `u_${Date.now()}`,
          name,
          type,
          size:       type === 'pdf' ? '1.4 MB' : '2.8 MB',
          date:       today,
          uploadedBy: 'You',
        }],
      }));
      setTimeout(() => closeUploadSheet(), 1600);
    }, 2400);
  };

  return (
    <>
      <div className="page-scroll" style={{ paddingBottom: 40, background: bg }}>
        <div style={{ height: 52 }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 mb-6">
          <button onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <ChevronLeft size={20} color={textPri} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: textPri }}>Health Records</h1>
            <p className="text-xs" style={{ color: textSec }}>Last updated May 2026</p>
          </div>
        </div>

        {/* Summary bar */}
        <div className="px-5 mb-5">
          <div className="rounded-2xl p-4 flex justify-around" style={cardStyle}>
            {[
              { label: 'Allergies',   val: RECORDS.allergies.length,   color: '#EF4444' },
              { label: 'Conditions',  val: RECORDS.conditions.length,  color: '#6366F1' },
              { label: 'Medications', val: RECORDS.medications.length, color: '#10B981' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-2xl font-bold" style={{ color }}>{val}</span>
                <span className="text-[11px] mt-0.5" style={{ color: textSec }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion sections */}
        <div className="px-5 space-y-3">
          {SECTIONS.map(({ key, label, icon }) => {
            const isOpen     = openSection === key;
            const sectionDocs = docs[key];
            return (
              <div key={key} style={{ ...cardStyle, overflow: 'hidden' }}>
                <button className="w-full flex items-center gap-3 px-4 py-4"
                  onClick={() => setOpenSection(isOpen ? null : key)}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: t('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.07)') }}>
                    {icon}
                  </div>
                  <span className="flex-1 text-left text-sm font-semibold" style={{ color: textPri }}>{label}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full mr-2"
                    style={{ background: t('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)'), color: textSec }}>
                    {sectionDocs.length} docs
                  </span>
                  {isOpen ? <ChevronUp size={16} color={textSec} /> : <ChevronDown size={16} color={textSec} />}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="content"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ borderTop: `1px solid ${border}` }}>

                        {key === 'allergies' && RECORDS.allergies.map(a => {
                          const sc = severityColor(a.severity);
                          return (
                            <div key={a.id} className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm" style={{ color: textPri }}>{a.name}</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{a.severity}</span>
                              </div>
                              <p className="text-xs" style={{ color: textSec }}>Reaction: {a.reaction}</p>
                              <p className="text-xs mt-0.5" style={{ color: textTer }}>Noted {a.noted}</p>
                            </div>
                          );
                        })}

                        {key === 'conditions' && RECORDS.conditions.map(c => {
                          const sc = conditionStatusColor(c.status);
                          return (
                            <div key={c.id} className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm" style={{ color: textPri }}>{c.name}</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{c.status}</span>
                              </div>
                              <p className="text-xs" style={{ color: textSec }}>Diagnosed {c.diagnosed}</p>
                              <p className="text-xs mt-0.5" style={{ color: textTer }}>{c.doctor}</p>
                            </div>
                          );
                        })}

                        {key === 'medications' && RECORDS.medications.map(m => (
                          <div key={m.id} className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm" style={{ color: textPri }}>{m.name}</span>
                              <span className="text-xs font-medium" style={{ color: '#10B981' }}>{m.dose}</span>
                            </div>
                            <p className="text-xs" style={{ color: textSec }}>{m.frequency} · Prescribed by {m.prescriber}</p>
                            {m.refill !== '—' && <p className="text-xs mt-0.5" style={{ color: textTer }}>Refill due {m.refill}</p>}
                          </div>
                        ))}

                        {key === 'history' && RECORDS.history.map(h => (
                          <div key={h.id} className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm" style={{ color: textPri }}>{h.event}</span>
                              <span className="text-xs" style={{ color: textSec }}>{h.date}</span>
                            </div>
                            <p className="text-xs" style={{ color: textSec }}>{h.hospital}</p>
                            {h.notes && <p className="text-xs mt-0.5 italic" style={{ color: textTer }}>{h.notes}</p>}
                          </div>
                        ))}

                        {key === 'vaccinations' && RECORDS.vaccinations.map(v => (
                          <div key={v.id} className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm" style={{ color: textPri }}>{v.name}</span>
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                style={{ background: v.nextDue === 'Complete' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: v.nextDue === 'Complete' ? '#059669' : '#D97706' }}>
                                {v.nextDue === 'Complete' ? 'Complete' : `Due ${v.nextDue}`}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: textSec }}>Given {v.date} · {v.provider}</p>
                          </div>
                        ))}

                        {/* Documents */}
                        {sectionDocs.length > 0 && (
                          <div>
                            <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${border}` }}>
                              <FileText size={12} color={textTer} />
                              <p style={{ fontSize: 11, fontWeight: 700, color: textTer, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                Documents · {sectionDocs.length}
                              </p>
                            </div>
                            {sectionDocs.map((doc, i) => (
                              <DocRow key={doc.id} doc={doc} isLast={i === sectionDocs.length - 1}
                                downloading={downloading}
                                onView={setViewingDoc}
                                onDownload={handleDownload}
                                border={border} textPri={textPri} textSec={textSec} textTer={textTer} t={t} />
                            ))}
                          </div>
                        )}

                        {/* Upload button */}
                        <motion.button whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-2 px-4 py-3.5"
                          onClick={() => openUploadSheet(key)}
                          style={{ cursor: 'pointer', border: 'none', background: 'transparent', borderTop: `1px solid ${border}` }}>
                          <div style={{ width: 28, height: 28, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t('rgba(10,132,255,0.08)', 'rgba(10,132,255,0.14)') }}>
                            <Plus size={14} color="#0A84FF" />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: '#0A84FF' }}>Upload document</span>
                          <span className="text-xs ml-auto" style={{ color: textTer }}>PDF or Image</span>
                        </motion.button>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] px-8 mt-6" style={{ color: textTer }}>
          This information is for personal health tracking only. Always consult your healthcare provider for medical advice.
        </p>
      </div>

      {/* Document viewer */}
      <AnimatePresence>
        {viewingDoc && (
          <DocViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} onDownload={handleDownload}
            border={border} textPri={textPri} textSec={textSec} textTer={textTer} t={t} />
        )}
      </AnimatePresence>

      {/* Upload sheet */}
      <AnimatePresence>
        {uploadingFor && (
          <UploadSheet
            sectionKey={uploadingFor}
            uploadType={uploadType}
            uploadStage={uploadStage}
            uploadPct={uploadPct}
            uploadedName={uploadedName}
            dragOver={dragOver}
            onClose={closeUploadSheet}
            onPickType={setUploadType}
            onTrigger={() => runUpload(uploadingFor, uploadType)}
            onDragOver={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => { setDragOver(false); runUpload(uploadingFor, uploadType); }}
            border={border} textPri={textPri} textSec={textSec}
            t={t} sheetBg={sheetBg}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthRecordsScreen;
