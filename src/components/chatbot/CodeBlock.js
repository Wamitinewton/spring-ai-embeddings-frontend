import React, { useState } from 'react';
import { Copy, Check, Code, Download } from 'lucide-react';
import { copyToClipboard, getLanguageInfo } from '../../utils/helpers';
import { CODE_LANGUAGES } from '../../utils/constants';

const CodeBlock = ({ 
  code, 
  language = 'text', 
  filename = null,
  description = null,
  showLineNumbers = true,
  maxHeight = '400px',
  allowDownload = false
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const languageInfo = getLanguageInfo(language);
  const displayLanguage = CODE_LANGUAGES[language.toLowerCase()] || language;

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
      bash: 'sh'
    };
    return extensions[lang] || 'txt';
  };

  const formatCode = (code) => {
    if (!showLineNumbers) return code;
    
    return code.split('\n').map((line, index) => (
      <div key={index} className="code-line">
        <span className="line-number">{index + 1}</span>
        <span className="line-content">{line || ' '}</span>
      </div>
    ));
  };

  const shouldShowExpandButton = code.split('\n').length > 15;

  return (
    <div className="code-block-container">
      {(description || filename) && (
        <div className="code-description">
          {filename && (
            <div className="code-filename">
              <Code size={16} />
              {filename}
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
              {languageInfo.icon} {languageInfo.name}
            </span>
            <span className="code-lines">
              {code.split('\n').length} lines
            </span>
          </div>
          
          <div className="code-actions">
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
              className="code-action-btn"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div 
          className={`code-content ${!expanded && shouldShowExpandButton ? 'collapsed' : ''}`}
          style={{
            maxHeight: !expanded && shouldShowExpandButton ? '300px' : maxHeight
          }}
        >
          <pre className="code-pre">
            <code className={`language-${displayLanguage}`}>
              {showLineNumbers ? formatCode(code) : code}
            </code>
          </pre>
        </div>
        
        {shouldShowExpandButton && (
          <div className="code-expand">
            <button
              className="expand-button"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show Less' : 'Show More'}
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
          gap: var(--spacing-md);
        }

        .code-language {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-accent);
        }

        .code-lines {
          font-size: 0.75rem;
          color: var(--text-muted);
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
        }

        .code-action-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .code-content {
          overflow: hidden;
          transition: max-height var(--transition-normal);
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

        .code-line {
          display: flex;
          min-height: 1.5rem;
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

        /* Responsive design */
        @media (max-width: 768px) {
          .code-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
          }

          .code-actions {
            align-self: flex-end;
          }

          .code-pre {
            font-size: 0.8rem;
            padding: var(--spacing-sm);
          }

          .line-number {
            width: 2.5rem;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .code-info {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }

          .code-action-btn {
            font-size: 0.7rem;
            padding: 2px var(--spacing-xs);
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;