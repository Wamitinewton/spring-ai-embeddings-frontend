import { PROGRAMMING_LANGUAGES, VALIDATION_PATTERNS, STORAGE_KEYS } from './constants';

/**
 * Format time duration in a human-readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds) => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Format response time for display
 * @param {number} responseTimeMs - Response time in milliseconds
 * @returns {string} Formatted response time
 */
export const formatResponseTime = (responseTimeMs) => {
  if (responseTimeMs < 1000) {
    return `${responseTimeMs}ms`;
  }
  return `${(responseTimeMs / 1000).toFixed(1)}s`;
};

/**
 * Get language display information
 * @param {string} languageCode - Language code
 * @returns {Object} Language display info
 */
export const getLanguageInfo = (languageCode) => {
  const language = PROGRAMMING_LANGUAGES.find(
    lang => lang.code.toLowerCase() === languageCode?.toLowerCase()
  );
  return language || { code: 'unknown', name: 'Unknown', icon: '❓' };
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Validate session ID format
 * @param {string} sessionId - Session ID to validate
 * @returns {boolean} Validation result
 */
export const isValidSessionId = (sessionId) => {
  return VALIDATION_PATTERNS.sessionId.test(sessionId);
};

/**
 * Validate programming language
 * @param {string} language - Language to validate
 * @returns {boolean} Validation result
 */
export const isValidLanguage = (language) => {
  return VALIDATION_PATTERNS.language.test(language);
};

/**
 * Validate difficulty level
 * @param {string} difficulty - Difficulty to validate
 * @returns {boolean} Validation result
 */
export const isValidDifficulty = (difficulty) => {
  return VALIDATION_PATTERNS.difficulty.test(difficulty);
};

/**
 * Validate quiz answer
 * @param {string} answer - Answer to validate
 * @returns {boolean} Validation result
 */
export const isValidAnswer = (answer) => {
  return VALIDATION_PATTERNS.answer.test(answer);
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get time ago string
 * @param {Date|string|number} date - Date to compare
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return past.toLocaleDateString();
};

/**
 * Scroll to element smoothly
 * @param {string} elementId - Element ID to scroll to
 * @param {number} offset - Offset from top
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is visible
 */
export const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Local storage helpers
 */
export const storage = {
  /**
   * Get item from local storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Set item in local storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  /**
   * Remove item from local storage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all items from local storage
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * User preferences helpers
 */
export const preferences = {
  /**
   * Get user preferences
   * @returns {Object} User preferences
   */
  get: () => {
    return storage.get(STORAGE_KEYS.userPreferences, {
      language: 'python',
      difficulty: 'beginner',
      theme: 'dark',
      animations: true
    });
  },

  /**
   * Set user preferences
   * @param {Object} prefs - Preferences to update
   */
  set: (prefs) => {
    const current = preferences.get();
    const updated = { ...current, ...prefs };
    storage.set(STORAGE_KEYS.userPreferences, updated);
  },

  /**
   * Get last selected language
   * @returns {string} Last selected language
   */
  getLastLanguage: () => {
    return storage.get(STORAGE_KEYS.lastSelectedLanguage, 'python');
  },

  /**
   * Set last selected language
   * @param {string} language - Language to remember
   */
  setLastLanguage: (language) => {
    storage.set(STORAGE_KEYS.lastSelectedLanguage, language);
  }
};

/**
 * Error handling helpers
 */
export const errorUtils = {
  /**
   * Extract error message from error object
   * @param {Error|string|Object} error - Error to process
   * @returns {string} Error message
   */
  getMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.errorMessage) return error.errorMessage;
    return 'An unexpected error occurred';
  },

  /**
   * Check if error is network related
   * @param {Error} error - Error to check
   * @returns {boolean} Whether error is network related
   */
  isNetworkError: (error) => {
    const message = errorUtils.getMessage(error).toLowerCase();
    return message.includes('network') || 
           message.includes('connection') || 
           message.includes('fetch');
  },

  /**
   * Check if error is timeout related
   * @param {Error} error - Error to check
   * @returns {boolean} Whether error is timeout related
   */
  isTimeoutError: (error) => {
    const message = errorUtils.getMessage(error).toLowerCase();
    return message.includes('timeout') || message.includes('timed out');
  }
};

/**
 * URL and routing helpers
 */
export const urlUtils = {
  /**
   * Get current path
   * @returns {string} Current path
   */
  getCurrentPath: () => {
    return window.location.pathname;
  },

  /**
   * Check if path is active
   * @param {string} path - Path to check
   * @returns {boolean} Whether path is active
   */
  isActivePath: (path) => {
    return urlUtils.getCurrentPath() === path;
  },

  /**
   * Build query string from object
   * @param {Object} params - Parameters object
   * @returns {string} Query string
   */
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }
};

/**
 * Device detection helpers
 */
export const deviceUtils = {
  /**
   * Check if device is mobile
   * @returns {boolean} Whether device is mobile
   */
  isMobile: () => {
    return window.innerWidth <= 768;
  },

  /**
   * Check if device is tablet
   * @returns {boolean} Whether device is tablet
   */
  isTablet: () => {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },

  /**
   * Check if device is desktop
   * @returns {boolean} Whether device is desktop
   */
  isDesktop: () => {
    return window.innerWidth > 1024;
  },

  /**
   * Check if device supports touch
   * @returns {boolean} Whether device supports touch
   */
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
};