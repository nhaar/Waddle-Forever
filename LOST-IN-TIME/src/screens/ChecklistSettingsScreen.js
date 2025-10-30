import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import FormField from '../components/FormField';
import ModalDialog from '../components/ModalDialog';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';

const EMPTY_FORM = { name: '' };

export default function ChecklistSettingsScreen({ navigation }) {
  const { checklists, addChecklist, updateChecklist, deleteChecklist } = useSettings();
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();
  const isReadOnly = !isEditor;
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingKey, setEditingKey] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [dialog, setDialog] = useState({ visible: false });

  const sortedChecklists = useMemo(
    () =>
      [...checklists].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      ),
    [checklists]
  );

  const handleSubmit = async () => {
    if (isReadOnly) {
      return;
    }

    const sanitizedName = form.name.trim();

    if (!sanitizedName) {
      setFeedback({ type: 'error', message: 'Proporciona un nombre antes de guardar.' });
      return;
    }

    const duplicate = checklists.some(
      (item) =>
        item.key !== editingKey && item.name.trim().toLowerCase() === sanitizedName.toLowerCase()
    );

    if (duplicate) {
      setFeedback({ type: 'error', message: 'Ya existe un elemento con el mismo nombre.' });
      return;
    }

    try {
      if (editingKey) {
        const updated = await updateChecklist(editingKey, { name: sanitizedName });
        if (!updated) {
          setFeedback({ type: 'error', message: 'No se pudo actualizar el elemento.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Elemento actualizado correctamente.' });
      } else {
        const created = await addChecklist({ name: sanitizedName });
        if (!created) {
          setFeedback({ type: 'error', message: 'No se pudo guardar el elemento.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Elemento guardado correctamente.' });
      }
    } catch (error) {
      console.error('Error al sincronizar un elemento del checklist con Firestore:', error);
      setFeedback({ type: 'error', message: 'Ocurrió un error al guardar los cambios.' });
      return;
    }

    setForm(EMPTY_FORM);
    setEditingKey(null);
  };

  const handleEdit = (entry) => {
    setForm({ name: entry.name });
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
      title: 'Eliminar elemento',
      message: `¿Seguro que deseas eliminar "${entry.name}" del checklist?`,
      actions: [
        { key: 'cancel', label: 'Cancelar', variant: 'secondary' },
        {
          key: 'confirm',
          label: 'Eliminar',
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteChecklist(entry.key);
              if (entry.key === editingKey) {
                setForm(EMPTY_FORM);
                setEditingKey(null);
              }
              setFeedback({ type: 'success', message: 'Elemento eliminado correctamente.' });
            } catch (error) {
              console.error('Error al eliminar un elemento del checklist en Firestore:', error);
              setFeedback({ type: 'error', message: 'No se pudo eliminar el elemento.' });
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
      <Text style={styles.title}>Checklist de verificación</Text>
      <Text style={styles.description}>
        Define los puntos que deberán revisarse al registrar un archivo. Estos elementos estarán
        disponibles como casillas en el formulario principal.
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
          label="Nombre del elemento"
          value={form.name}
          onChangeText={(value) => setForm({ name: value })}
          placeholder="Ej. Verificación de animaciones"
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
        <Text style={styles.listTitle}>Elementos configurados</Text>
        {sortedChecklists.length === 0 ? (
          <Text style={styles.emptyText}>Aún no se han guardado elementos en el checklist.</Text>
        ) : (
          sortedChecklists.map((entry) => (
            <View key={entry.key} style={styles.listItem}>
              <Text style={styles.listName}>{entry.name}</Text>
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
    marginTop: 8,
    marginBottom: 20,
  },
  feedback: {
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    marginBottom: 16,
  },
  feedbackError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  feedbackSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  rowButtonSpacing: {
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  listName: {
    color: '#0f172a',
    fontWeight: '600',
  },
  listActions: {
    flexDirection: 'row',
  },
  listButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  firstAction: {
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#bfdbfe',
  },
  deleteButton: {
    backgroundColor: '#fecaca',
  },
  listButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
});
