import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, DARK_COLORS, SHADOWS } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'light' | 'medium' | 'heavy';
  noBorder?: boolean;
  noShadow?: boolean;
  borderRadius?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 'light',
  noBorder = false,
  noShadow = false,
  borderRadius = 16,
}: GlassCardProps) {
  const { colors, isDark } = useTheme();

  const glassMap = {
    light: colors.glass.light,
    medium: colors.glass.medium,
    heavy: colors.glass.heavy,
  };

  const borderColor = colors.glass.border;

  return (
    <View
      style={[
        {
          backgroundColor: glassMap[intensity],
          borderRadius,
          borderWidth: noBorder ? 0 : 1,
          borderColor,
          overflow: 'hidden',
        },
        noShadow ? null : SHADOWS.glass,
        style,
      ]}
    >
      {/* Subtle inner glow for glass effect */}
      {!noBorder && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
          }}
        />
      )}
      {children}
    </View>
  );
}

