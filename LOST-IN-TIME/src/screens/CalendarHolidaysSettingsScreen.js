import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormField from '../components/FormField';
import ModalDialog from '../components/ModalDialog';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';
import { storage } from '../services/firebase';
import { ensureISODate, formatDateForDisplay, isoToDate, toISODate } from '../utils/dateRanges';
import CachedImage from '../components/CachedImage';

const EMPTY_FORM = { name: '', date: '', iconKey: '' };

const ICON_STORAGE_FOLDER = 'calendarHolidayIcons';

function inferExtension(mimeType) {
  switch (mimeType) {
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    default:
      return '.jpg';
  }
}

function buildStoragePath(mimeType) {
  const extension = inferExtension(mimeType ?? '');
  const uniqueId = Math.random().toString(36).slice(2, 10);
  return `${ICON_STORAGE_FOLDER}/holiday-icon-${Date.now()}-${uniqueId}${extension}`;
}

async function removeIconFromStorage(path) {
  if (typeof path !== 'string') {
    return;
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return;
  }

  try {
    const fileRef = ref(storage, trimmed);
    await deleteObject(fileRef);
  } catch (error) {
    console.error(`Error al eliminar el icono ${trimmed} del almacenamiento:`, error);
  }
}

async function uploadIconAsset(asset) {
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const storagePath = buildStoragePath(asset.mimeType);
  const fileRef = ref(storage, storagePath);

  try {
    await uploadBytes(fileRef, blob, {
      contentType: asset.mimeType || 'image/jpeg',
    });
    const url = await getDownloadURL(fileRef);
    return { url, storagePath };
  } finally {
    blob.close?.();
  }
}

export default function CalendarHolidaysSettingsScreen({ navigation }) {
  const {
    calendarHolidays,
    calendarIcons,
    calendarHolidayIcons,
    addCalendarHolidayIcon,
    deleteCalendarHolidayIcon,
    addCalendarHoliday,
    updateCalendarHoliday,
    deleteCalendarHoliday,
  } = useSettings();
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();
  const isReadOnly = !isEditor;
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingKey, setEditingKey] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [dialog, setDialog] = useState({ visible: false });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
  const [webDateDraft, setWebDateDraft] = useState('');
  const [iconDraft, setIconDraft] = useState(null);
  const [iconDraftName, setIconDraftName] = useState('');
  const [localIconPreview, setLocalIconPreview] = useState(null);

  const sortedHolidays = useMemo(() => {
    return [...calendarHolidays]
      .map((entry) => ({ ...entry, name: entry.name?.trim() ?? '', date: entry.date }))
      .sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name, undefined, {
          sensitivity: 'base',
        });
        if (nameCompare !== 0) {
          return nameCompare;
        }
        return (a.date || '').localeCompare(b.date || '');
      });
  }, [calendarHolidays]);

  const selectedIcon = useMemo(() => {
    if (iconDraft?.uri) {
      return {
        url: iconDraft.uri,
        name: iconDraftName?.trim() || form.name || '',
      };
    }

    if (form.iconKey && localIconPreview && localIconPreview.key === form.iconKey) {
      return localIconPreview;
    }

    const holidayIcon = calendarHolidayIcons.find((icon) => icon.key === form.iconKey);
    if (holidayIcon) {
      return holidayIcon;
    }

    return calendarIcons.find((icon) => icon.key === form.iconKey) ?? null;
  }, [
    calendarHolidayIcons,
    calendarIcons,
    form.iconKey,
    form.name,
    iconDraft,
    iconDraftName,
    localIconPreview,
  ]);

  const pickerDate = useMemo(() => isoToDate(form.date) || new Date(), [form.date]);
  const isWeb = Platform.OS === 'web';
  const webDateIsValid = useMemo(() => Boolean(ensureISODate(webDateDraft)), [webDateDraft]);

  useEffect(() => {
    if (localIconPreview && form.iconKey !== localIconPreview.key) {
      setLocalIconPreview(null);
    }
  }, [form.iconKey, localIconPreview]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingKey(null);
    setIconDraft(null);
    setIconDraftName('');
    setLocalIconPreview(null);
  };

  const handleSubmit = async () => {
    if (isReadOnly) {
      return;
    }

    const name = form.name.trim();
    const normalizedDate = ensureISODate(form.date);
    let iconKey = form.iconKey ? form.iconKey.trim() : '';
    const draftName = iconDraftName.trim();

    if (!name || !normalizedDate) {
      setFeedback({
        type: 'error',
        message: t('calendarHolidays.feedback.missingFields'),
      });
      return;
    }

    if (iconDraft?.uri) {
      const resolvedName = draftName || name;
      if (!resolvedName) {
        setFeedback({
          type: 'error',
          message: t('calendarHolidays.feedback.iconMissingName'),
        });
        return;
      }
    }

    const duplicate = calendarHolidays.some(
      (entry) =>
        entry.key !== editingKey &&
        entry.name.trim().toLowerCase() === name.toLowerCase() &&
        entry.date === normalizedDate
    );

    if (duplicate) {
      setFeedback({
        type: 'error',
        message: t('calendarHolidays.feedback.duplicate'),
      });
      return;
    }

    let uploadResult = null;
    let createdIconKey = null;

    try {
      let nextEditingKey = editingKey;

      if (iconDraft?.uri) {
        const resolvedName = draftName || name;
        uploadResult = await uploadIconAsset(iconDraft);

        const iconPayload = {
          name: resolvedName,
          url: uploadResult.url,
          storagePath: uploadResult.storagePath,
        };

        const createdIcon = await addCalendarHolidayIcon(iconPayload);
        if (!createdIcon) {
          throw new Error('icon-create-failed');
        }

        createdIconKey = createdIcon.key ?? null;
        iconKey = createdIconKey || iconKey;
        setLocalIconPreview({ ...iconPayload, key: createdIconKey || iconKey });
        setIconDraft(null);
        setIconDraftName('');
      }

      const payload = {
        name,
        date: normalizedDate,
        iconKey: iconKey || undefined,
      };

      if (editingKey) {
        const updated = await updateCalendarHoliday(editingKey, payload);
        if (!updated) {
          if (createdIconKey && uploadResult?.storagePath) {
            await deleteCalendarHolidayIcon(createdIconKey);
            await removeIconFromStorage(uploadResult.storagePath);
          }
          setFeedback({ type: 'error', message: t('calendarHolidays.feedback.saveError') });
          return;
        }
        setFeedback({ type: 'success', message: t('calendarHolidays.feedback.updated') });
      } else {
        const created = await addCalendarHoliday(payload);
        if (!created) {
          if (createdIconKey && uploadResult?.storagePath) {
            await deleteCalendarHolidayIcon(createdIconKey);
            await removeIconFromStorage(uploadResult.storagePath);
          }
          setFeedback({ type: 'error', message: t('calendarHolidays.feedback.saveError') });
          return;
        }
        setFeedback({ type: 'success', message: t('calendarHolidays.feedback.created') });
        nextEditingKey = created.key ?? nextEditingKey;
      }

      setForm({ name, date: normalizedDate, iconKey: iconKey || '' });
      setEditingKey(nextEditingKey);
    } catch (error) {
      console.error('Error al guardar un día festivo en Firestore:', error);
      if (createdIconKey && uploadResult?.storagePath) {
        await deleteCalendarHolidayIcon(createdIconKey);
        await removeIconFromStorage(uploadResult.storagePath);
      }
      if (iconDraft?.uri) {
        setIconDraft(iconDraft);
      }
      setIconDraftName(draftName);
      setFeedback({ type: 'error', message: t('calendarHolidays.feedback.saveError') });
    }
  };

  const handleEdit = (entry) => {
    setForm({ name: entry.name, date: entry.date, iconKey: entry.iconKey ?? '' });
    setEditingKey(entry.key);
    setFeedback(null);
    setIconDraft(null);
    setIconDraftName('');
    setLocalIconPreview(null);
  };

  const handleDelete = (entry) => {
    if (isReadOnly) {
      return;
    }

    setDialog({
      visible: true,
      type: 'warning',
      title: t('calendarHolidays.dialogs.deleteTitle'),
      message: t('calendarHolidays.dialogs.deleteMessage', {
        name: entry.name,
        date: formatDateForDisplay(entry.date) ?? entry.date,
      }),
      actions: [
        { key: 'cancel', label: t('common.cancel'), variant: 'secondary' },
        {
          key: 'confirm',
          label: t('common.delete'),
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteCalendarHoliday(entry.key);
              if (entry.key === editingKey) {
                resetForm();
              }
              setFeedback({
                type: 'success',
                message: t('calendarHolidays.feedback.deleted'),
              });
            } catch (error) {
              console.error('Error al eliminar un día festivo en Firestore:', error);
              setFeedback({ type: 'error', message: t('calendarHolidays.feedback.deleteError') });
            }
          },
        },
      ],
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setFeedback(null);
  };

  const handleOpenDatePicker = () => {
    if (isReadOnly) {
      return;
    }

    if (isWeb) {
      setWebDateDraft(form.date || '');
    }
    setIsDatePickerVisible(true);
  };

  const handleConfirmWebDate = () => {
    if (isReadOnly || !webDateIsValid) {
      return;
    }

    const normalized = ensureISODate(webDateDraft);
    if (!normalized) {
      return;
    }
    setForm((prev) => ({ ...prev, date: normalized }));
    setIsDatePickerVisible(false);
  };

  const handleNativeDateChange = (event, selectedDate) => {
    if (isReadOnly) {
      return;
    }

    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') {
        setIsDatePickerVisible(false);
        return;
      }
      if (selectedDate instanceof Date) {
        const iso = toISODate(selectedDate);
        if (iso) {
          setForm((prev) => ({ ...prev, date: iso }));
        }
      }
      setIsDatePickerVisible(false);
      return;
    }

    if (selectedDate instanceof Date) {
      const iso = toISODate(selectedDate);
      if (iso) {
        setForm((prev) => ({ ...prev, date: iso }));
      }
    }
  };

  const handleSelectIcon = (nextIconKey) => {
    if (isReadOnly) {
      return;
    }

    setForm((prev) => ({ ...prev, iconKey: nextIconKey || '' }));
    setIsIconPickerVisible(false);
    setIconDraft(null);
    setIconDraftName('');
    setLocalIconPreview(null);
  };

  const handlePickNewIcon = async () => {
    if (isReadOnly) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      setFeedback({
        type: 'error',
        message: t('calendarHolidays.feedback.iconPermissionDenied'),
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset) {
      setFeedback({
        type: 'error',
        message: t('calendarHolidays.feedback.iconLoadError'),
      });
      return;
    }

    const defaultName = form.name.trim() || iconDraftName.trim();
    setIconDraft({ uri: asset.uri, mimeType: asset.mimeType, previousIconKey: form.iconKey || '' });
    setIconDraftName(defaultName);
    setForm((prev) => ({ ...prev, iconKey: '' }));
    setLocalIconPreview(null);
    setFeedback({ type: 'success', message: t('calendarHolidays.feedback.iconSelected') });
  };

  const handleClearIconDraft = () => {
    setIconDraft((prev) => {
      if (prev?.previousIconKey !== undefined) {
        setForm((current) => ({ ...current, iconKey: prev.previousIconKey }));
      }
      return null;
    });
    setIconDraftName('');
    setLocalIconPreview(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isReadOnly ? (
        <View style={styles.readOnlyBanner}>
          <Text style={styles.readOnlyBannerTitle}>{t('accessControl.readOnlyTitle')}</Text>
          <Text style={styles.readOnlyBannerDescription}>
            {t('accessControl.readOnlyDescription')}
          </Text>
          <TouchableOpacity
            style={styles.readOnlyBannerButton}
            onPress={() => navigation.navigate('AccessControl')}
            activeOpacity={0.8}
          >
            <Text style={styles.readOnlyBannerButtonText}>
              {t('accessControl.requestAccessButton')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View pointerEvents={isReadOnly ? 'none' : 'auto'}>
      <Text style={styles.title}>{t('calendarHolidays.title')}</Text>
      <Text style={styles.description}>{t('calendarHolidays.description')}</Text>

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

      <View style={styles.form}>
        <FormField
          label={t('calendarHolidays.form.nameLabel')}
          value={form.name}
          onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
          placeholder={t('calendarHolidays.form.namePlaceholder')}
          editable={!isReadOnly}
        />

        <View style={styles.dateField}>
          <Text style={styles.dateFieldLabel}>{t('calendarHolidays.form.dateLabel')}</Text>
          <TouchableOpacity style={styles.dateFieldButton} onPress={handleOpenDatePicker}>
            <Text style={styles.dateFieldValue}>
              {form.date
                ? formatDateForDisplay(form.date) || form.date
                : t('calendarHolidays.form.datePlaceholder')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconField}>
          <Text style={styles.iconFieldLabel}>{t('calendarHolidays.form.iconLabel')}</Text>
          <View style={styles.iconPreviewContainer}>
            {selectedIcon?.url ? (
              <CachedImage
                uri={selectedIcon.url}
                storagePath={selectedIcon.storagePath}
                cacheKey={selectedIcon.key}
                style={styles.iconPreviewImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.iconPreviewPlaceholderText}>
                {t('calendarHolidays.form.iconPreviewPlaceholder')}
              </Text>
            )}
          </View>
          {selectedIcon?.name ? (
            <Text style={styles.iconPreviewLabel}>{selectedIcon.name}</Text>
          ) : null}
          {iconDraft ? (
            <FormField
              label={t('calendarHolidays.form.iconNameLabel')}
              value={iconDraftName}
              onChangeText={(value) => setIconDraftName(value)}
              placeholder={t('calendarHolidays.form.iconNamePlaceholder')}
              editable={!isReadOnly}
            />
          ) : null}
        <View style={styles.iconActionRow}>
          <TouchableOpacity
            style={[styles.iconActionButton, styles.iconSelectButton, isReadOnly && styles.disabledButton]}
            onPress={() => setIsIconPickerVisible(true)}
          >
            <Text style={styles.iconActionButtonText}>
              {t('calendarHolidays.form.iconChooseButton')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconActionButton, styles.iconUploadButton, isReadOnly && styles.disabledButton]}
            onPress={handlePickNewIcon}
          >
            <Text style={[styles.iconActionButtonText, styles.iconUploadButtonText]}>
              {t('calendarHolidays.form.iconUploadButton')}
            </Text>
          </TouchableOpacity>
        </View>
        {iconDraft ? (
          <TouchableOpacity
            style={[styles.iconClearButton, isReadOnly && styles.disabledButton]}
            onPress={handleClearIconDraft}
            activeOpacity={isReadOnly ? 1 : 0.7}
          >
            <Text style={styles.iconClearButtonText}>
              {t('calendarHolidays.form.iconClearButton')}
            </Text>
          </TouchableOpacity>
        ) : null}
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity
            style={[styles.saveButton, isReadOnly && styles.disabledButton]}
            onPress={handleSubmit}
            activeOpacity={isReadOnly ? 1 : 0.7}
          >
            <Text style={styles.saveButtonText}>
              {editingKey ? t('common.update') : t('common.save')}
            </Text>
          </TouchableOpacity>
          {editingKey ? (
            <TouchableOpacity
              style={[styles.cancelButton, isReadOnly && styles.disabledButton]}
              onPress={handleCancelEdit}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>{t('calendarHolidays.listTitle')}</Text>
        {sortedHolidays.length === 0 ? (
          <Text style={styles.emptyState}>{t('calendarHolidays.listEmpty')}</Text>
        ) : (
          sortedHolidays.map((entry) => {
            const icon =
              calendarHolidayIcons.find((item) => item.key === entry.iconKey) ||
              calendarIcons.find((item) => item.key === entry.iconKey);
            return (
              <View key={entry.key} style={styles.entryCard}>
                <View style={styles.entryInfo}>
                  <View style={styles.entryHeaderRow}>
                    {icon ? (
                      <CachedImage
                        uri={icon.url}
                        storagePath={icon.storagePath}
                        cacheKey={icon.key}
                        style={styles.entryIcon}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text style={styles.entryName}>{entry.name}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {formatDateForDisplay(entry.date) || entry.date}
                  </Text>
                </View>
                <View style={styles.entryActions}>
                  <TouchableOpacity
                    style={[styles.entryButton, isReadOnly && styles.disabledButton]}
                    onPress={() => handleEdit(entry)}
                  >
                    <Text style={styles.entryButtonText}>{t('common.edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.entryButton, styles.entryDeleteButton, isReadOnly && styles.disabledButton]}
                    onPress={() => handleDelete(entry)}
                    activeOpacity={isReadOnly ? 1 : 0.7}
                  >
                    <Text style={[styles.entryButtonText, styles.entryDeleteButtonText]}>
                      {t('common.delete')}
                    </Text>
                  </TouchableOpacity>
                </View>
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
      </View>

      {isWeb ? (
        isDatePickerVisible && (
          <View style={styles.webDatePickerBackdrop}>
            <View style={styles.webDatePickerCard}>
              <Text style={styles.webDatePickerTitle}>{t('calendarHolidays.datePickerTitle')}</Text>
              <input
                type="date"
                value={webDateDraft}
                onChange={(event) => setWebDateDraft(event.target.value)}
                style={styles.webDateInput}
              />
              <View style={styles.webDatePickerActions}>
                <TouchableOpacity
                  style={[styles.webDateButton, styles.webDateSecondary]}
                  onPress={() => setIsDatePickerVisible(false)}
                >
                  <Text style={styles.webDateSecondaryText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.webDateButton, styles.webDatePrimary]}
                  onPress={handleConfirmWebDate}
                  disabled={!webDateIsValid}
                >
                  <Text
                    style={[
                      styles.webDatePrimaryText,
                      !webDateIsValid && styles.webDatePrimaryTextDisabled,
                    ]}
                  >
                    {t('common.confirm')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      ) : (
        <Modal
          animationType="fade"
          transparent
          visible={isDatePickerVisible}
          onRequestClose={() => setIsDatePickerVisible(false)}
        >
          <View style={styles.nativeDateBackdrop}>
            <View style={styles.nativeDateCard}>
              <Text style={styles.nativeDateTitle}>{t('calendarHolidays.datePickerTitle')}</Text>
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleNativeDateChange}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.nativeDateCloseButton}
                  onPress={() => setIsDatePickerVisible(false)}
                >
                  <Text style={styles.nativeDateCloseText}>{t('common.close')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={isIconPickerVisible}
        onRequestClose={() => setIsIconPickerVisible(false)}
      >
        <View style={styles.iconModalBackdrop}>
          <View style={styles.iconModalCard}>
            <Text style={styles.iconModalTitle}>{t('calendarHolidays.iconPickerTitle')}</Text>
            <ScrollView style={styles.iconModalList}>
              <TouchableOpacity
                style={styles.iconModalOption}
                onPress={() => handleSelectIcon('')}
              >
                <View style={styles.iconModalOptionPreview}>
                  <Text style={styles.iconModalOptionPlaceholder}>
                    {t('calendarHolidays.iconPickerNone')}
                  </Text>
                </View>
                <Text style={styles.iconModalOptionLabel}>{t('calendarHolidays.iconPickerNone')}</Text>
              </TouchableOpacity>
              {calendarHolidayIcons.map((icon) => (
                <TouchableOpacity
                  key={icon.key}
                  style={styles.iconModalOption}
                  onPress={() => handleSelectIcon(icon.key)}
                >
                  <View style={styles.iconModalOptionPreview}>
                    <CachedImage
                      uri={icon.url}
                      storagePath={icon.storagePath}
                      cacheKey={icon.key}
                      style={styles.iconModalImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.iconModalOptionLabel}>{icon.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.iconModalClose}
              onPress={() => setIsIconPickerVisible(false)}
            >
              <Text style={styles.iconModalCloseText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  feedback: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  feedbackSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  dateField: {
    marginBottom: 12,
  },
  dateFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  dateFieldButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  dateFieldValue: {
    fontSize: 14,
    color: '#111827',
  },
  iconField: {
    marginBottom: 16,
  },
  iconFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  iconPreviewContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    width: '60%',
    minWidth: 160,
    maxWidth: 320,
    alignSelf: 'center',
    aspectRatio: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  iconPreviewImage: {
    width: '100%',
    height: '100%',
  },
  iconPreviewLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 12,
  },
  iconPreviewPlaceholderText: {
    fontSize: 14,
    color: '#64748b',
  },
  iconActionRow: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 8,
  },
  iconActionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  iconActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconSelectButton: {
    backgroundColor: '#e2e8f0',
  },
  iconUploadButton: {
    backgroundColor: '#2563eb',
  },
  iconUploadButtonText: {
    color: '#fff',
  },
  iconClearButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  iconClearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
  },
  formActions: {
    flexDirection: 'row',
    columnGap: 12,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    color: '#1f2937',
  },
  listSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyState: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  entryInfo: {
    marginBottom: 12,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    marginBottom: 6,
  },
  entryIcon: {
    width: 80,
    aspectRatio: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  entryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  entryDate: {
    fontSize: 13,
    color: '#475569',
  },
  entryActions: {
    flexDirection: 'row',
    columnGap: 12,
  },
  entryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
  },
  entryButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#0c4a6e',
  },
  entryDeleteButton: {
    backgroundColor: '#fee2e2',
  },
  entryDeleteButtonText: {
    color: '#991b1b',
  },
  readOnlyBanner: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fdba74',
    padding: 16,
    marginBottom: 24,
  },
  readOnlyBannerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#9a3412',
    marginBottom: 6,
  },
  readOnlyBannerDescription: {
    fontSize: 13,
    color: '#9a3412',
    lineHeight: 20,
    marginBottom: 12,
  },
  readOnlyBannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fb923c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  readOnlyBannerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  webDatePickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webDatePickerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webDatePickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  webDateInput: {
    width: '100%',
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 16,
  },
  webDatePickerActions: {
    flexDirection: 'row',
    columnGap: 12,
  },
  webDateButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  webDateSecondary: {
    backgroundColor: '#f1f5f9',
  },
  webDateSecondaryText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  webDatePrimary: {
    backgroundColor: '#2563eb',
  },
  webDatePrimaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  webDatePrimaryTextDisabled: {
    opacity: 0.6,
  },
  nativeDateBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  nativeDateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  nativeDateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  nativeDateCloseButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  nativeDateCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
  iconModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconModalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  iconModalList: {
    maxHeight: 320,
  },
  iconModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconModalOptionPreview: {
    width: 120,
    aspectRatio: 2,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconModalImage: {
    width: '100%',
    height: '100%',
  },
  iconModalOptionPlaceholder: {
    fontSize: 13,
    color: '#64748b',
  },
  iconModalOptionLabel: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
  iconModalClose: {
    marginTop: 16,
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconModalCloseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
