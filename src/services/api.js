import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://spring-ai-embeddings.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
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
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
);

export const endpoints = {
  info: '/info',
  health: '/health',
  
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

export const apiMethods = {
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },
  
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },
  
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },
  
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

export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
};

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