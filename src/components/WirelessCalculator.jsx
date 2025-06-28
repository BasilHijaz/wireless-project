import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm.jsx';
import ResultCard from './ResultCard.jsx';
import { LoadingSpinner } from './SharedComponents.jsx';

const WirelessCalculator = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputFields = [
    {
      name: 'bandwidth_hz',
      label: 'Bandwidth (Hz)',
      type: 'number',
      placeholder: 'e.g. 10000000',
      required: true,
      validation: (value) => value > 0 ? null : 'Bandwidth must be greater than 0'
    },
    {
      name: 'quantizer_bits',
      label: 'Quantizer Bits',
      type: 'number',
      placeholder: 'e.g. 8',
      required: true,
      validation: (value) => value > 0 ? null : 'Bits must be greater than 0'
    },
    {
      name: 'source_encoder_rate',
      label: 'Source Encoder Rate',
      type: 'number',
      step: '0.01',
      placeholder: '0 to 1 (e.g. 0.8)',
      required: true,
      validation: (value) => (value > 0 && value < 1) ? null : 'Rate must be between 0 and 1'
    },
    {
      name: 'channel_encoder_rate',
      label: 'Channel Encoder Rate',
      type: 'number',
      step: '0.01',
      placeholder: '0 to 1 (e.g. 0.75)',
      required: true,
      validation: (value) => (value > 0 && value < 1) ? null : 'Rate must be between 0 and 1'
    },
    {
      name: 'burst_overhead_percent',
      label: 'Burst Overhead Percentage',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 5.0',
      required: true,
      validation: (value) => value >= 0 ? null : 'Overhead must be 0 or greater'
    }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/wireless', formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate wireless rates');
    } finally {
      setLoading(false);
    }
  };

  const resultFields = results ? [
    { label: 'Sampler Rate', value: `${results.sampler_rate} Hz`, key: 'sampler_rate' },
    { label: 'Quantizer Rate', value: `${results.quantizer_rate} bps`, key: 'quantizer_rate' },
    { label: 'Source Encoder Rate', value: `${results.source_encoder_rate} bps`, key: 'source_encoder_rate' },
    { label: 'Channel Encoder Rate', value: `${results.channel_encoder_rate} bps`, key: 'channel_encoder_rate' },
    { label: 'Interleaver Rate', value: `${results.interleaver_rate} bps`, key: 'interleaver_rate' },
    { label: 'Burst Format Rate', value: `${results.burst_format_rate} bps`, key: 'burst_format_rate' }
  ] : [];

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Wireless Communication System</h2>
        <p>Compute the rate at the output of each system block</p>
      </div>
      
      <div className="calculator-content">
        <div className="input-section">
          <InputForm 
            title="Input Parameters"
            fields={inputFields}
            onSubmit={handleSubmit}
            submitLabel="Calculate Rates"
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
              title="Computation Results"
              fields={resultFields}
              explanation={results.explanation}
            />
          )}
          {!results && !loading && !error && (
            <div className="placeholder-card">
              <p>Enter parameters and click "Calculate Rates" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WirelessCalculator;