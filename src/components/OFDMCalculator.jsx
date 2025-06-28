import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm.jsx';
import ResultCard from './ResultCard.jsx';
import { LoadingSpinner } from './SharedComponents.jsx';

const OFDMCalculator = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputFields = [
    {
      name: 'modulation_order',
      label: 'Modulation Order',
      type: 'select',
      options: [
        { value: '', label: 'Select modulation' },
        { value: '2', label: 'BPSK (2)' },
        { value: '4', label: 'QPSK (4)' },
        { value: '16', label: '16-QAM (16)' },
        { value: '64', label: '64-QAM (64)' },
        { value: '256', label: '256-QAM (256)' }
      ],
      required: true,
      validation: (value) => value && parseInt(value) > 1 ? null : 'Modulation order must be greater than 1'
    },
    {
      name: 'coding_rate',
      label: 'Coding Rate',
      type: 'number',
      step: '0.01',
      placeholder: '0 to 1 (e.g. 0.75)',
      required: true,
      validation: (value) => (value > 0 && value <= 1) ? null : 'Coding rate must be between 0 and 1'
    },
    {
      name: 'subcarriers',
      label: 'Number of Subcarriers',
      type: 'number',
      placeholder: 'e.g. 12',
      required: true,
      validation: (value) => value > 0 ? null : 'Subcarriers must be greater than 0'
    },
    {
      name: 'symbols_per_slot',
      label: 'Symbols per Slot',
      type: 'number',
      placeholder: 'e.g. 7',
      required: true,
      validation: (value) => value > 0 ? null : 'Symbols must be greater than 0'
    },
    {
      name: 'num_resource_blocks',
      label: 'Resource Blocks',
      type: 'number',
      placeholder: 'e.g. 50',
      required: true,
      validation: (value) => value > 0 ? null : 'Resource blocks must be greater than 0'
    },
    {
      name: 'bandwidth_hz',
      label: 'Bandwidth (Hz)',
      type: 'number',
      placeholder: 'e.g. 10000000',
      required: true,
      validation: (value) => value > 0 ? null : 'Bandwidth must be greater than 0'
    }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/ofdm', formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate OFDM rates');
    } finally {
      setLoading(false);
    }
  };

  const resultFields = results ? [
    { 
      label: 'Rate per Resource Element', 
      value: `${results.rate_per_resource_element_bps} bps`, 
      key: 'rate_per_resource_element_bps' 
    },
    { 
      label: 'Rate per OFDM Symbol', 
      value: `${results.rate_per_ofdm_symbol_bps} bps`, 
      key: 'rate_per_ofdm_symbol_bps' 
    },
    { 
      label: 'Rate per Resource Block', 
      value: `${results.rate_per_resource_block_bps} bps`, 
      key: 'rate_per_resource_block_bps' 
    },
    { 
      label: 'Max Transmission Capacity', 
      value: `${results.max_transmission_capacity_bps} bps`, 
      key: 'max_transmission_capacity_bps' 
    },
    { 
      label: 'Spectral Efficiency', 
      value: `${results.spectral_efficiency_bps_per_hz} bps/Hz`, 
      key: 'spectral_efficiency_bps_per_hz' 
    }
  ] : [];

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>OFDM System Design</h2>
        <p>Calculate data rates for resource elements, symbols, and resource blocks</p>
      </div>
      
      <div className="calculator-content">
        <div className="input-section">
          <InputForm 
            title="Input Parameters"
            fields={inputFields}
            onSubmit={handleSubmit}
            submitLabel="Calculate OFDM Rates"
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
              title="OFDM Results"
              fields={resultFields}
              explanation={results.explanation}
            />
          )}
          {!results && !loading && !error && (
            <div className="placeholder-card">
              <p>Enter parameters and click "Calculate OFDM Rates" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OFDMCalculator;