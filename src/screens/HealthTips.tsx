import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { HEALTH_TIPS } from '../data';
import { BoxIcon, AnimatedCard, GlassCard } from '../components';

export function HealthTips() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor: colors.primaryBg }} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoxIcon icon="lightbulb-outline" size={22} color={colors.rose} bgColor={colors.rose + '15'} containerSize={40} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 4, marginTop: 4 }}>{t('tips.title')}</Text>
              <Text style={{ fontSize: 13, color: colors.gray500, marginTop: -4, marginBottom: 12 }}>{t('tips.subtitle')}</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {HEALTH_TIPS.map((tip, idx) => (
        <AnimatedCard key={tip.id} delay={80 + idx * 50}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: 12 }} noBorder>
            <LinearGradient colors={isDark ? [colors.gray50, colors.gray50] : [colors.white, colors.gray50]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={{ borderRadius: 14, padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                <BoxIcon icon={tip.icon} size={24} color={tip.color} bgColor={tip.color + '15'} containerSize={50} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray800, marginBottom: 4 }}>{tip.title}</Text>
                  <Text style={{ fontSize: 13, color: colors.gray600, lineHeight: 19 }}>{tip.body}</Text>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>
        </AnimatedCard>
      ))}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

