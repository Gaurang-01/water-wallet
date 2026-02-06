import React from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => {
  return (
    <div className="layout-root"> {/* matches CSS */}
      <Sidebar />
      <div className="layout-body"> {/* matches CSS */}
        <Header />
        <main className="layout-content"> {/* matches CSS */}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;