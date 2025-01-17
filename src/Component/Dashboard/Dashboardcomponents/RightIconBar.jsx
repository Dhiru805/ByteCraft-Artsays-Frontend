import React from 'react';
import { Link } from "react-router-dom";

const RightIconBar = () => {
  return (
    <div className="right_icon_bar">
      <ul>
        <li><Link to="/Appinbox"><i className="fa fa-envelope"></i></Link></li>
        <li><Link to="/Appchat"><i className="fa fa-comments"></i></Link></li>
        <li><Link to="app-calendar.html"><i className="fa fa-calendar"></i></Link></li>
        <li><Link to="file-dashboard.html"><i className="fa fa-folder"></i></Link></li>
        <li><Link to="/Appcontact"><i className="fa fa-id-card"></i></Link></li>
        <li><Link to="/Bloglist"><i className="fa fa-globe"></i></Link></li>
        <li><Link to="/search"><i className="fa fa-plus"></i></Link></li>
        <li><Link to="#" className="right_icon_btn"><i className="fa fa-angle-right"></i></Link></li>
      </ul>
    </div>
  );
};

export default RightIconBar;
