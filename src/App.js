import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Quiz from './pages/Quiz';
import About from './pages/About';
import { checkApiHealth } from './services/api';
import { preferences } from './utils/helpers';
import './styles/global.css';
import './styles/components.css';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [error, setError] = useState(null);
  const [userPrefs, setUserPrefs] = useState(preferences.get());

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const isHealthy = await checkApiHealth();
        setApiHealthy(isHealthy);
        
        if (!isHealthy) {
          setError('Unable to connect to the server');
        }
        
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('App initialization error:', err);
        setError('Failed to initialize application. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const updatePreferences = (newPrefs) => {
    const updated = { ...userPrefs, ...newPrefs };
    setUserPrefs(updated);
    preferences.set(updated);
  };

  const retryConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isHealthy = await checkApiHealth();
      setApiHealthy(isHealthy);
      
      if (!isHealthy) {
        setError('Unable to connect to internet.');
      }
    } catch (err) {
      setError('Connection retry failed. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <h2>Programming Assistant</h2>
          <p>Initializing your AI-powered coding companion...</p>
        </div>
      </div>
    );
  }

  if (error && !apiHealthy) {
    return (
      <div className="app-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <ErrorMessage message={error} />
          <div className="error-actions">
            <button className="btn btn-primary" onClick={retryConnection}>
              Retry Connection
            </button>
            <div className="error-help">
              <h4>Troubleshooting:</h4>
              <ul>
                <li>Ensure the Spring Boot backend is running on port 8080</li>
                <li>Check if your firewall is blocking the connection</li>
                <li>Verify the API_URL environment variable is correct</li>
                <li>Make sure all required services (OpenAI, Qdrant, Redis) are configured</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header 
          userPreferences={userPrefs}
          onPreferencesChange={updatePreferences}
          apiHealthy={apiHealthy}
        />
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  userPreferences={userPrefs}
                  apiHealthy={apiHealthy}
                />
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <Chatbot 
                  userPreferences={userPrefs}
                  onPreferencesChange={updatePreferences}
                />
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <Quiz 
                  userPreferences={userPrefs}
                  onPreferencesChange={updatePreferences}
                />
              } 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="*" 
              element={
                <div className="not-found">
                  <div className="container">
                    <div className="not-found-content">
                      <h1>404</h1>
                      <h2>Page Not Found</h2>
                      <p>The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn btn-primary">Go Home</a>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;