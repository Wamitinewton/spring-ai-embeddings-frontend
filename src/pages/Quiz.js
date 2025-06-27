import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Target, 
  Clock, 
  Trophy, 
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  ChevronLeft,
  Home
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CodeBlock from '../components/chatbot/CodeBlock';
import { QuizService, getLanguageDisplayName, getDifficultyDisplay, getPerformanceLevel } from '../services/quizService';
import { PROGRAMMING_LANGUAGES } from '../utils/constants';
import { deviceUtils } from '../utils/helpers';

const Quiz = ({ userPreferences, onPreferencesChange }) => {
  const [gameState, setGameState] = useState('setup'); 
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(userPreferences.language || 'python');
  const [selectedDifficulty, setSelectedDifficulty] = useState(userPreferences.difficulty || 'beginner');
  const [sessionSummary, setSessionSummary] = useState(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [showMobileHint, setShowMobileHint] = useState(false);

  const questionRef = useRef(null);
  const answerOptionsRef = useRef(null);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (deviceUtils.isMobile() && gameState === 'setup') {
      const hasSeenHint = localStorage.getItem('quiz-mobile-hint-seen');
      if (!hasSeenHint) {
        setShowMobileHint(true);
        localStorage.setItem('quiz-mobile-hint-seen', 'true');
      }
    }
  }, [gameState]);

  const startQuiz = async () => {
    setError(null);
    setIsSubmitting(true);
    setShowMobileHint(false);

    try {
      const response = await QuizService.startQuizSession(selectedLanguage, selectedDifficulty);
      
      if (response.success) {
        setSessionData(response.data);
        setCurrentQuestion(response.data.currentQuestion);
        setGameState('playing');
        
        onPreferencesChange({
          language: selectedLanguage,
          difficulty: selectedDifficulty
        });

        if (deviceUtils.isMobile()) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
        
        setAnswerFeedback({
          correct: data.correct,
          message: data.message,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
          selectedAnswer: selectedAnswer
        });

        setSessionData(prev => ({
          ...prev,
          score: data.currentScore
        }));

        setGameState('feedback');

        if (data.hasNextQuestion) {
          setCurrentQuestion(data.nextQuestion);
        } else {
          setSessionSummary(data.sessionSummary);
        }

        if (deviceUtils.isMobile()) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
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

  const proceedToNext = () => {
    if (answerFeedback && sessionSummary) {
      setGameState('completed');
    } else {
      setSelectedAnswer('');
      setAnswerFeedback(null);
      setGameState('playing');
    }

    if (deviceUtils.isMobile()) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const resetQuiz = () => {
    setGameState('setup');
    setSessionData(null);
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setAnswerFeedback(null);
    setSessionSummary(null);
    setError(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (gameState === 'playing' || gameState === 'feedback') {
      resetQuiz();
    }
  };

  const handleAnswerSelect = (optionLetter) => {
    setSelectedAnswer(optionLetter);
    
    if (deviceUtils.isMobile() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const renderSetupScreen = () => (
    <div className="quiz-setup">
      <div className="setup-content">
        <div className="setup-header">
          <div className="setup-icon">
            <Target size={deviceUtils.isMobile() ? 40 : 48} />
          </div>
          <h1>Programming Quiz Challenge</h1>
          <p>Test your programming knowledge with AI-generated questions</p>
        </div>

        {showMobileHint && (
          <div className="mobile-hint">
            <div className="hint-content">
              <span className="hint-icon">📱</span>
              <p>Tip: Rotate your device to landscape mode for the best quiz experience!</p>
              <button 
                className="hint-dismiss"
                onClick={() => setShowMobileHint(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        <div className="setup-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">💻</span>
              Programming Language
            </label>
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
            <label className="form-label">
              <span className="label-icon">🎯</span>
              Difficulty Level
            </label>
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
            <h3 className="info-title">Quiz Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <Clock size={deviceUtils.isMobile() ? 18 : 20} />
                <span>5 Questions</span>
              </div>
              <div className="info-item">
                <Target size={deviceUtils.isMobile() ? 18 : 20} />
                <span>Multiple Choice</span>
              </div>
              <div className="info-item">
                <Trophy size={deviceUtils.isMobile() ? 18 : 20} />
                <span>Instant Feedback</span>
              </div>
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
      {/* Mobile Back Button */}
      {deviceUtils.isMobile() && (
        <div className="mobile-header">
          <button
            onClick={goBack}
            className="back-button"
            aria-label="Go back to setup"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <div className="mobile-score">
            <Trophy size={16} />
            <span>{sessionData.score}/{sessionData.totalQuestions}</span>
          </div>
        </div>
      )}

      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-info">
            <span className="question-number">
              Question {currentQuestion.questionNumber} of {sessionData.totalQuestions}
            </span>
            <span className="quiz-meta">
              {getLanguageDisplayName(sessionData.language)} • {getDifficultyDisplay(selectedDifficulty).text}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentQuestion.questionNumber / sessionData.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        {!deviceUtils.isMobile() && (
          <div className="current-score">
            <Trophy size={16} />
            <span>{sessionData.score}/{sessionData.totalQuestions}</span>
          </div>
        )}
      </div>

      <div className="question-card" ref={questionRef}>
        <div className="question-header">
          <h2 className="question-text">{currentQuestion.question}</h2>
        </div>
        
        {currentQuestion.codeSnippet && (
          <div className="question-code">
            <CodeBlock
              code={currentQuestion.codeSnippet}
              language={sessionData.language}
              showLineNumbers={true}
              maxHeight={deviceUtils.isMobile() ? "250px" : "300px"}
              description="Code to analyze"
            />
          </div>
        )}

        <div className="answer-options" ref={answerOptionsRef}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.letter}
              className={`answer-option ${selectedAnswer === option.letter ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(option.letter)}
              disabled={isSubmitting}
              aria-label={`Option ${option.letter}: ${option.text}`}
            >
              <div className="option-content">
                <span className="option-letter">{option.letter}</span>
                <span className="option-text">{option.text}</span>
              </div>
              {selectedAnswer === option.letter && (
                <div className="selection-indicator">
                  <CheckCircle size={20} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="question-actions">
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer || isSubmitting}
            className="btn btn-primary btn-lg submit-btn"
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" color="primary" />
            ) : (
              <CheckCircle size={18} />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
          
          {deviceUtils.isMobile() && selectedAnswer && (
            <div className="mobile-selection-hint">
              <span>Selected: {selectedAnswer}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFeedbackScreen = () => (
    <div className="quiz-feedback">
      <div className="feedback-content">
        <div className="feedback-header">
          <div className={`feedback-icon ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
            {answerFeedback.correct ? (
              <CheckCircle size={deviceUtils.isMobile() ? 40 : 48} />
            ) : (
              <XCircle size={deviceUtils.isMobile() ? 40 : 48} />
            )}
          </div>
          <h2 className={`feedback-title ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
            {answerFeedback.correct ? 'Correct!' : 'Incorrect'}
          </h2>
          {answerFeedback.message && (
            <p className="feedback-message">{answerFeedback.message}</p>
          )}
        </div>

        <div className="feedback-details">
          <div className="answer-comparison">
            <h3 className="comparison-title">Answer Summary</h3>
            <div className="answer-grid">
              <div className="answer-item">
                <span className="answer-label">Your Answer</span>
                <span className={`answer-value ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
                  {answerFeedback.selectedAnswer}
                </span>
              </div>
              {!answerFeedback.correct && (
                <div className="answer-item">
                  <span className="answer-label">Correct Answer</span>
                  <span className="answer-value correct">
                    {answerFeedback.correctAnswer}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="explanation-section">
            <h3 className="explanation-title">
              <span className="explanation-icon">💡</span>
              Explanation
            </h3>
            <div className="explanation-text">{answerFeedback.explanation}</div>
          </div>

          <div className="score-update">
            <div className="score-item">
              <Award size={18} />
              <span>Current Score: {sessionData.score}/{sessionData.totalQuestions}</span>
            </div>
          </div>
        </div>

        <div className="feedback-actions">
          <button
            onClick={proceedToNext}
            className="btn btn-primary btn-lg continue-btn"
          >
            {sessionSummary ? (
              <>
                <Trophy size={18} />
                View Results
              </>
            ) : (
              <>
                <ArrowRight size={18} />
                Next Question
              </>
            )}
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
              <span className="performance-emoji">{performance.emoji}</span>
            </div>
            <h1>Quiz Completed!</h1>
            <p className="completion-message">{sessionSummary.message}</p>
          </div>

          <div className="results-card">
            <h2 className="results-title">Your Results</h2>
            <div className="results-grid">
              <div className="result-item primary">
                <span className="result-label">Final Score</span>
                <span className="result-value">{sessionSummary.correctAnswers}/{sessionSummary.totalQuestions}</span>
              </div>
              <div className="result-item primary">
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
          </div>

          <div className="completion-actions">
            <button
              onClick={resetQuiz}
              className="btn btn-primary btn-lg retry-btn"
            >
              <RotateCcw size={18} />
              Take Another Quiz
            </button>
            <a
              href="/"
              className="btn btn-secondary btn-lg home-btn"
            >
              <Home size={18} />
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="quiz-page"
      style={{ 
        '--viewport-height': `${viewportHeight}px`
      }}
    >
      <div className="quiz-container">
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
            className="quiz-error"
          />
        )}

        {gameState === 'setup' && renderSetupScreen()}
        {gameState === 'playing' && currentQuestion && renderQuestionScreen()}
        {gameState === 'feedback' && answerFeedback && renderFeedbackScreen()}
        {gameState === 'completed' && sessionSummary && renderCompletedScreen()}
      </div>

      <style jsx>{`
        .quiz-page {
          min-height: 100vh;
          min-height: var(--viewport-height, 100vh);
          padding: var(--spacing-md) 0;
          background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
          /* Force hardware acceleration */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .quiz-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 var(--spacing-md);
        }

        .quiz-error {
          margin-bottom: var(--spacing-lg);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Mobile Hint */
        .mobile-hint {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          animation: slideDown 0.3s ease-out;
        }

        .hint-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .hint-icon {
          font-size: 1.5rem;
        }

        .hint-content p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }

        .hint-dismiss {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border: none;
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .hint-dismiss:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        /* Enhanced Setup Screen */
        .quiz-setup {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          padding: var(--spacing-lg) 0;
        }

        .setup-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
        }

        .setup-header {
          margin-bottom: var(--spacing-xl);
        }

        .setup-icon {
          color: var(--text-accent);
          margin-bottom: var(--spacing-md);
          animation: pulse 2s infinite;
          display: flex;
          justify-content: center;
        }

        .setup-header h1 {
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .setup-header p {
          color: var(--text-secondary);
          font-size: clamp(0.875rem, 2.5vw, 1.1rem);
          line-height: 1.6;
          margin: 0;
        }

        .setup-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          text-align: left;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .label-icon {
          font-size: 1rem;
        }

        .form-select {
          width: 100%;
          background: var(--bg-input);
          border: 2px solid var(--border-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          /* Mobile optimization */
          min-height: 48px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .form-select:focus {
          outline: none;
          border-color: var(--border-accent);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .quiz-info {
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          text-align: center;
        }

        .info-title {
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: var(--spacing-md);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-align: center;
        }

        .start-quiz-btn {
          margin-top: var(--spacing-lg);
          background: var(--accent-gradient);
          border: none;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
          width: 100%;
          min-height: 56px;
        }

        .start-quiz-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .start-quiz-btn:disabled {
          opacity: 0.7;
          transform: none;
        }

        /* Mobile Header */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
          margin-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-secondary);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.875rem;
          min-height: 44px;
        }

        .back-button:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .mobile-score {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: var(--accent-gradient);
          color: var(--text-primary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.875rem;
        }

        /* Enhanced Game Screen */
        .quiz-game {
          max-width: 900px;
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
          box-shadow: var(--shadow-md);
        }

        .quiz-progress {
          flex: 1;
          min-width: 0;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
          gap: var(--spacing-sm);
        }

        .question-number {
          font-weight: 700;
          color: var(--text-primary);
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          white-space: nowrap;
        }

        .quiz-meta {
          font-size: clamp(0.75rem, 2vw, 0.9rem);
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .progress-bar {
          height: 10px;
          background: var(--bg-tertiary);
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid var(--border-secondary);
        }

        .progress-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 5px;
          transition: width var(--transition-normal);
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .current-score {
          background: var(--accent-gradient);
          color: var(--text-primary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 700;
          margin-left: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-shrink: 0;
          font-size: 0.875rem;
        }

        /* Enhanced Question Card */
        .question-card {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-lg);
          margin-bottom: var(--spacing-lg);
        }

        .question-header {
          margin-bottom: var(--spacing-lg);
        }

        .question-text {
          color: var(--text-primary);
          font-size: clamp(1.1rem, 3vw, 1.25rem);
          line-height: 1.6;
          margin: 0;
          font-weight: 600;
        }

        .question-code {
          margin: var(--spacing-lg) 0;
        }

        /* Enhanced Answer Options */
        .answer-options {
          margin: var(--spacing-xl) 0;
          display: grid;
          gap: var(--spacing-md);
        }

        .answer-option {
          background: var(--bg-tertiary);
          border: 2px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          min-height: 60px;
          /* Mobile touch optimization */
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .answer-option:hover:not(:disabled) {
          border-color: var(--border-accent);
          background: var(--bg-secondary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .answer-option:active {
          transform: translateY(0);
        }

        .answer-option.selected {
          border-color: var(--text-accent);
          background: rgba(102, 126, 234, 0.15);
          box-shadow: var(--shadow-md);
        }

        .answer-option.selected::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-gradient);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }

        .answer-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
          min-width: 0;
        }

        .option-letter {
          width: 2.5rem;
          height: 2.5rem;
          background: var(--bg-primary);
          color: var(--text-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          font-size: 1.1rem;
          border: 2px solid var(--border-secondary);
          transition: all var(--transition-fast);
        }

        .answer-option.selected .option-letter {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border-color: var(--text-accent);
          transform: scale(1.1);
        }

        .option-text {
          color: var(--text-primary);
          font-size: clamp(0.875rem, 2.5vw, 1rem);
          line-height: 1.5;
          word-wrap: break-word;
          hyphens: auto;
        }

        .selection-indicator {
          color: var(--text-accent);
          flex-shrink: 0;
          margin-left: var(--spacing-sm);
          animation: scaleIn 0.2s ease-out;
        }

        /* Question Actions */
        .question-actions {
          text-align: center;
          margin-top: var(--spacing-xl);
        }

        .submit-btn {
          min-height: 56px;
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: 1rem;
          font-weight: 600;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          transform: none;
        }

        .mobile-selection-hint {
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: var(--radius-md);
          color: var(--text-accent);
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Enhanced Feedback Screen */
        .quiz-feedback {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          padding: var(--spacing-lg) 0;
        }

        .feedback-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          max-width: 700px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-xl);
          backdrop-filter: blur(20px);
        }

        .feedback-header {
          margin-bottom: var(--spacing-xl);
        }

        .feedback-icon {
          margin-bottom: var(--spacing-md);
          animation: bounceIn 0.6s ease-out;
        }

        .feedback-icon.correct {
          color: #48bb78;
        }

        .feedback-icon.incorrect {
          color: #f56565;
        }

        .feedback-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          margin: 0 0 var(--spacing-sm);
          font-weight: 700;
        }

        .feedback-title.correct {
          color: #48bb78;
        }

        .feedback-title.incorrect {
          color: #f56565;
        }

        .feedback-message {
          color: var(--text-secondary);
          font-size: 1rem;
          margin: 0;
          line-height: 1.6;
        }

        .feedback-details {
          text-align: left;
          margin-bottom: var(--spacing-xl);
        }

        .answer-comparison {
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
          border: 1px solid var(--border-secondary);
        }

        .comparison-title {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          text-align: center;
        }

        .answer-grid {
          display: grid;
          gap: var(--spacing-sm);
        }

        .answer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
        }

        .answer-label {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.875rem;
        }

        .answer-value {
          font-weight: 700;
          font-size: 1.1rem;
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-md);
        }

        .answer-value.correct {
          color: #48bb78;
          background: rgba(72, 187, 120, 0.15);
          border: 1px solid rgba(72, 187, 120, 0.3);
        }

        .answer-value.incorrect {
          color: #f56565;
          background: rgba(245, 101, 101, 0.15);
          border: 1px solid rgba(245, 101, 101, 0.3);
        }

        .explanation-section {
          margin-bottom: var(--spacing-lg);
        }

        .explanation-title {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .explanation-icon {
          font-size: 1.2rem;
        }

        .explanation-text {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border-left: 4px solid var(--border-accent);
          border: 1px solid var(--border-secondary);
        }

        .score-update {
          display: flex;
          justify-content: center;
          margin-top: var(--spacing-lg);
        }

        .score-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: var(--accent-gradient);
          color: var(--text-primary);
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-lg);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .feedback-actions {
          display: flex;
          justify-content: center;
        }

        .continue-btn {
          min-height: 56px;
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: 1rem;
          font-weight: 600;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
        }

        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Enhanced Completion Screen */
        .quiz-completed {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          padding: var(--spacing-lg) 0;
        }

        .completion-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          max-width: 700px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-xl);
          backdrop-filter: blur(20px);
        }

        .completion-header {
          margin-bottom: var(--spacing-xl);
        }

        .completion-icon {
          margin-bottom: var(--spacing-md);
        }

        .performance-emoji {
          font-size: clamp(3rem, 8vw, 4rem);
          animation: bounce 1s ease-in-out;
        }

        .completion-header h1 {
          font-size: clamp(1.75rem, 5vw, 2.25rem);
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .completion-message {
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .results-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .results-title {
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-lg);
        }

        .result-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: center;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
          transition: all var(--transition-fast);
        }

        .result-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .result-item.primary {
          background: rgba(102, 126, 234, 0.1);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .result-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .result-value {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 700;
          color: var(--text-primary);
        }

        .performance-success { color: #48bb78; }
        .performance-primary { color: #667eea; }
        .performance-warning { color: #ed8936; }
        .performance-error { color: #f56565; }

        .completion-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .retry-btn,
        .home-btn {
          min-height: 56px;
          padding: var(--spacing-md) var(--spacing-lg);
          font-size: 1rem;
          font-weight: 600;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .retry-btn:hover,
        .home-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .quiz-page {
            padding: var(--spacing-sm) 0;
          }

          .quiz-container {
            padding: 0 var(--spacing-sm);
          }

          /* Setup Screen Mobile */
          .quiz-setup {
            min-height: calc(100vh - 80px);
            padding: var(--spacing-md) 0;
          }

          .setup-content {
            padding: var(--spacing-lg);
            margin: 0;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .info-item {
            flex-direction: row;
            justify-content: center;
            gap: var(--spacing-sm);
          }

          /* Game Screen Mobile */
          .quiz-header {
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-md);
          }

          .progress-info {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }

          .current-score {
            margin-left: 0;
            margin-top: var(--spacing-sm);
            align-self: flex-end;
          }

          .question-card {
            padding: var(--spacing-lg);
          }

          .answer-option {
            padding: var(--spacing-md);
            min-height: 56px;
          }

          .option-letter {
            width: 2.2rem;
            height: 2.2rem;
            font-size: 1rem;
          }

          /* Feedback Screen Mobile */
          .quiz-feedback {
            min-height: calc(100vh - 80px);
            padding: var(--spacing-md) 0;
          }

          .feedback-content {
            padding: var(--spacing-lg);
            margin: 0;
          }

          .answer-comparison {
            padding: var(--spacing-md);
          }

          .explanation-text {
            padding: var(--spacing-md);
            font-size: 0.9rem;
          }

          /* Completion Screen Mobile */
          .quiz-completed {
            min-height: calc(100vh - 80px);
            padding: var(--spacing-md) 0;
          }

          .completion-content {
            padding: var(--spacing-lg);
            margin: 0;
          }

          .results-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
          }

          .completion-actions {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .retry-btn,
          .home-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .quiz-container {
            padding: 0 var(--spacing-xs);
          }

          .setup-content,
          .feedback-content,
          .completion-content {
            padding: var(--spacing-md);
          }

          .question-card {
            padding: var(--spacing-md);
          }

          .answer-option {
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .option-content {
            gap: var(--spacing-sm);
          }

          .option-letter {
            width: 2rem;
            height: 2rem;
            font-size: 0.9rem;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .mobile-header {
            padding: var(--spacing-sm) 0;
          }

          .back-button {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: 0.8rem;
          }

          .mobile-score {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: 0.8rem;
          }
        }

        /* Landscape Mobile Optimizations */
        @media (max-width: 768px) and (orientation: landscape) {
          .quiz-setup,
          .quiz-feedback,
          .quiz-completed {
            min-height: 100vh;
            padding: var(--spacing-sm) 0;
          }

          .setup-content,
          .feedback-content,
          .completion-content {
            max-height: 90vh;
            overflow-y: auto;
          }

          .question-card {
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }

          .info-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .results-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Tablet Optimizations */
        @media (min-width: 481px) and (max-width: 768px) {
          .quiz-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0 var(--spacing-md);
          }

          .results-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .completion-actions {
            flex-direction: row;
          }
        }

        /* Desktop Enhancements */
        @media (min-width: 769px) {
          .quiz-container {
            max-width: 1000px;
          }

          .mobile-header {
            display: none;
          }

          .mobile-selection-hint {
            display: none;
          }

          .answer-option {
            padding: var(--spacing-lg) var(--spacing-xl);
          }

          .question-card {
            padding: var(--spacing-2xl);
          }

          .setup-content,
          .feedback-content,
          .completion-content {
            padding: var(--spacing-2xl);
          }
        }

        /* Accessibility Improvements */
        @media (prefers-reduced-motion: reduce) {
          .setup-icon,
          .feedback-icon,
          .completion-icon,
          .progress-fill::after,
          .selection-indicator,
          .result-item {
            animation: none;
          }

          .answer-option:hover,
          .start-quiz-btn:hover,
          .submit-btn:hover,
          .continue-btn:hover,
          .retry-btn:hover,
          .home-btn:hover {
            transform: none;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .answer-option,
          .setup-content,
          .question-card,
          .feedback-content,
          .completion-content {
            border-width: 2px;
          }

          .answer-option.selected {
            border-width: 3px;
          }
        }

        /* Print Styles */
        @media print {
          .quiz-page {
            background: white;
            color: black;
          }

          .mobile-header,
          .mobile-selection-hint,
          .question-actions,
          .feedback-actions,
          .completion-actions {
            display: none;
          }

          .setup-content,
          .question-card,
          .feedback-content,
          .completion-content {
            background: white;
            color: black;
            border: 2px solid black;
            box-shadow: none;
          }

          .quiz-header {
            border: 1px solid black;
          }
        }

        /* Focus Management */
        .answer-option:focus {
          outline: 2px solid var(--border-accent);
          outline-offset: 2px;
        }

        .form-select:focus,
        .start-quiz-btn:focus,
        .submit-btn:focus,
        .continue-btn:focus,
        .retry-btn:focus,
        .home-btn:focus,
        .back-button:focus {
          outline: 2px solid var(--border-accent);
          outline-offset: 2px;
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .answer-option:hover {
            transform: none;
            box-shadow: none;
          }

          .answer-option:active {
            background: var(--bg-secondary);
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

export default Quiz;