import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [lang, setLang] = useState('hi');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');

  const toggleLang = () => setLang(lang === 'hi' ? 'en' : 'hi');

  const content = {
    hi: {
      welcome: "स्वागत है किसान भाई",
      subtitle: "अपने खेत का पानी बचाएं, मुनाफा बढ़ाएं",
      name: "आपका नाम",
      village: "गाँव का नाम",
      start: "शुरू करें",
      brand: "जल वॉलेट",
      tagline: "NASA & WRIS डेटा का उपयोग करते हुए"
    },
    en: {
      welcome: "Welcome Farmer",
      subtitle: "Save water, increase profit",
      name: "Your Name",
      village: "Village Name",
      start: "Start",
      brand: "WaterWallet",
      tagline: "Using NASA & WRIS Data"
    }
  };

  const t = content[lang];

  const handleStart = (e) => {
    e.preventDefault();

    if (!name || !village) {
      alert("Fill details");
      return;
    }

    // ⭐ Hackathon simple storage
    localStorage.setItem('userName', name);
    localStorage.setItem('userVillage', village);

    navigate('/app');
  };

  return (
    <div className="login-container">

      {/* LEFT BRAND */}
      <div className="login-left">
        <div className="brand-section">
          <h2>💧 {t.brand}</h2>
          <p>{t.tagline}</p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="login-right">

        <button className="lang-toggle" onClick={toggleLang}>
          {lang === 'hi' ? 'EN' : 'हिं'}
        </button>

        <div className="form-card">

          <h1>{t.welcome}</h1>
          <p className="subtitle">{t.subtitle}</p>

          <form onSubmit={handleStart}>

            {/* NAME */}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.name}
              />
            </div>

            {/* VILLAGE */}
            <div className="input-group">
              <span className="input-icon">📍</span>
              <input
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={t.village}
              />
            </div>

            <button className="btn-start">
              {t.start} →
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
