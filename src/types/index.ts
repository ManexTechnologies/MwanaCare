export type Tab = 'dashboard' | 'tracker' | 'vaccines' | 'tips' | 'profile';

export type Language = 'english' | 'shona' | 'ndebele';

export type UnitSystem = 'metric' | 'imperial';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof import('../theme/colors').COLORS | typeof import('../theme/colors').DARK_COLORS;
  isDark: boolean;
}

export interface HealthTip {
  id: string;
  title: string;
  body: string;
  icon: string;
  color: string;
}

export interface Vaccine {
  id: string;
  name: string;
  age: string;
  status: 'done' | 'pending' | 'upcoming';
  description: string;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  vaccineReminders: boolean;
  weeklyTips: boolean;
  soundEnabled: boolean;
}

export interface AppPreferences {
  darkMode: boolean;
  unitSystem: UnitSystem;
  dataSaver: boolean;
}

export interface SettingsState {
  notifications: NotificationSettings;
  language: Language;
  preferences: AppPreferences;
}

// Auth
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed server-side
  babyName?: string;
  dueDate?: string; // ISO date string
  createdAt: string;
}

export interface AuthState {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
}

// Growth Measurements
export interface GrowthMeasurement {
  id: string;
  date: string; // ISO date string
  weight: number; // kg
  height: number; // cm
  headCircumference?: number; // cm
  notes?: string;
}

// Vaccine Status Map (id -> status)
export type VaccineStatusMap = Record<string, 'done' | 'pending' | 'upcoming'>;

// Dashboard Data
export interface DashboardData {
  currentWeek: number;
  babyWeight: string;
  babyHeight: string;
}

