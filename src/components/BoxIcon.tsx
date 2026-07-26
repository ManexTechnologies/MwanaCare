import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

interface BoxIconProps {
  icon: string;
  iconFamily?: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather' | 'MaterialIcons';
  size?: number;
  color?: string;
  bgColor?: string;
  containerSize?: number;
  rounded?: boolean;
}

export function BoxIcon({
  icon,
  iconFamily = 'MaterialCommunityIcons',
  size = 22,
  color = COLORS.white,
  bgColor = COLORS.primary,
  containerSize = 44,
  rounded = false,
}: BoxIconProps) {
  const IconComponent =
    iconFamily === 'Ionicons'
      ? Ionicons
      : iconFamily === 'Feather'
      ? Feather
      : iconFamily === 'MaterialIcons'
      ? MaterialIcons
      : MaterialCommunityIcons;

  return (
    <View
      style={[
        {
          width: containerSize,
          height: containerSize,
          borderRadius: rounded ? containerSize / 2 : 12,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        SHADOWS.sm,
      ]}
    >
      <IconComponent name={icon as any} size={size} color={color} />
    </View>
  );
}

