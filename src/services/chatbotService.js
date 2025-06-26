import { apiMethods, endpoints } from './api';

export class ChatbotService {
  
  /**
   * Ask a programming question to the chatbot
   * @param {string} question - The programming question to ask
   * @returns {Promise<Object>} Response with answer, code examples, and metadata
   */
  static async askQuestion(question) {
    if (!question || question.trim().length === 0) {
      throw new Error('Question cannot be empty');
    }

    if (question.length > 1000) {
      throw new Error('Question must be less than 1000 characters');
    }

    try {
      const response = await apiMethods.post(endpoints.chatbot.ask, {
        question: question.trim()
      });

      // Validate response structure
      if (!response.successful) {
        throw new Error(response.errorMessage || 'Failed to get response from chatbot');
      }

      return {
        success: true,
        data: {
          summary: response.summary || '',
          fullAnswer: response.fullAnswer || '',
          sections: response.sections || [],
          codeExamples: response.codeExamples || [],
          confidence: response.confidence || 'MEDIUM',
          contextDocumentCount: response.contextDocumentCount || 0,
          responseTimeMs: response.responseTimeMs || 0
        }
      };
    } catch (error) {
      console.error('Chatbot question failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to process your question'
      };
    }
  }

  /**
   * Ask a question using GET method (alternative for simple queries)
   * @param {string} question - The programming question to ask
   * @returns {Promise<Object>} Response with answer, code examples, and metadata
   */
  static async askQuestionGet(question) {
    if (!question || question.trim().length === 0) {
      throw new Error('Question cannot be empty');
    }

    try {
      const response = await apiMethods.get(endpoints.chatbot.ask, {
        question: question.trim()
      });

      if (!response.successful) {
        throw new Error(response.errorMessage || 'Failed to get response from chatbot');
      }

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Chatbot GET question failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to process your question'
      };
    }
  }

  /**
   * Get a random programming fact
   * @param {string} language - Optional language to focus on (e.g., 'python', 'kotlin')
   * @returns {Promise<Object>} Random fact with metadata
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
   * Get chatbot information and capabilities
   * @returns {Promise<Object>} Chatbot information
   */
  static async getInfo() {
    try {
      const response = await apiMethods.get(endpoints.chatbot.info);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get chatbot info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get chatbot information'
      };
    }
  }

  /**
   * Get supported programming languages
   * @returns {Promise<Object>} List of supported languages
   */
  static async getSupportedLanguages() {
    try {
      const response = await apiMethods.get(endpoints.chatbot.supportedLanguages);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get supported languages:', error);
      return {
        success: false,
        error: error.message || 'Failed to get supported languages'
      };
    }
  }

  /**
   * Admin: Reload all documents in the knowledge base
   * @returns {Promise<Object>} Reload operation result
   */
  static async reloadDocuments() {
    try {
      const response = await apiMethods.post(endpoints.chatbot.admin.reloadDocuments);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Document reload failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to reload documents'
      };
    }
  }

  /**
   * Admin: Get initialization status
   * @returns {Promise<Object>} Initialization status
   */
  static async getInitializationStatus() {
    try {
      const response = await apiMethods.get(endpoints.chatbot.admin.initializationStatus);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get initialization status:', error);
      return {
        success: false,
        error: error.message || 'Failed to get initialization status'
      };
    }
  }

  /**
   * Admin: Get knowledge base statistics
   * @returns {Promise<Object>} Knowledge base statistics
   */
  static async getKnowledgeBaseStats() {
    try {
      const response = await apiMethods.get(endpoints.chatbot.admin.knowledgeBaseStats);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get knowledge base stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to get knowledge base statistics'
      };
    }
  }
}

/**
 * Format code examples for display
 * @param {Array} codeExamples - Array of code examples from API response
 * @returns {Array} Formatted code examples
 */
export const formatCodeExamples = (codeExamples = []) => {
  return codeExamples.map((example, index) => ({
    id: `code-${index}`,
    language: example.language || 'text',
    code: example.code || '',
    description: example.description || `Code example ${index + 1}`,
    filename: example.filename || null
  }));
};

/**
 * Format content sections for display
 * @param {Array} sections - Array of content sections from API response
 * @returns {Array} Formatted content sections
 */
export const formatContentSections = (sections = []) => {
  return sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.title || `Section ${index + 1}`,
    content: section.content || '',
    cleanContent: section.cleanContent || '',
    type: section.type || 'explanation',
    hasCode: section.hasCode || false
  }));
};

/**
 * Get confidence level display info
 * @param {string} confidence - Confidence level from API
 * @returns {Object} Display information for confidence level
 */
export const getConfidenceDisplay = (confidence) => {
  const confidenceLevels = {
    'VERY_LOW': {
      text: 'Very Low',
      color: 'error',
      description: 'Limited information available'
    },
    'LOW': {
      text: 'Low',
      color: 'warning',
      description: 'Basic information provided'
    },
    'MEDIUM': {
      text: 'Medium',
      color: 'primary',
      description: 'Good information quality'
    },
    'HIGH': {
      text: 'High',
      color: 'success',
      description: 'Comprehensive information'
    }
  };

  return confidenceLevels[confidence] || confidenceLevels['MEDIUM'];
};

/**
 * Validate question before sending
 * @param {string} question - Question to validate
 * @returns {Object} Validation result
 */
export const validateQuestion = (question) => {
  if (!question || typeof question !== 'string') {
    return {
      valid: false,
      error: 'Question is required'
    };
  }

  const trimmed = question.trim();
  
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Question cannot be empty'
    };
  }

  if (trimmed.length > 1000) {
    return {
      valid: false,
      error: 'Question must be less than 1000 characters'
    };
  }

  if (trimmed.length < 3) {
    return {
      valid: false,
      error: 'Question is too short'
    };
  }

  return {
    valid: true,
    question: trimmed
  };
};

export default ChatbotService;