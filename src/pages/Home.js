import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code2, 
  Zap, 
  Brain, 
  Target,
  Users,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FEATURES, PROGRAMMING_LANGUAGES } from '../utils/constants';
import { formatNumber } from '../utils/helpers';
import { apiMethods, endpoints } from '../services/api';

const Home = ({ userPreferences, apiHealthy }) => {
  const [appInfo, setAppInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (apiHealthy) {
          // Load application info and stats
          const [infoResponse, healthResponse] = await Promise.all([
            apiMethods.get(endpoints.info).catch(() => null),
            apiMethods.get(endpoints.health).catch(() => null)
          ]);

          setAppInfo(infoResponse);
          
          // Mock stats for demo (replace with real API when available)
          setStats({
            totalQuestions: 1250,
            activeUsers: 89,
            languagesSupported: PROGRAMMING_LANGUAGES.length,
            successRate: 94
          });
        }
      } catch (err) {
        setError('Failed to load application information');
        console.error('Home data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [apiHealthy]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner 
            size="large" 
            message="Loading Programming Assistant..." 
            fullScreen={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero animate-fade-in-up">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Programming Assistant
            </h1>
            <p className="hero-subtitle">
              Get instant help with coding questions, test your knowledge with interactive quizzes, 
              and discover fascinating programming facts across multiple languages.
            </p>
            
            <div className="hero-actions">
              <Link to="/chatbot" className="btn btn-primary btn-lg">
                <Brain size={20} />
                Start Coding Chat
                <ArrowRight size={16} />
              </Link>
              <Link to="/quiz" className="btn btn-secondary btn-lg">
                <Target size={20} />
                Take a Quiz
              </Link>
            </div>

            {!apiHealthy && (
              <ErrorMessage
                type="warning"
                message="Backend server is not connected. Some features may be limited."
                className="hero-warning"
              />
            )}
          </div>
        </section>

        {/* Stats Section */}
        {stats && (
          <section className="stats-section animate-fade-in-up">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{formatNumber(stats.totalQuestions)}</div>
                <div className="stat-label">Questions Answered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.activeUsers}</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.languagesSupported}</div>
                <div className="stat-label">Languages Supported</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.successRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">
              <Zap size={32} />
              Powerful Features
            </h2>
            <p className="section-description">
              Everything you need to enhance your programming journey, powered by advanced AI.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div 
                key={feature.id} 
                className="feature-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                
                <ul className="feature-list">
                  {feature.features.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                
                <div className="feature-action">
                  <Link to={feature.path} className="btn btn-primary">
                    Try it now
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages Section */}
        <section className="languages-section">
          <div className="section-header">
            <h2 className="section-title">
              <Code2 size={32} />
              Supported Programming Languages
            </h2>
            <p className="section-description">
              Get expert assistance across a wide range of programming languages.
            </p>
          </div>

          <div className="languages-grid">
            {PROGRAMMING_LANGUAGES.map((language, index) => (
              <div 
                key={language.code}
                className="language-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="language-icon">{language.icon}</div>
                <div className="language-name">{language.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="section-header">
            <h2 className="section-title">
              <Users size={32} />
              How It Works
            </h2>
            <p className="section-description">
              Get started in three simple steps and unlock the power of AI-assisted programming.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Ask Your Question</h3>
                <p>Type any programming question or challenge you're facing.</p>
              </div>
              <div className="step-icon">
                <Brain size={24} />
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Get AI-Powered Answer</h3>
                <p>Receive detailed explanations with code examples and best practices.</p>
              </div>
              <div className="step-icon">
                <Zap size={24} />
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Test Your Knowledge</h3>
                <p>Take quizzes to reinforce your learning and track progress.</p>
              </div>
              <div className="step-icon">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Enhance Your Coding Skills?</h2>
            <p>Join thousands of developers who are already using our AI-powered assistant.</p>
            <div className="cta-actions">
              <Link to="/chatbot" className="btn btn-primary btn-lg">
                Get Started Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
            className="home-error"
          />
        )}
      </div>

      <style jsx>{`
        .hero {
          text-align: center;
          padding: var(--spacing-2xl) 0;
          background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
          border-radius: var(--radius-xl);
          margin-bottom: var(--spacing-2xl);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-lg);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-warning {
          margin-top: var(--spacing-lg);
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .stats-section {
          margin-bottom: var(--spacing-2xl);
        }

        .features-section,
        .languages-section,
        .how-it-works {
          margin-bottom: var(--spacing-2xl);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .section-title {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
        }

        .section-description {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .languages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-top: var(--spacing-xl);
        }

        .language-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .language-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-accent);
        }

        .language-icon {
          font-size: 2rem;
        }

        .language-name {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-xl);
          margin-top: var(--spacing-xl);
        }

        .step-card {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-lg);
          padding: var(--spacing-xl);
          background: var(--bg-card);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .step-number {
          width: 3rem;
          height: 3rem;
          background: var(--accent-gradient);
          color: var(--text-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
        }

        .step-content h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          font-size: 1.25rem;
        }

        .step-content p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .step-icon {
          color: var(--text-accent);
          flex-shrink: 0;
        }

        .cta-section {
          background: var(--secondary-bg);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          text-align: center;
          margin: var(--spacing-2xl) 0;
        }

        .cta-content h2 {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
        }

        .cta-content p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
        }

        .home-error {
          margin-top: var(--spacing-xl);
        }

        /* Animations */
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out backwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero {
            padding: var(--spacing-xl) var(--spacing-md);
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .section-title {
            font-size: 2rem;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .languages-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--spacing-sm);
          }

          .language-card {
            padding: var(--spacing-md);
          }

          .language-icon {
            font-size: 1.5rem;
          }

          .language-name {
            font-size: 0.8rem;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .step-card {
            padding: var(--spacing-lg);
          }

          .step-number {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
          }

          .cta-section {
            padding: var(--spacing-xl) var(--spacing-md);
          }

          .cta-content h2 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .step-card {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-md);
          }

          .step-content {
            order: 2;
          }

          .step-icon {
            order: 3;
          }

          .step-number {
            order: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;