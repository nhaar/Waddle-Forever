import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

export default function SearchableSelect({
  label,
  value,
  onChangeText,
  placeholder,
  options = [],
  onSelectOption,
  autoCapitalize = 'none',
  keyboardType = 'default',
  emptyMessage,
  editable = true,
}) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [inputLayout, setInputLayout] = useState({ height: 0, y: 0 });
  const selectingOptionRef = useRef(false);
  const blurTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const resolvedEmptyMessage = emptyMessage ?? t('searchableSelect.empty');

  const clearBlurTimeout = useCallback(() => {
    if (blurTimeoutRef.current !== null) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  const filteredOptions = useMemo(() => {
    const term = value?.trim().toLowerCase() ?? '';
    if (!term) {
      return options;
    }

    return options.filter((option) => {
      const primary = option.primary?.toLowerCase() ?? '';
      const secondary = option.secondary?.toLowerCase() ?? '';
      return primary.includes(term) || secondary.includes(term);
    });
  }, [options, value]);

  const handleSelect = useCallback(
    (option) => {
      if (!editable) {
        return;
      }

      selectingOptionRef.current = false;
      clearBlurTimeout();
      onChangeText?.(option.value ?? '');
      onSelectOption?.(option);
      Keyboard.dismiss();
      setIsFocused(false);
    },
    [clearBlurTimeout, editable, onChangeText, onSelectOption]
  );

  const handleOptionPressIn = useCallback(() => {
    if (!editable) {
      return;
    }

    selectingOptionRef.current = true;
  }, [editable]);

  const handleOptionPressOut = useCallback(() => {
    requestAnimationFrame(() => {
      selectingOptionRef.current = false;
    });
  }, []);

  const handleBlur = useCallback(() => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      if (!selectingOptionRef.current) {
        setIsFocused(false);
      }
      blurTimeoutRef.current = null;
    }, 120);
  }, [clearBlurTimeout]);

  const handleFocus = useCallback(() => {
    if (!editable) {
      return;
    }

    clearBlurTimeout();
    setIsFocused(true);
  }, [clearBlurTimeout, editable]);

  useEffect(() => () => clearBlurTimeout(), [clearBlurTimeout]);

  useEffect(() => {
    if (!editable || !isFocused) {
      return undefined;
    }

    const node = inputRef.current;
    if (node?.isFocused?.()) {
      return undefined;
    }

    const timer = setTimeout(() => {
      clearBlurTimeout();
      inputRef.current?.focus?.();
    }, 0);

    return () => clearTimeout(timer);
  }, [clearBlurTimeout, editable, isFocused, value]);

  const shouldShowDropdown = isFocused && editable;

  const handleInputLayout = useCallback((event) => {
    const layout = event?.nativeEvent?.layout;
    if (!layout) {
      return;
    }

    const { height = 0, y = 0 } = layout;
    setInputLayout({ height, y });
  }, []);

  return (
    <View style={[styles.container, shouldShowDropdown && styles.containerActive]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={editable ? onChangeText : undefined}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoCorrect={false}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onLayout={handleInputLayout}
      />
      {shouldShowDropdown && (
        <View
          style={[
            styles.dropdownContainer,
            { top: inputLayout.y + inputLayout.height + 4 },
          ]}
        >
          <View style={styles.dropdown}>
            {filteredOptions.length === 0 ? (
              <Text style={styles.emptyMessage}>{resolvedEmptyMessage}</Text>
            ) : (
              <ScrollView style={styles.optionsList} keyboardShouldPersistTaps="always">
                {filteredOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={styles.option}
                    onPress={() => handleSelect(option)}
                    onPressIn={handleOptionPressIn}
                    onPressOut={handleOptionPressOut}
                  >
                    <Text style={styles.optionPrimary}>{option.primary}</Text>
                    {option.secondary ? (
                      <Text style={styles.optionSecondary}>{option.secondary}</Text>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 12,
  },
  containerActive: {
    zIndex: 30,
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#111827',
  },
  inputDisabled: {
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
  },
  dropdownContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 40,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    maxHeight: 220,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  optionsList: {
    maxHeight: 220,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionPrimary: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  optionSecondary: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  emptyMessage: {
    padding: 12,
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
});
