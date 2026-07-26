import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { BoxIcon, AnimatedCard, GlassCard, PressableScale, SettingsModal } from '../components';
import { usePersistedState } from '../storage/usePersistedState';
import { GrowthMeasurement } from '../types';
import { scale, rfValue, getHorizontalPadding, getGridGap } from '../utils/responsive';

const MILESTONES = [
  { age: 'growth.1_month', icon: 'baby', milestones: ['Lifts head briefly', 'Responds to sounds', 'Focuses on faces'] },
  { age: 'growth.3_months', icon: 'baby-face-outline', milestones: ['Holds head steady', 'Follows objects with eyes', 'Coos and makes sounds'] },
  { age: 'growth.6_months', icon: 'baby-face', milestones: ['Rolls over both ways', 'Sits with support', 'Responds to name'] },
  { age: 'growth.9_months', icon: 'human-child', milestones: ['Sits without support', 'Crawls', 'Babbles'] },
  { age: 'growth.12_months', icon: 'human-male-child', milestones: ['Stands with support', 'Says "mama"/"dada"', 'Picks up small objects'] },
];

export function GrowthTracker() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [measurements, setMeasurements] = usePersistedState<GrowthMeasurement[]>('growthMeasurements', []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newHeadCirc, setNewHeadCirc] = useState('');

  const addMeasurement = () => {
    if (!newWeight || !newHeight) {
      Alert.alert('Validation', 'Weight and height are required');
      return;
    }
    const measurement: GrowthMeasurement = {
      id: Date.now().toString(36),
      date: new Date().toISOString(),
      weight: parseFloat(newWeight),
      height: parseFloat(newHeight),
      headCircumference: newHeadCirc ? parseFloat(newHeadCirc) : undefined,
    };
    setMeasurements((prev) => [measurement, ...prev]);
    setNewWeight('');
    setNewHeight('');
    setNewHeadCirc('');
    setShowAddModal(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
  };

  const latest = measurements[0];
  const latestWeight = latest ? latest.weight.toFixed(1) : '3.2';
  const latestHeight = latest ? latest.height.toFixed(1) : '49.5';

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: getHorizontalPadding(), paddingTop: scale(16), backgroundColor: colors.primaryBg }} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={{ marginBottom: scale(16) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoxIcon icon="chart-timeline-variant" size={scale(22)} color={colors.accent} bgColor={colors.accent + '15'} containerSize={scale(40)} />
            <View style={{ marginLeft: scale(12) }}>
              <Text style={{ fontSize: rfValue(18), fontWeight: '700', color: colors.gray800, marginBottom: scale(4), marginTop: scale(4) }}>{t('growth.title')}</Text>
              <Text style={{ fontSize: rfValue(13), color: colors.gray500, marginTop: scale(-4), marginBottom: scale(12) }}>{t('growth.subtitle')}</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {/* Add Measurement Card */}
      <AnimatedCard delay={100}>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: scale(20) }} noBorder>
          <LinearGradient colors={isDark ? [colors.gray50, colors.gray50] : ['#FEF3C7', '#FFFBEB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 18, padding: scale(24), alignItems: 'center', borderWidth: 2, borderColor: colors.accent + '30', borderStyle: 'dashed' }}>
            <BoxIcon icon="chart-line" size={scale(32)} color={colors.accent} bgColor={colors.accent + '20'} containerSize={scale(64)} />
            {measurements.length > 0 ? (
              <>
                <Text style={{ fontSize: rfValue(16), fontWeight: '600', color: colors.gray800, marginTop: scale(12), marginBottom: scale(4) }}>{measurements.length} measurements recorded</Text>
                <Text style={{ fontSize: rfValue(13), color: colors.gray600, textAlign: 'center', lineHeight: scale(18), marginBottom: scale(16) }}>
                  Latest: {latestWeight} kg, {latestHeight} cm on {formatDate(latest.date)}
                </Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: rfValue(16), fontWeight: '600', color: colors.gray800, marginTop: scale(12), marginBottom: scale(8) }}>{t('growth.placeholder_title')}</Text>
                <Text style={{ fontSize: rfValue(13), color: colors.gray600, textAlign: 'center', lineHeight: scale(18), marginBottom: scale(16) }}>{t('growth.placeholder_text')}</Text>
              </>
            )}
            <PressableScale>
              <TouchableOpacity
                onPress={() => setShowAddModal(true)}
                style={{ backgroundColor: colors.accent, borderRadius: 10, paddingVertical: scale(12), paddingHorizontal: scale(24), flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="plus" size={scale(18)} color={colors.white} />
                <Text style={{ fontSize: rfValue(14), fontWeight: '600', color: colors.white }}> {t('growth.add_measurement')}</Text>
              </TouchableOpacity>
            </PressableScale>
          </LinearGradient>
        </GlassCard>
      </AnimatedCard>

      {/* Add Measurement Modal (using SettingsModal) */}
      <SettingsModal visible={showAddModal} title={t('growth.add_measurement')} onClose={() => setShowAddModal(false)}>
        <View style={{ marginBottom: scale(12) }}>
          <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(4) }}>Weight (kg) *</Text>
          <TextInput
            style={{ backgroundColor: colors.gray50, borderRadius: 10, padding: scale(12), fontSize: rfValue(15), borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 }}
            placeholder="e.g. 3.5"
            placeholderTextColor={colors.gray400}
            value={newWeight}
            onChangeText={setNewWeight}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ marginBottom: scale(12) }}>
          <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(4) }}>Height (cm) *</Text>
          <TextInput
            style={{ backgroundColor: colors.gray50, borderRadius: 10, padding: scale(12), fontSize: rfValue(15), borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 }}
            placeholder="e.g. 50.0"
            placeholderTextColor={colors.gray400}
            value={newHeight}
            onChangeText={setNewHeight}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ marginBottom: scale(20) }}>
          <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(4) }}>Head Circumference (cm)</Text>
          <TextInput
            style={{ backgroundColor: colors.gray50, borderRadius: 10, padding: scale(12), fontSize: rfValue(15), borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 }}
            placeholder="e.g. 35.0"
            placeholderTextColor={colors.gray400}
            value={newHeadCirc}
            onChangeText={setNewHeadCirc}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ flexDirection: 'row', gap: scale(12) }}>
          <TouchableOpacity
            onPress={() => setShowAddModal(false)}
            style={{ flex: 1, paddingVertical: scale(12), borderRadius: 10, alignItems: 'center', backgroundColor: colors.gray100 }}>
            <Text style={{ fontSize: rfValue(15), fontWeight: '600', color: colors.gray600 }}>Cancel</Text>
          </TouchableOpacity>
          <PressableScale style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={addMeasurement}
              style={{ flex: 1, paddingVertical: scale(12), borderRadius: 10, alignItems: 'center', backgroundColor: colors.accent }}>
              <Text style={{ fontSize: rfValue(15), fontWeight: '600', color: colors.white }}>Save</Text>
            </TouchableOpacity>
          </PressableScale>
        </View>
      </SettingsModal>

      {/* Measurement History */}
      {measurements.length > 1 && (
        <AnimatedCard delay={130}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: scale(16), marginBottom: scale(16) }} noBorder>
            <Text style={{ fontSize: rfValue(16), fontWeight: '700', color: colors.gray800, marginBottom: scale(10) }}>History</Text>
            {measurements.slice(0, 10).map((m) => (
              <View key={m.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: scale(8), borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                <Text style={{ fontSize: rfValue(12), color: colors.gray500 }}>{formatDate(m.date)}</Text>
                <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray800 }}>{m.weight.toFixed(1)} kg / {m.height.toFixed(1)} cm{m.headCircumference ? ` / ${m.headCircumference.toFixed(1)} cm` : ''}</Text>
              </View>
            ))}
          </GlassCard>
        </AnimatedCard>
      )}

      {/* Milestones */}
      <AnimatedCard delay={150}>
        <Text style={{ fontSize: rfValue(18), fontWeight: '700', color: colors.gray800, marginBottom: scale(12), marginTop: scale(4) }}>{t('growth.milestones')}</Text>
      </AnimatedCard>

      {MILESTONES.map((stage, idx) => (
        <AnimatedCard key={stage.age} delay={200 + idx * 60}>
          <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: scale(12) }} noBorder>
            <LinearGradient colors={isDark ? [colors.gray50, colors.gray50] : [colors.white, colors.gray50]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={{ borderRadius: 14, padding: scale(16) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: scale(12) }}>
                <BoxIcon icon={stage.icon as any} size={scale(18)} color={colors.primary} bgColor={colors.primary + '12'} containerSize={scale(34)} rounded />
                <Text style={{ fontSize: rfValue(15), fontWeight: '700', color: colors.primary }}>{t(stage.age)}</Text>
              </View>
              {stage.milestones.map((m, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(8), gap: scale(10) }}>
                  <View style={{ width: scale(22), height: scale(22), borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name="circle" size={scale(16)} color={colors.gray300} />
                  </View>
                  <Text style={{ fontSize: rfValue(13), color: colors.gray600 }}>{m}</Text>
                </View>
              ))}
            </LinearGradient>
          </GlassCard>
        </AnimatedCard>
      ))}
      <View style={{ height: scale(90) }} />
    </ScrollView>
  );
}

