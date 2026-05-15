import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
  fontSize?: string;
}

const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  color = '#6366F1',
  bgColor: bgColorProp,
  textColor = '#111827',
  label,
  sublabel,
  animate = true,
  fontSize = '28px',
}) => {
  const { t } = useTheme();
  const bgColor = bgColorProp ?? t('#E5E7EB', 'rgba(255,255,255,0.1)');
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    circleRef.current.style.strokeDashoffset = String(circumference);
    const timer = setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        circleRef.current.style.strokeDashoffset = String(offset);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [score, offset, circumference, animate]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {label !== undefined ? (
          <>
            <div style={{ fontSize, fontWeight: 700, color: textColor, lineHeight: 1 }}>{label}</div>
            {sublabel && <div style={{ fontSize: '11px', color: '#9B9BAE', marginTop: 3 }}>{sublabel}</div>}
          </>
        ) : (
          <>
            <div style={{ fontSize, fontWeight: 700, color: textColor, lineHeight: 1 }}>{score}</div>
            {sublabel && <div style={{ fontSize: '11px', color: '#9B9BAE', marginTop: 3 }}>{sublabel}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default ScoreRing;
