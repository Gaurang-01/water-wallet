import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// --- COMPONENTS (Double-check these match your folders from the screenshot) ---
import Sidebar from './components/layout/Sidebar.jsx'; 
import Header from './components/layout/Header.jsx';
// If Footer doesn't exist, comment this out:
// import Footer from './components/layout/Footer.jsx'; 

// --- PAGES ---
import LandingPage from './pages/Landing/LandingPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CropPlanner from './pages/Planner/CropPlanner.jsx';
import ProfitCalc from './pages/Profit/ProfitCalc.jsx'; 

// Global CSS
import './App.css'; 

// --- LAYOUT WRAPPER ---
// This keeps the Sidebar visible on all App pages
const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
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
          
          {/* 1. PUBLIC LANDING PAGE */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. THE APP (Dashboard, Planner, etc.) */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />      {/* /app */}
            <Route path="planner" element={<CropPlanner />} /> {/* /app/planner */}
            <Route path="profit" element={<ProfitCalc />} />   {/* /app/profit */}
          </Route>

          {/* 3. REDIRECTS (Fixes your blank screen issue) */}
          {/* If you go to /planner, it pushes you to /app/planner */}
          <Route path="/planner" element={<Navigate to="/app/planner" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          
          {/* 4. CATCH ALL (404) - Redirects to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;