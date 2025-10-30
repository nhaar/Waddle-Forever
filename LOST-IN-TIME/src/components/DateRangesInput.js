import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  formatDateForDisplay,
  formatDateRangesForDisplay,
  getTodayISODate,
  isoToDate,
  normalizeRange,
  serializeDateRanges,
  toISODate,
} from '../utils/dateRanges';
import { useTranslation } from '../hooks/useTranslation';

const LABEL_KEYS = {
  start: 'dateRanges.labels.start',
  end: 'dateRanges.labels.end',
};

const PICKER_TITLE_KEYS = {
  start: 'dateRanges.pickerTitle.start',
  end: 'dateRanges.pickerTitle.end',
};

function ensureRangeObject(range) {
  const normalized = normalizeRange(range) ?? null;
  if (normalized) {
    return normalized;
  }
  const todayIso = getTodayISODate();
  return { start: todayIso, end: todayIso };
}

function applyRangeUpdate(ranges, index, updates) {
  const nextRanges = ranges.map((range, idx) => {
    if (idx !== index) {
      return range;
    }

    const current = ensureRangeObject(range);
    const updated = { ...current, ...updates };

    if (updated.start && updated.end && updated.start > updated.end) {
      if (updates.start && !updates.end) {
        updated.end = updated.start;
      } else if (updates.end && !updates.start) {
        updated.start = updated.end;
      } else if (updated.start > updated.end) {
        const swapStart = updated.end;
        updated.end = updated.start;
        updated.start = swapStart;
      }
    }

    return updated;
  });

  return nextRanges;
}

export default function DateRangesInput({ label, ranges, onChange, editable = true }) {
  const { t } = useTranslation();
  const [activePicker, setActivePicker] = useState(null);
  const isWeb = Platform.OS === 'web';

  const isConfirmEnabled = useMemo(() => {
    if (!activePicker?.draftValue) {
      return false;
    }
    return Boolean(isoToDate(activePicker.draftValue));
  }, [activePicker?.draftValue]);

  const normalizedRanges = useMemo(() => {
    if (!Array.isArray(ranges) || ranges.length === 0) {
      return [];
    }
    const serialized = serializeDateRanges(ranges);
    return serialized ? JSON.parse(serialized) : [];
  }, [ranges]);

  const displayLabel = useMemo(
    () => formatDateRangesForDisplay(normalizedRanges),
    [normalizedRanges]
  );

  const emitChange = (nextRanges) => {
    const serialized = serializeDateRanges(nextRanges);
    const normalized = serialized ? JSON.parse(serialized) : [];
    if (typeof onChange === 'function') {
      onChange(normalized);
    }
  };

  const handleAddRange = () => {
    if (!editable) {
      return;
    }

    const todayIso = getTodayISODate();
    const todayDate = isoToDate(todayIso) ?? new Date();
    const nextRanges = [...normalizedRanges, { start: todayIso, end: todayIso }];
    emitChange(nextRanges);
    setActivePicker({
      index: nextRanges.length - 1,
      field: 'start',
      date: todayDate,
      draftValue: todayIso,
    });
  };

  const handleRemoveRange = (index) => {
    if (!editable) {
      return;
    }

    const nextRanges = normalizedRanges.filter((_, idx) => idx !== index);
    emitChange(nextRanges);
  };

  const handleApplyDate = (index, field, date) => {
    const iso = toISODate(date);
    if (!iso) {
      return;
    }

    const nextRanges = applyRangeUpdate(normalizedRanges, index, { [field]: iso });
    emitChange(nextRanges);
  };

  const openPicker = (index, field) => {
    if (!editable) {
      return;
    }

    const normalizedRange = ensureRangeObject(normalizedRanges[index]);
    const fallbackIso = getTodayISODate();
    const selectedIso = normalizedRange?.[field] ?? fallbackIso;
    const selectedDate = isoToDate(selectedIso) ?? isoToDate(fallbackIso) ?? new Date();

    setActivePicker({
      index,
      field,
      date: selectedDate,
      draftValue: selectedIso || toISODate(selectedDate) || '',
    });
  };

  const closePicker = () => {
    setActivePicker(null);
  };

  const confirmPicker = () => {
    if (!editable) {
      return;
    }

    if (!activePicker) {
      return;
    }
    const parsed = isoToDate(activePicker.draftValue);
    if (!parsed) {
      return;
    }
    handleApplyDate(activePicker.index, activePicker.field, parsed);
    closePicker();
  };

  const handlePickerChange = (event, selectedDate) => {
    if (event?.type === 'dismissed') {
      closePicker();
      return;
    }

    if (!selectedDate) {
      return;
    }
    const isoValue = toISODate(selectedDate);
    setActivePicker((prev) =>
      prev
        ? {
            ...prev,
            date: selectedDate,
            draftValue: isoValue ?? prev.draftValue ?? '',
          }
        : prev
    );
  };

  const handleWebDateChange = (event) => {
    const nextValue = event?.target?.value ?? '';

    setActivePicker((prev) => {
      if (!prev) {
        return prev;
      }

      const parsed = isoToDate(nextValue);
      return {
        ...prev,
        draftValue: nextValue,
        date: parsed ?? prev.date,
      };
    });
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {normalizedRanges.length === 0 ? (
        <Text style={styles.emptyMessage}>{t('dateRanges.empty')}</Text>
      ) : (
        normalizedRanges.map((range, index) => (
          <View key={`date-range-${index}`} style={styles.rangeCard}>
            <View style={styles.rangeHeader}>
              <Text style={styles.rangeTitle}>{t('dateRanges.rangeTitle', { index: index + 1 })}</Text>
              <TouchableOpacity
                onPress={editable ? () => handleRemoveRange(index) : undefined}
                style={[styles.removeButton, !editable && styles.disabledButton]}
                disabled={!editable}
                activeOpacity={editable ? 0.7 : 1}
              >
                <Text style={styles.removeButtonText}>{t('dateRanges.remove')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rangeBody}>
              {['start', 'end'].map((field) => (
                <TouchableOpacity
                  key={`${field}-${index}`}
                  style={[
                    styles.dateChip,
                    field === 'start' ? styles.dateChipStart : styles.dateChipEnd,
                  ]}
                  onPress={editable ? () => openPicker(index, field) : undefined}
                  disabled={!editable}
                  activeOpacity={editable ? 0.7 : 1}
                >
                  <Text style={styles.chipLabel}>{t(LABEL_KEYS[field])}</Text>
                  <Text style={styles.chipValue}>
                    {formatDateForDisplay(range[field]) || t('dateRanges.select')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={[styles.addButton, !editable && styles.disabledButton]}
        onPress={editable ? handleAddRange : undefined}
        disabled={!editable}
        activeOpacity={editable ? 0.7 : 1}
      >
        <Text style={styles.addButtonText}>{t('dateRanges.add')}</Text>
      </TouchableOpacity>

      {displayLabel ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>{t('dateRanges.summaryLabel')}</Text>
          <Text style={styles.summaryValue}>{displayLabel}</Text>
        </View>
      ) : null}

      {activePicker ? (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={closePicker}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t(PICKER_TITLE_KEYS[activePicker.field])}</Text>
              {isWeb ? (
                <input
                  type="date"
                  value={activePicker.draftValue ?? ''}
                  onChange={handleWebDateChange}
                  autoFocus
                  style={styles.webDateInput}
                  placeholder="YYYY-MM-DD"
                />
              ) : (
                <DateTimePicker
                  value={activePicker.date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={handlePickerChange}
                />
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, styles.modalSecondary]} onPress={closePicker}>
                  <Text style={styles.modalButtonText}>{t('dateRanges.modal.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalPrimary,
                    !isConfirmEnabled && styles.modalButtonDisabled,
                  ]}
                  onPress={confirmPicker}
                  disabled={!isConfirmEnabled}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      styles.modalPrimaryText,
                      !isConfirmEnabled && styles.modalPrimaryTextDisabled,
                    ]}
                  >
                    {t('dateRanges.modal.confirm')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
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
  emptyMessage: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  rangeCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rangeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  rangeBody: {
    flexDirection: 'row',
  },
  dateChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dateChipStart: {
    marginRight: 8,
  },
  dateChipEnd: {
    marginLeft: 8,
  },
  chipLabel: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  chipValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  summaryBox: {
    marginTop: 14,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#0369a1',
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    color: '#0f172a',
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  webDateInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 10,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalSecondary: {
    backgroundColor: '#e2e8f0',
  },
  modalPrimary: {
    backgroundColor: '#2563eb',
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalPrimaryText: {
    color: '#f8fafc',
  },
  modalPrimaryTextDisabled: {
    color: '#dbeafe',
  },
});
