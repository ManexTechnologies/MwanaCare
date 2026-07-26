import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import { COLORS, SHADOWS } from './src/theme';
import { LanguageProvider, useTranslation } from './src/i18n';
import { BoxIcon, GlassCard } from './src/components';
import { Dashboard, VaccineTracker, GrowthTracker, HealthTips, Profile, SignIn, SignUp } from './src/screens';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Tab, Language } from './src/types';
import { useScreenDimensions, scale, rfValue, getHorizontalPadding } from './src/utils/responsive';

// ---------- Tab Bar Component ----------
function TabBar({ active, onTabChange }: { active: Tab; onTabChange: (t: Tab) => void }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const tabs: { key: Tab; label: string; icon: string; family?: string; activeColor: string }[] = [
    { key: 'dashboard', label: t('tab.home'), icon: 'home', family: 'Ionicons', activeColor: colors.primary },
    { key: 'vaccines', label: t('tab.vaccines'), icon: 'needle', activeColor: colors.secondary },
    { key: 'tracker', label: t('tab.growth'), icon: 'chart-line', family: 'MaterialCommunityIcons', activeColor: colors.accent },
    { key: 'tips', label: t('tab.tips'), icon: 'lightbulb-outline', family: 'MaterialCommunityIcons', activeColor: colors.rose },
    { key: 'profile', label: t('tab.profile'), icon: 'account-circle', family: 'MaterialCommunityIcons', activeColor: colors.indigo },
  ];

  return (
    <GlassCard
      intensity={isDark ? 'heavy' : 'light'}
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? scale(20) : scale(12),
        paddingTop: scale(6),
        borderWidth: 0,
      }}
      noBorder
    >
      <View style={{ flexDirection: 'row' }}>
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
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: scale(4) }}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <View style={{
                width: scale(38),
                height: scale(38),
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2,
                backgroundColor: isActive ? tab.activeColor + '20' : 'transparent',
              }}>
                <IconComponent name={tab.icon as any} size={scale(22)} color={isActive ? tab.activeColor : colors.gray400} />
              </View>
              <Text style={{
                fontSize: rfValue(10),
                fontWeight: isActive ? '700' : '600',
                letterSpacing: 0.2,
                color: isActive ? tab.activeColor : colors.gray400,
              }}>
                {tab.label}
              </Text>
              {isActive && (
                <View style={{ width: scale(16), height: 3, borderRadius: 1.5, marginTop: 3, backgroundColor: tab.activeColor }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );
}

// ---------- Auth Gate ----------
function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [authScreen, setAuthScreen] = useState<'signIn' | 'signUp'>('signIn');

  // Show a loading screen while checking stored auth token
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
        <View style={{ alignItems: 'center' }}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
          >
            <MaterialCommunityIcons name="heart-pulse" size={40} color={COLORS.white} />
          </LinearGradient>
          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.gray800 }}>MwanaCare</Text>
          <Text style={{ fontSize: 13, color: COLORS.gray500, marginTop: 8 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (authScreen === 'signUp') {
    return <SignUp onNavigateSignIn={() => setAuthScreen('signIn')} />;
  }

  return <SignIn onNavigateSignUp={() => setAuthScreen('signUp')} />;
}

// ---------- Screen Fade Transition ----------
function ScreenContainer({ children, active }: { children: React.ReactNode; active: boolean }) {
  const fadeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
}

// ---------- Main App ----------
function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [language, setLanguage] = useState<Language>('english');
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { isSmallDevice, isTablet } = useScreenDimensions();

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
    <LanguageProvider language={language} onLanguageChange={setLanguage}>
      <AuthGate>
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? colors.primaryBg : colors.primary }}>
          <StatusBar style={isDark ? 'light' : 'light'} />
          {/* Glassmorphism Header */}
          <LinearGradient
            colors={isDark ? [colors.primary, colors.primaryDark] : [colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: scale(isSmallDevice ? 6 : 8),
              paddingBottom: scale(isSmallDevice ? 12 : 16),
              paddingHorizontal: getHorizontalPadding(),
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ fontSize: rfValue(isTablet ? 28 : 24), fontWeight: '800', color: colors.white, letterSpacing: 0.3 }} numberOfLines={1}>
                  {currentUser?.name ? `Hi, ${currentUser.name.split(' ')[0]} 👋` : t('app.name')}
                </Text>
                <Text style={{ fontSize: rfValue(isSmallDevice ? 12 : 13), color: isDark ? colors.gray400 : '#CCFBF1', marginTop: 2, fontWeight: '500' }} numberOfLines={1}>
                  {currentUser ? t('app.tagline') : t('app.tagline')}
                </Text>
              </View>
              <BoxIcon
                icon="heart-pulse"
                size={scale(24)}
                color={colors.white}
                bgColor="rgba(255,255,255,0.2)"
                containerSize={scale(42)}
              />
            </View>
          </LinearGradient>
          <View style={{ flex: 1, backgroundColor: isDark ? colors.primaryBg : colors.primaryBg }}>
            <ScreenContainer active={true}>
              {renderScreen()}
            </ScreenContainer>
          </View>
          <TabBar active={activeTab} onTabChange={setActiveTab} />
        </SafeAreaView>
      </AuthGate>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

