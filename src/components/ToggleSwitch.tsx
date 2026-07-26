import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SHADOWS } from '../theme';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ value, onValueChange, disabled = false }: ToggleSwitchProps) {
  const { colors } = useTheme();
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const trackColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray300, colors.primary],
  });

  const thumbTranslate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: trackColor,
          justifyContent: 'center',
          paddingHorizontal: 3,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.white,
            transform: [{ translateX: thumbTranslate }],
            ...SHADOWS.sm,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

