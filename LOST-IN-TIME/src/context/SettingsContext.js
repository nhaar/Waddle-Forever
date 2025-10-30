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
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAccessControl } from '../hooks/useAccessControl';
import { ensureISODate } from '../utils/dateRanges';

const SettingsContext = createContext();

const DEFAULT_PARTY_YEAR = 'Sin año';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOCUMENT_ID = 'global';

const SUPPORTED_LANGUAGES = ['en', 'es'];
const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_STORAGE_KEY = 'settings.languagePreference';

const initialState = {
  idRooms: [],
  parties: [],
  checklists: [],
  calendarIcons: [],
  calendarHolidayIcons: [],
  calendarHolidays: [],
  language: DEFAULT_LANGUAGE,
};

function generateKey(prefix) {
  const random = Math.floor(Math.random() * 1_000_000);
  return `${prefix}-${Date.now()}-${random}`;
}

function sanitizeString(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function normalizeIdRoom(entry) {
  const id = sanitizeString(entry?.id);
  const room = sanitizeString(entry?.room);

  if (!id || !room) {
    return null;
  }

  return {
    key: entry?.key ? String(entry.key) : generateKey('idRoom'),
    id,
    room,
  };
}

function normalizeParty(entry) {
  const name = sanitizeString(entry?.name);
  const rawYear = sanitizeString(entry?.year);

  if (!name) {
    return null;
  }

  const year = rawYear || DEFAULT_PARTY_YEAR;

  return {
    key: entry?.key ? String(entry.key) : generateKey('party'),
    name,
    year,
  };
}

function normalizeChecklist(entry) {
  const name = sanitizeString(entry?.name);

  if (!name) {
    return null;
  }

  return {
    key: entry?.key ? String(entry.key) : generateKey('checklist'),
    name,
  };
}

function normalizeCalendarIcon(entry) {
  const name = sanitizeString(entry?.name);
  const url = sanitizeString(entry?.url || entry?.image || entry?.imageUrl);
  const storagePath = sanitizeString(entry?.storagePath);

  if (!name || !url) {
    return null;
  }

  const normalized = {
    key: entry?.key ? String(entry.key) : generateKey('calendarIcon'),
    name,
    url,
  };

  if (storagePath) {
    normalized.storagePath = storagePath;
  }

  return normalized;
}

function normalizeCalendarHolidayIcon(entry) {
  const name = sanitizeString(entry?.name);
  const url = sanitizeString(entry?.url || entry?.image || entry?.imageUrl);
  const storagePath = sanitizeString(entry?.storagePath);

  if (!name || !url) {
    return null;
  }

  const normalized = {
    key: entry?.key ? String(entry.key) : generateKey('calendarHolidayIcon'),
    name,
    url,
  };

  if (storagePath) {
    normalized.storagePath = storagePath;
  }

  return normalized;
}

function normalizeCalendarHoliday(entry) {
  const name = sanitizeString(entry?.name);
  const dateIso = ensureISODate(entry?.date || entry?.dateIso);
  const iconKey = sanitizeString(entry?.iconKey);

  if (!name || !dateIso) {
    return null;
  }

  const normalized = {
    key: entry?.key ? String(entry.key) : generateKey('calendarHoliday'),
    name,
    date: dateIso,
  };

  if (iconKey) {
    normalized.iconKey = iconKey;
  }

  return normalized;
}

function cloneState(state) {
  return {
    idRooms: [...state.idRooms],
    parties: [...state.parties],
    checklists: [...state.checklists],
    calendarIcons: [...state.calendarIcons],
    calendarHolidayIcons: [...state.calendarHolidayIcons],
    calendarHolidays: [...state.calendarHolidays],
    language: state.language,
  };
}

function normalizeLanguage(value) {
  const normalized = sanitizeString(value).toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(normalized)) {
    return normalized;
  }
  return DEFAULT_LANGUAGE;
}

function normalizeRemoteSettings(data = {}) {
  const idRooms = Array.isArray(data.idRooms)
    ? data.idRooms.map((item) => normalizeIdRoom(item)).filter((item) => item !== null)
    : [];
  const parties = Array.isArray(data.parties)
    ? data.parties.map((item) => normalizeParty(item)).filter((item) => item !== null)
    : [];
  const checklists = Array.isArray(data.checklists)
    ? data.checklists.map((item) => normalizeChecklist(item)).filter((item) => item !== null)
    : [];
  const calendarIcons = Array.isArray(data.calendarIcons)
    ? data.calendarIcons
        .map((item) => normalizeCalendarIcon(item))
        .filter((item) => item !== null)
    : [];
  const calendarHolidayIcons = Array.isArray(data.calendarHolidayIcons)
    ? data.calendarHolidayIcons
        .map((item) => normalizeCalendarHolidayIcon(item))
        .filter((item) => item !== null)
    : [];
  const calendarHolidays = Array.isArray(data.calendarHolidays)
    ? data.calendarHolidays
        .map((item) => normalizeCalendarHoliday(item))
        .filter((item) => item !== null)
    : [];
  return { idRooms, parties, checklists, calendarIcons, calendarHolidayIcons, calendarHolidays };
}

export function SettingsProvider({ children }) {
  const [state, setState] = useState(() => cloneState(initialState));
  const [isReady, setIsReady] = useState(false);
  const [isLanguageReady, setIsLanguageReady] = useState(false);
  const isHydratedRef = useRef(false);
  const latestStateRef = useRef(cloneState(initialState));
  const hasCreatedDefaultsRef = useRef(false);
  const { isEditor } = useAccessControl();

  const documentRef = useMemo(
    () => doc(db, SETTINGS_COLLECTION, SETTINGS_DOCUMENT_ID),
    []
  );

  const persistSettings = useCallback(
    async (nextState) => {
      try {
        await setDoc(documentRef, {
          idRooms: nextState.idRooms,
          parties: nextState.parties,
          checklists: nextState.checklists,
          calendarIcons: nextState.calendarIcons,
          calendarHolidayIcons: nextState.calendarHolidayIcons,
          calendarHolidays: nextState.calendarHolidays,
        });
      } catch (error) {
        console.error('Error al guardar los ajustes en Firestore:', error);
        throw error;
      }
    },
    [documentRef]
  );

  useEffect(() => {
    let isActive = true;

    const loadLanguagePreference = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (!isActive) {
          return;
        }

        const normalized = normalizeLanguage(storedLanguage);
        latestStateRef.current = {
          ...latestStateRef.current,
          language: normalized,
        };

        setState((prev) =>
          prev.language === normalized ? prev : { ...prev, language: normalized }
        );
      } catch (error) {
        console.error(
          'Error al cargar el idioma desde el almacenamiento local:',
          error
        );
      } finally {
        if (isActive) {
          setIsLanguageReady(true);
        }
      }
    };

    loadLanguagePreference();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      documentRef,
      (snapshot) => {
        const preservedLanguage = latestStateRef.current.language ?? DEFAULT_LANGUAGE;

        if (snapshot.exists()) {
          const normalized = normalizeRemoteSettings(snapshot.data());
          latestStateRef.current = {
            idRooms: normalized.idRooms,
            parties: normalized.parties,
            checklists: normalized.checklists,
            calendarIcons: normalized.calendarIcons,
            calendarHolidayIcons: normalized.calendarHolidayIcons,
            calendarHolidays: normalized.calendarHolidays,
            language: preservedLanguage,
          };
        } else {
          const defaults = cloneState(initialState);
          latestStateRef.current = {
            idRooms: defaults.idRooms,
            parties: defaults.parties,
            checklists: defaults.checklists,
            calendarIcons: defaults.calendarIcons,
            calendarHolidayIcons: defaults.calendarHolidayIcons,
            calendarHolidays: defaults.calendarHolidays,
            language: preservedLanguage,
          };

          if (!hasCreatedDefaultsRef.current && isEditor) {
            hasCreatedDefaultsRef.current = true;
            persistSettings(latestStateRef.current).catch((error) => {
              console.error('No se pudieron crear los ajustes iniciales en Firestore:', error);
            });
          }
        }

        setState((prev) => ({
          idRooms: latestStateRef.current.idRooms,
          parties: latestStateRef.current.parties,
          checklists: latestStateRef.current.checklists,
          calendarIcons: latestStateRef.current.calendarIcons,
          calendarHolidayIcons: latestStateRef.current.calendarHolidayIcons,
          calendarHolidays: latestStateRef.current.calendarHolidays,
          language: prev.language ?? preservedLanguage,
        }));

        isHydratedRef.current = true;
        setIsReady(true);
      },
      (error) => {
        console.error('Error al sincronizar los ajustes desde Firestore:', error);
      }
    );

    return unsubscribe;
  }, [documentRef, persistSettings, isEditor]);

  const addIdRoom = useCallback(
    async (data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeIdRoom(data);
      if (!normalized) {
        return null;
      }

      if (!isHydratedRef.current) {
        console.warn('Intento de crear un ID/Room antes de completar la sincronización inicial.');
      }

      const nextState = {
        ...cloneState(latestStateRef.current),
        idRooms: [...latestStateRef.current.idRooms, normalized],
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al guardar un ID/Room en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const updateIdRoom = useCallback(
    async (key, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeIdRoom({ ...data, key });
      if (!normalized) {
        return null;
      }

      const nextIdRooms = latestStateRef.current.idRooms.map((entry) =>
        entry.key === key ? normalized : entry
      );

      const nextState = {
        ...cloneState(latestStateRef.current),
        idRooms: nextIdRooms,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al actualizar un ID/Room en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const deleteIdRoom = useCallback(
    async (key) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const nextIdRooms = latestStateRef.current.idRooms.filter((entry) => entry.key !== key);
      const nextState = {
        ...cloneState(latestStateRef.current),
        idRooms: nextIdRooms,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
      } catch (error) {
        console.error('Error al eliminar un ID/Room en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const addParty = useCallback(
    async (data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeParty(data);
      if (!normalized) {
        return null;
      }

      const nextState = {
        ...cloneState(latestStateRef.current),
        parties: [...latestStateRef.current.parties, normalized],
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al guardar una fiesta en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const updateParty = useCallback(
    async (key, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeParty({ ...data, key });
      if (!normalized) {
        return null;
      }

      const nextParties = latestStateRef.current.parties.map((entry) =>
        entry.key === key ? normalized : entry
      );

      const nextState = {
        ...cloneState(latestStateRef.current),
        parties: nextParties,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al actualizar una fiesta en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const deleteParty = useCallback(
    async (key) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const nextParties = latestStateRef.current.parties.filter((entry) => entry.key !== key);
      const nextState = {
        ...cloneState(latestStateRef.current),
        parties: nextParties,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
      } catch (error) {
        console.error('Error al eliminar una fiesta en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const addChecklist = useCallback(
    async (data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeChecklist(data);
      if (!normalized) {
        return null;
      }

      const nextState = {
        ...cloneState(latestStateRef.current),
        checklists: [...latestStateRef.current.checklists, normalized],
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al guardar un elemento del checklist en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const updateChecklist = useCallback(
    async (key, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeChecklist({ ...data, key });
      if (!normalized) {
        return null;
      }

      const nextChecklists = latestStateRef.current.checklists.map((entry) =>
        entry.key === key ? normalized : entry
      );

      const nextState = {
        ...cloneState(latestStateRef.current),
        checklists: nextChecklists,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al actualizar un elemento del checklist en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const deleteChecklist = useCallback(
    async (key) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const nextChecklists = latestStateRef.current.checklists.filter((entry) => entry.key !== key);
      const nextState = {
        ...cloneState(latestStateRef.current),
        checklists: nextChecklists,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
      } catch (error) {
        console.error('Error al eliminar un elemento del checklist en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const addCalendarIcon = useCallback(
    async (data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeCalendarIcon(data);
      if (!normalized) {
        return null;
      }

      if (!isHydratedRef.current) {
        console.warn('Intento de crear un icono de calendario antes de completar la sincronización inicial.');
      }

      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarIcons: [...latestStateRef.current.calendarIcons, normalized],
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al guardar un icono del calendario en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const updateCalendarIcon = useCallback(
    async (key, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeCalendarIcon({ ...data, key });
      if (!normalized) {
        return null;
      }

      const nextIcons = latestStateRef.current.calendarIcons.map((entry) =>
        entry.key === key ? normalized : entry
      );

      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarIcons: nextIcons,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al actualizar un icono del calendario en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const deleteCalendarIcon = useCallback(
    async (key) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const nextIcons = latestStateRef.current.calendarIcons.filter((entry) => entry.key !== key);
      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarIcons: nextIcons,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
      } catch (error) {
        console.error('Error al eliminar un icono del calendario en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const addCalendarHolidayIcon = useCallback(
    async (data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeCalendarHolidayIcon(data);
      if (!normalized) {
        return null;
      }

      if (!isHydratedRef.current) {
        console.warn(
          'Intento de crear un icono de día festivo antes de completar la sincronización inicial.'
        );
      }

      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarHolidayIcons: [...latestStateRef.current.calendarHolidayIcons, normalized],
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al guardar un icono de día festivo en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const updateCalendarHolidayIcon = useCallback(
    async (key, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeCalendarHolidayIcon({ ...data, key });
      if (!normalized) {
        return null;
      }

      const nextIcons = latestStateRef.current.calendarHolidayIcons.map((entry) =>
        entry.key === key ? normalized : entry
      );

      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarHolidayIcons: nextIcons,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al actualizar un icono de día festivo en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const deleteCalendarHolidayIcon = useCallback(
    async (key) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const nextIcons = latestStateRef.current.calendarHolidayIcons.filter(
        (entry) => entry.key !== key
      );
      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarHolidayIcons: nextIcons,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
      } catch (error) {
        console.error('Error al eliminar un icono de día festivo en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const addCalendarHoliday = useCallback(
    async (data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeCalendarHoliday(data);
      if (!normalized) {
        return null;
      }

      if (!isHydratedRef.current) {
        console.warn('Intento de crear un día festivo antes de completar la sincronización inicial.');
      }

      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarHolidays: [...latestStateRef.current.calendarHolidays, normalized],
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al guardar un día festivo en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const updateCalendarHoliday = useCallback(
    async (key, data) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const normalized = normalizeCalendarHoliday({ ...data, key });
      if (!normalized) {
        return null;
      }

      const nextHolidays = latestStateRef.current.calendarHolidays.map((entry) =>
        entry.key === key ? normalized : entry
      );

      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarHolidays: nextHolidays,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
        return normalized;
      } catch (error) {
        console.error('Error al actualizar un día festivo en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const deleteCalendarHoliday = useCallback(
    async (key) => {
      if (!isEditor) {
        const error = new Error('Editing permissions are required to modify settings.');
        error.code = 'access-denied';
        throw error;
      }

      const nextHolidays = latestStateRef.current.calendarHolidays.filter((entry) => entry.key !== key);
      const nextState = {
        ...cloneState(latestStateRef.current),
        calendarHolidays: nextHolidays,
      };

      try {
        await persistSettings(nextState);
        latestStateRef.current = nextState;
        setState(nextState);
      } catch (error) {
        console.error('Error al eliminar un día festivo en Firestore:', error);
        throw error;
      }
    },
    [persistSettings, isEditor]
  );

  const setLanguage = useCallback(async (nextLanguage) => {
    const normalized = normalizeLanguage(nextLanguage);
    const currentLanguage = latestStateRef.current.language;

    if (currentLanguage === normalized) {
      setState((prev) =>
        prev.language === normalized ? prev : { ...prev, language: normalized }
      );
      return normalized;
    }

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    } catch (error) {
      console.error('Error al guardar el idioma en el almacenamiento local:', error);
      throw error;
    }

    latestStateRef.current = {
      ...latestStateRef.current,
      language: normalized,
    };

    setState((prev) => (prev.language === normalized ? prev : { ...prev, language: normalized }));

    return normalized;
  }, []);

  const value = useMemo(
    () => ({
      idRooms: state.idRooms,
      parties: state.parties,
      checklists: state.checklists,
      calendarIcons: state.calendarIcons,
      calendarHolidayIcons: state.calendarHolidayIcons,
      calendarHolidays: state.calendarHolidays,
      language: state.language,
      addIdRoom,
      updateIdRoom,
      deleteIdRoom,
      addParty,
      updateParty,
      deleteParty,
      addChecklist,
      updateChecklist,
      deleteChecklist,
      addCalendarIcon,
      updateCalendarIcon,
      deleteCalendarIcon,
      addCalendarHolidayIcon,
      updateCalendarHolidayIcon,
      deleteCalendarHolidayIcon,
      addCalendarHoliday,
      updateCalendarHoliday,
      deleteCalendarHoliday,
      setLanguage,
      isReady: isReady && isLanguageReady,
    }),
    [
      state.idRooms,
      state.parties,
      state.checklists,
      state.calendarIcons,
      state.calendarHolidayIcons,
      state.calendarHolidays,
      state.language,
      addIdRoom,
      updateIdRoom,
      deleteIdRoom,
      addParty,
      updateParty,
      deleteParty,
      addChecklist,
      updateChecklist,
      deleteChecklist,
      addCalendarIcon,
      updateCalendarIcon,
      deleteCalendarIcon,
      addCalendarHolidayIcon,
      updateCalendarHolidayIcon,
      deleteCalendarHolidayIcon,
      addCalendarHoliday,
      updateCalendarHoliday,
      deleteCalendarHoliday,
      setLanguage,
      isReady,
      isLanguageReady,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
