import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Target, 
  Clock, 
  Trophy, 
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CodeBlock from '../components/chatbot/CodeBlock';
import { QuizService, getLanguageDisplayName, getDifficultyDisplay, getPerformanceLevel } from '../services/quizService';
import { PROGRAMMING_LANGUAGES } from '../utils/constants';

const Quiz = ({ userPreferences, onPreferencesChange }) => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, completed
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(userPreferences.language || 'python');
  const [selectedDifficulty, setSelectedDifficulty] = useState(userPreferences.difficulty || 'beginner');
  const [sessionSummary, setSessionSummary] = useState(null);

  // Load quiz info on mount
  useEffect(() => {
    // Could load quiz stats or info here if needed
  }, []);

  const startQuiz = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await QuizService.startQuizSession(selectedLanguage, selectedDifficulty);
      
      if (response.success) {
        setSessionData(response.data);
        setCurrentQuestion(response.data.currentQuestion);
        setGameState('playing');
        
        // Update user preferences
        onPreferencesChange({
          language: selectedLanguage,
          difficulty: selectedDifficulty
        });
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to start quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !sessionData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await QuizService.submitAnswer(sessionData.sessionId, selectedAnswer);
      
      if (response.success) {
        const data = response.data;
        
        // Update session data with new score
        setSessionData(prev => ({
          ...prev,
          score: data.currentScore
        }));

        if (data.hasNextQuestion) {
          // Move to next question
          setCurrentQuestion(data.nextQuestion);
          setSelectedAnswer('');
        } else {
          // Quiz completed
          setSessionSummary(data.sessionSummary);
          setGameState('completed');
        }
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setGameState('setup');
    setSessionData(null);
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setSessionSummary(null);
    setError(null);
  };

  const renderSetupScreen = () => (
    <div className="quiz-setup">
      <div className="setup-content">
        <div className="setup-header">
          <Target size={48} />
          <h1>Programming Quiz Challenge</h1>
          <p>Test your programming knowledge with AI-generated questions</p>
        </div>

        <div className="setup-form">
          <div className="form-group">
            <label className="form-label">Programming Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="form-select"
            >
              {PROGRAMMING_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.icon} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="form-select"
            >
              <option value="beginner">🟢 Beginner - Basic concepts</option>
              <option value="intermediate">🟡 Intermediate - Advanced features</option>
              <option value="advanced">🔴 Advanced - Expert level</option>
            </select>
          </div>

          <div className="quiz-info">
            <div className="info-item">
              <Clock size={20} />
              <span>5 Questions</span>
            </div>
            <div className="info-item">
              <Target size={20} />
              <span>Multiple Choice</span>
            </div>
            <div className="info-item">
              <Trophy size={20} />
              <span>Instant Feedback</span>
            </div>
          </div>

          <button
            onClick={startQuiz}
            disabled={isSubmitting}
            className="btn btn-primary btn-lg start-quiz-btn"
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" color="primary" />
            ) : (
              <Play size={20} />
            )}
            {isSubmitting ? 'Starting Quiz...' : 'Start Quiz'}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestionScreen = () => (
    <div className="quiz-game">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-info">
            <span className="question-number">
              Question {currentQuestion.questionNumber} of {sessionData.totalQuestions}
            </span>
            <span className="quiz-language">
              {getLanguageDisplayName(sessionData.language)} - {getDifficultyDisplay(selectedDifficulty).text}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentQuestion.questionNumber / sessionData.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="current-score">
          Score: {sessionData.score}/{sessionData.totalQuestions}
        </div>
      </div>

      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        {currentQuestion.codeSnippet && (
          <CodeBlock
            code={currentQuestion.codeSnippet}
            language={sessionData.language}
            showLineNumbers={false}
            maxHeight="200px"
          />
        )}

        <div className="answer-options">
          {currentQuestion.options.map((option) => (
            <label
              key={option.letter}
              className={`answer-option ${selectedAnswer === option.letter ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="answer"
                value={option.letter}
                checked={selectedAnswer === option.letter}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="option-content">
                <span className="option-letter">{option.letter}</span>
                <span className="option-text">{option.text}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="question-actions">
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer || isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" color="primary" />
            ) : (
              <CheckCircle size={16} />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompletedScreen = () => {
    const performance = getPerformanceLevel(sessionSummary.score);
    
    return (
      <div className="quiz-completed">
        <div className="completion-content">
          <div className="completion-header">
            <div className="completion-icon">
              {performance.emoji}
            </div>
            <h1>Quiz Completed!</h1>
            <p className="completion-message">{sessionSummary.message}</p>
          </div>

          <div className="results-card">
            <div className="result-item">
              <span className="result-label">Final Score</span>
              <span className="result-value">{sessionSummary.correctAnswers}/{sessionSummary.totalQuestions}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Percentage</span>
              <span className="result-value">{sessionSummary.score}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Performance</span>
              <span className={`result-value performance-${performance.color}`}>
                {sessionSummary.performance}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Language</span>
              <span className="result-value">{sessionSummary.languageDisplayName}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Difficulty</span>
              <span className="result-value">{getDifficultyDisplay(sessionSummary.difficulty).text}</span>
            </div>
          </div>

          <div className="completion-actions">
            <button
              onClick={resetQuiz}
              className="btn btn-primary btn-lg"
            >
              <RotateCcw size={20} />
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="quiz-page">
      <div className="container">
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
            className="quiz-error"
          />
        )}

        {gameState === 'setup' && renderSetupScreen()}
        {gameState === 'playing' && currentQuestion && renderQuestionScreen()}
        {gameState === 'completed' && sessionSummary && renderCompletedScreen()}
      </div>

      <style jsx>{`
        .quiz-page {
          min-height: calc(100vh - 140px);
          padding: var(--spacing-lg) 0;
          background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
        }

        .quiz-error {
          margin-bottom: var(--spacing-lg);
        }

        /* Setup Screen */
        .quiz-setup {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .setup-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          max-width: 500px;
          width: 100%;
          text-align: center;
        }

        .setup-header {
          margin-bottom: var(--spacing-xl);
        }

        .setup-header svg {
          color: var(--text-accent);
          margin-bottom: var(--spacing-md);
        }

        .setup-header h1 {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .setup-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .setup-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          text-align: left;
        }

        .quiz-info {
          display: flex;
          justify-content: space-around;
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .start-quiz-btn {
          margin-top: var(--spacing-md);
        }

        /* Game Screen */
        .quiz-game {
          max-width: 800px;
          margin: 0 auto;
        }

        .quiz-header {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiz-progress {
          flex: 1;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .question-number {
          font-weight: 600;
          color: var(--text-primary);
        }

        .quiz-language {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .progress-bar {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 3px;
          transition: width var(--transition-normal);
        }

        .current-score {
          background: var(--accent-gradient);
          color: var(--text-primary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 600;
          margin-left: var(--spacing-lg);
        }

        .question-card {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
        }

        .question-text {
          color: var(--text-primary);
          font-size: 1.25rem;
          line-height: 1.5;
          margin-bottom: var(--spacing-lg);
        }

        .answer-options {
          margin: var(--spacing-xl) 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .answer-option {
          background: var(--bg-tertiary);
          border: 2px solid var(--border-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
        }

        .answer-option:hover {
          border-color: var(--border-accent);
          background: var(--bg-secondary);
        }

        .answer-option.selected {
          border-color: var(--text-accent);
          background: rgba(102, 126, 234, 0.1);
        }

        .answer-option input {
          display: none;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          width: 100%;
        }

        .option-letter {
          width: 2rem;
          height: 2rem;
          background: var(--bg-primary);
          color: var(--text-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .answer-option.selected .option-letter {
          background: var(--accent-gradient);
          color: var(--text-primary);
        }

        .option-text {
          color: var(--text-primary);
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .question-actions {
          text-align: center;
          margin-top: var(--spacing-xl);
        }

        /* Completed Screen */
        .quiz-completed {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .completion-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .completion-header {
          margin-bottom: var(--spacing-xl);
        }

        .completion-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }

        .completion-header h1 {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .completion-message {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .results-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .result-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: center;
        }

        .result-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .performance-success { color: #48bb78; }
        .performance-primary { color: #667eea; }
        .performance-warning { color: #ed8936; }
        .performance-error { color: #f56565; }

        /* Responsive Design */
        @media (max-width: 768px) {
          .quiz-header {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .current-score {
            margin-left: 0;
          }

          .quiz-info {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .results-card {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .setup-content,
          .completion-content {
            padding: var(--spacing-xl);
            margin: 0 var(--spacing-md);
          }
        }

        @media (max-width: 480px) {
          .quiz-page {
            padding: var(--spacing-md) 0;
          }

          .question-card {
            padding: var(--spacing-lg);
          }

          .question-text {
            font-size: 1.1rem;
          }

          .option-content {
            gap: var(--spacing-sm);
          }

          .option-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Quiz;