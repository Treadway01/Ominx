import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

export default function SearchResults({ results, loading, onResultPress }) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00f5ff" size="large" />
        <Text style={styles.loadingText}>Searching...</Text>
      </View>
    );
  }

  if (!results || results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No results found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => index.toString()}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.resultCard}
          onPress={() => onResultPress(item.url)}
          activeOpacity={0.7}
        >
          <View style={styles.resultHeader}>
            {item.favicon ? (
              <Image
                source={{ uri: item.favicon }}
                style={styles.favicon}
              />
            ) : (
              <Text style={styles.faviconPlaceholder}>🌐</Text>
            )}
            <Text style={styles.resultURL} numberOfLines={1}>
              {item.url.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 12,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    gap: 12,
  },
  loadingText: {
    color: '#00f5ff88',
    fontSize: 13,
    letterSpacing: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  emptyText: {
    color: '#333',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#0a0a1a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  favicon: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  faviconPlaceholder: {
    fontSize: 14,
  },
  resultURL: {
    color: '#00f5ff88',
    fontSize: 11,
    flex: 1,
  },
  resultTitle: {
    color: '#e0e0ff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  resultDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 18,
  },
  separator: {
    height: 8,
  },
});