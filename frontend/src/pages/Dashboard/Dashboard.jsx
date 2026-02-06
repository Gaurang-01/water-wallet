import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const waterPercent = 28;
  const waterMM = 1027;

  return (
    <div className="dashboard-clean">

      {/* ===== LEFT — HERO TANK ===== */}
      <div className="tank-card-clean">

        <h1 className="welcome">
          {lang === 'hi' ? 'नमस्ते' : 'Namaste'}, Ramesh 👋
        </h1>

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


      {/* ===== RIGHT — SIMPLE INFO ===== */}
      <div className="info-panel">

        <div className="info-box">
          <span>💧 Water Left</span>
          <h2>{waterMM} mm</h2>
        </div>

        <div className="info-box">
          <span>🌾 Best Crop</span>
          <h2>Wheat</h2>
        </div>

        <div className="info-box">
          <span>💰 Est Profit</span>
          <h2>₹42,000</h2>
        </div>

        <button
          className="btn-big-primary"
          onClick={() => navigate('/app/planner')}
        >
          Plan My Crops →
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
