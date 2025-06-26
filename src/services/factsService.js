import { apiMethods, endpoints } from './api';

/**
 * Facts Service - Handles random programming facts API calls
 */
export class FactsService {
  
  /**
   * Get a random programming fact
   * @param {string} language - Optional language to focus on
   * @returns {Promise<Object>} Random fact response
   */
  static async getRandomFact(language = null) {
    try {
      const params = {};
      if (language && language.trim()) {
        params.language = language.trim().toLowerCase();
      }

      const response = await apiMethods.get(endpoints.chatbot.randomFact, params);

      if (!response.successful) {
        throw new Error(response.errorMessage || 'Failed to generate random fact');
      }

      return {
        success: true,
        data: {
          fact: response.fact,
          language: response.language,
          category: response.category,
          source: response.source,
          responseTimeMs: response.responseTimeMs
        }
      };
    } catch (error) {
      console.error('Random fact generation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate random fact'
      };
    }
  }

  /**
   * Get multiple random facts
   * @param {number} count - Number of facts to retrieve
   * @param {string} language - Optional language filter
   * @returns {Promise<Object>} Multiple facts response
   */
  static async getMultipleFacts(count = 3, language = null) {
    try {
      const facts = [];
      const promises = [];

      for (let i = 0; i < count; i++) {
        promises.push(this.getRandomFact(language));
      }

      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          facts.push({
            id: index + 1,
            ...result.value.data
          });
        }
      });

      return {
        success: true,
        data: {
          facts,
          totalRequested: count,
          totalReceived: facts.length
        }
      };
    } catch (error) {
      console.error('Multiple facts generation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate multiple facts'
      };
    }
  }

  /**
   * Validate language parameter
   * @param {string} language - Language to validate
   * @returns {boolean} Whether language is valid
   */
  static isValidLanguage(language) {
    const supportedLanguages = [
      'kotlin', 'java', 'python', 'javascript', 'typescript',
      'csharp', 'cpp', 'rust', 'go', 'swift'
    ];
    
    return language && supportedLanguages.includes(language.toLowerCase());
  }

  /**
   * Get available fact categories
   * @returns {Array} Available categories
   */
  static getFactCategories() {
    return [
      { code: 'history', name: 'History', description: 'Language origins and evolution' },
      { code: 'technical', name: 'Technical', description: 'Performance and implementation details' },
      { code: 'features', name: 'Features', description: 'Unique syntax and capabilities' },
      { code: 'trivia', name: 'Trivia', description: 'Fun facts and naming origins' },
      { code: 'comparison', name: 'Comparison', description: 'Language comparisons and distinctions' }
    ];
  }
}

/**
 * Format fact for display
 * @param {Object} fact - Fact object from API
 * @returns {Object} Formatted fact
 */
export const formatFact = (fact) => {
  if (!fact) return null;

  return {
    id: fact.id || Date.now().toString(),
    text: fact.fact || '',
    language: fact.language || 'general',
    category: fact.category || 'general',
    source: fact.source || 'AI Knowledge',
    responseTime: fact.responseTimeMs || 0,
    timestamp: new Date()
  };
};

/**
 * Get category display information
 * @param {string} category - Category code
 * @returns {Object} Category display info
 */
export const getCategoryDisplay = (category) => {
  const categories = {
    history: { icon: '📚', color: 'info', name: 'History' },
    technical: { icon: '⚙️', color: 'primary', name: 'Technical' },
    features: { icon: '✨', color: 'success', name: 'Features' },
    trivia: { icon: '🎯', color: 'warning', name: 'Trivia' },
    comparison: { icon: '⚖️', color: 'secondary', name: 'Comparison' }
  };

  return categories[category] || categories.trivia;
};

export default FactsService;