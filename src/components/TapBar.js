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
    <View style={styles.container}>
      <View style={styles.glowLine} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  glowLine: {
    height: 1,
    backgroundColor: '#00f5ff33',
    shadowColor: '#00f5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#0a0a1a',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  icon: {
    color: '#00f5ff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    borderColor: '#111',
    backgroundColor: '#050510',
  },
  disabledIcon: {
    color: '#222',
  },
  tabButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#00f5ff15',
    borderWidth: 1,
    borderColor: '#00f5ff',
  },
  newTabText: {
    color: '#00f5ff',
    fontSize: 20,
    fontWeight: '300',
  },
});