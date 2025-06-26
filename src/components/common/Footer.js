import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Heart, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  ExternalLink
} from 'lucide-react';
import { APP_INFO, SOCIAL_LINKS } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="footer-brand">
              <Code2 size={24} />
              <span className="brand-text">Programming Assistant</span>
            </div>
            <p className="footer-description">
              AI-powered programming companion helping developers learn, code, and grow 
              across multiple programming languages.
            </p>
            <div className="social-links">
              <a 
                href={SOCIAL_LINKS.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href={SOCIAL_LINKS.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href={SOCIAL_LINKS.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="social-link"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/chatbot">AI Chatbot</Link></li>
              <li><Link to="/quiz">Programming Quiz</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="footer-section">
            <h3 className="footer-title">Features</h3>
            <ul className="footer-links">
              <li>Multi-language Support</li>
              <li>AI-powered Assistance</li>
              <li>Interactive Quizzes</li>
              <li>Code Examples</li>
              <li>Random Facts</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://docs.spring.io/spring-ai/docs/current/reference/html/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Spring AI Docs
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a 
                  href="https://platform.openai.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  OpenAI API
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a 
                  href="https://qdrant.tech/documentation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Qdrant Vector DB
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a 
                  href="https://redis.io/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Redis Documentation
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Programming Assistant. Built with{' '}
              <Heart size={16} className="heart-icon" />{' '}
              using Spring AI, React, and modern web technologies.
            </p>
            <div className="footer-meta">
              <span className="version">v{APP_INFO.version}</span>
              <span className="tech-stack">
                Spring Boot • React • OpenAI • Qdrant • Redis
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-secondary);
          margin-top: auto;
          padding: var(--spacing-2xl) 0 var(--spacing-xl);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--spacing-2xl);
          margin-bottom: var(--spacing-xl);
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .brand-section {
          max-width: 350px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-md);
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border-radius: 50%;
          transition: all var(--transition-fast);
          text-decoration: none;
          border: 1px solid var(--border-secondary);
        }

        .social-link:hover {
          background: var(--accent-gradient);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .footer-title {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.9rem;
        }

        .footer-links a:hover {
          color: var(--text-accent);
        }

        .footer-links li:not(:has(a)) {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer-bottom {
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-secondary);
        }

        .footer-bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .copyright {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .heart-icon {
          color: #f56565;
          animation: heartbeat 2s ease-in-out infinite;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .version {
          background: var(--bg-tertiary);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-secondary);
        }

        .tech-stack {
          font-family: var(--font-mono);
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-xl);
          }
        }

        @media (max-width: 768px) {
          .footer {
            padding: var(--spacing-xl) 0 var(--spacing-md);
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
            text-align: center;
          }

          .brand-section {
            max-width: none;
          }

          .social-links {
            justify-content: center;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-sm);
          }

          .footer-meta {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: var(--spacing-lg) 0 var(--spacing-sm);
          }

          .footer-content {
            gap: var(--spacing-md);
          }

          .social-links {
            gap: var(--spacing-sm);
          }

          .social-link {
            width: 2rem;
            height: 2rem;
          }

          .copyright {
            font-size: 0.8rem;
          }

          .footer-meta {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;