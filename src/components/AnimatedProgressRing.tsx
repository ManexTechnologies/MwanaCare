import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AnimatedProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showPercentage?: boolean;
}

// Pure React Native fallback ring using nested Views
function ViewRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color,
  trackColor,
  label,
  showPercentage,
}: Omit<AnimatedProgressRingProps, 'color' | 'trackColor'> & {
  color: string;
  trackColor: string;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      {/* Track background */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: trackColor,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Fill arc using a clipped approach */}
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            position: 'absolute',
          }}
        >
          <Animated.View
            style={{
              width: animatedWidth,
              height: size,
              backgroundColor: color,
              opacity: 0.25,
            }}
          />
        </View>
      </View>

      {/* Inner cutout */}
      <View
        style={{
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: (size - strokeWidth * 2) / 2,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {showPercentage && (
          <Text style={{ fontSize: size * 0.2, fontWeight: '700', color }}>
            {Math.round(progress * 100)}%
          </Text>
        )}
        {label && (
          <Text
            style={{
              fontSize: size * 0.12,
              fontWeight: '500',
              color,
              textAlign: 'center',
              marginTop: showPercentage ? 1 : 0,
            }}
          >
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}

export function AnimatedProgressRing(props: AnimatedProgressRingProps) {
  const { colors } = useTheme();
  const {
    progress,
    size = 100,
    strokeWidth = 8,
    color = colors.primary,
    trackColor = colors.gray100,
    label,
    showPercentage = false,
  } = props;

  return (
    <ViewRing
      progress={Math.min(Math.max(progress, 0), 1)}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      trackColor={trackColor}
      label={label}
      showPercentage={showPercentage}
    />
  );
}

