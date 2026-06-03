import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Omnibox from '../components/Omnibox';
import BrowserView from '../components/BrowserView';
import TabBar from '../components/TabBar';
import TabSwitcher from '../components/TabSwitcher';
import AIAnswerSheet from '../components/AIAnswerSheet';
import SearchResults from '../components/SearchResults';
import { searchGoogle } from '../services/searchService';
import { askGemini } from '../services/geminiService';
import { isURL, formatURL } from '../utils/urlHelper';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isRequestInFlight = useRef(false);

  const [tabs, setTabs] = useState([
    {
      id: '1',
      url: 'https://www.google.com',
      title: 'New Tab',
      favicon: null,
      canGoBack: false,
      canGoForward: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [omniboxText, setOmniboxText] = useState('');
  const [isTabSwitcherVisible, setIsTabSwitcherVisible] = useState(false);
  const [isAISheetVisible, setIsAISheetVisible] = useState(false);
  const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(true);

  const webviewRefs = useRef({});
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const updateTabURL = useCallback((tabId, url) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, url } : tab))
    );
  }, []);

  const handleOmniboxSubmit = useCallback(async (text) => {
    if (!text.trim()) return;
    if (isRequestInFlight.current) return;

    setOmniboxText(text);

    if (isURL(text)) {
      const url = formatURL(text);
      updateTabURL(activeTabId, url);
      setIsBrowsing(true);
      setIsSearchResultsVisible(false);
      setIsAISheetVisible(false);
      return;
    }

    isRequestInFlight.current = true;
    setIsBrowsing(false);
    setIsSearchResultsVisible(true);
    setSearchLoading(true);
    setAiLoading(true);
    setIsAISheetVisible(true);
    setSearchResults([]);
    setAiAnswer('');

    try {
      const [results, aiResponse] = await Promise.all([
        searchGoogle(text),
        askGemini(text),
      ]);
      setSearchResults(results);
      setAiAnswer(aiResponse.answer);
    } catch (error) {
      setAiAnswer('Something went wrong. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
      setAiLoading(false);
      isRequestInFlight.current = false;
    }
  }, [activeTabId, updateTabURL]);

  const handleNavigationChange = useCallback((navState) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: navState.url,
              title: navState.title || 'Loading...',
              canGoBack: navState.canGoBack,
              canGoForward: navState.canGoForward,
            }
          : tab
      )
    );
    setOmniboxText(navState.url);
  }, [activeTabId]);

  const handleTabCreate = useCallback(() => {
    if (tabs.length >= 5) return;
    const newTab = {
      id: Date.now().toString(),
      url: 'https://www.google.com',
      title: 'New Tab',
      favicon: null,
      canGoBack: false,
      canGoForward: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
    setIsAISheetVisible(false);
  }, [tabs.length]);

  const handleTabClose = useCallback((id) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  }, [tabs, activeTabId]);

  const handleTabSwitch = useCallback((id) => {
    setActiveTabId(id);
    setIsTabSwitcherVisible(false);
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
    setIsAISheetVisible(false);
  }, []);

  const handleBack = useCallback(() => {
    webviewRefs.current[activeTabId]?.goBack();
  }, [activeTabId]);

  const handleForward = useCallback(() => {
    webviewRefs.current[activeTabId]?.goForward();
  }, [activeTabId]);

  const handleRefresh = useCallback(() => {
    webviewRefs.current[activeTabId]?.reload();
  }, [activeTabId]);

  const handleHome = useCallback(() => {
    updateTabURL(activeTabId, 'https://www.google.com');
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
    setIsAISheetVisible(false);
  }, [activeTabId, updateTabURL]);

  const handleResultPress = useCallback((url) => {
    updateTabURL(activeTabId, url);
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
    setIsAISheetVisible(false);
  }, [activeTabId, updateTabURL]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {isBrowsing && (
        <BrowserView
          tabs={tabs}
          activeTabId={activeTabId}
          onNavigationChange={handleNavigationChange}
          webviewRefs={webviewRefs}
        />
      )}

      {isSearchResultsVisible && (
        <SearchResults
          results={searchResults}
          loading={searchLoading}
          onResultPress={handleResultPress}
        />
      )}

      {isAISheetVisible && (
        <AIAnswerSheet
          visible={isAISheetVisible}
          answer={aiAnswer}
          loading={aiLoading}
          onDismiss={() => setIsAISheetVisible(false)}
          onSearchWeb={() => {
            setIsAISheetVisible(false);
            updateTabURL(
              activeTabId,
              `https://www.google.com/search?q=${encodeURIComponent(omniboxText)}`
            );
            setIsBrowsing(true);
            setIsSearchResultsVisible(false);
          }}
        />
      )}

      {isTabSwitcherVisible && (
        <TabSwitcher
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitch={handleTabSwitch}
          onClose={handleTabClose}
          onNew={handleTabCreate}
          onDismiss={() => setIsTabSwitcherVisible(false)}
        />
      )}
<View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Omnibox
          value={omniboxText}
          onChangeText={setOmniboxText}
          onSubmit={handleOmniboxSubmit}
          currentURL={activeTab?.url || ''}
        />
        <TabBar
          onBack={handleBack}
          onForward={handleForward}
          onHome={handleHome}
          onRefresh={handleRefresh}
          onTabsPress={() => setIsTabSwitcherVisible(true)}
          onNewTab={handleTabCreate}
          tabCount={tabs.length}
          canGoBack={activeTab?.canGoBack || false}
          canGoForward={activeTab?.canGoForward || false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bottomBar: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1a1a3a',
  },
});