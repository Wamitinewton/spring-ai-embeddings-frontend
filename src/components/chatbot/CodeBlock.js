import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Code, Download, Eye, EyeOff, Maximize2, Minimize2, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { copyToClipboard, getLanguageInfo, deviceUtils } from '../../utils/helpers';
import { CODE_LANGUAGES } from '../../utils/constants';

const CodeBlock = ({ 
  code, 
  language = 'text', 
  filename = null,
  description = null,
  showLineNumbers = true,
  maxHeight = '400px',
  allowDownload = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showNumbers, setShowNumbers] = useState(showLineNumbers);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const codeRef = useRef(null);
  const containerRef = useRef(null);

  const languageInfo = getLanguageInfo(language);
  const displayLanguage = CODE_LANGUAGES[language.toLowerCase()] || language;
  const codeLines = code.split('\n');
  const shouldShowExpandButton = codeLines.length > 15;

  // Handle viewport changes for fullscreen
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

  // Handle fullscreen mode
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setFullscreen(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [fullscreen]);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      
      // Haptic feedback on mobile
      if (deviceUtils.isMobile() && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (!fullscreen) {
      setExpanded(true); // Auto-expand in fullscreen
    }
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      kotlin: 'kt',
      csharp: 'cs',
      cpp: 'cpp',
      rust: 'rs',
      go: 'go',
      swift: 'swift',
      json: 'json',
      xml: 'xml',
      yaml: 'yml',
      sql: 'sql',
      bash: 'sh',
      shell: 'sh'
    };
    return extensions[lang.toLowerCase()] || 'txt';
  };

  // Map our language codes to react-syntax-highlighter language identifiers
  const getSyntaxHighlighterLanguage = (lang) => {
    const languageMap = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      kotlin: 'kotlin',
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
    return languageMap[lang.toLowerCase()] || 'text';
  };

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      kotlin: '🎯',
      csharp: '🔵',
      cpp: '⚡',
      rust: '🦀',
      go: '🐹',
      swift: '🦉',
      json: '📄',
      xml: '📋',
      yaml: '📝',
      sql: '🗃️',
      bash: '💻',
      shell: '💻'
    };
    return icons[lang.toLowerCase()] || '📄';
  };

  // Custom style based on theme but compatible with react-syntax-highlighter
  const customStyle = {
    margin: 0,
    padding: deviceUtils.isMobile() ? '1rem' : '1.5rem',
    background: 'transparent',
    fontSize: deviceUtils.isMobile() ? '0.8rem' : fullscreen ? '1rem' : '0.875rem',
    lineHeight: '1.6',
    overflow: 'visible'
  };

  const codeTagProps = {
    style: {
      fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'Courier New', monospace"
    }
  };

  return (
    <div 
      className={`code-block-container ${fullscreen ? 'fullscreen' : ''} ${className}`}
      ref={containerRef}
      style={{ 
        '--viewport-height': `${viewportHeight}px`
      }}
    >
      {(description || filename) && (
        <div className="code-description">
          {filename && (
            <div className="code-filename">
              <Code size={deviceUtils.isMobile() ? 14 : 16} />
              <span>{filename}</span>
            </div>
          )}
          {description && (
            <p className="code-desc-text">{description}</p>
          )}
        </div>
      )}
      
      <div className="code-block">
        <div className="code-header">
          <div className="code-info">
            <div className="code-language">
              <span className="language-icon">{getLanguageIcon(language)}</span>
              <span className="language-name">{languageInfo.name}</span>
            </div>
            <div className="code-stats">
              <span className="code-stat">
                <Terminal size={12} />
                {codeLines.length} lines
              </span>
              <span className="code-stat">
                {Math.round(code.length / 1024 * 100) / 100} KB
              </span>
            </div>
          </div>
          
          <div className="code-actions">
            <button
              className="code-action-btn"
              onClick={() => setShowNumbers(!showNumbers)}
              title={showNumbers ? 'Hide line numbers' : 'Show line numbers'}
            >
              {showNumbers ? <EyeOff size={deviceUtils.isMobile() ? 16 : 14} /> : <Eye size={deviceUtils.isMobile() ? 16 : 14} />}
              {!deviceUtils.isMobile() && <span>{showNumbers ? 'Hide' : 'Show'} Lines</span>}
            </button>
            
            {shouldShowExpandButton && (
              <button
                className="code-action-btn"
                onClick={toggleFullscreen}
                title={fullscreen ? 'Exit fullscreen' : 'View fullscreen'}
              >
                {fullscreen ? <Minimize2 size={deviceUtils.isMobile() ? 16 : 14} /> : <Maximize2 size={deviceUtils.isMobile() ? 16 : 14} />}
                {!deviceUtils.isMobile() && <span>{fullscreen ? 'Exit' : 'Fullscreen'}</span>}
              </button>
            )}
            
            {allowDownload && (
              <button
                className="code-action-btn"
                onClick={handleDownload}
                title="Download code"
              >
                <Download size={deviceUtils.isMobile() ? 16 : 14} />
                {!deviceUtils.isMobile() && <span>Download</span>}
              </button>
            )}
            
            <button
              className={`code-action-btn primary ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? <Check size={deviceUtils.isMobile() ? 16 : 14} /> : <Copy size={deviceUtils.isMobile() ? 16 : 14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
        
        <div 
          className={`code-content ${!expanded && shouldShowExpandButton && !fullscreen ? 'collapsed' : ''}`}
          ref={codeRef}
          style={{
            maxHeight: fullscreen 
              ? 'calc(var(--viewport-height) - 120px)' 
              : (!expanded && shouldShowExpandButton ? '300px' : maxHeight),
            overflowY: fullscreen || expanded ? 'auto' : 'hidden'
          }}
        >
          <SyntaxHighlighter
            language={getSyntaxHighlighterLanguage(language)}
            style={vscDarkPlus}
            showLineNumbers={showNumbers}
            customStyle={customStyle}
            codeTagProps={codeTagProps}
            wrapLines={true}
            wrapLongLines={true}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              textAlign: 'right',
              userSelect: 'none',
              opacity: 0.7,
              fontSize: '0.85em'
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        
        {shouldShowExpandButton && !fullscreen && (
          <div className="code-expand">
            <button
              className="expand-button"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  Show Less
                  <span className="expand-indicator">−</span>
                </>
              ) : (
                <>
                  Show More (+{codeLines.length - 15} lines)
                  <span className="expand-indicator">+</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {fullscreen && (
        <div className="fullscreen-backdrop">
          <div className="fullscreen-close" onClick={() => setFullscreen(false)}>
            <span>Press ESC or click here to exit fullscreen</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .code-block-container {
          margin: var(--spacing-md) 0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #1e1e1e;
          border: 1px solid #333;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all var(--transition-normal);
          position: relative;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .code-block-container:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          border-color: #667eea;
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .code-block-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          margin: 0;
          border-radius: 0;
          display: flex;
          flex-direction: column;
          border: none;
          box-shadow: none;
          height: 100vh;
          height: var(--viewport-height);
        }

        .fullscreen .code-block {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .fullscreen .code-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .fullscreen-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 998;
          pointer-events: none;
        }

        .fullscreen-close {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          cursor: pointer;
          z-index: 1001;
          pointer-events: auto;
          transition: all var(--transition-fast);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .fullscreen-close:hover {
          background: rgba(0, 0, 0, 0.9);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .code-description {
          background: #252526;
          padding: var(--spacing-md);
          border-bottom: 1px solid #333;
        }

        .code-filename {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: #667eea;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .code-desc-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.5;
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          background: #252526;
          border-bottom: 1px solid #333;
          min-height: 60px;
        }

        .code-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          flex: 1;
          min-width: 0;
        }

        .code-language {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 600;
          color: #667eea;
        }

        .language-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .language-name {
          font-weight: 700;
          white-space: nowrap;
        }

        .code-stats {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          font-size: 0.75rem;
          color: #858585;
        }

        .code-stat {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: rgba(255, 255, 255, 0.05);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          white-space: nowrap;
        }

        .code-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        }

        .code-action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #858585;
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          min-height: 36px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .code-action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #667eea;
          border-color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .code-action-btn:active {
          transform: translateY(0);
        }

        .code-action-btn.primary {
          background: #667eea;
          color: #1e1e1e;
          border-color: #667eea;
        }

        .code-action-btn.primary:hover {
          background: #667eea;
          opacity: 0.9;
          color: #1e1e1e;
        }

        .code-action-btn.copied {
          background: rgba(72, 187, 120, 0.8);
          color: white;
          border-color: rgba(72, 187, 120, 0.8);
        }

        .code-content {
          transition: max-height var(--transition-normal);
          position: relative;
          background: #1e1e1e;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .code-content.collapsed {
          overflow-y: hidden;
        }

        .code-content.collapsed::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(transparent, #1e1e1e);
          pointer-events: none;
          z-index: 2;
        }

        .code-expand {
          text-align: center;
          padding: var(--spacing-md);
          background: #252526;
          border-top: 1px solid #333;
        }

        .expand-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #667eea;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 40px;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }

        .expand-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #667eea;
          transform: translateY(-1px);
        }

        .expand-indicator {
          font-size: 1.2em;
          font-weight: bold;
        }

        /* Enhanced Scrollbars */
        .code-content::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-content::-webkit-scrollbar-track {
          background: #252526;
          border-radius: 4px;
        }

        .code-content::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
          border: 2px solid #252526;
        }

        .code-content::-webkit-scrollbar-thumb:hover {
          background: #667eea;
        }

        .code-content::-webkit-scrollbar-corner {
          background: #252526;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .code-header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
            padding: var(--spacing-md);
            min-height: auto;
          }

          .code-info {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
          }

          .code-stats {
            flex-direction: column;
            gap: var(--spacing-xs);
            align-items: flex-start;
          }

          .code-actions {
            width: 100%;
            justify-content: flex-end;
            gap: var(--spacing-xs);
          }

          .code-action-btn {
            min-height: 44px;
            min-width: 44px;
            padding: var(--spacing-sm);
          }

          .code-action-btn span {
            display: none;
          }

          .code-content.collapsed::after {
            height: 40px;
          }

          .code-description {
            padding: var(--spacing-sm);
          }

          .expand-button {
            font-size: 0.8rem;
            padding: var(--spacing-sm);
            max-width: none;
          }

          .fullscreen-close {
            top: 10px;
            right: 10px;
            font-size: 0.8rem;
            padding: var(--spacing-xs) var(--spacing-sm);
          }

          .fullscreen-close span {
            display: block;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .code-info {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .code-language {
            gap: var(--spacing-xs);
          }

          .language-name {
            font-size: 0.8rem;
          }

          .code-actions {
            gap: 2px;
          }

          .code-action-btn {
            min-width: 40px;
            min-height: 40px;
          }
        }

        /* Desktop Enhancements */
        @media (min-width: 769px) {
          .code-header {
            padding: var(--spacing-lg);
          }

          .code-content.collapsed::after {
            height: 80px;
          }
        }

        /* Accessibility Improvements */
        @media (prefers-reduced-motion: reduce) {
          .code-block-container,
          .code-action-btn,
          .expand-button {
            transition: none;
          }

          .code-block-container:hover,
          .code-action-btn:hover,
          .expand-button:hover {
            transform: none;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .code-block-container {
            border-width: 2px;
            border-color: currentColor;
          }

          .code-action-btn {
            border-width: 2px;
          }
        }

        /* Focus Management */
        .code-action-btn:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        .expand-button:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        /* Print styles */
        @media print {
          .code-header,
          .code-expand,
          .code-actions,
          .fullscreen-close {
            display: none !important;
          }

          .code-block-container {
            border: 2px solid #000;
            break-inside: avoid;
            background: white !important;
            box-shadow: none;
          }

          .code-content {
            max-height: none !important;
            overflow: visible !important;
          }
        }
      
      `}</style>
    </div>
  );
};

export default CodeBlock;