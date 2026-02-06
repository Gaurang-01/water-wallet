import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/layout/Navbar.jsx';

import LandingPage from './pages/Landing/LandingPage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CropPlanner from './pages/Planner/CropPlanner.jsx';
import ProfitCalc from './pages/Profit/ProfitCalc.jsx';

import './App.css';

// App Layout with Navbar
const AppLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-scrollable">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>

          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* App */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="planner" element={<CropPlanner />} />
            <Route path="profit" element={<ProfitCalc />} />
          </Route>

          {/* Redirects */}
          <Route path="/planner" element={<Navigate to="/app/planner" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;