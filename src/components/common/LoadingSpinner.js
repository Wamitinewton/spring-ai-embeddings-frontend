import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  showMessage = true,
  color = 'primary',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  };

  const SpinnerComponent = () => (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''} ${className}`}>
      <div className="loading-content">
        <Loader2 
          className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {showMessage && message && (
          <p className="loading-message">{message}</p>
        )}
      </div>

      <style jsx>{`
        .loading-spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-md);
        }

        .loading-spinner-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 20, 25, 0.8);
          backdrop-filter: blur(4px);
          z-index: 1000;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
          text-align: center;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        .loading-message {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          max-width: 300px;
        }

        .w-4 { width: 1rem; height: 1rem; }
        .w-6 { width: 1.5rem; height: 1.5rem; }
        .w-8 { width: 2rem; height: 2rem; }
        .w-12 { width: 3rem; height: 3rem; }

        .text-blue-500 { color: #667eea; }
        .text-gray-500 { color: var(--text-muted); }
        .text-green-500 { color: #48bb78; }
        .text-yellow-500 { color: #ed8936; }
        .text-red-500 { color: #f56565; }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .loading-message {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );

  return <SpinnerComponent />;
};

// Alternative dot-based loading spinner
export const LoadingDots = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500', 
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className="loading-dots">
      <div className={`loading-dot ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      <div className={`loading-dot ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      <div className={`loading-dot ${sizeClasses[size]} ${colorClasses[color]}`}></div>

      <style jsx>{`
        .loading-dots {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }

        .loading-dot {
          border-radius: 50%;
          animation: loadingDots 1.4s ease-in-out infinite both;
        }

        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }

        .w-1 { width: 0.25rem; height: 0.25rem; }
        .w-2 { width: 0.5rem; height: 0.5rem; }
        .w-3 { width: 0.75rem; height: 0.75rem; }

        .bg-blue-500 { background-color: #667eea; }
        .bg-gray-500 { background-color: var(--text-muted); }
        .bg-green-500 { background-color: #48bb78; }
        .bg-yellow-500 { background-color: #ed8936; }
        .bg-red-500 { background-color: #f56565; }

        @keyframes loadingDots {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const SkeletonLoader = ({ lines = 3, width = '100%', height = '1rem' }) => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="skeleton-line"
          style={{
            width: Array.isArray(width) ? width[index] || '100%' : width,
            height: height
          }}
        ></div>
      ))}

      <style jsx>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .skeleton-line {
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            var(--border-primary) 50%,
            var(--bg-tertiary) 75%
          );
          background-size: 200% 100%;
          border-radius: var(--radius-sm);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;