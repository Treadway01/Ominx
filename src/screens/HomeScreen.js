import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
  const [tabs, setTabs] = useState([
    { id: '1', url: 'https://www.google.com', title: 'New Tab', favicon: null, canGoBack: false, canGoForward: false }
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
  const [isBrowsing, setIsBrowsing] = useState(false);

  const webviewRefs = useRef({});

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleOmniboxSubmit = async (text) => {
    if (!text.trim()) return;
    setOmniboxText(text);

    if (isURL(text)) {
      const url = formatURL(text);
      updateTabURL(activeTabId, url);
      setIsBrowsing(true);
      setIsSearchResultsVisible(false);
    } else {
      setIsBrowsing(false);
      setIsSearchResultsVisible(true);
      setSearchLoading(true);
      setAiLoading(true);
      setIsAISheetVisible(true);

      const [results, aiResponse] = await Promise.all([
        searchGoogle(text),
        askGemini(text),
      ]);

      setSearchResults(results);
      setSearchLoading(false);
      setAiAnswer(aiResponse.answer);
      setAiLoading(false);
    }
  };

  const updateTabURL = (tabId, url) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, url } : tab
    ));
  };

  const handleNavigationChange = (navState) => {
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId ? {
        ...tab,
        url: navState.url,
        title: navState.title || 'Loading...',
        canGoBack: navState.canGoBack,
        canGoForward: navState.canGoForward,
      } : tab
    ));
    setOmniboxText(navState.url);
  };

  const handleTabCreate = () => {
    if (tabs.length >= 5) return;
    const newTab = {
      id: Date.now().toString(),
      url: 'https://www.google.com',
      title: 'New Tab',
      favicon: null,
      canGoBack: false,
      canGoForward: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
  };

  const handleTabClose = (id) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleTabSwitch = (id) => {
    setActiveTabId(id);
    setIsTabSwitcherVisible(false);
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
  };

  const handleBack = () => {
    webviewRefs.current[activeTabId]?.goBack();
  };

  const handleForward = () => {
    webviewRefs.current[activeTabId]?.goForward();
  };

  const handleRefresh = () => {
    webviewRefs.current[activeTabId]?.reload();
  };

  const handleHome = () => {
    updateTabURL(activeTabId, 'https://www.google.com');
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
  };

  const handleResultPress = (url) => {
    updateTabURL(activeTabId, url);
    setIsBrowsing(true);
    setIsSearchResultsVisible(false);
    setIsAISheetVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Omnibox
          value={omniboxText}
          onChangeText={setOmniboxText}
          onSubmit={handleOmniboxSubmit}
          currentURL={activeTab?.url || ''}
        />

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

        {isAISheetVisible && (
          <AIAnswerSheet
            visible={isAISheetVisible}
            answer={aiAnswer}
            loading={aiLoading}
            onDismiss={() => setIsAISheetVisible(false)}
            onSearchWeb={() => {
              setIsAISheetVisible(false);
              updateTabURL(activeTabId, `https://www.google.com/search?q=${encodeURIComponent(omniboxText)}`);
              setIsBrowsing(true);
              setIsSearchResultsVisible(false);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});