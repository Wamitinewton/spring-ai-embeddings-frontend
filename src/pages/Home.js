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
  TrendingUp,
  Lightbulb,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FEATURES, PROGRAMMING_LANGUAGES } from '../utils/constants';
import { formatNumber } from '../utils/helpers';
import { apiMethods, endpoints } from '../services/api';
import { ChatbotService } from '../services/chatbotService';

const Home = ({ userPreferences, apiHealthy }) => {
  const [appInfo, setAppInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomFact, setRandomFact] = useState(null);
  const [loadingFact, setLoadingFact] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (apiHealthy) {
          const [infoResponse, healthResponse] = await Promise.all([
            apiMethods.get(endpoints.info).catch(() => null),
            apiMethods.get(endpoints.health).catch(() => null)
          ]);

          setAppInfo(infoResponse);
          
          setStats({
            totalQuestions: 1250,
            activeUsers: 89,
            languagesSupported: PROGRAMMING_LANGUAGES.length,
            successRate: 94
          });

          loadRandomFact();
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

  const loadRandomFact = async () => {
    if (!apiHealthy) return;
    
    setLoadingFact(true);
    try {
      const response = await ChatbotService.getRandomFact(userPreferences.language);
      if (response.success) {
        setRandomFact(response.data);
      }
    } catch (err) {
      console.error('Failed to load random fact:', err);
    } finally {
      setLoadingFact(false);
    }
  };

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

        {/* Random Fact Section */}
        {apiHealthy && (
          <section className="fact-section animate-fade-in-up">
            <div className="fact-container">
              <div className="fact-header">
                <div className="fact-title">
                  <Lightbulb size={24} />
                  <h3>Programming Fact of the Day</h3>
                </div>
                <button
                  onClick={loadRandomFact}
                  disabled={loadingFact}
                  className="btn btn-secondary btn-sm refresh-btn"
                  title="Get new fact"
                >
                  <RefreshCw size={16} className={loadingFact ? 'spinning' : ''} />
                </button>
              </div>
              
              {randomFact && !loadingFact ? (
                <div className="fact-content">
                  <div className="fact-text">{randomFact.fact}</div>
                  <div className="fact-meta">
                    <span className="fact-language">
                      {PROGRAMMING_LANGUAGES.find(l => l.code === randomFact.language)?.icon}
                      {PROGRAMMING_LANGUAGES.find(l => l.code === randomFact.language)?.name || randomFact.language}
                    </span>
                    <span className="fact-category">{randomFact.category}</span>
                  </div>
                </div>
              ) : loadingFact ? (
                <div className="fact-loading">
                  <LoadingSpinner size="small" />
                  <span>Loading fascinating fact...</span>
                </div>
              ) : (
                <div className="fact-placeholder">
                  <Sparkles size={32} />
                  <span>Click refresh to discover amazing programming facts!</span>
                </div>
              )}
            </div>
          </section>
        )}

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
        /* Fact Section Styling */
        .fact-section {
          margin-bottom: var(--spacing-2xl);
        }

        .fact-container {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          backdrop-filter: blur(10px);
          transition: all var(--transition-normal);
        }

        .fact-container:hover {
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: var(--shadow-lg);
        }

        .fact-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-lg);
        }

        .fact-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-primary);
        }

        .fact-title h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .refresh-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          min-height: auto;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .fact-content {
          text-align: center;
        }

        .fact-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
          font-style: italic;
        }

        .fact-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .fact-language,
        .fact-category {
          background: var(--bg-tertiary);
          color: var(--text-accent);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid var(--border-secondary);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .fact-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          color: var(--text-secondary);
        }

        .fact-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          color: var(--text-muted);
        }

        /* Enhanced Mobile Responsiveness */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
            line-height: 1.2;
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: var(--spacing-lg);
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
            gap: var(--spacing-sm);
          }

          .hero-actions .btn {
            width: 100%;
            justify-content: center;
          }

          .section-title {
            font-size: 1.75rem;
            flex-direction: column;
            gap: var(--spacing-sm);
            text-align: center;
          }

          .section-description {
            font-size: 1rem;
          }

          .fact-header {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .fact-title {
            justify-content: center;
          }

          .fact-meta {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .languages-grid {
            grid-template-columns: repeat(2, 1fr);
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
            text-align: center;
          }

          .step-number {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
            margin: 0 auto var(--spacing-md);
          }

          .step-content h3 {
            margin-bottom: var(--spacing-sm);
          }

          .step-icon {
            margin: var(--spacing-md) auto 0;
          }

          .cta-section {
            padding: var(--spacing-xl) var(--spacing-md);
            margin: var(--spacing-xl) 0;
          }

          .cta-content h2 {
            font-size: 1.5rem;
            margin-bottom: var(--spacing-md);
          }

          .cta-content p {
            font-size: 1rem;
            margin-bottom: var(--spacing-lg);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
          }

          .stat-card {
            padding: var(--spacing-md);
          }

          .stat-number {
            font-size: 2rem;
          }

          .fact-container {
            padding: var(--spacing-lg);
          }

          .fact-text {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: var(--spacing-xl) var(--spacing-sm);
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .hero-subtitle {
            font-size: 0.95rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .languages-grid {
            grid-template-columns: 1fr;
          }

          .step-card {
            padding: var(--spacing-md);
          }

          .section-title {
            font-size: 1.5rem;
          }

          .fact-container {
            padding: var(--spacing-md);
          }

          .fact-title h3 {
            font-size: 1.1rem;
          }

          .fact-text {
            font-size: 0.95rem;
          }
        }

        /* Existing styles from original component */
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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;