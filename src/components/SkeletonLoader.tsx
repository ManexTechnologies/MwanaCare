import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { scale } from '../utils/responsive';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const { colors, isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: isDark ? colors.gray200 : colors.gray200,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Pre-built skeleton layouts for screens

export function DashboardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={{ padding: scale(16) }}>
      {/* Hero skeleton */}
      <SkeletonLoader height={160} borderRadius={20} style={{ marginBottom: scale(16) }} />
      {/* Section title */}
      <SkeletonLoader width="40%" height={22} style={{ marginBottom: scale(12) }} />
      {/* Two stat cards row */}
      <View style={{ flexDirection: 'row', gap: scale(12), marginBottom: scale(12) }}>
        <View style={{ flex: 1 }}><SkeletonLoader height={90} borderRadius={14} /></View>
        <View style={{ flex: 1 }}><SkeletonLoader height={90} borderRadius={14} /></View>
      </View>
      {/* Second stat cards row */}
      <View style={{ flexDirection: 'row', gap: scale(12), marginBottom: scale(12) }}>
        <View style={{ flex: 1 }}><SkeletonLoader height={90} borderRadius={14} /></View>
        <View style={{ flex: 1 }}><SkeletonLoader height={90} borderRadius={14} /></View>
      </View>
      {/* Progress ring skeleton */}
      <SkeletonLoader height={160} borderRadius={16} style={{ marginBottom: scale(16) }} />
      {/* Tip title */}
      <SkeletonLoader width="50%" height={22} style={{ marginBottom: scale(12) }} />
      <SkeletonLoader height={100} borderRadius={16} style={{ marginBottom: scale(16) }} />
      {/* Quick actions title */}
      <SkeletonLoader width="40%" height={22} style={{ marginBottom: scale(12) }} />
      <View style={{ flexDirection: 'row', gap: scale(12) }}>
        <View style={{ flex: 1 }}><SkeletonLoader height={80} borderRadius={14} /></View>
        <View style={{ flex: 1 }}><SkeletonLoader height={80} borderRadius={14} /></View>
      </View>
    </View>
  );
}

export function VaccineSkeleton() {
  return (
    <View style={{ padding: scale(16) }}>
      <SkeletonLoader width="60%" height={28} style={{ marginBottom: scale(8) }} />
      <SkeletonLoader width="80%" height={18} style={{ marginBottom: scale(16) }} />
      <SkeletonLoader height={140} borderRadius={16} style={{ marginBottom: scale(16) }} />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ marginBottom: scale(12) }}>
          <SkeletonLoader height={80} borderRadius={14} />
        </View>
      ))}
    </View>
  );
}

export function GrowthSkeleton() {
  return (
    <View style={{ padding: scale(16) }}>
      <SkeletonLoader width="50%" height={28} style={{ marginBottom: scale(8) }} />
      <SkeletonLoader width="70%" height={18} style={{ marginBottom: scale(16) }} />
      <SkeletonLoader height={180} borderRadius={18} style={{ marginBottom: scale(16) }} />
      <SkeletonLoader width="40%" height={22} style={{ marginBottom: scale(12) }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonLoader key={i} height={70} borderRadius={14} style={{ marginBottom: scale(10) }} />
      ))}
    </View>
  );
}

export function TipsSkeleton() {
  return (
    <View style={{ padding: scale(16) }}>
      <SkeletonLoader width="40%" height={28} style={{ marginBottom: scale(8) }} />
      <SkeletonLoader width="60%" height={18} style={{ marginBottom: scale(16) }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonLoader key={i} height={90} borderRadius={14} style={{ marginBottom: scale(12) }} />
      ))}
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={{ padding: scale(16) }}>
      <SkeletonLoader width="40%" height={28} style={{ marginBottom: scale(8) }} />
      <SkeletonLoader width="60%" height={18} style={{ marginBottom: scale(16) }} />
      <SkeletonLoader height={200} borderRadius={18} style={{ marginBottom: scale(20) }} />
      <SkeletonLoader width="30%" height={22} style={{ marginBottom: scale(12) }} />
      <SkeletonLoader height={320} borderRadius={16} />
    </View>
  );
}

