import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { BoxIcon, AnimatedCard, StatCard, GlassCard, PressableScale, AnimatedProgressRing } from '../components';
import { usePersistedState } from '../storage/usePersistedState';
import { DashboardData } from '../types';

export function Dashboard() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [dashboardData] = usePersistedState<DashboardData>('dashboardData', {
    currentWeek: 32,
    babyWeight: '3.2',
    babyHeight: '49.5',
  });
  const { currentWeek, babyWeight, babyHeight } = dashboardData;

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor: colors.primaryBg }}
      showsVerticalScrollIndicator={false}
    >
      {/* Glassmorphism Hero Section */}
      <AnimatedCard delay={0}>
        <GlassCard intensity="light" borderRadius={20} noBorder>
          <LinearGradient
            colors={isDark ? [colors.primary + '80', colors.primaryDark + '60'] : [colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 24,
              marginBottom: 20,
              overflow: 'hidden',
            }}
          >
            <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
              <View style={{ position: 'absolute', width: 120, height: 120, top: -30, right: -20, borderRadius: 100, opacity: 0.1, backgroundColor: colors.white }} />
              <View style={{ position: 'absolute', width: 80, height: 80, bottom: -10, right: 40, borderRadius: 100, opacity: 0.1, backgroundColor: colors.white }} />
              <View style={{ position: 'absolute', width: 50, height: 50, top: 30, left: -10, borderRadius: 100, opacity: 0.1, backgroundColor: colors.white }} />
            </View>
            <BoxIcon icon="heart-pulse" size={28} color={colors.white} bgColor="rgba(255,255,255,0.2)" containerSize={52} />
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.white, marginTop: 12, marginBottom: 4 }}>{t('dashboard.hero.title')}</Text>
            <Text style={{ fontSize: 14, color: isDark ? colors.gray400 : '#CCFBF1', lineHeight: 20, marginBottom: 16 }}>{t('dashboard.hero.subtitle')}</Text>
            <PressableScale>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start', gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>{t('dashboard.hero.button')}</Text>
                <Feather name="arrow-right" size={16} color={colors.white} />
              </TouchableOpacity>
            </PressableScale>
          </LinearGradient>
        </GlassCard>
      </AnimatedCard>

      {/* Quick Stats with Progress Rings */}
      <AnimatedCard delay={100}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 12, marginTop: 4 }}>{t('dashboard.overview')}</Text>
      </AnimatedCard>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <AnimatedCard delay={150} style={{ flex: 1 }}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 0 }} noBorder>
            <StatCard title={t('dashboard.baby_weight')} value={babyWeight} unit="kg" color={colors.primary} icon="baby" />
          </GlassCard>
        </AnimatedCard>
        <AnimatedCard delay={200} style={{ flex: 1 }}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 0 }} noBorder>
            <StatCard title={t('dashboard.baby_height')} value={babyHeight} unit="cm" color={colors.secondary} icon="human-male-height" />
          </GlassCard>
        </AnimatedCard>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <AnimatedCard delay={250} style={{ flex: 1 }}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 0 }} noBorder>
            <StatCard title={t('dashboard.week')} value={`${currentWeek}`} unit={t('dashboard.weeks')} color={colors.accent} icon="calendar-clock" />
          </GlassCard>
        </AnimatedCard>
        <AnimatedCard delay={300} style={{ flex: 1 }}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 0 }} noBorder>
            <StatCard title={t('dashboard.next_vaccine')} value={t('dashboard.next_vaccine_value')} unit="" color={colors.rose} icon="needle" />
          </GlassCard>
        </AnimatedCard>
      </View>

      {/* Progress Overview Ring */}
      <AnimatedCard delay={325}>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 20 }} noBorder>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.gray800, marginBottom: 16 }}>Health Progress</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 10 }}>
            <View style={{ alignItems: 'center' }}>
              <AnimatedProgressRing
                progress={0.75}
                size={80}
                strokeWidth={6}
                color={colors.primary}
                trackColor={isDark ? colors.gray100 : colors.gray200}
                label="Weight"
                showPercentage
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <AnimatedProgressRing
                progress={0.6}
                size={80}
                strokeWidth={6}
                color={colors.secondary}
                trackColor={isDark ? colors.gray100 : colors.gray200}
                label="Height"
                showPercentage
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <AnimatedProgressRing
                progress={0.85}
                size={80}
                strokeWidth={6}
                color={colors.accent}
                trackColor={isDark ? colors.gray100 : colors.gray200}
                label="Vaccines"
                showPercentage
              />
            </View>
          </View>
        </GlassCard>
      </AnimatedCard>

      {/* Health Tip Spotlight */}
      <AnimatedCard delay={350}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 12, marginTop: 4 }}>{t('dashboard.tip_title')}</Text>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: 20 }} noBorder>
          <LinearGradient colors={isDark ? ['#1E293B', '#1E293B'] : ['#FFFBEB', '#FFF7ED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
              <BoxIcon icon="lightbulb-outline" size={24} color={colors.accent} bgColor={colors.accent + '20'} containerSize={48} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.gray800, marginBottom: 4 }}>{t('dashboard.tip_title_stay')}</Text>
                <Text style={{ fontSize: 13, color: colors.gray600, lineHeight: 18 }}>{t('dashboard.tip_body_stay')}</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard delay={400}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 12, marginTop: 4 }}>{t('dashboard.quick_actions')}</Text>
      </AnimatedCard>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        {[
          { icon: 'bell-ring-outline', label: t('dashboard.set_reminder'), color: colors.secondary },
          { icon: 'phone-in-talk-outline', label: t('dashboard.contact_clinic'), color: colors.primary },
          { icon: 'stethoscope', label: t('dashboard.symptoms'), color: colors.rose },
          { icon: 'map-marker-outline', label: t('dashboard.nearby_clinic'), color: colors.accent },
        ].map((action, idx) => (
          <AnimatedCard key={idx} delay={420 + idx * 30} style={{ flex: 1 }}>
            <PressableScale>
              <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 14, alignItems: 'center' }} noBorder>
                <BoxIcon icon={action.icon} size={22} color={action.color} bgColor={action.color + '15'} containerSize={46} />
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gray600, textAlign: 'center', marginTop: 8 }}>{action.label}</Text>
              </GlassCard>
            </PressableScale>
          </AnimatedCard>
        ))}
      </View>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

