import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('hi');

  const toggleLang = () => {
    setLang(lang === 'hi' ? 'en' : 'hi');
  };

  const content = {
    hi: {
      navFeatures: "सुविधाएं",
      navImpact: "प्रभाव",
      navLogin: "लॉगिन",
      logoText: "जल वॉलेट",
      tagline: "NASA & WRIS डेटा का उपयोग",
      title: "हर बूंद पानी से",
      titleGradient: "ज्यादा मुनाफा कमाएं",
      subtitle: "भारत का पहला AI समाधान जो भूजल की सटीक जानकारी देता है और आपको सबसे लाभदायक फसल चुनने में मदद करता है।",
      ctaBtn: "शुरू करें",
      dataSource: "डेटा स्रोत:",
      whyTitle: "वॉटर वॉलेट क्यों चुनें?",
      feature1Title: "सटीक भूजल डेटा",
      feature1Desc: "NASA & WRIS डेटा से आपके गाँव का असली भूजल स्तर जानें।",
      feature2Title: "स्मार्ट फसल सलाह",
      feature2Desc: "AI तकनीक से जानें कौन सी फसल आपकी मिट्टी और पानी के लिए सबसे फायदेमंद है।",
      feature3Title: "ज्यादा आमदनी",
      feature3Desc: "कम पानी में भी ज्यादा मुनाफा। प्रति लीटर पानी से अधिकतम कमाई करें।",
      impactTitle: "असली प्रभाव",
      farmers: "किसान",
      waterSaved: "पानी बचाया",
      profitIncrease: "मुनाफा बढ़ोतरी",
      testimonialText: "वॉटर वॉलेट ने मेरी फसल चुनने में मदद की। अब मैं कम पानी में ज्यादा कमा रहा हूँ।",
      testimonialName: "रमेश पटेल",
      testimonialLocation: "महाराष्ट्र"
    },
    en: {
      navFeatures: "Features",
      navImpact: "Impact",
      navLogin: "Login",
      logoText: "WaterWallet",
      tagline: "Using NASA & WRIS Data",
      title: "Earn More Profit",
      titleGradient: "From Every Drop",
      subtitle: "India's first AI solution that provides accurate groundwater information and helps you choose the most profitable crop.",
      ctaBtn: "Get Started",
      dataSource: "Data Sources:",
      whyTitle: "Why Choose WaterWallet?",
      feature1Title: "Accurate Groundwater Data",
      feature1Desc: "Know your village's real groundwater level using NASA & WRIS data.",
      feature2Title: "Smart Crop Advice",
      feature2Desc: "AI technology tells you which crop is most profitable for your soil and water.",
      feature3Title: "Higher Income",
      feature3Desc: "More profit with less water. Maximum earnings per liter of water.",
      impactTitle: "Real Impact",
      farmers: "Farmers",
      waterSaved: "Water Saved",
      profitIncrease: "Profit Increase",
      testimonialText: "WaterWallet helped me choose the right crop. Now I earn more with less water.",
      testimonialName: "Ramesh Patel",
      testimonialLocation: "Maharashtra"
    }
  };

  const t = content[lang];

  return (
    <div className="landing-container">
      
      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="logo">
          💧 <span>{t.logoText}</span>
        </div>
        
        <div className="nav-right">
          <div className="nav-links">
            <a href="#features">{t.navFeatures}</a>
            <a href="#impact">{t.navImpact}</a>
          </div>
          <button className="lang-toggle" onClick={toggleLang}>
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>
          <button className="btn-login" onClick={() => navigate('/login')}>
            {t.navLogin}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">
            🛰️ {t.tagline}
          </div>
          <h1>
            {t.title}<br />
            <span className="gradient-text">{t.titleGradient}</span>
          </h1>
          <p className="hero-sub">{t.subtitle}</p>
          
          <div className="hero-buttons">
            <button className="btn-primary-lg" onClick={() => navigate('/login')}>
              <span>{t.ctaBtn}</span>
              <span className="arrow">→</span>
            </button>
          </div>

          <div className="data-sources">
            <span className="ds-label">{t.dataSource}</span>
            <div className="source-badges">
              <span className="source-badge">NASA</span>
              <span className="source-badge">WRIS</span>
              <span className="source-badge">OpenWeather</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="water-meter">
                <div className="meter-icon">💧</div>
                <div className="meter-bar">
                  <div className="meter-fill"></div>
                </div>
                <div className="meter-text">
                  <strong>{lang === 'hi' ? 'पानी स्तर' : 'Water Level'}</strong>
                  <span className="critical">15%</span>
                </div>
              </div>
              <div className="crop-suggestion">
                <div className="cs-icon">🌾</div>
                <div className="cs-content">
                  <strong>{lang === 'hi' ? 'सुझाई गई फसल' : 'Suggested Crop'}</strong>
                  <p>{lang === 'hi' ? 'मूंगफली' : 'Groundnut'}</p>
                  <span className="profit-tag">+40% {lang === 'hi' ? 'मुनाफा' : 'Profit'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <h2>{t.whyTitle}</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">💧</div>
            <h3>{t.feature1Title}</h3>
            <p>{t.feature1Desc}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>{t.feature2Title}</h3>
            <p>{t.feature2Desc}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>{t.feature3Title}</h3>
            <p>{t.feature3Desc}</p>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="impact-section" id="impact">
        <h2>{t.impactTitle}</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">{t.farmers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50 करोड़ L</div>
            <div className="stat-label">{t.waterSaved}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">35%</div>
            <div className="stat-label">{t.profitIncrease}</div>
          </div>
        </div>

        <div className="testimonial">
          <div className="testimonial-icon">💬</div>
          <p className="testimonial-text">"{t.testimonialText}"</p>
          <div className="testimonial-author">
            <strong>{t.testimonialName}</strong>
            <span>{t.testimonialLocation}</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;