import React, { useState, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { BoxIcon, AnimatedCard, StatCard, GlassCard, PressableScale, AnimatedProgressRing, DashboardSkeleton } from '../components';
import { usePersistedState } from '../storage/usePersistedState';
import { DashboardData } from '../types';
import { useScreenDimensions, scale, rfValue, getHorizontalPadding, getGridGap } from '../utils/responsive';

export function Dashboard() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [dashboardData] = usePersistedState<DashboardData>('dashboardData', {
    currentWeek: 32,
    babyWeight: '3.2',
    babyHeight: '49.5',
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { currentWeek, babyWeight, babyHeight } = dashboardData;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate a data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'reminder':
        Alert.alert(t('dashboard.set_reminder'), t('dashboard.set_reminder'));
        break;
      case 'clinic':
        Alert.alert(t('dashboard.contact_clinic'), t('dashboard.contact_clinic'));
        break;
      case 'symptoms':
        Alert.alert(t('dashboard.symptoms'), t('dashboard.symptoms'));
        break;
      case 'nearby':
        Alert.alert(t('dashboard.nearby_clinic'), t('dashboard.nearby_clinic'));
        break;
    }
  }, [t]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: getHorizontalPadding(), paddingTop: scale(16), backgroundColor: colors.primaryBg }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={isDark ? colors.gray50 : colors.white}
        />
      }
    >
      {/* Glassmorphism Hero Section */}
      <AnimatedCard delay={0}>
        <GlassCard intensity="light" borderRadius={scale(20)} noBorder>
          <LinearGradient
            colors={isDark ? [colors.primary + '80', colors.primaryDark + '60'] : [colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: scale(20),
              padding: scale(24),
              marginBottom: scale(20),
              overflow: 'hidden',
            }}
          >
            <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
              <View style={{ position: 'absolute', width: scale(120), height: scale(120), top: scale(-30), right: scale(-20), borderRadius: 100, opacity: 0.1, backgroundColor: colors.white }} />
              <View style={{ position: 'absolute', width: scale(80), height: scale(80), bottom: scale(-10), right: scale(40), borderRadius: 100, opacity: 0.1, backgroundColor: colors.white }} />
              <View style={{ position: 'absolute', width: scale(50), height: scale(50), top: scale(30), left: scale(-10), borderRadius: 100, opacity: 0.1, backgroundColor: colors.white }} />
            </View>
            <BoxIcon icon="heart-pulse" size={scale(28)} color={colors.white} bgColor="rgba(255,255,255,0.2)" containerSize={scale(52)} />
            <Text style={{ fontSize: rfValue(22), fontWeight: '800', color: colors.white, marginTop: scale(12), marginBottom: scale(4) }}>{t('dashboard.hero.title')}</Text>
            <Text style={{ fontSize: rfValue(14), color: isDark ? colors.gray400 : '#CCFBF1', lineHeight: scale(20), marginBottom: scale(16) }}>{t('dashboard.hero.subtitle')}</Text>
            <PressableScale>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: scale(10), paddingHorizontal: scale(18), alignSelf: 'flex-start', gap: scale(8) }}
                accessibilityRole="button" accessibilityLabel={t('dashboard.hero.button')}>
                <Text style={{ fontSize: rfValue(14), fontWeight: '600', color: colors.white }}>{t('dashboard.hero.button')}</Text>
                <Feather name="arrow-right" size={scale(16)} color={colors.white} />
              </TouchableOpacity>
            </PressableScale>
          </LinearGradient>
        </GlassCard>
      </AnimatedCard>

      {/* Quick Stats with Progress Rings */}
      <AnimatedCard delay={100}>
        <Text style={{ fontSize: rfValue(18), fontWeight: '700', color: colors.gray800, marginBottom: scale(12), marginTop: scale(4) }}>{t('dashboard.overview')}</Text>
      </AnimatedCard>
      <View style={{ flexDirection: 'row', gap: getGridGap(), marginBottom: scale(12) }}>
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
      <View style={{ flexDirection: 'row', gap: getGridGap(), marginBottom: scale(12) }}>
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
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ alignItems: 'center', paddingVertical: scale(20), marginBottom: scale(20) }} noBorder>
          <Text style={{ fontSize: rfValue(16), fontWeight: '700', color: colors.gray800, marginBottom: scale(16) }}>Health Progress</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: scale(10) }}>
            <View style={{ alignItems: 'center' }}>
              <AnimatedProgressRing
                progress={0.75}
                size={scale(80)}
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
                size={scale(80)}
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
                size={scale(80)}
                strokeWidth={6}
                color={colors.accent}
                trackColor={isDark ? colors.gray100 : colors.gray200}
                label="Vaccines"
                showPercentage
              />
            </View>
        </GlassCard>
      </AnimatedCard>

      {/* Health Tip Spotlight */}
      <AnimatedCard delay={350}>
        <Text style={{ fontSize: rfValue(18), fontWeight: '700', color: colors.gray800, marginBottom: scale(12), marginTop: scale(4) }}>{t('dashboard.tip_title')}</Text>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: scale(20) }} noBorder>
          <LinearGradient colors={isDark ? ['#1E293B', '#1E293B'] : ['#FFFBEB', '#FFF7ED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 16, padding: scale(16) }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: scale(14) }}>
              <BoxIcon icon="lightbulb-outline" size={scale(24)} color={colors.accent} bgColor={colors.accent + '20'} containerSize={scale(48)} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: rfValue(16), fontWeight: '600', color: colors.gray800, marginBottom: scale(4) }}>{t('dashboard.tip_title_stay')}</Text>
                <Text style={{ fontSize: rfValue(13), color: colors.gray600, lineHeight: scale(18) }}>{t('dashboard.tip_body_stay')}</Text>
              </View>
          </LinearGradient>
        </GlassCard>
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard delay={400}>
        <Text style={{ fontSize: rfValue(18), fontWeight: '700', color: colors.gray800, marginBottom: scale(12), marginTop: scale(4) }}>{t('dashboard.quick_actions')}</Text>
      </AnimatedCard>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: getGridGap(), marginBottom: scale(12) }}>
        {[
          { icon: 'bell-ring-outline', label: t('dashboard.set_reminder'), color: colors.secondary, action: 'reminder' },
          { icon: 'phone-in-talk-outline', label: t('dashboard.contact_clinic'), color: colors.primary, action: 'clinic' },
          { icon: 'stethoscope', label: t('dashboard.symptoms'), color: colors.rose, action: 'symptoms' },
          { icon: 'map-marker-outline', label: t('dashboard.nearby_clinic'), color: colors.accent, action: 'nearby' },
        ].map((action, idx) => (
          <AnimatedCard key={idx} delay={420 + idx * 30} style={{ width: '47%', flexGrow: 1 }}>
            <PressableScale onPress={() => handleQuickAction(action.action)}>
              <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: scale(14), alignItems: 'center' }} noBorder>
                <BoxIcon icon={action.icon} size={scale(22)} color={action.color} bgColor={action.color + '15'} containerSize={scale(46)} />
                <Text style={{ fontSize: rfValue(11), fontWeight: '600', color: colors.gray600, textAlign: 'center', marginTop: scale(8) }}>{action.label}</Text>
              </GlassCard>
            </PressableScale>
          </AnimatedCard>
        ))}
      </View>
      <View style={{ height: scale(90) }} />
    </ScrollView>
  );
}
