import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Wifi, WifiOff, ChevronDown } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../utils/constants';

const Header = ({ userPreferences, onPreferencesChange, apiHealthy }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.header-nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header-nav ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-container">
          {/* Brand Logo */}
          <Link to="/" className="header-brand" onClick={closeMobileMenu}>
            <div className="brand-icon">
              <Code2 size={24} />
            </div>
            <div className="brand-content">
              <span className="brand-text">Programming Assistant</span>
              {!apiHealthy && (
                <span className="brand-status offline">
                  <WifiOff size={12} />
                  <span className="status-text">Offline</span>
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main navigation">
            <div className="nav-links">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              ))}
            </div>
            
            {/* API Status Indicator */}
            <div className="nav-status">
              <div className={`status-indicator ${apiHealthy ? 'online' : 'offline'}`}>
                <div className="status-dot" aria-hidden="true"></div>
                <span className="status-label">
                  {apiHealthy ? 'Online' : 'Offline'}
                </span>
                {apiHealthy ? <Wifi size={14} /> : <WifiOff size={14} />}
              </div>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="toggle-icon">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </span>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-overlay"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation */}
        <nav 
          className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <h2 className="mobile-nav-title">Navigation</h2>
              <button
                className="mobile-nav-close"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-nav-links">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-link-content">
                    <span className="mobile-nav-icon" aria-hidden="true">{item.icon}</span>
                    <span className="mobile-nav-text">{item.name}</span>
                  </div>
                  <ChevronDown size={16} className="mobile-nav-chevron" />
                </Link>
              ))}
            </div>
            
            {/* Mobile Status */}
            <div className="mobile-status-section">
              <div className="mobile-status-header">
                <span>System Status</span>
              </div>
              <div className={`mobile-status-indicator ${apiHealthy ? 'online' : 'offline'}`}>
                {apiHealthy ? <Wifi size={20} /> : <WifiOff size={20} />}
                <div className="mobile-status-content">
                  <span className="mobile-status-label">
                    API {apiHealthy ? 'Connected' : 'Disconnected'}
                  </span>
                  <span className="mobile-status-description">
                    {apiHealthy 
                      ? 'All services are operational' 
                      : 'Some features may be limited'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .header-nav {
          background: rgba(15, 20, 25, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-secondary);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all var(--transition-fast);
          padding-top: var(--mobile-safe-area-top);
        }

        .header-scrolled {
          background: rgba(15, 20, 25, 0.98);
          box-shadow: var(--shadow-lg);
          border-bottom-color: var(--border-primary);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          min-height: 60px;
          position: relative;
        }

        /* Brand Section */
        .header-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          color: var(--text-primary);
          transition: all var(--transition-fast);
          min-height: 48px;
          min-width: auto;
          padding: var(--spacing-xs);
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .header-brand:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: none;
        }

        .brand-icon {
          color: var(--text-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .brand-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-text {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
        }

        .brand-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .brand-status.offline {
          color: #fc8181;
        }

        .status-text {
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Desktop Navigation */
        .desktop-nav {
          display: none;
          align-items: center;
          gap: var(--spacing-xl);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          position: relative;
          min-height: 44px;
          font-size: var(--font-size-sm);
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .nav-link.active {
          color: var(--text-primary);
          background: rgba(102, 126, 234, 0.15);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: var(--accent-gradient);
          border-radius: 2px;
        }

        .nav-icon {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .nav-text {
          font-size: var(--font-size-sm);
          font-weight: 500;
        }

        .nav-status {
          margin-left: var(--spacing-md);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }

        .status-indicator.online {
          background: rgba(72, 187, 120, 0.2);
          color: #9ae6b4;
          border-color: rgba(72, 187, 120, 0.3);
        }

        .status-indicator.offline {
          background: rgba(245, 101, 101, 0.2);
          color: #fc8181;
          border-color: rgba(245, 101, 101, 0.3);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 2px solid var(--border-secondary);
          color: var(--text-primary);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          min-height: 48px;
          min-width: 48px;
          position: relative;
          z-index: 1001;
        }

        .mobile-menu-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: var(--border-accent);
          transform: scale(1.05);
        }

        .mobile-menu-toggle:focus {
          outline: 2px solid var(--border-accent);
          outline-offset: 2px;
        }

        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Mobile Navigation */
        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 400px;
          height: 100vh;
          height: 100dvh;
          background: var(--bg-secondary);
          border-left: 1px solid var(--border-secondary);
          z-index: 1000;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          box-shadow: var(--shadow-xl);
        }

        .mobile-nav.open {
          right: 0;
        }

        .mobile-nav-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--spacing-lg);
          padding-top: calc(var(--spacing-lg) + var(--mobile-safe-area-top));
        }

        .mobile-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--border-secondary);
        }

        .mobile-nav-title {
          color: var(--text-primary);
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin: 0;
        }

        .mobile-nav-close {
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

        .mobile-nav-close:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-accent);
        }

        .mobile-nav-links {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          text-decoration: none;
          color: var(--text-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          min-height: 56px;
          border: 1px solid transparent;
          position: relative;
        }

        .mobile-nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-secondary);
          transform: translateX(4px);
        }

        .mobile-nav-link.active {
          background: var(--accent-gradient);
          color: var(--text-primary);
          border-color: var(--border-accent);
          box-shadow: var(--shadow-md);
        }

        .mobile-link-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .mobile-nav-icon {
          font-size: 1.25rem;
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-nav-text {
          font-size: var(--font-size-base);
          font-weight: 500;
        }

        .mobile-nav-chevron {
          opacity: 0.5;
          transition: transform var(--transition-fast);
        }

        .mobile-nav-link:hover .mobile-nav-chevron {
          transform: translateX(4px);
          opacity: 1;
        }

        /* Mobile Status Section */
        .mobile-status-section {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-secondary);
        }

        .mobile-status-header {
          margin-bottom: var(--spacing-md);
          color: var(--text-muted);
          font-size: var(--font-size-sm);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mobile-status-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid;
        }

        .mobile-status-indicator.online {
          background: rgba(72, 187, 120, 0.1);
          color: #9ae6b4;
          border-color: rgba(72, 187, 120, 0.3);
        }

        .mobile-status-indicator.offline {
          background: rgba(245, 101, 101, 0.1);
          color: #fc8181;
          border-color: rgba(245, 101, 101, 0.3);
        }

        .mobile-status-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-status-label {
          font-weight: 600;
          font-size: var(--font-size-sm);
        }

        .mobile-status-description {
          font-size: var(--font-size-xs);
          opacity: 0.8;
        }

        /* Tablet and Desktop Styles */
        @media (min-width: 768px) {
          .header-container {
            padding: var(--spacing-md) 0;
          }

          .brand-text {
            font-size: 1.25rem;
          }

          .desktop-nav {
            display: flex;
          }

          .mobile-menu-toggle {
            display: none;
          }

          .mobile-nav {
            display: none !important;
          }

          .mobile-overlay {
            display: none;
          }

          .nav-text {
            font-size: var(--font-size-base);
          }

          .status-indicator {
            font-size: var(--font-size-xs);
          }
        }

        @media (min-width: 1024px) {
          .brand-text {
            font-size: 1.5rem;
          }

          .desktop-nav {
            gap: var(--spacing-2xl);
          }

          .nav-links {
            gap: var(--spacing-xl);
          }

          .nav-link {
            padding: var(--spacing-md) var(--spacing-lg);
            font-size: var(--font-size-base);
          }

          .nav-icon {
            font-size: 1.2rem;
          }
        }

        /* Very small screens */
        @media (max-width: 380px) {
          .brand-text {
            font-size: 0.9rem;
          }

          .brand-status {
            display: none;
          }

          .mobile-nav {
            width: 95%;
          }

          .mobile-nav-content {
            padding: var(--spacing-md);
          }

          .mobile-nav-link {
            padding: var(--spacing-md);
            min-height: 52px;
          }
        }

        /* Landscape mobile optimization */
        @media (max-width: 768px) and (orientation: landscape) {
          .header-container {
            padding: var(--spacing-xs) 0;
            min-height: 52px;
          }

          .mobile-nav {
            height: 100vh;
          }

          .mobile-nav-content {
            padding: var(--spacing-md);
          }

          .mobile-nav-link {
            min-height: 48px;
            padding: var(--spacing-sm) var(--spacing-md);
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .header-nav {
            border-bottom-width: 2px;
          }

          .nav-link, .mobile-nav-link {
            border-width: 2px;
          }

          .status-indicator {
            border-width: 2px;
          }
        }

        /* Animation for fade in */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Focus management for accessibility */
        .mobile-nav.open .mobile-nav-link:first-child {
          scroll-margin-top: var(--spacing-lg);
        }

        /* Prevent body scroll when mobile menu is open */
        .mobile-nav.open ~ * {
          filter: blur(2px);
          pointer-events: none;
        }
      `}</style>
    </header>
  );
};

export default Header;