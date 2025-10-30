import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

export default function ChecklistInput({
  label,
  items,
  onChange,
  hasConfiguredTemplates,
  editable = true,
}) {
  const { t } = useTranslation();

  const templateItems = items.filter((item) => !item.legacy);
  const legacyItems = items.filter((item) => item.legacy);
  const visibleItems = items.filter((item) => item.legacy || item.enabled !== false);
  const hasConfiguredItems = items.length > 0;
  const hasVisibleItems = visibleItems.length > 0;

  const handleToggle = (key) => {
    if (!editable) {
      return;
    }

    const target = items.find((item) => item.key === key);
    if (target?.enabled === false) {
      return;
    }
    const nextItems = items.map((item) =>
      item.key === key ? { ...item, checked: !item.checked } : item
    );
    onChange(nextItems);
  };

  const handleToggleAvailability = (key) => {
    if (!editable) {
      return;
    }

    const nextItems = items.map((item) => {
      if (item.key !== key) {
        return item;
      }
      const isEnabled = item.enabled !== false;
      const nextEnabled = !isEnabled;
      return {
        ...item,
        enabled: nextEnabled,
        checked: nextEnabled ? item.checked : false,
      };
    });
    onChange(nextItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {templateItems.length > 0 && (
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>{t('checklistInput.selectorLabel')}</Text>
          <View style={styles.selectorChips}>
            {templateItems.map((item) => {
              const isEnabled = item.enabled !== false;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.selectorChip,
                    isEnabled ? styles.selectorChipActive : styles.selectorChipInactive,
                  ]}
                  onPress={editable ? () => handleToggleAvailability(item.key) : undefined}
                  disabled={!editable}
                  activeOpacity={editable ? 0.7 : 1}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isEnabled }}
                >
                  <Text
                    style={[
                      styles.selectorChipText,
                      !isEnabled && styles.selectorChipTextInactive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.selectorHelper}>{t('checklistInput.selectorHelper')}</Text>
        </View>
      )}
      {!hasConfiguredItems && (
        <Text style={styles.emptyText}>{t('checklistInput.empty')}</Text>
      )}
      {hasConfiguredItems && !hasVisibleItems && (
        <Text style={styles.emptySelectionText}>{t('checklistInput.emptySelection')}</Text>
      )}
      {visibleItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.itemRow}
          onPress={editable ? () => handleToggle(item.key) : undefined}
          disabled={!editable}
          activeOpacity={editable ? 0.7 : 1}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.checked }}
        >
          <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
            {item.checked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.itemText, item.legacy && styles.legacyText]}>
            {item.name}
            {item.legacy ? t('checklistInput.legacySuffix') : ''}
          </Text>
        </TouchableOpacity>
      ))}
      {!hasConfiguredTemplates && (
        <Text style={styles.helperText}>{t('checklistInput.helperConfigure')}</Text>
      )}
      {legacyItems.length > 0 && (
        <Text style={styles.helperText}>{t('checklistInput.helperLegacy')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  selectorContainer: {
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  selectorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  selectorChip: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectorChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  selectorChipInactive: {
    opacity: 0.85,
  },
  selectorChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
  },
  selectorChipTextInactive: {
    color: '#475569',
  },
  selectorHelper: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#94a3b8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 14,
  },
  itemText: {
    color: '#0f172a',
    fontSize: 14,
    flex: 1,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
  },
  emptySelectionText: {
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  legacyText: {
    color: '#ca8a04',
  },
});
