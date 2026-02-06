import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">WW</div>
        <div>
          <h2 className="brand-text">{t.app_title}</h2>
          <span className="brand-sub">{t.app_subtitle}</span>
        </div>
      </div>

      <nav className="nav-group">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">water_drop</span>
          {t.menu_inventory}
        </NavLink>
        <NavLink to="/planner" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">grass</span>
          {t.menu_planner}
        </NavLink>
        <NavLink to="/profit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">currency_rupee</span>
          {t.menu_profit}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="material-icons">account_circle</span>
          <p>Ramesh Kumar<br/><span className="loc">{t.user_loc}</span></p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;