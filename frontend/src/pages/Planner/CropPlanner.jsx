import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CropPlanner.css';

/* ================= CROP LIST ================= */
const CROP_OPTIONS = [
  "Sugarcane","Rice","Wheat","Maize","Jowar","Bajra",
  "Cotton","Soybean","Chickpea","Tomato","Onion","Okra"
];

/* ================= TYPE HINDI MAP ================= */
const cropTypeHi = {
  Veg: "सब्ज़ी",
  Pulse: "दलहन",
  Cereal: "अनाज",
  Cash: "नकदी फसल",
  Oil: "तिलहन",
  Plantation: "बागान"
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
      cultivate: "(Time to cultivate)"
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
      cultivate: "(उगने का समय)"
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

    const res = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        village,
        crop,
        area,
        ...(coords || {})   // send lat/lon if available
      })
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
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

              <h3>{result.outcome.message}</h3>

              {/* ALWAYS SHOW REASON */}
              <p><b>{t.reason}:</b> {result.outcome.reason}</p>

              <p>
                Available: {result.water_math.available}mm |
                Needed: {result.water_math.needed}mm
              </p>
            </div>


            {/* ================= SUGGESTIONS ================= */}
            {result.outcome.suggestions.length > 0 && (
              <>
                <h3 className="suggest-title">💡 {t.alternatives}</h3>

                {result.outcome.suggestions.map((s, i) => (
                  <div key={i} className="suggest-card">

                    <h4>
                      {lang === 'hi' ? cropTypeHi[s.type] || s.crop : s.crop}
                    </h4>

                    <div className="meta">
                      ⏱ {lang === 'hi'
                        ? `${s.duration.split(" ")[0]} दिन ${t.cultivate}`
                        : `${s.duration} ${t.cultivate}`}
                    </div>

                    <div className="meta">
                      💰 ₹{s.profit.toLocaleString()}
                    </div>

                    <div className="tag">
                      {lang === 'hi'
                        ? (s.is_immediate ? "✨ अभी बोएं" : "⏳ इंतजार करें")
                        : s.tag}
                    </div>

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
