import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">WW</div>
        <div>
          <h2 className="brand-text">Water Wallet</h2>
          <span className="brand-sub">Farmer Solvency AI</span>
        </div>
      </div>

      <nav className="nav-group">
        <p className="group-title">Menu</p>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">water_drop</span>
          Aquifer Inventory
        </NavLink>
        <NavLink to="/planner" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">grass</span>
          Crop Planner
        </NavLink>
        <NavLink to="/profit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">currency_rupee</span>
          Profit-Per-Drop
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="material-icons">account_circle</span>
          <p>Ramesh Kumar<br/><span className="loc">Chaka, Prayagraj</span></p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;