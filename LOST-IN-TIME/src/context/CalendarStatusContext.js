import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteField, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ensureISODate } from '../utils/dateRanges';
import useAccessControl from '../hooks/useAccessControl';

const STORAGE_KEY = 'calendar-statuses/v3';
const LEGACY_STORAGE_KEYS = ['calendar-statuses/v2', 'calendar-statuses/v1'];
const COLLECTION_NAME = 'calendarStatuses';
const DOCUMENT_ID = 'shared';

const VALID_STATUSES = ['incomplete', 'inProgress', 'completed'];

const CalendarStatusContext = createContext({
  statuses: {},
  setStatusForDate: () => {},
  clearStatusForDate: () => {},
  icons: {},
  addIconForDate: () => {},
  removeIconForDate: () => {},
  clearIconsForDate: () => {},
  comments: {},
  setCommentForDate: () => {},
  clearCommentForDate: () => {},
});

function normalizeStatus(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const match = VALID_STATUSES.find((status) => status === trimmed);
  return match ?? null;
}

function normalizeStatusMap(map) {
  if (!map || typeof map !== 'object') {
    return {};
  }

  return Object.entries(map).reduce((acc, [dateIso, status]) => {
    const normalizedDate = ensureISODate(dateIso);
    const normalizedStatus = normalizeStatus(status);

    if (normalizedDate && normalizedStatus) {
      acc[normalizedDate] = normalizedStatus;
    }

    return acc;
  }, {});
}

function normalizeIconKey(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed;
}

function normalizeIconList(value) {
  if (typeof value === 'string') {
    const normalized = normalizeIconKey(value);
    return normalized ? [normalized] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  const unique = new Set();
  value.forEach((entry) => {
    const normalized = normalizeIconKey(entry);
    if (normalized) {
      unique.add(normalized);
    }
  });

  return Array.from(unique.values());
}

function normalizeIconMap(map) {
  if (!map || typeof map !== 'object') {
    return {};
  }

  return Object.entries(map).reduce((acc, [dateIso, iconValue]) => {
    const normalizedDate = ensureISODate(dateIso);
    const normalizedIcons = normalizeIconList(iconValue);

    if (normalizedDate && normalizedIcons.length > 0) {
      acc[normalizedDate] = normalizedIcons;
    }

    return acc;
  }, {});
}

function normalizeComment(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed;
}

function normalizeCommentMap(map) {
  if (!map || typeof map !== 'object') {
    return {};
  }

  return Object.entries(map).reduce((acc, [dateIso, commentValue]) => {
    const normalizedDate = ensureISODate(dateIso);
    const normalizedComment = normalizeComment(commentValue);

    if (normalizedDate && normalizedComment) {
      acc[normalizedDate] = normalizedComment;
    }

    return acc;
  }, {});
}

function areStatusMapsEqual(a = {}, b = {}) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => a[key] === b[key]);
}

function areIconListsEqual(a = [], b = []) {
  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
}

function areIconMapsEqual(a = {}, b = {}) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => areIconListsEqual(a[key] || [], b[key] || []));
}

function areCommentMapsEqual(a = {}, b = {}) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => (a[key] || '') === (b[key] || ''));
}

function hasEntries(map = {}) {
  return Object.keys(map).length > 0;
}

export function CalendarStatusProvider({ children }) {
  const [statuses, setStatuses] = useState({});
  const [icons, setIcons] = useState({});
  const [comments, setComments] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRemoteReady, setIsRemoteReady] = useState(false);
  const initialLocalStateRef = useRef({ statuses: {}, icons: {}, comments: {} });
  const isRemoteReadyRef = useRef(false);
  const remoteStateRef = useRef({ statuses: {}, icons: {}, comments: {} });
  const { isEditor } = useAccessControl();

  const documentRef = useMemo(() => doc(db, COLLECTION_NAME, DOCUMENT_ID), []);

  useEffect(() => {
    let isMounted = true;

    const loadStatuses = async () => {
      try {
        let storageKeyUsed = STORAGE_KEY;
        let stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (!stored) {
          for (const legacyKey of LEGACY_STORAGE_KEYS) {
            stored = await AsyncStorage.getItem(legacyKey);
            if (stored) {
              storageKeyUsed = legacyKey;
              break;
            }
          }
        }

        if (!stored) {
          return;
        }

        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && isMounted) {
          const normalizedStatuses = normalizeStatusMap(
            parsed.statuses || parsed
          );
          const normalizedIcons = normalizeIconMap(parsed.icons);
          const normalizedComments = normalizeCommentMap(parsed.comments);

          initialLocalStateRef.current = {
            statuses: normalizedStatuses,
            icons: normalizedIcons,
            comments: normalizedComments,
          };

          setStatuses((prev) => {
            if (isRemoteReadyRef.current || areStatusMapsEqual(prev, normalizedStatuses)) {
              return prev;
            }
            return normalizedStatuses;
          });

          setIcons((prev) => {
            if (isRemoteReadyRef.current || areIconMapsEqual(prev, normalizedIcons)) {
              return prev;
            }
            return normalizedIcons;
          });

          setComments((prev) => {
            if (isRemoteReadyRef.current || areCommentMapsEqual(prev, normalizedComments)) {
              return prev;
            }
            return normalizedComments;
          });

          if (storageKeyUsed !== STORAGE_KEY) {
            try {
              await AsyncStorage.removeItem(storageKeyUsed);
            } catch (cleanupError) {
              console.error('Error removing legacy calendar statuses from storage:', cleanupError);
            }
          }
        }
      } catch (error) {
        console.error('Error loading calendar statuses from storage:', error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadStatuses();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      documentRef,
      (snapshot) => {
        isRemoteReadyRef.current = true;
        setIsRemoteReady(true);

        const rawData = snapshot.exists() ? snapshot.data() : {};
        const rawStatuses = rawData && typeof rawData === 'object' ? rawData.statuses : undefined;
        const rawIcons = rawData && typeof rawData === 'object' ? rawData.icons : undefined;
        const normalizedRemoteStatuses = normalizeStatusMap(rawStatuses);
        const normalizedRemoteIcons = normalizeIconMap(rawIcons);
        const rawComments = rawData && typeof rawData === 'object' ? rawData.comments : undefined;
        const normalizedRemoteComments = normalizeCommentMap(rawComments);
        remoteStateRef.current = {
          statuses: normalizedRemoteStatuses,
          icons: normalizedRemoteIcons,
          comments: normalizedRemoteComments,
        };
        const hasPendingLocal =
          hasEntries(initialLocalStateRef.current.statuses) ||
          hasEntries(initialLocalStateRef.current.icons) ||
          hasEntries(initialLocalStateRef.current.comments);
        const remoteHasData =
          hasEntries(normalizedRemoteStatuses) ||
          hasEntries(normalizedRemoteIcons) ||
          hasEntries(normalizedRemoteComments);

        if (hasPendingLocal && !remoteHasData) {
          return;
        }

        setStatuses((prev) =>
          areStatusMapsEqual(prev, normalizedRemoteStatuses) ? prev : normalizedRemoteStatuses
        );
        setIcons((prev) =>
          areIconMapsEqual(prev, normalizedRemoteIcons) ? prev : normalizedRemoteIcons
        );
        setComments((prev) =>
          areCommentMapsEqual(prev, normalizedRemoteComments) ? prev : normalizedRemoteComments
        );
      },
      (error) => {
        console.error('Error al sincronizar los estados del calendario desde Firestore:', error);
      }
    );

    return unsubscribe;
  }, [documentRef]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persist = async () => {
      try {
        const hasStatuses = hasEntries(statuses);
        const hasIcons = hasEntries(icons);
        const hasComments = hasEntries(comments);

        if (!hasStatuses && !hasIcons && !hasComments) {
          await AsyncStorage.removeItem(STORAGE_KEY);
          return;
        }

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ statuses, icons, comments })
        );
      } catch (error) {
        console.error('Error saving calendar statuses to storage:', error);
      }
    };

    persist();
  }, [isHydrated, statuses, icons, comments]);

  const persistStatusInFirestore = useCallback(
    async (dateIso, status) => {
      try {
        await updateDoc(documentRef, { [`statuses.${dateIso}`]: status });
      } catch (error) {
        if (error?.code === 'not-found') {
          try {
            await setDoc(documentRef, { statuses: { [dateIso]: status } }, { merge: true });
            return;
          } catch (innerError) {
            console.error('Error al guardar el estado del calendario en Firestore:', innerError);
          }
        } else {
          console.error('Error al guardar el estado del calendario en Firestore:', error);
        }
      }
    },
    [documentRef]
  );

  const removeStatusFromFirestore = useCallback(
    async (dateIso) => {
      try {
        await updateDoc(documentRef, { [`statuses.${dateIso}`]: deleteField() });
      } catch (error) {
        if (error?.code === 'not-found') {
          try {
            await setDoc(documentRef, { statuses: {} }, { merge: true });
          } catch (innerError) {
            console.error('Error al limpiar el estado del calendario en Firestore:', innerError);
          }
        } else {
          console.error('Error al limpiar el estado del calendario en Firestore:', error);
        }
      }
    },
    [documentRef]
  );

  const persistIconsInFirestore = useCallback(
    async (dateIso, iconKeys) => {
      try {
        await updateDoc(documentRef, { [`icons.${dateIso}`]: iconKeys });
      } catch (error) {
        if (error?.code === 'not-found') {
          try {
            await setDoc(documentRef, { icons: { [dateIso]: iconKeys } }, { merge: true });
            return;
          } catch (innerError) {
            console.error('Error al guardar los iconos del calendario en Firestore:', innerError);
          }
        } else {
          console.error('Error al guardar los iconos del calendario en Firestore:', error);
        }
      }
    },
    [documentRef]
  );

  const removeIconFromFirestore = useCallback(
    async (dateIso) => {
      try {
        await updateDoc(documentRef, { [`icons.${dateIso}`]: deleteField() });
      } catch (error) {
        if (error?.code === 'not-found') {
          try {
            await setDoc(documentRef, { icons: {} }, { merge: true });
          } catch (innerError) {
            console.error('Error al limpiar el icono del calendario en Firestore:', innerError);
          }
        } else {
          console.error('Error al limpiar el icono del calendario en Firestore:', error);
        }
      }
    },
    [documentRef]
  );

  const persistCommentInFirestore = useCallback(
    async (dateIso, comment) => {
      try {
        await updateDoc(documentRef, { [`comments.${dateIso}`]: comment });
      } catch (error) {
        if (error?.code === 'not-found') {
          try {
            await setDoc(documentRef, { comments: { [dateIso]: comment } }, { merge: true });
            return;
          } catch (innerError) {
            console.error('Error al guardar el comentario del calendario en Firestore:', innerError);
          }
        } else {
          console.error('Error al guardar el comentario del calendario en Firestore:', error);
        }
      }
    },
    [documentRef]
  );

  const removeCommentFromFirestore = useCallback(
    async (dateIso) => {
      try {
        await updateDoc(documentRef, { [`comments.${dateIso}`]: deleteField() });
      } catch (error) {
        if (error?.code === 'not-found') {
          try {
            await setDoc(documentRef, { comments: {} }, { merge: true });
          } catch (innerError) {
            console.error('Error al limpiar el comentario del calendario en Firestore:', innerError);
          }
        } else {
          console.error('Error al limpiar el comentario del calendario en Firestore:', error);
        }
      }
    },
    [documentRef]
  );

  useEffect(() => {
    if (!isHydrated || !isRemoteReady) {
      return;
    }

    const localState = initialLocalStateRef.current || { statuses: {}, icons: {}, comments: {} };
    const remoteState = remoteStateRef.current || { statuses: {}, icons: {}, comments: {} };

    const statusUpdates = Object.entries(localState.statuses).filter(
      ([dateIso, status]) => remoteState.statuses?.[dateIso] !== status
    );

    const iconUpdates = Object.entries(localState.icons).filter(
      ([dateIso, iconKeys]) => !areIconListsEqual(remoteState.icons?.[dateIso] || [], iconKeys)
    );

    const commentUpdates = Object.entries(localState.comments).filter(
      ([dateIso, commentValue]) => (remoteState.comments?.[dateIso] || '') !== commentValue
    );

    if (statusUpdates.length === 0 && iconUpdates.length === 0 && commentUpdates.length === 0) {
      initialLocalStateRef.current = { statuses: {}, icons: {}, comments: {} };
      return;
    }

    statusUpdates.forEach(([dateIso, status]) => {
      void persistStatusInFirestore(dateIso, status);
    });

    iconUpdates.forEach(([dateIso, iconKeys]) => {
      if (!iconKeys || iconKeys.length === 0) {
        void removeIconFromFirestore(dateIso);
        return;
      }

      void persistIconsInFirestore(dateIso, iconKeys);
    });

    commentUpdates.forEach(([dateIso, commentValue]) => {
      if (!commentValue) {
        void removeCommentFromFirestore(dateIso);
        return;
      }

      void persistCommentInFirestore(dateIso, commentValue);
    });

    initialLocalStateRef.current = { statuses: {}, icons: {}, comments: {} };
  }, [
    isHydrated,
    isRemoteReady,
    persistStatusInFirestore,
    persistIconsInFirestore,
    removeIconFromFirestore,
    persistCommentInFirestore,
    removeCommentFromFirestore,
  ]);

  const setStatusForDate = useCallback((dateIso, status) => {
    if (!isEditor) {
      console.warn('Attempt to modify calendar statuses without editing permissions.');
      return;
    }

    const normalizedDate = ensureISODate(dateIso);
    const normalizedStatus = normalizeStatus(status);

    if (!normalizedDate || !normalizedStatus) {
      return;
    }

    setStatuses((prev) => {
      if (prev[normalizedDate] === normalizedStatus) {
        return prev;
      }

      return { ...prev, [normalizedDate]: normalizedStatus };
    });

    void persistStatusInFirestore(normalizedDate, normalizedStatus);
  }, [isEditor, persistStatusInFirestore]);

  const clearStatusForDate = useCallback((dateIso) => {
    if (!isEditor) {
      console.warn('Attempt to modify calendar statuses without editing permissions.');
      return;
    }

    const normalizedDate = ensureISODate(dateIso);

    if (!normalizedDate) {
      return;
    }

    setStatuses((prev) => {
      if (!prev[normalizedDate]) {
        return prev;
      }

      const next = { ...prev };
      delete next[normalizedDate];
      return next;
    });

    void removeStatusFromFirestore(normalizedDate);
  }, [isEditor, removeStatusFromFirestore]);

  const addIconForDate = useCallback(
    (dateIso, iconKey) => {
      if (!isEditor) {
        console.warn('Attempt to modify calendar icons without editing permissions.');
        return;
      }

      const normalizedDate = ensureISODate(dateIso);
      const normalizedIconKey = normalizeIconKey(iconKey);

      if (!normalizedDate || !normalizedIconKey) {
        return;
      }

      let nextIconsForDate = null;
      setIcons((prev) => {
        const existing = prev[normalizedDate] || [];
        if (existing.includes(normalizedIconKey)) {
          nextIconsForDate = null;
          return prev;
        }

        nextIconsForDate = [...existing, normalizedIconKey];
        return { ...prev, [normalizedDate]: nextIconsForDate };
      });

      if (nextIconsForDate) {
        void persistIconsInFirestore(normalizedDate, nextIconsForDate);
      }
    },
    [isEditor, persistIconsInFirestore]
  );

  const removeIconForDate = useCallback(
    (dateIso, iconKey) => {
      if (!isEditor) {
        console.warn('Attempt to modify calendar icons without editing permissions.');
        return;
      }

      const normalizedDate = ensureISODate(dateIso);
      const normalizedIconKey = normalizeIconKey(iconKey);

      if (!normalizedDate || !normalizedIconKey) {
        return;
      }

      let removedAll = false;
      let nextIconsForDate = null;

      setIcons((prev) => {
        const existing = prev[normalizedDate] || [];
        if (!existing.includes(normalizedIconKey)) {
          nextIconsForDate = null;
          return prev;
        }

        const filtered = existing.filter((entry) => entry !== normalizedIconKey);
        nextIconsForDate = filtered;

        if (filtered.length === 0) {
          const next = { ...prev };
          delete next[normalizedDate];
          removedAll = true;
          return next;
        }

        return { ...prev, [normalizedDate]: filtered };
      });

      if (nextIconsForDate) {
        if (removedAll) {
          void removeIconFromFirestore(normalizedDate);
        } else {
          void persistIconsInFirestore(normalizedDate, nextIconsForDate);
        }
      }
    },
    [isEditor, persistIconsInFirestore, removeIconFromFirestore]
  );

  const clearIconsForDate = useCallback(
    (dateIso) => {
      if (!isEditor) {
        console.warn('Attempt to modify calendar icons without editing permissions.');
        return;
      }

      const normalizedDate = ensureISODate(dateIso);

      if (!normalizedDate) {
        return;
      }

      setIcons((prev) => {
        if (!prev[normalizedDate]) {
          return prev;
        }

        const next = { ...prev };
        delete next[normalizedDate];
        return next;
      });

      void removeIconFromFirestore(normalizedDate);
    },
    [isEditor, removeIconFromFirestore]
  );

  const setCommentForDate = useCallback(
    (dateIso, comment) => {
      if (!isEditor) {
        console.warn('Attempt to modify calendar comments without editing permissions.');
        return;
      }

      const normalizedDate = ensureISODate(dateIso);
      const normalizedComment = normalizeComment(comment);

      if (!normalizedDate || !normalizedComment) {
        return;
      }

      setComments((prev) => {
        if (prev[normalizedDate] === normalizedComment) {
          return prev;
        }

        return { ...prev, [normalizedDate]: normalizedComment };
      });

      void persistCommentInFirestore(normalizedDate, normalizedComment);
    },
    [isEditor, persistCommentInFirestore]
  );

  const clearCommentForDate = useCallback(
    (dateIso) => {
      if (!isEditor) {
        console.warn('Attempt to modify calendar comments without editing permissions.');
        return;
      }

      const normalizedDate = ensureISODate(dateIso);

      if (!normalizedDate) {
        return;
      }

      setComments((prev) => {
        if (!prev[normalizedDate]) {
          return prev;
        }

        const next = { ...prev };
        delete next[normalizedDate];
        return next;
      });

      void removeCommentFromFirestore(normalizedDate);
    },
    [isEditor, removeCommentFromFirestore]
  );

  const value = useMemo(
    () => ({
      statuses,
      setStatusForDate,
      clearStatusForDate,
      icons,
      addIconForDate,
      removeIconForDate,
      clearIconsForDate,
      comments,
      setCommentForDate,
      clearCommentForDate,
    }),
    [
      statuses,
      setStatusForDate,
      clearStatusForDate,
      icons,
      addIconForDate,
      removeIconForDate,
      clearIconsForDate,
      comments,
      setCommentForDate,
      clearCommentForDate,
    ]
  );

  return <CalendarStatusContext.Provider value={value}>{children}</CalendarStatusContext.Provider>;
}

export function useCalendarStatus() {
  return useContext(CalendarStatusContext);
}
