import React, { useState } from 'react';
import { Copy, Check, Code, Download, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { copyToClipboard, getLanguageInfo } from '../../utils/helpers';
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

  const languageInfo = getLanguageInfo(language);
  const displayLanguage = CODE_LANGUAGES[language.toLowerCase()] || language;
  const codeLines = code.split('\n');
  const shouldShowExpandButton = codeLines.length > 15;

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
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
        bg: 'linear-gradient(135deg, #2d3748 0%, #3a4a5c 100%)',
        border: '#f7df1e',
        headerBg: 'rgba(247, 223, 30, 0.1)',
        textColor: '#f7df1e',
        keyword: '#ff6b6b',
        string: '#4ecdc4',
        comment: '#95a5a6',
        number: '#e74c3c'
      },
      typescript: {
        bg: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
        border: '#3178c6',
        headerBg: 'rgba(49, 120, 198, 0.1)',
        textColor: '#3178c6',
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8'
      },
      python: {
        bg: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        border: '#306998',
        headerBg: 'rgba(48, 105, 152, 0.1)',
        textColor: '#306998',
        keyword: '#ff7043',
        string: '#689f38',
        comment: '#9e9e9e',
        number: '#1976d2'
      },
      java: {
        bg: 'linear-gradient(135deg, #4a2c2a 0%, #8d4004 100%)',
        border: '#ed8936',
        headerBg: 'rgba(237, 137, 54, 0.1)',
        textColor: '#ed8936',
        keyword: '#cc7832',
        string: '#6a8759',
        comment: '#808080',
        number: '#6897bb'
      },
      kotlin: {
        bg: 'linear-gradient(135deg, #1c1c3a 0%, #7f52ff 100%)',
        border: '#7f52ff',
        headerBg: 'rgba(127, 82, 255, 0.1)',
        textColor: '#7f52ff',
        keyword: '#cf8e6d',
        string: '#6aab73',
        comment: '#7a7e85',
        number: '#2aacb8'
      },
      csharp: {
        bg: 'linear-gradient(135deg, #2d1b69 0%, #512da8 100%)',
        border: '#512da8',
        headerBg: 'rgba(81, 45, 168, 0.1)',
        textColor: '#512da8',
        keyword: '#569cd6',
        string: '#d69d85',
        comment: '#57a64a',
        number: '#b5cea8'
      },
      cpp: {
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '#00d4aa',
        headerBg: 'rgba(0, 212, 170, 0.1)',
        textColor: '#00d4aa',
        keyword: '#c586c0',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8'
      },
      rust: {
        bg: 'linear-gradient(135deg, #2f1b14 0%, #8b4513 100%)',
        border: '#ce422b',
        headerBg: 'rgba(206, 66, 43, 0.1)',
        textColor: '#ce422b',
        keyword: '#ff6b6b',
        string: '#98c379',
        comment: '#5c6370',
        number: '#d19a66'
      },
      go: {
        bg: 'linear-gradient(135deg, #1a4d4d 0%, #2d7d7d 100%)',
        border: '#00add8',
        headerBg: 'rgba(0, 173, 216, 0.1)',
        textColor: '#00add8',
        keyword: '#ff6b6b',
        string: '#98c379',
        comment: '#5c6370',
        number: '#d19a66'
      },
      swift: {
        bg: 'linear-gradient(135deg, #2d1810 0%, #fa7343 100%)',
        border: '#fa7343',
        headerBg: 'rgba(250, 115, 67, 0.1)',
        textColor: '#fa7343',
        keyword: '#ff6b6b',
        string: '#98c379',
        comment: '#5c6370',
        number: '#d19a66'
      },
      json: {
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '#61dafb',
        headerBg: 'rgba(97, 218, 251, 0.1)',
        textColor: '#61dafb',
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        number: '#b5cea8'
      },
      default: {
        bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '#4a5568',
        headerBg: 'rgba(74, 85, 104, 0.1)',
        textColor: '#a0aec0',
        keyword: '#e2e8f0',
        string: '#e2e8f0',
        comment: '#718096',
        number: '#e2e8f0'
      }
    };

    return themes[lang.toLowerCase()] || themes.default;
  };

  const formatCode = (code) => {
    if (!showNumbers) return code;
    
    return codeLines.map((line, index) => (
      <div key={index} className="code-line">
        <span className="line-number">{index + 1}</span>
        <span className="line-content">{line || ' '}</span>
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
    <div className={`code-block-container ${fullscreen ? 'fullscreen' : ''} ${className}`}>
      {(description || filename) && (
        <div className="code-description">
          {filename && (
            <div className="code-filename">
              <Code size={16} />
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
            <span className="code-language">
              <span className="language-icon">{getLanguageIcon(language)}</span>
              <span className="language-name">{languageInfo.name}</span>
            </span>
            <div className="code-stats">
              <span className="code-lines">{codeLines.length} lines</span>
              <span className="code-chars">{code.length} chars</span>
            </div>
          </div>
          
          <div className="code-actions">
            <button
              className="code-action-btn"
              onClick={() => setShowNumbers(!showNumbers)}
              title={showNumbers ? 'Hide line numbers' : 'Show line numbers'}
            >
              {showNumbers ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            
            {shouldShowExpandButton && (
              <button
                className="code-action-btn"
                onClick={() => setFullscreen(!fullscreen)}
                title={fullscreen ? 'Exit fullscreen' : 'View fullscreen'}
              >
                {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}
            
            {allowDownload && (
              <button
                className="code-action-btn"
                onClick={handleDownload}
                title="Download code"
              >
                <Download size={14} />
              </button>
            )}
            
            <button
              className={`code-action-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
        
        <div 
          className={`code-content ${!expanded && shouldShowExpandButton && !fullscreen ? 'collapsed' : ''}`}
          style={{
            maxHeight: fullscreen ? '80vh' : (!expanded && shouldShowExpandButton ? '300px' : maxHeight)
          }}
        >
          <pre className="code-pre">
            <code className={`language-${displayLanguage}`}>
              {showNumbers ? formatCode(code) : code}
            </code>
          </pre>
        </div>
        
        {shouldShowExpandButton && !fullscreen && (
          <div className="code-expand">
            <button
              className="expand-button"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show Less' : `Show More (+${codeLines.length - 15} lines)`}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .code-block-container {
          margin: var(--spacing-md) 0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: ${theme.bg};
          border: 2px solid ${theme.border};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all var(--transition-normal);
          position: relative;
        }

        .code-block-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme.bg};
          opacity: 0.9;
          z-index: -1;
        }

        .code-block-container:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: ${theme.textColor};
          transform: translateY(-2px);
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
        }

        .fullscreen .code-block {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .fullscreen .code-content {
          flex: 1;
          overflow-y: auto;
        }

        .code-description {
          background: ${theme.headerBg};
          backdrop-filter: blur(10px);
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

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) var(--spacing-md);
          background: ${theme.headerBg};
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme.border};
        }

        .code-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .code-language {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 600;
          color: ${theme.textColor};
        }

        .language-icon {
          font-size: 1.1rem;
        }

        .language-name {
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .code-stats {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .code-lines,
        .code-chars {
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px var(--spacing-xs);
          border-radius: var(--radius-sm);
        }

        .code-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .code-action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text-muted);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .code-action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: ${theme.textColor};
          border-color: ${theme.textColor};
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .code-action-btn.copied {
          background: rgba(72, 187, 120, 0.3);
          color: #9ae6b4;
          border-color: rgba(72, 187, 120, 0.5);
        }

        .code-content {
          overflow: hidden;
          transition: max-height var(--transition-normal);
          position: relative;
        }

        .code-content.collapsed {
          position: relative;
        }

        .code-content.collapsed::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(transparent, ${theme.bg.split(',')[0].replace('linear-gradient(135deg,', '').trim()});
          pointer-events: none;
        }

        .code-pre {
          margin: 0;
          padding: var(--spacing-lg);
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.6;
          color: #f8f8f2;
          background: transparent;
        }

        .fullscreen .code-pre {
          font-size: 0.95rem;
          padding: var(--spacing-xl);
        }

        .code-line {
          display: flex;
          min-height: 1.6rem;
          align-items: center;
          transition: background-color var(--transition-fast);
        }

        .code-line:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .line-number {
          display: inline-block;
          width: 3rem;
          text-align: right;
          color: var(--text-muted);
          user-select: none;
          margin-right: var(--spacing-md);
          flex-shrink: 0;
          border-right: 1px solid ${theme.border};
          padding-right: var(--spacing-sm);
          font-size: 0.8rem;
          opacity: 0.6;
        }

        .line-content {
          flex: 1;
          white-space: pre;
          word-break: break-all;
        }

        .code-expand {
          text-align: center;
          padding: var(--spacing-sm);
          background: ${theme.headerBg};
          border-top: 1px solid ${theme.border};
          backdrop-filter: blur(10px);
        }

        .expand-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: ${theme.textColor};
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          backdrop-filter: blur(10px);
        }

        .expand-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: ${theme.textColor};
          transform: translateY(-1px);
        }

        /* Syntax highlighting for different languages */
        .language-${displayLanguage} .line-content {
          color: #f8f8f2;
        }

        /* Keywords */
        .language-${displayLanguage} .line-content:has-text('function'),
        .language-${displayLanguage} .line-content:has-text('const'),
        .language-${displayLanguage} .line-content:has-text('let'),
        .language-${displayLanguage} .line-content:has-text('var'),
        .language-${displayLanguage} .line-content:has-text('class'),
        .language-${displayLanguage} .line-content:has-text('def'),
        .language-${displayLanguage} .line-content:has-text('import'),
        .language-${displayLanguage} .line-content:has-text('from'),
        .language-${displayLanguage} .line-content:has-text('return') {
          color: ${theme.keyword};
        }

        /* Enhanced scrollbar for code content */
        .code-content::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .code-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
        }

        .code-content::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .code-content::-webkit-scrollbar-thumb:hover {
          background: ${theme.textColor};
          background-clip: content-box;
        }

        .code-content::-webkit-scrollbar-corner {
          background: rgba(0, 0, 0, 0.2);
        }

        /* Mobile responsive design */
        @media (max-width: 768px) {
          .code-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
            padding: var(--spacing-md);
          }

          .code-info {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
          }

          .code-actions {
            align-self: flex-end;
            flex-wrap: wrap;
          }

          .code-pre {
            font-size: 0.8rem;
            padding: var(--spacing-md);
          }

          .line-number {
            width: 2.5rem;
            font-size: 0.7rem;
          }

          .code-stats {
            flex-direction: column;
            gap: var(--spacing-xs);
            font-size: 0.7rem;
          }

          .code-action-btn {
            font-size: 0.7rem;
            padding: 2px var(--spacing-xs);
          }

          .code-action-btn span {
            display: none;
          }

          .fullscreen .code-pre {
            font-size: 0.875rem;
            padding: var(--spacing-lg);
          }

          .code-content.collapsed::after {
            height: 60px;
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

          .line-number {
            width: 2rem;
          }

          .code-content.collapsed::after {
            height: 40px;
          }

          .code-description {
            padding: var(--spacing-sm);
          }

          .code-pre {
            padding: var(--spacing-sm);
          }
        }

        /* Print styles */
        @media print {
          .code-header,
          .code-expand,
          .code-actions {
            display: none;
          }

          .code-block-container {
            border: 2px solid #000;
            break-inside: avoid;
            background: white !important;
          }

          .code-content {
            max-height: none !important;
          }

          .code-pre {
            color: #000;
            font-size: 0.8rem;
          }

          .line-number {
            color: #666;
          }

          .line-content {
            color: #000;
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;