import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Loading Spinner Component
export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

// Health Status Component
const HealthStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'healthy', 'unhealthy'
  const [message, setMessage] = useState('Checking...');

  const checkHealth = async () => {
    try {
      const response = await axios.get('/api/health', { timeout: 5000 });
      if (response.data.status === 'healthy') {
        setStatus('healthy');
        setMessage('AI Connected');
      } else {
        setStatus('unhealthy');
        setMessage('AI Disconnected');
      }
    } catch (error) {
      setStatus('unhealthy');
      setMessage('AI Disconnected');
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = () => {
    switch (status) {
      case 'healthy':
        return 'api-status online';
      case 'unhealthy':
        return 'api-status offline';
      default:
        return 'api-status checking';
    }
  };

  return (
    <span className={getStatusClass()}>
      {message}
    </span>
  );
};

// Navigation Component
export const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          Wireless Network Designer
          <HealthStatus />
        </div>
        <div className="nav-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#docs" className="nav-link">Documentation</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </div>
    </nav>
  );
};

// Header Component
export const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">AI-Powered Wireless Network Design Assistant</h1>
        <p className="header-subtitle">
          Design and analyze wireless communication systems with detailed AI explanations
        </p>
        <div className="header-features">
          <div className="feature-item">System Calculations</div>
          <div className="feature-item">AI Explanations</div>
          <div className="feature-item">Real-time Results</div>
        </div>
      </div>
    </header>
  );
};

export default { LoadingSpinner, Navigation, Header };