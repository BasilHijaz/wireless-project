import React, { useState } from 'react';
import WirelessCalculator from './components/WirelessCalculator.jsx';
import OFDMCalculator from './components/OFDMCalculator.jsx';
import LinkBudgetCalculator from './components/LinkBudgetCalculator.jsx';
import { Navigation, Header } from './components/SharedComponents.jsx';

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
      default:
        return <WirelessCalculator />;
    }
  };

  return (
    <div className="App">
      <Navigation />
      <Header />
      
      <div className="container">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'wireless' ? 'active' : ''}`}
            onClick={() => setActiveTab('wireless')}
          >
            <i className="icon-wifi"></i>
            Wireless System
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ofdm' ? 'active' : ''}`}
            onClick={() => setActiveTab('ofdm')}
          >
            <i className="icon-tower"></i>
            OFDM System
          </button>
          <button 
            className={`tab-btn ${activeTab === 'link-budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('link-budget')}
          >
            <i className="icon-link"></i>
            Link Budget
          </button>
        </div>

        <div className="content-area">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default App;