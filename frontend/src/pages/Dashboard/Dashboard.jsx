import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const playAudio = () => {
    alert("🔊 Advisory: Water levels are very low (15%). Do not sow Sugarcane.");
  };

  return (
    <div className="page-content dashboard-grid">
      
      {/* --- LEFT: TANK (HERO) --- */}
      <div className="col-left">
        <div className="welcome-section">
            <h1>{t.greeting || "Namaste"}, Ramesh!</h1>
            <p className="subtitle">Farm ID: <strong>MH-PN-99</strong></p>
        </div>

        <div className="tank-card danger-theme">
          <div className="card-header">
            <h3>{t.tank_title || "Aquifer Level"}</h3>
            <button className="btn-audio-icon" onClick={playAudio}>
                <span className="material-icons">volume_up</span>
            </button>
          </div>
          
          <div className="tank-visual-container">
            {/* Animated Tank */}
            <div className="tank-body">
              <div className="water-level danger-anim" style={{ height: '28%' }}>
                <div className="wave"></div>
              </div>
              <div className="level-indicator">28%</div>
              <div className="measurement-lines">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            
            <div className="tank-status">
              <h1 className="status-text warning">{t.tank_status_low || "CRITICAL"}</h1>
              <p className="status-desc">
                {t.tank_desc_1 || "Depth:"} <strong className="red-text">140ft</strong>. 
                {t.tank_desc_2 || "Depleting fast."}
              </p>
              
              <button className="btn-action primary" onClick={() => navigate('/planner')}>
                <span className="material-icons">grass</span>
                {t.btn_crop_check || "Check Crop Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT: WEATHER & STATS (No Libraries) --- */}
      <div className="col-right">
        
        {/* FAKE CHART (SVG Drawing) */}
        <div className="chart-card">
            <div className="card-header-small">
                <h4>Groundwater Trend (6 Months)</h4>
            </div>
            <div className="static-chart-container">
                {/* This is just a drawing, no library needed */}
                <svg viewBox="0 0 300 100" className="fake-chart-svg">
                    <defs>
                        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#grad)" stroke="#3b82f6" strokeWidth="3" 
                        d="M0,80 Q50,70 100,40 T200,50 T300,20 V100 H0 Z" />
                </svg>
                <div className="chart-labels">
                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span>
                </div>
            </div>
        </div>

        {/* Weather Grid */}
        <div className="weather-grid-compact">
            <div className="weather-tile">
                <span className="label">Today</span>
                <span className="material-icons sun">wb_sunny</span>
                <strong>38°C</strong>
            </div>
            <div className="weather-tile warning">
                <span className="label">Wed</span>
                <span className="material-icons rain">thunderstorm</span>
                <strong>Heavy Rain</strong>
            </div>
            <div className="weather-tile">
                <span className="label">Soil</span>
                <span className="material-icons soil">grain</span>
                <strong>Dry (0.2)</strong>
            </div>
        </div>

        {/* Secondary Action */}
        <div className="quick-actions">
            <button className="btn-outline" onClick={() => navigate('/profit')}>
                <span className="material-icons">currency_rupee</span>
                {t.menu_profit || "Profit Calc"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;