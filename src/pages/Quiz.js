import React, { useState, useEffect } from 'react';
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
  Award
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CodeBlock from '../components/chatbot/CodeBlock';
import { QuizService, getLanguageDisplayName, getDifficultyDisplay, getPerformanceLevel } from '../services/quizService';
import { PROGRAMMING_LANGUAGES } from '../utils/constants';

const Quiz = ({ userPreferences, onPreferencesChange }) => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, feedback, completed
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(userPreferences.language || 'python');
  const [selectedDifficulty, setSelectedDifficulty] = useState(userPreferences.difficulty || 'beginner');
  const [sessionSummary, setSessionSummary] = useState(null);

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
        
        // Set answer feedback
        setAnswerFeedback({
          correct: data.correct,
          message: data.message,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
          selectedAnswer: selectedAnswer
        });

        // Update session data with new score
        setSessionData(prev => ({
          ...prev,
          score: data.currentScore
        }));

        // Move to feedback state
        setGameState('feedback');

        // Store next question or summary for later use
        if (data.hasNextQuestion) {
          setCurrentQuestion(data.nextQuestion);
        } else {
          setSessionSummary(data.sessionSummary);
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
      // Quiz completed
      setGameState('completed');
    } else {
      // Move to next question
      setSelectedAnswer('');
      setAnswerFeedback(null);
      setGameState('playing');
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
  };

  const renderSetupScreen = () => (
    <div className="quiz-setup">
      <div className="setup-content">
        <div className="setup-header">
          <div className="setup-icon">
            <Target size={48} />
          </div>
          <h1>Programming Quiz Challenge</h1>
          <p>Test your programming knowledge with AI-generated questions</p>
        </div>

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
            <div className="info-grid">
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
        <div className="current-score">
          <Trophy size={16} />
          <span>{sessionData.score}/{sessionData.totalQuestions}</span>
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <h2 className="question-text">{currentQuestion.question}</h2>
        </div>
        
        {currentQuestion.codeSnippet && (
          <div className="question-code">
            <CodeBlock
              code={currentQuestion.codeSnippet}
              language={sessionData.language}
              showLineNumbers={true}
              maxHeight="300px"
              description="Code to analyze"
            />
          </div>
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
            className="btn btn-primary btn-lg"
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

  const renderFeedbackScreen = () => (
    <div className="quiz-feedback">
      <div className="feedback-content">
        <div className="feedback-header">
          <div className={`feedback-icon ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
            {answerFeedback.correct ? (
              <CheckCircle size={48} />
            ) : (
              <XCircle size={48} />
            )}
          </div>
          <h2 className={`feedback-title ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
            {answerFeedback.correct ? 'Correct!' : 'Incorrect'}
          </h2>
        </div>

        <div className="feedback-details">
          <div className="answer-comparison">
            <div className="answer-item">
              <span className="answer-label">Your Answer:</span>
              <span className={`answer-value ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
                {answerFeedback.selectedAnswer}
              </span>
            </div>
            {!answerFeedback.correct && (
              <div className="answer-item">
                <span className="answer-label">Correct Answer:</span>
                <span className="answer-value correct">
                  {answerFeedback.correctAnswer}
                </span>
              </div>
            )}
          </div>

          <div className="explanation-section">
            <h3>Explanation</h3>
            <p className="explanation-text">{answerFeedback.explanation}</p>
          </div>

          <div className="score-update">
            <div className="score-item">
              <Award size={20} />
              <span>Current Score: {sessionData.score}/{sessionData.totalQuestions}</span>
            </div>
          </div>
        </div>

        <div className="feedback-actions">
          <button
            onClick={proceedToNext}
            className="btn btn-primary btn-lg"
          >
            {sessionSummary ? (
              <>
                <Trophy size={20} />
                View Results
              </>
            ) : (
              <>
                <ArrowRight size={20} />
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
              {performance.emoji}
            </div>
            <h1>Quiz Completed!</h1>
            <p className="completion-message">{sessionSummary.message}</p>
          </div>

          <div className="results-card">
            <div className="results-grid">
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
        {gameState === 'feedback' && answerFeedback && renderFeedbackScreen()}
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

        /* Setup Screen Enhanced */
        .quiz-setup {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .setup-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-xl);
          backdrop-filter: blur(20px);
        }

        .setup-header {
          margin-bottom: var(--spacing-xl);
        }

        .setup-icon {
          color: var(--text-accent);
          margin-bottom: var(--spacing-md);
          animation: pulse 2s infinite;
        }

        .setup-header h1 {
          font-size: 2.25rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .setup-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .setup-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          text-align: left;
        }

        .label-icon {
          margin-right: var(--spacing-xs);
        }

        .quiz-info {
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-align: center;
        }

        .start-quiz-btn {
          margin-top: var(--spacing-md);
          background: var(--accent-gradient);
          border: none;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-normal);
        }

        .start-quiz-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }

        /* Game Screen Enhanced */
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
          font-size: 1.1rem;
        }

        .quiz-meta {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .progress-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 4px;
          transition: width var(--transition-normal);
        }

        .current-score {
          background: var(--accent-gradient);
          color: var(--text-primary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 600;
          margin-left: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .question-card {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-lg);
        }

        .question-header {
          margin-bottom: var(--spacing-lg);
        }

        .question-text {
          color: var(--text-primary);
          font-size: 1.25rem;
          line-height: 1.6;
          margin: 0;
        }

        .question-code {
          margin: var(--spacing-lg) 0;
        }

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
        }

        .answer-option:hover {
          border-color: var(--border-accent);
          background: var(--bg-secondary);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .answer-option.selected {
          border-color: var(--text-accent);
          background: rgba(102, 126, 234, 0.15);
          box-shadow: var(--shadow-md);
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
        }

        .answer-option.selected .option-letter {
          background: var(--accent-gradient);
          color: var(--text-primary);
        }

        .option-text {
          color: var(--text-primary);
          font-size: 1rem;
          line-height: 1.5;
        }

        .question-actions {
          text-align: center;
          margin-top: var(--spacing-xl);
        }

        /* Feedback Screen */
        .quiz-feedback {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .feedback-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          max-width: 700px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-xl);
        }

        .feedback-header {
          margin-bottom: var(--spacing-xl);
        }

        .feedback-icon {
          margin-bottom: var(--spacing-md);
        }

        .feedback-icon.correct {
          color: #48bb78;
        }

        .feedback-icon.incorrect {
          color: #f56565;
        }

        .feedback-title {
          font-size: 2rem;
          margin: 0;
          font-weight: 700;
        }

        .feedback-title.correct {
          color: #48bb78;
        }

        .feedback-title.incorrect {
          color: #f56565;
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
        }

        .answer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .answer-item:last-child {
          margin-bottom: 0;
        }

        .answer-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .answer-value {
          font-weight: 700;
          font-size: 1.1rem;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
        }

        .answer-value.correct {
          color: #48bb78;
          background: rgba(72, 187, 120, 0.1);
        }

        .answer-value.incorrect {
          color: #f56565;
          background: rgba(245, 101, 101, 0.1);
        }

        .explanation-section h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .explanation-text {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1rem;
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border-left: 4px solid var(--border-accent);
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
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-md);
          font-weight: 600;
        }

        /* Completed Screen Enhanced */
        .quiz-completed {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .completion-content {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          max-width: 700px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-xl);
        }

        .completion-header {
          margin-bottom: var(--spacing-xl);
        }

        .completion-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
          animation: bounce 1s ease-in-out;
        }

        .completion-header h1 {
          font-size: 2.25rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
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
          font-weight: 500;
        }

        .result-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .performance-success { color: #48bb78; }
        .performance-primary { color: #667eea; }
        .performance-warning { color: #ed8936; }
        .performance-error { color: #f56565; }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .quiz-header {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .current-score {
            margin-left: 0;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .results-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .setup-content,
          .feedback-content,
          .completion-content {
            padding: var(--spacing-xl);
            margin: 0 var(--spacing-md);
          }

          .question-card {
            padding: var(--spacing-lg);
          }

          .answer-option {
            padding: var(--spacing-md);
          }

          .option-letter {
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
          }

          .setup-header h1 {
            font-size: 2rem;
          }

          .feedback-title,
          .completion-header h1 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .quiz-page {
            padding: var(--spacing-md) 0;
          }

          .question-text {
            font-size: 1.1rem;
          }

          .option-text {
            font-size: 0.9rem;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .setup-content,
          .feedback-content,
          .completion-content {
            padding: var(--spacing-lg);
          }

          .completion-icon {
            font-size: 3rem;
          }

          .answer-comparison {
            padding: var(--spacing-md);
          }

          .explanation-text {
            padding: var(--spacing-md);
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Quiz;