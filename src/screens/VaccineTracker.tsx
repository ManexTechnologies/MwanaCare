import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import {
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { VACCINES } from '../data';
import { BoxIcon, AnimatedCard, GlassCard, PressableScale, AnimatedProgressRing } from '../components';
import { usePersistedState } from '../storage/usePersistedState';
import { VaccineStatusMap } from '../types';

const AGE_ORDER = ['At Birth', '6 Weeks', '10 Weeks', '14 Weeks', '9 Months', '18 Months'];
const AGE_KEYS: Record<string, string> = {
  'At Birth': 'vaccine.at_birth',
  '6 Weeks': 'vaccine.6_weeks',
  '10 Weeks': 'vaccine.10_weeks',
  '14 Weeks': 'vaccine.14_weeks',
  '9 Months': 'vaccine.9_months',
  '18 Months': 'vaccine.18_months',
};

function getNextStatus(current: 'done' | 'pending' | 'upcoming'): 'done' | 'pending' | 'upcoming' {
  if (current === 'pending') return 'done';
  if (current === 'done') return 'upcoming';
  return 'pending';
}

export function VaccineTracker() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [vaccineStatusMap, setVaccineStatusMap] = usePersistedState<VaccineStatusMap>('vaccineStatus', {});

  const vaccines = VACCINES.map((v) => ({
    ...v,
    status: vaccineStatusMap[v.id] || v.status,
  }));

  const vaccinesByAge: Record<string, typeof vaccines> = {};
  vaccines.forEach((v) => {
    if (!vaccinesByAge[v.age]) vaccinesByAge[v.age] = [];
    vaccinesByAge[v.age].push(v);
  });

  const toggleVaccineStatus = (id: string) => {
    setVaccineStatusMap((prev) => {
      const current = prev[id] || VACCINES.find((v) => v.id === id)?.status || 'pending';
      return { ...prev, [id]: getNextStatus(current) };
    });
  };

  // Calculate overall vaccine progress
  const totalVaccines = vaccines.length;
  const doneVaccines = vaccines.filter((v) => v.status === 'done').length;
  const overallProgress = totalVaccines > 0 ? doneVaccines / totalVaccines : 0;

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor: colors.primaryBg }} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoxIcon icon="shield-check-outline" size={22} color={colors.primary} bgColor={colors.primary + '15'} containerSize={40} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 4, marginTop: 4 }}>{t('vaccine.title')}</Text>
              <Text style={{ fontSize: 13, color: colors.gray500, marginTop: -4, marginBottom: 12 }}>{t('vaccine.subtitle')}</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {/* Overall Progress Ring */}
      <AnimatedCard delay={60}>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 16 }} noBorder>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.gray800, marginBottom: 12 }}>Overall Vaccination Progress</Text>
          <AnimatedProgressRing
            progress={overallProgress}
            size={100}
            strokeWidth={8}
            color={colors.primary}
            trackColor={isDark ? colors.gray100 : colors.gray200}
            label={`${doneVaccines}/${totalVaccines}`}
            showPercentage
          />
        </GlassCard>
      </AnimatedCard>

      {AGE_ORDER.map((age, ageIdx) => {
        const ageVaccines = vaccinesByAge[age] || [];
        if (ageVaccines.length === 0) return null;
        const done = ageVaccines.filter((v) => v.status === 'done').length;
        const total = ageVaccines.length;

        return (
          <AnimatedCard key={age} delay={100 + ageIdx * 80}>
            <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 14, marginBottom: 16 }} noBorder>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 }}>
                <MaterialCommunityIcons
                  name={age === 'At Birth' ? 'baby' : age === '6 Weeks' ? 'calendar-star' : age === '10 Weeks' ? 'calendar-clock' : age === '14 Weeks' ? 'calendar-check' : age === '9 Months' ? 'calendar-month' : 'calendar-end'}
                  size={16}
                  color={colors.primary}
                />
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary, marginRight: 8 }}>{t(AGE_KEYS[age] || age)}</Text>
                <View style={{ flex: 1, height: 6, backgroundColor: isDark ? colors.gray100 : colors.gray200, borderRadius: 3, marginRight: 8 }}>
                  <View style={{ height: 6, backgroundColor: colors.primary, borderRadius: 3, width: `${(done / total) * 100}%` }} />
                </View>
                <Text style={{ fontSize: 12, color: colors.gray500, fontWeight: '600', width: 30, textAlign: 'right' }}>{done}/{total}</Text>
              </View>
              {ageVaccines.map((vaccine) => (
                <PressableScale key={vaccine.id} scaleTo={0.97} duration={80}>
                  <TouchableOpacity
                    onPress={() => toggleVaccineStatus(vaccine.id)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isDark ? colors.gray50 : colors.gray50,
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 6,
                      opacity: vaccine.status === 'done' ? 0.65 : 1,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                          backgroundColor: vaccine.status === 'done' ? colors.success : vaccine.status === 'upcoming' ? colors.warning + '20' : colors.error + '15',
                        }}
                      >
                        {vaccine.status === 'done' ? (
                          <MaterialIcons name="check-circle" size={22} color={colors.white} />
                        ) : vaccine.status === 'upcoming' ? (
                          <MaterialIcons name="schedule" size={20} color={colors.accent} />
                        ) : (
                          <MaterialIcons name="radio-button-unchecked" size={20} color={colors.rose} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray800 }}>{vaccine.name}</Text>
                        <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 1 }}>{vaccine.description}</Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: colors.gray100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: colors.gray500 }}>{vaccine.age}</Text>
                    </View>
                  </TouchableOpacity>
                </PressableScale>
              ))}
            </GlassCard>
          </AnimatedCard>
        );
      })}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

