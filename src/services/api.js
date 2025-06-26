import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and error handling
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.errorMessage || 'Invalid request. Please check your input.');
        case 404:
          throw new Error('Service not found. Please try again later.');
        case 500:
          throw new Error('Internal server error. Please try again later.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(data.errorMessage || `Server error (${status}). Please try again.`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
);

// API endpoints
export const endpoints = {
  // Application info
  info: '/info',
  health: '/health',
  
  // Chatbot endpoints
  chatbot: {
    ask: '/chatbot/ask',
    randomFact: '/chatbot/random-fact',
    info: '/chatbot/info',
    supportedLanguages: '/chatbot/supported-languages',
    admin: {
      reloadDocuments: '/chatbot/admin/reload-documents',
      initializationStatus: '/chatbot/admin/initialization-status',
      knowledgeBaseStats: '/chatbot/admin/knowledge-base-stats',
    },
  },
  
  // Quiz endpoints
  quiz: {
    start: '/quiz/start',
    answer: '/quiz/answer',
    session: (sessionId) => `/quiz/session/${sessionId}`,
    extend: (sessionId) => `/quiz/session/${sessionId}/extend`,
    stats: '/quiz/stats',
    info: '/quiz/info',
    supportedLanguages: '/quiz/supported-languages',
  },
};

// Generic API methods
export const apiMethods = {
  // GET request
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },
  
  // POST request
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },
  
  // PUT request
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },
  
  // DELETE request
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },
};

// Helper function to handle API errors consistently
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
};

// Helper function to check if the API is available
export const checkApiHealth = async () => {
  try {
    const response = await apiMethods.get(endpoints.health);
    return response.status === 'UP';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default api;