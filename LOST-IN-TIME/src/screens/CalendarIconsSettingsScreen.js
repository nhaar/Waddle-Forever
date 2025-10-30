import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import FormField from '../components/FormField';
import ModalDialog from '../components/ModalDialog';
import { useSettings } from '../context/SettingsContext';
import { storage } from '../services/firebase';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';
import CachedImage from '../components/CachedImage';

const ICON_STORAGE_FOLDER = 'calendarIcons';

const EMPTY_FORM = { name: '' };

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
  return `${ICON_STORAGE_FOLDER}/icon-${Date.now()}-${uniqueId}${extension}`;
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

export default function CalendarIconsSettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const {
    calendarIcons = [],
    addCalendarIcon,
    updateCalendarIcon,
    deleteCalendarIcon,
  } = useSettings();
  const { isEditor } = useAccessControl();
  const isReadOnly = !isEditor;

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingKey, setEditingKey] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pendingAsset, setPendingAsset] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState({ visible: false });

  const sortedIcons = useMemo(
    () =>
      [...calendarIcons].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      ),
    [calendarIcons]
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingKey(null);
    setImagePreview(null);
    setPendingAsset(null);
    setFeedback(null);
  };

  const handlePickImage = async () => {
    if (isReadOnly) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      setFeedback({ type: 'error', message: t('calendarIcons.feedback.permissionDenied') });
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
      setFeedback({ type: 'error', message: t('calendarIcons.feedback.imageLoadError') });
      return;
    }

    setPendingAsset({ uri: asset.uri, mimeType: asset.mimeType });
    setImagePreview(asset.uri);
    setFeedback({ type: 'success', message: t('calendarIcons.feedback.imageSelected') });
  };

  const handleEdit = (icon) => {
    setEditingKey(icon.key);
    setForm({ name: icon.name });
    setImagePreview(icon.url);
    setPendingAsset(null);
    setFeedback(null);
  };

  const handleDelete = (icon) => {
    if (isReadOnly) {
      return;
    }

    setDialog({
      visible: true,
      type: 'warning',
      title: t('calendarIcons.dialogs.deleteTitle'),
      message: t('calendarIcons.dialogs.deleteMessage', { name: icon.name }),
      actions: [
        { key: 'cancel', label: t('common.cancel'), variant: 'secondary' },
        {
          key: 'confirm',
          label: t('common.delete'),
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteCalendarIcon(icon.key);
              if (editingKey === icon.key) {
                resetForm();
              }
              if (icon.storagePath) {
                await removeIconFromStorage(icon.storagePath);
              }
              setFeedback({ type: 'success', message: t('calendarIcons.feedback.deleted') });
            } catch (error) {
              console.error('Error al eliminar un icono del calendario en Firestore:', error);
              setFeedback({ type: 'error', message: t('calendarIcons.feedback.error') });
            }
          },
        },
      ],
    });
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = async () => {
    if (isReadOnly || isSubmitting) {
      return;
    }

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setFeedback({ type: 'error', message: t('calendarIcons.feedback.missingName') });
      return;
    }

    if (!editingKey && !pendingAsset) {
      setFeedback({ type: 'error', message: t('calendarIcons.feedback.missingImage') });
      return;
    }

    setIsSubmitting(true);
    let uploaded = null;

    try {
      if (pendingAsset) {
        uploaded = await uploadIconAsset(pendingAsset);
      }

      const existingIcon = editingKey
        ? calendarIcons.find((icon) => icon.key === editingKey)
        : null;

      const payload = {
        name: trimmedName,
        url: uploaded?.url ?? existingIcon?.url ?? imagePreview,
        storagePath: uploaded?.storagePath ?? existingIcon?.storagePath ?? '',
      };

      if (!payload.url) {
        setFeedback({ type: 'error', message: t('calendarIcons.feedback.missingImage') });
        if (uploaded?.storagePath) {
          await removeIconFromStorage(uploaded.storagePath);
        }
        return;
      }

      if (editingKey) {
        const updated = await updateCalendarIcon(editingKey, payload);
        if (!updated) {
          throw new Error('invalid-payload');
        }
        setFeedback({ type: 'success', message: t('calendarIcons.feedback.updated') });
        setForm({ name: updated.name });
        setImagePreview(updated.url);
        setPendingAsset(null);
        if (uploaded?.storagePath && existingIcon?.storagePath && uploaded.storagePath !== existingIcon.storagePath) {
          await removeIconFromStorage(existingIcon.storagePath);
        }
      } else {
        const created = await addCalendarIcon(payload);
        if (!created) {
          throw new Error('invalid-payload');
        }
        setFeedback({ type: 'success', message: t('calendarIcons.feedback.created') });
        setEditingKey(created.key);
        setForm({ name: created.name });
        setImagePreview(created.url);
        setPendingAsset(null);
      }
    } catch (error) {
      console.error('Error al guardar un icono del calendario en Firestore:', error);
      setFeedback({ type: 'error', message: t('calendarIcons.feedback.error') });
      if (uploaded?.storagePath) {
        await removeIconFromStorage(uploaded.storagePath);
      }
    } finally {
      setIsSubmitting(false);
    }
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
      <Text style={styles.title}>{t('calendarIcons.title')}</Text>
      <Text style={styles.description}>{t('calendarIcons.description')}</Text>

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
          label={t('calendarIcons.form.nameLabel')}
          value={form.name}
          onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
          placeholder={t('calendarIcons.form.namePlaceholder')}
          editable={!isReadOnly}
        />

        <View style={styles.imagePickerRow}>
          <View style={styles.previewWrapper}>
            {imagePreview ? (
              <Image
                source={{ uri: imagePreview }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.previewPlaceholder}>
                <Text style={styles.previewPlaceholderText}>{t('calendarIcons.form.noImage')}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.pickImageButton, isReadOnly && styles.disabledButton]}
            onPress={isReadOnly ? undefined : handlePickImage}
            disabled={isReadOnly}
            activeOpacity={isReadOnly ? 1 : 0.7}
          >
            <Text style={styles.pickImageButtonText}>{t('calendarIcons.form.pickImage')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || isReadOnly) && styles.submitButtonDisabled,
              isReadOnly && styles.disabledButton,
            ]}
            onPress={isReadOnly ? undefined : handleSubmit}
            disabled={isSubmitting || isReadOnly}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t('calendarIcons.form.saveButton')}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.resetButton, isReadOnly && styles.disabledButton]}
            onPress={handleCancel}
            activeOpacity={isReadOnly ? 1 : 0.7}
          >
            <Text style={styles.resetButtonText}>{t('common.clear')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>{t('calendarIcons.list.title')}</Text>
        {sortedIcons.length === 0 ? (
          <Text style={styles.emptyState}>{t('calendarIcons.list.empty')}</Text>
        ) : (
          <View style={styles.iconList}>
            {sortedIcons.map((icon) => (
              <View key={icon.key} style={styles.iconCard}>
                <CachedImage
                  uri={icon.url}
                  storagePath={icon.storagePath}
                  cacheKey={icon.key}
                  style={styles.iconCardImage}
                  resizeMode="contain"
                />
                <View style={styles.iconCardInfo}>
                  <Text style={styles.iconCardName}>{icon.name}</Text>
                  <View style={styles.iconCardActions}>
                    <TouchableOpacity
                      style={[styles.listButton, styles.editButton]}
                      onPress={() => handleEdit(icon)}
                    >
                      <Text style={styles.listButtonText}>{t('common.edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.listButton, styles.deleteButton, isReadOnly && styles.disabledButton]}
                      onPress={isReadOnly ? undefined : () => handleDelete(icon)}
                      disabled={isReadOnly}
                      activeOpacity={isReadOnly ? 1 : 0.7}
                    >
                      <Text style={styles.listButtonText}>{t('common.delete')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
  feedback: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackError: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  feedbackSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  imagePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  previewWrapper: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  previewPlaceholderText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  pickImageButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickImageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    backgroundColor: '#fff',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  listSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  emptyState: {
    fontSize: 14,
    color: '#64748b',
  },
  iconList: {
    gap: 14,
  },
  iconCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconCardImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  iconCardInfo: {
    flex: 1,
  },
  iconCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  iconCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  listButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  listButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
});
