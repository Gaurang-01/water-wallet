import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  /* ⭐ get user data saved from login page */
  const name = localStorage.getItem('farmerName') || 'Farmer';
  const village = localStorage.getItem('farmerVillage') || 'Your Village';

  /* demo values (later connect to backend) */
  const waterPercent = 28;
  const waterMM = 1027;
  const bestCrop = "Wheat";
  const profit = 42000;

  return (
    <div className="dashboard-clean">

      {/* ================= LEFT — HERO WATER TANK ================= */}
      <div className="tank-card-clean">

        <h1 className="welcome">
          {lang === 'hi' ? 'नमस्ते' : 'Namaste'}, {name} 👋
        </h1>

        <p className="village-label">
          📍 {village}
        </p>

        <div className="tank-big">

          <div
            className="water-fill-big"
            style={{ height: `${waterPercent}%` }}
          />

          <div className="tank-label-big">
            {waterPercent}%
          </div>
        </div>

        <p className="tank-text">
          {lang === 'hi'
            ? `उपलब्ध जल: ${waterMM} mm`
            : `Available Water: ${waterMM} mm`}
        </p>
      </div>


      {/* ================= RIGHT — INFO PANEL ================= */}
      <div className="info-panel">

        <div className="info-box">
          <span>
            {lang === 'hi' ? '💧 पानी बचा' : '💧 Water Left'}
          </span>
          <h2>{waterMM} mm</h2>
        </div>

        <div className="info-box">
          <span>
            {lang === 'hi' ? '🌾 सर्वोत्तम फसल' : '🌾 Best Crop'}
          </span>
          <h2>{bestCrop}</h2>
        </div>

        <div className="info-box">
          <span>
            {lang === 'hi' ? '💰 अनुमानित लाभ' : '💰 Est Profit'}
          </span>
          <h2>₹{profit.toLocaleString()}</h2>
        </div>

        <button
          className="btn-big-primary"
          onClick={() => navigate('/app/planner')}
        >
          {lang === 'hi'
            ? 'फसल योजना बनाएं →'
            : 'Plan My Crops →'}
        </button>

      </div>

    </div>
  );
};

export default Dashboard;
