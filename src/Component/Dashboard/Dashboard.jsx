import React from 'react';
import Navbar from "../../Component/Dashboard/Dashboardcomponents/Navbar";
import Sidebar from "../../Component/Dashboard/Dashboardcomponents/Sidebar/LeftSide";
import RightIconBar from "../../Component/Dashboard/Dashboardcomponents/RightIconBar";
import DashboardContain from "../Dashboard/Dashboardcomponents/MainContent";
import { Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const isMainDashboard = location.pathname === '/Dashboard';

  return (
      <div id="wrapper">
        <Navbar />
        <Sidebar />
        <RightIconBar />
        <div id="main-content">
          {isMainDashboard && <DashboardContain />}
          <Outlet />
        </div>
      </div>
  
  );
};

export default Dashboard;
