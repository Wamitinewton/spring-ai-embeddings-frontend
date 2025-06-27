import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Code, Download, Eye, EyeOff, Maximize2, Minimize2, Terminal } from 'lucide-react';
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
  const maxLineNumberWidth = String(codeLines.length).length;

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

  const getLanguageTheme = (lang) => {
    const themes = {
      javascript: {
        bg: '#1e1e1e',
        border: '#f7df1e',
        headerBg: '#252526',
        textColor: '#f7df1e',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#d4d4d4'
      },
      typescript: {
        bg: '#1e1e1e',
        border: '#3178c6',
        headerBg: '#252526',
        textColor: '#3178c6',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#d4d4d4'
      },
      python: {
        bg: '#1e1e1e',
        border: '#306998',
        headerBg: '#252526',
        textColor: '#306998',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#ff7043',
        string: '#689f38',
        comment: '#6a9955',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#d4d4d4'
      },
      java: {
        bg: '#1e1e1e',
        border: '#ed8936',
        headerBg: '#252526',
        textColor: '#ed8936',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#cc7832',
        string: '#6a8759',
        comment: '#6a9955',
        number: '#6897bb',
        function: '#ffc66d',
        variable: '#9cdcfe',
        operator: '#cc7832'
      },
      kotlin: {
        bg: '#1e1e1e',
        border: '#7f52ff',
        headerBg: '#252526',
        textColor: '#7f52ff',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#cf8e6d',
        string: '#6aab73',
        comment: '#7a7e85',
        number: '#2aacb8',
        function: '#56b6c2',
        variable: '#e06c75',
        operator: '#cf8e6d'
      },
      csharp: {
        bg: '#1e1e1e',
        border: '#512da8',
        headerBg: '#252526',
        textColor: '#512da8',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#569cd6',
        string: '#d69d85',
        comment: '#57a64a',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#569cd6'
      },
      cpp: {
        bg: '#1e1e1e',
        border: '#00d4aa',
        headerBg: '#252526',
        textColor: '#00d4aa',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#c586c0',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#c586c0'
      },
      rust: {
        bg: '#1e1e1e',
        border: '#ce422b',
        headerBg: '#252526',
        textColor: '#ce422b',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#ff6b6b',
        string: '#98c379',
        comment: '#5c6370',
        number: '#d19a66',
        function: '#61afef',
        variable: '#e06c75',
        operator: '#56b6c2'
      },
      go: {
        bg: '#1e1e1e',
        border: '#00add8',
        headerBg: '#252526',
        textColor: '#00add8',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#ff6b6b',
        string: '#98c379',
        comment: '#5c6370',
        number: '#d19a66',
        function: '#61afef',
        variable: '#e06c75',
        operator: '#56b6c2'
      },
      swift: {
        bg: '#1e1e1e',
        border: '#fa7343',
        headerBg: '#252526',
        textColor: '#fa7343',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#ff6b6b',
        string: '#98c379',
        comment: '#5c6370',
        number: '#d19a66',
        function: '#61afef',
        variable: '#e06c75',
        operator: '#56b6c2'
      },
      json: {
        bg: '#1e1e1e',
        border: '#61dafb',
        headerBg: '#252526',
        textColor: '#61dafb',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#d4d4d4'
      },
      default: {
        bg: '#1e1e1e',
        border: '#4a5568',
        headerBg: '#252526',
        textColor: '#a0aec0',
        lineNumber: '#858585',
        text: '#d4d4d4',
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        operator: '#d4d4d4'
      }
    };

    return themes[lang.toLowerCase()] || themes.default;
  };

  const highlightCode = (code, lang) => {
    if (!code) return '';
    
    const theme = getLanguageTheme(lang);
    
    // Basic syntax highlighting patterns
    const patterns = {
      // Comments
      comment: [
        /\/\/.*$/gm,
        /\/\*[\s\S]*?\*\//gm,
        /#.*$/gm,
        /"""[\s\S]*?"""/gm,
        /'''[\s\S]*?'''/gm
      ],
      // Strings
      string: [
        /"([^"\\]|\\.)*"/g,
        /'([^'\\]|\\.)*'/g,
        /`([^`\\]|\\.)*`/g
      ],
      // Keywords by language
      keyword: {
        javascript: /\b(function|const|let|var|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g,
        typescript: /\b(function|const|let|var|class|interface|type|enum|if|else|for|while|return|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected|readonly)\b/g,
        python: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|lambda|yield|global|nonlocal|and|or|not|in|is|True|False|None)\b/g,
        java: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|if|else|for|while|return|import|package|try|catch|finally|throw|throws|new|this|super|void|int|String|boolean|double|float|long|short|byte|char)\b/g,
        kotlin: /\b(fun|class|interface|object|val|var|if|else|when|for|while|return|import|package|try|catch|finally|throw|data|sealed|abstract|open|override|private|public|protected|internal|companion|init|constructor)\b/g,
        csharp: /\b(public|private|protected|internal|static|readonly|const|class|interface|struct|enum|if|else|for|foreach|while|return|using|namespace|try|catch|finally|throw|new|this|base|virtual|override|abstract|sealed|void|int|string|bool|double|float|long|short|byte|char)\b/g,
        cpp: /\b(int|char|float|double|void|bool|long|short|unsigned|signed|const|static|extern|inline|virtual|public|private|protected|class|struct|enum|union|if|else|for|while|return|include|using|namespace|try|catch|throw|new|delete|this|template|typename)\b/g,
        rust: /\b(fn|let|mut|const|static|if|else|match|for|while|loop|return|use|mod|pub|struct|enum|impl|trait|type|where|unsafe|async|await|move|ref|self|Self|super|crate|true|false)\b/g,
        go: /\b(func|var|const|type|struct|interface|if|else|for|range|return|import|package|go|defer|select|switch|case|default|fallthrough|break|continue|chan|map|true|false|nil)\b/g,
        swift: /\b(func|let|var|class|struct|enum|protocol|if|else|for|while|return|import|try|catch|throw|guard|defer|self|Self|super|true|false|nil|public|private|internal|fileprivate|open|static|final|override|mutating|nonmutating)\b/g
      },
      // Numbers
      number: /\b\d+(\.\d+)?\b/g,
      // Functions
      function: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
      // Operators
      operator: /[+\-*/%=<>!&|^~?:]/g
    };

    let highlightedCode = code;
    
    // Apply syntax highlighting
    const langPatterns = patterns.keyword[lang.toLowerCase()];
    
    // Escape HTML
    highlightedCode = highlightedCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight comments first (to avoid conflicts)
    patterns.comment.forEach(pattern => {
      highlightedCode = highlightedCode.replace(pattern, match => 
        `<span style="color: ${theme.comment}; font-style: italic;">${match}</span>`
      );
    });

    // Highlight strings
    patterns.string.forEach(pattern => {
      highlightedCode = highlightedCode.replace(pattern, match => 
        `<span style="color: ${theme.string};">${match}</span>`
      );
    });

    // Highlight keywords
    if (langPatterns) {
      highlightedCode = highlightedCode.replace(langPatterns, match => 
        `<span style="color: ${theme.keyword}; font-weight: 600;">${match}</span>`
      );
    }

    // Highlight numbers
    highlightedCode = highlightedCode.replace(patterns.number, match => 
      `<span style="color: ${theme.number};">${match}</span>`
    );

    // Highlight function calls
    highlightedCode = highlightedCode.replace(patterns.function, match => {
      const funcName = match.replace('(', '');
      return `<span style="color: ${theme.function};">${funcName}</span>(`;
    });

    return highlightedCode;
  };

  const formatCode = (code) => {
    if (!showNumbers) {
      return (
        <div 
          className="code-content-inner"
          dangerouslySetInnerHTML={{ 
            __html: highlightCode(code, language) 
          }}
        />
      );
    }
    
    return codeLines.map((line, index) => (
      <div key={index} className="code-line">
        <span 
          className="line-number"
          style={{ minWidth: `${maxLineNumberWidth + 1}ch` }}
        >
          {index + 1}
        </span>
        <span 
          className="line-content"
          dangerouslySetInnerHTML={{ 
            __html: highlightCode(line || ' ', language) 
          }}
        />
      </div>
    ));
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

  const theme = getLanguageTheme(language);

  return (
    <div 
      className={`code-block-container ${fullscreen ? 'fullscreen' : ''} ${className}`}
      ref={containerRef}
      style={{ 
        '--viewport-height': `${viewportHeight}px`,
        '--max-line-width': `${maxLineNumberWidth + 1}ch`
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
              : (!expanded && shouldShowExpandButton ? '300px' : 'none'),
            overflowY: fullscreen || expanded ? 'auto' : 'hidden'
          }}
        >
          <pre className="code-pre">
            <code className={`language-${displayLanguage}`}>
              {formatCode(code)}
            </code>
          </pre>
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
          background: ${theme.bg};
          border: 1px solid ${theme.border};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all var(--transition-normal);
          position: relative;
          /* Force hardware acceleration */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .code-block-container:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          border-color: ${theme.textColor};
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
          max-height: calc(var(--viewport-height) - 120px);
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

        /* Description Section */
        .code-description {
          background: ${theme.headerBg};
          padding: var(--spacing-md);
          border-bottom: 1px solid ${theme.border};
        }

        .code-filename {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: ${theme.textColor};
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

        /* Enhanced Header */
        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          background: ${theme.headerBg};
          border-bottom: 1px solid ${theme.border};
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
          color: ${theme.textColor};
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
          color: ${theme.lineNumber};
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

        /* Enhanced Actions */
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
          color: ${theme.lineNumber};
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          min-height: 36px;
          /* Touch optimization */
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .code-action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: ${theme.textColor};
          border-color: ${theme.textColor};
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .code-action-btn:active {
          transform: translateY(0);
        }

        .code-action-btn.primary {
          background: ${theme.textColor};
          color: ${theme.bg};
          border-color: ${theme.textColor};
        }

        .code-action-btn.primary:hover {
          background: ${theme.textColor};
          opacity: 0.9;
          color: ${theme.bg};
        }

        .code-action-btn.copied {
          background: rgba(72, 187, 120, 0.8);
          color: white;
          border-color: rgba(72, 187, 120, 0.8);
        }

        /* Enhanced Code Content */
        .code-content {
          transition: max-height var(--transition-normal);
          position: relative;
          background: ${theme.bg};
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .code-content.collapsed {
          overflow-y: hidden;
          max-height: 300px;
        }

        .code-content.collapsed::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(transparent, ${theme.bg});
          pointer-events: none;
          z-index: 2;
        }

        /* When expanded or in fullscreen, allow scrolling */
        .code-content:not(.collapsed) {
          overflow-y: auto;
          max-height: 80vh;
        }

        .code-pre {
          margin: 0;
          padding: 0;
          overflow-x: auto;
          overflow-y: visible;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          color: ${theme.text};
          background: transparent;
          /* Better scrolling */
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: ${theme.border} ${theme.bg};
          width: 100%;
          min-height: 100%;
        }

        .fullscreen .code-pre {
          font-size: 1rem;
          padding: var(--spacing-lg);
        }

        .code-content-inner {
          padding: var(--spacing-lg);
          white-space: pre;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Enhanced Line Display */
        .code-line {
          display: flex;
          min-height: 1.6em;
          align-items: flex-start;
          transition: background-color var(--transition-fast);
          padding: 0 var(--spacing-lg);
          position: relative;
        }

        .code-line:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .line-number {
          display: inline-block;
          text-align: right;
          color: ${theme.lineNumber};
          user-select: none;
          margin-right: var(--spacing-lg);
          flex-shrink: 0;
          font-size: 0.8em;
          opacity: 0.7;
          font-weight: 400;
          padding: 0.2em 0;
          min-width: var(--max-line-width);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding-right: var(--spacing-md);
          font-variant-numeric: tabular-nums;
        }

        .line-content {
          flex: 1;
          white-space: pre;
          word-wrap: break-word;
          overflow-wrap: break-word;
          padding: 0.2em 0;
          min-width: 0;
        }

        /* Syntax Highlighting Styles */
        .line-content span {
          font-weight: inherit;
        }

        /* Expand Button */
        .code-expand {
          text-align: center;
          padding: var(--spacing-md);
          background: ${theme.headerBg};
          border-top: 1px solid ${theme.border};
        }

        .expand-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: ${theme.textColor};
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
          border-color: ${theme.textColor};
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
          background: ${theme.headerBg};
          border-radius: 4px;
        }

        .code-content::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 4px;
          border: 2px solid ${theme.headerBg};
        }

        .code-content::-webkit-scrollbar-thumb:hover {
          background: ${theme.textColor};
        }

        .code-content::-webkit-scrollbar-corner {
          background: ${theme.headerBg};
        }

        .code-pre::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-pre::-webkit-scrollbar-track {
          background: ${theme.bg};
          border-radius: 4px;
        }

        .code-pre::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 4px;
          border: 2px solid ${theme.bg};
        }

        .code-pre::-webkit-scrollbar-thumb:hover {
          background: ${theme.textColor};
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

          .code-pre {
            font-size: 0.8rem;
            padding: 0;
          }

          .code-line {
            padding: 0 var(--spacing-md);
          }

          .line-number {
            font-size: 0.7rem;
            margin-right: var(--spacing-sm);
            padding-right: var(--spacing-xs);
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

          /* Mobile fullscreen optimization */
          .fullscreen .code-pre {
            font-size: 0.875rem;
            padding: var(--spacing-md);
          }

          .fullscreen .code-line {
            padding: 0 var(--spacing-sm);
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

          .line-number {
            min-width: 2ch;
          }

          .code-pre {
            font-size: 0.75rem;
          }

          .code-line {
            padding: 0 var(--spacing-sm);
          }

          .line-content {
            font-size: 0.75rem;
          }

          .fullscreen .code-pre {
            font-size: 0.8rem;
          }
        }

        /* Landscape Mobile Optimization */
        @media (max-width: 768px) and (orientation: landscape) {
          .code-header {
            flex-direction: row;
            align-items: center;
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .code-info {
            flex-direction: row;
            align-items: center;
          }

          .code-stats {
            flex-direction: row;
            align-items: center;
          }

          .code-actions {
            width: auto;
          }
        }

        /* Tablet Optimization */
        @media (min-width: 481px) and (max-width: 768px) {
          .code-actions {
            justify-content: flex-end;
          }

          .code-action-btn span {
            display: inline;
            font-size: 0.7rem;
          }
        }

        /* Desktop Enhancements */
        @media (min-width: 769px) {
          .code-header {
            padding: var(--spacing-lg);
          }

          .code-pre {
            font-size: 0.9rem;
          }

          .code-line {
            padding: 0 var(--spacing-xl);
          }

          .line-number {
            margin-right: var(--spacing-xl);
            padding-right: var(--spacing-md);
          }

          .code-content.collapsed::after {
            height: 80px;
          }

          .fullscreen .code-pre {
            font-size: 1.1rem;
            padding: var(--spacing-xl);
          }

          .fullscreen .code-line {
            padding: 0 var(--spacing-xl);
          }
        }

        /* High DPI Display Optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .code-pre {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .line-number {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Print Styles */
        @media print {
          .code-header,
          .code-expand,
          .code-actions,
          .fullscreen-overlay,
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

          .code-pre {
            color: #000 !important;
            font-size: 0.7rem;
            background: white !important;
          }

          .line-number {
            color: #666 !important;
          }

          .line-content,
          .line-content * {
            color: #000 !important;
          }

          .code-line:hover {
            background: none !important;
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

          .line-number {
            border-right-width: 2px;
          }
        }

        /* Focus Management */
        .code-action-btn:focus {
          outline: 2px solid ${theme.textColor};
          outline-offset: 2px;
        }

        .expand-button:focus {
          outline: 2px solid ${theme.textColor};
          outline-offset: 2px;
        }

        /* Selection Styling */
        .code-pre ::selection {
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
        }

        .code-pre ::-moz-selection {
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
        }

        /* Loading State */
        .code-block-container.loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .code-block-container.loading .code-pre {
          filter: blur(1px);
        }

        /* Enhanced Visual Feedback */
        @keyframes codeBlockSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .code-block-container {
          animation: codeBlockSlideIn 0.3s ease-out;
        }

        @keyframes copySuccess {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .code-action-btn.copied {
          animation: copySuccess 0.3s ease-out;
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .code-action-btn:hover {
            transform: none;
            box-shadow: none;
          }

          .code-action-btn:active {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0.95);
          }

          .expand-button:hover {
            transform: none;
          }

          .expand-button:active {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0.98);
          }

          .code-line:hover {
            background: none;
          }

          /* Better touch scrolling */
          .code-content {
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
          }

          .code-pre {
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
          }
        }

        /* Dark Theme Enhancements */
        @media (prefers-color-scheme: dark) {
          .code-block-container {
            /* Already optimized for dark theme */
          }
        }

        /* Performance Optimizations */
        .code-block-container {
          contain: layout style paint;
          will-change: transform;
        }

        .code-content {
          contain: layout style paint;
        }

        .fullscreen .code-content {
          will-change: scroll-position;
        }

        /* Custom scrollbar for Firefox */
        @-moz-document url-prefix() {
          .code-content {
            scrollbar-width: thin;
            scrollbar-color: ${theme.border} ${theme.bg};
          }

          .code-pre {
            scrollbar-width: thin;
            scrollbar-color: ${theme.border} ${theme.bg};
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;