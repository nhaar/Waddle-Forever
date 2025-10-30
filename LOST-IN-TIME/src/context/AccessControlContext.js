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
import * as Crypto from 'expo-crypto';
import { db } from '../services/firebase';

const AccessControlContext = createContext();

const STORAGE_ROLE_KEY = 'accessControl.role';
const STORAGE_HASH_KEY = 'accessControl.hash';
const COLLECTION = 'accessControl';
const DOCUMENT_ID = 'global';

const defaultValue = {
  role: 'viewer',
  isEditor: false,
  isReady: false,
  entries: [],
  unlockWithCode: async () => ({ success: false, error: 'uninitialized' }),
  lock: async () => {},
  createAccessEntry: async () => ({ success: false, error: 'uninitialized' }),
  removeAccessEntry: async () => ({ success: false, error: 'uninitialized' }),
};

const createPermissionError = () => {
  const error = new Error('Modifying access entries requires editor permissions.');
  error.code = 'access-denied';
  return error;
};

function sanitizeLabel(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || '';
  }
  return '';
}

function normalizeEntries(data) {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const entries = Array.isArray(data.entries) ? data.entries : [];

  return entries
    .map((entry) => {
      const id = typeof entry?.id === 'string' && entry.id.trim() ? entry.id.trim() : null;
      const label = sanitizeLabel(entry?.label);
      const hash = typeof entry?.hash === 'string' && entry.hash.length > 0 ? entry.hash : null;
      const createdAt = Number.isFinite(entry?.createdAt)
        ? Number(entry.createdAt)
        : Date.now();

      if (!id || !hash) {
        return null;
      }

      return { id, label, hash, createdAt };
    })
    .filter((entry) => entry !== null);
}

function generateEntryId() {
  return `access-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function hashAccessCode(code) {
  const normalized = typeof code === 'string' ? code.trim() : '';
  if (!normalized) {
    return null;
  }

  try {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      normalized
    );
    return digest;
  } catch (error) {
    console.error('Error hashing access code:', error);
    throw error;
  }
}

async function persistRole(role, hash) {
  try {
    if (role === 'editor' && hash) {
      await AsyncStorage.multiSet([
        [STORAGE_ROLE_KEY, 'editor'],
        [STORAGE_HASH_KEY, hash],
      ]);
    } else {
      await AsyncStorage.multiRemove([STORAGE_ROLE_KEY, STORAGE_HASH_KEY]);
    }
  } catch (error) {
    console.error('Error persisting access role in storage:', error);
  }
}

export function AccessControlProvider({ children }) {
  const [role, setRole] = useState('viewer');
  const [entries, setEntries] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isRemoteReady, setIsRemoteReady] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const storedHashRef = useRef(null);
  const storedRoleRef = useRef('viewer');
  const docRef = useMemo(() => doc(db, COLLECTION, DOCUMENT_ID), []);

  useEffect(() => {
    let isActive = true;

    const loadStoredRole = async () => {
      try {
        const [[, storedRole], [, storedHash]] = await AsyncStorage.multiGet([
          STORAGE_ROLE_KEY,
          STORAGE_HASH_KEY,
        ]);

        if (!isActive) {
          return;
        }

        storedRoleRef.current = storedRole === 'editor' ? 'editor' : 'viewer';
        storedHashRef.current = storedHash || null;
      } catch (error) {
        console.error('Error reading access role from storage:', error);
      } finally {
        if (isActive) {
          setIsStorageReady(true);
        }
      }
    };

    loadStoredRole();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const normalized = normalizeEntries(snapshot.data());
          setEntries(normalized);
        } else {
          setEntries([]);
        }
        setIsRemoteReady(true);
      },
      (error) => {
        console.error('Error syncing access control document from Firestore:', error);
        setEntries([]);
        setIsRemoteReady(true);
      }
    );

    return unsubscribe;
  }, [docRef]);

  useEffect(() => {
    if (!isRemoteReady || !isStorageReady) {
      return;
    }

    const storedRole = storedRoleRef.current;
    const storedHash = storedHashRef.current;

    if (storedRole === 'editor' && storedHash) {
      const match = entries.some((entry) => entry.hash === storedHash);
      if (match) {
        setRole('editor');
        setIsReady(true);
        return;
      }

      storedRoleRef.current = 'viewer';
      storedHashRef.current = null;
      persistRole('viewer');
    }

    setRole('viewer');
    setIsReady(true);
  }, [entries, isRemoteReady, isStorageReady]);

  const unlockWithCode = useCallback(
    async (code) => {
      const hash = await hashAccessCode(code);
      if (!hash) {
        return { success: false, error: 'missing-code' };
      }

      const match = entries.find((entry) => entry.hash === hash);
      if (!match) {
        return { success: false, error: 'invalid-code' };
      }

      storedRoleRef.current = 'editor';
      storedHashRef.current = hash;
      setRole('editor');
      await persistRole('editor', hash);
      return { success: true };
    },
    [entries]
  );

  const lock = useCallback(async () => {
    storedRoleRef.current = 'viewer';
    storedHashRef.current = null;
    setRole('viewer');
    await persistRole('viewer');
  }, []);

  const createAccessEntry = useCallback(
    async ({ label, code }) => {
      const isBootstrap = entries.length === 0;
      if (!isBootstrap && role !== 'editor') {
        throw createPermissionError();
      }

      const sanitizedLabel = sanitizeLabel(label) || 'Access entry';
      const hash = await hashAccessCode(code);
      if (!hash) {
        return { success: false, error: 'missing-code' };
      }

      const alreadyExists = entries.some((entry) => entry.hash === hash);
      if (alreadyExists) {
        return { success: false, error: 'duplicated-code' };
      }

      const nextEntries = [
        ...entries,
        { id: generateEntryId(), label: sanitizedLabel, hash, createdAt: Date.now() },
      ];

      try {
        await setDoc(
          docRef,
          {
            entries: nextEntries,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
        return { success: true };
      } catch (error) {
        console.error('Error creating a new access entry in Firestore:', error);
        return { success: false, error: 'unknown' };
      }
    },
    [docRef, entries, role]
  );

  const removeAccessEntry = useCallback(
    async (entryId) => {
      if (role !== 'editor') {
        throw createPermissionError();
      }

      const nextEntries = entries.filter((entry) => entry.id !== entryId);

      try {
        await setDoc(
          docRef,
          {
            entries: nextEntries,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
        return { success: true };
      } catch (error) {
        console.error('Error removing an access entry from Firestore:', error);
        return { success: false, error: 'unknown' };
      }
    },
    [docRef, entries, role]
  );

  const publicEntries = useMemo(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        label: entry.label,
        createdAt: entry.createdAt,
      })),
    [entries]
  );

  const value = useMemo(
    () => ({
      role,
      isEditor: role === 'editor',
      isReady,
      entries: publicEntries,
      unlockWithCode,
      lock,
      createAccessEntry,
      removeAccessEntry,
    }),
    [role, isReady, publicEntries, unlockWithCode, lock, createAccessEntry, removeAccessEntry]
  );

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
}

export function useAccessControlContext() {
  const context = useContext(AccessControlContext);
  if (!context) {
    return defaultValue;
  }
  return context;
}
