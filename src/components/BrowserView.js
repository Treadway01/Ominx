import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function BrowserView({
  tabs,
  activeTabId,
  onNavigationChange,
  webviewRefs,
}) {
  const [loadingTabs, setLoadingTabs] = useState({});
  const [progressTabs, setProgressTabs] = useState({});

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <View
          key={tab.id}
          style={[
            styles.webviewContainer,
            { display: tab.id === activeTabId ? 'flex' : 'none' },
          ]}
        >
          {loadingTabs[tab.id] && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(progressTabs[tab.id] || 0.1) * 100}%` },
                ]}
              />
            </View>
          )}

          <WebView
            ref={(ref) => {
              webviewRefs.current[tab.id] = ref;
            }}
            source={{ uri: tab.url }}
            style={styles.webview}
            onNavigationStateChange={(navState) => {
              if (tab.id === activeTabId) {
                onNavigationChange(navState);
              }
            }}
            onLoadStart={() =>
              setLoadingTabs((prev) => ({ ...prev, [tab.id]: true }))
            }
            onLoadProgress={({ nativeEvent }) =>
              setProgressTabs((prev) => ({
                ...prev,
                [tab.id]: nativeEvent.progress,
              }))
            }
            onLoadEnd={() =>
              setLoadingTabs((prev) => ({ ...prev, [tab.id]: false }))
            }
            javaScriptEnabled={true}
            domStorageEnabled={true}
            setSupportMultipleWindows={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
            onShouldStartLoadWithRequest={(request) => {
              return true;
            }}
            renderError={(errorName) => (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorTitle}>Page Failed to Load</Text>
                <Text style={styles.errorDesc}>{errorName}</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => webviewRefs.current[tab.id]?.reload()}
                >
                  <Text style={styles.retryText}>RETRY</Text>
                </TouchableOpacity>
              </View>
            )}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#00f5ff" size="large" />
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webviewContainer: {
    flex: 1,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: '#1a1a3a',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#00f5ff',
    shadowColor: '#00f5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: '#e0e0ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorDesc: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: '#00f5ff',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    color: '#00f5ff',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});