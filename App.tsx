import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ---------- Design System ----------
const COLORS = {
  primary: '#0D9488',
  primaryDark: '#0F766E',
  primaryLight: '#14B8A6',
  primaryBg: '#F0FDFA',
  secondary: '#6366F1',
  secondaryLight: '#818CF8',
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  rose: '#F43F5E',
  roseLight: '#FB7185',
  indigo: '#6366F1',
  teal: '#0D9488',
  white: '#FFFFFF',
  black: '#1F2937',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

// ---------- Types ----------
type Tab = 'dashboard' | 'tracker' | 'vaccines' | 'tips' | 'profile';

type Language = 'english' | 'shona' | 'ndebele';
type UnitSystem = 'metric' | 'imperial';

interface HealthTip {
  id: string;
  title: string;
  body: string;
  icon: string;
  color: string;
}

interface Vaccine {
  id: string;
  name: string;
  age: string;
  status: 'done' | 'pending' | 'upcoming';
  description: string;
}

interface NotificationSettings {
  pushNotifications: boolean;
  vaccineReminders: boolean;
  weeklyTips: boolean;
  soundEnabled: boolean;
}

interface AppPreferences {
  darkMode: boolean;
  unitSystem: UnitSystem;
  dataSaver: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  language: Language;
  preferences: AppPreferences;
}

// ---------- Reusable Boxed Icon Component ----------
interface BoxIconProps {
  icon: string;
  iconFamily?: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather' | 'MaterialIcons';
  size?: number;
  color?: string;
  bgColor?: string;
  containerSize?: number;
  rounded?: boolean;
}

function BoxIcon({
  icon,
  iconFamily = 'MaterialCommunityIcons',
  size = 22,
  color = COLORS.white,
  bgColor = COLORS.primary,
  containerSize = 44,
  rounded = false,
}: BoxIconProps) {
  const IconComponent =
    iconFamily === 'Ionicons'
      ? Ionicons
      : iconFamily === 'Feather'
      ? Feather
      : iconFamily === 'MaterialIcons'
      ? MaterialIcons
      : MaterialCommunityIcons;

  return (
    <View
      style={[
        styles.boxIconContainer,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: rounded ? containerSize / 2 : 12,
          backgroundColor: bgColor,
        },
        SHADOWS.sm,
      ]}
    >
      <IconComponent name={icon as any} size={size} color={color} />
    </View>
  );
}

// ---------- Toggle Switch Component ----------
interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ value, onValueChange, disabled = false }: ToggleSwitchProps) {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const trackColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.gray300, COLORS.primary],
  });

  const thumbTranslate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: trackColor,
          justifyContent: 'center',
          paddingHorizontal: 3,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLORS.white,
            transform: [{ translateX: thumbTranslate }],
            ...SHADOWS.sm,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ---------- Settings Modal Component ----------
interface SettingsModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function SettingsModal({ visible, title, onClose, children }: SettingsModalProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.modalSheet,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.modalHandleRow}>
          <View style={styles.modalHandle} />
        </View>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <Feather name="x" size={20} color={COLORS.gray500} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalBody}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ---------- Language Data ----------
const LANGUAGES: { key: Language; label: string; native: string; flag: string }[] = [
  { key: 'english', label: 'English', native: 'English', flag: '🇬🇧' },
  { key: 'shona', label: 'Shona', native: 'chiShona', flag: '🇿🇼' },
  { key: 'ndebele', label: 'Ndebele', native: 'isiNdebele', flag: '🇿🇼' },
];

// ---------- FAQ Data ----------
const FAQ_ITEMS = [
  {
    question: 'How do I track my baby\'s growth?',
    answer: 'Go to the Growth tab and tap "Add Measurement" to record your baby\'s weight, height, and head circumference. Charts will automatically update to show progress over time.',
  },
  {
    question: 'How are vaccine reminders set?',
    answer: 'Navigate to Settings > Notifications and enable "Vaccine Reminders". You\'ll receive alerts before each scheduled immunization based on your baby\'s age.',
  },
  {
    question: 'Can I share my child\'s health data?',
    answer: 'Yes! Use the "Export Data" option in Settings to generate a PDF or CSV report. You can then share it with your healthcare provider via your preferred messaging app.',
  },
  {
    question: 'How do I change the app language?',
    answer: 'Go to Settings > Language and select your preferred language. The app currently supports English, Shona, and Ndebele.',
  },
];

// ---------- Data ----------
const HEALTH_TIPS: HealthTip[] = [
  {
    id: '1',
    title: 'Breastfeeding Benefits',
    body: 'Breast milk provides optimal nutrition for your baby. Exclusive breastfeeding is recommended for the first 6 months.',
    icon: 'human-mother-female',
    color: '#EC4899',
  },
  {
    id: '2',
    title: 'Safe Sleep Practices',
    body: 'Place your baby on their back to sleep. Use a firm mattress and keep soft objects out of the crib.',
    icon: 'sleep',
    color: '#6366F1',
  },
  {
    id: '3',
    title: 'Immunization Schedule',
    body: 'Follow your country\'s immunization schedule closely. Vaccines protect your child from preventable diseases.',
    icon: 'needle',
    color: '#0D9488',
  },
  {
    id: '4',
    title: 'Nutrition for Mom',
    body: 'A balanced diet rich in iron, calcium, and folic acid supports both mother and baby during pregnancy.',
    icon: 'food-apple',
    color: '#F59E0B',
  },
  {
    id: '5',
    title: 'Developmental Milestones',
    body: 'Track your child\'s growth - rolling over, sitting, crawling, and walking are key milestones in the first year.',
    icon: 'baby-face',
    color: '#3B82F6',
  },
  {
    id: '6',
    title: 'Postnatal Care',
    body: 'Regular check-ups after birth are crucial for both mother and baby. Don\'t miss the 6-week postnatal visit.',
    icon: 'hospital-building',
    color: '#EF4444',
  },
];

const VACCINES: Vaccine[] = [
  {
    id: 'bcg',
    name: 'BCG',
    age: 'At Birth',
    status: 'pending',
    description: 'Protects against Tuberculosis',
  },
  {
    id: 'polio1',
    name: 'Polio (OPV-0)',
    age: 'At Birth',
    status: 'pending',
    description: 'Oral Polio Vaccine - dose 0',
  },
  {
    id: 'hepb1',
    name: 'Hep B (Birth dose)',
    age: 'At Birth',
    status: 'pending',
    description: 'Hepatitis B vaccine - first dose',
  },
  {
    id: 'penta1',
    name: 'Penta / DTP-HepB-Hib 1',
    age: '6 Weeks',
    status: 'upcoming',
    description: 'Protects against 5 diseases',
  },
  {
    id: 'polio2',
    name: 'Polio (OPV-1)',
    age: '6 Weeks',
    status: 'upcoming',
    description: 'Oral Polio Vaccine - dose 1',
  },
  {
    id: 'pcv1',
    name: 'PCV 1',
    age: '6 Weeks',
    status: 'upcoming',
    description: 'Pneumococcal Conjugate Vaccine',
  },
  {
    id: 'rota1',
    name: 'Rota 1',
    age: '6 Weeks',
    status: 'upcoming',
    description: 'Rotavirus vaccine - dose 1',
  },
  {
    id: 'penta2',
    name: 'Penta / DTP-HepB-Hib 2',
    age: '10 Weeks',
    status: 'upcoming',
    description: 'Protects against 5 diseases',
  },
  {
    id: 'pcv2',
    name: 'PCV 2',
    age: '10 Weeks',
    status: 'upcoming',
    description: 'Pneumococcal Conjugate Vaccine',
  },
  {
    id: 'polio3',
    name: 'Polio (OPV-2)',
    age: '10 Weeks',
    status: 'upcoming',
    description: 'Oral Polio Vaccine - dose 2',
  },
  {
    id: 'rota2',
    name: 'Rota 2',
    age: '10 Weeks',
    status: 'upcoming',
    description: 'Rotavirus vaccine - dose 2',
  },
  {
    id: 'penta3',
    name: 'Penta / DTP-HepB-Hib 3',
    age: '14 Weeks',
    status: 'upcoming',
    description: 'Protects against 5 diseases',
  },
  {
    id: 'pcv3',
    name: 'PCV 3',
    age: '14 Weeks',
    status: 'upcoming',
    description: 'Pneumococcal Conjugate Vaccine',
  },
  {
    id: 'polio4',
    name: 'Polio (OPV-3)',
    age: '14 Weeks',
    status: 'upcoming',
    description: 'Oral Polio Vaccine - dose 3',
  },
  {
    id: 'rota3',
    name: 'Rota 3',
    age: '14 Weeks',
    status: 'upcoming',
    description: 'Rotavirus vaccine - dose 3',
  },
  {
    id: 'ipv',
    name: 'IPV (Inactivated Polio)',
    age: '14 Weeks',
    status: 'upcoming',
    description: 'Inactivated Polio Vaccine',
  },
  {
    id: 'measles1',
    name: 'Measles / MR 1',
    age: '9 Months',
    status: 'upcoming',
    description: 'Measles & Rubella Vaccine - dose 1',
  },
  {
    id: 'yellowfever',
    name: 'Yellow Fever',
    age: '9 Months',
    status: 'upcoming',
    description: 'Yellow Fever Vaccine',
  },
  {
    id: 'measles2',
    name: 'Measles / MR 2',
    age: '18 Months',
    status: 'upcoming',
    description: 'Measles & Rubella Vaccine - booster',
  },
];

// ---------- Components ----------

function AnimatedCard({ children, delay = 0, style }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

function TabBar({ active, onTabChange }: { active: Tab; onTabChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: string; family?: string; activeColor: string }[] = [
    { key: 'dashboard', label: 'Home', icon: 'home', family: 'Ionicons', activeColor: COLORS.primary },
    { key: 'vaccines', label: 'Vaccines', icon: 'needle', activeColor: COLORS.secondary },
    { key: 'tracker', label: 'Growth', icon: 'chart-line', family: 'MaterialCommunityIcons', activeColor: COLORS.accent },
    { key: 'tips', label: 'Tips', icon: 'lightbulb-outline', family: 'MaterialCommunityIcons', activeColor: COLORS.rose },
    { key: 'profile', label: 'Profile', icon: 'account-circle', family: 'MaterialCommunityIcons', activeColor: COLORS.indigo },
  ];

  return (
    <View style={styles.tabBar}>
      <View style={styles.tabBarInner}>
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const IconComponent =
            tab.family === 'Ionicons'
              ? Ionicons
              : tab.family === 'Feather'
              ? Feather
              : MaterialCommunityIcons;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.tabIconBox,
                  {
                    backgroundColor: isActive ? tab.activeColor + '15' : 'transparent',
                  },
                ]}
              >
                <IconComponent
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? tab.activeColor : COLORS.gray400}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? tab.activeColor : COLORS.gray400 },
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View
                  style={[styles.tabIndicator, { backgroundColor: tab.activeColor }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function StatCard({
  title,
  value,
  unit,
  color,
  icon,
  iconFamily = 'MaterialCommunityIcons',
}: {
  title: string;
  value: string;
  unit: string;
  color: string;
  icon: string;
  iconFamily?: string;
}) {
  const IconComponent =
    iconFamily === 'Ionicons'
      ? Ionicons
      : iconFamily === 'Feather'
      ? Feather
      : MaterialCommunityIcons;

  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
          <IconComponent name={icon as any} size={18} color={color} />
        </View>
      </View>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}> {unit}</Text>
      </Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function Dashboard() {
  const [currentWeek] = useState(32);
  const [babyWeight] = useState('3.2');
  const [babyHeight] = useState('49.5');

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <AnimatedCard delay={0}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroPattern}>
            <View style={[styles.heroCircle, styles.heroCircle1]} />
            <View style={[styles.heroCircle, styles.heroCircle2]} />
            <View style={[styles.heroCircle, styles.heroCircle3]} />
          </View>
          <BoxIcon
            icon="heart-pulse"
            size={28}
            color={COLORS.white}
            bgColor="rgba(255,255,255,0.2)"
            containerSize={52}
          />
          <Text style={styles.heroTitle}>Welcome to MwanaCare</Text>
          <Text style={styles.heroSubtitle}>
            Your companion for maternal and child health
          </Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>View Dashboard</Text>
            <Feather name="arrow-right" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </LinearGradient>
      </AnimatedCard>

      {/* Quick Stats */}
      <AnimatedCard delay={100}>
        <Text style={styles.sectionTitle}>Health Overview</Text>
      </AnimatedCard>
      <View style={styles.statsRow}>
        <AnimatedCard delay={150} style={{ flex: 1 }}>
          <StatCard
            title="Baby's Weight"
            value={babyWeight}
            unit="kg"
            color={COLORS.primary}
            icon="baby"
          />
        </AnimatedCard>
        <AnimatedCard delay={200} style={{ flex: 1 }}>
          <StatCard
            title="Baby's Height"
            value={babyHeight}
            unit="cm"
            color={COLORS.secondary}
            icon="human-male-height"
          />
        </AnimatedCard>
      </View>
      <View style={styles.statsRow}>
        <AnimatedCard delay={250} style={{ flex: 1 }}>
          <StatCard
            title="Pregnancy Week"
            value={`${currentWeek}`}
            unit="weeks"
            color={COLORS.accent}
            icon="calendar-clock"
          />
        </AnimatedCard>
        <AnimatedCard delay={300} style={{ flex: 1 }}>
          <StatCard
            title="Next Vaccine"
            value="In 2w"
            unit=""
            color={COLORS.rose}
            icon="needle"
          />
        </AnimatedCard>
      </View>

      {/* Health Tip Spotlight */}
      <AnimatedCard delay={350}>
        <Text style={styles.sectionTitle}>Health Tip of the Day</Text>
        <LinearGradient
          colors={['#FFFBEB', '#FFF7ED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipCard}
        >
          <View style={styles.tipCardRow}>
            <BoxIcon
              icon="lightbulb-outline"
              size={24}
              color={COLORS.accent}
              bgColor={COLORS.accent + '20'}
              containerSize={48}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipBody}>
                Drink at least 8-10 glasses of water daily during pregnancy.
                Proper hydration supports healthy amniotic fluid levels.
              </Text>
            </View>
          </View>
        </LinearGradient>
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard delay={400}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </AnimatedCard>
      <View style={styles.quickActionsRow}>
        <AnimatedCard delay={420} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.quickAction}>
            <BoxIcon
              icon="bell-ring-outline"
              size={22}
              color={COLORS.secondary}
              bgColor={COLORS.secondary + '15'}
              containerSize={46}
            />
            <Text style={styles.quickActionLabel}>Set Reminder</Text>
          </TouchableOpacity>
        </AnimatedCard>
        <AnimatedCard delay={450} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.quickAction}>
            <BoxIcon
              icon="phone-in-talk-outline"
              size={22}
              color={COLORS.primary}
              bgColor={COLORS.primary + '15'}
              containerSize={46}
            />
            <Text style={styles.quickActionLabel}>Contact Clinic</Text>
          </TouchableOpacity>
        </AnimatedCard>
        <AnimatedCard delay={480} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.quickAction}>
            <BoxIcon
              icon="stethoscope"
              size={22}
              color={COLORS.rose}
              bgColor={COLORS.rose + '15'}
              containerSize={46}
            />
            <Text style={styles.quickActionLabel}>Symptoms</Text>
          </TouchableOpacity>
        </AnimatedCard>
        <AnimatedCard delay={510} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.quickAction}>
            <BoxIcon
              icon="map-marker-outline"
              size={22}
              color={COLORS.accent}
              bgColor={COLORS.accent + '15'}
              containerSize={46}
            />
            <Text style={styles.quickActionLabel}>Nearby Clinic</Text>
          </TouchableOpacity>
        </AnimatedCard>
      </View>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function VaccineTracker() {
  const vaccinesByAge: Record<string, Vaccine[]> = {};
  VACCINES.forEach((v) => {
    if (!vaccinesByAge[v.age]) vaccinesByAge[v.age] = [];
    vaccinesByAge[v.age].push(v);
  });

  const ageOrder = ['At Birth', '6 Weeks', '10 Weeks', '14 Weeks', '9 Months', '18 Months'];

  const toggleVaccineStatus = (id: string) => {
    // In a real app, this would update state/async storage
  };

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderRow}>
            <BoxIcon
              icon="shield-check-outline"
              size={22}
              color={COLORS.primary}
              bgColor={COLORS.primary + '15'}
              containerSize={40}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.sectionTitle}>Immunization Schedule</Text>
              <Text style={styles.sectionSubtitle}>Tap to mark as completed</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {ageOrder.map((age, ageIdx) => {
        const ageVaccines = vaccinesByAge[age] || [];
        if (ageVaccines.length === 0) return null;
        const done = ageVaccines.filter((v) => v.status === 'done').length;
        const total = ageVaccines.length;

        return (
          <AnimatedCard key={age} delay={100 + ageIdx * 80}>
            <View style={styles.ageGroup}>
              <View style={styles.ageGroupHeader}>
                <MaterialCommunityIcons
                  name={
                    age === 'At Birth'
                      ? 'baby'
                      : age === '6 Weeks'
                      ? 'calendar-star'
                      : age === '10 Weeks'
                      ? 'calendar-clock'
                      : age === '14 Weeks'
                      ? 'calendar-check'
                      : age === '9 Months'
                      ? 'calendar-month'
                      : 'calendar-end'
                  }
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.ageGroupTitle}>{age}</Text>
                <View style={styles.ageProgress}>
                  <View
                    style={[
                      styles.ageProgressFill,
                      { width: `${(done / total) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.ageProgressText}>
                  {done}/{total}
                </Text>
              </View>
              {ageVaccines.map((vaccine, vIdx) => (
                <TouchableOpacity
                  key={vaccine.id}
                  style={[
                    styles.vaccineItem,
                    vaccine.status === 'done' && styles.vaccineItemDone,
                  ]}
                  onPress={() => toggleVaccineStatus(vaccine.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.vaccineLeft}>
                    <View
                      style={[
                        styles.vaccineStatusBox,
                        vaccine.status === 'done'
                          ? styles.vaccineStatusDone
                          : vaccine.status === 'upcoming'
                          ? styles.vaccineStatusUpcoming
                          : styles.vaccineStatusPending,
                      ]}
                    >
                      {vaccine.status === 'done' ? (
                        <MaterialIcons
                          name="check-circle"
                          size={22}
                          color={COLORS.white}
                        />
                      ) : vaccine.status === 'upcoming' ? (
                        <MaterialIcons
                          name="schedule"
                          size={20}
                          color={COLORS.accent}
                        />
                      ) : (
                        <MaterialIcons
                          name="radio-button-unchecked"
                          size={20}
                          color={COLORS.rose}
                        />
                      )}
                    </View>
                    <View style={styles.vaccineInfo}>
                      <Text style={styles.vaccineName}>{vaccine.name}</Text>
                      <Text style={styles.vaccineDesc}>{vaccine.description}</Text>
                    </View>
                  </View>
                  <View style={styles.vaccineAgeBadge}>
                    <Text style={styles.vaccineAgeText}>{vaccine.age}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedCard>
        );
      })}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function GrowthTracker() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderRow}>
            <BoxIcon
              icon="chart-timeline-variant"
              size={22}
              color={COLORS.accent}
              bgColor={COLORS.accent + '15'}
              containerSize={40}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.sectionTitle}>Growth Tracker</Text>
              <Text style={styles.sectionSubtitle}>Monitor your child's development</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <LinearGradient
          colors={['#FEF3C7', '#FFFBEB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.growthPlaceholder}
        >
          <BoxIcon
            icon="chart-line"
            size={32}
            color={COLORS.accent}
            bgColor={COLORS.accent + '20'}
            containerSize={64}
          />
          <Text style={styles.growthPlaceholderTitle}>Track Growth Over Time</Text>
          <Text style={styles.growthPlaceholderText}>
            Record your baby's weight, height, and head circumference at each check-up.
            Visual charts will appear once you add measurements.
          </Text>
          <TouchableOpacity style={styles.growthButton}>
            <Feather name="plus" size={18} color={COLORS.white} />
            <Text style={styles.growthButtonText}> Add Measurement</Text>
          </TouchableOpacity>
        </LinearGradient>
      </AnimatedCard>

      {/* Milestone Checklist */}
      <AnimatedCard delay={150}>
        <Text style={styles.sectionTitle}>Milestone Checklist</Text>
      </AnimatedCard>
      {[
        { age: '1 Month', icon: 'baby', milestones: ['Lifts head briefly', 'Responds to sounds', 'Focuses on faces'] },
        { age: '3 Months', icon: 'baby-face-outline', milestones: ['Holds head steady', 'Follows objects with eyes', 'Coos and makes sounds'] },
        { age: '6 Months', icon: 'baby-face', milestones: ['Rolls over both ways', 'Sits with support', 'Responds to name'] },
        { age: '9 Months', icon: 'human-child', milestones: ['Sits without support', 'Crawls', 'Babbles'] },
        { age: '12 Months', icon: 'human-male-child', milestones: ['Stands with support', 'Says "mama"/"dada"', 'Picks up small objects'] },
      ].map((stage, idx) => (
        <AnimatedCard key={stage.age} delay={200 + idx * 60}>
          <LinearGradient
            colors={[COLORS.white, COLORS.gray50]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.milestoneCard}
          >
            <View style={styles.milestoneHeader}>
              <BoxIcon
                icon={stage.icon as any}
                size={18}
                color={COLORS.primary}
                bgColor={COLORS.primary + '12'}
                containerSize={34}
                rounded
              />
              <Text style={styles.milestoneAge}>{stage.age}</Text>
            </View>
            {stage.milestones.map((m, i) => (
              <View key={i} style={styles.milestoneRow}>
                <View style={styles.checkbox}>
                  <Feather name="circle" size={16} color={COLORS.gray300} />
                </View>
                <Text style={styles.milestoneText}>{m}</Text>
              </View>
            ))}
          </LinearGradient>
        </AnimatedCard>
      ))}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function HealthTips() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderRow}>
            <BoxIcon
              icon="lightbulb-outline"
              size={22}
              color={COLORS.rose}
              bgColor={COLORS.rose + '15'}
              containerSize={40}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.sectionTitle}>Health Tips</Text>
              <Text style={styles.sectionSubtitle}>Evidence-based advice for you and your baby</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {HEALTH_TIPS.map((tip, idx) => (
        <AnimatedCard key={tip.id} delay={80 + idx * 50}>
          <LinearGradient
            colors={[COLORS.white, COLORS.gray50]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.tipCardFull}
          >
            <View style={styles.tipCardFullRow}>
              <BoxIcon
                icon={tip.icon}
                size={24}
                color={tip.color}
                bgColor={tip.color + '15'}
                containerSize={50}
              />
              <View style={styles.tipCardFullContent}>
                <Text style={styles.tipCardFullTitle}>{tip.title}</Text>
                <Text style={styles.tipCardFullBody}>{tip.body}</Text>
              </View>
            </View>
          </LinearGradient>
        </AnimatedCard>
      ))}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function Profile() {
  // Settings state
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      pushNotifications: true,
      vaccineReminders: true,
      weeklyTips: false,
      soundEnabled: true,
    },
    language: 'english',
    preferences: {
      darkMode: false,
      unitSystem: 'metric',
      dataSaver: false,
    },
  });

  // Modal state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updateLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const updatePreferences = (key: keyof AppPreferences, value: boolean | UnitSystem) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const currentLang = LANGUAGES.find((l) => l.key === settings.language);

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderRow}>
            <BoxIcon
              icon="account-circle"
              size={22}
              color={COLORS.indigo}
              bgColor={COLORS.indigo + '15'}
              containerSize={40}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.sectionSubtitle}>Manage your information</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <LinearGradient
          colors={['#EEF2FF', '#E0E7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileAvatarOuter}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileAvatar}
            >
              <Text style={styles.profileAvatarText}>M</Text>
            </LinearGradient>
            <View style={styles.profileBadge}>
              <MaterialIcons name="verified" size={16} color={COLORS.info} />
            </View>
          </View>
          <Text style={styles.profileName}>Mother's Profile</Text>
          <View style={styles.profileDetailRow}>
            <MaterialIcons name="calendar-today" size={14} color={COLORS.gray500} />
            <Text style={styles.profileDetail}> Due date or child's DOB: Not set</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={14} color={COLORS.primary} />
            <Text style={styles.editButtonText}> Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
      </AnimatedCard>

      <AnimatedCard delay={150}>
        <Text style={styles.sectionTitle}>Settings</Text>
      </AnimatedCard>
      <AnimatedCard delay={180}>
        <View style={styles.settingsSection}>
          {/* Notifications */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setActiveModal('notifications')}
          >
            <BoxIcon
              icon="bell-outline"
              size={18}
              color={COLORS.primary}
              bgColor={COLORS.primary + '12'}
              containerSize={34}
            />
            <Text style={styles.settingText}>Notifications</Text>
            <View style={styles.settingValueBadge}>
              <Text style={styles.settingValueText}>
                {settings.notifications.pushNotifications ? 'On' : 'Off'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.gray300} />
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setActiveModal('language')}
          >
            <BoxIcon
              icon="earth"
              size={18}
              color={COLORS.secondary}
              bgColor={COLORS.secondary + '12'}
              containerSize={34}
            />
            <Text style={styles.settingText}>Language</Text>
            <View style={styles.settingValueBadge}>
              <Text style={styles.settingValueText}>
                {currentLang?.label || 'English'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.gray300} />
          </TouchableOpacity>

          {/* App Preferences */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setActiveModal('preferences')}
          >
            <BoxIcon
              icon="tune"
              size={18}
              color={COLORS.teal}
              bgColor={COLORS.teal + '12'}
              containerSize={34}
            />
            <Text style={styles.settingText}>App Preferences</Text>
            <Feather name="chevron-right" size={20} color={COLORS.gray300} />
          </TouchableOpacity>

          {/* Export Data */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setActiveModal('export')}
          >
            <BoxIcon
              icon="file-export-outline"
              size={18}
              color={COLORS.accent}
              bgColor={COLORS.accent + '12'}
              containerSize={34}
            />
            <Text style={styles.settingText}>Export Data</Text>
            <Feather name="chevron-right" size={20} color={COLORS.gray300} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setActiveModal('help')}
          >
            <BoxIcon
              icon="help-circle-outline"
              size={18}
              color={COLORS.rose}
              bgColor={COLORS.rose + '12'}
              containerSize={34}
            />
            <Text style={styles.settingText}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color={COLORS.gray300} />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
            onPress={() => setActiveModal('about')}
          >
            <BoxIcon
              icon="information-outline"
              size={18}
              color={COLORS.gray600}
              bgColor={COLORS.gray100}
              containerSize={34}
            />
            <Text style={styles.settingText}>About</Text>
            <Feather name="chevron-right" size={20} color={COLORS.gray300} />
          </TouchableOpacity>
        </View>
      </AnimatedCard>

      {/* ---- Notifications Modal ---- */}
      <SettingsModal
        visible={activeModal === 'notifications'}
        title="Notifications"
        onClose={() => setActiveModal(null)}
      >
        <View style={styles.settingsModalItem}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="notifications-active" size={20} color={COLORS.primary} />
            <View>
              <Text style={styles.settingsModalItemText}>Push Notifications</Text>
              <Text style={styles.settingsModalItemDesc}>Receive alerts and reminders</Text>
            </View>
          </View>
          <ToggleSwitch
            value={settings.notifications.pushNotifications}
            onValueChange={(v) => updateNotifications('pushNotifications', v)}
          />
        </View>
        <View style={styles.settingsModalItem}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="vaccines" size={20} color={COLORS.secondary} />
            <View>
              <Text style={styles.settingsModalItemText}>Vaccine Reminders</Text>
              <Text style={styles.settingsModalItemDesc}>Get notified before vaccinations</Text>
            </View>
          </View>
          <ToggleSwitch
            value={settings.notifications.vaccineReminders}
            onValueChange={(v) => updateNotifications('vaccineReminders', v)}
            disabled={!settings.notifications.pushNotifications}
          />
        </View>
        <View style={styles.settingsModalItem}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="lightbulb-outline" size={20} color={COLORS.accent} />
            <View>
              <Text style={styles.settingsModalItemText}>Weekly Tips</Text>
              <Text style={styles.settingsModalItemDesc}>Receive health tips every week</Text>
            </View>
          </View>
          <ToggleSwitch
            value={settings.notifications.weeklyTips}
            onValueChange={(v) => updateNotifications('weeklyTips', v)}
            disabled={!settings.notifications.pushNotifications}
          />
        </View>
        <View style={[styles.settingsModalItem, { borderBottomWidth: 0 }]}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="volume-up" size={20} color={COLORS.info} />
            <View>
              <Text style={styles.settingsModalItemText}>Sound</Text>
              <Text style={styles.settingsModalItemDesc}>Play sound for notifications</Text>
            </View>
          </View>
          <ToggleSwitch
            value={settings.notifications.soundEnabled}
            onValueChange={(v) => updateNotifications('soundEnabled', v)}
            disabled={!settings.notifications.pushNotifications}
          />
        </View>
      </SettingsModal>

      {/* ---- Language Modal ---- */}
      <SettingsModal
        visible={activeModal === 'language'}
        title="Select Language"
        onClose={() => setActiveModal(null)}
      >
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.key}
            style={styles.radioOption}
            onPress={() => updateLanguage(lang.key)}
            activeOpacity={0.7}
          >
            <View style={styles.radioOptionLeft}>
              <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
              <View>
                <Text style={styles.radioLabel}>{lang.label}</Text>
                <Text style={styles.radioNative}>{lang.native}</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                settings.language === lang.key && styles.radioOuterSelected,
              ]}
            >
              {settings.language === lang.key && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </SettingsModal>

      {/* ---- App Preferences Modal ---- */}
      <SettingsModal
        visible={activeModal === 'preferences'}
        title="App Preferences"
        onClose={() => setActiveModal(null)}
      >
        <View style={styles.settingsModalItem}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="dark-mode" size={20} color={COLORS.indigo} />
            <View>
              <Text style={styles.settingsModalItemText}>Dark Mode</Text>
              <Text style={styles.settingsModalItemDesc}>Use dark theme throughout the app</Text>
            </View>
          </View>
          <ToggleSwitch
            value={settings.preferences.darkMode}
            onValueChange={(v) => updatePreferences('darkMode', v)}
          />
        </View>
        <View style={styles.settingsModalItem}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="straighten" size={20} color={COLORS.primary} />
            <View>
              <Text style={styles.settingsModalItemText}>Unit System</Text>
              <Text style={styles.settingsModalItemDesc}>
                {settings.preferences.unitSystem === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, in)'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[
                styles.unitToggle,
                settings.preferences.unitSystem === 'metric' && styles.unitToggleActive,
              ]}
              onPress={() => updatePreferences('unitSystem', 'metric')}
            >
              <Text
                style={[
                  styles.unitToggleText,
                  settings.preferences.unitSystem === 'metric' && styles.unitToggleTextActive,
                ]}
              >
                Metric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitToggle,
                settings.preferences.unitSystem === 'imperial' && styles.unitToggleActive,
              ]}
              onPress={() => updatePreferences('unitSystem', 'imperial')}
            >
              <Text
                style={[
                  styles.unitToggleText,
                  settings.preferences.unitSystem === 'imperial' && styles.unitToggleTextActive,
                ]}
              >
                Imperial
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.settingsModalItem, { borderBottomWidth: 0 }]}>
          <View style={styles.settingsModalItemLabel}>
            <MaterialIcons name="savings" size={20} color={COLORS.success} />
            <View>
              <Text style={styles.settingsModalItemText}>Data Saver</Text>
              <Text style={styles.settingsModalItemDesc}>Reduce image quality to save data</Text>
            </View>
          </View>
          <ToggleSwitch
            value={settings.preferences.dataSaver}
            onValueChange={(v) => updatePreferences('dataSaver', v)}
          />
        </View>
      </SettingsModal>

      {/* ---- Export Data Modal ---- */}
      <SettingsModal
        visible={activeModal === 'export'}
        title="Export Data"
        onClose={() => setActiveModal(null)}
      >
        <TouchableOpacity style={styles.exportOption}>
          <BoxIcon
            icon="file-pdf-box"
            size={18}
            color={COLORS.error}
            bgColor={COLORS.error + '12'}
            containerSize={34}
          />
          <View>
            <Text style={styles.exportOptionText}>Export as PDF</Text>
            <Text style={styles.exportOptionDesc}>Comprehensive health report document</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportOption}>
          <BoxIcon
            icon="file-delimited-outline"
            size={18}
            color={COLORS.success}
            bgColor={COLORS.success + '12'}
            containerSize={34}
          />
          <View>
            <Text style={styles.exportOptionText}>Export as CSV</Text>
            <Text style={styles.exportOptionDesc}>Spreadsheet-compatible data file</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportOption, { borderBottomWidth: 0 }]}>
          <BoxIcon
            icon="share-variant-outline"
            size={18}
            color={COLORS.primary}
            bgColor={COLORS.primary + '12'}
            containerSize={34}
          />
          <View>
            <Text style={styles.exportOptionText}>Share Report</Text>
            <Text style={styles.exportOptionDesc}>Share with your healthcare provider</Text>
          </View>
        </TouchableOpacity>
      </SettingsModal>

      {/* ---- Help & Support Modal ---- */}
      <SettingsModal
        visible={activeModal === 'help'}
        title="Help & Support"
        onClose={() => setActiveModal(null)}
      >
        <View style={styles.contactCard}>
          <MaterialIcons name="support-agent" size={28} color={COLORS.primary} style={{ marginBottom: 8 }} />
          <Text style={styles.contactCardText}>
            Need help using MwanaCare? Our support team is here to assist you with any questions or concerns. We typically respond within 24 hours.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <MaterialIcons name="mail-outline" size={18} color={COLORS.white} />
            <Text style={styles.contactButtonText}>  Contact Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>
          Frequently Asked Questions
        </Text>
        {FAQ_ITEMS.map((faq, idx) => {
          const isExpanded = expandedFaq === faq.question;
          return (
            <View key={idx} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => setExpandedFaq(isExpanded ? null : faq.question)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <MaterialIcons
                  name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={20}
                  color={COLORS.gray500}
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </SettingsModal>

      {/* ---- About Modal ---- */}
      <SettingsModal
        visible={activeModal === 'about'}
        title="About"
        onClose={() => setActiveModal(null)}
      >
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              ...SHADOWS.md,
            }}
          >
            <MaterialCommunityIcons name="heart-pulse" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.gray800 }}>
            MwanaCare
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.gray500, marginTop: 2 }}>
            Maternal & Child Health Companion
          </Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Build</Text>
          <Text style={styles.aboutValue}>2025.1</Text>
        </View>

        <TouchableOpacity style={styles.aboutLink}>
          <Text style={styles.aboutLinkText}>Open Source Licenses</Text>
          <MaterialIcons name="open-in-new" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.aboutLink, { borderBottomWidth: 0 }]}>
          <Text style={styles.aboutLinkText}>Privacy Policy</Text>
          <MaterialIcons name="open-in-new" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </SettingsModal>

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

// ---------- Main App ----------
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vaccines':
        return <VaccineTracker />;
      case 'tracker':
        return <GrowthTracker />;
      case 'tips':
        return <HealthTips />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>MwanaCare</Text>
            <Text style={styles.headerSub}>Maternal & Child Health</Text>
          </View>
          <BoxIcon
            icon="heart-pulse"
            size={24}
            color={COLORS.white}
            bgColor="rgba(255,255,255,0.2)"
            containerSize={42}
          />
        </View>
      </LinearGradient>
      <View style={styles.container}>
        {renderScreen()}
      </View>
      <TabBar active={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 13,
    color: '#CCFBF1',
    marginTop: 2,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Box Icon Container
  boxIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab Bar
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingBottom: 20,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  tabIndicator: {
    width: 16,
    height: 3,
    borderRadius: 1.5,
    marginTop: 3,
  },

  // Hero
  heroCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
    backgroundColor: COLORS.white,
  },
  heroCircle1: {
    width: 120,
    height: 120,
    top: -30,
    right: -20,
  },
  heroCircle2: {
    width: 80,
    height: 80,
    bottom: -10,
    right: 40,
  },
  heroCircle3: {
    width: 50,
    height: 50,
    top: 30,
    left: -10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 12,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#CCFBF1',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    gap: 8,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.gray500,
    marginTop: -8,
    marginBottom: 12,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    ...SHADOWS.md,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray800,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.gray500,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 2,
    fontWeight: '500',
  },

  // Tip Card
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.md,
  },
  tipCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 18,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  quickAction: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray600,
    textAlign: 'center',
    marginTop: 8,
  },

  // Vaccine Tracker
  ageGroup: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    ...SHADOWS.md,
  },
  ageGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  ageGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  ageProgress: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    marginRight: 8,
  },
  ageProgressFill: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  ageProgressText: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  vaccineItemDone: {
    opacity: 0.65,
  },
  vaccineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vaccineStatusBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vaccineStatusDone: {
    backgroundColor: COLORS.success,
  },
  vaccineStatusUpcoming: {
    backgroundColor: COLORS.warning + '20',
  },
  vaccineStatusPending: {
    backgroundColor: COLORS.error + '15',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  vaccineDesc: {
    fontSize: 11,
    color: COLORS.gray500,
    marginTop: 1,
  },
  vaccineAge: {
    fontSize: 11,
    color: COLORS.gray400,
    fontWeight: '500',
  },
  vaccineAgeBadge: {
    backgroundColor: COLORS.gray100,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vaccineAgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray500,
  },

  // Growth Tracker
  growthPlaceholder: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.accent + '30',
    borderStyle: 'dashed',
    ...SHADOWS.md,
  },
  growthPlaceholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginTop: 12,
    marginBottom: 8,
  },
  growthPlaceholderText: {
    fontSize: 13,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  growthButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  growthButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Milestones
  milestoneCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.md,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  milestoneAge: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneText: {
    fontSize: 13,
    color: COLORS.gray600,
  },

  // Health Tips Full
  tipCardFull: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.md,
  },
  tipCardFullRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  tipCardFullContent: {
    flex: 1,
  },
  tipCardFullTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  tipCardFullBody: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 19,
  },

  // Profile
  profileCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.lg,
  },
  profileAvatarOuter: {
    position: 'relative',
    marginBottom: 14,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  profileAvatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: 6,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileDetail: {
    fontSize: 13,
    color: COLORS.gray500,
  },
  editButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '30',
    ...SHADOWS.sm,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Settings
  settingsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray800,
  },
  settingValueBadge: {
    backgroundColor: COLORS.gray100,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
  },
  settingValueText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray600,
  },

  // Unit Toggle
  unitToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  unitToggleActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  unitToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray500,
  },
  unitToggleTextActive: {
    color: COLORS.primary,
  },

  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    ...SHADOWS.xl,
  },
  modalHandleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray300,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray800,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Settings Modal Items
  settingsModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  settingsModalItemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsModalItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray800,
  },
  settingsModalItemDesc: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 2,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  radioOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray800,
  },
  radioNative: {
    fontSize: 13,
    color: COLORS.gray500,
  },
  radioCheck: {
    color: COLORS.primary,
  },

  // FAQ Accordion
  faqItem: {
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.gray50,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray800,
    lineHeight: 20,
  },
  faqAnswer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  faqAnswerText: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 19,
  },

  // Export
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  exportOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray800,
  },
  exportOptionDesc: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 2,
  },

  // About
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  aboutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  aboutLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },

  // Contact Support
  contactCard: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  contactCardText: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 19,
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

