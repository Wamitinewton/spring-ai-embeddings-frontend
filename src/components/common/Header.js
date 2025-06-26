import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Wifi, WifiOff } from 'lucide-react';
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
      if (isMobileMenuOpen && !event.target.closest('.nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

  return (
    <header className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="container">
        <div className="nav-container">
          {/* Brand Logo */}
          <Link to="/" className="nav-brand">
            <Code2 size={20} />
            <span className="brand-text">Programming Assistant</span>
            {!apiHealthy && (
              <span className="status-indicator status-offline">
                <WifiOff size={10} />
                <span className="hidden-mobile">Offline</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links desktop-nav">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            ))}
            
            {/* API Status Indicator */}
            <div className={`status-indicator ${apiHealthy ? 'status-online' : 'status-offline'}`}>
              <div className="status-dot"></div>
              {apiHealthy ? 'Online' : 'Offline'}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-links mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
          
          {/* Mobile API Status */}
          <div className="mobile-status">
            <div className={`status-indicator ${apiHealthy ? 'status-online' : 'status-offline'}`}>
              {apiHealthy ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span>API {apiHealthy ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .nav {
          background: rgba(26, 32, 44, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-secondary);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all var(--transition-fast);
        }

        .nav-scrolled {
          background: rgba(15, 20, 25, 0.98);
          box-shadow: var(--shadow-lg);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) 0; /* Reduced padding on mobile */
          min-height: 60px; /* Fixed height for consistency */
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs); /* Smaller gap on mobile */
          font-size: var(--font-size-base); /* Smaller on mobile */
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--transition-fast);
          min-height: 44px; /* Touch target */
        }

        .nav-brand:hover {
          color: var(--text-accent);
        }

        .brand-text {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: var(--font-size-sm); /* Smaller on mobile */
        }

        /* Desktop Navigation */
        .desktop-nav {
          display: none; /* Hidden on mobile */
          align-items: center;
          gap: var(--spacing-lg);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          position: relative;
          min-height: 44px; /* Touch target */
          font-size: var(--font-size-sm);
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(102, 126, 234, 0.1);
        }

        .nav-link.active {
          color: var(--text-primary);
          background: rgba(102, 126, 234, 0.15);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--accent-gradient);
          border-radius: 1px;
        }

        .nav-icon {
          font-size: 1rem;
        }

        .nav-text {
          font-size: var(--font-size-sm);
        }

        /* Mobile Menu Toggle */
        .mobile-nav-toggle {
          display: flex; /* Visible on mobile */
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border-secondary);
          color: var(--text-primary);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          min-height: 44px;
          min-width: 44px;
        }

        .mobile-nav-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: var(--border-accent);
        }

        /* Mobile Navigation */
        .mobile-nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          flex-direction: column;
          padding: var(--spacing-md);
          border-top: 1px solid var(--border-secondary);
          gap: var(--spacing-xs);
          box-shadow: var(--shadow-lg);
          max-height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .mobile-nav.open {
          display: flex;
        }

        .mobile-nav .nav-link {
          width: 100%;
          justify-content: flex-start;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          min-height: 48px;
        }

        .mobile-nav .nav-link.active::after {
          display: none;
        }

        .mobile-nav .nav-link.active {
          background: var(--accent-gradient);
          color: var(--text-primary);
        }

        .mobile-nav .nav-icon {
          font-size: 1.1rem;
        }

        .mobile-status {
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-secondary);
          margin-top: var(--spacing-sm);
        }

        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all var(--transition-fast);
        }

        .status-online {
          background: rgba(72, 187, 120, 0.2);
          color: #9ae6b4;
          border: 1px solid rgba(72, 187, 120, 0.3);
        }

        .status-offline {
          background: rgba(245, 101, 101, 0.2);
          color: #fc8181;
          border: 1px solid rgba(245, 101, 101, 0.3);
        }

        .status-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Tablet and Desktop Styles */
        @media (min-width: 768px) {
          .nav-container {
            padding: var(--spacing-md) 0;
          }

          .nav-brand {
            gap: var(--spacing-sm);
            font-size: var(--font-size-lg);
          }

          .brand-text {
            font-size: var(--font-size-base);
          }

          .desktop-nav {
            display: flex; /* Show on tablet+ */
          }

          .mobile-nav-toggle {
            display: none; /* Hide on tablet+ */
          }

          .mobile-nav {
            display: none !important; /* Hide mobile nav on tablet+ */
          }

          .nav-link {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: var(--font-size-base);
          }

          .nav-text {
            font-size: var(--font-size-base);
          }

          .status-indicator {
            font-size: var(--font-size-xs);
          }

          .status-dot {
            width: 6px;
            height: 6px;
          }
        }

        @media (min-width: 1024px) {
          .nav-brand {
            font-size: var(--font-size-xl);
          }

          .brand-text {
            font-size: var(--font-size-lg);
          }

          .desktop-nav {
            gap: var(--spacing-xl);
          }

          .nav-link {
            padding: var(--spacing-md) var(--spacing-lg);
            font-size: var(--font-size-base);
          }

          .nav-icon {
            font-size: 1.1rem;
          }
        }

        /* Hide text on very small screens */
        @media (max-width: 480px) {
          .brand-text {
            display: none;
          }

          .nav-brand {
            gap: var(--spacing-xs);
          }

          .status-offline span:not(.hidden-mobile) {
            display: none;
          }

          .mobile-nav-toggle {
            min-height: 40px;
            min-width: 40px;
          }

          .nav-container {
            padding: var(--spacing-xs) 0;
            min-height: 56px;
          }
        }

        /* Landscape mobile optimization */
        @media (max-width: 768px) and (orientation: landscape) {
          .nav-container {
            padding: var(--spacing-xs) 0;
            min-height: 50px;
          }

          .mobile-nav {
            max-height: calc(100vh - 60px);
          }

          .mobile-nav .nav-link {
            min-height: 44px;
            padding: var(--spacing-sm) var(--spacing-md);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;