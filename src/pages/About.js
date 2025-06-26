import React from 'react';
import { 
  Code2, 
  Brain, 
  Zap, 
  Users, 
  Target,
  Heart,
  ExternalLink,
  Github
} from 'lucide-react';
import { APP_INFO, SOCIAL_LINKS } from '../utils/constants';

const About = () => {
  const technologies = [
    {
      name: 'Spring Boot',
      description: 'Backend framework for Java applications',
      icon: '🍃',
      category: 'Backend'
    },
    {
      name: 'Spring AI',
      description: 'AI integration framework for Spring applications',
      icon: '🤖',
      category: 'AI Framework'
    },
    {
      name: 'OpenAI GPT-4o',
      description: 'Advanced language model for intelligent responses',
      icon: '🧠',
      category: 'AI Model'
    },
    {
      name: 'Qdrant',
      description: 'Vector database for semantic search',
      icon: '🔍',
      category: 'Database'
    },
    {
      name: 'Redis',
      description: 'In-memory data store for session management',
      icon: '🔴',
      category: 'Cache'
    },
    {
      name: 'React',
      description: 'Frontend library for building user interfaces',
      icon: '⚛️',
      category: 'Frontend'
    }
  ];

  const features = [
    {
      icon: <Brain size={24} />,
      title: 'AI-Powered Assistance',
      description: 'Get intelligent help with programming questions using advanced AI models'
    },
    {
      icon: <Code2 size={24} />,
      title: 'Multi-Language Support',
      description: 'Support for 10+ programming languages including Kotlin, Java, Python, and more'
    },
    {
      icon: <Target size={24} />,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with AI-generated questions tailored to your skill level'
    },
    {
      icon: <Zap size={24} />,
      title: 'Real-time Responses',
      description: 'Get instant answers with code examples and detailed explanations'
    }
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">About Programming Assistant</h1>
          <p className="page-subtitle">
            Learn about our AI-powered platform that helps developers code, learn, and grow
          </p>
        </div>

        <section className="about-section">
          <div className="about-content">
            <h2 className="about-title">
              <Heart size={32} />
              Our Mission
            </h2>
            <p className="about-text">
              We believe that learning to code should be accessible, engaging, and efficient. 
              Our AI-powered programming assistant combines the latest in artificial intelligence 
              with comprehensive programming knowledge to provide developers of all levels with 
              instant, accurate, and contextual help.
            </p>
            <p className="about-text">
              Whether you're a beginner taking your first steps in programming or an experienced 
              developer exploring new technologies, our platform adapts to your needs and provides 
              personalized assistance across multiple programming languages.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">
            <Zap size={32} />
            Key Features
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="tech-section">
          <h2 className="section-title">
            <Code2 size={32} />
            Technology Stack
          </h2>
          <p className="section-description">
            Built with modern, scalable technologies to ensure reliability and performance
          </p>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-card">
                <div className="tech-icon">{tech.icon}</div>
                <div className="tech-content">
                  <h3 className="tech-name">{tech.name}</h3>
                  <p className="tech-description">{tech.description}</p>
                  <span className="tech-category">{tech.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Overview */}
        <section className="architecture-section">
          <h2 className="section-title">
            <Users size={32} />
            How It Works
          </h2>
          <div className="architecture-flow">
            <div className="flow-step">
              <div className="step-number">1</div>
              <h3>User Query</h3>
              <p>You ask a programming question through our React frontend</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <h3>AI Processing</h3>
              <p>Spring AI processes your query using OpenAI's GPT-4o model</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <h3>Context Search</h3>
              <p>Qdrant vector database provides relevant documentation context</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <h3>Smart Response</h3>
              <p>You receive a comprehensive answer with code examples</p>
            </div>
          </div>
        </section>

        <section className="opensource-section">
          <div className="opensource-content">
            <h2 className="opensource-title">
              <Github size={32} />
              Open Source & Learning
            </h2>
            <p className="opensource-text">
              This project serves as both a practical tool and a learning resource for developers 
              interested in building AI-powered applications with Spring AI and modern web technologies.
            </p>
            <div className="opensource-actions">
              <a 
                href={SOCIAL_LINKS.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Github size={20} />
                View on GitHub
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-description">
            Have questions, suggestions, or want to contribute? We'd love to hear from you!
          </p>
          <div className="contact-grid">
            <a 
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="contact-card"
            >
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>Send us a message</p>
            </a>
            <a 
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-icon">🐙</div>
              <h3>GitHub</h3>
              <p>Contribute to the project</p>
            </a>
            <a 
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-icon">💼</div>
              <h3>LinkedIn</h3>
              <p>Connect professionally</p>
            </a>
          </div>
        </section>
      </div>

      <style jsx>{`
        .about-section,
        .features-section,
        .tech-section,
        .architecture-section,
        .opensource-section,
        .contact-section {
          margin-bottom: var(--spacing-2xl);
        }

        .about-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .about-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-lg);
        }

        .about-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }

        .section-description {
          text-align: center;
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto var(--spacing-xl);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .feature-card {
          background: var(--bg-card);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          text-align: center;
          transition: all var(--transition-normal);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          color: var(--text-accent);
          margin-bottom: var(--spacing-md);
        }

        .feature-title {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--spacing-lg);
        }

        .tech-card {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          background: var(--bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          transition: all var(--transition-normal);
        }

        .tech-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-accent);
        }

        .tech-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .tech-content {
          flex: 1;
        }

        .tech-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .tech-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: var(--spacing-sm);
        }

        .tech-category {
          display: inline-block;
          background: var(--bg-tertiary);
          color: var(--text-accent);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--border-secondary);
        }

        .architecture-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
          margin-top: var(--spacing-xl);
        }

        .flow-step {
          background: var(--bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          text-align: center;
          flex: 1;
          min-width: 200px;
          max-width: 250px;
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
          margin: 0 auto var(--spacing-md);
        }

        .flow-step h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          font-size: 1.1rem;
        }

        .flow-step p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .flow-arrow {
          color: var(--text-accent);
          font-size: 1.5rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .opensource-section {
          background: var(--secondary-bg);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-xl);
          text-align: center;
        }

        .opensource-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: var(--spacing-lg);
        }

        .opensource-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .opensource-actions {
          display: flex;
          justify-content: center;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .contact-card {
          background: var(--bg-card);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-secondary);
          text-align: center;
          text-decoration: none;
          transition: all var(--transition-normal);
          color: inherit;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-accent);
        }

        .contact-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
        }

        .contact-card h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          font-size: 1.25rem;
        }

        .contact-card p {
          color: var(--text-secondary);
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-title {
            flex-direction: column;
            gap: var(--spacing-sm);
            font-size: 1.75rem;
          }

          .about-title {
            flex-direction: column;
            gap: var(--spacing-sm);
            font-size: 1.75rem;
          }

          .about-text {
            font-size: 1rem;
          }

          .features-grid,
          .tech-grid {
            grid-template-columns: 1fr;
          }

          .architecture-flow {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .flow-arrow {
            transform: rotate(90deg);
          }

          .opensource-section {
            padding: var(--spacing-xl) var(--spacing-md);
          }

          .opensource-title {
            flex-direction: column;
            gap: var(--spacing-sm);
            font-size: 1.75rem;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .tech-card {
            flex-direction: column;
            text-align: center;
          }

          .flow-step {
            min-width: auto;
            max-width: none;
          }

          .step-number {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;