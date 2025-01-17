import React from "react";
import Navbar from "../Dashboardcomponents/Navbar";
import Sidebar from "../Dashboardcomponents/Sidebar/LeftSide";
import RightIconBar from "../Dashboardcomponents/RightIconBar";

const Layout = ({ children }) => {
  return (
    <div id="wrapper">
      <Navbar />
      <Sidebar />
      <RightIconBar />
      <div id="main-content">{children}</div>
    </div>
  );
};

export default Layout;
