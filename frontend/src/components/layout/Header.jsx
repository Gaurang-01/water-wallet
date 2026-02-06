import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

const Header = () => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="top-header">
      {/* 1. SEARCH BAR (Simulated) */}
      <div className="search-bar">
        <span className="material-icons">location_on</span>
        <input 
          type="text" 
          placeholder={t.search_placeholder || "Search Village..."} 
          defaultValue="Punade, Maharashtra (411008)" 
        />
      </div>

      <div className="header-right">
        {/* 2. CRITICAL ALERT BADGE */}
        <div className="status-pill critical">
          <span className="dot"></span>
          {t.zone_critical || "CRITICAL ZONE"}
        </div>

        {/* 3. THE ONLY LANGUAGE TOGGLE */}
        <button className="lang-toggle" onClick={toggleLanguage}>
          <span className="material-icons">translate</span>
          {lang === 'hi' ? 'English' : 'हिंदी'}
        </button>
      </div>
    </header>
  );
};

export default Header;