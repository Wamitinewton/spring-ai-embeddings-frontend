import { apiMethods, endpoints } from './api';

export class QuizService {
  
  /**
   * Start a new quiz session
   * @param {string} language - Programming language for the quiz
   * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced)
   * @returns {Promise<Object>} Quiz session response
   */
  static async startQuizSession(language = 'python', difficulty = 'beginner') {
    try {
      // Validate inputs
      const validation = this.validateQuizParams(language, difficulty);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const response = await apiMethods.post(endpoints.quiz.start, {
        language: validation.language,
        difficulty: validation.difficulty
      });

      if (!response.successful) {
        throw new Error(response.errorMessage || 'Failed to start quiz session');
      }

      return {
        success: true,
        data: {
          sessionId: response.sessionId,
          language: response.language,
          languageDisplayName: response.languageDisplayName,
          difficulty: response.difficulty,
          currentQuestion: response.currentQuestion,
          totalQuestions: response.totalQuestions,
          currentQuestionNumber: response.currentQuestionNumber,
          score: response.score,
          isComplete: response.isComplete
        }
      };
    } catch (error) {
      console.error('Quiz session start failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to start quiz session'
      };
    }
  }

  /**
   * Start quiz session using GET method
   * @param {string} language - Programming language for the quiz
   * @param {string} difficulty - Difficulty level
   * @returns {Promise<Object>} Quiz session response
   */
  static async startQuizSessionGet(language = 'python', difficulty = 'beginner') {
    try {
      const validation = this.validateQuizParams(language, difficulty);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const response = await apiMethods.get(endpoints.quiz.start, {
        language: validation.language,
        difficulty: validation.difficulty
      });

      if (!response.successful) {
        throw new Error(response.errorMessage || 'Failed to start quiz session');
      }

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Quiz session GET start failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to start quiz session'
      };
    }
  }

  /**
   * Submit an answer to a quiz question
   * @param {string} sessionId - Quiz session ID
   * @param {string} answer - Selected answer (A, B, C, or D)
   * @returns {Promise<Object>} Answer submission response
   */
  static async submitAnswer(sessionId, answer) {
    try {
      // Validate inputs
      const validation = this.validateAnswerSubmission(sessionId, answer);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const response = await apiMethods.post(endpoints.quiz.answer, {
        sessionId: validation.sessionId,
        answer: validation.answer
      });

      if (!response.successful) {
        throw new Error(response.errorMessage || 'Failed to submit answer');
      }

      return {
        success: true,
        data: {
          correct: response.correct,
          message: response.message,
          correctAnswer: response.correctAnswer,
          explanation: response.explanation,
          currentScore: response.currentScore,
          hasNextQuestion: response.hasNextQuestion,
          nextQuestion: response.nextQuestion,
          sessionSummary: response.sessionSummary
        }
      };
    } catch (error) {
      console.error('Answer submission failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit answer'
      };
    }
  }

  /**
   * Get quiz session status
   * @param {string} sessionId - Quiz session ID
   * @returns {Promise<Object>} Session status
   */
  static async getSessionStatus(sessionId) {
    try {
      if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Session ID is required');
      }

      const response = await apiMethods.get(endpoints.quiz.session(sessionId));
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get session status:', error);
      return {
        success: false,
        error: error.message || 'Failed to get session status'
      };
    }
  }

  static async extendSession(sessionId) {
    try {
      if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Session ID is required');
      }

      await apiMethods.post(endpoints.quiz.extend(sessionId));
      return {
        success: true,
        data: { message: 'Session extended successfully' }
      };
    } catch (error) {
      console.error('Failed to extend session:', error);
      return {
        success: false,
        error: error.message || 'Failed to extend session'
      };
    }
  }

  /**
   * Get quiz statistics
   * @returns {Promise<Object>} Quiz statistics
   */
  static async getQuizStats() {
    try {
      const response = await apiMethods.get(endpoints.quiz.stats);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get quiz stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to get quiz statistics'
      };
    }
  }

  /**
   * Get quiz information and capabilities
   * @returns {Promise<Object>} Quiz information
   */
  static async getQuizInfo() {
    try {
      const response = await apiMethods.get(endpoints.quiz.info);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get quiz info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get quiz information'
      };
    }
  }

  /**
   * Get supported programming languages for quiz
   * @returns {Promise<Object>} Supported languages
   */
  static async getSupportedLanguages() {
    try {
      const response = await apiMethods.get(endpoints.quiz.supportedLanguages);
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
   * Validate quiz parameters
   * @param {string} language - Programming language
   * @param {string} difficulty - Difficulty level
   * @returns {Object} Validation result
   */
  static validateQuizParams(language, difficulty) {
    const supportedLanguages = [
      'kotlin', 'java', 'python', 'javascript', 'typescript',
      'csharp', 'cpp', 'rust', 'go', 'swift'
    ];
    
    const supportedDifficulties = ['beginner', 'intermediate', 'advanced'];

    const normalizedLanguage = language ? language.toLowerCase().trim() : 'python';
    if (!supportedLanguages.includes(normalizedLanguage)) {
      return {
        valid: false,
        error: `Unsupported language. Supported languages: ${supportedLanguages.join(', ')}`
      };
    }

    const normalizedDifficulty = difficulty ? difficulty.toLowerCase().trim() : 'beginner';
    if (!supportedDifficulties.includes(normalizedDifficulty)) {
      return {
        valid: false,
        error: `Invalid difficulty. Must be one of: ${supportedDifficulties.join(', ')}`
      };
    }

    return {
      valid: true,
      language: normalizedLanguage,
      difficulty: normalizedDifficulty
    };
  }

  /**
   * Validate answer submission
   * @param {string} sessionId - Session ID
   * @param {string} answer - Answer choice
   * @returns {Object} Validation result
   */
  static validateAnswerSubmission(sessionId, answer) {
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
      return {
        valid: false,
        error: 'Session ID is required'
      };
    }

    if (!answer || typeof answer !== 'string') {
      return {
        valid: false,
        error: 'Answer is required'
      };
    }

    const normalizedAnswer = answer.toUpperCase().trim();
    if (!['A', 'B', 'C', 'D'].includes(normalizedAnswer)) {
      return {
        valid: false,
        error: 'Answer must be A, B, C, or D'
      };
    }

    return {
      valid: true,
      sessionId: sessionId.trim(),
      answer: normalizedAnswer
    };
  }
}

/**
 * Format quiz question for display
 * @param {Object} question - Question object from API
 * @returns {Object} Formatted question
 */
export const formatQuizQuestion = (question) => {
  if (!question) return null;

  return {
    questionNumber: question.questionNumber || 1,
    question: question.question || '',
    codeSnippet: question.codeSnippet || '',
    options: question.options || [],
    hasCode: !!(question.codeSnippet && question.codeSnippet.trim())
  };
};

/**
 * Get language display name
 * @param {string} language - Language code
 * @returns {string} Display name
 */
export const getLanguageDisplayName = (language) => {
  const languageNames = {
    kotlin: 'Kotlin',
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    csharp: 'C#',
    cpp: 'C++',
    rust: 'Rust',
    go: 'Go',
    swift: 'Swift'
  };

  return languageNames[language?.toLowerCase()] || 'Programming';
};

/**
 * Get difficulty display info
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Display information
 */
export const getDifficultyDisplay = (difficulty) => {
  const difficultyLevels = {
    beginner: {
      text: 'Beginner',
      color: 'success',
      description: 'Basic concepts and syntax'
    },
    intermediate: {
      text: 'Intermediate',
      color: 'warning',
      description: 'Advanced features and patterns'
    },
    advanced: {
      text: 'Advanced',
      color: 'error',
      description: 'Complex topics and optimization'
    }
  };

  return difficultyLevels[difficulty?.toLowerCase()] || difficultyLevels['beginner'];
};

/**
 * Calculate quiz performance level
 * @param {number} score - Score percentage (0-100)
 * @returns {Object} Performance information
 */
export const getPerformanceLevel = (score) => {
  if (score >= 80) {
    return {
      level: 'Excellent',
      color: 'success',
      emoji: '🎉',
      message: 'Outstanding performance!'
    };
  } else if (score >= 60) {
    return {
      level: 'Good',
      color: 'primary',
      emoji: '👏',
      message: 'Well done!'
    };
  } else if (score >= 40) {
    return {
      level: 'Fair',
      color: 'warning',
      emoji: '📚',
      message: 'Keep practicing!'
    };
  } else {
    return {
      level: 'Needs Improvement',
      color: 'error',
      emoji: '💪',
      message: 'Don\'t give up!'
    };
  }
};

export default QuizService;