import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

export default function AIAnswerSheet({
  visible,
  answer,
  loading,
  onDismiss,
  onSearchWeb,
}) {
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
    >
      <View style={styles.glowTop} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.aiIcon}>✦</Text>
          <Text style={styles.headerText}>AI ANSWER</Text>
        </View>
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.answerContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#00f5ff" size="small" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        ) : (
          <Text style={styles.answerText}>{answer}</Text>
        )}
      </ScrollView>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.searchWebBtn}
          onPress={onSearchWeb}
        >
          <Text style={styles.searchWebText}>🔍 Search Web</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={onDismiss}
        >
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 12,
    right: 12,
    backgroundColor: '#0a0a1a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00f5ff33',
    overflow: 'hidden',
    zIndex: 99,
    maxHeight: 250,
  },
  glowTop: {
    height: 1,
    backgroundColor: '#00f5ff',
    shadowColor: '#00f5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#1a1a3a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIcon: {
    color: '#00f5ff',
    fontSize: 14,
  },
  headerText: {
    color: '#00f5ff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
  closeBtn: {
    color: '#444',
    fontSize: 14,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    color: '#00f5ff88',
    fontSize: 13,
    letterSpacing: 1,
  },
  answerText: {
    color: '#e0e0ff',
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderColor: '#1a1a3a',
  },
  searchWebBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00f5ff',
    alignItems: 'center',
  },
  searchWebText: {
    color: '#00f5ff',
    fontSize: 12,
    fontWeight: '600',
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#00f5ff',
    alignItems: 'center',
  },
  dismissText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
});