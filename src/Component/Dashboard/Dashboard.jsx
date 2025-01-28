import React, { useEffect, useState } from "react";
import Navbar from "../../Component/Dashboard/Dashboardcomponents/Navbar";
import Sidebar from "../../Component/Dashboard/Dashboardcomponents/Sidebar/LeftSide";
import RightIconBar from "../../Component/Dashboard/Dashboardcomponents/RightIconBar";
import DashboardContain from "../Dashboard/Dashboardcomponents/MainContent";
import { Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
   const [userType, setUserType] = useState(null);
   useEffect(() => {
      const storedUserType = localStorage.getItem("userType");
      if (storedUserType) {
        setUserType(storedUserType);
      }
    }, []);

  const isMainDashboard = location.pathname === `/${userType}/Dashboard`;

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
