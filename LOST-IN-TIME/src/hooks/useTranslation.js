import { useCallback, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { DICTIONARY, AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/dictionary';

function getNestedValue(source, path) {
  if (!source || !path) {
    return undefined;
  }

  return path.split('.').reduce((accumulator, segment) => {
    if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, segment)) {
      return accumulator[segment];
    }
    return undefined;
  }, source);
}

function formatMessage(template, variables = {}) {
  if (typeof template !== 'string') {
    return template;
  }

  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    if (!Object.prototype.hasOwnProperty.call(variables, key)) {
      return match;
    }
    const value = variables[key];
    return value === null || value === undefined ? '' : String(value);
  });
}

export function useTranslation() {
  const { language: contextLanguage } = useSettings();

  const resolvedLanguage = useMemo(() => {
    if (contextLanguage && DICTIONARY[contextLanguage]) {
      return contextLanguage;
    }
    return DEFAULT_LANGUAGE;
  }, [contextLanguage]);

  const translate = useCallback(
    (key, variables = undefined, fallback = undefined) => {
      if (!key) {
        return '';
      }

      const dictionary = DICTIONARY[resolvedLanguage] ?? DICTIONARY[DEFAULT_LANGUAGE] ?? {};
      const fallbackDictionary = DICTIONARY[DEFAULT_LANGUAGE] ?? {};

      const template =
        getNestedValue(dictionary, key) ??
        (typeof fallback === 'string' ? fallback : getNestedValue(fallbackDictionary, key));

      if (template === undefined || template === null) {
        return typeof fallback === 'string' ? fallback : key;
      }

      if (typeof template !== 'string') {
        return template;
      }

      return formatMessage(template, variables);
    },
    [resolvedLanguage]
  );

  const languageOptions = useMemo(
    () =>
      AVAILABLE_LANGUAGES.map((option) => ({
        key: option.key,
        label: translate(option.labelKey),
      })),
    [translate]
  );

  return {
    t: translate,
    language: resolvedLanguage,
    languageOptions,
  };
}
