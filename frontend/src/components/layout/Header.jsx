import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="top-header">
      <div className="search-bar">
        <span className="material-icons">location_on</span>
        <input type="text" placeholder="Search Village, Pincode or Block..." defaultValue="Chaka, Prayagraj (211008)" />
      </div>

      <div className="header-right">
        <div className="status-pill critical">
          <span className="dot"></span>
          ZONE: CRITICAL
        </div>
        <span className="material-icons icon-btn">notifications</span>
        <span className="material-icons icon-btn">translate</span>
      </div>
    </header>
  );
};

export default Header;