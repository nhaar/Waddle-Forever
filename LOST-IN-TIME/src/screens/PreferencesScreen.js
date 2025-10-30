import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useSettings } from '../context/SettingsContext';
import { useAccessControl } from '../hooks/useAccessControl';

export default function PreferencesScreen({ navigation }) {
  const { t, language, languageOptions } = useTranslation();
  const { setLanguage } = useSettings();
  const { isEditor } = useAccessControl();
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  const handleOpenSettings = () => {
    navigation.navigate('Settings');
  };

  const handleChangeLanguage = async (nextLanguage) => {
    if (!nextLanguage || nextLanguage === language || isUpdatingLanguage) {
      return;
    }

    try {
      setIsUpdatingLanguage(true);
      await setLanguage(nextLanguage);
    } catch (error) {
      console.error('Error updating language preference:', error);
      Alert.alert(t('modals.defaultTitle.error'), t('alerts.languageUpdateError'));
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('home.otherSettingsTitle')}</Text>
      <Text style={styles.subtitle}>{t('preferences.subtitle')}</Text>

      <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
        <Text style={styles.settingsButtonText}>{t('home.manageDefaultsButton')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accessButton}
        onPress={() => navigation.navigate('AccessControl')}
      >
        <Text style={styles.accessButtonText}>{t('accessControl.preferencesButton')}</Text>
      </TouchableOpacity>

      <View style={styles.languageCard}>
        <View style={styles.languageHeader}>
          <Text style={styles.languageLabel}>{t('home.languageLabel')}</Text>
          <Text style={styles.languageDescription}>{t('home.languageDescription')}</Text>
        </View>
        <View style={styles.languageOptions}>
          {languageOptions.map((option) => {
            const isActive = option.key === language;
            const isDisabled = isActive || isUpdatingLanguage;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.languageButton,
                  isActive && styles.languageButtonActive,
                  isDisabled && styles.languageButtonDisabled,
                ]}
                onPress={() => handleChangeLanguage(option.key)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    isActive && styles.languageButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#0c4a6e',
    fontWeight: '600',
    fontSize: 15,
  },
  accessButton: {
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  accessButtonText: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 15,
  },
  languageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  languageHeader: {
    marginBottom: 12,
  },
  languageLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 12,
  },
  languageButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  languageButtonDisabled: {
    opacity: 0.75,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  languageButtonTextActive: {
    color: '#f8fafc',
  },
});
