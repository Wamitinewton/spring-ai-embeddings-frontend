// Application metadata
export const APP_INFO = {
    name: 'Programming Assistant',
    version: '1.0.0',
    description: 'AI-powered programming assistant with chatbot, quiz, and random facts',
    author: 'Your Name',
    repository: 'https://github.com/yourusername/programming-assistant'
  };
  
  // API Configuration
  export const API_CONFIG = {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  };
  
  // Supported Programming Languages
  export const PROGRAMMING_LANGUAGES = [
    { code: 'kotlin', name: 'Kotlin', icon: '🎯' },
    { code: 'java', name: 'Java', icon: '☕' },
    { code: 'python', name: 'Python', icon: '🐍' },
    { code: 'javascript', name: 'JavaScript', icon: '🟨' },
    { code: 'typescript', name: 'TypeScript', icon: '🔷' },
    { code: 'csharp', name: 'C#', icon: '🔵' },
    { code: 'cpp', name: 'C++', icon: '⚡' },
    { code: 'rust', name: 'Rust', icon: '🦀' },
    { code: 'go', name: 'Go', icon: '🐹' },
    { code: 'swift', name: 'Swift', icon: '🦉' }
  ];
  
  // Quiz Configuration
  export const QUIZ_CONFIG = {
    totalQuestions: 5,
    sessionTimeoutMinutes: 30,
    difficulties: [
      { code: 'beginner', name: 'Beginner', description: 'Basic concepts and syntax' },
      { code: 'intermediate', name: 'Intermediate', description: 'Advanced features and patterns' },
      { code: 'advanced', name: 'Advanced', description: 'Complex topics and optimization' }
    ],
    answerOptions: ['A', 'B', 'C', 'D']
  };
  
  // Theme Configuration
  export const THEME_CONFIG = {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#4299e1'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
      success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      warning: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      error: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
    }
  };
  
  // Code highlighting languages mapping
  export const CODE_LANGUAGES = {
    kotlin: 'kotlin',
    java: 'java',
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    csharp: 'csharp',
    cpp: 'cpp',
    rust: 'rust',
    go: 'go',
    swift: 'swift',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    sql: 'sql',
    bash: 'bash',
    shell: 'bash',
    text: 'text'
  };
  
  // Navigation menu items
  export const NAVIGATION_ITEMS = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/chatbot', name: 'Chatbot', icon: '🤖' },
    { path: '/quiz', name: 'Quiz', icon: '🧩' },
    { path: '/about', name: 'About', icon: 'ℹ️' }
  ];
  
  // Feature cards for home page
  export const FEATURES = [
    {
      id: 'chatbot',
      title: 'AI Programming Assistant',
      description: 'Get instant help with programming questions across multiple languages',
      icon: '🤖',
      path: '/chatbot',
      features: [
        'Multi-language support',
        'Code examples and explanations',
        'Document-enhanced responses',
        'Real-time assistance'
      ]
    },
    {
      id: 'quiz',
      title: 'Programming Quiz',
      description: 'Test your knowledge with AI-generated questions',
      icon: '🧩',
      path: '/quiz',
      features: [
        'Multiple difficulty levels',
        'Language-specific questions',
        'Immediate feedback',
        'Performance tracking'
      ]
    },
    {
      id: 'facts',
      title: 'Random Programming Facts',
      description: 'Discover interesting trivia about programming languages',
      icon: '💡',
      path: '/chatbot',
      features: [
        'Historical information',
        'Technical insights',
        'Language comparisons',
        'Fun trivia'
      ]
    }
  ];
  
  // Error messages
  export const ERROR_MESSAGES = {
    network: 'Unable to connect to server. Please check your internet connection.',
    timeout: 'Request timed out. Please try again.',
    serverError: 'Server error occurred. Please try again later.',
    validation: 'Please check your input and try again.',
    sessionExpired: 'Your session has expired. Please start a new session.',
    unknownError: 'An unexpected error occurred. Please try again.'
  };
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    questionSubmitted: 'Question submitted successfully!',
    quizStarted: 'Quiz session started successfully!',
    answerSubmitted: 'Answer submitted successfully!',
    sessionExtended: 'Session extended successfully!',
    documentsReloaded: 'Documents reloaded successfully!'
  };
  
  // Loading messages
  export const LOADING_MESSAGES = {
    askingQuestion: 'Processing your question...',
    startingQuiz: 'Starting quiz session...',
    submittingAnswer: 'Submitting your answer...',
    loadingFact: 'Generating random fact...',
    checkingHealth: 'Checking server status...',
    reloadingDocuments: 'Reloading knowledge base...',
    gettingStats: 'Loading statistics...'
  };
  
  // Local storage keys
  export const STORAGE_KEYS = {
    userPreferences: 'programming_assistant_preferences',
    lastSelectedLanguage: 'programming_assistant_last_language',
    quizHistory: 'programming_assistant_quiz_history',
    chatHistory: 'programming_assistant_chat_history'
  };
  
  // Performance thresholds
  export const PERFORMANCE_THRESHOLDS = {
    excellent: 80,
    good: 60,
    fair: 40,
    poor: 0
  };
  
  // Confidence levels
  export const CONFIDENCE_LEVELS = {
    VERY_LOW: { text: 'Very Low', color: 'error', threshold: 0 },
    LOW: { text: 'Low', color: 'warning', threshold: 25 },
    MEDIUM: { text: 'Medium', color: 'primary', threshold: 50 },
    HIGH: { text: 'High', color: 'success', threshold: 75 }
  };
  
  // Chat message types
  export const MESSAGE_TYPES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    ERROR: 'error'
  };
  
  // Animation durations (in milliseconds)
  export const ANIMATION_DURATIONS = {
    fast: 150,
    normal: 300,
    slow: 500,
    typing: 50
  };
  
  // Breakpoints for responsive design
  export const BREAKPOINTS = {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px'
  };
  
  // Default user preferences
  export const DEFAULT_PREFERENCES = {
    language: 'python',
    difficulty: 'beginner',
    theme: 'dark',
    animations: true,
    soundEffects: false,
    autoSubmit: false,
    showHints: true
  };
  
  // Code syntax highlighting themes
  export const CODE_THEMES = {
    dark: 'tomorrow-night',
    light: 'github'
  };
  
  // Regular expressions for validation
  export const VALIDATION_PATTERNS = {
    sessionId: /^[a-zA-Z0-9]{12}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    language: /^(kotlin|java|python|javascript|typescript|csharp|cpp|rust|go|swift)$/i,
    difficulty: /^(beginner|intermediate|advanced)$/i,
    answer: /^[ABCD]$/i
  };
  
  // Rate limiting configuration
  export const RATE_LIMITS = {
    chatbot: {
      requests: 30,
      window: 60000 // 1 minute
    },
    quiz: {
      requests: 10,
      window: 60000 // 1 minute
    },
    facts: {
      requests: 20,
      window: 60000 // 1 minute
    }
  };
  
  // Feature flags
  export const FEATURES_FLAGS = {
    enableQuiz: true,
    enableRandomFacts: true,
    enableAdmin: false,
    enableAnalytics: false,
    enableOfflineMode: false,
    enableVoiceInput: false
  };
  
  // Social links and contact info
  export const SOCIAL_LINKS = {
    github: 'https://github.com/yourusername/programming-assistant',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    email: 'contact@programmingassistant.com'
  };