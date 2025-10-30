import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import FormField from '../components/FormField';
import SearchableSelect from '../components/SearchableSelect';
import { useRoomRecords } from '../context/RoomRecordsContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import CachedImage from '../components/CachedImage';
import {
  formatDateForDisplay,
  isDateWithinRanges,
  toISODate,
  isoToDate,
  formatStoredDateRanges,
} from '../utils/dateRanges';
import { formatPartyLabel } from '../utils/party';
import { resolveRecordStatusOption } from '../utils/recordStatus';
import { getRecordCategoryKey, RECORD_CATEGORY } from '../utils/recordCategory';

const STATUS_FILTERS = [
  { key: 'all', value: 'all', labelKey: 'status.all' },
  { key: 'incomplete', value: 'incomplete', labelKey: 'status.incomplete' },
  { key: 'inProgress', value: 'inProgress', labelKey: 'status.inProgress' },
  { key: 'completed', value: 'completed', labelKey: 'status.completed' },
];

const STATUS_VALUES = new Set(STATUS_FILTERS.map((option) => option.value));

const PAGE_SIZE_OPTIONS = [15, 20, 50];

const resolveStatusKey = (status) => {
  const normalized = String(status ?? '').toLowerCase();
  if (normalized.includes('incom')) {
    return 'incomplete';
  }
  if (normalized.includes('complet')) {
    return 'completed';
  }
  if (normalized.includes('progress') || normalized.includes('proceso')) {
    return 'inProgress';
  }
  return 'inProgress';
};

const normalizeText = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : String(value ?? '').trim().toLowerCase();

const getComparableIdRoom = (record) => {
  const { idRoom } = record ?? {};
  if (typeof idRoom === 'string') {
    return idRoom.trim();
  }

  if (idRoom === null || idRoom === undefined) {
    return '';
  }

  return String(idRoom).trim();
};

export default function RoomFilterScreen({ navigation, route }) {
  const { records } = useRoomRecords();
  const { idRooms, parties } = useSettings();
  const { t } = useTranslation();
  const isWeb = Platform.OS === 'web';
  const [filters, setFilters] = useState(() => {
    const initialStatus = STATUS_VALUES.has(route?.params?.statusFilter)
      ? route.params.statusFilter
      : 'all';
    return {
      nameFile: '',
      room: '',
      idRoom: '',
      party: '',
      status: initialStatus,
    };
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (route?.params?.dateIso) {
      const parsed = isoToDate(route.params.dateIso);
      if (parsed instanceof Date && !Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return null;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [webDateDraft, setWebDateDraft] = useState(null);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const roomOptions = useMemo(() => {
    if (!Array.isArray(idRooms)) {
      return [];
    }

    const seen = new Set();
    return idRooms.reduce((acc, entry) => {
      const roomName = typeof entry?.room === 'string' ? entry.room.trim() : '';
      const roomId = typeof entry?.id === 'string' ? entry.id.trim() : String(entry?.id ?? '').trim();

      if (!roomName && !roomId) {
        return acc;
      }

      const key = entry?.key ? String(entry.key) : `${roomName || roomId}-${acc.length}`;
      const normalizedRoom = roomName.toLowerCase();

      if (roomName && seen.has(normalizedRoom)) {
        return acc;
      }

      if (roomName) {
        seen.add(normalizedRoom);
      }

      acc.push({
        key,
        value: roomName || roomId,
        primary: roomName || roomId,
        secondary: roomName && roomId ? roomId : undefined,
      });
      return acc;
    }, []);
  }, [idRooms]);

  const partyOptions = useMemo(() => {
    if (!Array.isArray(parties)) {
      return [];
    }

    const seen = new Set();
    return parties.reduce((acc, entry) => {
      const label = formatPartyLabel(entry?.name, entry?.year);
      if (!label) {
        return acc;
      }

      const normalizedLabel = label.toLowerCase();
      if (seen.has(normalizedLabel)) {
        return acc;
      }
      seen.add(normalizedLabel);

      acc.push({
        key: entry?.key ? String(entry.key) : `${label}-${acc.length}`,
        value: label,
        primary: label,
        secondary:
          entry?.year && typeof entry.year === 'string' && entry.year.trim()
            ? entry.year.trim()
            : undefined,
      });
      return acc;
    }, []);
  }, [parties]);

  const selectedDateIso = useMemo(
    () => (selectedDate instanceof Date ? toISODate(selectedDate) : null),
    [selectedDate]
  );
  const selectedDateLabel = useMemo(
    () => (selectedDateIso ? formatDateForDisplay(selectedDateIso) : ''),
    [selectedDateIso]
  );
  const webDateDraftIso = useMemo(
    () =>
      webDateDraft instanceof Date && !Number.isNaN(webDateDraft.getTime())
        ? toISODate(webDateDraft)
        : '',
    [webDateDraft]
  );
  const canConfirmWebDate = Boolean(webDateDraftIso);

  useEffect(() => {
    const nextStatus = route?.params?.statusFilter;
    if (!nextStatus || !STATUS_VALUES.has(nextStatus)) {
      return;
    }

    setFilters((prev) => {
      if (prev.status === nextStatus) {
        return prev;
      }
      return { ...prev, status: nextStatus };
    });
  }, [route?.params?.statusFilter]);

  useEffect(() => {
    const nextDateIso = route?.params?.dateIso;
    if (!nextDateIso) {
      return;
    }

    const parsed = isoToDate(nextDateIso);
    if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) {
      return;
    }

    setSelectedDate((prev) => {
      const prevIso = prev instanceof Date ? toISODate(prev) : null;
      const nextIso = toISODate(parsed);
      if (prevIso === nextIso) {
        return prev;
      }
      return parsed;
    });
  }, [route?.params?.dateIso]);

  const handleChangeFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ nameFile: '', room: '', idRoom: '', party: '', status: 'all' });
    setSelectedDate(null);
    setShowDatePicker(false);
    setWebDateDraft(null);
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedDate || new Date(),
        onChange: handleDateChange,
        mode: 'date',
        display: 'calendar',
      });
      return;
    }

    if (isWeb) {
      setWebDateDraft(selectedDate instanceof Date ? selectedDate : new Date());
      setShowDatePicker(true);
      return;
    }

    setShowDatePicker(true);
  };

  const handleDateChange = (event, value) => {
    if (event?.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (value instanceof Date) {
      setSelectedDate(value);
    }

    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
  };

  const handleWebDateChange = (event) => {
    const nextValue = event?.target?.value;
    if (!nextValue) {
      setWebDateDraft(null);
      return;
    }

    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(nextValue)) {
      return;
    }

    const nextDate = new Date(`${nextValue}T00:00:00`);
    if (Number.isNaN(nextDate.getTime())) {
      return;
    }

    setWebDateDraft(nextDate);
  };

  const handleConfirmWebDate = () => {
    if (webDateDraft instanceof Date && !Number.isNaN(webDateDraft.getTime())) {
      setSelectedDate(webDateDraft);
    }
    setShowDatePicker(false);
  };

  const handleCancelWebDate = () => {
    setWebDateDraft(selectedDate instanceof Date ? selectedDate : null);
    setShowDatePicker(false);
  };

  const filteredRecords = useMemo(() => {
    const nameFilter = normalizeText(filters.nameFile);
    const roomFilter = normalizeText(filters.room);
    const idRoomFilter = normalizeText(filters.idRoom);
    const partyFilter = normalizeText(filters.party);
    const statusFilter = filters.status;

    const matches = records.filter((record) => {
      const recordName = normalizeText(record.nameFile);
      const recordRoom = normalizeText(record.room);
      const recordIdRoom = normalizeText(record.idRoom);
      const recordParty = normalizeText(record.party);
      const recordPartyName = normalizeText(record.partyName);

      if (nameFilter && !recordName.includes(nameFilter)) {
        return false;
      }

      if (roomFilter && !recordRoom.includes(roomFilter)) {
        return false;
      }

      if (idRoomFilter && !recordIdRoom.includes(idRoomFilter)) {
        return false;
      }

      if (
        partyFilter &&
        !recordParty.includes(partyFilter) &&
        !recordPartyName.includes(partyFilter)
      ) {
        return false;
      }

      if (statusFilter !== 'all') {
        const recordStatusKey = resolveStatusKey(record.status);
        if (recordStatusKey !== statusFilter) {
          return false;
        }
      }

      if (selectedDateIso && !isDateWithinRanges(record.dates, selectedDateIso)) {
        return false;
      }

      return true;
    });

    return matches.sort((a, b) => {
      const idRoomA = getComparableIdRoom(a);
      const idRoomB = getComparableIdRoom(b);
      const hasIdRoomA = idRoomA.length > 0;
      const hasIdRoomB = idRoomB.length > 0;

      if (hasIdRoomA && hasIdRoomB) {
        const comparison = idRoomA.localeCompare(idRoomB, undefined, {
          sensitivity: 'base',
          numeric: true,
        });
        if (comparison !== 0) {
          return comparison;
        }
      } else if (hasIdRoomA) {
        return -1;
      } else if (hasIdRoomB) {
        return 1;
      }

      const nameA = normalizeText(a.nameFile);
      const nameB = normalizeText(b.nameFile);
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }, [records, filters, selectedDateIso]);

  const hasRecords = filteredRecords.length > 0;

  const totalPages = useMemo(() => {
    if (!hasRecords) {
      return 1;
    }
    return Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  }, [hasRecords, filteredRecords.length, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, filters, selectedDateIso]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRecords = useMemo(() => {
    if (!hasRecords) {
      return [];
    }
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [hasRecords, filteredRecords, currentPage, pageSize]);

  const displayedPages = useMemo(() => {
    if (!hasRecords) {
      return [1];
    }

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push('ellipsis-start');
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    pages.push(totalPages);
    return pages;
  }, [hasRecords, totalPages, currentPage]);

  const handleChangePageSize = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleGoToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) {
        return;
      }
      setCurrentPage(page);
    },
    [totalPages]
  );

  const handleGoToPrevious = useCallback(() => {
    setCurrentPage((previous) => Math.max(1, previous - 1));
  }, []);

  const handleGoToNext = useCallback(() => {
    setCurrentPage((previous) => Math.min(totalPages, previous + 1));
  }, [totalPages]);

  const pageRangeStart = hasRecords ? (currentPage - 1) * pageSize + 1 : 0;
  const pageRangeEnd = hasRecords
    ? Math.min(filteredRecords.length, pageRangeStart + paginatedRecords.length - 1)
    : 0;

  const renderPagination = () => {
    if (!hasRecords) {
      return null;
    }

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationHeader}>
          <View style={styles.pageSizeSection}>
            <Text style={styles.paginationLabel}>{t('filters.pagination.pageSizeLabel')}</Text>
            <View style={styles.pageSizeButtons}>
              {PAGE_SIZE_OPTIONS.map((option) => {
                const isActive = pageSize === option;
                return (
                  <TouchableOpacity
                    key={`room-page-size-${option}`}
                    style={[styles.pageSizeButton, isActive && styles.pageSizeButtonActive]}
                    onPress={() => handleChangePageSize(option)}
                  >
                    <Text style={[styles.pageSizeButtonText, isActive && styles.pageSizeButtonTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <Text style={styles.paginationSummary}>
            {t('filters.pagination.pageSummary', {
              from: pageRangeStart,
              to: pageRangeEnd,
              total: filteredRecords.length,
            })}
          </Text>
        </View>
        <View style={styles.pageNavigation}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={handleGoToPrevious}
            disabled={currentPage === 1}
          >
            <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>
              {t('filters.pagination.previous')}
            </Text>
          </TouchableOpacity>
          {displayedPages.map((pageKey) => {
            if (typeof pageKey === 'string') {
              return (
                <View key={pageKey} style={styles.ellipsisContainer}>
                  <Text style={styles.ellipsisText}>…</Text>
                </View>
              );
            }

            const isCurrent = pageKey === currentPage;
            return (
              <TouchableOpacity
                key={`room-page-${pageKey}`}
                style={[styles.pageNumberButton, isCurrent && styles.pageNumberButtonActive]}
                onPress={() => handleGoToPage(pageKey)}
              >
                <Text style={[styles.pageNumberText, isCurrent && styles.pageNumberTextActive]}>
                  {pageKey}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
            onPress={handleGoToNext}
            disabled={currentPage === totalPages}
          >
            <Text
              style={[styles.pageButtonText, currentPage === totalPages && styles.pageButtonTextDisabled]}
            >
              {t('filters.pagination.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    const summaryText =
      filteredRecords.length === 1
        ? t('filters.resultsSingle')
        : t('filters.resultsMultiple', { count: filteredRecords.length });

    return (
      <View style={styles.filtersSection}>
        <Text style={styles.title}>{t('filters.title')}</Text>
        <Text style={styles.subtitle}>{t('filters.subtitle')}</Text>

        <View style={styles.filtersRow}>
          <View style={styles.filterColumn}>
            <FormField
              label={t('table.columns.nameFile')}
              value={filters.nameFile}
              onChangeText={(value) => handleChangeFilter('nameFile', value)}
              placeholder={t('filters.namePlaceholder')}
            />
          </View>
          <View style={styles.filterColumn}>
            <SearchableSelect
              label={t('table.columns.room')}
              value={filters.room}
              onChangeText={(value) => handleChangeFilter('room', value)}
              placeholder={t('filters.roomPlaceholder')}
              options={roomOptions}
              onSelectOption={(option) => handleChangeFilter('room', option.value ?? '')}
              emptyMessage={t('filters.idRoomsEmpty')}
            />
          </View>
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterColumn}>
            <FormField
              label={t('table.columns.idRoom')}
              value={filters.idRoom}
              onChangeText={(value) => handleChangeFilter('idRoom', value)}
              placeholder={t('filters.idRoomPlaceholder')}
            />
          </View>
          <View style={styles.filterColumn}>
            <SearchableSelect
              label={t('table.columns.party')}
              value={filters.party}
              onChangeText={(value) => handleChangeFilter('party', value)}
              placeholder={t('filters.partyPlaceholder')}
              options={partyOptions}
              onSelectOption={(option) => handleChangeFilter('party', option.value ?? '')}
              emptyMessage={t('filters.partiesEmpty')}
            />
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>{t('filters.statusLabel')}</Text>
          <View style={styles.statusOptions}>
            {STATUS_FILTERS.map((option) => {
              const isActive = filters.status === option.value;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.statusOption, isActive && styles.statusOptionActive]}
                  onPress={() => handleChangeFilter('status', option.value)}
                >
                  <Text
                    style={[styles.statusOptionText, isActive && styles.statusOptionTextActive]}
                  >
                    {t(option.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>{t('filters.dateLabel')}</Text>
          <View style={styles.dateButtons}>
            <TouchableOpacity style={styles.dateButton} onPress={handleOpenDatePicker}>
              <Text style={styles.dateButtonText}>
                {selectedDateLabel ? t('filters.changeDate') : t('filters.openDate')}
              </Text>
            </TouchableOpacity>
            {selectedDate && (
              <TouchableOpacity style={styles.clearDateButton} onPress={() => setSelectedDate(null)}>
                <Text style={styles.clearDateButtonText}>{t('filters.clearDate')}</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.selectedDateText}>
            {selectedDateLabel
              ? t('filters.selectedDate', { date: selectedDateLabel })
              : t('filters.noDate')}
          </Text>
          {showDatePicker && (
            <View style={styles.pickerWrapper}>
              {isWeb ? (
                <View style={styles.webPickerCard}>
                  <input
                    type="date"
                    value={webDateDraftIso}
                    onChange={handleWebDateChange}
                    style={styles.webDateInput}
                    autoFocus
                  />
                  <View style={styles.webPickerActions}>
                    <TouchableOpacity
                      style={[styles.webPickerButton, styles.webPickerSecondary]}
                      onPress={handleCancelWebDate}
                    >
                      <Text style={styles.webPickerSecondaryText}>{t('filters.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.webPickerButton,
                        styles.webPickerPrimary,
                        !canConfirmWebDate && styles.webPickerButtonDisabled,
                      ]}
                      onPress={handleConfirmWebDate}
                      disabled={!canConfirmWebDate}
                    >
                      <Text
                        style={[
                          styles.webPickerPrimaryText,
                          !canConfirmWebDate && styles.webPickerPrimaryTextDisabled,
                        ]}
                      >
                        {t('filters.confirmDate')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={styles.closePickerButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.closePickerButtonText}>{t('common.close')}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.clearFiltersButton} onPress={handleClearFilters}>
          <Text style={styles.clearFiltersText}>{t('filters.clearFilters')}</Text>
        </TouchableOpacity>

        <Text style={styles.resultsSummary}>{summaryText}</Text>

        <Text style={styles.listTitle}>{t('filters.listTitle')}</Text>
      </View>
    );
  };

  const renderCard = (item) => {
    const recordCategoryKey = getRecordCategoryKey(item.recordCategory);
    const recordCategoryLabel =
      recordCategoryKey === RECORD_CATEGORY.PARTY
        ? t('filters.card.recordCategoryParty')
        : t('filters.card.recordCategoryBase');

    return (
      <TouchableOpacity
        key={item.idList}
        style={styles.card}
        onPress={() =>
          navigation.navigate('Register', {
            recordIdList: item.idList,
            fromFilter: true,
          })
        }
      >
        <View style={styles.cardImageWrapper}>
          {item.image ? (
            <CachedImage
              uri={item.image}
              storagePath={item.imageStoragePath}
              style={styles.cardImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Text style={styles.cardImagePlaceholderText}>{t('filters.card.noImage')}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardLabel}>{t('filters.card.nameLabel')}</Text>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.nameFile || t('filters.card.noName')}
          </Text>

          <View style={styles.cardDetailBlock}>
            <Text style={styles.cardLabel}>{t('filters.card.roomLabel')}</Text>
            <Text style={styles.cardDetailValue} numberOfLines={2}>
              {item.room || t('filters.card.noRoom')}
            </Text>
          </View>

          <View style={styles.cardDetailBlock}>
            <Text style={styles.cardLabel}>{t('filters.card.categoryLabel')}</Text>
            <View
              style={[
                styles.cardCategoryBadge,
                recordCategoryKey === RECORD_CATEGORY.PARTY
                  ? styles.cardCategoryBadgeParty
                  : styles.cardCategoryBadgeBase,
              ]}
            >
              <Text
                style={[
                  styles.cardCategoryText,
                  recordCategoryKey === RECORD_CATEGORY.PARTY && styles.cardCategoryTextParty,
                ]}
                numberOfLines={1}
              >
                {recordCategoryLabel}
              </Text>
            </View>
          </View>

          <View style={styles.cardDetailBlock}>
            <Text style={styles.cardLabel}>{t('filters.card.datesLabel')}</Text>
            <Text style={styles.cardDetailValue} numberOfLines={2}>
              {formatStoredDateRanges(item.dates) || t('filters.card.noDates')}
            </Text>
          </View>

          <View style={styles.cardStatusRow}>
            <Text style={[styles.cardLabel, styles.cardStatusLabel]}>{t('filters.card.statusLabel')}</Text>
            {(() => {
              const statusOption = resolveRecordStatusOption(item.status);
              const statusLabel = statusOption
                ? t(`table.statusBadge.${statusOption.key}`)
                : item.status || t('filters.card.statusUnknown');
              return (
                <View
                  style={[
                    styles.cardStatusBadge,
                    statusOption
                      ? { backgroundColor: statusOption.color }
                      : styles.cardStatusBadgeFallback,
                  ]}
                >
                  <Text
                    style={[
                      styles.cardStatusText,
                      !statusOption && styles.cardStatusTextFallback,
                    ]}
                    numberOfLines={1}
                  >
                    {statusLabel}
                  </Text>
                </View>
              );
            })()}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    >
      {renderHeader()}
      {filteredRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('filters.emptyState')}</Text>
        </View>
      ) : (
        <>
          {renderPagination()}
          <View style={styles.cardsGrid}>{paginatedRecords.map(renderCard)}</View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 24,
    paddingBottom: 48,
  },
  paginationContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
    rowGap: 12,
  },
  paginationHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  paginationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 8,
  },
  paginationSummary: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  pageSizeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pageSizeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -8,
  },
  pageSizeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 4,
  },
  pageSizeButtonActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  pageSizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  pageSizeButtonTextActive: {
    color: '#f8fafc',
  },
  pageNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginRight: -6,
  },
  pageButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#94a3b8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e2e8f0',
    marginRight: 6,
    marginBottom: 4,
  },
  pageButtonDisabled: {
    opacity: 0.6,
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  pageButtonTextDisabled: {
    color: '#64748b',
  },
  pageNumberButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginRight: 6,
    marginBottom: 4,
  },
  pageNumberButtonActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  pageNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  pageNumberTextActive: {
    color: '#f8fafc',
  },
  ellipsisContainer: {
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  ellipsisText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
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
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginBottom: 8,
  },
  filterColumn: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 12,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 8,
  },
  statusOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    backgroundColor: '#fff',
  },
  statusOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusOptionTextActive: {
    color: '#f8fafc',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  dateButtons: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dateButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 14,
  },
  clearDateButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  clearDateButtonText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedDateText: {
    fontSize: 13,
    color: '#475569',
  },
  pickerWrapper: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  webPickerCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    padding: 16,
  },
  webDateInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 10,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  webPickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 12,
    marginTop: 12,
  },
  webPickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  webPickerSecondary: {
    backgroundColor: '#e2e8f0',
  },
  webPickerSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  webPickerPrimary: {
    backgroundColor: '#2563eb',
  },
  webPickerButtonDisabled: {
    opacity: 0.5,
  },
  webPickerPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  webPickerPrimaryTextDisabled: {
    color: '#e0e7ff',
  },
  closePickerButton: {
    marginTop: 8,
    backgroundColor: '#475569',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  closePickerButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 13,
  },
  clearFiltersButton: {
    backgroundColor: '#fef3c7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearFiltersText: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 14,
  },
  resultsSummary: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    letterSpacing: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -6,
  },
  card: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '23%',
    maxWidth: '23%',
    minWidth: 180,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardImageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImagePlaceholderText: {
    color: '#475569',
    fontSize: 13,
    fontStyle: 'italic',
  },
  cardInfo: {
    paddingTop: 4,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardStatusLabel: {
    marginBottom: 0,
  },
  cardDetailBlock: {
    marginTop: 6,
  },
  cardDetailValue: {
    fontSize: 13,
    color: '#1f2937',
    marginTop: 4,
  },
  cardCategoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 4,
  },
  cardCategoryBadgeBase: {
    backgroundColor: '#bfdbfe',
  },
  cardCategoryBadgeParty: {
    backgroundColor: '#f97316',
  },
  cardCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1e3a8a',
  },
  cardCategoryTextParty: {
    color: '#fff7ed',
  },
  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
    marginTop: 8,
  },
  cardStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  cardStatusBadgeFallback: {
    backgroundColor: '#e2e8f0',
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  cardStatusTextFallback: {
    color: '#0f172a',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
