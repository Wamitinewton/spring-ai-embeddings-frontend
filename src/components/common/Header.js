import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Wifi, WifiOff, ChevronRight } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../utils/constants';

const Header = ({ userPreferences, onPreferencesChange, apiHealthy }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
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
        closeMobileMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
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
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const openMobileMenu = () => {
    setIsMenuAnimating(true);
    setIsMobileMenuOpen(true);
    setTimeout(() => setIsMenuAnimating(false), 300);
  };

  const closeMobileMenu = () => {
    setIsMenuAnimating(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => setIsMenuAnimating(false), 300);
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
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

          {/* Enhanced Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="hamburger">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div 
            className={`mobile-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* Enhanced Mobile Navigation */}
        <nav 
          className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''} ${isMenuAnimating ? 'animating' : ''}`}
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <div className="mobile-nav-brand">
                <Code2 size={20} />
                <span>Navigation</span>
              </div>
              <button
                className="mobile-nav-close"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-nav-links">
              {NAVIGATION_ITEMS.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                  style={{ 
                    animationDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms' 
                  }}
                >
                  <div className="mobile-link-content">
                    <div className="mobile-nav-icon-wrapper">
                      <span className="mobile-nav-icon" aria-hidden="true">{item.icon}</span>
                    </div>
                    <div className="mobile-nav-text-wrapper">
                      <span className="mobile-nav-text">{item.name}</span>
                      {isActivePath(item.path) && (
                        <span className="mobile-nav-active-indicator">Current page</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </Link>
              ))}
            </div>
            
            {/* Enhanced Mobile Status */}
            <div className="mobile-status-section">
              <div className="mobile-status-header">
                <span>System Status</span>
              </div>
              <div className={`mobile-status-indicator ${apiHealthy ? 'online' : 'offline'}`}>
                <div className="mobile-status-icon">
                  {apiHealthy ? <Wifi size={20} /> : <WifiOff size={20} />}
                </div>
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
                <div className={`mobile-status-pulse ${apiHealthy ? 'online' : 'offline'}`}></div>
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding-top: var(--mobile-safe-area-top);
        }

        .header-scrolled {
          background: rgba(15, 20, 25, 0.98);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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

        /* Enhanced Brand Section */
        .header-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.2s ease-out;
          min-height: 48px;
          padding: var(--spacing-xs);
          border-radius: var(--radius-md);
          flex-shrink: 0;
          position: relative;
        }

        .header-brand:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .brand-icon {
          color: var(--text-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease-out;
        }

        .header-brand:hover .brand-icon {
          transform: rotate(5deg) scale(1.05);
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
          font-size: clamp(0.9rem, 4vw, 1.1rem);
          font-weight: 700;
          line-height: 1.1;
          white-space: nowrap;
          transition: font-size 0.2s ease-out;
        }

        .brand-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          opacity: 0.8;
          transition: opacity 0.2s ease-out;
        }

        .brand-status.offline {
          color: #fc8181;
          animation: pulse-warning 2s infinite;
        }

        @keyframes pulse-warning {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
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
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          min-height: 44px;
          font-size: var(--font-size-sm);
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
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
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { width: 0; opacity: 0; }
          to { width: 24px; opacity: 1; }
        }

        .nav-icon {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease-out;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.1);
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
          transition: all 0.2s ease-out;
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
          animation: status-pulse 2s infinite;
        }

        @keyframes status-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        /* Enhanced Mobile Menu Toggle */
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

        /* Hamburger Animation */
        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 20px;
          height: 16px;
          position: relative;
        }

        .hamburger-line {
          width: 100%;
          height: 2px;
          background: currentColor;
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .mobile-menu-toggle.open .hamburger-line:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .mobile-menu-toggle.open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .mobile-menu-toggle.open .hamburger-line:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Enhanced Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 999;
          opacity: 0;
          animation: overlayFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          backdrop-filter: blur(4px);
        }

        .mobile-overlay.visible {
          opacity: 1;
        }

        @keyframes overlayFadeIn {
          from { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1;
            backdrop-filter: blur(4px);
          }
        }

        /* Enhanced Mobile Navigation */
        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: min(85%, 400px);
          height: 100vh;
          height: 100dvh;
          background: var(--bg-secondary);
          border-left: 1px solid var(--border-secondary);
          z-index: 1000;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.3);
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

        .mobile-nav-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-primary);
          font-size: var(--font-size-lg);
          font-weight: 600;
        }

        .mobile-nav-close {
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease-out;
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
          transform: scale(1.05);
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 60px;
          border: 1px solid transparent;
          position: relative;
          opacity: 0;
          transform: translateX(20px);
          animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .mobile-nav.open .mobile-nav-link {
          opacity: 1;
          transform: translateX(0);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-secondary);
          transform: translateX(4px);
        }

        .mobile-nav-link.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(159, 122, 234, 0.2));
          color: var(--text-primary);
          border-color: var(--border-accent);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
        }

        .mobile-link-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .mobile-nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(102, 126, 234, 0.1);
          transition: all 0.2s ease-out;
        }

        .mobile-nav-link:hover .mobile-nav-icon-wrapper {
          background: rgba(102, 126, 234, 0.2);
          transform: scale(1.1);
        }

        .mobile-nav-link.active .mobile-nav-icon-wrapper {
          background: rgba(102, 126, 234, 0.3);
        }

        .mobile-nav-icon {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-nav-text-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-nav-text {
          font-size: var(--font-size-base);
          font-weight: 500;
          line-height: 1.2;
        }

        .mobile-nav-active-indicator {
          font-size: var(--font-size-xs);
          color: var(--text-accent);
          opacity: 0.8;
          font-weight: 400;
        }

        .mobile-nav-chevron {
          opacity: 0.5;
          transition: all 0.2s ease-out;
        }

        .mobile-nav-link:hover .mobile-nav-chevron {
          transform: translateX(4px);
          opacity: 1;
        }

        /* Enhanced Mobile Status Section */
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
          position: relative;
          overflow: hidden;
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

        .mobile-status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease-out;
        }

        .mobile-status-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .mobile-status-label {
          font-weight: 600;
          font-size: var(--font-size-sm);
        }

        .mobile-status-description {
          font-size: var(--font-size-xs);
          opacity: 0.8;
          line-height: 1.3;
        }

        .mobile-status-pulse {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        .mobile-status-pulse.online {
          animation: status-pulse-mobile 2s infinite;
        }

        .mobile-status-pulse.offline {
          animation: status-pulse-warning 1.5s infinite;
        }

        @keyframes status-pulse-mobile {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }

        @keyframes status-pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Responsive Breakpoints */
        @media (min-width: 768px) {
          .header-container {
            padding: var(--spacing-md) 0;
          }

          .brand-text {
            font-size: clamp(1.1rem, 3vw, 1.25rem);
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
            font-size: clamp(1.25rem, 2.5vw, 1.5rem);
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

        /* Very small screens optimization */
        @media (max-width: 380px) {
          .header-container {
            padding: var(--spacing-xs) 0;
          }

          .brand-text {
            font-size: clamp(0.8rem, 5vw, 0.9rem);
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
            min-height: 56px;
          }

          .mobile-nav-icon-wrapper {
            width: 36px;
            height: 36px;
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
            min-height: 52px;
            padding: var(--spacing-md);
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

          .mobile-status-indicator {
            border-width: 2px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .status-dot,
          .mobile-status-pulse,
          .brand-status.offline {
            animation: none !important;
          }
        }

        /* Focus management for accessibility */
        .mobile-nav.open .mobile-nav-link:first-child {
          scroll-margin-top: var(--spacing-lg);
        }

        /* Prevent scroll when mobile menu is open */
        body:has(.mobile-nav.open) {
          overflow: hidden;
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .header-nav {
            background: rgba(10, 15, 20, 0.95);
          }
          
          .header-scrolled {
            background: rgba(10, 15, 20, 0.98);
          }
          
          .mobile-nav {
            background: rgba(15, 20, 25, 0.98);
            backdrop-filter: blur(20px);
          }
        }

        /* Print styles */
        @media print {
          .header-nav {
            position: static;
            background: transparent;
            border-bottom: 1px solid #000;
            box-shadow: none;
          }
          
          .mobile-menu-toggle,
          .nav-status,
          .mobile-nav {
            display: none !important;
          }
          
          .brand-text {
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;