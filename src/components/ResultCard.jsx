import React from 'react';

const ResultCard = ({ title, fields, explanation }) => {
  return (
    <div className="result-card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        <div className="results-grid">
          {fields.map((field, index) => (
            <div key={field.key || index} className="result-item">
              <div className="result-label">{field.label}</div>
              <div className="result-value">{field.value}</div>
            </div>
          ))}
        </div>
        
        {explanation && (
          <div className="explanation-section">
            <h4 className="explanation-title">AI Explanation</h4>
            <div className="explanation-content">
              <p>{explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;