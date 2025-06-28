import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

// Navigation Component
export const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-icon">📡</span>
          <span className="nav-title">Wireless Network Designer</span>
          <span className="api-status online">AI Connected</span>
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
          <div className="feature-item">
            <span className="feature-icon">🔧</span>
            <span>System Calculations</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span>AI Explanations</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Real-time Results</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default { LoadingSpinner, Navigation, Header };