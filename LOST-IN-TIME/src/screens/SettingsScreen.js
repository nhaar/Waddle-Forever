import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();

  const handleNavigate = (route) => {
    if (!isEditor) {
      Alert.alert(t('accessControl.viewerTitle'), t('accessControl.viewerDescription'));
      return;
    }
    navigation.navigate(route);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>

      {!isEditor && (
        <View style={styles.restrictionBanner}>
          <Text style={styles.restrictionText}>{t('accessControl.settingsReadOnly')}</Text>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.actionButton, !isEditor && styles.actionButtonDisabled]}
          onPress={() => handleNavigate('IdRoomSettings')}
          accessibilityState={{ disabled: !isEditor }}
        >
          <Text style={styles.actionTitle}>{t('settings.idRoomsTitle')}</Text>
          <Text style={styles.actionDescription}>{t('settings.idRoomsDescription')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, !isEditor && styles.actionButtonDisabled]}
          onPress={() => handleNavigate('PartiesSettings')}
          accessibilityState={{ disabled: !isEditor }}
        >
          <Text style={styles.actionTitle}>{t('settings.partiesTitle')}</Text>
          <Text style={styles.actionDescription}>{t('settings.partiesDescription')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, !isEditor && styles.actionButtonDisabled]}
          onPress={() => handleNavigate('CalendarIconsSettings')}
          accessibilityState={{ disabled: !isEditor }}
        >
          <Text style={styles.actionTitle}>{t('settings.calendarIconsTitle')}</Text>
          <Text style={styles.actionDescription}>{t('settings.calendarIconsDescription')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, !isEditor && styles.actionButtonDisabled]}
          onPress={() => handleNavigate('CalendarHolidaysSettings')}
          accessibilityState={{ disabled: !isEditor }}
        >
          <Text style={styles.actionTitle}>{t('settings.calendarHolidaysTitle')}</Text>
          <Text style={styles.actionDescription}>{t('settings.calendarHolidaysDescription')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.lastActionButton, !isEditor && styles.actionButtonDisabled]}
          onPress={() => handleNavigate('ChecklistSettings')}
          accessibilityState={{ disabled: !isEditor }}
        >
          <Text style={styles.actionTitle}>{t('settings.checklistTitle')}</Text>
          <Text style={styles.actionDescription}>{t('settings.checklistDescription')}</Text>
        </TouchableOpacity>
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
  section: {
    marginTop: 8,
  },
  restrictionBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  restrictionText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  lastActionButton: {
    marginBottom: 0,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});
