import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { useRoomRecords } from '../context/RoomRecordsContext';
import { useSettings } from '../context/SettingsContext';
import { formatStoredDateRanges } from '../utils/dateRanges';
import ModalDialog from '../components/ModalDialog';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';
import CachedImage from '../components/CachedImage';
import {
  exportRoomRecordsToArchive,
  importRoomRecordsFromArchive,
  removeTemporaryFileAsync,
} from '../services/recordsTransfer';
import { getRecordCategoryKey, RECORD_CATEGORY } from '../utils/recordCategory';

const STORAGE_BUCKET_URL = 'gs://data-club-penguin.firebasestorage.app';

function resolveSwfStorageUri(path) {
  if (typeof path !== 'string') {
    return '';
  }

  const trimmedBucket = STORAGE_BUCKET_URL.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${trimmedBucket}/${normalizedPath}`;
}

const PAGE_SIZE_OPTIONS = [10, 15, 20, 50];

export default function TableScreen({ navigation }) {
  const { records, deleteRecord } = useRoomRecords();
  const { idRooms } = useSettings();
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();
  const [sortConfig, setSortConfig] = useState({ key: 'idList', direction: 'asc' });
  const [dialog, setDialog] = useState({ visible: false });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [transferProgress, setTransferProgress] = useState(null);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageColumn, setShowImageColumn] = useState(true);

  const columns = useMemo(() => {
    const columnList = [
      { key: 'idList', label: t('table.columns.idList'), width: 90 },
      { key: 'nameFile', label: t('table.columns.nameFile'), width: 200 },
    ];

    if (showImageColumn) {
      columnList.push({ key: 'image', label: t('table.columns.image'), width: 220 });
    }

    columnList.push(
      { key: 'status', label: t('table.columns.status'), width: 140 },
      { key: 'recordCategory', label: t('table.columns.recordCategory'), width: 160 },
      { key: 'party', label: t('table.columns.party'), width: 200 },
      { key: 'dates', label: t('table.columns.dates'), width: 220 },
      { key: 'room', label: t('table.columns.room'), width: 200 },
      { key: 'idRoom', label: t('table.columns.idRoom'), width: 160 },
      { key: 'music', label: t('table.columns.music'), width: 200 },
      { key: 'checklist', label: t('table.columns.checklist'), width: 240 },
      { key: 'notes', label: t('table.columns.notes'), width: 240 },
      { key: 'swfType', label: t('table.columns.swfType'), width: 160 },
      { key: 'credits', label: t('table.columns.credits'), width: 220 },
      { key: 'linkSwf', label: t('table.columns.linkSwf'), width: 220 }
    );

    if (isEditor) {
      columnList.push({ key: 'actions', label: t('table.actionsColumn'), width: 200, sortable: false });
    }

    return columnList;
  }, [t, isEditor, showImageColumn]);

  const hideDialog = useCallback(() => setDialog({ visible: false }), []);

  const showDialog = useCallback((config) => {
    setDialog({
      visible: true,
      type: config.type ?? 'info',
      title: config.title,
      message: config.message,
      actions: config.actions,
    });
  }, []);

  const handleOpenSwf = useCallback(
    async (url) => {
      if (!url) {
        showDialog({
          type: 'error',
          title: t('table.swf.openErrorTitle'),
          message: t('table.swf.noUrl'),
          actions: [
            {
              key: 'open-swf-missing-url',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
        return;
      }

      try {
        const supported = await Linking.canOpenURL(url);
        if (!supported) {
          throw new Error('unsupported-url');
        }
        await Linking.openURL(url);
      } catch (error) {
        console.error('Error al abrir el archivo SWF:', error);
        showDialog({
          type: 'error',
          title: t('table.swf.openErrorTitle'),
          message: t('table.swf.openError'),
          actions: [
            {
              key: 'open-swf-error',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
      }
    },
    [showDialog, t]
  );

  const getSwfTypeLabel = useCallback(
    (value) => {
      const normalized = String(value ?? '').toLowerCase();
      if (normalized.startsWith('recr')) {
        return t('table.swfType.recreation');
      }
      return t('table.swfType.original');
    },
    [t]
  );

  const getRecordCategoryLabel = useCallback(
    (value) => {
      const key = getRecordCategoryKey(value);
      if (key === RECORD_CATEGORY.PARTY) {
        return t('table.recordCategory.party');
      }
      return t('table.recordCategory.base');
    },
    [t]
  );

  const resolveStatusKey = useCallback((status) => {
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
  }, []);

  const statusStyleMap = useMemo(
    () => ({
      incomplete: {
        badge: styles.statusIncomplete,
        text: styles.statusBadgeTextIncomplete,
      },
      inProgress: {
        badge: styles.statusInProgress,
        text: styles.statusBadgeTextInProgress,
      },
      completed: {
        badge: styles.statusCompleted,
        text: styles.statusBadgeTextCompleted,
      },
    }),
    []
  );

  const handleSort = useCallback((columnKey) => {
    setSortConfig((previous) => {
      if (previous.key === columnKey) {
        const nextDirection = previous.direction === 'asc' ? 'desc' : 'asc';
        return { key: columnKey, direction: nextDirection };
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);

  const sortedRecords = useMemo(() => {
    if (records.length === 0) {
      return [];
    }

    const { key, direction } = sortConfig;
    if (!key) {
      return [...records];
    }

    const getSortableValue = (record, columnKey) => {
      if (!record) {
        return '';
      }

      switch (columnKey) {
        case 'dates':
          return formatStoredDateRanges(record.dates) || '';
        case 'checklist': {
          const entries = Array.isArray(record.checklist)
            ? record.checklist.filter((item) => item.enabled !== false)
            : [];
          if (entries.length === 0) {
            return '';
          }
          return entries
            .map((item) => `${item.checked ? '1' : '0'} ${item.name || ''}`)
            .join(' ');
        }
        case 'image':
          return record.image ? 'con-imagen' : 'sin-imagen';
        case 'status':
          return record.status || '';
        case 'recordCategory':
          return getRecordCategoryLabel(record.recordCategory);
        case 'linkSwf': {
          const swf = record.linkSwf;
          if (!swf) {
            return '';
          }
          return swf.name || swf.url || swf.storagePath || '';
        }
        default:
          return record[columnKey] || '';
      }
    };

    const collatorOptions = { numeric: true, sensitivity: 'base' };
    const sorted = [...records].sort((a, b) => {
      const valueA = String(getSortableValue(a, key));
      const valueB = String(getSortableValue(b, key));
      const comparison = valueA.localeCompare(valueB, undefined, collatorOptions);
      if (comparison !== 0) {
        return comparison;
      }
      return String(a.idList || '').localeCompare(String(b.idList || ''), undefined, collatorOptions);
    });

    if (direction === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }, [records, sortConfig]);

  const transferCounts = useMemo(() => {
    if (!transferProgress) {
      return { processed: 0, total: 0 };
    }

    const total = Math.max(0, transferProgress.total ?? 0);
    const processedRaw = Number.isFinite(transferProgress.processed)
      ? transferProgress.processed
      : 0;
    const processed = Math.max(0, Math.min(processedRaw, total > 0 ? total : processedRaw));

    return { processed, total };
  }, [transferProgress]);

  const transferStageMessage = useMemo(() => {
    if (!transferProgress) {
      return '';
    }

    const { processed, total } = transferCounts;

    if (transferProgress.stage === 'download') {
      if (total > 0) {
        return t('table.transfer.progressDownloadWithCount', {
          processed,
          total,
        });
      }
      return t('table.transfer.progressDownload');
    }

    if (transferProgress.stage === 'record') {
      if (total > 0) {
        return t('table.transfer.progressRecordsWithCount', {
          processed,
          total,
        });
      }
      return t('table.transfer.progressRecords');
    }

    return t('table.transfer.progressPreparing');
  }, [t, transferCounts, transferProgress]);

  const transferProgressValue = useMemo(() => {
    if (!transferProgress) {
      return 0;
    }

    const { processed, total } = transferCounts;
    if (total > 0) {
      const ratio = processed / total;
      if (Number.isFinite(ratio)) {
        return Math.max(0, Math.min(ratio, 1));
      }
    }

    return 0;
  }, [transferCounts, transferProgress]);

  const transferProgressFillStyle = useMemo(() => {
    const percentage = Math.round(transferProgressValue * 100);
    return { width: `${Math.max(0, Math.min(percentage, 100))}%` };
  }, [transferProgressValue]);

  const totalRecords = sortedRecords.length;
  const hasRecords = totalRecords > 0;
  const totalPages = useMemo(() => {
    if (!hasRecords) {
      return 1;
    }
    return Math.max(1, Math.ceil(totalRecords / pageSize));
  }, [hasRecords, totalRecords, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, totalRecords]);

  useEffect(() => {
    if (!showImageColumn && sortConfig.key === 'image') {
      setSortConfig({ key: 'idList', direction: 'asc' });
    }
  }, [showImageColumn, sortConfig, setSortConfig]);

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
    return sortedRecords.slice(start, start + pageSize);
  }, [hasRecords, sortedRecords, currentPage, pageSize]);

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
  }, [currentPage, hasRecords, totalPages]);

  const handleChangePageSize = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const toggleImageColumn = useCallback(() => {
    setShowImageColumn((previous) => !previous);
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

  const handleExportRecords = useCallback(async () => {
    if (!isEditor) {
      return;
    }

    if (records.length === 0) {
      showDialog({
        type: 'info',
        title: t('table.transfer.emptyExportTitle'),
        message: t('table.transfer.emptyExportMessage'),
        actions: [
          {
            key: 'export-empty-ok',
            label: t('modals.defaultAction'),
            variant: 'primary',
          },
        ],
      });
      return;
    }

    setIsExporting(true);
    setTransferProgress({ type: 'export', stage: 'preparing', processed: 0, total: 0 });
    try {
      const result = await exportRoomRecordsToArchive(records, {
        onProgress: (progressUpdate) => {
          setTransferProgress((previous) => {
            const previousState = previous ?? { type: 'export', stage: 'preparing', processed: 0, total: 0 };
            const total =
              typeof progressUpdate?.total === 'number'
                ? Math.max(0, progressUpdate.total)
                : Math.max(0, previousState.total ?? 0);
            const processedRaw =
              typeof progressUpdate?.processed === 'number'
                ? progressUpdate.processed
                : previousState.processed ?? 0;
            const processed = Math.max(
              0,
              Math.min(Number.isFinite(processedRaw) ? processedRaw : 0, total > 0 ? total : processedRaw)
            );
            const stage = progressUpdate?.stage ?? previousState.stage ?? 'preparing';

            return {
              type: 'export',
              stage,
              processed,
              total,
            };
          });
        },
      });
      if (Platform.OS === 'web') {
        if (result?.blob) {
          const blobUrl = URL.createObjectURL(result.blob);
          try {
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = result.fileName;
            anchor.style.display = 'none';
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
          } finally {
            URL.revokeObjectURL(blobUrl);
          }
        }

        showDialog({
          type: 'success',
          title: t('table.transfer.exportSuccessTitle'),
          message: t('table.transfer.exportSuccessDownload'),
          actions: [
            {
              key: 'export-success-web-ok',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
        return;
      }

      let fileUri = result.fileUri;
      let shared = false;

      try {
        if (fileUri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/zip',
            dialogTitle: t('table.transfer.shareDialogTitle'),
            UTI: 'com.pkware.zip-archive',
          });
          shared = true;
        }
      } catch (shareError) {
        console.warn('Error al compartir la exportación:', shareError);
      }

      if (shared) {
        await removeTemporaryFileAsync(fileUri);
        fileUri = null;
        showDialog({
          type: 'success',
          title: t('table.transfer.exportSuccessTitle'),
          message: t('table.transfer.exportSuccessMessage'),
          actions: [
            {
              key: 'export-success-ok',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
      } else if (fileUri) {
        showDialog({
          type: 'success',
          title: t('table.transfer.exportSuccessTitle'),
          message: t('table.transfer.exportSuccessFallback', {
            path: fileUri,
          }),
          actions: [
            {
              key: 'export-success-fallback-ok',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error al exportar los registros:', error);
      showDialog({
        type: 'error',
        title: t('table.transfer.exportErrorTitle'),
        message: t('table.transfer.exportErrorMessage'),
        actions: [
          {
            key: 'export-error-ok',
            label: t('modals.defaultAction'),
            variant: 'primary',
          },
        ],
      });
    } finally {
      setTransferProgress(null);
      setIsExporting(false);
    }
  }, [isEditor, records, showDialog, t]);

  const handleImportRecords = useCallback(async () => {
    if (!isEditor) {
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        showDialog({
          type: 'error',
          title: t('table.transfer.importErrorTitle'),
          message: t('table.transfer.importErrorMessage'),
          actions: [
            {
              key: 'import-error-no-file-ok',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
        return;
      }

      setIsImporting(true);
      setTransferProgress({ type: 'import', stage: 'preparing', processed: 0, total: 0 });
      try {
        const summary = await importRoomRecordsFromArchive(
          { uri: asset.uri },
          {
            idRooms,
            onProgress: (progressUpdate) => {
              setTransferProgress((previous) => {
                const previousState = previous ?? { type: 'import', stage: 'preparing', processed: 0, total: 0 };
                const total =
                  typeof progressUpdate?.total === 'number'
                    ? Math.max(0, progressUpdate.total)
                    : Math.max(0, previousState.total ?? 0);
                const processedRaw =
                  typeof progressUpdate?.processed === 'number'
                    ? progressUpdate.processed
                    : previousState.processed ?? 0;
                const processed = Math.max(
                  0,
                  Math.min(Number.isFinite(processedRaw) ? processedRaw : 0, total > 0 ? total : processedRaw)
                );
                const stage = progressUpdate?.stage ?? previousState.stage ?? 'preparing';

                return {
                  type: 'import',
                  stage,
                  processed,
                  total,
                };
              });
            },
          }
        );
        showDialog({
          type: 'success',
          title: t('table.transfer.importSuccessTitle'),
          message: t('table.transfer.importSuccessMessage', {
            imported: summary.imported,
          }),
          actions: [
            {
              key: 'import-success-ok',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
      } catch (error) {
        console.error('Error al importar registros:', error);
        showDialog({
          type: 'error',
          title: t('table.transfer.importErrorTitle'),
          message: t('table.transfer.importErrorMessage'),
          actions: [
            {
              key: 'import-error-ok',
              label: t('modals.defaultAction'),
              variant: 'primary',
            },
          ],
        });
      } finally {
        setTransferProgress(null);
        setIsImporting(false);
      }
    } catch (pickerError) {
      if (pickerError?.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error al seleccionar el archivo para importar:', pickerError);
      showDialog({
        type: 'error',
        title: t('table.transfer.importErrorTitle'),
        message: t('table.transfer.importErrorMessage'),
        actions: [
          {
            key: 'import-picker-error-ok',
            label: t('modals.defaultAction'),
            variant: 'primary',
          },
        ],
      });
    }
  }, [idRooms, isEditor, showDialog, t]);

  const handleEditRecord = useCallback(
    (record) => {
      if (!isEditor) {
        return;
      }
      navigation.navigate('Register', { recordIdList: record.idList });
    },
    [navigation, isEditor]
  );

  const handleDeleteRecord = useCallback(
    (record) => {
      if (!isEditor) {
        return;
      }

      if (!record) {
        return;
      }

      const displayName = record.nameFile || record.idList || '';

      showDialog({
        type: 'warning',
        title: t('table.deleteConfirmTitle'),
        message: t('table.deleteConfirmMessage', { name: displayName }),
        actions: [
          { key: 'cancel', label: t('common.cancel'), variant: 'secondary' },
          {
            key: 'confirm',
            label: t('common.delete'),
            variant: 'danger',
            dismissOnPress: false,
            onPress: async () => {
              try {
                await deleteRecord(record.idList);
                hideDialog();
                showDialog({
                  type: 'success',
                  title: t('table.deleteSuccessTitle'),
                  message: t('table.deleteSuccessMessage'),
                  actions: [
                    {
                      key: 'success-ok',
                      label: t('modals.defaultAction'),
                      variant: 'primary',
                    },
                  ],
                });
              } catch (error) {
                console.error(`Error al eliminar el registro ${record.idList} en Firestore:`, error);
                hideDialog();
                showDialog({
                  type: 'error',
                  title: t('table.deleteErrorTitle'),
                  message: t('table.deleteErrorMessage'),
                  actions: [
                    {
                      key: 'error-ok',
                      label: t('modals.defaultAction'),
                      variant: 'primary',
                    },
                  ],
                });
              }
            },
          },
        ],
      });
    },
    [deleteRecord, hideDialog, showDialog, t, isEditor]
  );

  return (
    <View style={styles.container}>
      {(isEditor || hasRecords) ? (
        <View style={styles.actionsRow}>
          {isEditor ? (
            <View style={styles.transferSection}>
              <View style={styles.transferActions}>
                <TouchableOpacity
                  style={[styles.transferButton, isImporting && styles.transferButtonDisabled]}
                  onPress={handleImportRecords}
                  activeOpacity={0.8}
                  disabled={isImporting || isExporting}
                >
                  <Text style={styles.transferButtonText}>
                    {isImporting
                      ? t('table.transfer.importInProgress')
                      : t('table.transfer.importButton')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.transferButton, styles.exportButton, isExporting && styles.transferButtonDisabled]}
                  onPress={handleExportRecords}
                  activeOpacity={0.8}
                  disabled={isExporting || isImporting}
                >
                  <Text style={styles.transferButtonText}>
                    {isExporting
                      ? t('table.transfer.exportInProgress')
                      : t('table.transfer.exportButton')}
                  </Text>
                </TouchableOpacity>
              </View>
              {transferProgress ? (
                <View style={styles.transferProgressContainer}>
                  <Text style={styles.transferProgressTitle}>
                    {transferProgress.type === 'import'
                      ? t('table.transfer.importInProgress')
                      : t('table.transfer.exportInProgress')}
                  </Text>
                  <View style={styles.transferProgressBar}>
                    <View style={[styles.transferProgressFill, transferProgressFillStyle]} />
                  </View>
                  <Text style={styles.transferProgressMessage}>{transferStageMessage}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <View
            style={[styles.tableOptions, !isEditor && styles.tableOptionsStandalone]}
          >
            <TouchableOpacity
              style={[
                styles.optionToggleButton,
                !showImageColumn && styles.optionToggleButtonActive,
              ]}
              onPress={toggleImageColumn}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionToggleButtonText,
                  !showImageColumn && styles.optionToggleButtonTextActive,
                ]}
              >
                {showImageColumn
                  ? t('table.options.hideImages')
                  : t('table.options.showImages')}
              </Text>
            </TouchableOpacity>
          </View>
          {hasRecords ? (
            <View style={styles.paginationContainer}>
              <View style={styles.pageSizeSection}>
                <Text style={styles.paginationLabel}>{t('table.pagination.pageSizeLabel')}</Text>
                <View style={styles.pageSizeButtons}>
                  {PAGE_SIZE_OPTIONS.map((option) => {
                    const isActive = pageSize === option;
                    return (
                      <TouchableOpacity
                        key={`page-size-${option}`}
                        style={[styles.pageSizeButton, isActive && styles.pageSizeButtonActive]}
                        onPress={() => handleChangePageSize(option)}
                      >
                        <Text
                          style={[styles.pageSizeButtonText, isActive && styles.pageSizeButtonTextActive]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.pageNavigation}>
                <TouchableOpacity
                  style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                  onPress={handleGoToPrevious}
                  disabled={currentPage === 1}
                >
                  <Text
                    style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}
                  >
                    {t('table.pagination.previous')}
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
                      key={`page-${pageKey}`}
                      style={[styles.pageNumberButton, isCurrent && styles.pageNumberButtonActive]}
                      onPress={() => handleGoToPage(pageKey)}
                    >
                      <Text
                        style={[styles.pageNumberText, isCurrent && styles.pageNumberTextActive]}
                      >
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
                    style={[
                      styles.pageButtonText,
                      currentPage === totalPages && styles.pageButtonTextDisabled,
                    ]}
                  >
                    {t('table.pagination.next')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.tableContent}>
            <View style={[styles.row, styles.headerRow]}>
              {columns.map((column) => {
                const isSortable = column.sortable !== false;
                const isActive = isSortable && sortConfig.key === column.key;
                return (
                  <View
                    key={column.key}
                    style={[styles.cell, styles.headerCell, { width: column.width }]}
                  >
                    {isSortable ? (
                      <TouchableOpacity
                        onPress={() => handleSort(column.key)}
                        style={styles.headerButton}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[styles.headerText, isActive && styles.headerTextActive]}
                          numberOfLines={1}
                        >
                          {column.label}
                        </Text>
                        <Text
                          style={[styles.sortIcon, !isActive && styles.sortIconInactive]}
                        >
                          {isActive
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '⇅'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.headerText} numberOfLines={1}>
                        {column.label}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
            <ScrollView
              style={styles.tableBodyScroll}
              contentContainerStyle={styles.tableBodyContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {paginatedRecords.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>{t('table.emptyState')}</Text>
                </View>
              ) : (
                paginatedRecords.map((record, index) => (
                  <View
                    key={`${record.idList}-${record.idRoom}`}
                    style={[
                      styles.row,
                      ((currentPage - 1) * pageSize + index) % 2 === 1 && styles.alternateRow,
                    ]}
                  >
                    {columns.map((column) => {
                      const baseStyle = [
                        styles.cell,
                        { width: column.width },
                        column.key === 'image' && styles.imageCell,
                      ];

                      if (column.key === 'image') {
                        return (
                          <View key={column.key} style={baseStyle}>
                            {record.image ? (
                              <CachedImage
                                uri={record.image}
                                storagePath={record.imageStoragePath}
                                style={styles.tableImage}
                                resizeMode="contain"
                              />
                            ) : (
                              <Text style={styles.imagePlaceholder}>{t('table.emptyImage')}</Text>
                            )}
                          </View>
                        );
                      }

                      if (column.key === 'dates') {
                        return (
                          <View key={column.key} style={baseStyle}>
                            <Text style={styles.cellText} numberOfLines={4}>
                              {formatStoredDateRanges(record.dates) || t('table.noData')}
                            </Text>
                          </View>
                        );
                      }

                      if (column.key === 'recordCategory') {
                        const categoryKey = getRecordCategoryKey(record.recordCategory);
                        const categoryLabel =
                          categoryKey === RECORD_CATEGORY.PARTY
                            ? t('table.recordCategory.party')
                            : t('table.recordCategory.base');
                        return (
                          <View key={column.key} style={baseStyle}>
                            <View
                              style={[
                                styles.recordCategoryBadge,
                                categoryKey === RECORD_CATEGORY.PARTY
                                  ? styles.recordCategoryBadgeParty
                                  : styles.recordCategoryBadgeBase,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.recordCategoryText,
                                  categoryKey === RECORD_CATEGORY.PARTY &&
                                    styles.recordCategoryTextParty,
                                ]}
                                numberOfLines={1}
                              >
                                {categoryLabel}
                              </Text>
                            </View>
                          </View>
                        );
                      }

                      if (column.key === 'status') {
                        const statusKey = resolveStatusKey(record.status);
                        const statusLabel = t(`table.statusBadge.${statusKey}`);
                        const stylesConfig = statusStyleMap[statusKey] ?? statusStyleMap.inProgress;
                        return (
                          <View key={column.key} style={baseStyle}>
                            <View
                              style={[
                                styles.statusBadge,
                                stylesConfig.badge,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusBadgeText,
                                  stylesConfig.text,
                                ]}
                              >
                                {statusLabel}
                              </Text>
                            </View>
                          </View>
                        );
                      }

                      if (column.key === 'checklist') {
                        const entries = Array.isArray(record.checklist)
                          ? record.checklist.filter((item) => item.enabled !== false)
                          : [];
                        const formatted =
                          entries.length > 0
                            ? entries
                                .map((item) => `${item.checked ? '✓' : '○'} ${item.name}`)
                                .join('\n')
                            : t('table.checklistPlaceholder');
                        return (
                          <View key={column.key} style={baseStyle}>
                            <Text style={styles.cellText} numberOfLines={6}>
                              {formatted}
                            </Text>
                          </View>
                        );
                      }

                      if (column.key === 'notes') {
                        return (
                          <View key={column.key} style={baseStyle}>
                            <Text style={styles.cellText} numberOfLines={4}>
                              {record.notes || t('table.noData')}
                            </Text>
                          </View>
                        );
                      }

                      if (column.key === 'swfType') {
                        const label = getSwfTypeLabel(record.swfType);
                        return (
                          <View key={column.key} style={baseStyle}>
                            <Text style={styles.cellText} numberOfLines={1}>
                              {label}
                            </Text>
                          </View>
                        );
                      }

                      if (column.key === 'credits') {
                        const creditsValue = typeof record.credits === 'string'
                          ? record.credits.trim()
                          : '';
                        return (
                          <View key={column.key} style={baseStyle}>
                            <Text style={styles.cellText} numberOfLines={2}>
                              {creditsValue || t('table.noData')}
                            </Text>
                          </View>
                        );
                      }

                      if (column.key === 'linkSwf') {
                        const hasSwf =
                          record.linkSwf &&
                          (record.linkSwf.url || record.linkSwf.name || record.linkSwf.storagePath);

                        if (!hasSwf) {
                          return (
                            <View key={column.key} style={baseStyle}>
                              <Text style={styles.cellText}>{t('table.swf.empty')}</Text>
                            </View>
                          );
                        }

                        const storageUri = record.linkSwf?.storagePath
                          ? resolveSwfStorageUri(record.linkSwf.storagePath)
                          : '';

                        return (
                          <View key={column.key} style={baseStyle}>
                            <Text style={styles.cellText} numberOfLines={2}>
                              {record.linkSwf?.name || t('table.swf.nameFallback')}
                            </Text>
                            {storageUri ? (
                              <Text style={styles.swfTablePath} numberOfLines={2}>
                                {storageUri}
                              </Text>
                            ) : null}
                            {record.linkSwf?.url ? (
                              <TouchableOpacity
                                style={styles.swfTableButton}
                                onPress={() => handleOpenSwf(record.linkSwf.url)}
                              >
                                <Text style={styles.swfTableButtonText}>{t('table.swf.open')}</Text>
                              </TouchableOpacity>
                            ) : (
                              <Text style={styles.swfTablePlaceholder}>{t('table.swf.noUrl')}</Text>
                            )}
                          </View>
                        );
                      }

                      if (column.key === 'actions') {
                        return (
                          <View
                            key={column.key}
                            style={[styles.cell, { width: column.width }, styles.actionCell]}
                          >
                            <TouchableOpacity
                              style={[styles.actionButton, styles.editActionButton]}
                              onPress={() => handleEditRecord(record)}
                            >
                              <Text style={styles.actionButtonText}>{t('table.actions.edit')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.deleteActionButton]}
                              onPress={() => handleDeleteRecord(record)}
                            >
                              <Text style={[styles.actionButtonText, styles.deleteActionButtonText]}>
                                {t('table.actions.delete')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      }

                      return (
                        <View key={column.key} style={baseStyle}>
                          <Text style={styles.cellText} numberOfLines={2}>
                            {record[column.key] || t('table.noData')}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <ModalDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        actions={dialog.actions}
        onClose={hideDialog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    width: '100%',
  },
  transferSection: {
    marginRight: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  transferActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 12,
  },
  exportButton: {
    backgroundColor: '#0f766e',
  },
  transferButtonDisabled: {
    opacity: 0.6,
  },
  transferButtonText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  transferProgressContainer: {
    marginTop: 10,
    width: '100%',
  },
  transferProgressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  transferProgressBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#cbd5f5',
    overflow: 'hidden',
  },
  transferProgressFill: {
    height: '100%',
    backgroundColor: '#1d4ed8',
    borderRadius: 999,
  },
  transferProgressMessage: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: 'auto',
    alignSelf: 'flex-end',
  },
  tableOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 8,
  },
  tableOptionsStandalone: {
    marginLeft: 0,
  },
  optionToggleButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  optionToggleButtonActive: {
    backgroundColor: '#fef08a',
    borderColor: '#facc15',
  },
  optionToggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  optionToggleButtonTextActive: {
    color: '#78350f',
  },
  pageSizeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  paginationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 8,
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
    marginLeft: 12,
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
  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tableContent: {
    flex: 1,
  },
  tableBodyScroll: {
    flex: 1,
  },
  tableBodyContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  alternateRow: {
    backgroundColor: '#e2e8f0',
  },
  headerRow: {
    backgroundColor: '#e0f2fe',
  },
  cell: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  headerCell: {
    borderRightWidth: 1,
    borderRightColor: '#bae6fd',
  },
  headerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontWeight: '700',
    color: '#0c4a6e',
    fontSize: 13,
  },
  headerTextActive: {
    color: '#1d4ed8',
  },
  sortIcon: {
    color: '#1d4ed8',
    fontSize: 12,
    marginLeft: 6,
  },
  sortIconInactive: {
    color: '#38bdf8',
  },
  cellText: {
    color: '#0f172a',
    fontSize: 13,
    lineHeight: 18,
  },
  imageCell: {
    alignItems: 'center',
  },
  tableImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  imagePlaceholder: {
    color: '#64748b',
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  statusIncomplete: {
    backgroundColor: '#fee2e2',
  },
  statusInProgress: {
    backgroundColor: '#fef3c7',
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  statusBadgeTextIncomplete: {
    color: '#b91c1c',
  },
  statusBadgeTextInProgress: {
    color: '#92400e',
  },
  statusBadgeTextCompleted: {
    color: '#166534',
  },
  recordCategoryBadge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  recordCategoryBadgeBase: {
    backgroundColor: '#bfdbfe',
  },
  recordCategoryBadgeParty: {
    backgroundColor: '#f97316',
  },
  recordCategoryText: {
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#1e3a8a',
  },
  recordCategoryTextParty: {
    color: '#fff7ed',
  },
  swfTablePath: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 11,
  },
  swfTableButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#0d9488',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  swfTableButtonText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
  },
  swfTablePlaceholder: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editActionButton: {
    backgroundColor: '#c7d2fe',
    marginRight: 10,
  },
  deleteActionButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 12,
  },
  deleteActionButtonText: {
    color: '#b91c1c',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
});
