import React, { useState, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
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
import { useScreenDimensions, scale, rfValue, getHorizontalPadding } from '../utils/responsive';

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

type FilterType = 'all' | 'pending' | 'done' | 'upcoming';

export function VaccineTracker() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [vaccineStatusMap, setVaccineStatusMap] = usePersistedState<VaccineStatusMap>('vaccineStatus', {});

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

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

  const totalVaccines = vaccines.length;
  const doneVaccines = vaccines.filter((v) => v.status === 'done').length;
  const overallProgress = totalVaccines > 0 ? doneVaccines / totalVaccines : 0;

  const filterVaccines = (vacs: typeof vaccines) => {
    if (activeFilter === 'all') return vacs;
    return vacs.filter(v => v.status === activeFilter);
  };

  const { isSmallDevice } = useScreenDimensions();

  const filterTabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalVaccines },
    { key: 'pending', label: 'Pending', count: vaccines.filter(v => v.status === 'pending').length },
    { key: 'done', label: 'Done', count: doneVaccines },
    { key: 'upcoming', label: 'Upcoming', count: vaccines.filter(v => v.status === 'upcoming').length },
  ];

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
      <AnimatedCard delay={0}>
        <View style={{ marginBottom: scale(12) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoxIcon icon="shield-check-outline" size={scale(22)} color={colors.primary} bgColor={colors.primary + '15'} containerSize={scale(40)} />
            <View style={{ marginLeft: scale(12) }}>
              <Text style={{ fontSize: rfValue(18), fontWeight: '700', color: colors.gray800, marginBottom: scale(4), marginTop: scale(4) }}>{t('vaccine.title')}</Text>
              <Text style={{ fontSize: rfValue(13), color: colors.gray500, marginTop: scale(-4), marginBottom: scale(12) }}>{t('vaccine.subtitle')}</Text>
            </View>
</View>
        </View>
      </AnimatedCard>

      <AnimatedCard delay={60}>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ alignItems: 'center', paddingVertical: scale(20), marginBottom: scale(16) }} noBorder>
          <Text style={{ fontSize: rfValue(16), fontWeight: '700', color: colors.gray800, marginBottom: scale(12) }}>Overall Vaccination Progress</Text>
          <AnimatedProgressRing
            progress={overallProgress}
            size={scale(100)}
            strokeWidth={8}
            color={colors.primary}
            trackColor={isDark ? colors.gray100 : colors.gray200}
            label={`${doneVaccines}/${totalVaccines}`}
            showPercentage
          />
        </GlassCard>
      </AnimatedCard>

      <AnimatedCard delay={80}>
        <View style={{ flexDirection: 'row', gap: scale(8), marginBottom: scale(16), flexWrap: 'wrap' }}>
          {filterTabs.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: activeFilter === filter.key ? colors.primary : colors.gray100,
                borderRadius: 20,
                paddingVertical: scale(6),
                paddingHorizontal: scale(14),
                gap: scale(4),
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: activeFilter === filter.key }}
            >
              <Text style={{ fontSize: rfValue(12), fontWeight: '600', color: activeFilter === filter.key ? colors.white : colors.gray600 }}>{filter.label}</Text>
              <View style={{ backgroundColor: activeFilter === filter.key ? 'rgba(255,255,255,0.2)' : colors.gray300, borderRadius: 8, paddingHorizontal: scale(6), paddingVertical: scale(1) }}>
                <Text style={{ fontSize: rfValue(10), fontWeight: '700', color: activeFilter === filter.key ? colors.white : colors.gray600 }}>{filter.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </AnimatedCard>

      {AGE_ORDER.map((age, ageIdx) => {
        const ageVaccines = filterVaccines(vaccinesByAge[age] || []);
        if (ageVaccines.length === 0) return null;
        const done = ageVaccines.filter((v) => v.status === 'done').length;
        const total = ageVaccines.length;

        return (
          <AnimatedCard key={age} delay={100 + ageIdx * 80}>
            <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: scale(14), marginBottom: scale(16) }} noBorder>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: scale(6) }}>
                <MaterialCommunityIcons
                  name={age === 'At Birth' ? 'baby' : age === '6 Weeks' ? 'calendar-star' : age === '10 Weeks' ? 'calendar-clock' : age === '14 Weeks' ? 'calendar-check' : age === '9 Months' ? 'calendar-month' : 'calendar-end'}
                  size={scale(16)}
                  color={colors.primary}
                />
                <Text style={{ fontSize: rfValue(isSmallDevice ? 12 : 14), fontWeight: '700', color: colors.primary, marginRight: scale(8), flex: 1 }} numberOfLines={1}>{t(AGE_KEYS[age] || age)}</Text>
                <View style={{ flex: 1, height: 6, backgroundColor: isDark ? colors.gray100 : colors.gray200, borderRadius: 3, marginRight: scale(8) }}>
                  <View style={{ height: 6, backgroundColor: colors.primary, borderRadius: 3, width: `${(done / total) * 100}%` }} />
                </View>
                <Text style={{ fontSize: rfValue(12), color: colors.gray500, fontWeight: '600', width: scale(30), textAlign: 'right' }}>{done}/{total}</Text>
              </View>
              {ageVaccines.map((vaccine) => (
                <PressableScale key={vaccine.id} onPress={() => toggleVaccineStatus(vaccine.id)}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: isDark ? colors.gray50 : colors.gray50, borderRadius: 12,
                    padding: scale(12), marginBottom: 6,
                    opacity: vaccine.status === 'done' ? 0.65 : 1,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{
                        width: scale(36), height: scale(36), borderRadius: 10,
                        alignItems: 'center', justifyContent: 'center', marginRight: scale(12),
                        backgroundColor: vaccine.status === 'done' ? colors.success : vaccine.status === 'upcoming' ? colors.warning + '20' : colors.error + '15',
                      }}>
                        {vaccine.status === 'done' ? (
                          <MaterialIcons name="check-circle" size={scale(22)} color={colors.white} />
                        ) : vaccine.status === 'upcoming' ? (
                          <MaterialIcons name="schedule" size={scale(20)} color={colors.accent} />
                        ) : (
                          <MaterialIcons name="radio-button-unchecked" size={scale(20)} color={colors.rose} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray800 }}>{vaccine.name}</Text>
                        <Text style={{ fontSize: rfValue(11), color: colors.gray500, marginTop: 1 }} numberOfLines={isSmallDevice ? 1 : undefined}>{vaccine.description}</Text>
                      </View>
                    <View style={{ backgroundColor: colors.gray100, borderRadius: 6, paddingHorizontal: scale(8), paddingVertical: scale(4) }}>
                      <Text style={{ fontSize: rfValue(10), fontWeight: '600', color: colors.gray500 }}>{vaccine.age}</Text>
                    </View>
                </PressableScale>
              ))}
            </GlassCard>
          </AnimatedCard>
        );
      })}
      <View style={{ height: scale(90) }} />
    </ScrollView>
  );
}
