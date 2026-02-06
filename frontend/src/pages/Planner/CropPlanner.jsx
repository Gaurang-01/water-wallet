import React, { useState } from 'react';
import './CropPlanner.css';

const CropPlanner = () => {
  // --- LANGUAGE STATE (Default Hindi) ---
  const [lang, setLang] = useState('hi'); // 'hi' or 'en'
  
  // --- TRANSLATIONS ---
  const t = {
    hi: {
      title: "फसल योजना और जल बजट",
      subtitle: "अपनी मिट्टी और पानी के लिए सही फसल चुनें",
      btn_gps: "📍 मेरे स्थान का उपयोग करें",
      input_village: "गाँव का नाम",
      input_crop: "फसल चुनें",
      input_area: "खेती का क्षेत्र (एकड़)",
      btn_check: "जाँच करें (Analyze)",
      loading: "डेटा लाया जा रहा है...",
      weather_title: "अगले 5 दिनों का मौसम",
      sow_title: "बुवाई का समय",
      water_avail: "उपलब्ध पानी",
      water_req: "आवश्यक पानी",
      status_danger: "चेतावनी: पानी की कमी!",
      status_safe: "सुरक्षित: पर्याप्त पानी",
      swap_title: "सुझाव: यह फसल लगायें",
      save_water: "पानी बचाएं",
      source_label: "डेटा स्रोत"
    },
    en: {
      title: "Crop Planner & Water Budget",
      subtitle: "Choose the right crop for your water level",
      btn_gps: "📍 Use Current Location",
      input_village: "Village Name",
      input_crop: "Select Crop",
      input_area: "Area (Acres)",
      btn_check: "Analyze Soil",
      loading: "Fetching Data...",
      weather_title: "5-Day Forecast",
      sow_title: "Ideal Sowing Time",
      water_avail: "Available Water",
      water_req: "Required Water",
      status_danger: "High Risk: Water Deficit",
      status_safe: "Safe: Water Surplus",
      swap_title: "Smart Swap Suggestion",
      save_water: "Save Water",
      source_label: "Data Source"
    }
  }[lang];

  // --- FORM STATE ---
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('Sugarcane');
  const [area, setArea] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // --- GEOLOCATION HANDLER ---
  const handleGPS = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        // Send Coords to Backend directly
        fetchAnalysis({ 
            useGPS: true, 
            lat: position.coords.latitude, 
            lon: position.coords.longitude,
            crop, area 
        });
      }, (error) => {
        alert("Location access denied. Please type village name.");
        setLoading(false);
      });
    }
  };

  // --- MANUAL CHECK HANDLER ---
  const handleManualCheck = () => {
    fetchAnalysis({ useGPS: false, village, crop, area });
  };

  // --- API CALL ---
  const fetchAnalysis = async (payload) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/api/water/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Server Error. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-page">
      {/* Header with Lang Toggle */}
      <div className="header-row">
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <button className="lang-btn" onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}>
          {lang === 'hi' ? '🇺🇸 English' : '🇮🇳 हिंदी'}
        </button>
      </div>

      <div className="planner-container">
        
        {/* --- INPUT SECTION --- */}
        <div className="card input-section">
          
          <button className="gps-btn" onClick={handleGPS}>
            {t.btn_gps}
          </button>
          
          <div className="or-divider">- OR -</div>

          <div className="form-group">
            <label>{t.input_village}</label>
            <input 
              value={village} 
              onChange={(e) => setVillage(e.target.value)} 
              placeholder={lang === 'hi' ? "उदाहरण: पुनाड़े" : "e.g. Punade"}
            />
          </div>

          <div className="form-group">
            <label>{t.input_crop}</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="Sugarcane">Sugarcane (गन्ना)</option>
              <option value="Paddy">Paddy (धान)</option>
              <option value="Wheat">Wheat (गेहूँ)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Chickpea">Chickpea (चना)</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t.input_area}</label>
            <input 
              type="number" 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
            />
          </div>

          <button className="submit-btn" onClick={handleManualCheck} disabled={loading}>
            {loading ? t.loading : t.btn_check}
          </button>
        </div>

        {/* --- RESULTS SECTION --- */}
        {result && (
          <div className="results-grid">
            
            {/* 1. MAIN STATUS CARD */}
            <div className={`card status-card ${result.status === 'INSOLVENT' ? 'danger' : 'safe'}`}>
              <h2>{result.status === 'INSOLVENT' ? t.status_danger : t.status_safe}</h2>
              <p className="location-tag">📍 {result.location}</p>
              <p className="source-tag">📡 {t.source_label}: {result.source}</p>
              
              <div className="water-stats">
                <div className="stat">
                  <span>{t.water_avail}</span>
                  <strong>{result.waterMath.available} mm</strong>
                </div>
                <div className="stat">
                  <span>{t.water_req}</span>
                  <strong>{result.waterMath.required} mm</strong>
                </div>
              </div>
            </div>

            {/* 2. SOWING & WEATHER */}
            <div className="card info-card">
              <h3>🗓️ {t.sow_title}</h3>
              <p className="sow-date">{result.sowing}</p>
              
              <hr/>
              
              <h3>☁️ {t.weather_title}</h3>
              <div className="weather-row">
                {result.weather && result.weather.length > 0 ? result.weather.map((d, i) => (
                  <div key={i} className="weather-day">
                    <span className="small-date">{d.date.slice(5)}</span>
                    <span className="icon">{d.desc.includes('Rain') ? '🌧️' : '☀️'}</span>
                    <span className="temp">{Math.round(d.temp)}°C</span>
                  </div>
                )) : <p>Weather API Key Needed</p>}
              </div>
            </div>

            {/* 3. SMART SUGGESTIONS (If Risky) */}
            {result.suggestions.length > 0 && (
              <div className="card suggestion-card">
                <h3>💡 {t.swap_title}</h3>
                {result.suggestions.map((s, i) => (
                  <div key={i} className="swap-item">
                    <h4>{s.name}</h4>
                    <p>{t.save_water}: <span className="green-txt">{s.waterSaved} mm</span></p>
                    <p>Profit: ₹{s.profit}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;