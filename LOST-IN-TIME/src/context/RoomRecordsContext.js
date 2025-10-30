import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { formatPartyLabel } from '../utils/party';
import { normalizeRecordCategory } from '../utils/recordCategory';
import { useAccessControl } from '../hooks/useAccessControl';

const ORIGINAL_CREDITS = 'Club Penguin';

const RoomRecordsContext = createContext();

const COLLECTION_NAME = 'roomRecords';

const STATUS_LABELS = {
  incomplete: 'Incompleto',
  inProgress: 'En proceso',
  completed: 'Completado',
};

const initialState = [];

function sanitizeText(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function normalizeSwfType(value, creditsValue) {
  const normalizedType = sanitizeText(value).toLowerCase();
  if (normalizedType.startsWith('recr')) {
    return 'recreation';
  }
  if (normalizedType.startsWith('orig')) {
    return 'original';
  }

  const normalizedCredits = sanitizeText(creditsValue).toLowerCase();
  if (normalizedCredits && normalizedCredits !== ORIGINAL_CREDITS.toLowerCase()) {
    return 'recreation';
  }

  return 'original';
}

function normalizeSwfLink(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    const url = sanitizeText(value);
    return url ? { url } : null;
  }

  if (typeof value === 'object') {
    const url = sanitizeText(value?.url);
    const storagePath = sanitizeText(value?.storagePath);
    const name = sanitizeText(value?.name);

    const sizeValue = value?.size;
    let size = null;
    if (typeof sizeValue === 'number' && Number.isFinite(sizeValue)) {
      size = sizeValue;
    } else if (typeof sizeValue === 'string' && sizeValue.trim()) {
      const parsed = Number(sizeValue);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        size = parsed;
      }
    }

    const timestampValue = value?.updatedAt ?? value?.timestamp ?? value?.createdAt ?? null;
    let updatedAt = null;
    if (typeof timestampValue === 'number' && Number.isFinite(timestampValue)) {
      updatedAt = timestampValue;
    } else if (typeof timestampValue === 'string' && timestampValue.trim()) {
      const parsedTimestamp = Number(timestampValue);
      if (!Number.isNaN(parsedTimestamp) && Number.isFinite(parsedTimestamp)) {
        updatedAt = parsedTimestamp;
      }
    }

    if (!url && !storagePath && !name) {
      return null;
    }

    const normalized = {
      url: url || '',
      storagePath: storagePath || '',
      name: name || '',
    };

    if (size !== null && size >= 0) {
      normalized.size = size;
    }

    if (updatedAt !== null) {
      normalized.updatedAt = updatedAt;
    }

    return normalized;
  }

  return null;
}

function normalizeImageData(imageValue, storagePathValue) {
  const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '');

  let url = '';
  let storagePath = sanitizeString(storagePathValue);

  if (typeof imageValue === 'string') {
    url = sanitizeString(imageValue);
  } else if (imageValue && typeof imageValue === 'object') {
    const urlCandidates = [
      imageValue.url,
      imageValue.downloadURL,
      imageValue.downloadUrl,
      imageValue.uri,
      imageValue.imageUrl,
    ];
    for (const candidate of urlCandidates) {
      const sanitized = sanitizeString(candidate);
      if (sanitized) {
        url = sanitized;
        break;
      }
    }

    if (!storagePath) {
      const pathCandidates = [imageValue.storagePath, imageValue.path, imageValue.storage];
      for (const candidate of pathCandidates) {
        const sanitized = sanitizeString(candidate);
        if (sanitized) {
          storagePath = sanitized;
          break;
        }
      }
    }
  }

  return { url, storagePath };
}

function normalizeStatus(value) {
  const normalized = sanitizeText(value).toLowerCase();

  if (!normalized) {
    return STATUS_LABELS.inProgress;
  }

  if (normalized.includes('incom')) {
    return STATUS_LABELS.incomplete;
  }

  if (normalized.includes('complet')) {
    return STATUS_LABELS.completed;
  }

  if (normalized.includes('progress') || normalized.includes('proceso')) {
    return STATUS_LABELS.inProgress;
  }

  return STATUS_LABELS.inProgress;
}

function normalizeChecklist(value) {
  if (Array.isArray(value)) {
    const seen = new Set();
    return value
      .map((item) => {
        const rawKey = item?.key ?? item?.id ?? item?.name ?? '';
        const key = sanitizeText(rawKey) || `checklist-${Math.random().toString(36).slice(2, 10)}`;
        if (seen.has(key)) {
          return null;
        }
        seen.add(key);
        const name = sanitizeText(item?.name ?? item?.label ?? '') || key;
        const isEnabled = item?.enabled !== false;
        const isChecked = Boolean(item?.checked ?? item?.value ?? item?.isChecked);
        return {
          key,
          name,
          checked: isEnabled ? isChecked : false,
          legacy: Boolean(item?.legacy),
          enabled: isEnabled,
        };
      })
      .filter((item) => item !== null);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).map(([rawKey, rawValue]) => {
      const key = sanitizeText(rawKey) || `checklist-${Math.random().toString(36).slice(2, 10)}`;
      const isObject = rawValue && typeof rawValue === 'object';
      const isEnabled = isObject ? rawValue.enabled !== false : true;
      const checked = isObject ? Boolean(rawValue.checked ?? rawValue.value) : Boolean(rawValue);
      const name = isObject && rawValue.name ? sanitizeText(rawValue.name) : key;
      const legacy = Boolean(isObject && rawValue.legacy);
      return { key, name, checked: isEnabled ? checked : false, legacy, enabled: isEnabled };
    });
  }

  return [];
}

function normalizeRecord(record) {
  const idList = sanitizeText(record?.idList);
  const idRoom = sanitizeText(record?.idRoom);
  const room = sanitizeText(record?.room);
  const music = sanitizeText(record?.music);
  const dates = sanitizeText(record?.dates);
  const recordCategory = normalizeRecordCategory(record?.recordCategory);
  const imageData = normalizeImageData(record?.image, record?.imageStoragePath);
  const image = imageData.url;
  const imageStoragePath = imageData.storagePath;
  const linkSwf = normalizeSwfLink(record?.linkSwf);
  const nameFile = sanitizeText(record?.nameFile);
  const notes = sanitizeText(record?.notes);
  const status = normalizeStatus(record?.status);
  const rawCredits = sanitizeText(record?.credits);
  const swfType = normalizeSwfType(record?.swfType, rawCredits);
  const credits = swfType === 'original' ? ORIGINAL_CREDITS : rawCredits;

  const partyName = sanitizeText(record?.partyName || record?.party);
  const partyYear = sanitizeText(record?.partyYear);
  const partyLabel = formatPartyLabel(partyName, partyYear, record?.party);
  const checklist = normalizeChecklist(record?.checklist);

  return {
    idList: idList || '',
    idRoom: idRoom || '',
    nameFile,
    partyName,
    partyYear,
    party: partyLabel,
    room,
    music,
    dates,
    recordCategory,
    image,
    imageStoragePath,
    linkSwf: linkSwf ?? null,
    swfType,
    credits: credits || '',
    checklist,
    notes,
    status,
  };
}

async function deleteStorageFile(path) {
  if (typeof path !== 'string') {
    return;
  }

  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return;
  }

  try {
    const fileRef = ref(storage, trimmedPath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error(`Error al eliminar el archivo de almacenamiento ${trimmedPath}:`, error);
  }
}

function formatId(value) {
  return String(value);
}

function extractNumericId(id) {
  const match = String(id).match(/\d+/g);
  if (!match) {
    return 0;
  }
  const number = Number(match.join(''));
  return Number.isNaN(number) ? 0 : number;
}

export function RoomRecordsProvider({ children }) {
  const [records, setRecords] = useState(initialState);
  const [isReady, setIsReady] = useState(false);
  const nextIdRef = useRef(1);
  const isHydratedRef = useRef(false);
  const { isEditor } = useAccessControl();

  const collectionRef = useMemo(() => collection(db, COLLECTION_NAME), []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const snapshotRecords = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          const idList = data?.idList ? data.idList : docSnapshot.id;
          return normalizeRecord({ ...data, idList });
        });

        snapshotRecords.sort((a, b) => {
          const idA = extractNumericId(a.idList);
          const idB = extractNumericId(b.idList);
          if (idA !== idB) {
            return idA - idB;
          }
          return String(a.idList || '').localeCompare(String(b.idList || ''), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        });

        setRecords(snapshotRecords);
        const maxId = snapshotRecords.reduce(
          (max, record) => Math.max(max, extractNumericId(record.idList)),
          0
        );
        nextIdRef.current = maxId + 1;
        isHydratedRef.current = true;
        setIsReady(true);
      },
      (error) => {
        console.error('Error al sincronizar los registros desde Firestore:', error);
      }
    );

    return unsubscribe;
  }, [collectionRef]);

  const addRecord = useCallback(
    async (record) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to add records.');
        error.code = 'access-denied';
        throw error;
      }

      const assignedId = formatId(record?.idList ?? nextIdRef.current);
      const normalizedRecord = normalizeRecord({ ...record, idList: assignedId });

      if (!isHydratedRef.current) {
        console.warn('Intento de crear un registro antes de completar la sincronización inicial.');
      }

      try {
        const documentRef = doc(collectionRef, assignedId);
        await setDoc(documentRef, { ...normalizedRecord, idList: assignedId });
        const numericId = extractNumericId(assignedId);
        if (numericId + 1 > nextIdRef.current) {
          nextIdRef.current = numericId + 1;
        }
        return normalizedRecord;
      } catch (error) {
        console.error(`Error al guardar el registro ${assignedId} en Firestore:`, error);
        throw error;
      }
    },
    [collectionRef, isEditor]
  );

  const updateRecord = useCallback(
    async (idList, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to update records.');
        error.code = 'access-denied';
        throw error;
      }

      const formattedId = formatId(idList);
      const existingRecord = records.find((record) => record.idList === formattedId) || {};
      const normalizedRecord = normalizeRecord({ ...existingRecord, ...data, idList: formattedId });
      const previousPath = existingRecord?.linkSwf?.storagePath;
      const nextPath = normalizedRecord?.linkSwf?.storagePath;
      const previousImagePath = existingRecord?.imageStoragePath;
      const nextImagePath = normalizedRecord?.imageStoragePath;

      if (!formattedId) {
        throw new Error('No se proporcionó un ID_List válido para actualizar.');
      }

      if (!isHydratedRef.current) {
        console.warn('Intento de actualizar un registro antes de completar la sincronización inicial.');
      }

      try {
        const documentRef = doc(collectionRef, formattedId);
        await setDoc(documentRef, { ...normalizedRecord, idList: formattedId }, { merge: false });
        if (previousPath && previousPath !== nextPath) {
          await deleteStorageFile(previousPath);
        }
        if (previousImagePath && previousImagePath !== nextImagePath) {
          await deleteStorageFile(previousImagePath);
        }
        return normalizedRecord;
      } catch (error) {
        console.error(`Error al actualizar el registro ${formattedId} en Firestore:`, error);
        throw error;
      }
    },
    [collectionRef, records, isEditor]
  );

  const deleteRecord = useCallback(
    async (idList) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to delete records.');
        error.code = 'access-denied';
        throw error;
      }

      const formattedId = formatId(idList);
      const existingRecord = records.find((record) => record.idList === formattedId);
      const previousPath = existingRecord?.linkSwf?.storagePath;
      const previousImagePath = existingRecord?.imageStoragePath;

      if (!formattedId) {
        throw new Error('No se proporcionó un ID_List válido para eliminar.');
      }

      if (!isHydratedRef.current) {
        console.warn('Intento de eliminar un registro antes de completar la sincronización inicial.');
      }

      try {
        const documentRef = doc(collectionRef, formattedId);
        await deleteDoc(documentRef);
        if (previousPath) {
          await deleteStorageFile(previousPath);
        }
        if (previousImagePath) {
          await deleteStorageFile(previousImagePath);
        }
      } catch (error) {
        console.error(`Error al eliminar el registro ${formattedId} en Firestore:`, error);
        throw error;
      }
    },
    [collectionRef, isEditor, records]
  );

  const getNextIdList = useCallback(() => formatId(nextIdRef.current), []);

  const value = useMemo(
    () => ({
      records,
      addRecord,
      updateRecord,
      deleteRecord,
      getNextIdList,
      isReady,
    }),
    [records, addRecord, updateRecord, deleteRecord, getNextIdList, isReady]
  );

  return <RoomRecordsContext.Provider value={value}>{children}</RoomRecordsContext.Provider>;
}

export function useRoomRecords() {
  const context = useContext(RoomRecordsContext);
  if (!context) {
    throw new Error('useRoomRecords must be used within a RoomRecordsProvider');
  }
  return context;
}
