import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/LeftSide";
import RightIconBar from "../RightIconBar/RightIconBar";
import Footer from "../Footer/Footer";
import { Outlet } from 'react-router-dom';
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Dashboard = () => {
  return (
    <div id="wrapper">
      <ScrollToTop/>
      <Navbar />
      <Sidebar />
      {/* <RightIconBar /> */}

      <div id="main-content" className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <Outlet />
        </div>
        <div className="mb-3">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
