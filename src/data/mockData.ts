export const user = {
  name: 'Alex',
  fullName: 'Alex Thompson',
  email: 'alex.thompson@email.com',
  avatar: null,
  age: 34,
  plan: 'Premium',
  daysActive: 127,
  biologicalAge: 29,
};

export const todayScores = {
  overall: 84,
  recovery: 78,
  sleep: 87,
  readiness: 82,
  stress: 34,
  hrv: 68,
};

export const weeklyHRV = [62, 65, 58, 72, 68, 74, 68];
export const weeklySleep = [6.8, 7.4, 6.2, 7.8, 7.2, 8.1, 7.2];
export const weeklyRecovery = [72, 68, 61, 80, 78, 83, 78];
export const weeklySteps = [7200, 9400, 6100, 11200, 8900, 12400, 9800];
export const weeklyHRVTrend = [
  { day: 'Mon', value: 62 },
  { day: 'Tue', value: 65 },
  { day: 'Wed', value: 58 },
  { day: 'Thu', value: 72 },
  { day: 'Fri', value: 68 },
  { day: 'Sat', value: 74 },
  { day: 'Sun', value: 68 },
];
export const weeklySleepTrend = [
  { day: 'Mon', value: 6.8 },
  { day: 'Tue', value: 7.4 },
  { day: 'Wed', value: 6.2 },
  { day: 'Thu', value: 7.8 },
  { day: 'Fri', value: 7.2 },
  { day: 'Sat', value: 8.1 },
  { day: 'Sun', value: 7.2 },
];
export const weeklyRecoveryTrend = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 68 },
  { day: 'Wed', value: 61 },
  { day: 'Thu', value: 80 },
  { day: 'Fri', value: 78 },
  { day: 'Sat', value: 83 },
  { day: 'Sun', value: 78 },
];

export const monthlyHeartRate = (() => {
  const vals = [54,56,53,57,55,52,54,58,56,54,53,55,57,56,54,55,53,56,54,52,55,57,55,53,54,56,54,53,55,54];
  const start = new Date(2026, 3, 13); // Apr 13 2026
  return vals.map((value, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const mo = d.toLocaleString('en-US', { month: 'short' });
    return { day: `${mo} ${d.getDate()}`, value };
  });
})();

export const vitals = {
  hrv: { value: 68, unit: 'ms', score: 82, trend: +6, status: 'optimal', weeklyAvg: 67, best: 82, lowest: 58 },
  sleep: { value: 7.2, unit: 'hrs', score: 85, trend: +10, status: 'optimal', weeklyAvg: 7.2, best: 8.1, lowest: 6.2 },
  recovery: { value: 78, unit: '%', score: 78, trend: -12, status: 'fair', weeklyAvg: 74, best: 83, lowest: 61 },
  restingHR: { value: 54, unit: 'bpm', score: 88, trend: 0, status: 'optimal', weeklyAvg: 55, best: 52, lowest: 58 },
  bloodOxygen: { value: 98, unit: '%', score: 96, trend: +1, status: 'optimal', weeklyAvg: 97, best: 99, lowest: 96 },
  respiratoryRate: { value: 14.2, unit: 'brpm', score: 90, trend: -2, status: 'optimal', weeklyAvg: 14.5, best: 13.8, lowest: 15.2 },
  steps: { value: 9800, unit: 'steps', score: 72, trend: +8, status: 'good', weeklyAvg: 9300, best: 12400, lowest: 6100 },
  calories: { value: 2340, unit: 'kcal', score: 80, trend: +5, status: 'good', weeklyAvg: 2200, best: 2600, lowest: 1840 },
};

export const sleepStages = [
  { stage: 'Awake', duration: 18, color: '#F43F5E' },
  { stage: 'REM', duration: 94, color: '#6366F1' },
  { stage: 'Light', duration: 178, color: '#06B6D4' },
  { stage: 'Deep', duration: 142, color: '#1C1C2E' },
];

export const tasks = [
  { id: 1, time: '8:00 AM', title: 'Morning supplements', category: 'Supplements', done: true, icon: '💊' },
  { id: 2, time: '10:00 AM', title: 'Zone 2 cardio · 30 min', category: 'Activity', done: false, icon: '🏃' },
  { id: 3, time: '12:30 PM', title: 'Protein-rich lunch', category: 'Nutrition', done: false, icon: '🥗' },
  { id: 4, time: '2:00 PM', title: 'Hydration check · 2L target', category: 'Nutrition', done: false, icon: '💧' },
  { id: 5, time: '6:00 PM', title: 'Evening walk · 15 min', category: 'Activity', done: false, icon: '🚶' },
  { id: 6, time: '8:00 PM', title: 'Magnesium supplement', category: 'Supplements', done: false, icon: '💊' },
  { id: 7, time: '10:30 PM', title: 'Sleep by 10:30 PM', category: 'Sleep', done: false, icon: '🌙' },
];

export const weeklyGoals = [
  { label: 'Zone 2 Cardio', progress: 3, total: 5, color: '#6366F1' },
  { label: 'Sleep Quality', progress: 5, total: 7, color: '#F59E0B' },
  { label: 'Nutrition Score', progress: 6, total: 7, color: '#10B981' },
  { label: 'Meditation', progress: 4, total: 7, color: '#8B5CF6' },
];

export const insights = [
  {
    id: 1,
    type: 'alert',
    priority: 'high',
    icon: '⚡',
    title: 'Recovery needs attention',
    body: 'Your recovery dropped 12% this week. HRV has been trending lower since Wednesday — likely from the high-intensity session on Tuesday.',
    action: 'Adjust intensity',
    color: '#F59E0B',
  },
  {
    id: 2,
    type: 'insight',
    priority: 'medium',
    icon: '🧠',
    title: 'Sleep quality improving',
    body: 'Your deep sleep increased 18% over 7 days. Going to bed before 10:30 PM correlated with a 23% higher HRV the next morning.',
    action: 'View sleep trends',
    color: '#6366F1',
  },
  {
    id: 3,
    type: 'recommendation',
    priority: 'low',
    icon: '💧',
    title: 'Hydration lagging behind',
    body: 'You\'ve hit your 2L water target only 3 of the last 7 days. Dehydration is a key driver of afternoon energy dips.',
    action: 'Set reminder',
    color: '#06B6D4',
  },
  {
    id: 4,
    type: 'positive',
    priority: 'low',
    icon: '🏆',
    title: 'Resting HR at 3-month low',
    body: 'Your resting heart rate is at 54 bpm — the lowest in 3 months. This reflects strong cardiovascular adaptation.',
    action: 'See trend',
    color: '#10B981',
  },
];

export const habits = [
  { id: 1, name: 'Morning supplements', streak: 14, icon: '💊', color: '#8B5CF6', completedToday: true },
  { id: 2, name: 'Zone 2 cardio', streak: 5, icon: '🏃', color: '#6366F1', completedToday: false },
  { id: 3, name: '2L water', streak: 3, icon: '💧', color: '#06B6D4', completedToday: false },
  { id: 4, name: 'Meditation', streak: 21, icon: '🧘', color: '#10B981', completedToday: true },
  { id: 5, name: 'Sleep by 10:30', streak: 7, icon: '🌙', color: '#F59E0B', completedToday: false },
];

export const reports = [
  {
    id: 1,
    type: 'Diagnostic review',
    doctor: 'Dr. Steven Lu',
    name: 'Comprehensive Metabolic Panel',
    date: 'Apr 15, 2026',
    markers: [
      { name: 'Vitamin D', value: '28 ng/mL', status: 'fair' },
      { name: 'Cholesterol (Total)', value: '185 mg/dL', status: 'optimal' },
      { name: 'Glucose (Fasting)', value: '92 mg/dL', status: 'optimal' },
      { name: 'hsCRP', value: '0.8 mg/L', status: 'optimal' },
    ],
  },
  {
    id: 2,
    type: 'Diagnostic review',
    doctor: 'Dr. Steven Lu',
    name: 'Thyroid Function Test',
    date: 'Mar 28, 2026',
    markers: [
      { name: 'TSH', value: '2.1 mIU/L', status: 'optimal' },
      { name: 'Free T4', value: '1.3 ng/dL', status: 'optimal' },
    ],
  },
];

export const upcomingTests = [
  { name: 'Comprehensive Metabolic Panel', dueIn: '2 months' },
  { name: 'Lipid Panel', dueIn: '4 months' },
  { name: 'DEXA Scan', dueIn: '6 months' },
];

export const appointment = {
  type: 'Consultation',
  doctor: 'Dr. Sarah Chen',
  date: 'May 8, 2026',
  time: '2:00 PM',
};

export const devices = [
  { name: 'Apple Watch Series 9', type: 'wearable', connected: true, lastSync: '2 min ago', icon: '⌚' },
  { name: 'Oura Ring Gen 3', type: 'ring', connected: true, lastSync: '5 min ago', icon: '💍' },
  { name: 'Apple Health', type: 'app', connected: true, lastSync: 'Live', icon: '🍎' },
];

export const aiMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Good morning, Alex! Your recovery score is 78% today — slightly below your 7-day average of 83%. I noticed your HRV dropped to 68ms after Tuesday\'s high-intensity session.',
    time: '10:28 AM',
  },
  {
    id: 2,
    role: 'user',
    content: 'A bit tired. My recovery score was low this morning.',
    time: '10:32 AM',
  },
  {
    id: 3,
    role: 'assistant',
    content: 'That makes sense. Your HRV also dropped slightly — likely from the Zone 4 workout yesterday. I\'d recommend keeping today\'s activity to Zone 1-2 max. A 20-minute walk and some light stretching would be ideal. Want me to adjust today\'s plan?',
    time: '10:32 AM',
  },
];
