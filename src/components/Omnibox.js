import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { getDomainName, isURL } from '../utils/urlHelper';

export default function Omnibox({ value, onChangeText, onSubmit, currentURL }) {
  const [isFocused, setIsFocused] = useState(false);

  const displayText = isFocused ? value : (isURL(value) ? getDomainName(value) : value);

  return (
    <View style={styles.container}>
      <View style={styles.omniboxWrapper}>
        <View style={styles.glowBorder}>
          <View style={styles.omnibox}>
            <Text style={styles.icon}>🌐</Text>
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
              placeholderTextColor="#444"
              returnKeyType="go"
              autoCapitalize="none"
              autoCorrect={false}
              selectTextOnFocus={true}
            />
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => onSubmit(value)}
            >
              <Text style={styles.aiButtonText}>✦ AI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#000000',
  },
  omniboxWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  glowBorder: {
    borderRadius: 16,
    padding: 1.5,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#00f5ff33',
  },
  omnibox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a1a',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#e0e0ff',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  aiButton: {
    backgroundColor: '#00f5ff15',
    borderWidth: 1,
    borderColor: '#00f5ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiButtonText: {
    color: '#00f5ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});