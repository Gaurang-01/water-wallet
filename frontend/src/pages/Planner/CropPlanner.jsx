import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CropPlanner.css';

/* ================= CROP LIST ================= */
const CROP_OPTIONS = [
  "Sugarcane","Rice","Wheat","Maize","Jowar","Bajra",
  "Cotton","Soybean","Chickpea","Tomato","Onion","Okra"
];

/* ================= CROP NAME TRANSLATIONS ================= */
const cropNameHi = {
  "Sugarcane": "गन्ना",
  "Rice": "चावल",
  "Wheat": "गेहूं",
  "Maize": "मक्का",
  "Jowar": "ज्वार",
  "Bajra": "बाजरा",
  "Cotton": "कपास",
  "Soybean": "सोयाबीन",
  "Chickpea": "चना",
  "Tomato": "टमाटर",
  "Onion": "प्याज",
  "Okra": "भिंडी",
  "Groundnut": "मूंगफली",
  "Pigeon Pea": "तुअर",
  "Green Gram": "मूंग",
  "Potato": "आलू",
  "Banana": "केला",
  "Grapes": "अंगूर",
  "Turmeric": "हल्दी"
};

/* ================= TYPE HINDI MAP ================= */
const cropTypeHi = {
  Veg: "सब्ज़ी",
  Pulse: "दलहन",
  Cereal: "अनाज",
  Cash: "नकदी फसल",
  Oil: "तिलहन",
  Millet: "बाजरा",
  Fruit: "फल",
  Spice: "मसाला"
};

/* ================= DROPDOWN ================= */
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

      <input
        value={value}
        readOnly
        onClick={() => setOpen(!open)}
      />

      {open && (
        <ul className="dropdown-list">
          {options.map(o => (
            <li key={o} onClick={() => { onChange(o); setOpen(false); }}>
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ================= MAIN ================= */
const CropPlanner = () => {

  const { lang } = useLanguage();

  const [village, setVillage] = useState("Pune");
  const [crop, setCrop] = useState("Tomato");
  const [area, setArea] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [coords, setCoords] = useState(null);

  /* ---------- TEXT ---------- */
  const t = {
    en: {
      title: "Smart Crop Planner",
      village: "Village Name",
      crop: "Select Crop",
      area: "Area (Acres)",
      check: "Check Viability",
      location: "Use My Location",
      alternatives: "Best Alternatives",
      reason: "Reason",
      cultivate: "(Time to cultivate)",
      available: "Available",
      needed: "Needed",
      balance: "Balance",
      profitPerDrop: "Profit Per Drop"
    },
    hi: {
      title: "स्मार्ट फसल योजना",
      village: "गाँव का नाम",
      crop: "फसल चुनें",
      area: "क्षेत्र (एकड़)",
      check: "जाँच करें",
      location: "मेरी लोकेशन",
      alternatives: "बेहतर विकल्प",
      reason: "कारण",
      cultivate: "उगने का समय",
      available: "उपलब्ध",
      needed: "आवश्यक",
      balance: "शेष",
      profitPerDrop: "प्रति बूंद लाभ"
    }
  }[lang];


  /* ================= LOCATION ================= */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      });
      alert("Location detected ✅");
    });
  };


  /* ================= API ================= */
  const runAnalysis = async () => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          village,
          crop: crop.toLowerCase(),
          area,
          district: village.toLowerCase(),
          lang: lang, // Send language to backend
          ...(coords || {})
        })
      });

      const data = await res.json();
      console.log("API Response:", data);
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Error connecting to server!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="planner-page">

      <h1 className="planner-title">{t.title}</h1>

      <div className="planner-grid">

        {/* ================= FORM ================= */}
        <div className="card">

          <div className="form-group">
            <label>{t.village}</label>
            <input value={village} onChange={e => setVillage(e.target.value)} />
          </div>

          <SearchableDropdown
            label={t.crop}
            value={crop}
            onChange={setCrop}
            options={CROP_OPTIONS}
          />

          <div className="form-group">
            <label>{t.area}</label>
            <input
              type="number"
              value={area}
              onChange={e => setArea(e.target.value)}
            />
          </div>

          <button className="btn" onClick={runAnalysis}>
            {loading ? "..." : t.check}
          </button>

          <button className="btn-outline" onClick={getLocation}>
            📍 {t.location}
          </button>
        </div>


        {/* ================= RESULT ================= */}
        {result && (
          <div className="result-col">

            <div className={`alert ${result.status === "PASS" ? "safe" : "danger"}`}>

              <h3>{result.crop_outcome?.message || (lang === 'hi' ? "विश्लेषण पूर्ण" : "Analysis Complete")}</h3>

              <p>
                💧 {t.available}: {result.water_analysis?.available_mm || 0}mm | 
                {t.needed}: {result.water_analysis?.needed_mm || 0}mm | 
                {t.balance}: {result.water_analysis?.balance_mm || 0}mm
              </p>
              
              <p>📊 {t.profitPerDrop}: ₹{result.crop_outcome?.expected_profit && result.water_analysis?.needed_mm 
                ? Math.round(result.crop_outcome.expected_profit / result.water_analysis.needed_mm)
                : 0}/mm</p>
            </div>


            {/* ================= SUGGESTIONS ================= */}
            {result.recommendations && result.recommendations.length > 0 && (
              <>
                <h3 className="suggest-title">💡 {t.alternatives}</h3>

                {result.recommendations.sort((a, b) => b.profit - a.profit).map((s, i) => {
                  // Get Hindi crop name if in Hindi mode
                  const cropDisplayName = lang === 'hi' 
                    ? (cropNameHi[s.crop] || s.crop)
                    : s.crop;

                  return (
                    <div key={i} className="suggest-card">

                      <h4>{cropDisplayName}</h4>

                      <div className="meta">
                        ⏱ {s.duration} ({lang === 'hi' ? t.cultivate : 'Time to cultivate'})
                      </div>

                      <div className="meta">
                        💰 ₹{s.profit.toLocaleString()}
                      </div>
                      
                      <div className="meta">
                        💧 PPD: ₹{s.ppd ? s.ppd.toLocaleString() : 0}/mm
                      </div>

                      <div className="tag">
                        {s.is_immediate 
                          ? (lang === 'hi' ? `✨ अभी बोएं (${s.sowing_period})` : s.tag || "✨ Sow Now")
                          : (lang === 'hi' ? `⏳ ${s.sowing_period} के लिए इंतजार करें` : s.tag || "⏳ Wait")}
                      </div>

                    </div>
                  );
                })}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;
