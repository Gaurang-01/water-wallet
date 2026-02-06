import React, { useState, useEffect, useRef } from 'react';
import './CropPlanner.css';

// --- CROP LIST ---
const CROP_OPTIONS = [
  "Sugarcane", "Rice", "Wheat", "Maize", "Jowar", "Bajra", 
  "Cotton", "Jute", "Soybean", "Groundnut", "Mustard",     
  "Chickpea", "Tur", "Moong",                              
  "Tomato", "Potato", "Onion", "Okra",                     
  "Tea", "Coffee", "Coconut", "Rubber"                     
];

// --- SEARCHABLE DROPDOWN COMPONENT ---
const SearchableDropdown = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef(null);

  useEffect(() => { setSearchTerm(value); }, [value]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="searchable-dropdown" ref={wrapperRef}>
      <label>{label}</label>
      <input
        type="text" className="dropdown-input" value={searchTerm}
        onClick={() => setIsOpen(!isOpen)}
        onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); onChange(e.target.value); }}
        placeholder="Type to search..."
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="dropdown-list">
          {filteredOptions.map((opt, i) => (
            <li key={i} onClick={() => { setSearchTerm(opt); onChange(opt); setIsOpen(false); }}>{opt}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const CropPlanner = () => {
  // 1. STATE
  const [lang, setLang] = useState('hi'); // Default to Hindi
  const [village, setVillage] = useState('Punade');
  const [crop, setCrop] = useState('Sugarcane');
  const [area, setArea] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 2. TRANSLATION DICTIONARY
  const t = {
    en: {
      title: "Smart Crop Planner",
      subtitle: "Profit-Per-Drop & Aquifer Check",
      btn_lang: "🇮🇳 HI",
      input_village: "Village Name",
      input_crop: "Select Crop",
      input_area: "Area (Acres)",
      btn_check: "Check Viability",
      analyzing: "Analyzing Aquifer...",
      status_pass: "Solvency Approved",
      status_fail: "High Risk",
      aquifer: "Aquifer Level",
      demand: "Crop Demand",
      balance: "Water Balance",
      revenue: "Est. Revenue",
      suggestions: "Smart Alternatives",
      maximize: "Maximize Profit",
      best_alt: "Best Alternatives",
      sow: "Sow",
      profit_drop: "Profit/Drop",
      duration: "Duration"
    },
    hi: {
      title: "स्मार्ट फसल योजना",
      subtitle: "मुनाफा-प्रति-बूंद और जल स्तर जाँच",
      btn_lang: "🇺🇸 EN",
      input_village: "गाँव का नाम",
      input_crop: "फसल चुनें",
      input_area: "क्षेत्र (एकड़)",
      btn_check: "जाँच करें (Analyze)",
      analyzing: "गणना जारी है...",
      status_pass: "स्वीकृत (Approved)",
      status_fail: "जोखिम (High Risk)",
      aquifer: "उपलब्ध भूजल",
      demand: "फसल की मांग",
      balance: "जल शेष (Balance)",
      revenue: "अनुमानित आय",
      suggestions: "बेहतर विकल्प (Suggestions)",
      maximize: "अधिक मुनाफा कमाएं",
      best_alt: "सर्वोत्तम विकल्प",
      sow: "बुवाई",
      profit_drop: "मुनाफा/बूंद",
      duration: "अवधि"
    }
  }[lang];

  // 3. API CALL
  const runAnalysis = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ village, crop, area, lat: 19.75, lon: 75.71 })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Error: Make sure Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-page">
      {/* HEADER WITH LANGUAGE BUTTON */}
      <div className="header-row">
        <div>
          <h1>🌾 {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <button 
          className="lang-btn" 
          onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
          style={{ padding:'8px 16px', borderRadius:'20px', border:'1px solid #166534', cursor:'pointer', background:'white', fontWeight:'bold'}}
        >
          {t.btn_lang}
        </button>
      </div>

      <div className="planner-container">
        {/* INPUT CARD */}
        <div className="input-card">
          <div className="form-group">
            <label>{t.input_village}</label>
            <input value={village} onChange={(e) => setVillage(e.target.value)} />
          </div>
          
          <SearchableDropdown 
            label={t.input_crop} 
            value={crop} 
            onChange={setCrop} 
            options={CROP_OPTIONS} 
          />
          
          <div className="form-group" style={{marginTop:'20px'}}>
            <label>{t.input_area}</label>
            <input type="number" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={runAnalysis} disabled={loading}>
            {loading ? t.analyzing : t.btn_check}
          </button>
        </div>

        {/* RESULTS AREA */}
        {result && (
          <div className="result-area">
            {/* STATUS CARD */}
            <div className={`alert-card ${result.status === 'PASS' ? 'safe' : 'danger'}`}>
              <div className="alert-header">
                <span className="icon-lg">{result.status === 'PASS' ? '✅' : '🚫'}</span>
                <div>
                    <h2>{result.outcome.message}</h2>
                    <p className="reason-text">{result.outcome.reason}</p>
                </div>
              </div>

              <div className="water-math">
                <div className="math-row green">
                   <span>💧 {t.aquifer}</span> <strong>{result.water_math.available} mm</strong>
                </div>
                <div className="math-row red">
                   <span>📉 {t.demand}</span> <strong>- {result.water_math.needed} mm</strong>
                </div>
                <hr className="divider"/>
                <div className="math-row total">
                   <span>{t.balance}</span> 
                   <span>{result.water_math.balance} mm</span>
                </div>
              </div>

              {result.status === 'PASS' && (
                  <div className="profit-box">
                      <span>{t.revenue}:</span>
                      <strong>₹ {result.outcome.profit.toLocaleString()}</strong>
                  </div>
              )}
            </div>

            {/* SMART SUGGESTIONS */}
            {result.outcome.suggestions.length > 0 && (
                <div className="smart-swap">
                    <h3>💡 {result.status === 'PASS' ? t.maximize : t.best_alt}</h3>
                    
                    {result.outcome.suggestions.map((s, i) => (
                        <div key={i} className="swap-card">
                            <div className={`swap-badge ${s.tag.includes('Wait') ? 'wait' : 'now'}`}>
                                {s.tag}
                            </div>
                            
                            <div className="swap-header">
                                <h4>{s.crop}</h4>
                                <span className="type-pill">{s.type}</span>
                            </div>

                            <div className="swap-meta">
                                <span>⏱️ {s.duration}</span>
                                <span>🗓️ {t.sow}: {s.sowing_window}</span>
                            </div>

                            <div className="swap-metrics">
                                <div className="metric">
                                    <span className="label">Profit (₹)</span>
                                    <span className="value">₹{s.profit.toLocaleString()}</span>
                                </div>
                                <div className="metric ppd">
                                    <span className="label">{t.profit_drop}</span>
                                    <span className="value">₹{s.ppd}/mm</span>
                                </div>
                            </div>
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