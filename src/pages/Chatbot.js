import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Lightbulb, RefreshCw } from 'lucide-react';
import LoadingSpinner, { LoadingDots } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CodeBlock from '../components/chatbot/CodeBlock';
import { ChatbotService, validateQuestion, getConfidenceDisplay } from '../services/chatbotService';
import { formatResponseTime } from '../utils/helpers';

const Chatbot = ({ userPreferences, onPreferencesChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomFact, setRandomFact] = useState(null);
  const [loadingFact, setLoadingFact] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add welcome message on first load
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'assistant',
        content: {
          summary: 'Welcome to Programming Assistant!',
          fullAnswer: 'Hello! I\'m your AI programming assistant. I can help you with coding questions across multiple languages including Kotlin, Java, Python, JavaScript, and more. Ask me anything about programming concepts, best practices, or specific implementation details!',
          sections: [],
          codeExamples: [],
          confidence: 'HIGH',
          contextDocumentCount: 0,
          responseTimeMs: 0
        },
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateQuestion(input);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: validation.question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await ChatbotService.askQuestion(validation.question);
      
      if (response.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.data,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomFact = async () => {
    setLoadingFact(true);
    try {
      const response = await ChatbotService.getRandomFact(userPreferences.language);
      if (response.success) {
        setRandomFact(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to generate random fact. Please try again.');
    } finally {
      setLoadingFact(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'assistant',
        content: {
          summary: 'Chat cleared!',
          fullAnswer: 'Chat history has been cleared. How can I help you today?',
          sections: [],
          codeExamples: [],
          confidence: 'HIGH',
          contextDocumentCount: 0,
          responseTimeMs: 0
        },
        timestamp: new Date()
      }
    ]);
    setError(null);
    setRandomFact(null);
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="message user-message">
          <div className="message-avatar">
            <User size={20} />
          </div>
          <div className="message-content">
            <div className="message-text">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    }

    const confidence = getConfidenceDisplay(message.content.confidence);
    
    return (
      <div key={message.id} className="message assistant-message">
        <div className="message-avatar">
          <Bot size={20} />
        </div>
        <div className="message-content">
          <div className="message-header">
            <span className="message-title">AI Assistant</span>
            <div className="message-meta">
              <span className={`confidence-badge badge-${confidence.color}`}>
                {confidence.text} Confidence
              </span>
              {message.content.responseTimeMs > 0 && (
                <span className="response-time">
                  {formatResponseTime(message.content.responseTimeMs)}
                </span>
              )}
            </div>
          </div>
          
          <div className="message-text">
            {message.content.summary && (
              <div className="message-summary">{message.content.summary}</div>
            )}
            
            <div className="message-body">
              {message.content.fullAnswer}
            </div>
            
            {message.content.codeExamples?.map((codeExample, index) => (
              <CodeBlock
                key={index}
                code={codeExample.code}
                language={codeExample.language}
                description={codeExample.description}
                filename={codeExample.filename}
              />
            ))}
          </div>
          
          <div className="message-timestamp">
            {message.timestamp.toLocaleTimeString()}
            {message.content.contextDocumentCount > 0 && (
              <span className="context-info">
                • {message.content.contextDocumentCount} docs referenced
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chatbot-page">
      <div className="container">
        <div className="chatbot-layout">
          {/* Sidebar */}
          <div className="chatbot-sidebar">
            <div className="sidebar-header">
              <h3>Programming Assistant</h3>
              <p>Ask me anything about coding!</p>
            </div>
            
            <div className="sidebar-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleRandomFact}
                disabled={loadingFact}
              >
                <Lightbulb size={16} />
                {loadingFact ? 'Loading...' : 'Random Fact'}
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={clearChat}
              >
                <RefreshCw size={16} />
                Clear Chat
              </button>
            </div>

            {randomFact && (
              <div className="random-fact">
                <h4>💡 Did you know?</h4>
                <p>{randomFact.fact}</p>
                <div className="fact-meta">
                  <span className="fact-language">{randomFact.language}</span>
                  <span className="fact-category">{randomFact.category}</span>
                </div>
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="chatbot-main">
            <div className="chat-messages">
              {messages.map(renderMessage)}
              
              {isLoading && (
                <div className="message assistant-message">
                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      <LoadingDots size="medium" />
                      <span style={{ marginLeft: '8px' }}>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <ErrorMessage
                message={error}
                onDismiss={() => setError(null)}
                className="chat-error"
              />
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="chat-input-form">
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a programming question..."
                  className="chat-input"
                  disabled={isLoading}
                  maxLength={1000}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="input-meta">
                <span className="char-count">{input.length}/1000</span>
                <span className="input-hint">
                  Press Enter to send, Shift+Enter for new line
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatbot-page {
          min-height: calc(100vh - 140px);
          padding: var(--spacing-lg) 0;
        }

        .chatbot-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--spacing-lg);
          height: calc(100vh - 200px);
          max-height: 800px;
        }

        .chatbot-sidebar {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .sidebar-header h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .sidebar-header p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        .sidebar-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .random-fact {
          background: var(--bg-tertiary);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
        }

        .random-fact h4 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          font-size: 0.9rem;
        }

        .random-fact p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: var(--spacing-sm);
        }

        .fact-meta {
          display: flex;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        }

        .fact-language,
        .fact-category {
          background: var(--bg-primary);
          color: var(--text-accent);
          padding: 2px var(--spacing-xs);
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          border: 1px solid var(--border-secondary);
        }

        .chatbot-main {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .message {
          display: flex;
          gap: var(--spacing-md);
          align-items: flex-start;
        }

        .message-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-message .message-avatar {
          background: var(--accent-gradient);
          color: var(--text-primary);
        }

        .assistant-message .message-avatar {
          background: var(--bg-tertiary);
          color: var(--text-accent);
          border: 1px solid var(--border-secondary);
        }

        .message-content {
          flex: 1;
          max-width: calc(100% - 3.5rem);
        }

        .message-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-xs);
        }

        .message-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .confidence-badge {
          padding: 2px var(--spacing-xs);
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .badge-success { 
          background: rgba(72, 187, 120, 0.2);
          color: #9ae6b4;
        }
        .badge-primary { 
          background: rgba(102, 126, 234, 0.2);
          color: #a5b4fc;
        }
        .badge-warning { 
          background: rgba(237, 137, 54, 0.2);
          color: #fbb6ce;
        }
        .badge-error { 
          background: rgba(245, 101, 101, 0.2);
          color: #fc8181;
        }

        .response-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .message-text {
          background: var(--bg-tertiary);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
          line-height: 1.6;
        }

        .user-message .message-text {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border: none;
        }

        .message-summary {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--border-secondary);
        }

        .message-body {
          color: var(--text-secondary);
          white-space: pre-wrap;
        }

        .message-timestamp {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }

        .context-info {
          font-style: italic;
        }

        .chat-error {
          margin: 0 var(--spacing-lg);
        }

        .chat-input-form {
          border-top: 1px solid var(--border-secondary);
          padding: var(--spacing-lg);
        }

        .input-container {
          display: flex;
          gap: var(--spacing-sm);
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          background: var(--bg-input);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          color: var(--text-primary);
          font-size: 0.9rem;
          resize: none;
          max-height: 120px;
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--border-accent);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border: none;
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 3rem;
          height: 3rem;
        }

        .send-button:hover:not(:disabled) {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-sm);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .chatbot-layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
            height: calc(100vh - 160px);
          }

          .chatbot-sidebar {
            padding: var(--spacing-md);
            order: 2;
            height: auto;
            max-height: 200px;
            overflow-y: auto;
          }

          .chatbot-main {
            order: 1;
            height: 500px;
          }

          .sidebar-actions {
            flex-direction: row;
          }

          .input-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;