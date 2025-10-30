import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import FormField from '../components/FormField';
import ModalDialog from '../components/ModalDialog';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';

const EMPTY_FORM = { id: '', room: '' };

export default function IdRoomSettingsScreen({ navigation }) {
  const { idRooms, addIdRoom, updateIdRoom, deleteIdRoom } = useSettings();
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();
  const isReadOnly = !isEditor;
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingKey, setEditingKey] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [dialog, setDialog] = useState({ visible: false });

  const sortedEntries = useMemo(
    () =>
      [...idRooms].sort((a, b) => a.id.localeCompare(b.id, undefined, { sensitivity: 'base' })),
    [idRooms]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isReadOnly) {
      return;
    }

    const sanitized = {
      id: form.id.trim(),
      room: form.room.trim(),
    };

    if (!sanitized.id || !sanitized.room) {
      setFeedback({ type: 'error', message: 'Completa ambos campos antes de guardar.' });
      return;
    }

    try {
      if (editingKey) {
        const updated = await updateIdRoom(editingKey, sanitized);
        if (!updated) {
          setFeedback({ type: 'error', message: 'No se pudo actualizar el registro.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Par ID/Room actualizado correctamente.' });
      } else {
        const created = await addIdRoom(sanitized);
        if (!created) {
          setFeedback({ type: 'error', message: 'No se pudo guardar el nuevo par.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Par ID/Room guardado correctamente.' });
      }
    } catch (error) {
      console.error('Error al sincronizar un ID/Room con Firestore:', error);
      setFeedback({ type: 'error', message: 'Ocurrió un error al guardar los cambios.' });
      return;
    }

    setForm(EMPTY_FORM);
    setEditingKey(null);
  };

  const handleEdit = (entry) => {
    setForm({ id: entry.id, room: entry.room });
    setEditingKey(entry.key);
    setFeedback(null);
  };

  const handleDelete = (entry) => {
    if (isReadOnly) {
      return;
    }

    setDialog({
      visible: true,
      type: 'warning',
      title: 'Eliminar ID/Room',
      message: `¿Seguro que deseas eliminar ${entry.id} - ${entry.room}?`,
      actions: [
        { key: 'cancel', label: 'Cancelar', variant: 'secondary' },
        {
          key: 'confirm',
          label: 'Eliminar',
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteIdRoom(entry.key);
              if (entry.key === editingKey) {
                setForm(EMPTY_FORM);
                setEditingKey(null);
              }
              setFeedback({ type: 'success', message: 'Par eliminado correctamente.' });
            } catch (error) {
              console.error('Error al eliminar un ID/Room en Firestore:', error);
              setFeedback({ type: 'error', message: 'No se pudo eliminar el registro.' });
            }
          },
        },
      ],
    });
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingKey(null);
    setFeedback(null);
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
      <Text style={styles.title}>ID Rooms predeterminados</Text>
      <Text style={styles.description}>
        Guarda combinaciones estándar de ID y Room para reutilizarlas rápidamente en el
        formulario principal.
      </Text>

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
          label="ID"
          value={form.id}
          onChangeText={(value) => handleChange('id', value)}
          placeholder="Ej. 300"
          editable={!isReadOnly}
        />
        <FormField
          label="Room"
          value={form.room}
          onChangeText={(value) => handleChange('room', value)}
          placeholder="Ej. Plaza"
          editable={!isReadOnly}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.primaryButton, isReadOnly && styles.disabledButton]}
            onPress={isReadOnly ? undefined : handleSubmit}
            disabled={isReadOnly}
            activeOpacity={isReadOnly ? 1 : 0.7}
          >
            <Text style={styles.primaryButtonText}>{editingKey ? 'Actualizar' : 'Guardar'}</Text>
          </TouchableOpacity>
          {editingKey && (
            <TouchableOpacity
              style={[styles.secondaryButton, styles.rowButtonSpacing, isReadOnly && styles.disabledButton]}
              onPress={handleCancel}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Listado guardado</Text>
        {sortedEntries.length === 0 ? (
          <Text style={styles.emptyText}>Aún no se han registrado pares ID/Room.</Text>
        ) : (
          sortedEntries.map((entry) => (
            <View key={entry.key} style={styles.listItem}>
              <View style={styles.listTextWrapper}>
                <Text style={styles.listPrimary}>{entry.id}</Text>
                <Text style={styles.listSecondary}>{entry.room}</Text>
              </View>
              <View style={styles.listActions}>
                <TouchableOpacity
                  style={[styles.listButton, styles.firstAction, styles.editButton]}
                  onPress={() => handleEdit(entry)}
                >
                  <Text style={styles.listButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.listButton, styles.deleteButton, isReadOnly && styles.disabledButton]}
                  onPress={isReadOnly ? undefined : () => handleDelete(entry)}
                  disabled={isReadOnly}
                  activeOpacity={isReadOnly ? 1 : 0.7}
                >
                  <Text style={styles.listButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    paddingBottom: 32,
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  feedback: {
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  feedbackSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  feedbackError: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  rowButtonSpacing: {
    marginLeft: 12,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  listTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  listPrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  listSecondary: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  listActions: {
    flexDirection: 'row',
  },
  listButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  firstAction: {
    marginLeft: 0,
  },
  editButton: {
    backgroundColor: '#0ea5e9',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  listButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
