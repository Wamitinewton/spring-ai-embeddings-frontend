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
          background: var(--code-bg);
          border: 1px solid var(--code-border);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }

        .code-block-container:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-accent);
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
          background: var(--bg-primary);
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
          background: rgba(0, 0, 0, 0.2);
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--code-border);
        }

        .code-filename {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-accent);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 500;
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
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid var(--code-border);
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
          font-weight: 500;
          color: var(--text-accent);
        }

        .language-icon {
          font-size: 1rem;
        }

        .language-name {
          font-weight: 600;
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
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-muted);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .code-action-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
          transform: translateY(-1px);
        }

        .code-action-btn.copied {
          background: rgba(72, 187, 120, 0.2);
          color: #9ae6b4;
          border-color: rgba(72, 187, 120, 0.3);
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
          height: 60px;
          background: linear-gradient(transparent, var(--code-bg));
          pointer-events: none;
        }

        .code-pre {
          margin: 0;
          padding: var(--spacing-md);
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--code-text);
          background: transparent;
        }

        .fullscreen .code-pre {
          font-size: 0.95rem;
          padding: var(--spacing-lg);
        }

        .code-line {
          display: flex;
          min-height: 1.5rem;
          align-items: center;
        }

        .line-number {
          display: inline-block;
          width: 3rem;
          text-align: right;
          color: var(--text-muted);
          user-select: none;
          margin-right: var(--spacing-md);
          flex-shrink: 0;
          border-right: 1px solid var(--border-secondary);
          padding-right: var(--spacing-sm);
          font-size: 0.8rem;
        }

        .line-content {
          flex: 1;
          white-space: pre;
          word-break: break-all;
        }

        .code-expand {
          text-align: center;
          padding: var(--spacing-sm);
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--code-border);
        }

        .expand-button {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .expand-button:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        /* Syntax highlighting colors */
        .language-javascript .line-content,
        .language-typescript .line-content,
        .language-python .line-content,
        .language-java .line-content,
        .language-kotlin .line-content {
          color: var(--code-text);
        }

        /* Enhanced scrollbar for code content */
        .code-content::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        .code-content::-webkit-scrollbar-thumb {
          background: var(--border-secondary);
          border-radius: 4px;
        }

        .code-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Mobile responsive design */
        @media (max-width: 768px) {
          .code-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
          }

          .code-info {
            width: 100%;
            justify-content: space-between;
          }

          .code-actions {
            align-self: flex-end;
            flex-wrap: wrap;
          }

          .code-pre {
            font-size: 0.8rem;
            padding: var(--spacing-sm);
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
            padding: var(--spacing-md);
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
        }

        /* Print styles */
        @media print {
          .code-header,
          .code-expand {
            display: none;
          }

          .code-block-container {
            border: 1px solid #000;
            break-inside: avoid;
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
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;