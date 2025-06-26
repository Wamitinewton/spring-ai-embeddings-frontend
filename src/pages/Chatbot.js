import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Lightbulb, RefreshCw, Copy, CheckCircle, Book, Code } from 'lucide-react';
import LoadingSpinner, { LoadingDots } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CodeBlock from '../components/chatbot/CodeBlock';
import { ChatbotService, validateQuestion, getConfidenceDisplay } from '../services/chatbotService';
import { formatResponseTime, copyToClipboard } from '../utils/helpers';

const Chatbot = ({ userPreferences, onPreferencesChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomFact, setRandomFact] = useState(null);
  const [loadingFact, setLoadingFact] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
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
          sections: [
            {
              title: 'What I can help with',
              content: '• Code debugging and optimization\n• Language syntax and features\n• Best practices and design patterns\n• Algorithm explanations\n• Framework and library usage',
              type: 'explanation',
              hasCode: false
            }
          ],
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

  const copyMessageContent = async (messageId, content) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="message user-message">
          <div className="message-avatar">
            <User size={20} />
          </div>
          <div className="message-content">
            <div className="message-text user-text">{message.content}</div>
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
            <div className="message-title-section">
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
            <button
              className="copy-btn"
              onClick={() => copyMessageContent(message.id, message.content.fullAnswer)}
              title="Copy response"
            >
              {copiedMessageId === message.id ? (
                <CheckCircle size={16} />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
          
          <div className="message-text">
            {message.content.summary && (
              <div className="message-summary">
                <h4>Summary</h4>
                <p>{message.content.summary}</p>
              </div>
            )}
            
            <div className="message-body">
              {message.content.fullAnswer}
            </div>
            
            {/* Render sections if available */}
            {message.content.sections && message.content.sections.length > 0 && (
              <div className="message-sections">
                <h4 className="sections-title">
                  <Book size={16} />
                  Detailed Breakdown
                </h4>
                {message.content.sections.map((section, index) => (
                  <div key={index} className="content-section">
                    <h5 className="section-title">{section.title}</h5>
                    <div className="section-content">
                      {section.content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                    </div>
                    {section.hasCode && (
                      <div className="section-indicator">
                        <Code size={14} />
                        <span>Contains code examples</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Render code examples */}
            {message.content.codeExamples && message.content.codeExamples.length > 0 && (
              <div className="message-code-examples">
                <h4 className="code-examples-title">
                  <Code size={16} />
                  Code Examples
                </h4>
                {message.content.codeExamples.map((codeExample, index) => (
                  <CodeBlock
                    key={index}
                    code={codeExample.code}
                    language={codeExample.language}
                    description={codeExample.description}
                    filename={codeExample.filename}
                    allowDownload={true}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="message-footer">
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
              <div className="sidebar-icon">
                <Bot size={24} />
              </div>
              <h3>Programming Assistant</h3>
              <p>Ask me anything about coding!</p>
            </div>
            
            <div className="sidebar-actions">
              <button 
                className="btn btn-secondary sidebar-btn"
                onClick={handleRandomFact}
                disabled={loadingFact}
              >
                <Lightbulb size={16} />
                {loadingFact ? 'Loading...' : 'Random Fact'}
              </button>
              
              <button 
                className="btn btn-secondary sidebar-btn"
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

            {/* Quick tips */}
            <div className="sidebar-tips">
              <h4>💡 Quick Tips</h4>
              <ul>
                <li>Be specific about your programming language</li>
                <li>Include code snippets when asking for debugging help</li>
                <li>Ask about best practices and optimization</li>
                <li>Request examples for better understanding</li>
              </ul>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="chatbot-main">
            <div className="chat-header">
              <div className="chat-title">
                <Bot size={20} />
                <span>AI Programming Assistant</span>
              </div>
              <div className="chat-status">
                <div className="status-dot"></div>
                <span>Online</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map(renderMessage)}
              
              {isLoading && (
                <div className="message assistant-message loading-message">
                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      <div className="typing-indicator">
                        <LoadingDots size="medium" />
                        <span>AI is thinking...</span>
                      </div>
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
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a programming question... (e.g., 'How do I implement a binary search in Python?')"
                  className="chat-input"
                  disabled={isLoading}
                  maxLength={1000}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
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
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
        }

        .chatbot-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: var(--spacing-lg);
          height: calc(100vh - 200px);
          max-height: 900px;
        }

        /* Enhanced Sidebar */
        .chatbot-sidebar {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
        }

        .sidebar-header {
          text-align: center;
          border-bottom: 1px solid var(--border-secondary);
          padding-bottom: var(--spacing-lg);
        }

        .sidebar-icon {
          color: var(--text-accent);
          margin-bottom: var(--spacing-sm);
        }

        .sidebar-header h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
          font-size: 1.1rem;
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

        .sidebar-btn {
          width: 100%;
          justify-content: center;
        }

        .random-fact {
          background: var(--bg-tertiary);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          border-left: 4px solid var(--border-accent);
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

        .sidebar-tips {
          background: rgba(102, 126, 234, 0.05);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .sidebar-tips h4 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          font-size: 0.9rem;
        }

        .sidebar-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-tips li {
          color: var(--text-secondary);
          font-size: 0.8rem;
          line-height: 1.4;
          margin-bottom: var(--spacing-xs);
          padding-left: var(--spacing-sm);
          position: relative;
        }

        .sidebar-tips li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--text-accent);
        }

        /* Enhanced Main Chat */
        .chatbot-main {
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
        }

        .chat-header {
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-secondary);
          padding: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-primary);
          font-weight: 600;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #48bb78;
          animation: pulse 2s infinite;
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
          max-width: 85%;
        }

        .user-message {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .assistant-message {
          align-self: flex-start;
        }

        .loading-message {
          opacity: 0.8;
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
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--spacing-sm);
        }

        .message-title-section {
          flex: 1;
        }

        .message-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .confidence-badge {
          padding: 2px var(--spacing-xs);
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        .copy-btn {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-muted);
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copy-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .message-text {
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          line-height: 1.6;
        }

        .user-text {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border: none;
        }

        .message-summary {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-secondary);
        }

        .message-summary h4 {
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: var(--spacing-sm);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .message-summary p {
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }

        .message-body {
          color: var(--text-secondary);
          white-space: pre-wrap;
          margin-bottom: var(--spacing-lg);
        }

        .message-sections {
          margin-top: var(--spacing-lg);
          border-top: 1px solid var(--border-secondary);
          padding-top: var(--spacing-lg);
        }

        .sections-title {
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .content-section {
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.1);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .content-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }

        .section-content {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .section-content p {
          margin-bottom: var(--spacing-xs);
        }

        .section-content p:last-child {
          margin-bottom: 0;
        }

        .section-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid rgba(102, 126, 234, 0.2);
          color: var(--text-accent);
          font-size: 0.8rem;
        }

        .message-code-examples {
          margin-top: var(--spacing-lg);
          border-top: 1px solid var(--border-secondary);
          padding-top: var(--spacing-lg);
        }

        .code-examples-title {
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .message-footer {
          margin-top: var(--spacing-sm);
        }

        .message-timestamp {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .context-info {
          font-style: italic;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
        }

        .chat-error {
          margin: 0 var(--spacing-lg);
        }

        /* Enhanced Input Form */
        .chat-input-form {
          border-top: 1px solid var(--border-secondary);
          padding: var(--spacing-lg);
          background: var(--bg-tertiary);
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
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          color: var(--text-primary);
          font-size: 0.9rem;
          resize: none;
          max-height: 120px;
          font-family: inherit;
          transition: all var(--transition-fast);
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
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 3rem;
          height: 3rem;
          box-shadow: var(--shadow-md);
        }

        .send-button:hover:not(:disabled) {
          box-shadow: var(--shadow-lg);
          transform: translateY(-1px);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .input-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-sm);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Enhanced Mobile Responsive Design */
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
            max-height: 300px;
            overflow-y: auto;
          }

          .chatbot-main {
            order: 1;
            height: 500px;
          }

          .sidebar-actions {
            flex-direction: row;
            gap: var(--spacing-sm);
          }

          .sidebar-btn {
            flex: 1;
          }

          .input-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }

          .message {
            max-width: 95%;
          }

          .chat-messages {
            padding: var(--spacing-md);
          }

          .chat-input-form {
            padding: var(--spacing-md);
          }

          .message-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .copy-btn {
            align-self: flex-end;
          }
        }

        @media (max-width: 480px) {
          .chatbot-page {
            padding: var(--spacing-md) 0;
          }

          .chat-header {
            padding: var(--spacing-md);
          }

          .message-text {
            padding: var(--spacing-md);
          }

          .content-section {
            padding: var(--spacing-sm);
          }

          .chat-input {
            font-size: 16px; /* Prevent zoom on iOS */
          }

          .send-button {
            min-width: 2.5rem;
            height: 2.5rem;
          }

          .message-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }

          .sidebar-tips {
            display: none; /* Hide on very small screens */
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;