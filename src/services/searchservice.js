import config from '../constants/config';

let currentKeyIndex = 0;

const getNextKey = () => {
  const key = config.GOOGLE_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % config.GOOGLE_API_KEYS.length;
  return key;
};

export const searchGoogle = async (query) => {
  try {
    const apiKey = getNextKey();
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${config.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=10`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      currentKeyIndex = (currentKeyIndex + 1) % config.GOOGLE_API_KEYS.length;
      return searchGoogle(query);
    }

    if (!data.items) return [];

    return data.items.map((item) => ({
      title: item.title,
      url: item.link,
      description: item.snippet,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}&sz=32`,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};