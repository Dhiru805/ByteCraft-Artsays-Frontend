import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/LeftSide";
import RightIconBar from "../RightIconBar/RightIconBar";
import Footer from "../Footer/Footer";
import { Outlet } from 'react-router-dom';
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import FloatingHelp from "../Support/FloatingHelp";

const Dashboard = () => {
  const initColor = window.__DASHBOARD_COLOR__ || localStorage.getItem('selectedColor') || 'cyan';

  const closeSidebar = () => {
    const sidebar = document.getElementById('left-sidebar');
    if (sidebar) sidebar.classList.remove('open');
    document.body.classList.remove('offcanvas-active');
  };

  return (
    <div id="wrapper" className={`theme-${initColor}`}>
      <ScrollToTop />
      <Navbar />
      <Sidebar />
      <div className="sidebar-overlay" onClick={closeSidebar} />
      {/* <RightIconBar /> */}

        <div id="main-content" className="d-flex flex-column min-vh-100">
          <div className="flex-grow-1">
            <Outlet />
          </div>
          <div className="mb-3">
            <Footer />
          </div>
        </div>
        <FloatingHelp />
      </div>
  );
};

export default Dashboard;