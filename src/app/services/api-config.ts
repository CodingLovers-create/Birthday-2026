const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    // Return empty string to use relative URLs (same-origin with dev server proxy) or dynamic hostname:3001
    return window.location.port === '4201' ? '' : `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();
