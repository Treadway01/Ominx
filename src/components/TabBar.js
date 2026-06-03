import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

export default function TabBar({
  onBack,
  onForward,
  onHome,
  onRefresh,
  onTabsPress,
  onNewTab,
  tabCount,
  canGoBack,
  canGoForward,
}) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity
        style={[styles.button, !canGoBack && styles.disabled]}
        onPress={onBack}
        disabled={!canGoBack}
      >
        <Text style={[styles.icon, !canGoBack && styles.disabledIcon]}>◀</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !canGoForward && styles.disabled]}
        onPress={onForward}
        disabled={!canGoForward}
      >
        <Text style={[styles.icon, !canGoForward && styles.disabledIcon]}>▶</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onHome}>
        <Text style={styles.icon}>⌂</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onRefresh}>
        <Text style={styles.icon}>↻</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={onTabsPress}>
        <View style={styles.tabCountBox}>
          <Text style={styles.tabCountText}>{tabCount}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.newTabButton} onPress={onNewTab}>
        <Text style={styles.newTabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: '#000000',
  minHeight: 60,
},
  button: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#0a0a1a',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  icon: {
    color: '#00f5ff',
    fontSize: 16,
  },
  disabled: {
    borderColor: '#0a0a0a',
    backgroundColor: '#050508',
  },
  disabledIcon: {
    color: '#1a1a2a',
  },
  tabButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#0a0a1a',
    borderWidth: 1,
    borderColor: '#00f5ff44',
  },
  tabCountBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#00f5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountText: {
    color: '#00f5ff',
    fontSize: 11,
    fontWeight: '700',
  },
  newTabButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#00f5ff15',
    borderWidth: 1,
    borderColor: '#00f5ff',
  },
  newTabText: {
    color: '#00f5ff',
    fontSize: 22,
    fontWeight: '300',
  },
});