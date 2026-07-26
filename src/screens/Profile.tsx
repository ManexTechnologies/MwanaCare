import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation, LANGUAGES } from '../i18n';
import { FAQ_ITEMS, FAQ_TRANSLATIONS } from '../data';
import { BoxIcon, AnimatedCard, GlassCard, PressableScale, ToggleSwitch, SettingsModal } from '../components';
import { usePersistedState } from '../storage/usePersistedState';
import { useAuth } from '../context/AuthContext';
import { Language, NotificationSettings, AppPreferences, UnitSystem, SettingsState } from '../types';

const DEFAULT_SETTINGS: SettingsState = {
  notifications: {
    pushNotifications: true,
    vaccineReminders: true,
    weeklyTips: false,
    soundEnabled: true,
  } as NotificationSettings,
  language: 'english' as Language,
  preferences: {
    darkMode: false,
    unitSystem: 'metric' as UnitSystem,
    dataSaver: false,
  } as AppPreferences,
};

export function Profile() {
  const { t, setLocale } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();
  const { signOut, currentUser, updateProfile } = useAuth();
  const [settings, setSettings] = usePersistedState<SettingsState>('appSettings', DEFAULT_SETTINGS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBabyName, setEditBabyName] = useState(currentUser?.babyName || '');
  const [editDueDate, setEditDueDate] = useState(currentUser?.dueDate || '');

  const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updateLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
    setLocale(lang);
  };

  const updatePreferences = (key: keyof AppPreferences, value: boolean | UnitSystem) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value as any },
    }));
  };

  const currentLang = LANGUAGES.find((l) => l.key === settings.language);

  const getLocalizedFaq = (faq: typeof FAQ_ITEMS[0]) => {
    const locale = settings.language;
    if (locale === 'english') {
      return FAQ_TRANSLATIONS[faq.question] || { question: faq.question, answer: faq.answer };
    }
    const localizedKey = `${locale}.${faq.question}`;
    return FAQ_TRANSLATIONS[localizedKey] || FAQ_TRANSLATIONS[faq.question] || { question: faq.question, answer: faq.answer };
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editName.trim() || currentUser?.name,
        babyName: editBabyName.trim() || undefined,
        dueDate: editDueDate.trim() || undefined,
      });
      setShowEditProfile(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor: colors.primaryBg }} showsVerticalScrollIndicator={false}>
      <AnimatedCard delay={0}>
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoxIcon icon="account-circle" size={22} color={colors.indigo} bgColor={colors.indigo + '15'} containerSize={40} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 4, marginTop: 4 }}>{t('profile.title')}</Text>
              <Text style={{ fontSize: 13, color: colors.gray500, marginTop: -4, marginBottom: 12 }}>{t('profile.subtitle')}</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: 20 }} noBorder>
          <LinearGradient colors={isDark ? [colors.gray50, colors.gray50] : ['#EEF2FF', '#E0E7FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 18, padding: 24, alignItems: 'center' }}>
            <View style={{ position: 'relative', marginBottom: 14 }}>
              <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 36, fontWeight: '800', color: colors.white }}>M</Text>
              </LinearGradient>
              <View style={{ position: 'absolute', bottom: 0, right: -2, backgroundColor: colors.white, borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="verified" size={16} color={colors.info} />
              </View>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 6 }}>{currentUser?.name || t('profile.name')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <MaterialIcons name="calendar-today" size={14} color={colors.gray500} />
              <Text style={{ fontSize: 13, color: colors.gray500 }}> {currentUser?.dueDate ? `Due: ${new Date(currentUser.dueDate).toLocaleDateString()}` : t('profile.dob_not_set')}</Text>
            </View>
            <PressableScale>
              <TouchableOpacity
                onPress={() => setShowEditProfile(true)}
                style={{ backgroundColor: colors.white, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary + '30' }}>
                <Feather name="edit-2" size={14} color={colors.primary} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}> {t('profile.edit')}</Text>
              </TouchableOpacity>
            </PressableScale>
          </LinearGradient>
        </GlassCard>
      </AnimatedCard>

      {/* Edit Profile Modal */}
      <SettingsModal visible={showEditProfile} title="Edit Profile" onClose={() => setShowEditProfile(false)}>
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>Full Name</Text>
          <TextInput
            style={{ backgroundColor: colors.gray50, borderRadius: 10, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 }}
            placeholder="Your name"
            placeholderTextColor={colors.gray400}
            value={editName}
            onChangeText={setEditName}
          />
        </View>
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>Baby's Name</Text>
          <TextInput
            style={{ backgroundColor: colors.gray50, borderRadius: 10, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 }}
            placeholder="Baby's name (optional)"
            placeholderTextColor={colors.gray400}
            value={editBabyName}
            onChangeText={setEditBabyName}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray600, marginBottom: 5 }}>Due Date</Text>
          <TextInput
            style={{ backgroundColor: colors.gray50, borderRadius: 10, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray400}
            value={editDueDate}
            onChangeText={setEditDueDate}
          />
        </View>
        <PressableScale>
          <TouchableOpacity
            onPress={handleSaveProfile}
            style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.white }}>Save Changes</Text>
          </TouchableOpacity>
        </PressableScale>
      </SettingsModal>

      <AnimatedCard delay={150}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800, marginBottom: 12, marginTop: 4 }}>{t('settings.title')}</Text>
      </AnimatedCard>

      <AnimatedCard delay={180}>
        <GlassCard intensity={isDark ? 'heavy' : 'light'} style={{ marginBottom: 20 }} noBorder>
          {/* Notifications */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 }}
            onPress={() => setActiveModal('notifications')}>
            <BoxIcon icon="bell-outline" size={18} color={colors.primary} bgColor={colors.primary + '12'} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray800 }}>{t('settings.notifications')}</Text>
            <View style={{ backgroundColor: colors.gray100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gray600 }}>{settings.notifications.pushNotifications ? t('stat.on') : t('stat.off')}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.gray300} />
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 }}
            onPress={() => setActiveModal('language')}>
            <BoxIcon icon="earth" size={18} color={colors.secondary} bgColor={colors.secondary + '12'} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray800 }}>{t('settings.language')}</Text>
            <View style={{ backgroundColor: colors.gray100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gray600 }}>{currentLang?.label || 'English'}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.gray300} />
          </TouchableOpacity>

          {/* App Preferences */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 }}
            onPress={() => setActiveModal('preferences')}>
            <BoxIcon icon="tune" size={18} color={colors.teal} bgColor={colors.teal + '12'} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray800 }}>{t('settings.preferences')}</Text>
            <Feather name="chevron-right" size={20} color={colors.gray300} />
          </TouchableOpacity>

          {/* Export Data */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 }}
            onPress={() => setActiveModal('export')}>
            <BoxIcon icon="file-export-outline" size={18} color={colors.accent} bgColor={colors.accent + '12'} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray800 }}>{t('settings.export')}</Text>
            <Feather name="chevron-right" size={20} color={colors.gray300} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 }}
            onPress={() => setActiveModal('help')}>
            <BoxIcon icon="help-circle-outline" size={18} color={colors.rose} bgColor={colors.rose + '12'} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray800 }}>{t('settings.help')}</Text>
            <Feather name="chevron-right" size={20} color={colors.gray300} />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 }}
            onPress={() => setActiveModal('about')}>
            <BoxIcon icon="information-outline" size={18} color={colors.gray600} bgColor={colors.gray100} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray800 }}>{t('settings.about')}</Text>
            <Feather name="chevron-right" size={20} color={colors.gray300} />
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 }}
            onPress={handleSignOut}>
            <BoxIcon icon="logout" size={18} color={colors.error} bgColor={colors.error + '12'} containerSize={34} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.error }}>Sign Out</Text>
            <Feather name="log-out" size={18} color={colors.error} />
          </TouchableOpacity>
        </GlassCard>
      </AnimatedCard>

      {/* ---- Notifications Modal ---- */}
      <SettingsModal visible={activeModal === 'notifications'} title={t('notifications.title')} onClose={() => setActiveModal(null)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="notifications-active" size={20} color={colors.primary} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('notifications.push')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('notifications.push_desc')}</Text>
            </View>
          </View>
          <ToggleSwitch value={settings.notifications.pushNotifications} onValueChange={(v) => updateNotifications('pushNotifications', v)} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="vaccines" size={20} color={colors.secondary} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('notifications.vaccine')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('notifications.vaccine_desc')}</Text>
            </View>
          </View>
          <ToggleSwitch value={settings.notifications.vaccineReminders} onValueChange={(v) => updateNotifications('vaccineReminders', v)} disabled={!settings.notifications.pushNotifications} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="lightbulb-outline" size={20} color={colors.accent} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('notifications.weekly')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('notifications.weekly_desc')}</Text>
            </View>
          </View>
          <ToggleSwitch value={settings.notifications.weeklyTips} onValueChange={(v) => updateNotifications('weeklyTips', v)} disabled={!settings.notifications.pushNotifications} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="volume-up" size={20} color={colors.info} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('notifications.sound')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('notifications.sound_desc')}</Text>
            </View>
          </View>
          <ToggleSwitch value={settings.notifications.soundEnabled} onValueChange={(v) => updateNotifications('soundEnabled', v)} disabled={!settings.notifications.pushNotifications} />
        </View>
      </SettingsModal>

      {/* ---- Language Modal ---- */}
      <SettingsModal visible={activeModal === 'language'} title={t('language.title')} onClose={() => setActiveModal(null)}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity key={lang.key}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}
            onPress={() => updateLanguage(lang.key)} activeOpacity={0.7}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{lang.label}</Text>
                <Text style={{ fontSize: 13, color: colors.gray500 }}>{lang.native}</Text>
              </View>
            </View>
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: settings.language === lang.key ? colors.primary : colors.gray300, alignItems: 'center', justifyContent: 'center' }}>
              {settings.language === lang.key && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary }} />}
            </View>
          </TouchableOpacity>
        ))}
      </SettingsModal>

      {/* ---- App Preferences Modal ---- */}
      <SettingsModal visible={activeModal === 'preferences'} title={t('preferences.title')} onClose={() => setActiveModal(null)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="dark-mode" size={20} color={colors.indigo} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('preferences.dark_mode')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('preferences.dark_mode_desc')}</Text>
            </View>
          </View>
          <ToggleSwitch value={settings.preferences.darkMode} onValueChange={(v) => { updatePreferences('darkMode', v); toggleTheme(); }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="straighten" size={20} color={colors.primary} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('preferences.units')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{settings.preferences.unitSystem === 'metric' ? t('preferences.units_metric') : t('preferences.units_imperial')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: settings.preferences.unitSystem === 'metric' ? colors.primary + '15' : colors.gray100, borderWidth: 1.5, borderColor: settings.preferences.unitSystem === 'metric' ? colors.primary : colors.gray200 }}
              onPress={() => updatePreferences('unitSystem', 'metric')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: settings.preferences.unitSystem === 'metric' ? colors.primary : colors.gray500 }}>Metric</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: settings.preferences.unitSystem === 'imperial' ? colors.primary + '15' : colors.gray100, borderWidth: 1.5, borderColor: settings.preferences.unitSystem === 'imperial' ? colors.primary : colors.gray200 }}
              onPress={() => updatePreferences('unitSystem', 'imperial')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: settings.preferences.unitSystem === 'imperial' ? colors.primary : colors.gray500 }}>Imperial</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="savings" size={20} color={colors.success} />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('preferences.data_saver')}</Text>
              <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('preferences.data_saver_desc')}</Text>
            </View>
          </View>
          <ToggleSwitch value={settings.preferences.dataSaver} onValueChange={(v) => updatePreferences('dataSaver', v)} />
        </View>
      </SettingsModal>

      {/* ---- Export Data Modal ---- */}
      <SettingsModal visible={activeModal === 'export'} title={t('export.title')} onClose={() => setActiveModal(null)}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <BoxIcon icon="file-pdf-box" size={18} color={colors.error} bgColor={colors.error + '12'} containerSize={34} />
          <View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('export.pdf')}</Text>
            <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('export.pdf_desc')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <BoxIcon icon="file-delimited-outline" size={18} color={colors.success} bgColor={colors.success + '12'} containerSize={34} />
          <View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('export.csv')}</Text>
            <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('export.csv_desc')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 0 }}>
          <BoxIcon icon="share-variant-outline" size={18} color={colors.primary} bgColor={colors.primary + '12'} containerSize={34} />
          <View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray800 }}>{t('export.share')}</Text>
            <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 2 }}>{t('export.share_desc')}</Text>
          </View>
        </TouchableOpacity>
      </SettingsModal>

      {/* ---- Help & Support Modal ---- */}
      <SettingsModal visible={activeModal === 'help'} title={t('help.title')} onClose={() => setActiveModal(null)}>
        <View style={{ backgroundColor: colors.primaryBg, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.primary + '20' }}>
          <MaterialIcons name="support-agent" size={28} color={colors.primary} style={{ marginBottom: 8 }} />
          <Text style={{ fontSize: 13, color: colors.gray600, lineHeight: 19, marginBottom: 12 }}>{t('help.contact_text')}</Text>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' }}>
            <MaterialIcons name="mail-outline" size={18} color={colors.white} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>  {t('help.contact_button')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.gray800, marginBottom: 12 }}>{t('help.faq')}</Text>
        {FAQ_ITEMS.map((faq, idx) => {
          const localized = getLocalizedFaq(faq);
          const isExpanded = expandedFaq === faq.question;
          return (
            <View key={idx} style={{ borderRadius: 12, marginBottom: 10, backgroundColor: colors.gray50, overflow: 'hidden' }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, gap: 8 }}
                onPress={() => setExpandedFaq(isExpanded ? null : faq.question)} activeOpacity={0.7}>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: colors.gray800, lineHeight: 20 }}>{localized.question}</Text>
                <MaterialIcons name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color={colors.gray500} />
              </TouchableOpacity>
              {isExpanded && (
                <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                  <Text style={{ fontSize: 13, color: colors.gray600, lineHeight: 19 }}>{localized.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </SettingsModal>

      {/* ---- About Modal ---- */}
      <SettingsModal visible={activeModal === 'about'} title={t('about.title')} onClose={() => setActiveModal(null)}>
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <LinearGradient colors={[colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <MaterialCommunityIcons name="heart-pulse" size={32} color={colors.white} />
          </LinearGradient>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray800 }}>MwanaCare</Text>
          <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>{t('about.description')}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.gray600 }}>{t('about.version')}</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.gray800 }}>1.0.0</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.gray600 }}>{t('about.build')}</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.gray800 }}>2025.1</Text>
        </View>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary }}>{t('about.licenses')}</Text>
          <MaterialIcons name="open-in-new" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary }}>{t('about.privacy')}</Text>
          <MaterialIcons name="open-in-new" size={18} color={colors.primary} />
        </TouchableOpacity>
      </SettingsModal>

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

