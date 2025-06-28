import React, { useState } from 'react';
import './App.css';
import WirelessCalculator from './components/WirelessCalculator.jsx';
import OFDMCalculator from './components/OFDMCalculator.jsx';
import LinkBudgetCalculator from './components/LinkBudgetCalculator.jsx';
import { Navigation, Header } from './components/SharedComponents.jsx';

// SVG Icons
const icons = {
  wireless: (
    <svg className="scenario-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48"><path d="M24 36v4"/><circle cx="24" cy="40" r="2"/><path d="M16 28a8 8 0 0 1 16 0"/><path d="M8 20a16 16 0 0 1 32 0"/></svg>
  ),
  ofdm: (
    <svg className="scenario-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48"><rect x="10" y="18" width="6" height="18" rx="2"/><rect x="21" y="10" width="6" height="26" rx="2"/><rect x="32" y="24" width="6" height="12" rx="2"/></svg>
  ),
  link: (
    <svg className="scenario-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48"><path d="M17 31l14-14"/><rect x="4" y="28" width="16" height="8" rx="4"/><rect x="28" y="12" width="16" height="8" rx="4"/></svg>
  ),
  cellular: (
    <svg className="scenario-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48"><path d="M24 40V8"/><circle cx="24" cy="44" r="4"/><path d="M12 24a12 12 0 0 1 24 0"/><path d="M6 18a18 18 0 0 1 36 0"/></svg>
  )
};

function App() {
  const [activeTab, setActiveTab] = useState('wireless');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'wireless':
        return <WirelessCalculator />;
      case 'ofdm':
        return <OFDMCalculator />;
      case 'link-budget':
        return <LinkBudgetCalculator />;
      case 'cellular':
        return (
          <div className="calculator-container">
            <div className="calculator-header">
              <h2>Cellular Design</h2>
              <p>Design cellular networks based on user-specified parameters and requirements. (Coming soon!)</p>
            </div>
            <div className="placeholder-card">
              <p>Cellular design tools will be available in a future update.</p>
            </div>
          </div>
        );
      default:
        return <WirelessCalculator />;
    }
  };

  return (
    <div className="App">
      <Navigation />
      <Header />

      {/* Scenario Cards */}
      <div className="scenario-cards">
        <div className="scenario-card">
          {icons.wireless}
          <h3>Wireless Communication</h3>
          <p>Compute output rates for various system blocks including sampler, quantizer, and encoders.</p>
        </div>
        <div className="scenario-card">
          {icons.ofdm}
          <h3>OFDM Systems</h3>
          <p>Calculate data rates for resource elements, symbols, resource blocks, and spectral efficiency.</p>
        </div>
        <div className="scenario-card">
          {icons.link}
          <h3>Link Budget</h3>
          <p>Compute transmitted power and received signal strength in flat environments.</p>
        </div>
        <div className="scenario-card">
          {icons.cellular}
          <h3>Cellular Design</h3>
          <p>Design cellular networks based on user-specified parameters and requirements.</p>
        </div>
      </div>

      <div className="container">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'wireless' ? 'active' : ''}`}
            onClick={() => setActiveTab('wireless')}
          >
            <span className="tab-icon">{icons.wireless}</span>
            Wireless System
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ofdm' ? 'active' : ''}`}
            onClick={() => setActiveTab('ofdm')}
          >
            <span className="tab-icon">{icons.ofdm}</span>
            OFDM System
          </button>
          <button 
            className={`tab-btn ${activeTab === 'link-budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('link-budget')}
          >
            <span className="tab-icon">{icons.link}</span>
            Link Budget
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cellular' ? 'active' : ''}`}
            onClick={() => setActiveTab('cellular')}
          >
            <span className="tab-icon">{icons.cellular}</span>
            Cellular Design
          </button>
        </div>

        <div className="content-area">
          {renderActiveComponent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Wireless Network Designer. All rights reserved. | <a href="#docs">Documentation</a>
      </footer>
    </div>
  );
}

export default App;