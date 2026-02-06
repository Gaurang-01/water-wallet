import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="app-sidebar">
      {/* BRAND HEADER */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <span className="material-icons">water_drop</span>
        </div>
        <div className="brand-info">
          <h2 className="brand-text">{t.app_title || "WaterWallet"}</h2>
          <span className="brand-sub">AI Precision Farming</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="nav-group">
        <p className="nav-label">MENU</p>
        
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">dashboard</span>
          <span>{t.menu_inventory || "Dashboard"}</span>
        </NavLink>

        <NavLink to="/planner" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">grass</span>
          <span>{t.menu_planner || "Crop Planner"}</span>
        </NavLink>

        <NavLink to="/profit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">trending_up</span>
          <span>{t.menu_profit || "Profit Calc"}</span>
        </NavLink>
      </nav>

      {/* FOOTER USER CARD */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">R</div>
          <div className="user-text">
            <h4>Ramesh Kumar</h4>
            <span>{t.user_loc || "Punade, MH"}</span>
          </div>
          <span className="material-icons verified-icon">verified</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;