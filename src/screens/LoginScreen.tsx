import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onLogin:    () => void;   /* existing user — skip onboarding */
  onSignUp:   () => void;   /* new user — go through onboarding */
}

/* ─── Animated brand ring ────────────────────────────────── */
const BrandRing: React.FC = () => {
  const rings = [
    { size: 80,  color: '#30D158', delay: 0 },
    { size: 62,  color: '#0A84FF', delay: 0.15 },
    { size: 44,  color: '#BF5AF2', delay: 0.3 },
  ];
  return (
    <div style={{ position: 'relative', width: 80, height: 80 }}>
      {rings.map(({ size, color, delay }, i) => {
        const sw = 6;
        const r  = (size - sw) / 2;
        const c  = 2 * Math.PI * r;
        return (
          <div key={i} style={{
            position: i === 0 ? 'relative' : 'absolute',
            top: i === 0 ? 0 : (80 - size) / 2,
            left: i === 0 ? 0 : (80 - size) / 2,
          }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={sw} />
              <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={color} strokeWidth={sw} strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: c * 0.22 }}
                transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: `drop-shadow(0 0 5px ${color}80)` }}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Google icon SVG ────────────────────────────────────── */
const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

/* ─── Apple icon SVG ─────────────────────────────────────── */
const AppleIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
    <path d="M13.125 10.014c-.013-1.74 1.43-2.586 1.495-2.626-1.633-2.389-4.165-2.715-5.058-2.744-2.152-.22-4.223 1.274-5.318 1.274-1.097 0-2.771-1.247-4.563-1.213-2.34.034-4.503 1.362-5.703 3.454-2.44 4.228-.625 10.478 1.746 13.911 1.163 1.681 2.542 3.563 4.355 3.494 1.753-.07 2.412-1.126 4.53-1.126 2.12 0 2.715 1.126 4.566 1.091 1.885-.034 3.075-1.703 4.228-3.389 1.337-1.947 1.887-3.83 1.917-3.928-.042-.016-3.668-1.407-3.705-5.588l.01.01z" fill={color} transform="scale(0.75) translate(1, 0)"/>
    <path d="M10.392 3.244C11.348 2.09 11.99.536 11.82 0c-1.365.056-3.02.91-3.997 2.056-.877 1.015-1.649 2.64-1.443 4.196 1.524.118 3.076-.773 4.012-3.008z" fill={color} transform="scale(0.75) translate(1, 0)"/>
  </svg>
);

/* ─── Input field ────────────────────────────────────────── */
const InputField: React.FC<{
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightEl?: React.ReactNode;
  error?: boolean;
}> = ({ icon, type, placeholder, value, onChange, rightEl, error }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    height: 52, paddingInline: 16, borderRadius: 16,
    background: 'var(--surface)',
    border: `1.5px solid ${error ? 'rgba(255,55,95,0.5)' : 'var(--border)'}`,
    transition: 'border-color 0.2s',
  }}>
    <div style={{ flexShrink: 0, opacity: 0.45 }}>{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        flex: 1, background: 'none', border: 'none', outline: 'none',
        fontSize: 15, color: 'var(--t1)', fontFamily: 'Inter',
        fontWeight: 500,
      }}
    />
    {rightEl}
  </div>
);

/* ─── Social button ──────────────────────────────────────── */
const SocialButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  dark?: boolean;
}> = ({ icon, label, onClick, dark }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    style={{
      flex: 1, height: 52, borderRadius: 16, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      background: dark ? 'var(--t1)' : 'var(--surface)',
      border: dark ? 'none' : '1px solid var(--border)',
      fontSize: 14, fontWeight: 600,
      color: dark ? 'var(--inv)' : 'var(--t1)',
      fontFamily: 'Inter',
    }}
  >
    {icon}
    {label}
  </motion.button>
);

/* ─── Main ───────────────────────────────────────────────── */
const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp }) => {
  const { isDark } = useTheme();
  const [mode,     setMode]     = useState<'login' | 'signup'>('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      isLogin ? onLogin() : onSignUp();
    }, 1200);
  };

  const handleSocial = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // New social sign-ups go through onboarding; returning users skip it
      onLogin();
    }, 900);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Background glow blobs */}
      <div style={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: isDark ? 'rgba(10,132,255,0.07)' : 'rgba(37,99,235,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 100, left: -80, width: 200, height: 200, borderRadius: '50%', background: isDark ? 'rgba(191,90,242,0.06)' : 'rgba(139,111,255,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 64, paddingBottom: 40 }}>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}
        >
          <BrandRing />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.025em', lineHeight: 1 }}>PRVNT</p>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 5, fontWeight: 500, letterSpacing: '0.02em' }}>
              Your personalised health platform
            </p>
          </div>
        </motion.div>

        {/* Mode toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 4, marginBottom: 28 }}
        >
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, height: 38, borderRadius: 12, border: 'none', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                background: mode === m ? 'var(--t1)' : 'transparent',
                color: mode === m ? 'var(--inv)' : 'var(--t3)',
                transition: 'all 0.2s ease',
              }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 52, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <InputField
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                  type="text" placeholder="Full name"
                  value={name} onChange={setName}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <InputField
            icon={<Mail size={16} color="var(--t1)" />}
            type="email" placeholder="Email address"
            value={email} onChange={setEmail} error={!!error && !email.includes('@') && email.length > 0}
          />

          <InputField
            icon={<Lock size={16} color="var(--t1)" />}
            type={showPw ? 'text' : 'password'}
            placeholder="Password"
            value={password} onChange={setPassword}
            error={!!error && password.length > 0 && password.length < 6}
            rightEl={
              <button onClick={() => setShowPw(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', opacity: 0.45 }}>
                {showPw ? <EyeOff size={16} color="var(--t1)" /> : <Eye size={16} color="var(--t1)" />}
              </button>
            }
          />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,55,95,0.08)', border: '1px solid rgba(255,55,95,0.2)' }}>
                <AlertCircle size={14} color="#FF375F" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#FF375F', fontWeight: 500 }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot password */}
          {isLogin && (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', fontSize: 13, color: 'var(--accent)', fontWeight: 600, fontFamily: 'Inter', paddingRight: 2 }}>
              Forgot password?
            </button>
          )}

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: 54, borderRadius: 16, border: 'none', cursor: loading ? 'default' : 'pointer',
              background: loading ? 'var(--border-md)' : 'var(--t1)',
              color: loading ? 'var(--t3)' : 'var(--inv)',
              fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              marginTop: 4,
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--t3)', borderTopColor: 'var(--t1)' }}
              />
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={17} strokeWidth={2.5} /></>
            )}
          </motion.button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBlock: 4 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <SocialButton
              icon={<GoogleIcon />}
              label="Google"
              onClick={() => handleSocial('google')}
            />
            <SocialButton
              icon={<AppleIcon color="var(--t1)" />}
              label="Apple"
              onClick={() => handleSocial('apple')}
              dark={false}
            />
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', fontSize: 12, color: 'var(--t3)', marginTop: 28, lineHeight: 1.6 }}
        >
          By continuing, you agree to PRVNT's{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Privacy Policy</span>
        </motion.p>
      </div>
    </div>
  );
};

export default LoginScreen;
