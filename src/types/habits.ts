export interface ActiveHabit {
  id: string;
  icon: string;
  title: string;
  color: string;
  bg: string;
  streak: number;
  doneToday: boolean;
}

export const defaultActiveHabits: ActiveHabit[] = [
  { id: 'sleep',   icon: '🌙', title: 'Sleep by 10:30 PM', color: '#BF5AF2', bg: 'rgba(191,90,242,0.12)', streak: 14, doneToday: false },
  { id: 'greens',  icon: '🥦', title: 'Eat More Greens',   color: '#30D158', bg: 'rgba(48,209,88,0.12)',  streak: 3,  doneToday: false },
  { id: 'stress',  icon: '🧘', title: 'Daily Mindfulness', color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)', streak: 5,  doneToday: false },
];
