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
        paddingBottom: Platform.OS === 'ios' ? 20 : 12,
        paddingTop: 6,
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
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2,
                backgroundColor: isActive ? tab.activeColor + '20' : 'transparent',
              }}>
                <IconComponent name={tab.icon as any} size={22} color={isActive ? tab.activeColor : colors.gray400} />
              </View>
              <Text style={{
                fontSize: 10,
                fontWeight: isActive ? '700' : '600',
                letterSpacing: 0.2,
                color: isActive ? tab.activeColor : colors.gray400,
              }}>
                {tab.label}
              </Text>
              {isActive && (
                <View style={{ width: 16, height: 3, borderRadius: 1.5, marginTop: 3, backgroundColor: tab.activeColor }} />
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
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<'signIn' | 'signUp'>('signIn');

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
              paddingTop: 8,
              paddingBottom: 16,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: colors.white, letterSpacing: 0.3 }}>
                  {t('app.name')}
                </Text>
                <Text style={{ fontSize: 13, color: isDark ? colors.gray400 : '#CCFBF1', marginTop: 2, fontWeight: '500' }}>
                  {t('app.tagline')}
                </Text>
              </View>
              <BoxIcon
                icon="heart-pulse"
                size={24}
                color={colors.white}
                bgColor="rgba(255,255,255,0.2)"
                containerSize={42}
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

