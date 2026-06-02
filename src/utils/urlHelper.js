export const isValidURL = (text) => {
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  return urlPattern.test(text.trim());
};

export const formatURL = (text) => {
  const trimmed = text.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const buildSearchURL = (query) => {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};

export const getFaviconURL = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
};

export const getDomainName = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

export const isURL = (text) => {
  return text.startsWith('http') || 
    (text.includes('.') && !text.includes(' '));
};