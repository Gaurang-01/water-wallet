import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

const Header = () => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="top-header">
      <div className="search-bar">
        <span className="material-icons">location_on</span>
        <input type="text" placeholder={t.search_placeholder} defaultValue="Chaka, Prayagraj (211008)" />
      </div>

      <div className="header-right">
        {/* Toggle Button: Shows what language you CAN switch to */}
        <button className="lang-toggle" onClick={toggleLanguage}>
          <span className="material-icons">translate</span>
          {lang === 'hi' ? 'English' : 'हिंदी'}
        </button>

        <div className="status-pill critical">
          <span className="dot"></span>
          {t.zone_critical}
        </div>
      </div>
    </header>
  );
};

export default Header;