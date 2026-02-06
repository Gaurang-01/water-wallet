import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [location, setLocation] = useState("");

  const search = () => {
    if (!location.trim()) return;

    // store globally for other pages
    localStorage.setItem("location", location);
    window.dispatchEvent(new Event("locationChanged"));
  };

  return (
    <header className="top-header">
      <div className="search-bar">
        <span className="material-icons">location_on</span>

        <input
          type="text"
          placeholder="Search Village, District or Block..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />

        <button onClick={search}>Search</button>
      </div>

      <div className="header-right">
        <div className="status-pill critical">
          <span className="dot"></span>
          ZONE: LIVE
        </div>
      </div>
    </header>
  );
};

export default Header;
