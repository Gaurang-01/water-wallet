import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, status, subtext }) => {
  return (
    <div className={`metric-card ${status}`}>
      <h4 className="metric-title">{title}</h4>
      <div className="metric-body">
        <span className="metric-val">{value}</span>
        <span className="metric-unit">{unit}</span>
      </div>
      <p className="metric-sub">{subtext}</p>
    </div>
  );
};

export default MetricCard;