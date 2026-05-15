import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Bluetooth, BluetoothOff, Check, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DevicesScreenProps {
  onBack: () => void;
}

type ConnState = 'connected' | 'connecting' | 'disconnected' | 'searching';

interface Device {
  id: string;
  name: string;
  icon: string;
  category: string;
  state: ConnState;
  lastSync?: string;
  battery?: number;
}

const initialDevices: Device[] = [
  { id: 'apple_watch', name: 'Apple Watch Series 9', icon: '⌚', category: 'Wearable',     state: 'connected',    lastSync: 'Just now',    battery: 72 },
  { id: 'oura',        name: 'Oura Ring Gen 3',      icon: '💍', category: 'Wearable',     state: 'disconnected', lastSync: '2 days ago' },
  { id: 'whoop',       name: 'WHOOP 4.0',            icon: '📿', category: 'Wearable',     state: 'disconnected' },
  { id: 'garmin',      name: 'Garmin Forerunner',    icon: '🏃', category: 'Wearable',     state: 'disconnected' },
  { id: 'withings',    name: 'Withings Scale',       icon: '⚖️', category: 'Smart Scale',  state: 'disconnected' },
  { id: 'omron',       name: 'Omron BP Monitor',     icon: '🩺', category: 'Blood Pressure',state: 'disconnected' },
];

const DevicesScreen: React.FC<DevicesScreenProps> = ({ onBack }) => {
  const { isDark, t } = useTheme();
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [devices, setDevices]         = useState<Device[]>(initialDevices);
  const [scanning, setScanning]       = useState(false);

  const bg      = t('#F2F1EC', '#080B12');
  const cardBg  = t('rgba(255,255,255,0.85)', 'rgba(255,255,255,0.055)');
  const border  = t('rgba(0,0,0,0.07)',        'rgba(255,255,255,0.08)');
  const textPri = t('#111827', '#F3F4F6');
  const textSec = t('#6B7280', '#9CA3AF');
  const textTer = t('#9CA3AF', '#6B7280');

  const cardStyle = {
    background: cardBg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${border}`,
    borderRadius: 20,
  };

  const handleScan = () => {
    if (!bluetoothOn) return;
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  const connectDevice = (id: string) => {
    if (!bluetoothOn) return;
    setDevices(prev => prev.map(d => d.id === id ? { ...d, state: 'connecting' } : d));
    setTimeout(() => {
      setDevices(prev => prev.map(d => {
        if (d.id !== id) return d;
        if (d.state === 'connecting') return { ...d, state: 'connected', lastSync: 'Just now', battery: Math.floor(Math.random() * 40) + 60 };
        return d;
      }));
    }, 2200);
  };

  const disconnectDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, state: 'disconnected', battery: undefined } : d));
  };

  const connected  = devices.filter(d => d.state === 'connected');
  const available  = devices.filter(d => d.state !== 'connected');

  const stateLabel: Record<ConnState, string> = {
    connected:    'Connected',
    connecting:   'Connecting…',
    disconnected: 'Not connected',
    searching:    'Found nearby',
  };

  const stateColors: Record<ConnState, { bg: string; text: string }> = {
    connected:    { bg: 'rgba(16,185,129,0.1)',  text: '#059669' },
    connecting:   { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1' },
    disconnected: { bg: t('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.07)'), text: textSec },
    searching:    { bg: 'rgba(245,158,11,0.1)',  text: '#D97706' },
  };

  return (
    <div className="page-scroll" style={{ paddingBottom: 40, background: bg }}>
      <div style={{ height: 52 }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: cardBg, border: `1px solid ${border}` }}
        >
          <ChevronLeft size={20} color={textPri} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: textPri }}>Connected Devices</h1>
          <p className="text-xs" style={{ color: textSec }}>{connected.length} device{connected.length !== 1 ? 's' : ''} active</p>
        </div>
      </div>

      {/* Bluetooth toggle */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4 flex items-center gap-4" style={cardStyle}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bluetoothOn ? 'rgba(37,99,235,0.12)' : t('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.07)') }}>
            {bluetoothOn
              ? <Bluetooth size={22} color="#2563EB" />
              : <BluetoothOff size={22} color={textSec} />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: textPri }}>Bluetooth</p>
            <p className="text-xs mt-0.5" style={{ color: textSec }}>{bluetoothOn ? 'On — ready to sync' : 'Off — enable to connect'}</p>
          </div>
          <button
            onClick={() => setBluetoothOn(v => !v)}
            className="w-12 h-6 rounded-full transition-all duration-200 relative"
            style={{ background: bluetoothOn ? '#2563EB' : t('#E5E7EB', 'rgba(255,255,255,0.12)') }}
          >
            <motion.span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
              animate={{ left: bluetoothOn ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Connected devices */}
      {connected.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: textTer }}>Connected</p>
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            {connected.map((device, i) => (
              <div key={device.id} className="px-4 py-4" style={{ borderBottom: i < connected.length - 1 ? `1px solid ${border}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{device.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: textPri }}>{device.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: textSec }}>{device.lastSync}</span>
                      {device.battery !== undefined && (
                        <>
                          <span style={{ color: textTer, fontSize: 10 }}>·</span>
                          <span className="text-xs" style={{ color: device.battery > 30 ? '#059669' : '#D97706' }}>🔋 {device.battery}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: stateColors.connected.bg, color: stateColors.connected.text }}>
                      Connected
                    </span>
                    <button
                      onClick={() => disconnectDevice(device.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: t('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.07)') }}
                    >
                      <WifiOff size={14} color={textSec} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan button */}
      <div className="px-5 mb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleScan}
          disabled={!bluetoothOn}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{
            background: bluetoothOn ? t('#111827', '#818CF8') : t('#E5E7EB', 'rgba(255,255,255,0.1)'),
            color: bluetoothOn ? '#FFFFFF' : textTer,
            transition: 'all 0.2s ease',
          }}
        >
          <motion.div animate={{ rotate: scanning ? 360 : 0 }} transition={{ repeat: scanning ? Infinity : 0, duration: 1, ease: 'linear' }}>
            <RefreshCw size={16} color={bluetoothOn ? '#FFFFFF' : textTer} />
          </motion.div>
          {scanning ? 'Scanning for devices…' : 'Scan for devices'}
        </motion.button>
      </div>

      {/* Available devices */}
      <div className="px-5">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: textTer }}>Available Devices</p>
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          {available.map((device, i) => {
            const sc = stateColors[device.state];
            const isConnecting = device.state === 'connecting';
            return (
              <div key={device.id} className="px-4 py-4" style={{ borderBottom: i < available.length - 1 ? `1px solid ${border}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" style={{ opacity: bluetoothOn ? 1 : 0.4 }}>{device.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: bluetoothOn ? textPri : textTer }}>{device.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: textTer }}>{device.category}</p>
                  </div>
                  {isConnecting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <RefreshCw size={16} color="#6366F1" />
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => connectDevice(device.id)}
                      disabled={!bluetoothOn}
                      className="px-3.5 h-8 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: bluetoothOn ? t('rgba(37,99,235,0.1)', 'rgba(129,140,248,0.15)') : t('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
                        color: bluetoothOn ? t('#2563EB', '#818CF8') : textTer,
                      }}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data sync note */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl p-4 flex gap-3" style={{ background: t('rgba(37,99,235,0.06)', 'rgba(129,140,248,0.08)'), border: `1px solid ${t('rgba(37,99,235,0.15)', 'rgba(129,140,248,0.2)')}` }}>
          <Wifi size={16} color={t('#2563EB', '#818CF8')} style={{ flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: t('#1D4ED8', '#A5B4FC') }}>
            Your wearable data syncs automatically when Bluetooth is on and the device is nearby. Health data is encrypted and stored securely.
          </p>
        </div>
      </div>

      {/* Setup actions */}
      <div className="px-5 mt-5" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Connect in-app CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleScan}
          style={{
            width: '100%', height: 54, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(48,209,88,0.25)',
          }}
        >
          <Bluetooth size={17} />
          Connect a device now
        </motion.button>

        {/* Skip */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          style={{
            width: '100%', height: 48, borderRadius: 18, cursor: 'pointer',
            background: 'transparent',
            border: `1.5px solid ${border}`,
            fontSize: 14, fontWeight: 600, fontFamily: 'Inter',
            color: textSec,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Skip for now — I'll set up later
        </motion.button>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

export default DevicesScreen;
