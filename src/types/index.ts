export type Tab = 'dashboard' | 'tracker' | 'vaccines' | 'tips' | 'profile';

export type Language = 'english' | 'shona' | 'ndebele';

export type UnitSystem = 'metric' | 'imperial';

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

