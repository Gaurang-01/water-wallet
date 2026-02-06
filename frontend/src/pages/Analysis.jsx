import React from 'react';
import AnalysisChart from '../components/AnalysisChart';

const Analysis = () => {
  return (
    <div className="analysis-page">
      <div className="page-header">
        <h1>Basin Trend Analysis</h1>
        <p>Real-time ground water fluctuation data</p>
      </div>

      <div className="analysis-grid">
        <div className="card chart-main-card">
          <div className="card-header">
            <h3>Water Table Depth (Annual Trend)</h3>
            <select className="dropdown-small">
              <option>Basin 024A</option>
              <option>Basin 025B</option>
            </select>
          </div>
          <div className="chart-container">
            <AnalysisChart />
          </div>
        </div>

        <div className="card info-card">
          <h3>Summary Insights</h3>
          <div className="insight-item">
            <span className="dot blue"></span>
            <p><strong>Safe Zone:</strong> 65% of wells are in stable condition.</p>
          </div>
          <div className="insight-item">
            <span className="dot red"></span>
            <p><strong>Critical:</strong> 12% wells show depletion in May.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;