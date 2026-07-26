import React from 'react';
import { View, Text } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SHADOWS } from '../theme';

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
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: color,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: color + '15',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent name={icon as any} size={20} color={color} />
        </View>
      </View>
      <Text
        style={{
          fontSize: 26,
          fontWeight: '700',
          color: colors.gray800,
        }}
      >
        {value}
        <Text
          style={{
            fontSize: 14,
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
          fontSize: 12,
          color: colors.gray500,
          marginTop: 2,
          fontWeight: '500',
        }}
      >
        {title}
      </Text>
    </View>
  );
}

