import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="top-navbar">
        {/* 1. LOGO */}
        <Link to="/" className="nav-brand">
          <span className="logo-icon">💧</span>
          <span className="logo-text">
            {lang === 'hi' ? 'जल वॉलेट' : 'WaterWallet'}
          </span>
        </Link>

        {/* 2. DESKTOP LINKS (Hidden on Mobile) */}
        <div className="nav-links">
          <NavLink to="/app" className={({ isActive }) => isActive ? "active-link" : ""}>
            {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </NavLink>
          <NavLink to="/app/planner" className={({ isActive }) => isActive ? "active-link" : ""}>
            {lang === 'hi' ? 'फसल योजना' : 'Crop Planner'}
          </NavLink>
        </div>

        {/* 3. RIGHT ACTIONS (Language + Hamburger) */}
        <div className="nav-actions">
          {/* Language Button - Always Visible */}
          <button className="lang-btn" onClick={toggleLanguage}>
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>

          {/* Hamburger - Visible ONLY on Mobile */}
          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          <NavLink to="/app" onClick={closeMenu}>
            {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </NavLink>
          <NavLink to="/app/planner" onClick={closeMenu}>
            {lang === 'hi' ? 'फसल योजना' : 'Crop Planner'}
          </NavLink>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;
