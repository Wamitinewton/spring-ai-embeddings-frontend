import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Wifi, WifiOff } from 'lucide-react'; // Removed unused Zap import
import { NAVIGATION_ITEMS } from '../../utils/constants';

const Header = ({ userPreferences, onPreferencesChange, apiHealthy }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
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
            <Code2 size={24} />
            <span className="brand-text">Programming Assistant</span>
            {!apiHealthy && (
              <span className="status-indicator status-offline">
                <WifiOff size={12} />
                Offline
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links">
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
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          padding: var(--spacing-md) 0;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .nav-brand:hover {
          color: var(--text-accent);
        }

        .brand-text {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          position: relative;
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
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--accent-gradient);
          border-radius: 1px;
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .mobile-nav-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .mobile-nav-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .mobile-nav {
          display: none;
        }

        .mobile-status {
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-secondary);
          margin-top: var(--spacing-md);
        }

        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
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
          margin-left: var(--spacing-sm);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .nav-links:not(.mobile-nav) {
            display: none;
          }

          .mobile-nav-toggle {
            display: block;
          }

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
            gap: var(--spacing-sm);
            box-shadow: var(--shadow-lg);
          }

          .mobile-nav.open {
            display: flex;
          }

          .mobile-nav .nav-link {
            width: 100%;
            justify-content: flex-start;
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
          }

          .mobile-nav .nav-link.active::after {
            display: none;
          }

          .mobile-nav .nav-link.active {
            background: var(--accent-gradient);
          }

          .brand-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: var(--spacing-sm) 0;
          }

          .nav-brand {
            font-size: 1.1rem;
          }

          .status-offline {
            margin-left: var(--spacing-xs);
            padding: 2px var(--spacing-xs);
            font-size: 0.65rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;