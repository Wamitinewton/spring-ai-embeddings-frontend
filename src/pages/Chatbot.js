import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Lightbulb, RefreshCw, Copy, CheckCircle, Book, Code, Menu, X, Settings, MoreVertical } from 'lucide-react';
import LoadingSpinner, { LoadingDots } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CodeBlock from '../components/chatbot/CodeBlock';
import { ChatbotService, validateQuestion, getConfidenceDisplay } from '../services/chatbotService';
import { formatResponseTime, copyToClipboard, deviceUtils } from '../utils/helpers';

const Chatbot = ({ userPreferences, onPreferencesChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomFact, setRandomFact] = useState(null);
  const [loadingFact, setLoadingFact] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateViewportHeight();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(prev => {
      const newState = !prev;
      
      if (newState && deviceUtils.isMobile()) {
        setTimeout(() => {
          const sidebar = document.querySelector('.sidebar-panel');
          if (sidebar) {
            sidebar.style.transform = 'translateZ(0)';
          }
        }, 10);
      }
      
      return newState;
    });
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const handleResize = () => {
      if (deviceUtils.isMobile()) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;
        const keyboardHeight = Math.max(0, documentHeight - windowHeight);
        setKeyboardHeight(keyboardHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && !event.target.closest('.sidebar-panel') && !event.target.closest('.sidebar-toggle') && !event.target.closest('.header-btn')) {
        setShowSidebar(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showSidebar) setShowSidebar(false);
        if (showQuickActions) setShowQuickActions(false);
      }
    };

    const handleBodyScroll = () => {
      if (showSidebar && deviceUtils.isMobile()) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      document.addEventListener('keydown', handleEscape);
      handleBodyScroll();
    } else {
      handleBodyScroll();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showSidebar, showQuickActions]);

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
    setShowSidebar(false);
    setShowQuickActions(false);

    if (deviceUtils.isMobile() && inputRef.current) {
      inputRef.current.blur();
    }

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

  const handleTouchStart = (e, messageId) => {
    if (deviceUtils.isTouchDevice()) {
      setSwipeStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e, messageId, content) => {
    if (swipeStartX !== null && deviceUtils.isTouchDevice()) {
      const swipeEndX = e.changedTouches[0].clientX;
      const swipeDistance = swipeStartX - swipeEndX;
      
      if (swipeDistance > 50) {
        copyMessageContent(messageId, content);
      }
      
      setSwipeStartX(null);
    }
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    if (deviceUtils.isMobile()) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div 
          key={message.id} 
          className="message user-message"
          onTouchStart={(e) => handleTouchStart(e, message.id)}
          onTouchEnd={(e) => handleTouchEnd(e, message.id, message.content)}
        >
          <div className="message-bubble user-bubble">
            <div className="message-text">{message.content}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="message-avatar user-avatar">
            <User size={16} />
          </div>
          <div className="message-actions mobile-actions">
            <button
              className="action-btn copy-action"
              onClick={() => copyMessageContent(message.id, message.content)}
              title="Copy message"
            >
              {copiedMessageId === message.id ? <CheckCircle size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      );
    }

    const confidence = getConfidenceDisplay(message.content.confidence);
    
    return (
      <div 
        key={message.id} 
        className="message assistant-message"
        onTouchStart={(e) => handleTouchStart(e, message.id)}
        onTouchEnd={(e) => handleTouchEnd(e, message.id, message.content.fullAnswer)}
      >
        <div className="message-avatar assistant-avatar">
          <Bot size={16} />
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
            <div className="message-actions">
              <button
                className="action-btn copy-action"
                onClick={() => copyMessageContent(message.id, message.content.fullAnswer)}
                title="Copy response"
              >
                {copiedMessageId === message.id ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
              <button
                className="action-btn more-action"
                onClick={() => setShowQuickActions(!showQuickActions)}
                title="More actions"
              >
                <MoreVertical size={14} />
              </button>
            </div>
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
                  <Book size={14} />
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
                        <Code size={12} />
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
                  <Code size={14} />
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
    <div 
      className="chatbot-fullscreen"
      style={{ 
        '--keyboard-height': `${keyboardHeight}px`,
        '--input-focused': inputFocused ? '1' : '0',
        '--viewport-height': `${viewportHeight}px`
      }}
    >
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
          <div className="chat-title">
            <Bot size={20} />
            <div className="title-content">
              <h1>AI Assistant</h1>
              <span className="chat-status">Online • Ready to help</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="header-btn desktop-only"
            onClick={clearChat}
            title="Clear chat"
          >
            <RefreshCw size={16} />
          </button>
          <button
            className="header-btn"
            onClick={toggleSidebar}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container" ref={chatContainerRef}>
        <div className="chat-messages" ref={messagesContainerRef}>
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div className="message assistant-message typing-message">
              <div className="message-avatar assistant-avatar">
                <Bot size={16} />
              </div>
              <div className="message-bubble assistant-bubble typing-bubble">
                <div className="typing-indicator">
                  <LoadingDots size="small" />
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
        <div className={`chat-input-section ${inputFocused ? 'focused' : ''}`}>
          <form onSubmit={handleSubmit} className="chat-input-form">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ask me anything about programming..."
                className="chat-input"
                disabled={isLoading}
                maxLength={1000}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !deviceUtils.isMobile()) {
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
                  <Send size={18} />
                )}
              </button>
            </div>
            <div className="input-meta">
              <span className="char-count">{input.length}/1000</span>
              <span className="input-hint mobile-hidden">
                Press Enter to send • Shift+Enter for new line
              </span>
              <span className="input-hint mobile-only">
                Swipe left on messages to copy
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Sidebar Panel */}
      {showSidebar && (
        <>
          <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
          <div className={`sidebar-panel ${showSidebar ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <h3>Assistant Settings</h3>
              <button
                className="close-sidebar"
                onClick={() => setShowSidebar(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
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
                    <Lightbulb size={14} />
                    {loadingFact ? 'Loading...' : 'Random Fact'}
                  </button>
                  
                  <button 
                    className="action-btn"
                    onClick={clearChat}
                  >
                    <RefreshCw size={14} />
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
          height: var(--viewport-height, 100vh);
          display: flex;
          flex-direction: column;
          background: var(--primary-bg);
          position: relative;
          overflow: hidden;
          /* Handle virtual keyboard on mobile */
          padding-bottom: calc(var(--keyboard-height) * var(--input-focused));
          transition: padding-bottom 0.3s ease;
          /* Force hardware acceleration */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        /* Enhanced Chat Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-secondary);
          flex-shrink: 0;
          min-height: 60px;
          position: relative;
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex: 1;
          min-width: 0;
        }

        .sidebar-toggle {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-primary);
          padding: var(--spacing-xs);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 40px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-toggle:hover {
          background: var(--bg-tertiary);
          border-color: var(--border-accent);
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-accent);
          min-width: 0;
          flex: 1;
        }

        .title-content {
          min-width: 0;
          flex: 1;
        }

        .title-content h1 {
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-status {
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-shrink: 0;
        }

        .header-btn {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-xs);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 40px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        /* Enhanced Chat Container */
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          /* Improve scrolling performance on mobile */
          transform: translateZ(0);
          will-change: scroll-position;
        }

        /* Enhanced Message Styles */
        .message {
          display: flex;
          gap: var(--spacing-sm);
          align-items: flex-start;
          max-width: 85%;
          animation: slideUp 0.3s ease-out;
          position: relative;
          /* Touch optimization */
          touch-action: pan-y;
        }

        .user-message {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .assistant-message {
          align-self: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          /* Better touch targets */
          min-width: 32px;
          min-height: 32px;
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
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-secondary);
          position: relative;
          max-width: 100%;
          word-wrap: break-word;
          /* Better touch handling */
          touch-action: manipulation;
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
          margin-bottom: var(--spacing-sm);
          gap: var(--spacing-sm);
        }

        .message-meta {
          flex: 1;
          min-width: 0;
        }

        .message-sender {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.75rem;
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .message-badges {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        }

        .confidence-badge {
          padding: 2px var(--spacing-xs);
          border-radius: var(--radius-sm);
          font-size: 0.625rem;
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
          font-size: 0.625rem;
          color: var(--text-muted);
        }

        .message-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-shrink: 0;
        }

        .mobile-actions {
          position: absolute;
          top: var(--spacing-xs);
          right: var(--spacing-xs);
          background: rgba(0, 0, 0, 0.7);
          border-radius: var(--radius-sm);
          padding: var(--spacing-xs);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .message:hover .mobile-actions {
          opacity: 1;
        }

        .action-btn {
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
          min-height: 28px;
          min-width: 28px;
          flex-shrink: 0;
        }

        .action-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .copy-action.copied {
          background: rgba(72, 187, 120, 0.3);
          color: #9ae6b4;
          border-color: rgba(72, 187, 120, 0.5);
        }

        .message-content {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .message-text {
          color: var(--text-secondary);
          white-space: pre-wrap;
          word-wrap: break-word;
          hyphens: auto;
        }

        .user-bubble .message-text {
          color: var(--text-primary);
        }

        .message-time {
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: var(--spacing-xs);
          text-align: right;
        }

        .message-summary {
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
          font-weight: 500;
        }

        .message-sections {
          margin-top: var(--spacing-md);
          border-top: 1px solid var(--border-secondary);
          padding-top: var(--spacing-md);
        }

        .sections-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-primary);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }

        .content-section {
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.1);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .section-title {
          color: var(--text-primary);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .section-content {
          color: var(--text-secondary);
          font-size: 0.75rem;
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
          margin-top: var(--spacing-xs);
          padding-top: var(--spacing-xs);
          border-top: 1px solid rgba(102, 126, 234, 0.2);
          color: var(--text-accent);
          font-size: 0.625rem;
        }

        .message-code-examples {
          margin-top: var(--spacing-md);
          border-top: 1px solid var(--border-secondary);
          padding-top: var(--spacing-md);
        }

        .code-examples-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-primary);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }

        .message-footer {
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-xs);
          border-top: 1px solid var(--border-secondary);
        }

        .message-timestamp {
          font-size: 0.625rem;
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
          padding: 0 var(--spacing-md);
          flex-shrink: 0;
        }

        /* Enhanced Input Section */
        .chat-input-section {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-secondary);
          padding: var(--spacing-md);
          flex-shrink: 0;
          position: relative;
          /* Optimize for mobile keyboard */
          transition: all 0.3s ease;
        }

        .chat-input-section.focused {
          /* Slight highlight when focused */
          background: var(--bg-tertiary);
        }

        .chat-input-form {
          max-width: 100%;
          margin: 0 auto;
        }

        .input-wrapper {
          display: flex;
          gap: var(--spacing-xs);
          align-items: flex-end;
          background: var(--bg-input);
          border: 2px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xs);
          transition: all var(--transition-fast);
          position: relative;
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
          min-height: 40px;
          font-family: inherit;
          line-height: 1.5;
          padding: var(--spacing-sm);
          /* Optimize for mobile */
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border-radius: var(--radius-md);
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
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          min-height: 44px;
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
          margin-top: var(--spacing-xs);
          font-size: 0.625rem;
          color: var(--text-muted);
          gap: var(--spacing-sm);
        }

        .char-count {
          flex-shrink: 0;
        }

        .input-hint {
          flex: 1;
          text-align: right;
        }

        /* Enhanced Sidebar Panel */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          height: var(--viewport-height, 100vh);
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          animation: fadeIn 0.3s ease;
          /* Better touch handling */
          touch-action: none;
          /* Force hardware acceleration */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: opacity;
        }

        .sidebar-panel {
          position: fixed;
          top: 0;
          right: -100%;
          width: min(350px, 85vw);
          height: 100vh;
          height: var(--viewport-height, 100vh);
          background: var(--bg-card);
          border-left: 1px solid var(--border-secondary);
          z-index: 999;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          /* Optimize for mobile */
          overflow: hidden;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          /* Force hardware acceleration */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: right;
          /* Ensure proper stacking */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .sidebar-panel.sidebar-open {
          right: 0;
        }

        /* Mobile-specific sidebar fixes */
        @media (max-width: 768px) {
          .sidebar-overlay {
            /* Ensure full coverage on mobile */
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            height: var(--viewport-height, 100vh);
            /* Prevent scrolling */
            overflow: hidden;
          }

          .sidebar-panel {
            width: 100vw;
            right: -100vw;
            border-left: none;
            border-top: 1px solid var(--border-secondary);
            /* Ensure it covers the full viewport */
            max-width: 100vw;
            /* Force position */
            transform: translateX(0);
            -webkit-transform: translateX(0);
          }

          .sidebar-panel.sidebar-open {
            right: 0;
            /* Double ensure visibility */
            transform: translateX(0);
            -webkit-transform: translateX(0);
          }

          /* Prevent body scroll when sidebar is open */
          body:has(.sidebar-panel.sidebar-open) {
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-secondary);
          background: var(--bg-tertiary);
          flex-shrink: 0;
        }

        .sidebar-header h3 {
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .close-sidebar {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-xs);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 40px;
          min-width: 40px;
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
          overflow-x: hidden;
          padding: var(--spacing-md);
          -webkit-overflow-scrolling: touch;
          /* Ensure proper scrolling on mobile */
          overscroll-behavior: contain;
          /* Add scroll padding for better UX */
          scroll-padding: var(--spacing-md);
        }

        /* Sidebar scrollbar styling */
        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-content::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 2px;
        }

        .sidebar-content::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 2px;
        }

        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Hide scrollbar on mobile for cleaner look */
        @media (max-width: 768px) {
          .sidebar-content::-webkit-scrollbar {
            display: none;
          }
          
          .sidebar-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }

        .sidebar-section {
          margin-bottom: var(--spacing-lg);
        }

        .sidebar-section h4 {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .quick-actions .action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.75rem;
          min-height: 44px;
          width: 100%;
          justify-content: flex-start;
        }

        .quick-actions .action-btn:hover:not(:disabled) {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-color: var(--border-accent);
          transform: translateY(-1px);
        }

        .quick-actions .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fact-card {
          background: var(--bg-tertiary);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
          border-left: 4px solid var(--border-accent);
        }

        .fact-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-sm);
          font-size: 0.875rem;
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
          font-size: 0.625rem;
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
          font-size: 0.75rem;
          line-height: 1.5;
          margin-bottom: var(--spacing-xs);
          padding-left: var(--spacing-md);
          position: relative;
        }

        .tips-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--text-accent);
          font-weight: bold;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .chat-header {
            padding: var(--spacing-xs) var(--spacing-sm);
            min-height: 56px;
          }

          .title-content h1 {
            font-size: 0.875rem;
          }

          .chat-status {
            font-size: 0.6875rem;
          }

          .chat-messages {
            padding: var(--spacing-sm);
            gap: var(--spacing-sm);
          }

          .message {
            max-width: 95%;
          }

          .message-avatar {
            width: 28px;
            height: 28px;
            min-width: 28px;
            min-height: 28px;
          }

          .message-bubble {
            padding: var(--spacing-sm);
          }

          .chat-input-section {
            padding: var(--spacing-sm);
          }

          .sidebar-panel {
            width: 100vw;
            right: -100vw;
            border-left: none;
            border-top: 1px solid var(--border-secondary);
          }

          .sidebar-panel.sidebar-open {
            right: 0;
          }

          .input-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }

          .input-hint {
            text-align: left;
          }

          .send-button {
            min-width: 40px;
            min-height: 40px;
          }

          .message-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }

          .message-badges {
            align-self: flex-start;
          }

          .message-actions {
            align-self: flex-end;
            margin-top: var(--spacing-xs);
          }
        }

        @media (max-width: 320px) {
          .chat-header {
            padding: var(--spacing-xs);
          }

          .header-left {
            gap: var(--spacing-xs);
          }

          .title-content h1 {
            font-size: 0.8125rem;
          }

          .message-bubble {
            padding: var(--spacing-xs);
          }

          .sidebar-content {
            padding: var(--spacing-sm);
          }
        }

        /* Landscape Mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .chatbot-fullscreen {
            height: 100vh;
          }

          .chat-header {
            min-height: 48px;
            padding: var(--spacing-xs) var(--spacing-sm);
          }

          .chat-messages {
            padding: var(--spacing-xs) var(--spacing-sm);
          }

          .chat-input-section {
            padding: var(--spacing-xs) var(--spacing-sm);
          }

          .message-bubble {
            padding: var(--spacing-sm);
          }
        }

        /* Tablet Styles */
        @media (min-width: 481px) and (max-width: 768px) {
          .message {
            max-width: 80%;
          }

          .sidebar-panel {
            width: 60vw;
          }

          .chat-input-form {
            max-width: 600px;
            margin: 0 auto;
          }
        }

        /* Desktop Enhancements */
        @media (min-width: 769px) {
          .chat-messages {
            padding: var(--spacing-lg);
            gap: var(--spacing-lg);
          }

          .message {
            max-width: 75%;
          }

          .message-bubble {
            padding: var(--spacing-lg);
          }

          .chat-input-section {
            padding: var(--spacing-lg);
          }

          .chat-input-form {
            max-width: 800px;
            margin: 0 auto;
          }

          .sidebar-panel {
            width: 400px;
          }

          .mobile-actions {
            display: none;
          }

          /* Show desktop-only elements */
          .desktop-only {
            display: flex !important;
          }
        }

        @media (min-width: 1024px) {
          .message {
            max-width: 70%;
          }

          .chat-messages {
            padding: var(--spacing-xl);
            gap: var(--spacing-xl);
          }
        }

        /* Utility Classes */
        .mobile-only {
          display: block;
        }

        .mobile-hidden {
          display: none;
        }

        .desktop-only {
          display: none;
        }

        @media (min-width: 769px) {
          .mobile-only {
            display: none;
          }

          .mobile-hidden {
            display: block;
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

        /* Touch Optimizations */
        @media (hover: none) and (pointer: coarse) {
          /* Mobile touch device optimizations */
          .message-bubble {
            /* Improve touch targets */
            min-height: 44px;
          }

          .action-btn {
            min-height: 44px;
            min-width: 44px;
          }

          .chat-input {
            /* Better mobile input handling */
            -webkit-user-select: text;
            user-select: text;
          }

          /* Hide hover states on touch devices */
          .message:hover .mobile-actions {
            opacity: 0;
          }

          /* Show actions on touch */
          .message:active .mobile-actions {
            opacity: 1;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .message,
          .sidebar-overlay,
          .sidebar-panel,
          .chat-input-section {
            animation: none;
            transition: none;
          }

          .send-button:hover:not(:disabled) {
            transform: none;
          }

          .quick-actions .action-btn:hover:not(:disabled) {
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

        /* Focus management for keyboard navigation */
        .chat-input:focus {
          /* Ensure proper focus ring */
          box-shadow: 0 0 0 2px var(--border-accent);
        }

        .sidebar-panel:focus-within {
          /* Keep sidebar focused when interacting with content */
          outline: none;
        }

        /* Scrollbar styling for desktop */
        @media (min-width: 769px) {
          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          .chat-messages::-webkit-scrollbar-track {
            background: var(--bg-secondary);
            border-radius: 3px;
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background: var(--border-primary);
            border-radius: 3px;
          }

          .chat-messages::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
          }

          .sidebar-content::-webkit-scrollbar {
            width: 4px;
          }

          .sidebar-content::-webkit-scrollbar-track {
            background: var(--bg-secondary);
          }

          .sidebar-content::-webkit-scrollbar-thumb {
            background: var(--border-primary);
            border-radius: 2px;
          }
        }

        /* Print styles */
        @media print {
          .chat-header,
          .sidebar-panel,
          .sidebar-overlay,
          .chat-input-section,
          .message-actions,
          .mobile-actions {
            display: none !important;
          }

          .chatbot-fullscreen {
            height: auto;
            background: white;
          }

          .chat-messages {
            overflow: visible;
            height: auto;
            background: white;
          }

          .message-bubble {
            background: white !important;
            color: black !important;
            border: 1px solid black;
          }

          .message-text {
            color: black !important;
          }
        }

        /* Error state styling */
        .error-container {
          animation: slideUp 0.3s ease-out;
        }

        /* Loading state improvements */
        .typing-message {
          opacity: 0.8;
        }

        .typing-bubble {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
        }

        /* Performance optimizations */
        .chatbot-fullscreen {
          /* GPU acceleration */
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .message-bubble {
          /* Optimize for smooth scrolling */
          contain: layout style paint;
        }

        /* Safe area handling for devices with notches */
        @supports (padding: max(0px)) {
          .chat-header {
            padding-left: max(var(--spacing-md), env(safe-area-inset-left));
            padding-right: max(var(--spacing-md), env(safe-area-inset-right));
          }

          .chat-input-section {
            padding-left: max(var(--spacing-md), env(safe-area-inset-left));
            padding-right: max(var(--spacing-md), env(safe-area-inset-right));
            padding-bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;