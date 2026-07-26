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

export function SignIn({ onNavigateSignUp }: { onNavigateSignUp: () => void }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      const result = signIn(email, password);
      setLoading(false);
      if (!result.success) {
        Alert.alert('Sign In Failed', result.error);
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
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons name="heart-pulse" size={40} color={colors.white} />
          </LinearGradient>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.gray800 }}>{t('app.name')}</Text>
          <Text style={{ fontSize: 14, color: colors.gray500, marginTop: 4 }}>{t('app.tagline')}</Text>
        </View>

        {/* Sign In Form */}
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ padding: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.gray800, marginBottom: 4 }}>
            Welcome Back
          </Text>
          <Text style={{ fontSize: 14, color: colors.gray500, marginBottom: 24 }}>
            Sign in to access your health records
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 6 }}>
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
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: colors.gray800 }}
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
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 6 }}>
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
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: colors.gray800 }}
                placeholder="Enter your password"
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

          {/* Sign In Button */}
          <PressableScale>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 15,
                alignItems: 'center',
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </PressableScale>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
            <Text style={{ marginHorizontal: 12, fontSize: 13, color: colors.gray400 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray200 }} />
          </View>

          {/* Sign Up Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.gray600 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateSignUp}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

