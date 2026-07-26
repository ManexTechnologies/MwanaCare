import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { GlassCard, PressableScale } from '../components';
import { scale, rfValue, getHorizontalPadding, useScreenDimensions } from '../utils/responsive';

export function SignIn({ onNavigateSignUp }: { onNavigateSignUp: () => void }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (!result.success) {
        Alert.alert('Sign In Failed', result.error);
      }
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const { isSmallDevice } = useScreenDimensions();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? colors.primaryBg : colors.primaryBg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: getHorizontalPadding() }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: scale(isSmallDevice ? 24 : 32) }}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: scale(isSmallDevice ? 64 : 80),
              height: scale(isSmallDevice ? 64 : 80),
              borderRadius: scale(20),
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: scale(16),
            }}
          >
            <MaterialCommunityIcons name="heart-pulse" size={scale(isSmallDevice ? 32 : 40)} color={colors.white} />
          </LinearGradient>
          <Text style={{ fontSize: rfValue(isSmallDevice ? 24 : 28), fontWeight: '800', color: colors.gray800 }}>{t('app.name')}</Text>
          <Text style={{ fontSize: rfValue(14), color: colors.gray500, marginTop: 4 }}>{t('app.tagline')}</Text>
        </View>

        {/* Sign In Form */}
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: scale(24), marginBottom: scale(24) }}>
          <Text style={{ fontSize: rfValue(22), fontWeight: '700', color: colors.gray800, marginBottom: scale(4) }}>
            Welcome Back
          </Text>
          <Text style={{ fontSize: rfValue(14), color: colors.gray500, marginBottom: scale(24) }}>
            Sign in to access your health records
          </Text>

          {/* Email */}
          <View style={{ marginBottom: scale(16) }}>
            <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(6) }}>
              Email
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? colors.gray50 : colors.gray50,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.gray200,
                paddingHorizontal: scale(14),
              }}
            >
              <Feather name="mail" size={scale(18)} color={colors.gray400} style={{ marginRight: scale(10) }} />
              <TextInput
                style={{ flex: 1, paddingVertical: scale(14), fontSize: rfValue(15), color: colors.gray800 }}
                placeholder="you@example.com"
                placeholderTextColor={colors.gray400}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: scale(24) }}>
            <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(6) }}>
              Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? colors.gray50 : colors.gray50,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.gray200,
                paddingHorizontal: scale(14),
              }}
            >
              <Feather name="lock" size={scale(18)} color={colors.gray400} style={{ marginRight: scale(10) }} />
              <TextInput
                style={{ flex: 1, paddingVertical: scale(14), fontSize: rfValue(15), color: colors.gray800 }}
                placeholder="Enter your password"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={scale(18)} color={colors.gray400} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <PressableScale>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: scale(15),
                alignItems: 'center',
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={{ fontSize: rfValue(16), fontWeight: '700', color: colors.white }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </PressableScale>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: scale(20) }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
            <Text style={{ marginHorizontal: scale(12), fontSize: rfValue(13), color: colors.gray400 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
          </View>

          {/* Sign Up Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: rfValue(14), color: colors.gray600 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateSignUp}>
              <Text style={{ fontSize: rfValue(14), fontWeight: '700', color: colors.primary }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

