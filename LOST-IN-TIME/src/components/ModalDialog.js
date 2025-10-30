import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

const TYPE_STYLES = {
  success: {
    icon: '✓',
    iconBackground: '#bbf7d0',
    iconColor: '#15803d',
  },
  error: {
    icon: '✕',
    iconBackground: '#fecaca',
    iconColor: '#b91c1c',
  },
  warning: {
    icon: '!',
    iconBackground: '#fde68a',
    iconColor: '#92400e',
  },
  info: {
    icon: 'ℹ',
    iconBackground: '#bae6fd',
    iconColor: '#075985',
  },
};

const BUTTON_VARIANTS = {
  primary: {
    backgroundColor: '#1d4ed8',
    textColor: '#f8fafc',
  },
  secondary: {
    backgroundColor: '#e2e8f0',
    textColor: '#1f2937',
  },
  danger: {
    backgroundColor: '#dc2626',
    textColor: '#fef2f2',
  },
};

function resolveType(type) {
  return TYPE_STYLES[type] ? type : 'info';
}

export default function ModalDialog({
  visible,
  title,
  message,
  type = 'info',
  actions,
  onClose,
}) {
  const { t } = useTranslation();
  const variant = resolveType(type);
  const visuals = TYPE_STYLES[variant];
  const fallbackTitle = t(`modals.defaultTitle.${variant}`);
  const resolvedTitle = title || fallbackTitle;
  const resolvedActions =
    actions && actions.length > 0
      ? actions
      : [
          {
            key: 'default-ok',
            label: t('modals.defaultAction'),
            variant: 'primary',
          },
        ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={[styles.iconWrapper, { backgroundColor: visuals.iconBackground }]}>
            <Text style={[styles.icon, { color: visuals.iconColor }]}>{visuals.icon}</Text>
          </View>
          <Text style={styles.title}>{resolvedTitle}</Text>
          <Text style={styles.message}>{message || ''}</Text>
          <View style={styles.actions}>
            {resolvedActions.map((action, index) => {
              const actionVariant = BUTTON_VARIANTS[action.variant] ? action.variant : 'primary';
              const key = action.key || `${actionVariant}-${index}`;

              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.button, { backgroundColor: BUTTON_VARIANTS[actionVariant].backgroundColor }]}
                  onPress={() => {
                    action.onPress?.();
                    if (action.dismissOnPress !== false) {
                      onClose?.();
                    }
                  }}
                >
                  <Text style={[styles.buttonText, { color: BUTTON_VARIANTS[actionVariant].textColor }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    columnGap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
