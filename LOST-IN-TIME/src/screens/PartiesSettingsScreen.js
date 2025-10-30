import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import FormField from '../components/FormField';
import ModalDialog from '../components/ModalDialog';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';

const EMPTY_FORM = { name: '', year: '' };

export default function PartiesSettingsScreen({ navigation }) {
  const { parties, addParty, updateParty, deleteParty } = useSettings();
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();
  const isReadOnly = !isEditor;
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingKey, setEditingKey] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [dialog, setDialog] = useState({ visible: false });

  const groupedParties = useMemo(() => {
    const map = new Map();

    parties.forEach((entry) => {
      const trimmedName =
        typeof entry.name === 'string' ? entry.name.trim() : String(entry.name ?? '').trim();
      const trimmedYear =
        typeof entry.year === 'string' ? entry.year.trim() : String(entry.year ?? '').trim();

      if (!trimmedName) {
        return;
      }

      const key = trimmedName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { name: trimmedName, entries: [] });
      }

      map.get(key).entries.push({ ...entry, name: trimmedName, year: trimmedYear });
    });

    return Array.from(map.values())
      .map((group) => ({
        name: group.name,
        entries: group.entries
          .slice()
          .sort((a, b) =>
            a.year.localeCompare(b.year, undefined, { numeric: true, sensitivity: 'base' })
          ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [parties]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingKey(null);
  };

  const handleSubmit = async () => {
    if (isReadOnly) {
      return;
    }

    const sanitized = { name: form.name.trim(), year: form.year.trim() };

    if (!sanitized.name || !sanitized.year) {
      setFeedback({ type: 'error', message: 'Completa el nombre y el año antes de guardar.' });
      return;
    }

    const duplicate = parties.some(
      (entry) =>
        entry.key !== editingKey &&
        entry.name.trim().toLowerCase() === sanitized.name.toLowerCase() &&
        entry.year.trim().toLowerCase() === sanitized.year.toLowerCase()
    );

    if (duplicate) {
      setFeedback({ type: 'error', message: 'Ya existe una fiesta con el mismo nombre y año.' });
      return;
    }

    try {
      let nextEditingKey = editingKey;

      if (editingKey) {
        const updated = await updateParty(editingKey, sanitized);
        if (!updated) {
          setFeedback({ type: 'error', message: 'No se pudo actualizar el registro.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Fiesta actualizada correctamente.' });
      } else {
        const created = await addParty(sanitized);
        if (!created) {
          setFeedback({ type: 'error', message: 'No se pudo guardar el nuevo nombre.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Fiesta guardada correctamente.' });
        nextEditingKey = created.key ?? nextEditingKey;
      }

      setForm(sanitized);
      setEditingKey(nextEditingKey);
    } catch (error) {
      console.error('Error al sincronizar una fiesta con Firestore:', error);
      setFeedback({ type: 'error', message: 'Ocurrió un error al guardar los cambios.' });
      return;
    }
  };

  const handleEdit = (entry) => {
    setForm({ name: entry.name, year: entry.year });
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
      title: 'Eliminar fiesta',
      message: `¿Seguro que deseas eliminar "${entry.name}" (${entry.year})?`,
      actions: [
        { key: 'cancel', label: 'Cancelar', variant: 'secondary' },
        {
          key: 'confirm',
          label: 'Eliminar',
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteParty(entry.key);
              if (entry.key === editingKey) {
                resetForm();
              }
              setFeedback({ type: 'success', message: 'Fiesta eliminada correctamente.' });
            } catch (error) {
              console.error('Error al eliminar una fiesta en Firestore:', error);
              setFeedback({ type: 'error', message: 'No se pudo eliminar el registro.' });
            }
          },
        },
      ],
    });
  };

  const handleCancel = () => {
    resetForm();
    setFeedback(null);
  };

  const handlePrefillName = (name) => {
    setForm({ name, year: '' });
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
      <Text style={styles.title}>PartiesAge</Text>
      <Text style={styles.description}>
        Registra nombres de eventos por defecto para aplicarlos rápidamente desde el formulario
        principal.
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
          label="Nombre"
          value={form.name}
          onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
          placeholder="Ej. Fiesta en la Plaza"
          editable={!isReadOnly}
        />
        <FormField
          label="Año"
          value={form.year}
          onChangeText={(value) => setForm((prev) => ({ ...prev, year: value }))}
          placeholder="Ej. 2011"
          keyboardType="numeric"
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
        <Text style={styles.listTitle}>Parties guardadas</Text>
        {groupedParties.length === 0 ? (
          <Text style={styles.emptyText}>Aún no se han guardado nombres predeterminados.</Text>
        ) : (
          groupedParties.map((group) => (
            <View key={group.name.toLowerCase()} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.name}</Text>
                <TouchableOpacity
                  style={[styles.listButton, styles.smallButton, styles.secondaryPillButton]}
                  onPress={() => handlePrefillName(group.name)}
                >
                  <Text style={styles.secondaryPillButtonText}>Añadir año</Text>
                </TouchableOpacity>
              </View>
              {group.entries.map((entry, index) => (
                <View
                  key={entry.key}
                  style={[styles.yearItem, index > 0 && styles.yearItemSpacing]}
                >
                  <Text style={styles.yearText}>{entry.year || 'Sin año'}</Text>
                  <View style={styles.yearActions}>
                    <TouchableOpacity
                      style={[styles.listButton, styles.smallButton, styles.editButton]}
                      onPress={() => handleEdit(entry)}
                    >
                      <Text style={styles.listButtonText}>Editar</Text>
                    </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.listButton,
                    styles.smallButton,
                    styles.deleteButton,
                    isReadOnly && styles.disabledButton,
                  ]}
                  onPress={() => handleDelete(entry)}
                  disabled={isReadOnly}
                  activeOpacity={isReadOnly ? 1 : 0.7}
                >
                  <Text style={styles.listButtonText}>Eliminar</Text>
                </TouchableOpacity>
                  </View>
                </View>
              ))}
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
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
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
  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  rowButtonSpacing: {
    marginLeft: 12,
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
  groupCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  listButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editButton: {
    backgroundColor: '#e0f2fe',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  listButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  secondaryPillButton: {
    backgroundColor: '#e2e8f0',
  },
  secondaryPillButtonText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 12,
  },
  yearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  yearItemSpacing: {
    marginTop: 8,
  },
  yearText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  yearActions: {
    flexDirection: 'row',
    columnGap: 6,
  },
});
