import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  Image,
} from 'react-native';
import { getDomainName } from '../utils/urlHelper';

export default function TabSwitcher({
  tabs,
  activeTabId,
  onSwitch,
  onClose,
  onNew,
  onDismiss,
}) {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onDismiss}
        activeOpacity={1}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>TABS</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.closeHeader}>✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tabs}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabCard,
                item.id === activeTabId && styles.activeTabCard,
              ]}
              onPress={() => onSwitch(item.id)}
            >
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => onClose(item.id)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              {item.favicon ? (
                <Image
                  source={{ uri: item.favicon }}
                  style={styles.favicon}
                />
              ) : (
                <Text style={styles.faviconPlaceholder}>🌐</Text>
              )}

              <Text style={styles.tabTitle} numberOfLines={1}>
                {getDomainName(item.url)}
              </Text>

              {item.id === activeTabId && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          )}
          ListFooterComponent={
            tabs.length < 5 ? (
              <TouchableOpacity
                style={styles.newTabCard}
                onPress={onNew}
              >
                <Text style={styles.newTabPlus}>+</Text>
                <Text style={styles.newTabLabel}>New Tab</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000cc',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#00f5ff33',
    paddingBottom: 30,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1a1a3a',
  },
  headerText: {
    color: '#00f5ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  closeHeader: {
    color: '#666',
    fontSize: 16,
  },
  grid: {
    padding: 12,
  },
  tabCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#111122',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a3a',
    minHeight: 100,
  },
  activeTabCard: {
    borderColor: '#00f5ff',
    backgroundColor: '#00f5ff0a',
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#444',
    fontSize: 11,
  },
  favicon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginBottom: 8,
  },
  faviconPlaceholder: {
    fontSize: 24,
    marginBottom: 8,
  },
  tabTitle: {
    color: '#aaa',
    fontSize: 11,
    textAlign: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00f5ff',
    marginTop: 6,
  },
  newTabCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#00f5ff0a',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00f5ff33',
    borderStyle: 'dashed',
    minHeight: 100,
  },
  newTabPlus: {
    color: '#00f5ff',
    fontSize: 28,
    fontWeight: '200',
  },
  newTabLabel: {
    color: '#00f5ff88',
    fontSize: 11,
    marginTop: 4,
  },
});