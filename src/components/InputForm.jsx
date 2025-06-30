import React, { useState } from 'react';

const InputForm = ({ title, fields, onSubmit, submitLabel, loading }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && (!value || value === '')) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (value && field.validation) {
        const error = field.validation(parseFloat(value) || value);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to appropriate types
      const processedData = {};
      fields.forEach(field => {
        const value = formData[field.name];
        if (value !== undefined && value !== '') {
          // Check if field should be converted to number
          if (field.type === 'number') {
            processedData[field.name] = parseFloat(value);
          } else if (field.type === 'select' && field.numericSelect) {
            // Only convert select to number if explicitly marked as numeric
            processedData[field.name] = parseFloat(value);
          } else {
            // Keep as string for text, select (non-numeric), etc.
            processedData[field.name] = value;
          }
        } else if (field.defaultValue) {
          if (field.type === 'number' || field.numericSelect) {
            processedData[field.name] = parseFloat(field.defaultValue);
          } else {
            processedData[field.name] = field.defaultValue;
          }
        }
      });
      
      onSubmit(processedData);
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.name];

    if (field.type === 'select') {
      return (
        <div key={field.name} className="form-group">
          <label className="form-label">{field.label}</label>
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`form-control ${hasError ? 'error' : ''}`}
            required={field.required}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasError && <div className="error-message">{hasError}</div>}
        </div>
      );
    }

    return (
      <div key={field.name} className="form-group">
        <label className="form-label">{field.label}</label>
        <input
          type={field.type}
          name={field.name}
          value={formData[field.name] || field.defaultValue || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          step={field.step}
          className={`form-control ${hasError ? 'error' : ''}`}
          required={field.required}
        />
        {hasError && <div className="error-message">{hasError}</div>}
      </div>
    );
  };

  return (
    <div className="input-form-card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {fields.map(renderField)}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;