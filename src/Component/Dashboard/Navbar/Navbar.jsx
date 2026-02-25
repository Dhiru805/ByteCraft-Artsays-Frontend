import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useSidebarToggle from '../Sidebar/Handletooglesidebar';
import { useNavigate } from "react-router-dom";
import { handleLogout } from '../LogoutConfirmation';
import { useAuth } from '../../../AuthContext';
import SellerNotificationDropdown from '../../Notifications/SellerNotificationDropdown';

const Navbar = () => {
  const { handleToggleSidebar } = useSidebarToggle();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-brand">
          <button
            type="button"
            className="btn-toggle-offcanvas"
            onClick={handleToggleSidebar}
          >
            <i className="fa fa-bars"></i>
          </button>
          <button
            type="button"
            className="btn-toggle-fullwidth"
            onClick={handleToggleSidebar}
          >
            <i className="fa fa-bars"></i>
          </button>
            <a href="/" className="windhavi">
              Artsays
            </a>
        </div>

        <div className="navbar-right">
          <SearchForm />
          <NavbarMenu navigate={navigate} logout={logout} />
        </div>
      </div>
    </nav>
  );
};

const SearchForm = () => (
  <form id="navbar-search" className="navbar-form search-form">
    <input defaultValue="" className="form-control" placeholder="Search here..." type="text" />
    <button type="button" className="btn btn-default">
      <FontAwesomeIcon icon={faSearch} />
    </button>
  </form>
);

const NavbarMenu = ({ navigate, logout }) => (
  <div id="navbar-menu">
    <ul className="nav navbar-nav" style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
        <li style={{ display: "flex", alignItems: "center" }}>
          <SellerNotificationDropdown />
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <a href="#" className="icon-menu" onClick={() => handleLogout(navigate, logout)}>
            <i className="fa fa-power-off"></i>
          </a>
        </li>
      </ul>
  </div>
);

export default Navbar;
