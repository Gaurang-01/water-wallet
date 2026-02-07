import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CropPlanner.css';

/* ================= CROP LIST & CONSTANTS ================= */
const CROP_OPTIONS = [
  "Sugarcane","Rice","Wheat","Maize","Jowar","Bajra",
  "Cotton","Soybean","Chickpea","Tomato","Onion","Okra"
];

const cropNameHi = {
  "Sugarcane": "गन्ना", "Rice": "चावल", "Wheat": "गेहूं", "Maize": "मक्का",
  "Jowar": "ज्वार", "Bajra": "बाजरा", "Cotton": "कपास", "Soybean": "सोयाबीन",
  "Chickpea": "चना", "Tomato": "टमाटर", "Onion": "प्याज", "Okra": "भिंडी",
  "Groundnut": "मूंगफली", "Pigeon Pea": "तुअर", "Green Gram": "मूंग",
  "Potato": "आलू", "Banana": "केला", "Grapes": "अंगूर", "Turmeric": "हल्दी"
};

const SearchableDropdown = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const close = e => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div className="dropdown" ref={ref}>
      <label>{label}</label>
      <input value={value} readOnly onClick={() => setOpen(!open)} />
      {open && (
        <ul className="dropdown-list">
          {options.map(o => (
            <li key={o} onClick={() => { onChange(o); setOpen(false); }}>{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CropPlanner = () => {
  const { lang } = useLanguage();
  const [village, setVillage] = useState(localStorage.getItem('farmerVillage') || "Pune");
  const [crop, setCrop] = useState("Tomato");
  const [area, setArea] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  const t = {
    en: { title: "Smart Crop Planner", village: "Village Name", crop: "Select Crop", area: "Area (Acres)", check: "Check Viability", location: "Use My Location", alternatives: "Best Alternatives", available: "Available", needed: "Needed", balance: "Balance", profitPerDrop: "Profit Per Drop" },
    hi: { title: "स्मार्ट फसल योजना", village: "गाँव का नाम", crop: "फसल चुनें", area: "क्षेत्र (एकड़)", check: "जाँच करें", location: "मेरी लोकेशन", alternatives: "बेहतर विकल्प", available: "उपलब्ध", needed: "आवश्यक", balance: "शेष", profitPerDrop: "प्रति बूंद लाभ" }
  }[lang];

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        alert("Location detected ✅");
      },
      () => alert("Unable to retrieve location")
    );
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // ⭐ UPDATED URL: Points to Render Backend
      const res = await fetch('https://water-wallet.onrender.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          village,
          crop: crop.toLowerCase(),
          area: parseFloat(area),
          district: village.toLowerCase(),
          ...(coords || {})
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep the exact same JSX return as your previous code)
  // I am condensing the return for brevity, but keep your existing JSX structure
  return (
    <div className="planner-page">
      <h1 className="planner-title">{t.title}</h1>
      <div className="planner-grid">
        <div className="card">
          <div className="form-group">
            <label>{t.village}</label>
            <input value={village} onChange={e => setVillage(e.target.value)} />
          </div>
          <SearchableDropdown label={t.crop} value={crop} onChange={setCrop} options={CROP_OPTIONS} />
          <div className="form-group">
            <label>{t.area}</label>
            <input type="number" value={area} onChange={e => setArea(e.target.value)} />
          </div>
          <button className="btn" onClick={runAnalysis} disabled={loading}>
            {loading ? "Analyzing..." : t.check}
          </button>
          <button className="btn-outline" onClick={getLocation}>📍 {t.location}</button>
        </div>

        {result && (
            // ... Copy your exact Result JSX from your previous message here ...
            // The logic is unchanged, only the fetch URL above changed.
            <div className="result-col">
            <div className={`alert ${result.status === "PASS" ? "safe" : "danger"}`}>
              <h3>{result.crop_outcome?.message}</h3>
              <p>
                💧 {t.available}: {result.water_analysis?.available_mm}mm | 
                {t.needed}: {result.water_analysis?.needed_mm}mm
              </p>
              <p>📊 {t.profitPerDrop}: ₹{Math.round(result.crop_outcome?.expected_profit / result.water_analysis?.needed_mm || 0)}/mm</p>
            </div>

            {result.recommendations?.length > 0 && (
              <>
                <h3 className="suggest-title">💡 {t.alternatives}</h3>
                {result.recommendations.map((s, i) => (
                  <div key={i} className="suggest-card">
                    <h4>{lang === 'hi' ? (cropNameHi[s.crop] || s.crop) : s.crop}</h4>
                    <div className="meta">💰 ₹{s.profit.toLocaleString()}</div>
                    <div className="meta">💧 PPD: ₹{s.ppd}/mm</div>
                    <div className="tag">{s.is_immediate ? "✨ Sow Now" : `⏳ Wait (${s.sowing_period})`}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;