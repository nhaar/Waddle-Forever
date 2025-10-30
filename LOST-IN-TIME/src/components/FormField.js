import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  editable = true,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        selectTextOnFocus={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
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
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
});
