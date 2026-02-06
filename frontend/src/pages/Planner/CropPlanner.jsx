import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CropPlanner.css';


/* ================= CROP LIST ================= */
const CROP_OPTIONS = [
  "Sugarcane", "Rice", "Wheat", "Maize", "Jowar", "Bajra",
  "Cotton", "Jute", "Soybean", "Groundnut", "Mustard",
  "Chickpea", "Tur", "Moong",
  "Tomato", "Potato", "Onion", "Okra",
  "Tea", "Coffee", "Coconut", "Rubber"
];


/* ================= SEARCHABLE DROPDOWN ================= */
const SearchableDropdown = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="searchable-dropdown" ref={wrapperRef}>
      <label>{label}</label>

      <input
        className="dropdown-input"
        value={searchTerm}
        onClick={() => setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Type to search..."
      />

      {isOpen && filtered.length > 0 && (
        <ul className="dropdown-list">
          {filtered.map((opt, i) => (
            <li
              key={i}
              onClick={() => {
                setSearchTerm(opt);
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


/* ================= HELPER ================= */
const getBarWidth = (available, needed) => {
  if (!needed) return 0;
  return available >= needed ? 100 : (available / needed) * 100;
};


/* ================= MAIN COMPONENT ================= */
const CropPlanner = () => {

  /* ⭐ CORRECT — hook INSIDE component */
  const { lang } = useLanguage();


  /* ---------- STATE ---------- */
  const [village, setVillage] = useState('Punade');
  const [crop, setCrop] = useState('Sugarcane');
  const [area, setArea] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);


  /* ---------- TRANSLATIONS ---------- */
  const t = {
    en: {
      title: "Smart Crop Planner",
      subtitle: "Profit-Per-Drop & Aquifer Check",
      input_village: "Village Name",
      input_crop: "Select Crop",
      input_area: "Area (Acres)",
      btn_check: "Check Viability",
      analyzing: "Analyzing Aquifer...",
      aquifer: "Available",
      demand: "Needed",
      balance: "Water Balance",
      maximize: "Maximize Profit",
      best_alt: "Best Alternatives",
      profit_drop: "Profit/Drop"
    },

    hi: {
      title: "स्मार्ट फसल योजना",
      subtitle: "मुनाफा-प्रति-बूंद और जल स्तर जाँच",
      input_village: "गाँव का नाम",
      input_crop: "फसल चुनें",
      input_area: "क्षेत्र (एकड़)",
      btn_check: "जाँच करें",
      analyzing: "गणना जारी है...",
      aquifer: "उपलब्ध जल",
      demand: "आवश्यक जल",
      balance: "जल शेष",
      maximize: "अधिक मुनाफा कमाएं",
      best_alt: "सर्वोत्तम विकल्प",
      profit_drop: "मुनाफा/बूंद"
    }
  }[lang];


  /* ---------- API ---------- */
  const runAnalysis = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ village, crop, area })
      });

      const data = await res.json();
      setResult(data);

    } catch {
      alert("Backend not running");
    } finally {
      setLoading(false);
    }
  };


  /* ================= UI ================= */
  return (
    <div className="planner-page">

      {/* HEADER */}
      <div className="header-row">
        <div>
          <h1>🌾 {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>


      {/* FORM */}
      <div className="planner-container">
        <div className="input-card">

          <div className="form-group">
            <label>{t.input_village}</label>
            <input value={village} onChange={e => setVillage(e.target.value)} />
          </div>

          <SearchableDropdown
            label={t.input_crop}
            value={crop}
            onChange={setCrop}
            options={CROP_OPTIONS}
          />

          <div className="form-group" style={{ marginTop: 20 }}>
            <label>{t.input_area}</label>
            <input type="number" value={area} onChange={e => setArea(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={runAnalysis} disabled={loading}>
            {loading ? t.analyzing : t.btn_check}
          </button>
        </div>


        {/* RESULTS */}
        {result && (
          <div className="result-area">

            <div className={`alert-card ${result.status === 'PASS' ? 'safe' : 'danger'}`}>

              <div className="water-stats-row">
                <span>{t.aquifer}: {result.water_math.available}mm</span>
                <span>{t.demand}: {result.water_math.needed}mm</span>
              </div>

              <div className="water-visual-bar">
                <div
                  className="water-fill"
                  style={{ width: `${getBarWidth(result.water_math.available, result.water_math.needed)}%` }}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                {t.balance}: {result.water_math.balance}mm
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CropPlanner;
