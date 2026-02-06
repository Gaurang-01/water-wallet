import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import CropPlanner from './pages/Planner/CropPlanner';

// Styles
import './styles/variables.css';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="layout-root">
        <Sidebar />
        <div className="layout-body">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<CropPlanner />} />
            <Route path="/profit" element={<div className="page-content"><h1>Profit Module Coming Soon</h1></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;