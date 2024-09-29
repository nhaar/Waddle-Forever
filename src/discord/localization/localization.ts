import { Store } from "../../store";
import { getEnLocalizedString } from "./en";
import { getPtLocalizedString } from "./pt";

export const STRING_KEYS = {
  UNLOGGED_KEY: 'UNLOGGED',
  WADDLING_KEY: 'WADDLING',
  WADDLING_AT_KEY: 'WADDLING_AT',
  TALKING_WITH_KEY: 'TALKING_WITH',
  PLAYING_KEY: 'PLAYING',
  VISITING_IGLOO_KEY: 'VISITING_IGLOO',
};

export const SUPPORTED_LANGS = [
  'en',
  'pt'
];

export const setLanguageInStore = (store: Store, language: string) => {
  if (!SUPPORTED_LANGS.includes(language)) {
    return;
  }

  store.public.set('lastLanguage', language);
};

export const getLanguageInStore = (store: Store) => {
  return store.public.get('lastLanguage');
};

export const getLocalizedUnlogged = (store: Store) => {
  return getLocalizedString(store, STRING_KEYS.UNLOGGED_KEY);
};

export const getLocalizedWaddling = (store: Store) => {
  return getLocalizedString(store, STRING_KEYS.WADDLING_KEY);
};

export const getLocalizedWaddlingAt = (store: Store) => {
  return getLocalizedString(store, STRING_KEYS.WADDLING_AT_KEY);
};

export const getLocalizedTalkingWith = (store: Store) => {
  return getLocalizedString(store, STRING_KEYS.TALKING_WITH_KEY);
};

export const getLocalizedPlaying = (store: Store) => {
  return getLocalizedString(store, STRING_KEYS.PLAYING_KEY);
};

export const getLocalizedVisiting = (store: Store) => {
  return getLocalizedString(store, STRING_KEYS.VISITING_IGLOO_KEY);
};

export const getLocalizedString = (store: Store, stringKey: string) => {
  const lang = getLanguageInStore(store);

  switch (lang) {
    case 'pt':
      return getPtLocalizedString(stringKey);

    case 'en':
    default: 
      return getEnLocalizedString(stringKey);
  }
};

