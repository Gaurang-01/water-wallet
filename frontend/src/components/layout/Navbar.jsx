import React, { useState } from 'react';
import { NavLink,Link  } from 'react-router-dom';
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
        {/* LOGO */}
        <Link to="/" className="nav-brand">
  💧    {lang === 'hi' ? 'जल वॉलेट' : 'WaterWallet'}
        </Link>


        {/* LINKS (desktop only) */}
        <div className="nav-links">
          <NavLink to="/app">Dashboard</NavLink>
          <NavLink to="/app/planner">Crop Planner</NavLink>
          
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-actions">
          <button className="lang-btn" onClick={toggleLanguage}>
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>

          {/* ONLY visible on mobile */}
          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          <NavLink to="/app" onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/app/planner" onClick={closeMenu}>Crop Planner</NavLink>
          <NavLink to="/app/profit" onClick={closeMenu}>Profit Calc</NavLink>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;