import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faPowerOff, faInfo, faThumbsUp, faPieChart, faSearch } from '@fortawesome/free-solid-svg-icons';
import useSidebarToggle from './Sidebar/Handletooglesidebar';


const Navbar = () => {
  const { handleToggleSidebar } = useSidebarToggle();
  return (
    <nav className="navbar navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-brand">
          <button
            type="button"
            className="btn-toggle-offcanvas"
            onClick={handleToggleSidebar}
            
          >
         <i class="fa fa-bars"></i>
          </button>
          <button
            type="button"
            className="btn-toggle-fullwidth"
            onClick={handleToggleSidebar}
          >
            <i class="fa fa-bars"></i>
          </button>
          <a href="index.html" className="windhvi-text" >Artsays</a>
        </div>

        <div className="navbar-right">
          <SearchForm />
          <NavbarMenu />
        </div>
      </div>
    </nav>
  );
};

const SearchForm = () => (
  <form id="navbar-search" className="navbar-form search-form">
    <input value="" className="form-control" placeholder="Search here..." type="text" />
    <button type="button" className="btn btn-default">
      <FontAwesomeIcon icon={faSearch} /> {/* Use the imported icon */}
    </button>
  </form>
);

const  NavbarMenu = () => (
  <div id="navbar-menu">
    <ul className="nav navbar-nav">
      <Notifications />
      <li>
        <a href="page-login.html" className="icon-menu">
          <FontAwesomeIcon icon={faPowerOff} />
        </a>
      </li>
    </ul>
  </div>
);

const Notifications = () => (
  <li className="dropdown show">
  <a
    href=""
    className="dropdown-toggle icon-menu"
    data-toggle="dropdown"
  >
    <i className="fa fa-bell" />
    <span className="notification-dot" />
  </a>
    <ul className="dropdown-menu notifications">
      <li className="header">
        <strong>You have 4 new Notifications</strong>
      </li>
      <Notification
        icon={faInfo}
        text="Campaign Holiday Sale is nearly reach budget limit."
        timestamp="10:00 AM Today"
        color="text-warning"
      />
      <Notification
        icon={faThumbsUp}
        text="Your New Campaign Holiday Sale is approved."
        timestamp="11:30 AM Today"
        color="text-success"
      />
      <Notification
        icon={faPieChart}
        text="Website visits from Twitter is 27% higher than last week."
        timestamp="04:00 PM Today"
        color="text-info"
      />
      <Notification
        icon={faInfo}
        text="Error on website analytics configurations"
        timestamp="Yesterday"
        color="text-danger"
      />
      <li className="footer">
        <a href="#" className="more">
          See all notifications
        </a>
      </li>
    </ul>
  </li>
);

const Notification = ({ icon, text, timestamp, color }) => (
  <li>
    <a href="#">
      <div className="media">
        <div className="media-left">
          {/* <FontAwesomeIcon icon={icon} className={color} /> */}
        </div>
        <div className="media-body">
          <p className="text">{text}</p>
          <span className="timestamp">{timestamp}</span>
        </div>
      </div>
    </a>
  </li>
);

export default Navbar;
