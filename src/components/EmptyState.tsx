import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';
import { PressableScale } from './PressableScale';
import { scale, rfValue } from '../utils/responsive';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  color?: string;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  color,
}: EmptyStateProps) {
  const { colors, isDark } = useTheme();
  const accentColor = color || colors.primary;

  return (
    <GlassCard
      intensity={isDark ? 'heavy' : 'light'}
      style={{ alignItems: 'center', paddingVertical: scale(40), paddingHorizontal: scale(24), marginBottom: scale(16) }}
      noBorder
    >
      <View
        style={{
          width: scale(72),
          height: scale(72),
          borderRadius: scale(36),
          backgroundColor: accentColor + '12',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: scale(16),
        }}
      >
        <Feather name={icon as any} size={scale(32)} color={accentColor} />
      </View>
      <Text
        style={{
          fontSize: rfValue(18),
          fontWeight: '700',
          color: colors.gray800,
          marginBottom: scale(6),
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: rfValue(14),
          color: colors.gray500,
          textAlign: 'center',
          lineHeight: rfValue(20),
          marginBottom: actionLabel ? scale(20) : 0,
        }}
      >
        {subtitle}
      </Text>
      {actionLabel && onAction && (
        <PressableScale onPress={onAction} style={{ backgroundColor: accentColor, borderRadius: 12, paddingVertical: scale(12), paddingHorizontal: scale(24), flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
          <Feather name="plus" size={scale(18)} color={colors.white} />
          <Text style={{ fontSize: rfValue(15), fontWeight: '600', color: colors.white }}>
            {actionLabel}
          </Text>
        </PressableScale>
      )}
    </GlassCard>
  );
}

