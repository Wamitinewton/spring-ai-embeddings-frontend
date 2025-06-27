import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Lightbulb, RefreshCw, Copy, CheckCircle, Book, Code, Menu, X, Settings } from 'lucide-react';
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
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  // Close sidebar when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && !event.target.closest('.sidebar-panel') && !event.target.closest('.sidebar-toggle')) {
        setShowSidebar(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && showSidebar) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSidebar]);

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
    setShowSidebar(false); // Close sidebar after sending

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
    setShowSidebar(false);
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
          <div className="message-bubble user-bubble">
            <div className="message-text">{message.content}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="message-avatar user-avatar">
            <User size={18} />
          </div>
        </div>
      );
    }

    const confidence = getConfidenceDisplay(message.content.confidence);
    
    return (
      <div key={message.id} className="message assistant-message">
        <div className="message-avatar assistant-avatar">
          <Bot size={18} />
        </div>
        <div className="message-bubble assistant-bubble">
          <div className="message-header">
            <div className="message-meta">
              <span className="message-sender">AI Assistant</span>
              <div className="message-badges">
                <span className={`confidence-badge ${confidence.color}`}>
                  {confidence.text}
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
          
          <div className="message-content">
            {message.content.summary && (
              <div className="message-summary">
                <strong>{message.content.summary}</strong>
              </div>
            )}
            
            <div className="message-text">
              {message.content.fullAnswer}
            </div>
            
            {/* Render sections if available */}
            {message.content.sections && message.content.sections.length > 0 && (
              <div className="message-sections">
                <div className="sections-header">
                  <Book size={16} />
                  <span>Detailed Breakdown</span>
                </div>
                {message.content.sections.map((section, index) => (
                  <div key={index} className="content-section">
                    <h4 className="section-title">{section.title}</h4>
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
                <div className="code-examples-header">
                  <Code size={16} />
                  <span>Code Examples</span>
                </div>
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
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    <div className="chatbot-fullscreen">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <div className="chat-title">
            <Bot size={24} />
            <div className="title-content">
              <h1>AI Programming Assistant</h1>
              <span className="chat-status">Online • Ready to help</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={clearChat}
            title="Clear chat"
          >
            <RefreshCw size={18} />
          </button>
          <button
            className="header-btn"
            onClick={() => setShowSidebar(!showSidebar)}
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div className="message assistant-message typing-message">
              <div className="message-avatar assistant-avatar">
                <Bot size={18} />
              </div>
              <div className="message-bubble assistant-bubble typing-bubble">
                <div className="typing-indicator">
                  <LoadingDots size="medium" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="error-container">
            <ErrorMessage
              message={error}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {/* Input Form */}
        <div className="chat-input-section">
          <form onSubmit={handleSubmit} className="chat-input-form">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about programming..."
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
                aria-label="Send message"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <div className="input-meta">
              <span className="char-count">{input.length}/1000</span>
              <span className="input-hint">
                Press Enter to send • Shift+Enter for new line
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Sidebar Panel */}
      {showSidebar && (
        <>
          <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
          <div className="sidebar-panel">
            <div className="sidebar-header">
              <h3>Assistant Settings</h3>
              <button
                className="close-sidebar"
                onClick={() => setShowSidebar(false)}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="sidebar-content">
              <div className="sidebar-section">
                <h4>Quick Actions</h4>
                <div className="quick-actions">
                  <button 
                    className="action-btn"
                    onClick={handleRandomFact}
                    disabled={loadingFact}
                  >
                    <Lightbulb size={16} />
                    {loadingFact ? 'Loading...' : 'Random Fact'}
                  </button>
                  
                  <button 
                    className="action-btn"
                    onClick={clearChat}
                  >
                    <RefreshCw size={16} />
                    Clear Chat
                  </button>
                </div>
              </div>

              {randomFact && (
                <div className="sidebar-section">
                  <h4>💡 Programming Fact</h4>
                  <div className="fact-card">
                    <p>{randomFact.fact}</p>
                    <div className="fact-tags">
                      <span className="fact-tag">{randomFact.language}</span>
                      <span className="fact-tag">{randomFact.category}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="sidebar-section">
                <h4>💡 Tips</h4>
                <ul className="tips-list">
                  <li>Be specific about your programming language</li>
                  <li>Include code snippets for debugging help</li>
                  <li>Ask about best practices and optimization</li>
                  <li>Request examples for better understanding</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .chatbot-fullscreen {
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: var(--primary-bg);
          position: relative;
          overflow: hidden;
        }

        /* Chat Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-secondary);
          flex-shrink: 0;
          min-height: 70px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .sidebar-toggle {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-primary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle:hover {
          background: var(--bg-tertiary);
          border-color: var(--border-accent);
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          color: var(--text-accent);
        }

        .title-content h1 {
          color: var(--text-primary);
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin: 0;
          line-height: 1.2;
        }

        .chat-status {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .header-btn {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        /* Chat Container */
        .chat-container {
          flex: 1;
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
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Message Styles */
        .message {
          display: flex;
          gap: var(--spacing-md);
          align-items: flex-start;
          max-width: 80%;
          animation: slideUp 0.3s ease-out;
        }

        .user-message {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .assistant-message {
          align-self: flex-start;
        }

        .typing-message {
          opacity: 0.8;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-avatar {
          background: var(--accent-gradient);
          color: var(--text-primary);
        }

        .assistant-avatar {
          background: var(--bg-tertiary);
          color: var(--text-accent);
          border: 2px solid var(--border-secondary);
        }

        .message-bubble {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-secondary);
          position: relative;
          max-width: 100%;
          word-wrap: break-word;
        }

        .user-bubble {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border: none;
        }

        .typing-bubble {
          background: var(--bg-tertiary);
        }

        .message-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
          gap: var(--spacing-sm);
        }

        .message-meta {
          flex: 1;
        }

        .message-sender {
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .message-badges {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .confidence-badge {
          padding: 2px var(--spacing-xs);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .confidence-badge.success { 
          background: rgba(72, 187, 120, 0.2);
          color: #9ae6b4;
        }
        .confidence-badge.primary { 
          background: rgba(102, 126, 234, 0.2);
          color: #a5b4fc;
        }
        .confidence-badge.warning { 
          background: rgba(237, 137, 54, 0.2);
          color: #fbb6ce;
        }
        .confidence-badge.error { 
          background: rgba(245, 101, 101, 0.2);
          color: #fc8181;
        }

        .response-time {
          font-size: var(--font-size-xs);
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
          min-height: 32px;
          min-width: 32px;
          flex-shrink: 0;
        }

        .copy-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .message-content {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .message-text {
          color: var(--text-secondary);
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .user-bubble .message-text {
          color: var(--text-primary);
        }

        .message-time {
          font-size: var(--font-size-xs);
          color: rgba(255, 255, 255, 0.7);
          margin-top: var(--spacing-sm);
          text-align: right;
        }

        .message-summary {
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
          font-weight: 500;
        }

        .message-sections {
          margin-top: var(--spacing-lg);
          border-top: 1px solid var(--border-secondary);
          padding-top: var(--spacing-lg);
        }

        .sections-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
        }

        .content-section {
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.1);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .section-title {
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }

        .section-content {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
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
          font-size: var(--font-size-xs);
        }

        .message-code-examples {
          margin-top: var(--spacing-lg);
          border-top: 1px solid var(--border-secondary);
          padding-top: var(--spacing-lg);
        }

        .code-examples-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
        }

        .message-footer {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-secondary);
        }

        .message-timestamp {
          font-size: var(--font-size-xs);
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

        .error-container {
          padding: 0 var(--spacing-lg);
          flex-shrink: 0;
        }

        /* Input Section */
        .chat-input-section {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-secondary);
          padding: var(--spacing-lg);
          flex-shrink: 0;
        }

        .chat-input-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .input-wrapper {
          display: flex;
          gap: var(--spacing-sm);
          align-items: flex-end;
          background: var(--bg-input);
          border: 2px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--spacing-sm);
          transition: all var(--transition-fast);
        }

        .input-wrapper:focus-within {
          border-color: var(--border-accent);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 16px; /* Prevent zoom on iOS */
          resize: none;
          max-height: 120px;
          min-height: 44px;
          font-family: inherit;
          line-height: 1.5;
          padding: var(--spacing-sm);
        }

        .chat-input:focus {
          outline: none;
        }

        .chat-input::placeholder {
          color: var(--text-muted);
        }

        .send-button {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--spacing-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          min-height: 48px;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          box-shadow: var(--shadow-md);
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
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Sidebar Panel */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        .sidebar-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 350px;
          height: 100vh;
          height: 100dvh;
          background: var(--bg-card);
          border-left: 1px solid var(--border-secondary);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.3s ease;
          box-shadow: var(--shadow-xl);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--border-secondary);
          background: var(--bg-tertiary);
        }

        .sidebar-header h3 {
          color: var(--text-primary);
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin: 0;
        }

        .close-sidebar {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-sidebar:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
        }

        .sidebar-section {
          margin-bottom: var(--spacing-xl);
        }

        .sidebar-section h4 {
          color: var(--text-primary);
          font-size: var(--font-size-base);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: var(--font-size-sm);
          min-height: 48px;
        }

        .action-btn:hover:not(:disabled) {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-color: var(--border-accent);
          transform: translateY(-1px);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fact-card {
          background: var(--bg-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          border-left: 4px solid var(--border-accent);
        }

        .fact-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-md);
        }

        .fact-tags {
          display: flex;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        }

        .fact-tag {
          background: var(--bg-primary);
          color: var(--text-accent);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          border: 1px solid var(--border-secondary);
          font-weight: 500;
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tips-list li {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          line-height: 1.5;
          margin-bottom: var(--spacing-sm);
          padding-left: var(--spacing-lg);
          position: relative;
        }

        .tips-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--text-accent);
          font-weight: bold;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .chat-header {
            padding: var(--spacing-md);
            min-height: 60px;
          }

          .title-content h1 {
            font-size: var(--font-size-base);
          }

          .chat-status {
            display: none;
          }

          .header-actions .header-btn:last-child {
            display: none;
          }

          .chat-messages {
            padding: var(--spacing-md);
            gap: var(--spacing-md);
          }

          .message {
            max-width: 90%;
          }

          .message-avatar {
            width: 32px;
            height: 32px;
          }

          .message-bubble {
            padding: var(--spacing-md);
          }

          .chat-input-section {
            padding: var(--spacing-md);
          }

          .sidebar-panel {
            width: 100%;
            right: -100%;
            animation: slideInRight 0.3s ease;
          }

          .input-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }
        }

        @media (max-width: 480px) {
          .chat-header {
            padding: var(--spacing-sm);
          }

          .header-left {
            gap: var(--spacing-sm);
          }

          .chat-title {
            gap: var(--spacing-sm);
          }

          .title-content h1 {
            font-size: var(--font-size-sm);
          }

          .chat-messages {
            padding: var(--spacing-sm);
          }

          .message-bubble {
            padding: var(--spacing-sm);
          }

          .message-avatar {
            width: 28px;
            height: 28px;
          }

          .send-button {
            min-width: 44px;
            min-height: 44px;
          }

          .sidebar-content {
            padding: var(--spacing-md);
          }
        }

        /* Landscape Mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .chatbot-fullscreen {
            height: 100vh;
          }

          .chat-header {
            min-height: 50px;
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .chat-messages {
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .chat-input-section {
            padding: var(--spacing-sm) var(--spacing-md);
          }
        }

        /* Desktop Enhancements */
        @media (min-width: 1024px) {
          .chat-messages {
            padding: var(--spacing-2xl);
            gap: var(--spacing-xl);
          }

          .message {
            max-width: 70%;
          }

          .message-bubble {
            padding: var(--spacing-xl);
          }

          .chat-input-section {
            padding: var(--spacing-xl);
          }

          .sidebar-panel {
            width: 400px;
          }
        }

        /* Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .message,
          .sidebar-overlay,
          .sidebar-panel {
            animation: none;
          }

          .send-button:hover:not(:disabled) {
            transform: none;
          }

          .action-btn:hover:not(:disabled) {
            transform: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .message-bubble {
            border-width: 2px;
          }

          .confidence-badge {
            border: 1px solid currentColor;
          }

          .input-wrapper {
            border-width: 3px;
          }
        }

        /* Scrollbar styling */
        .chat-messages::-webkit-scrollbar {
          width: 8px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 4px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 4px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Print styles */
        @media print {
          .chat-header,
          .sidebar-panel,
          .sidebar-overlay,
          .chat-input-section,
          .copy-btn {
            display: none !important;
          }

          .chatbot-fullscreen {
            height: auto;
          }

          .chat-messages {
            overflow: visible;
            height: auto;
          }

          .message-bubble {
            background: white;
            color: black;
            border: 1px solid black;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;