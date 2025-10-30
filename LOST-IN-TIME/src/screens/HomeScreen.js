import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Preferences')}
          accessibilityRole="button"
          accessibilityLabel={t('home.moreOptionsLabel')}
          accessibilityHint={t('home.moreOptionsHint')}
        >
          <Text style={styles.headerButtonText}>⋯</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

      <TouchableOpacity
        style={[styles.primaryButton, !isEditor && styles.disabledButton]}
        onPress={() => {
          if (!isEditor) {
            Alert.alert(t('accessControl.viewerTitle'), t('accessControl.viewerDescription'));
            return;
          }
          navigation.navigate('Register');
        }}
        accessibilityState={{ disabled: !isEditor }}
      >
        <Text style={styles.primaryButtonText}>{t('home.registerButton')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => navigation.navigate('RoomFilters')}
      >
        <Text style={styles.filterButtonText}>{t('home.filtersButton')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Text style={styles.calendarButtonText}>{t('home.calendarButton')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Table')}
      >
        <Text style={styles.secondaryButtonText}>{t('home.tableButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 32,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerButtonText: {
    fontSize: 28,
    lineHeight: 28,
    color: '#2563eb',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 14,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#0c4a6e',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  filterButton: {
    backgroundColor: '#bbf7d0',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterButtonText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  calendarButton: {
    backgroundColor: '#fef08a',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  calendarButtonText: {
    color: '#854d0e',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
