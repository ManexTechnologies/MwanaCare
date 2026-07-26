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

export function SignUp({ onNavigateSignIn }: { onNavigateSignIn: () => void }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(name, email, password);
      if (!result.success) {
        Alert.alert('Sign Up Failed', result.error);
      }
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message || 'An unexpected error occurred');
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
        <View style={{ alignItems: 'center', marginBottom: scale(isSmallDevice ? 16 : 24) }}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: scale(isSmallDevice ? 60 : 72),
              height: scale(isSmallDevice ? 60 : 72),
              borderRadius: scale(18),
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: scale(14),
            }}
          >
            <MaterialCommunityIcons name="heart-pulse" size={scale(isSmallDevice ? 28 : 36)} color={colors.white} />
          </LinearGradient>
          <Text style={{ fontSize: rfValue(isSmallDevice ? 22 : 26), fontWeight: '800', color: colors.gray800 }}>Create Account</Text>
          <Text style={{ fontSize: rfValue(14), color: colors.gray500, marginTop: 4 }}>
            Join MwanaCare to track your health
          </Text>
        </View>

        {/* Sign Up Form */}
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: scale(22), marginBottom: scale(24) }}>
          {/* Name */}
          <View style={{ marginBottom: scale(14) }}>
            <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(5) }}>
              Full Name
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
              <Feather name="user" size={scale(18)} color={colors.gray400} style={{ marginRight: scale(10) }} />
              <TextInput
                style={{ flex: 1, paddingVertical: scale(13), fontSize: rfValue(15), color: colors.gray800 }}
                placeholder="Jane Doe"
                placeholderTextColor={colors.gray400}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Email */}
          <View style={{ marginBottom: scale(14) }}>
            <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(5) }}>
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
                style={{ flex: 1, paddingVertical: scale(13), fontSize: rfValue(15), color: colors.gray800 }}
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
          <View style={{ marginBottom: scale(14) }}>
            <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(5) }}>
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
                style={{ flex: 1, paddingVertical: scale(13), fontSize: rfValue(15), color: colors.gray800 }}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <View style={{ marginBottom: scale(24) }}>
            <Text style={{ fontSize: rfValue(13), fontWeight: '600', color: colors.gray600, marginBottom: scale(5) }}>
              Confirm Password
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
                style={{ flex: 1, paddingVertical: scale(13), fontSize: rfValue(15), color: colors.gray800 }}
                placeholder="Repeat your password"
                placeholderTextColor={colors.gray400}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <PressableScale>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: scale(15),
                alignItems: 'center',
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={{ fontSize: rfValue(16), fontWeight: '700', color: colors.white }}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </PressableScale>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: scale(18) }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
            <Text style={{ marginHorizontal: scale(12), fontSize: rfValue(13), color: colors.gray400 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
          </View>

          {/* Sign In Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: rfValue(14), color: colors.gray600 }}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateSignIn}>
              <Text style={{ fontSize: rfValue(14), fontWeight: '700', color: colors.primary }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

