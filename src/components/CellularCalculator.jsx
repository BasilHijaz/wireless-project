import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm.jsx';
import ResultCard from './ResultCard.jsx';
import { LoadingSpinner } from './SharedComponents.jsx';

const CellularCalculator = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputFields = [
    {
      name: 'coverage_area',
      label: 'Coverage Area (km²)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 100',
      required: true,
      validation: (value) => value > 0 ? null : 'Coverage area must be greater than 0'
    },
    {
      name: 'population_density',
      label: 'Population Density (per km²)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 500',
      required: true,
      validation: (value) => value > 0 ? null : 'Population density must be greater than 0'
    },
    {
      name: 'user_data_rate',
      label: 'Average User Data Rate (Mbps)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 5.0',
      required: true,
      validation: (value) => value > 0 ? null : 'User data rate must be greater than 0'
    },
    {
      name: 'frequency_band',
      label: 'Frequency Band (MHz)',
      type: 'number',
      step: '0.1',
      placeholder: 'e.g. 2400',
      required: true,
      validation: (value) => value > 0 ? null : 'Frequency band must be greater than 0'
    },
    {
      name: 'terrain_type',
      label: 'Terrain Type',
      type: 'select',
      options: [
        { value: '', label: 'Select terrain type' },
        { value: 'urban', label: 'Urban' },
        { value: 'suburban', label: 'Suburban' },
        { value: 'dense_urban', label: 'Dense Urban' },
        { value: 'rural', label: 'Rural' }
      ],
      required: true,
      validation: (value) => value ? null : 'Terrain type is required'
    }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/cellular', formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate cellular design');
    } finally {
      setLoading(false);
    }
  };

  const resultFields = results ? [
    { 
      label: 'Total Users', 
      value: `${results.total_users.toLocaleString()}`, 
      key: 'total_users' 
    },
    { 
      label: 'Total Capacity Required', 
      value: `${results.total_capacity.toFixed(2)} Mbps`, 
      key: 'total_capacity' 
    },
    { 
      label: 'Cell Radius', 
      value: `${results.cell_radius} km`, 
      key: 'cell_radius' 
    },
    { 
      label: 'Number of Cells Needed', 
      value: `${results.cells_needed}`, 
      key: 'cells_needed' 
    },
    { 
      label: 'Users per Cell', 
      value: `${results.users_per_cell?.toLocaleString() || 'N/A'}`, 
      key: 'users_per_cell' 
    },
    { 
      label: 'Capacity per Cell', 
      value: `${results.capacity_per_cell?.toFixed(2) || 'N/A'} Mbps`, 
      key: 'capacity_per_cell' 
    },
    { 
      label: 'Operating Frequency', 
      value: `${results.frequency_band} MHz`, 
      key: 'frequency_band' 
    }
  ] : [];

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Cellular Design</h2>
        <p>Design cellular networks based on user-specified parameters and requirements</p>
      </div>
      
      <div className="calculator-content">
        <div className="input-section">
          <InputForm 
            title="Input Parameters"
            fields={inputFields}
            onSubmit={handleSubmit}
            submitLabel="Design Cellular System"
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
              title="Cellular Design Results"
              fields={resultFields}
              explanation={results.explanation}
            />
          )}
          {!results && !loading && !error && (
            <div className="placeholder-card">
              <p>Enter parameters and click "Design Cellular System" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CellularCalculator;