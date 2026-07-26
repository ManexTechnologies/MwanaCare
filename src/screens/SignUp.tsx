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

  const handleSignUp = () => {
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
    setTimeout(() => {
      const result = signUp(name, email, password);
      setLoading(false);
      if (!result.success) {
        Alert.alert('Sign Up Failed', result.error);
      }
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? colors.primaryBg : colors.primaryBg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <MaterialCommunityIcons name="heart-pulse" size={36} color={colors.white} />
          </LinearGradient>
          <Text style={{ fontSize: 26, fontWeight: '800', color: colors.gray800 }}>Create Account</Text>
          <Text style={{ fontSize: 14, color: colors.gray500, marginTop: 4 }}>
            Join MwanaCare to track your health
          </Text>
        </View>

        {/* Sign Up Form */}
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 22, marginBottom: 24 }}>
          {/* Name */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>
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
                paddingHorizontal: 14,
              }}
            >
              <Feather name="user" size={18} color={colors.gray400} style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.gray800 }}
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
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>
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
                paddingHorizontal: 14,
              }}
            >
              <Feather name="mail" size={18} color={colors.gray400} style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.gray800 }}
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
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>
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
                paddingHorizontal: 14,
              }}
            >
              <Feather name="lock" size={18} color={colors.gray400} style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.gray800 }}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.gray400} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>
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
                paddingHorizontal: 14,
              }}
            >
              <Feather name="lock" size={18} color={colors.gray400} style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.gray800 }}
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
                paddingVertical: 15,
                alignItems: 'center',
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </PressableScale>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 18 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
            <Text style={{ marginHorizontal: 12, fontSize: 13, color: colors.gray400 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
          </View>

          {/* Sign In Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.gray600 }}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateSignIn}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

