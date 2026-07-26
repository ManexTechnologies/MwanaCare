import React from 'react';
import { View, Text } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SHADOWS } from '../theme';
import { scale, rfValue, useScreenDimensions } from '../utils/responsive';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  color: string;
  icon: string;
  iconFamily?: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather';
}

export function StatCard({
  title,
  value,
  unit,
  color,
  icon,
  iconFamily = 'MaterialCommunityIcons',
}: StatCardProps) {
  const { colors, isDark } = useTheme();
  const { isSmallDevice } = useScreenDimensions();
  const IconComponent =
    iconFamily === 'Ionicons'
      ? Ionicons
      : iconFamily === 'Feather'
      ? Feather
      : MaterialCommunityIcons;

  return (
    <View
      style={{
        borderRadius: 14,
        padding: scale(16),
        borderLeftWidth: 4,
        borderLeftColor: color,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: scale(10),
        }}
      >
        <View
          style={{
            width: scale(36),
            height: scale(36),
            borderRadius: 10,
            backgroundColor: color + '15',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent name={icon as any} size={scale(20)} color={color} />
        </View>
      </View>
      <Text
        style={{
          fontSize: rfValue(isSmallDevice ? 22 : 26),
          fontWeight: '700',
          color: colors.gray800,
        }}
      >
        {value}
        <Text
          style={{
            fontSize: rfValue(14),
            fontWeight: '400',
            color: colors.gray500,
          }}
        >
          {' '}
          {unit}
        </Text>
      </Text>
      <Text
        style={{
          fontSize: rfValue(12),
          color: colors.gray500,
          marginTop: scale(2),
          fontWeight: '500',
        }}
      >
        {title}
      </Text>
    </View>
  );
}

