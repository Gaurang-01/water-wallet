import React from 'react';

const Header = () => {
  return (
    <header className="top-header">
      <div className="search-bar">
        <span className="material-icons">search</span>
        <input type="text" placeholder="Search Wells, Rivers, or Basins..." />
      </div>
      <div className="header-right">
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span className="status-text">LIVE DATA: ACTIVE</span>
        </div>
        <button className="icon-btn">
          <span className="material-icons">notifications</span>
        </button>
        <div className="user-profile">
          <span>IN</span>
        </div>
      </div>
    </header>
  );
};

export default Header;