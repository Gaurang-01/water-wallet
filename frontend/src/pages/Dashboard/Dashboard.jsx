import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mock function for the "Listen" button
  const playAudio = () => {
    alert("🔊 Audio Advisory: Water levels are critical. Please conserve water.");
  };

  return (
    <div className="page-content kisan-dashboard">
      
      {/* 1. WELCOME BANNER */}
      <div className="welcome-banner">
        <div className="user-profile">
          <div className="avatar">R</div>
          <div>
            <h2>{t.greeting}, Ramesh!</h2>
            {/* Dynamic Status Badge */}
            <div className="status-badge danger">
              <span className="material-icons icon-sm">warning</span>
              {t.status_bad}
            </div>
          </div>
        </div>
        <button className="btn-audio" onClick={playAudio}>
           <span className="material-icons">volume_up</span> 
           {t.listen_btn}
        </button>
      </div>

      {/* 2. VISUAL WATER TANK (The Core Feature) */}
      <div className="tank-card danger-theme">
        <div className="card-header">
          <h3>{t.tank_title}</h3>
          <span className="material-icons info-icon">help_outline</span>
        </div>
        
        <div className="tank-visual-container">
          {/* The Tank Graphic */}
          <div className="tank-body">
            <div className="water-level" style={{ height: '35%' }}></div>
            <div className="level-indicator">35%</div>
            <div className="measurement-lines">
              <span></span><span></span><span></span>
            </div>
          </div>
          
          {/* Text Status */}
          <div className="tank-status">
            <h1 className="status-text">{t.tank_status_low}</h1>
            <p className="status-desc">
              {t.tank_desc_1} <strong className="red-text">15%</strong> {t.tank_desc_2}
            </p>
            
            <div className="advisory-box">
              <span className="material-icons">tips_and_updates</span>
              <div>
                <strong>{t.advisory_label}</strong>
                <p>{t.advisory_text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WEATHER GRID */}
      <div className="section-title">
        <h3>{t.weather_title}</h3>
      </div>
      
      <div className="weather-grid">
        {/* Today */}
        <div className="weather-item today">
          <span className="day-label">{t.today}</span>
          <span className="material-icons icon-sun">wb_sunny</span>
          <div className="weather-info">
            <strong>34°C</strong>
            <span>{t.clear}</span>
          </div>
        </div>
        
        {/* Forecast (Alert) */}
        <div className="weather-item warning">
          <div className="alert-tag">{t.wait_tag}</div>
          <span className="day-label">{t.wed}</span>
          <span className="material-icons icon-rain">thunderstorm</span>
          <div className="weather-info">
            <strong>{t.heavy_rain}</strong>
            <span>90% Chance</span>
          </div>
        </div>
      </div>

      {/* 4. ACTION BUTTONS */}
      <div className="action-grid">
        {/* Link to Crop Planner */}
        <button className="btn-action primary" onClick={() => navigate('/planner')}>
          <div className="icon-circle">
            <span className="material-icons">grass</span>
          </div>
          <span>{t.btn_crop_check}</span>
        </button>
        
        <button className="btn-action secondary">
          <div className="icon-circle">
            <span className="material-icons">call</span>
          </div>
          <span>{t.btn_call_help}</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;