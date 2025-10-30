import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import FormField from '../components/FormField';
import SearchableSelect from '../components/SearchableSelect';
import DateRangesInput from '../components/DateRangesInput';
import ModalDialog from '../components/ModalDialog';
import ChecklistInput from '../components/ChecklistInput';
import { useRoomRecords } from '../context/RoomRecordsContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessControl } from '../hooks/useAccessControl';
import { parseDateRanges, serializeDateRanges, formatStoredDateRanges } from '../utils/dateRanges';
import { formatPartyLabel } from '../utils/party';
import { normalizeRecordCategory, RECORD_CATEGORY } from '../utils/recordCategory';
import { storage } from '../services/firebase';
import CachedImage from '../components/CachedImage';

const EMPTY_FORM = {
  idList: '',
  nameFile: '',
  idRoom: '',
  partyName: '',
  partyYear: '',
  party: '',
  room: '',
  music: '',
  dates: '',
  recordCategory: RECORD_CATEGORY.BASE,
  image: '',
  imageStoragePath: '',
  linkSwf: null,
  swfType: 'original',
  credits: ORIGINAL_SWF_CREDITS,
  checklist: [],
  notes: '',
  status: 'En proceso',
};

const STATUS_OPTIONS = [
  { key: 'incomplete', label: 'Incompleto', labelKey: 'register.statuses.incomplete' },
  { key: 'in-progress', label: 'En proceso', labelKey: 'register.statuses.inProgress' },
  { key: 'completed', label: 'Completado', labelKey: 'register.statuses.completed' },
];

const MAX_SWF_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const SWF_STORAGE_FOLDER = 'swf-files';
const STORAGE_BUCKET_URL = 'gs://data-club-penguin.firebasestorage.app';

const DEFAULT_SWF_MIME_TYPE = 'application/x-shockwave-flash';
const ORIGINAL_SWF_CREDITS = 'Club Penguin';
const ORIGINAL_SWF_CREDITS_NORMALIZED = ORIGINAL_SWF_CREDITS.toLowerCase();
const IMAGE_STORAGE_FOLDER = 'record-images';
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const DEFAULT_IMAGE_MIME_TYPE = 'image/jpeg';

function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) {
    return '';
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${bytes} B`;
}

function sanitizeStorageSegment(value) {
  if (typeof value !== 'string') {
    return 'registro';
  }

  const trimmed = value.trim();
  const sanitized = trimmed.replace(/[^\w-]/g, '_');
  return sanitized || 'registro';
}

function ensureSwfFileName(name) {
  const fallback = `archivo-${Date.now()}.swf`;
  if (typeof name !== 'string') {
    return fallback;
  }

  const trimmed = name.trim();
  const base = trimmed ? trimmed : fallback;
  const withExtension = base.toLowerCase().endsWith('.swf') ? base : `${base}.swf`;
  const sanitized = withExtension.replace(/[^\w.\-]/g, '_');
  return sanitized.toLowerCase().endsWith('.swf') ? sanitized : fallback;
}

function buildSwfStoragePath(idList, fileName) {
  const segment = sanitizeStorageSegment(idList);
  const trimmedName = typeof fileName === 'string' ? fileName.trim() : '';
  const isValidName =
    trimmedName && /^[\w.\-]+$/.test(trimmedName) && trimmedName.toLowerCase().endsWith('.swf');
  const safeName = isValidName ? trimmedName : ensureSwfFileName('');
  return `${SWF_STORAGE_FOLDER}/${segment}/${safeName}`;
}

function ensureImageFileName(name, mimeType) {
  const fallbackExtension = resolveImageExtension(mimeType);
  const fallback = `imagen-${Date.now()}.${fallbackExtension}`;

  if (typeof name !== 'string') {
    return fallback;
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return fallback;
  }

  const withoutSeparators = trimmed.replace(/[\\/]/g, '');
  const candidate = withoutSeparators.trim() || fallback;
  const extensionMatch = candidate.match(/\.([^./\\]+)$/);

  if (extensionMatch) {
    const normalizedExtension = normalizeImageExtension(extensionMatch[1]);
    if (normalizedExtension) {
      return candidate;
    }

    const base = candidate.slice(0, -extensionMatch[0].length).trim() || 'imagen';
    return `${base}.${fallbackExtension}`;
  }

  return `${candidate}.${fallbackExtension}`;
}

function normalizeImageExtension(extension) {
  if (typeof extension !== 'string') {
    return null;
  }

  const normalized = extension.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized === 'jpeg') {
    return 'jpg';
  }

  if (['jpg', 'png', 'webp', 'gif', 'bmp'].includes(normalized)) {
    return normalized;
  }

  return null;
}

function resolveImageExtension(mimeType) {
  if (typeof mimeType === 'string') {
    const normalized = mimeType.trim().toLowerCase();
    if (normalized.includes('png')) {
      return 'png';
    }
    if (normalized.includes('webp')) {
      return 'webp';
    }
    if (normalized.includes('gif')) {
      return 'gif';
    }
    if (normalized.includes('bmp')) {
      return 'bmp';
    }
    if (normalized.includes('jpg') || normalized.includes('jpeg')) {
      return 'jpg';
    }
  }

  return 'jpg';
}

function buildImageStoragePath(idList, fileName, mimeType = DEFAULT_IMAGE_MIME_TYPE) {
  const segment = sanitizeStorageSegment(idList);
  const safeName = ensureImageFileName(fileName, mimeType);
  return `${IMAGE_STORAGE_FOLDER}/${segment}/${safeName}`;
}

function isValidSwfMimeType(mimeType) {
  if (typeof mimeType !== 'string') {
    return false;
  }

  const normalized = mimeType.toLowerCase();
  return normalized.includes('shockwave') || normalized.includes('swf');
}

function resolveSwfStorageUri(path) {
  if (typeof path !== 'string') {
    return '';
  }

  const trimmedBucket = STORAGE_BUCKET_URL.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${trimmedBucket}/${normalizedPath}`;
}

function areChecklistsEqual(a = [], b = []) {
  if (a.length !== b.length) {
    return false;
  }

  const normalizeEnabled = (value) => (value === false ? false : true);

  return a.every((item, index) => {
    const other = b[index];
    return (
      item?.key === other?.key &&
      item?.name === other?.name &&
      Boolean(item?.checked) === Boolean(other?.checked) &&
      Boolean(item?.legacy) === Boolean(other?.legacy) &&
      normalizeEnabled(item?.enabled) === normalizeEnabled(other?.enabled)
    );
  });
}

export default function RegisterScreen({ navigation, route }) {
  const {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    getNextIdList,
    isReady: recordsReady,
  } = useRoomRecords();
  const {
    idRooms,
    parties,
    checklists,
    isReady: settingsReady,
  } = useSettings();
  const { t } = useTranslation();
  const { isEditor } = useAccessControl();
  const isReadOnly = !isEditor;

  const sortedChecklistTemplates = useMemo(
    () =>
      [...checklists].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      ),
    [checklists]
  );

  const mergeChecklist = useCallback(
    (current = []) => {
      const normalizeKey = (value) => String(value ?? '').trim();
      const currentArray = Array.isArray(current) ? current : [];
      const existingMap = new Map();
      currentArray.forEach((item) => {
        const key = normalizeKey(item?.key ?? item?.name);
        if (!key || existingMap.has(key)) {
          return;
        }
        existingMap.set(key, item);
      });

      const merged = [];
      sortedChecklistTemplates.forEach((template) => {
        const key = normalizeKey(template.key ?? template.name);
        if (!key) {
          return;
        }
        const previous = existingMap.get(key);
        const wasEnabled = previous ? previous.enabled !== false : false;
        merged.push({
          key,
          name: template.name,
          checked: wasEnabled ? Boolean(previous?.checked) : false,
          enabled: wasEnabled,
          legacy: false,
        });
      });

      const templateKeys = new Set(merged.map((item) => item.key));
      const leftovers = currentArray
        .filter((item) => {
          const key = normalizeKey(item?.key ?? item?.name);
          return key && !templateKeys.has(key);
        })
        .map((item) => {
          const key = normalizeKey(item?.key ?? item?.name);
          const name =
            typeof item?.name === 'string' && item.name.trim()
              ? item.name.trim()
              : key;
          const isEnabled = item?.enabled !== false;
          return {
            key,
            name,
            checked: isEnabled ? Boolean(item?.checked) : false,
            enabled: isEnabled,
            legacy: item?.legacy !== undefined ? Boolean(item.legacy) : true,
          };
        });

      return [...merged, ...leftovers];
    },
    [sortedChecklistTemplates]
  );

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    idList: getNextIdList(),
    checklist: mergeChecklist(EMPTY_FORM.checklist),
  }));
  const [dateRanges, setDateRanges] = useState(() => parseDateRanges(EMPTY_FORM.dates));
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialog, setDialog] = useState({ visible: false });
  const [hasSyncedInitialForm, setHasSyncedInitialForm] = useState(
    () => Boolean(route?.params?.recordIdList)
  );
  const [swfState, setSwfState] = useState({ stored: null, preview: null, action: 'none' });
  const [imageState, setImageState] = useState({ stored: null, preview: null });
  const recreationCreditsRef = useRef('');
  const fromFilters = Boolean(route?.params?.fromFilter);

  const earliestDateIso = useMemo(() => {
    if (!Array.isArray(dateRanges) || dateRanges.length === 0) {
      return null;
    }

    let earliest = null;
    dateRanges.forEach((range) => {
      if (!range || typeof range.start !== 'string' || !range.start) {
        return;
      }

      if (earliest === null || range.start < earliest) {
        earliest = range.start;
      }
    });

    return earliest;
  }, [dateRanges]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel={t('register.dialogs.settingsAccess')}
        >
          <Text style={styles.headerIcon}>⋮</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  useEffect(() => {
    const requestedId = route?.params?.recordIdList;
    if (typeof requestedId !== 'string' || !requestedId.trim()) {
      return;
    }

    const targetRecord = records.find((record) => record.idList === requestedId);
    if (targetRecord) {
      const ranges = parseDateRanges(targetRecord.dates);
      const serialized = serializeDateRanges(ranges);
      const sanitized = parseDateRanges(serialized);
      const partyName = targetRecord.partyName || targetRecord.party || '';
      const partyYear = targetRecord.partyYear || '';
      const partyLabel = formatPartyLabel(partyName, partyYear, targetRecord.party);
      const checklist = mergeChecklist(targetRecord.checklist);
      setForm({
        ...targetRecord,
        party: partyLabel,
        partyName,
        partyYear,
        dates: serialized,
        checklist,
      });
      recreationCreditsRef.current =
        targetRecord.swfType === 'recreation' ? targetRecord.credits || '' : '';
      setDateRanges(sanitized);
      setSwfState({ stored: targetRecord.linkSwf ?? null, preview: null, action: 'none' });
      setImageState({
        stored: targetRecord.image
          ? {
              url: targetRecord.image,
              storagePath: targetRecord.imageStoragePath || '',
            }
          : null,
        preview: null,
      });
      setShowForm(true);
      setHasSyncedInitialForm(true);
    } else {
      setDialog({
        visible: true,
        type: 'error',
        title: t('register.dialogs.recordUnavailableTitle'),
        message: t('register.dialogs.recordUnavailableMessage', { id: requestedId }),
      });
    }

    navigation.setParams({ recordIdList: null });
  }, [route?.params?.recordIdList, records, mergeChecklist, navigation, t]);

  const idRoomOptions = useMemo(
    () =>
      idRooms.map((entry) => ({
        key: entry.key,
        value: entry.id,
        primary: entry.id,
        secondary: entry.room,
        data: entry,
      })),
    [idRooms]
  );

  const roomOptions = useMemo(
    () =>
      idRooms.map((entry) => ({
        key: `${entry.key}-room`,
        value: entry.room,
        primary: entry.room,
        secondary: entry.id,
        data: entry,
      })),
    [idRooms]
  );

  const partiesByName = useMemo(() => {
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

    map.forEach((group) => {
      group.entries.sort((a, b) =>
        a.year.localeCompare(b.year, undefined, { numeric: true, sensitivity: 'base' })
      );
    });

    return map;
  }, [parties]);

  const partyNameOptions = useMemo(
    () =>
      Array.from(partiesByName.values())
        .map((group) => ({
          key: `party-name-${group.entries[0].key}`,
          value: group.name,
          primary: group.name,
        }))
        .sort((a, b) => a.primary.localeCompare(b.primary, undefined, { sensitivity: 'base' })),
    [partiesByName]
  );

  const partyYearOptions = useMemo(() => {
    const trimmedName = form.partyName?.trim().toLowerCase() ?? '';
    if (!trimmedName) {
      return [];
    }

    const group = partiesByName.get(trimmedName);
    if (!group) {
      return [];
    }

    const uniqueYears = new Map();
    group.entries.forEach((entry) => {
      const yearKey = entry.year.trim().toLowerCase();
      if (!uniqueYears.has(yearKey)) {
        uniqueYears.set(yearKey, entry);
      }
    });

    return Array.from(uniqueYears.values())
      .sort((a, b) => a.year.localeCompare(b.year, undefined, { numeric: true, sensitivity: 'base' }))
      .map((entry) => ({
        key: `party-year-${entry.key}`,
        value: entry.year,
        primary: entry.year,
      }));
  }, [partiesByName, form.partyName]);

  useEffect(() => {
    setForm((prev) => {
      const merged = mergeChecklist(prev.checklist);
      if (areChecklistsEqual(merged, prev.checklist)) {
        return prev;
      }
      return { ...prev, checklist: merged };
    });
  }, [mergeChecklist]);

  const idRoomMapById = useMemo(() => {
    const map = new Map();
    idRooms.forEach((entry) => {
      map.set(entry.id.trim().toLowerCase(), entry);
    });
    return map;
  }, [idRooms]);

  const idRoomMapByRoom = useMemo(() => {
    const map = new Map();
    idRooms.forEach((entry) => {
      map.set(entry.room.trim().toLowerCase(), entry);
    });
    return map;
  }, [idRooms]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwfTypeChange = (type) => {
    setForm((prev) => {
      const normalizedType = type === 'recreation' ? 'recreation' : 'original';
      const previousCredits = typeof prev.credits === 'string' ? prev.credits : '';

      if (normalizedType === prev.swfType) {
        if (normalizedType === 'original' && previousCredits !== ORIGINAL_SWF_CREDITS) {
          recreationCreditsRef.current = previousCredits.trim();
          return { ...prev, credits: ORIGINAL_SWF_CREDITS };
        }
        return prev;
      }

      if (normalizedType === 'original') {
        recreationCreditsRef.current = previousCredits.trim();
        return { ...prev, swfType: 'original', credits: ORIGINAL_SWF_CREDITS };
      }

      const storedCredits = recreationCreditsRef.current || previousCredits;
      const normalizedStored = (storedCredits || '').trim();
      const shouldClear =
        !recreationCreditsRef.current &&
        normalizedStored.toLowerCase() === ORIGINAL_SWF_CREDITS_NORMALIZED;
      const nextCredits = shouldClear ? '' : normalizedStored;
      recreationCreditsRef.current = nextCredits;

      return { ...prev, swfType: 'recreation', credits: nextCredits };
    });
  };

  const handleCreditsChange = (value) => {
    setForm((prev) => {
      if (prev.swfType === 'recreation') {
        recreationCreditsRef.current = value;
      }
      return { ...prev, credits: value };
    });
  };

  const selectIdRoomEntry = (entry) => {
    if (!entry) {
      return;
    }
    setForm((prev) => ({ ...prev, idRoom: entry.id, room: entry.room }));
  };

  const handleIdRoomChange = (value) => {
    setForm((prev) => {
      const next = { ...prev, idRoom: value };
      const match = idRoomMapById.get(value.trim().toLowerCase());
      if (match) {
        next.room = match.room;
      }
      return next;
    });
  };

  const handleRoomChange = (value) => {
    setForm((prev) => {
      const next = { ...prev, room: value };
      const match = idRoomMapByRoom.get(value.trim().toLowerCase());
      if (match) {
        next.idRoom = match.id;
      }
      return next;
    });
  };

  const handleRecordCategoryChange = (value) => {
    const nextCategory = value === RECORD_CATEGORY.PARTY ? RECORD_CATEGORY.PARTY : RECORD_CATEGORY.BASE;
    setForm((prev) => ({ ...prev, recordCategory: nextCategory }));
  };

  const normalizeText = (value) =>
    typeof value === 'string' ? value.trim() : String(value ?? '').trim();

  const normalizeLower = (value) => normalizeText(value).toLowerCase();

  const handlePartyNameChange = (value) => {
    setForm((prev) => {
      const trimmedName = value.trim().toLowerCase();
      const group = partiesByName.get(trimmedName);
      let nextYear = '';

      if (group) {
        const availableYears = group.entries.map((entry) => entry.year);
        const normalizedPrevYear = prev.partyYear.trim().toLowerCase();
        const canKeepYear = availableYears.some(
          (year) => year.trim().toLowerCase() === normalizedPrevYear
        );

        if (canKeepYear) {
          nextYear = prev.partyYear;
        } else if (availableYears.length === 1) {
          nextYear = availableYears[0];
        }
      }

      return {
        ...prev,
        partyName: value,
        partyYear: nextYear,
        party: formatPartyLabel(value, nextYear),
      };
    });
  };

  const handlePartyYearChange = (value) => {
    setForm((prev) => ({
      ...prev,
      partyYear: value,
      party: formatPartyLabel(prev.partyName, value),
    }));
  };

  const handleDateRangesChange = (ranges) => {
    const serialized = serializeDateRanges(ranges);
    const sanitized = parseDateRanges(serialized);
    setDateRanges(sanitized);
    setForm((prev) => ({ ...prev, dates: serialized }));
  };

  const resetSwfState = useCallback(
    () => setSwfState({ stored: null, preview: null, action: 'none' }),
    []
  );

  const resetForm = useCallback(() => {
    setForm({
      ...EMPTY_FORM,
      idList: getNextIdList(),
      checklist: mergeChecklist([]),
    });
    setDateRanges(parseDateRanges(EMPTY_FORM.dates));
    resetSwfState();
    setImageState({ stored: null, preview: null });
    recreationCreditsRef.current = '';
  }, [getNextIdList, mergeChecklist, resetSwfState]);

  useEffect(() => {
    if (!recordsReady || !settingsReady || hasSyncedInitialForm) {
      return;
    }

    if (route?.params?.recordIdList || showForm) {
      return;
    }

    resetForm();
    setHasSyncedInitialForm(true);
  }, [
    recordsReady,
    settingsReady,
    hasSyncedInitialForm,
    resetForm,
    route?.params?.recordIdList,
    showForm,
  ]);

  const hideDialog = () => {
    setDialog({ visible: false });
  };

  const showDialog = (config) => {
    setDialog({
      visible: true,
      type: config.type ?? 'info',
      title: config.title,
      message: config.message,
      actions: config.actions,
    });
  };

  const setSuccess = (message) => {
    showDialog({ type: 'success', message });
  };

  const setError = (message) => {
    showDialog({ type: 'error', message });
  };

  const handleSave = async () => {
    if (!recordsReady) {
      setError(t('register.dialogs.syncPending'));
      return;
    }

    const trimmedIdList = normalizeText(form.idList);
    if (!trimmedIdList) {
      setError(t('register.dialogs.missingGeneratedId'));
      return;
    }

    const trimmedNameFile = normalizeText(form.nameFile);
    if (!trimmedNameFile) {
      setError(t('register.dialogs.missingNameFile'));
      return;
    }

    const trimmedIdRoom = normalizeText(form.idRoom);
    if (!trimmedIdRoom) {
      setError(t('register.dialogs.missingIdRoom'));
      return;
    }

    const duplicateIdList = records.some((record) => record.idList === trimmedIdList);
    if (duplicateIdList) {
      setError(t('register.dialogs.duplicatedIdList'));
      return;
    }

    const normalizedNameFile = trimmedNameFile.toLowerCase();
    const duplicateNameFile = records.some(
      (record) => normalizeLower(record.nameFile) === normalizedNameFile
    );

    if (duplicateNameFile) {
      setError(t('register.dialogs.duplicatedNameFile'));
      return;
    }

    const normalizedSwfType = form.swfType === 'recreation' ? 'recreation' : 'original';
    const trimmedCredits = normalizeText(form.credits);

    if (normalizedSwfType === 'recreation' && !trimmedCredits) {
      setError(t('register.dialogs.missingCredits'));
      return;
    }

    const normalizedCredits =
      normalizedSwfType === 'original' ? ORIGINAL_SWF_CREDITS : trimmedCredits;
    const normalizedRecordCategory = normalizeRecordCategory(form.recordCategory);

    const serializedRanges = serializeDateRanges(dateRanges);
    const partyLabel = formatPartyLabel(form.partyName, form.partyYear);
    const checklist = mergeChecklist(form.checklist);
    let imagePayload;
    try {
      imagePayload = await buildImagePayload(trimmedIdList);
    } catch (error) {
      if (error?.code === 'image-size-exceeded') {
        setError(t('register.dialogs.imageSizeExceeded'));
      } else {
        console.error('Error al preparar la imagen para guardar:', error?.originalError || error);
        setError(t('register.dialogs.imageUploadError'));
      }
      return;
    }

    let swfPayload;
    try {
      swfPayload = await buildSwfPayload(trimmedIdList);
    } catch (error) {
      if (error?.code === 'swf-size-exceeded') {
        setError(t('register.dialogs.swfSizeExceeded'));
      } else {
        console.error('Error al preparar el archivo SWF para guardar:', error?.originalError || error);
        setError(t('register.dialogs.swfUploadError'));
      }
      return;
    }

    const recordToSave = {
      ...form,
      idList: trimmedIdList,
      nameFile: trimmedNameFile,
      idRoom: trimmedIdRoom,
      party: partyLabel,
      dates: serializedRanges,
      recordCategory: normalizedRecordCategory,
      checklist,
      image: imagePayload?.url ?? '',
      imageStoragePath: imagePayload?.storagePath ?? '',
      linkSwf: swfPayload?.linkSwf ?? null,
      swfType: normalizedSwfType,
      credits: normalizedCredits,
    };
    try {
      const savedRecord = await addRecord(recordToSave);
      setSuccess(t('register.dialogs.saveSuccess', { id: savedRecord.idList }));
      resetForm();
    } catch (error) {
      console.error('Error al guardar el registro en Firestore:', error);
      if (imagePayload?.uploadedPath) {
        await discardUploadedImage(imagePayload.uploadedPath);
      }
      if (swfPayload?.uploadedPath) {
        await discardUploadedSwf(swfPayload.uploadedPath);
      }
      setError(t('register.dialogs.saveError'));
    }
  };

  const handleUpdate = async () => {
    if (!recordsReady) {
      setError(t('register.dialogs.syncPending'));
      return;
    }

    const trimmedIdList = normalizeText(form.idList);
    if (!trimmedIdList) {
      setError(t('register.dialogs.missingId'));
      return;
    }

    const exists = records.some((record) => record.idList === trimmedIdList);

    if (!exists) {
      setError(t('register.dialogs.recordUnavailableMessage', { id: trimmedIdList }));
      return;
    }

    const trimmedNameFile = normalizeText(form.nameFile);
    if (!trimmedNameFile) {
      setError(t('register.dialogs.missingNameFile'));
      return;
    }

    const trimmedIdRoom = normalizeText(form.idRoom);
    if (!trimmedIdRoom) {
      setError(t('register.dialogs.missingIdRoom'));
      return;
    }

    const normalizedNameFile = trimmedNameFile.toLowerCase();
    const duplicateNameFile = records.some(
      (record) =>
        record.idList !== trimmedIdList && normalizeLower(record.nameFile) === normalizedNameFile
    );

    if (duplicateNameFile) {
      setError(t('register.dialogs.duplicatedNameFile'));
      return;
    }

    const normalizedSwfType = form.swfType === 'recreation' ? 'recreation' : 'original';
    const trimmedCredits = normalizeText(form.credits);

    if (normalizedSwfType === 'recreation' && !trimmedCredits) {
      setError(t('register.dialogs.missingCredits'));
      return;
    }

    const normalizedCredits =
      normalizedSwfType === 'original' ? ORIGINAL_SWF_CREDITS : trimmedCredits;
    const normalizedRecordCategory = normalizeRecordCategory(form.recordCategory);

    const serializedRanges = serializeDateRanges(dateRanges);
    const partyLabel = formatPartyLabel(form.partyName, form.partyYear);
    const checklist = mergeChecklist(form.checklist);
    let imagePayload;
    try {
      imagePayload = await buildImagePayload(trimmedIdList);
    } catch (error) {
      if (error?.code === 'image-size-exceeded') {
        setError(t('register.dialogs.imageSizeExceeded'));
      } else {
        console.error(
          `Error al preparar la imagen para actualizar el registro ${trimmedIdList}:`,
          error?.originalError || error
        );
        setError(t('register.dialogs.imageUploadError'));
      }
      return;
    }
    let swfPayload;
    try {
      swfPayload = await buildSwfPayload(trimmedIdList);
    } catch (error) {
      if (error?.code === 'swf-size-exceeded') {
        setError(t('register.dialogs.swfSizeExceeded'));
      } else {
        console.error(
          `Error al preparar el archivo SWF para actualizar el registro ${trimmedIdList}:`,
          error?.originalError || error
        );
        setError(t('register.dialogs.swfUploadError'));
      }
      return;
    }

    const recordToUpdate = {
      ...form,
      idList: trimmedIdList,
      nameFile: trimmedNameFile,
      idRoom: trimmedIdRoom,
      party: partyLabel,
      dates: serializedRanges,
      recordCategory: normalizedRecordCategory,
      checklist,
      image: imagePayload?.url ?? '',
      imageStoragePath: imagePayload?.storagePath ?? '',
      linkSwf: swfPayload?.linkSwf ?? null,
      swfType: normalizedSwfType,
      credits: normalizedCredits,
    };
    try {
      const updatedRecord = await updateRecord(trimmedIdList, recordToUpdate);
      setForm(updatedRecord);
      setImageState({
        stored: updatedRecord.image
          ? {
              url: updatedRecord.image,
              storagePath: updatedRecord.imageStoragePath || '',
            }
          : null,
        preview: null,
      });
      recreationCreditsRef.current =
        updatedRecord.swfType === 'recreation' ? updatedRecord.credits || '' : '';
      setDateRanges(parseDateRanges(updatedRecord.dates));
      setSwfState({ stored: updatedRecord.linkSwf ?? null, preview: null, action: 'none' });
      setSuccess(t('register.dialogs.updateSuccess'));
    } catch (error) {
      console.error(`Error al actualizar el registro ${trimmedIdList} en Firestore:`, error);
      if (imagePayload?.uploadedPath) {
        await discardUploadedImage(imagePayload.uploadedPath);
      }
      if (swfPayload?.uploadedPath) {
        await discardUploadedSwf(swfPayload.uploadedPath);
      }
      setError(t('register.dialogs.updateError'));
    }
  };

  const handleDelete = () => {
    if (!recordsReady) {
      setError(t('register.dialogs.deleteSyncError'));
      return;
    }

    const trimmedIdList = normalizeText(form.idList);

    if (!trimmedIdList) {
      setError(t('register.dialogs.missingId'));
      return;
    }

    const exists = records.some((record) => record.idList === trimmedIdList);

    if (!exists) {
      setError(t('register.dialogs.recordUnavailableMessage', { id: trimmedIdList }));
      return;
    }

    showDialog({
      type: 'warning',
      title: t('register.dialogs.deleteConfirmTitle'),
      message: t('register.dialogs.deleteConfirmMessage', { id: trimmedIdList }),
      actions: [
        { key: 'cancel', label: t('common.cancel'), variant: 'secondary' },
        {
          key: 'confirm',
          label: t('register.actions.delete'),
          variant: 'danger',
          dismissOnPress: false,
          onPress: async () => {
            try {
              await deleteRecord(trimmedIdList);
              resetForm();
              showDialog({
                type: 'success',
                message: t('register.dialogs.deleteSuccess'),
              });
            } catch (error) {
              console.error(`Error al eliminar el registro ${trimmedIdList} en Firestore:`, error);
              showDialog({
                type: 'error',
                message: t('register.dialogs.deleteError'),
              });
            }
          },
        },
      ],
    });
  };

  const handleClear = () => {
    resetForm();
    hideDialog();
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      setError(t('register.dialogs.permissionRequired'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset) {
      setError(t('register.dialogs.imageLoadError'));
      return;
    }

    const mimeType = asset.mimeType || DEFAULT_IMAGE_MIME_TYPE;
    const nameCandidate =
      typeof asset.fileName === 'string' && asset.fileName.trim()
        ? asset.fileName
        : asset.uri?.split('/')?.pop() || `imagen-${Date.now()}`;
    setImageState((prev) => ({
      stored: prev.stored,
      preview: {
        uri: asset.uri,
        mimeType,
        name: nameCandidate,
      },
    }));
    handleChange('image', asset.uri);
    setSuccess(t('register.dialogs.imageSuccess'));
  };

  const handleSelectSwf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [DEFAULT_SWF_MIME_TYPE, 'application/octet-stream'],
        multiple: false,
        copyToCacheDirectory: false,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        setError(t('register.dialogs.swfLoadError'));
        return;
      }

      const mimeType = asset.mimeType || DEFAULT_SWF_MIME_TYPE;
      const originalName = typeof asset.name === 'string' ? asset.name : '';
      const hasSwfExtension = /\.swf$/i.test(originalName.trim());
      const isValidType = isValidSwfMimeType(mimeType) || hasSwfExtension;

      if (!isValidType) {
        setError(t('register.dialogs.swfInvalidType'));
        return;
      }

      const sanitizedName = ensureSwfFileName(originalName);

      let size = typeof asset.size === 'number' ? asset.size : null;
      if (size === null) {
        try {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          size = blob.size;
          blob.close?.();
        } catch (error) {
          console.error('Error al determinar el tamaño del archivo SWF seleccionado:', error);
          setError(t('register.dialogs.swfLoadError'));
          return;
        }
      }

      if (typeof size === 'number' && size > MAX_SWF_FILE_SIZE) {
        setError(t('register.dialogs.swfSizeExceeded'));
        return;
      }

      setSwfState((prev) => ({
        stored: prev.stored,
        preview: {
          uri: asset.uri,
          mimeType,
          name: sanitizedName,
          size: typeof size === 'number' ? size : null,
        },
        action: 'upload',
      }));
      setSuccess(t('register.dialogs.swfSelected'));
    } catch (error) {
      console.error('Error al seleccionar el archivo SWF:', error);
      setError(t('register.dialogs.swfLoadError'));
    }
  };

  const handleSwfSecondaryAction = () => {
    if (swfState.preview) {
      setSwfState((prev) => ({
        stored: prev.stored,
        preview: null,
        action: prev.stored && prev.action === 'remove' ? 'remove' : 'none',
      }));
      setSuccess(t('register.dialogs.swfSelectionCleared'));
      return;
    }

    if (swfState.action === 'remove' && swfState.stored) {
      setSwfState((prev) => ({ stored: prev.stored, preview: null, action: 'none' }));
      setSuccess(t('register.dialogs.swfRemovalUndone'));
      return;
    }

    if (swfState.stored) {
      setSwfState((prev) => ({ stored: prev.stored, preview: null, action: 'remove' }));
      setSuccess(t('register.dialogs.swfMarkedForRemoval'));
    }
  };

  const handleDownloadSwf = async () => {
    const url = swfState.stored?.url;
    if (!url) {
      setError(t('register.dialogs.swfDownloadError'));
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error('unsupported-url');
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error al abrir el enlace del archivo SWF:', error);
      setError(t('register.dialogs.swfDownloadError'));
    }
  };

  const handleOpenCalendar = useCallback(() => {
    if (!earliestDateIso) {
      return;
    }

    navigation.navigate('Calendar', { initialDate: earliestDateIso });
  }, [earliestDateIso, navigation]);

  const uploadImageAsset = useCallback(async (idList, asset) => {
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const blobSize = typeof blob.size === 'number' ? blob.size : 0;

      if (blobSize > MAX_IMAGE_FILE_SIZE) {
        const sizeError = new Error('image-size-exceeded');
        sizeError.code = 'image-size-exceeded';
        throw sizeError;
      }

      const safeName = ensureImageFileName(asset.name, asset.mimeType);
      const storagePath = buildImageStoragePath(idList, safeName, asset.mimeType);
      const fileRef = ref(storage, storagePath);
      const encodedFileName = encodeURIComponent(safeName);
      await uploadBytes(fileRef, blob, {
        contentType: asset.mimeType || DEFAULT_IMAGE_MIME_TYPE,
        contentDisposition: `inline; filename="${safeName}"; filename*=UTF-8''${encodedFileName}`,
        customMetadata: {
          originalFileName: safeName,
        },
      });
      const downloadUrl = await getDownloadURL(fileRef);
      blob.close?.();

      return {
        url: downloadUrl,
        storagePath,
      };
    } catch (error) {
      if (error?.code === 'image-size-exceeded') {
        throw error;
      }

      console.error('Error al subir la imagen seleccionada:', error);
      const uploadError = new Error('image-upload-error');
      uploadError.code = 'image-upload-error';
      uploadError.originalError = error;
      throw uploadError;
    }
  }, []);

  const buildImagePayload = useCallback(
    async (idList) => {
      if (imageState.preview) {
        const uploaded = await uploadImageAsset(idList, imageState.preview);
        return {
          url: uploaded.url,
          storagePath: uploaded.storagePath,
          uploadedPath: uploaded.storagePath,
        };
      }

      if (imageState.stored) {
        return {
          url: imageState.stored.url || '',
          storagePath: imageState.stored.storagePath || '',
          uploadedPath: null,
        };
      }

      return { url: '', storagePath: '', uploadedPath: null };
    },
    [imageState, uploadImageAsset]
  );

  const uploadSwfAsset = useCallback(async (idList, asset) => {
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const blobSize = typeof blob.size === 'number' ? blob.size : asset.size ?? 0;

      if (blobSize > MAX_SWF_FILE_SIZE) {
        const sizeError = new Error('swf-size-exceeded');
        sizeError.code = 'swf-size-exceeded';
        throw sizeError;
      }

      const safeName = ensureSwfFileName(asset.name);
      const storagePath = buildSwfStoragePath(idList, safeName);
      const fileRef = ref(storage, storagePath);
      const encodedFileName = encodeURIComponent(safeName);
      await uploadBytes(fileRef, blob, {
        contentType: asset.mimeType || DEFAULT_SWF_MIME_TYPE,
        contentDisposition: `attachment; filename="${safeName}"; filename*=UTF-8''${encodedFileName}`,
        customMetadata: {
          originalFileName: safeName,
        },
      });
      const downloadUrl = await getDownloadURL(fileRef);
      blob.close?.();

      return {
        url: downloadUrl,
        storagePath,
        name: safeName,
        size: blobSize,
        updatedAt: Date.now(),
      };
    } catch (error) {
      if (error?.code === 'swf-size-exceeded') {
        throw error;
      }

      const uploadError = new Error('swf-upload-error');
      uploadError.code = 'swf-upload-error';
      uploadError.originalError = error;
      throw uploadError;
    }
  }, []);

  const buildSwfPayload = useCallback(
    async (idList) => {
      if (swfState.action === 'upload' && swfState.preview) {
        const uploaded = await uploadSwfAsset(idList, swfState.preview);
        return { linkSwf: uploaded, uploadedPath: uploaded.storagePath };
      }

      if (swfState.action === 'remove') {
        return { linkSwf: null, uploadedPath: null };
      }

      return { linkSwf: swfState.stored ?? null, uploadedPath: null };
    },
    [swfState, uploadSwfAsset]
  );

  const discardUploadedImage = useCallback(async (storagePath) => {
    if (typeof storagePath !== 'string') {
      return;
    }

    const trimmedPath = storagePath.trim();
    if (!trimmedPath) {
      return;
    }

    try {
      const fileRef = ref(storage, trimmedPath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error(`Error al eliminar la imagen temporal ${trimmedPath}:`, error);
    }
  }, []);

  const discardUploadedSwf = useCallback(async (storagePath) => {
    if (typeof storagePath !== 'string') {
      return;
    }

    const trimmedPath = storagePath.trim();
    if (!trimmedPath) {
      return;
    }

    try {
      const fileRef = ref(storage, trimmedPath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error(`Error al eliminar el archivo SWF temporal ${trimmedPath}:`, error);
    }
  }, []);

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return [];
    }

    const includesTerm = (value) => String(value ?? '').toLowerCase().includes(term);

    return records.filter((record) => {
      const swfValues = record.linkSwf
        ? [record.linkSwf?.name, record.linkSwf?.url, record.linkSwf?.storagePath]
        : [];
      const baseFields = [
        record.idList,
        record.idRoom,
        record.nameFile,
        record.party,
        record.partyName,
        record.partyYear,
        record.room,
        record.music,
        record.notes,
        record.status,
        record.swfType,
        record.recordCategory,
        record.credits,
        ...swfValues,
      ];

      if (baseFields.some((field) => includesTerm(field))) {
        return true;
      }

      const formattedDates = formatStoredDateRanges(record.dates || '');
      if (includesTerm(formattedDates)) {
        return true;
      }

      const checklistItems = Array.isArray(record.checklist)
        ? record.checklist.filter((item) => item.enabled !== false)
        : [];

      if (
        checklistItems.some((item) => {
          if (includesTerm(item?.name)) {
            return true;
          }
          const baseLabel = item?.checked ? 'completado' : 'pendiente';
          if (includesTerm(baseLabel)) {
            return true;
          }
          const translatedLabel = item?.checked
            ? t('status.completed').toLowerCase()
            : t('status.inProgress').toLowerCase();
          return includesTerm(translatedLabel);
        })
      ) {
        return true;
      }

      return false;
    });
  }, [records, searchTerm, t]);

  const hasSwfPreview = Boolean(swfState.preview);
  const hasStoredSwf = Boolean(swfState.stored);
  const isSwfMarkedForRemoval = hasStoredSwf && swfState.action === 'remove';
  const swfPrimaryLabel = hasSwfPreview || hasStoredSwf
    ? t('register.form.swfChange')
    : t('register.form.swfSelect');
  let swfSecondaryLabel = null;
  if (hasSwfPreview) {
    swfSecondaryLabel = hasStoredSwf
      ? t('register.form.swfCancel')
      : t('register.form.swfClear');
  } else if (isSwfMarkedForRemoval) {
    swfSecondaryLabel = t('register.form.swfUndoRemove');
  } else if (hasStoredSwf) {
    swfSecondaryLabel = t('register.form.swfRemove');
  }

  const handleSelectRecord = (record) => {
    const ranges = parseDateRanges(record.dates);
    const serialized = serializeDateRanges(ranges);
    const sanitized = parseDateRanges(serialized);
    const partyName = record.partyName || record.party || '';
    const partyYear = record.partyYear || '';
    const partyLabel = formatPartyLabel(partyName, partyYear, record.party);
    const checklist = mergeChecklist(record.checklist);
    setForm({
      ...record,
      party: partyLabel,
      partyName,
      partyYear,
      dates: serialized,
      checklist,
    });
    recreationCreditsRef.current = record.swfType === 'recreation' ? record.credits || '' : '';
    setDateRanges(sanitized);
    setSwfState({ stored: record.linkSwf ?? null, preview: null, action: 'none' });
    setImageState({
      stored: record.image
        ? {
            url: record.image,
            storagePath: record.imageStoragePath || '',
          }
        : null,
      preview: null,
    });
    setShowForm(true);
    setSuccess(t('register.dialogs.loadSuccess'));
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

      <Text style={styles.title}>{t('register.title')}</Text>
      <Text style={styles.description}>{t('register.description')}</Text>

      {fromFilters && (
        <TouchableOpacity
          style={styles.filterReturnButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.filterReturnButtonText}>{t('register.backToFilters')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.secondaryNav}
        onPress={() => navigation.navigate('Table')}
      >
        <Text style={styles.secondaryNavText}>{t('register.goToTable')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          setShowForm((prev) => {
            const next = !prev;
            if (next) {
              resetForm();
              hideDialog();
            }
            return next;
          })
        }
      >
        <Text style={styles.primaryButtonText}>
          {showForm ? t('register.closeForm') : t('register.openForm')}
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>{t('register.searchLabel')}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('register.searchPlaceholder')}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
        />
        {searchTerm.trim().length > 0 && (
          <View style={styles.searchResults}>
            {filteredRecords.length === 0 ? (
              <Text style={styles.searchEmpty}>{t('register.searchEmpty')}</Text>
            ) : (
              filteredRecords.map((record) => {
                const trimmedIdList =
                  typeof record.idList === 'string' ? record.idList.trim() : '';
                const trimmedNameFile =
                  typeof record.nameFile === 'string' ? record.nameFile.trim() : '';
                const trimmedParty =
                  typeof record.party === 'string' ? record.party.trim() : '';
                const trimmedIdRoom =
                  typeof record.idRoom === 'string' ? record.idRoom.trim() : '';

                const idListLine = trimmedIdList
                  ? t('register.searchResults.idListLabel', { value: trimmedIdList })
                  : t('register.searchResults.idListFallback');
                const nameFileLine = trimmedNameFile
                  ? t('register.searchResults.nameFileLabel', { value: trimmedNameFile })
                  : t('register.searchResults.nameFileFallback');
                const partyLine = trimmedParty
                  ? t('register.searchResults.partyLabel', { value: trimmedParty })
                  : null;
                const idRoomLine = trimmedIdRoom
                  ? t('register.searchResults.idRoomLabel', { value: trimmedIdRoom })
                  : null;

                return (
                  <TouchableOpacity
                    key={record.idList}
                    style={styles.searchItem}
                    onPress={() => handleSelectRecord(record)}
                  >
                    <Text style={styles.searchItemTitle}>{idListLine}</Text>
                    <Text style={styles.searchItemDetails}>{nameFileLine}</Text>
                    {partyLine ? (
                      <Text style={styles.searchItemMeta}>{partyLine}</Text>
                    ) : null}
                    {idRoomLine ? (
                      <Text style={styles.searchItemMeta}>{idRoomLine}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </View>

      {showForm && (
        <View style={styles.form}>
          <View style={styles.statusWrapper}>
            <View style={styles.statusRow}>
              {earliestDateIso ? (
                <TouchableOpacity
                  style={styles.statusCalendarButton}
                  onPress={handleOpenCalendar}
                  accessibilityRole="button"
                >
                  <Text style={styles.statusCalendarButtonText}>
                    {t('register.form.swfCalendar')}
                  </Text>
                </TouchableOpacity>
              ) : null}
              <View style={styles.statusControls}>
                <Text style={styles.statusLabel}>{t('register.form.statusLabel')}</Text>
                <View style={styles.statusOptions}>
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = form.status === option.label;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        style={[styles.statusOption, isActive && styles.statusOptionActive]}
                        onPress={isReadOnly ? undefined : () => handleChange('status', option.label)}
                        disabled={isReadOnly}
                        activeOpacity={isReadOnly ? 1 : 0.7}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            isActive && styles.statusOptionTextActive,
                          ]}
                        >
                          {t(option.labelKey)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
          <FormField
            label="ID_List"
            value={form.idList}
            placeholder={t('register.form.idListPlaceholder')}
            editable={false}
          />
          <FormField
            label="Name File"
            value={form.nameFile}
            onChangeText={(value) => handleChange('nameFile', value)}
            placeholder={t('register.form.nameFilePlaceholder')}
            editable={!isReadOnly}
          />
          <SearchableSelect
            label="ID_Room"
            value={form.idRoom}
            onChangeText={handleIdRoomChange}
            placeholder={t('register.form.idRoomPlaceholder')}
            options={idRoomOptions}
            onSelectOption={(option) => selectIdRoomEntry(option.data)}
            emptyMessage={t('register.form.idRoomsEmpty')}
            editable={!isReadOnly}
          />
          <SearchableSelect
            label="Room"
            value={form.room}
            onChangeText={handleRoomChange}
            placeholder={t('register.form.roomPlaceholder')}
            options={roomOptions}
            onSelectOption={(option) => selectIdRoomEntry(option.data)}
            emptyMessage={t('register.form.idRoomsEmpty')}
            editable={!isReadOnly}
          />
          <View style={styles.recordCategorySection}>
            <Text style={styles.recordCategoryHeading}>{t('register.form.recordCategoryLabel')}</Text>
            <View style={styles.recordCategoryOptions}>
              <TouchableOpacity
                style={[
                  styles.recordCategoryOption,
                  form.recordCategory !== RECORD_CATEGORY.PARTY && styles.recordCategoryOptionActive,
                ]}
                onPress={
                  isReadOnly ? undefined : () => handleRecordCategoryChange(RECORD_CATEGORY.BASE)
                }
                disabled={isReadOnly}
                activeOpacity={isReadOnly ? 1 : 0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: form.recordCategory !== RECORD_CATEGORY.PARTY }}
              >
                <Text
                  style={[
                    styles.recordCategoryOptionText,
                    form.recordCategory !== RECORD_CATEGORY.PARTY && styles.recordCategoryOptionTextActive,
                  ]}
                >
                  {t('register.form.recordCategoryBase')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.recordCategoryOption,
                  form.recordCategory === RECORD_CATEGORY.PARTY && styles.recordCategoryOptionActive,
                ]}
                onPress={
                  isReadOnly ? undefined : () => handleRecordCategoryChange(RECORD_CATEGORY.PARTY)
                }
                disabled={isReadOnly}
                activeOpacity={isReadOnly ? 1 : 0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: form.recordCategory === RECORD_CATEGORY.PARTY }}
              >
                <Text
                  style={[
                    styles.recordCategoryOptionText,
                    form.recordCategory === RECORD_CATEGORY.PARTY && styles.recordCategoryOptionTextActive,
                  ]}
                >
                  {t('register.form.recordCategoryParty')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <SearchableSelect
            label="Fiesta"
            value={form.partyName}
            onChangeText={handlePartyNameChange}
            placeholder={t('register.form.partyPlaceholder')}
            options={partyNameOptions}
            onSelectOption={(option) => handlePartyNameChange(option.value ?? '')}
            emptyMessage={t('register.form.partiesEmpty')}
            editable={!isReadOnly}
          />
          <SearchableSelect
            label="Año de la fiesta"
            value={form.partyYear}
            onChangeText={handlePartyYearChange}
            placeholder={
              form.partyName.trim()
                ? t('register.form.partyYearPlaceholder')
                : t('register.form.partyYearPlaceholderDisabled')
            }
            options={partyYearOptions}
            onSelectOption={(option) => handlePartyYearChange(option.value ?? '')}
            emptyMessage={t('register.form.partyYearEmpty')}
            keyboardType="numeric"
            editable={!isReadOnly && Boolean(form.partyName.trim())}
          />
          <FormField
            label="Music"
            value={form.music}
            onChangeText={(value) => handleChange('music', value)}
            placeholder={t('register.form.musicPlaceholder')}
            editable={!isReadOnly}
          />
          <DateRangesInput
            label="Dates"
            ranges={dateRanges}
            onChange={handleDateRangesChange}
            editable={!isReadOnly}
          />
          <ChecklistInput
            label={t('register.form.checklistLabel')}
            items={form.checklist}
            onChange={(items) => setForm((prev) => ({ ...prev, checklist: items }))}
            hasConfiguredTemplates={sortedChecklistTemplates.length > 0}
            editable={!isReadOnly}
          />
          <View style={styles.imagePickerSection}>
            <Text style={styles.imagePickerLabel}>{t('register.form.imageLabel')}</Text>
            <TouchableOpacity
              style={[styles.imagePickerButton, isReadOnly && styles.disabledButton]}
              onPress={isReadOnly ? undefined : handlePickImage}
              disabled={isReadOnly}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.imagePickerButtonText}>
                {form.image ? t('register.form.imageChange') : t('register.form.imageSelect')}
              </Text>
            </TouchableOpacity>
            {form.image ? (
              <View style={styles.imagePreviewWrapper}>
                <CachedImage
                  uri={form.image}
                  storagePath={form.imageStoragePath}
                  style={styles.imagePreview}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <Text style={styles.imagePlaceholder}>{t('register.form.imageEmpty')}</Text>
            )}
          </View>
          <View style={styles.swfSection}>
            <View style={styles.swfTypeContainer}>
              <Text style={styles.swfTypeHeading}>{t('register.form.swfTypeLabel')}</Text>
              <View style={styles.swfTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.swfTypeOption,
                    (form.swfType ?? 'original') !== 'recreation' && styles.swfTypeOptionActive,
                  ]}
                  onPress={isReadOnly ? undefined : () => handleSwfTypeChange('original')}
                  disabled={isReadOnly}
                  activeOpacity={isReadOnly ? 1 : 0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: (form.swfType ?? 'original') !== 'recreation' }}
                >
                  <Text
                    style={[
                      styles.swfTypeOptionText,
                      (form.swfType ?? 'original') !== 'recreation' &&
                        styles.swfTypeOptionTextActive,
                    ]}
                  >
                    {t('register.form.swfTypeOriginal')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.swfTypeOption,
                    form.swfType === 'recreation' && styles.swfTypeOptionActive,
                  ]}
                  onPress={isReadOnly ? undefined : () => handleSwfTypeChange('recreation')}
                  disabled={isReadOnly}
                  activeOpacity={isReadOnly ? 1 : 0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: form.swfType === 'recreation' }}
                >
                  <Text
                    style={[
                      styles.swfTypeOptionText,
                      form.swfType === 'recreation' && styles.swfTypeOptionTextActive,
                    ]}
                  >
                    {t('register.form.swfTypeRecreation')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <FormField
              label={t('register.form.creditsLabel')}
              value={form.credits}
              onChangeText={handleCreditsChange}
              placeholder={
                form.swfType === 'recreation'
                  ? t('register.form.creditsPlaceholderRecreation')
                  : t('register.form.creditsPlaceholderOriginal')
              }
              editable={form.swfType === 'recreation' && !isReadOnly}
            />
            <Text style={styles.swfLabel}>{t('register.form.swfLabel')}</Text>
            <View style={styles.swfButtonsRow}>
              <TouchableOpacity
                style={[styles.swfPrimaryButton, isReadOnly && styles.disabledButton]}
                onPress={isReadOnly ? undefined : handleSelectSwf}
                disabled={isReadOnly}
                activeOpacity={isReadOnly ? 1 : 0.7}
              >
                <Text style={styles.swfPrimaryButtonText}>{swfPrimaryLabel}</Text>
              </TouchableOpacity>
              {swfSecondaryLabel ? (
                <TouchableOpacity
                  style={[
                    styles.swfSecondaryButton,
                    isSwfMarkedForRemoval && styles.swfWarningButton,
                    isReadOnly && styles.disabledButton,
                  ]}
                  onPress={isReadOnly ? undefined : handleSwfSecondaryAction}
                  disabled={isReadOnly}
                  activeOpacity={isReadOnly ? 1 : 0.7}
                >
                  <Text
                    style={[
                      styles.swfSecondaryButtonText,
                      isSwfMarkedForRemoval && styles.swfWarningButtonText,
                    ]}
                  >
                    {swfSecondaryLabel}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {hasSwfPreview ? (
              <View style={styles.swfInfo}>
                <Text style={styles.swfFileName}>{swfState.preview?.name}</Text>
                {swfState.preview?.size ? (
                  <Text style={styles.swfFileDetails}>
                    {formatFileSize(swfState.preview.size)}
                  </Text>
                ) : null}
                <Text style={styles.swfInfoNote}>{t('register.form.swfPendingUpload')}</Text>
              </View>
            ) : hasStoredSwf ? (
              <View style={styles.swfInfo}>
                <Text style={styles.swfFileName}>
                  {swfState.stored?.name || t('register.form.swfNameFallback')}
                </Text>
                {swfState.stored?.size ? (
                  <Text style={styles.swfFileDetails}>
                    {formatFileSize(swfState.stored.size)}
                  </Text>
                ) : null}
                {swfState.stored?.storagePath ? (
                  <Text style={styles.swfStoragePath} numberOfLines={2}>
                    {resolveSwfStorageUri(swfState.stored.storagePath)}
                  </Text>
                ) : null}
                {swfState.stored?.url ? (
                  <View style={styles.swfActionsRow}>
                    <TouchableOpacity
                      style={styles.swfDownloadButton}
                      onPress={handleDownloadSwf}
                    >
                      <Text style={styles.swfDownloadButtonText}>
                        {t('register.form.swfDownload')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.swfInfoNote}>
                    {t('register.form.swfDownloadUnavailable')}
                  </Text>
                )}
                {isSwfMarkedForRemoval && (
                  <Text style={styles.swfRemovalNote}>{t('register.form.swfRemovalPending')}</Text>
                )}
              </View>
            ) : (
              <Text style={styles.swfPlaceholder}>{t('register.form.swfEmpty')}</Text>
            )}
          </View>
          <FormField
            label={t('register.form.notesLabel')}
            value={form.notes}
            onChangeText={(value) => handleChange('notes', value)}
            placeholder={t('register.form.notesPlaceholder')}
            multiline
            editable={!isReadOnly}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, isReadOnly && styles.disabledButton]}
              onPress={isReadOnly ? undefined : handleSave}
              disabled={isReadOnly}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.actionText}>{t('register.actions.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton, isReadOnly && styles.disabledButton]}
              onPress={isReadOnly ? undefined : handleUpdate}
              disabled={isReadOnly}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.actionText}>{t('register.actions.update')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton, isReadOnly && styles.disabledButton]}
              onPress={isReadOnly ? undefined : handleDelete}
              disabled={isReadOnly}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.actionText}>{t('register.actions.delete')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton, isReadOnly && styles.disabledButton]}
              onPress={isReadOnly ? undefined : handleClear}
              disabled={isReadOnly}
              activeOpacity={isReadOnly ? 1 : 0.7}
            >
              <Text style={styles.actionText}>{t('register.actions.clear')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ModalDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        actions={dialog.actions}
        onClose={hideDialog}
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
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 20,
  },
  filterReturnButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  filterReturnButtonText: {
    color: '#0c4a6e',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryNav: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  secondaryNavText: {
    color: '#2563eb',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#111827',
  },
  searchResults: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchEmpty: {
    padding: 12,
    color: '#6b7280',
    fontSize: 13,
    fontStyle: 'italic',
  },
  searchItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchItemTitle: {
    fontWeight: '600',
    color: '#0f172a',
  },
  searchItemDetails: {
    fontSize: 13,
    color: '#1f2937',
    marginTop: 4,
  },
  searchItemMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusWrapper: {
    marginBottom: 16,
  },
  statusRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  statusControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginLeft: 'auto',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 12,
  },
  statusCalendarButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 12,
    marginTop: 4,
  },
  statusCalendarButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  statusOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusOption: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  statusOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusOptionText: {
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '600',
  },
  statusOptionTextActive: {
    color: '#f8fafc',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerIcon: {
    fontSize: 22,
    color: '#1d4ed8',
    fontWeight: '700',
  },
  imagePickerSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  imagePickerButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  imagePreviewWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  imagePreview: {
    width: '40%',
    minWidth: 160,
    aspectRatio: 4 / 3,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  imagePlaceholder: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  recordCategorySection: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  recordCategoryHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  recordCategoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recordCategoryOption: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  recordCategoryOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  recordCategoryOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  recordCategoryOptionTextActive: {
    color: '#f8fafc',
  },
  swfSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  swfTypeContainer: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  swfTypeHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  swfTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  swfTypeOption: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  swfTypeOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  swfTypeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  swfTypeOptionTextActive: {
    color: '#f8fafc',
  },
  swfLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  swfButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  swfPrimaryButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  swfPrimaryButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  swfSecondaryButton: {
    backgroundColor: '#475569',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  swfSecondaryButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  swfWarningButton: {
    backgroundColor: '#f97316',
  },
  swfWarningButtonText: {
    color: '#fff7ed',
  },
  swfInfo: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  swfFileName: {
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  swfFileDetails: {
    marginTop: 4,
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
  swfStoragePath: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  swfInfoNote: {
    marginTop: 6,
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
  swfRemovalNote: {
    marginTop: 6,
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
    textAlign: 'center',
  },
  swfPlaceholder: {
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  swfActionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  swfDownloadButton: {
    backgroundColor: '#0d9488',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  swfDownloadButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButton: {
    backgroundColor: '#0d9488',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  clearButton: {
    backgroundColor: '#475569',
  },
  actionText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
});
