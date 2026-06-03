import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { getDomainName, isURL } from '../utils/urlHelper';
import FileUploadButton from './FileUploadButton';

export default function Omnibox({
  value,
  onChangeText,
  onSubmit,
  currentURL,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const displayText = isFocused
    ? value
    : isURL(value)
    ? getDomainName(value)
    : value;

  return (
    <View style={styles.container}>
      <View style={styles.omnibox}>
        <View style={styles.inputRow}>
          <Text style={styles.globeIcon}>◎</Text>
          <TextInput
            style={styles.input}
            value={displayText}
            onChangeText={onChangeText}
            onFocus={() => {
              setIsFocused(true);
              onChangeText(value);
            }}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={() => onSubmit(value)}
            placeholder="Search or enter URL..."
            placeholderTextColor="#333355"
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
            selectTextOnFocus={true}
          />
          <FileUploadButton
            onFileContent={(content, name) => {
              onSubmit(
                `Summarize this file called ${name}: ${content.substring(0, 500)}`
              );
            }}
          />
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => onSubmit(value)}
          >
            <Text style={styles.aiButtonText}>✦</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  omnibox: {
    backgroundColor: '#0a0a1a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00f5ff33',
    shadowColor: '#00f5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  globeIcon: {
    color: '#00f5ff66',
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: '#e0e0ff',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  aiButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00f5ff15',
    borderWidth: 1,
    borderColor: '#00f5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiButtonText: {
    color: '#00f5ff',
    fontSize: 14,
  },
});