import React from 'react';
import { AlertTriangle, X, RefreshCw, AlertCircle, Info } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  type = 'error',
  onRetry = null,
  onDismiss = null,
  showIcon = true,
  className = '',
  fullWidth = false
}) => {
  const typeConfig = {
    error: {
      icon: AlertTriangle,
      className: 'error-message',
      color: 'error'
    },
    warning: {
      icon: AlertCircle,
      className: 'warning-message',
      color: 'warning'
    },
    info: {
      icon: Info,
      className: 'info-message',
      color: 'info'
    }
  };

  const config = typeConfig[type] || typeConfig.error;
  const IconComponent = config.icon;

  return (
    <div className={`message ${config.className} ${fullWidth ? 'full-width' : ''} ${className}`}>
      <div className="message-content">
        {showIcon && <IconComponent className="message-icon" size={20} />}
        <div className="message-text">
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            message
          )}
        </div>
      </div>
      
      <div className="message-actions">
        {onRetry && (
          <button 
            className="retry-button"
            onClick={onRetry}
            title="Retry"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        )}
        {onDismiss && (
          <button 
            className="dismiss-button"
            onClick={onDismiss}
            title="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <style jsx>{`
        .message {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border-left: 4px solid;
          margin: var(--spacing-md) 0;
          backdrop-filter: blur(10px);
          transition: all var(--transition-fast);
        }

        .message.full-width {
          width: 100%;
        }

        .message-content {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          flex: 1;
        }

        .message-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .message-text {
          flex: 1;
          line-height: 1.5;
        }

        .message-text p {
          margin: 0;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .message-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-shrink: 0;
        }

        .retry-button,
        .dismiss-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: transparent;
          border: 1px solid transparent;
          color: currentColor;
          cursor: pointer;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .retry-button:hover,
        .dismiss-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: currentColor;
        }

        .dismiss-button {
          padding: var(--spacing-xs);
          border-radius: 50%;
        }

        /* Error styling */
        .error-message {
          background: rgba(245, 101, 101, 0.1);
          border-left-color: #f56565;
          color: #fc8181;
        }

        .error-message .message-icon {
          color: #f56565;
        }

        /* Warning styling */
        .warning-message {
          background: rgba(237, 137, 54, 0.1);
          border-left-color: #ed8936;
          color: #fbb6ce;
        }

        .warning-message .message-icon {
          color: #ed8936;
        }

        /* Info styling */
        .info-message {
          background: rgba(102, 126, 234, 0.1);
          border-left-color: #667eea;
          color: #a5b4fc;
        }

        .info-message .message-icon {
          color: #667eea;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .message {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .message-actions {
            align-self: flex-end;
          }

          .retry-button {
            font-size: 0.7rem;
            padding: var(--spacing-xs);
          }
        }
      `}</style>
    </div>
  );
};

// Specialized error components
export const NetworkError = ({ onRetry }) => (
  <ErrorMessage
    type="error"
    message="Unable to connect to the server. Please check your internet connection."
    onRetry={onRetry}
    showIcon={true}
  />
);

export const ValidationError = ({ errors }) => (
  <ErrorMessage
    type="warning"
    message={
      <div>
        <p>Please fix the following errors:</p>
        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
          {Object.entries(errors).map(([field, error]) => (
            <li key={field} style={{ marginBottom: '0.25rem' }}>
              <strong>{field}:</strong> {error}
            </li>
          ))}
        </ul>
      </div>
    }
    showIcon={true}
  />
);

export const SessionExpiredError = ({ onRetry }) => (
  <ErrorMessage
    type="warning"
    message="Your session has expired. Please start a new session to continue."
    onRetry={onRetry}
    showIcon={true}
  />
);

export const ServerError = ({ onRetry }) => (
  <ErrorMessage
    type="error"
    message="Server is currently unavailable. Please try again later."
    onRetry={onRetry}
    showIcon={true}
  />
);

export default ErrorMessage;