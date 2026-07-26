import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
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

/**
 * Proper circular progress ring using rotation transforms.
 * Uses the "two half-circles" technique for a clean arc.
 */
function ViewRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color,
  trackColor,
  label,
  showPercentage,
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  trackColor: string;
  label?: string;
  showPercentage: boolean;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Interpolate progress to degrees (0-360)
  const rotateInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: Math.min(Math.max(progress, 0), 1),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  // Render the proper circular arc technique
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      {/* Outer track circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: halfSize,
          backgroundColor: trackColor,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Progress arc: two half-circles with rotation */}
        {/* Left half clip */}
        <View
          style={{
            position: 'absolute',
            width: halfSize,
            height: size,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: halfSize,
              borderWidth: strokeWidth,
              borderColor: color,
              left: 0,
              transform: [
                { rotate: rotateInterpolation },
                { translateX: -halfSize },
              ],
            }}
          />
        </View>
        {/* Right half clip */}
        <View
          style={{
            position: 'absolute',
            width: halfSize,
            height: size,
            right: 0,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: halfSize,
              borderWidth: strokeWidth,
              borderColor: progress > 0.5 ? color : 'transparent',
              right: 0,
              transform: [
                { rotate: progress > 0.5 ? '180deg' : '0deg' },
                { translateX: halfSize },
              ],
            }}
          />
        </View>
      </View>

      {/* Inner cutout - shows the background through */}
      <View
        style={{
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: (size - strokeWidth * 2) / 2,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {showPercentage && (
          <Text
            style={{
              fontSize: size * 0.2,
              fontWeight: '700',
              color,
              textAlign: 'center',
            }}
            accessibilityLabel={`${Math.round(progress * 100)} percent`}
          >
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

