import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function BrowserView({
  tabs,
  activeTabId,
  onNavigationChange,
  webviewRefs,
}) {
  const [loadingTabs, setLoadingTabs] = useState({});

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
            <View style={styles.loadingBar}>
              <ActivityIndicator color="#00f5ff" size="small" />
            </View>
          )}
          <WebView
            ref={(ref) => { webviewRefs.current[tab.id] = ref; }}
            source={{ uri: tab.url }}
            style={styles.webview}
            onNavigationStateChange={(navState) => {
              if (tab.id === activeTabId) {
                onNavigationChange(navState);
              }
            }}
            onLoadStart={() => setLoadingTabs(prev => ({ ...prev, [tab.id]: true }))}
            onLoadEnd={() => setLoadingTabs(prev => ({ ...prev, [tab.id]: false }))}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
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
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    paddingTop: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
});