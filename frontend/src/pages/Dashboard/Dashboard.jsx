import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const name = localStorage.getItem('farmerName') || 'Farmer';
  const village = localStorage.getItem('farmerVillage') || 'Pune';

  // ⭐ STATE: To hold real data from backend
  const [waterMM, setWaterMM] = useState(0);
  const [waterPercent, setWaterPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  // ⭐ FETCH: Get real groundwater data when Dashboard loads
  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const response = await fetch(`https://water-wallet.onrender.com/api/groundwater/${village.toLowerCase()}`);
        const data = await response.json();
        
        // Update state with backend data
        const mm = data.available_water_mm || 0;
        setWaterMM(mm);
        
        // Calculate percentage for tank (Assuming 3000mm is a 'full' tank visually)
        const percent = Math.min((mm / 3000) * 100, 100); 
        setWaterPercent(Math.round(percent));
        
      } catch (error) {
        console.error("Error fetching water data:", error);
        // Fallback if API fails
        setWaterMM(850); 
        setWaterPercent(30);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterData();
  }, [village]);

  return (
    <div className="dashboard-clean">
      {/* ================= LEFT — HERO WATER TANK ================= */}
      <div className="tank-card-clean">
        <h1 className="welcome">
          {lang === 'hi' ? 'नमस्ते' : 'Namaste'}, {name} 👋
        </h1>
        <p className="village-label">📍 {village}</p>

        <div className="tank-big">
          <div
            className="water-fill-big"
            style={{ 
              height: `${waterPercent}%`,
              // Change color based on level
              background: waterPercent < 30 ? 'linear-gradient(#ef4444, #dc2626)' : 'linear-gradient(#3b82f6, #2563eb)'
            }}
          />
          <div className="tank-label-big">
            {loading ? '...' : `${waterPercent}%`}
          </div>
        </div>

        <p className="tank-text">
          {lang === 'hi' ? `उपलब्ध जल: ${waterMM} mm` : `Available Water: ${waterMM} mm`}
        </p>
      </div>

      {/* ================= RIGHT — INFO PANEL ================= */}
      <div className="info-panel">
        <div className="info-box">
          <span>{lang === 'hi' ? '💧 पानी बचा' : '💧 Water Left'}</span>
          <h2>{loading ? '...' : `${waterMM} mm`}</h2>
        </div>

        <div className="info-box">
          <span>{lang === 'hi' ? '🌾 सर्वोत्तम फसल' : '🌾 Suggested Crop'}</span>
          {/* Static for now, or dynamic if you add a specific API for it */}
          <h2>{waterMM > 1500 ? (lang === 'hi' ? 'गन्ना' : 'Sugarcane') : (lang === 'hi' ? 'सोयाबीन' : 'Soybean')}</h2>
        </div>

        <div className="info-box">
          <span>{lang === 'hi' ? '💰 अनुमानित लाभ' : '💰 Est Profit/Acre'}</span>
          <h2>₹{waterMM > 1500 ? '1,20,000' : '45,000'}</h2>
        </div>

        <button className="btn-big-primary" onClick={() => navigate('/app/planner')}>
          {lang === 'hi' ? 'फसल योजना बनाएं →' : 'Plan My Crops →'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;