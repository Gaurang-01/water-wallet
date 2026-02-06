import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <nav className="top-navbar">

      {/* ===== LEFT BRAND ===== */}
      <div className="nav-brand">
        <span style={{ fontSize: '20px' }}>💧</span>

        <h2>
          {lang === 'hi' ? 'जल वॉलेट' : 'WaterWallet'}
        </h2>
      </div>


      {/* ===== CENTER MENU ===== */}
      <div className="nav-links">
        <NavLink to="/app">Dashboard</NavLink>
        <NavLink to="/app/planner">Crop Planner</NavLink>
        <NavLink to="/app/profit">Profit Calc</NavLink>
      </div>


      {/* ===== RIGHT SIDE ===== */}
      <div className="nav-right">

        {/* 🌐 Language Toggle */}
        <button className="lang-toggle" onClick={toggleLanguage}>
          {lang === 'hi' ? 'EN' : 'हिं'}
        </button>

        {/* User */}
        <div className="nav-user">
          <div className="avatar">R</div>
          <span>Ramesh</span>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
