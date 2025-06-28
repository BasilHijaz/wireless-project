import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm.jsx';
import ResultCard from './ResultCard.jsx';
import { LoadingSpinner } from './SharedComponents.jsx';

const LinkBudgetCalculator = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputFields = [
    {
      name: 'tx_power_dbm',
      label: 'Transmitter Power (dBm)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 30.0',
      required: true,
      validation: (value) => !isNaN(value) ? null : 'Transmitter power required'
    },
    {
      name: 'tx_gain_dbi',
      label: 'Transmitter Antenna Gain (dBi)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 5.0',
      required: true,
      validation: (value) => !isNaN(value) ? null : 'Antenna gain required'
    },
    {
      name: 'rx_gain_dbi',
      label: 'Receiver Antenna Gain (dBi)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 3.0',
      required: true,
      validation: (value) => !isNaN(value) ? null : 'Antenna gain required'
    },
    {
      name: 'frequency_mhz',
      label: 'Frequency (MHz)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 2400',
      required: true,
      validation: (value) => value > 0 ? null : 'Frequency must be greater than 0'
    },
    {
      name: 'distance_km',
      label: 'Distance (km)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 2.5',
      required: true,
      validation: (value) => value > 0 ? null : 'Distance must be greater than 0'
    },
    {
      name: 'misc_losses_db',
      label: 'Miscellaneous Losses (dB)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 2.0',
      defaultValue: '0',
      required: false,
      validation: (value) => value >= 0 ? null : 'Losses must be 0 or greater'
    }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/link-budget', formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate link budget');
    } finally {
      setLoading(false);
    }
  };

  const resultFields = results ? [
    { 
      label: 'Effective Isotropic Radiated Power (EIRP)', 
      value: `${results.effective_isotropic_radiated_power_dbm} dBm`, 
      key: 'effective_isotropic_radiated_power_dbm' 
    },
    { 
      label: 'Received Power', 
      value: `${results.received_power_dbm} dBm`, 
      key: 'received_power_dbm' 
    }
  ] : [];

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Link Budget Calculation</h2>
        <p>Compute transmitted power and received signal strength in flat environment</p>
      </div>
      
      <div className="calculator-content">
        <div className="input-section">
          <InputForm 
            title="Input Parameters"
            fields={inputFields}
            onSubmit={handleSubmit}
            submitLabel="Calculate Link Budget"
            loading={loading}
          />
        </div>
        
        <div className="result-section">
          {loading && <LoadingSpinner message="Processing with AI agent..." />}
          {error && (
            <div className="error-card">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
          {results && !loading && (
            <ResultCard
              title="Link Budget Results"
              fields={resultFields}
              explanation={results.explanation}
            />
          )}
          {!results && !loading && !error && (
            <div className="placeholder-card">
              <p>Enter parameters and click "Calculate Link Budget" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkBudgetCalculator;