import React from 'react';
import MetricCard from '../../components/common/MetricCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Aquifer Inventory</h1>
        <p>Real-time groundwater audit for Block: <strong>Chaka</strong></p>
      </div>

      <div className="dashboard-grid">
        <MetricCard 
          title="Effective Water Balance" 
          value="420" 
          unit="mm" 
          status="danger"
          subtext="📉 15% lower than last year"
        />
        <MetricCard 
          title="Recharge Rate" 
          value="Low" 
          unit="" 
          subtext="Soil moisture capacity saturated"
        />
        <MetricCard 
          title="Safe Withdrawal Limit" 
          value="1.2" 
          unit="ft/day" 
          status="warning"
          subtext="Advisory: Restrict pumping"
        />
      </div>

      <div className="weather-section">
        <h3>15-Day Rainfall Forecast (IMD)</h3>
        <div className="weather-strip">
          <div className="weather-day">
            <span>Today</span>
            <span className="material-icons sun">wb_sunny</span>
            <span>0mm</span>
          </div>
          <div className="weather-day">
            <span>Tomorrow</span>
            <span className="material-icons cloud">cloud</span>
            <span>2mm</span>
          </div>
          <div className="weather-day active">
            <span>Wed</span>
            <span className="material-icons rain">thunderstorm</span>
            <span>45mm</span>
          </div>
          {/* More days... */}
        </div>
        <div className="advisory-box">
          <span className="material-icons">info</span>
          <p>Heavy rainfall expected on Wednesday. Hold sowing for 3 days to avoid seed washout.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;