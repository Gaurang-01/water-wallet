import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      
      {/* --- NAVBAR --- */}
      <nav className="landing-nav">
        <div className="logo">
            <span className="material-icons logo-icon">water_drop</span>
            <span>WaterWallet</span>
        </div>
        <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#impact">Impact</a>
            <button className="btn-login" onClick={() => navigate('/app')}>
                Login
            </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero-section">
        <div className="hero-content">
            <div className="badge-pill">🚀 Powered by NASA & ISRO Data</div>
            <h1>
                Make Every Drop Count <br />
                <span className="gradient-text">Maximize Profit-Per-Drop</span>
            </h1>
            <p className="hero-sub">
                The world's first AI-driven solvency engine for farmers. 
                We combine satellite imagery with ground truth to predict 
                aquifer levels and recommend high-value crops.
            </p>
            
            <div className="hero-buttons">
                <button className="btn-primary-lg" onClick={() => navigate('/app')}>
                    Launch App 🚀
                </button>
                <button className="btn-secondary-lg">
                    Watch Demo
                </button>
            </div>

            {/* TRUST BADGES */}
            <div className="trust-row">
                <span>Trusted by:</span>
                <div className="partner-logo">NASA</div>
                <div className="partner-logo">ISRO</div>
                <div className="partner-logo">NABARD</div>
            </div>
        </div>

        {/* HERO IMAGE / GRAPHIC */}
        <div className="hero-visual">
            <div className="floating-card c1">
                <span className="icon">grass</span>
                <div>
                    <strong>Crop Plan</strong>
                    <p>Sugarcane 🚫</p>
                </div>
            </div>
            <div className="floating-card c2">
                <span className="icon">water_drop</span>
                <div>
                    <strong>Water Level</strong>
                    <p>Critical (15%)</p>
                </div>
            </div>
            <div className="circle-bg"></div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section className="features-section" id="features">
        <h2>Why WaterWallet?</h2>
        <div className="feature-grid">
            <div className="feature-card">
                <span className="material-icons f-icon">satellite_alt</span>
                <h3>NASA Precision</h3>
                <p>Real-time groundwater analysis using GRACE satellite data downscaled to village level.</p>
            </div>
            <div className="feature-card">
                <span className="material-icons f-icon">psychology</span>
                <h3>AI Logic</h3>
                <p>Our Random Forest model learns local soil patterns to correct satellite errors.</p>
            </div>
            <div className="feature-card">
                <span className="material-icons f-icon">payments</span>
                <h3>Profit-Per-Drop</h3>
                <p>Don't just save water. Monetize it. We suggest crops that yield maximum revenue per liter.</p>
            </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;