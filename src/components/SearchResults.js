import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';

const ResultCard = ({ item, onPress, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const domain = (() => {
    try {
      return new URL(item.url).hostname.replace('www.', '');
    } catch {
      return item.url;
    }
  })();

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(item.url)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.faviconContainer}>
            {item.favicon ? (
              <Image source={{ uri: item.favicon }} style={styles.favicon} />
            ) : (
              <Text style={styles.faviconFallback}>◎</Text>
            )}
          </View>
          <View style={styles.urlContainer}>
            <Text style={styles.domain} numberOfLines={1}>{domain}</Text>
            <Text style={styles.url} numberOfLines={1}>
              {item.url.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SearchResults({ results, loading, onResultPress }) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#00f5ff" size="large" />
          <Text style={styles.loadingText}>Searching the web...</Text>
          <Text style={styles.loadingSubtext}>Finding the best results for you</Text>
        </View>
      </View>
    );
  }

  if (!results || results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>◎</Text>
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptyDesc}>Try a different search query</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(_, index) => index.toString()}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <ResultCard
          item={item}
          onPress={onResultPress}
          index={index}
        />
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
    padding: 16,
    paddingBottom: 200,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    padding: 40,
  },
  loadingCard: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#e0e0ff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  loadingSubtext: {
    color: '#444466',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#1a1a3a',
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#444466',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDesc: {
    color: '#333355',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#0a0a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  faviconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#111128',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  favicon: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  faviconFallback: {
    color: '#00f5ff44',
    fontSize: 16,
  },
  urlContainer: {
    flex: 1,
  },
  domain: {
    color: '#00f5ff',
    fontSize: 12,
    fontWeight: '600',
  },
  url: {
    color: '#333355',
    fontSize: 10,
    marginTop: 1,
  },
  arrow: {
    color: '#1a1a3a',
    fontSize: 16,
  },
  title: {
    color: '#e0e0ff',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    color: '#555577',
    fontSize: 12,
    lineHeight: 18,
  },
  separator: {
    height: 10,
  },
});