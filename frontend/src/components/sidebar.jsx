import React from 'react';
import { menuItems } from '../data/menuItems';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">WR</div>
        <h2 className="brand-text">INDIA-WRIS</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((group, idx) => (
          <div key={idx} className="nav-group">
            <h4 className="group-title">{group.group}</h4>
            {group.links.map((link, lIdx) => (
              <a key={lIdx} href={link.path} className={`nav-link ${link.active ? 'active' : ''}`}>
                <span className="material-icons">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>SECURE GOV PORTAL V5.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;