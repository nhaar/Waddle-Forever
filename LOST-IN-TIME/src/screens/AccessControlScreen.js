import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalDialog from '../components/ModalDialog';
import { useAccessControl } from '../hooks/useAccessControl';
import { useTranslation } from '../hooks/useTranslation';

function formatTimestamp(timestamp, fallback) {
  if (!timestamp) {
    return fallback;
  }

  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return fallback;
    }

    return date.toLocaleString();
  } catch (error) {
    return fallback;
  }
}

export default function AccessControlScreen() {
  const { t } = useTranslation();
  const { isReady, isEditor, entries, unlockWithCode, lock, createAccessEntry, removeAccessEntry } =
    useAccessControl();
  const [unlockCode, setUnlockCode] = useState('');
  const [newCodeLabel, setNewCodeLabel] = useState('');
  const [newCodeValue, setNewCodeValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dialog, setDialog] = useState({ visible: false });

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt - a.createdAt;
        }
        return String(a.id).localeCompare(String(b.id));
      }),
    [entries]
  );
  const canManage = isEditor || entries.length === 0;
  const isBootstrap = !isEditor && entries.length === 0;

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
  };

  const clearFeedback = () => setFeedback(null);

  const handleUnlock = async () => {
    if (!unlockCode.trim()) {
      showFeedback('error', t('accessControl.errors.missingCode'));
      return;
    }

    setIsUnlocking(true);
    clearFeedback();

    try {
      const result = await unlockWithCode(unlockCode);
      if (result.success) {
        showFeedback('success', t('accessControl.feedback.unlockSuccess'));
        setUnlockCode('');
      } else if (result.error === 'invalid-code') {
        showFeedback('error', t('accessControl.errors.invalidCode'));
      } else {
        showFeedback('error', t('accessControl.errors.unknown'));
      }
    } catch (error) {
      console.error('Error while unlocking editing permissions:', error);
      showFeedback('error', t('accessControl.errors.unknown'));
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleLock = async () => {
    clearFeedback();
    try {
      await lock();
      showFeedback('success', t('accessControl.feedback.lockSuccess'));
    } catch (error) {
      console.error('Error while disabling editing permissions:', error);
      showFeedback('error', t('accessControl.errors.unknown'));
    }
  };

  const handleCreate = async () => {
    if (!newCodeValue.trim()) {
      showFeedback('error', t('accessControl.errors.missingCode'));
      return;
    }

    setIsCreating(true);
    clearFeedback();

    try {
      const result = await createAccessEntry({ label: newCodeLabel, code: newCodeValue });
      if (result.success) {
        showFeedback('success', t('accessControl.feedback.createSuccess'));
        setNewCodeLabel('');
        setNewCodeValue('');
      } else if (result.error === 'duplicated-code') {
        showFeedback('error', t('accessControl.errors.duplicatedCode'));
      } else if (result.error === 'missing-code') {
        showFeedback('error', t('accessControl.errors.missingCode'));
      } else {
        showFeedback('error', t('accessControl.errors.unknown'));
      }
    } catch (error) {
      if (error?.code === 'access-denied') {
        showFeedback('error', t('accessControl.errors.permissionDenied'));
      } else {
        console.error('Error while creating a new access code:', error);
        showFeedback('error', t('accessControl.errors.unknown'));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const confirmRemove = (entry) => {
    setDialog({
      visible: true,
      type: 'warning',
      title: t('accessControl.dialog.removeTitle'),
      message: t('accessControl.dialog.removeMessage', {
        label: entry.label || t('accessControl.entryLabelFallback'),
      }),
      actions: [
        { key: 'cancel', label: t('common.cancel'), variant: 'secondary' },
        {
          key: 'confirm',
          label: t('accessControl.removeButton'),
          variant: 'danger',
          onPress: async () => {
            try {
              const result = await removeAccessEntry(entry.id);
              if (result.success) {
                showFeedback('success', t('accessControl.feedback.removeSuccess'));
              } else {
                showFeedback('error', t('accessControl.errors.unknown'));
              }
            } catch (error) {
              if (error?.code === 'access-denied') {
                showFeedback('error', t('accessControl.errors.permissionDenied'));
              } else {
                console.error('Error while removing an access code:', error);
                showFeedback('error', t('accessControl.errors.unknown'));
              }
            } finally {
              setDialog({ visible: false });
            }
          },
        },
      ],
    });
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('accessControl.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('accessControl.title')}</Text>
      <Text style={styles.subtitle}>{t('accessControl.subtitle')}</Text>

      {feedback && (
        <Text
          style={[
            styles.feedback,
            feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess,
          ]}
        >
          {feedback.message}
        </Text>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('accessControl.statusTitle')}</Text>
        <Text style={styles.sectionDescription}>
          {isEditor ? t('accessControl.statusEditor') : t('accessControl.statusViewer')}
        </Text>

        {isEditor ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLock}>
            <Text style={styles.secondaryButtonText}>{t('accessControl.lockButton')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>{t('accessControl.unlockLabel')}</Text>
            <TextInput
              value={unlockCode}
              onChangeText={setUnlockCode}
              placeholder={t('accessControl.unlockPlaceholder')}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.primaryButton, isUnlocking && styles.disabledButton]}
              onPress={handleUnlock}
              disabled={isUnlocking}
            >
              <Text style={styles.primaryButtonText}>{t('accessControl.unlockButton')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {canManage && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {isBootstrap ? t('accessControl.bootstrapTitle') : t('accessControl.manageTitle')}
          </Text>
          <Text style={styles.sectionDescription}>
            {isBootstrap
              ? t('accessControl.bootstrapDescription')
              : t('accessControl.manageDescription')}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>{t('accessControl.labelField')}</Text>
            <TextInput
              value={newCodeLabel}
              onChangeText={setNewCodeLabel}
              placeholder={t('accessControl.createLabelPlaceholder')}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>{t('accessControl.codeField')}</Text>
            <TextInput
              value={newCodeValue}
              onChangeText={setNewCodeValue}
              placeholder={t('accessControl.createCodePlaceholder')}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, isCreating && styles.disabledButton]}
            onPress={handleCreate}
            disabled={isCreating}
          >
            <Text style={styles.primaryButtonText}>
              {isBootstrap
                ? t('accessControl.bootstrapButton')
                : t('accessControl.createButton')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('accessControl.entriesTitle')}</Text>
        {sortedEntries.length === 0 ? (
          <Text style={styles.sectionDescription}>{t('accessControl.entriesEmpty')}</Text>
        ) : (
          sortedEntries.map((entry) => {
            const label = entry.label || t('accessControl.entryLabelFallback');
            const formattedDate = formatTimestamp(
              entry.createdAt,
              t('accessControl.entryCreatedAtFallback')
            );
            return (
              <View key={entry.id} style={styles.entryRow}>
                <View style={styles.entryTextWrapper}>
                  <Text style={styles.entryLabel}>{label}</Text>
                  <Text style={styles.entryMeta}>
                    {t('accessControl.entryCreatedAt', { date: formattedDate })}
                  </Text>
                </View>
                {isEditor && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmRemove(entry)}
                  >
                    <Text style={styles.deleteButtonText}>{t('accessControl.removeButton')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>

      <ModalDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        actions={dialog.actions}
        onClose={() => setDialog({ visible: false })}
      />
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
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f8fafc',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0c4a6e',
    fontWeight: '600',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.7,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  entryTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  entryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  entryMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 13,
  },
  feedback: {
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  feedbackError: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  feedbackSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#475569',
  },
});
