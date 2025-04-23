import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../LogoutConfirmation";
import useUserType from '../urlconfig';

const Sidebarprofile = ({ user,userId, isOpen, handleToggleSidebar, HandletoggleDropdown}) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const userType = useUserType(); 

  


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        HandletoggleDropdown(); 
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, HandletoggleDropdown]);

  const sidebarItems = [
    {
      label: "My Profile",
      icon: "fa-user",
      path: `/${userType ? userType.toLowerCase() : "user"}/profile`,
      state: { _id: userId }
    },
    {
      label: "Messages",
      icon: "bi-envelope-open",
      path: "/app-inbox.html",
    },
    {
      label: "Settings",
      icon: "bi-gear",
      path: "#",
    },
    {
      label: "Logout",
      icon: "bi-power",
      action: () => handleLogout(navigate),
    },
  ];

  const stats = [
    {
      label: "Sales",
      value: 561,
    },
    {
      label: "Orders",
      value: 920,
    },
    {
      label: "Revenue",
      value: "$23B",
    },
  ];

  return (
    <div>
      <button
        type="button"
        className="btn-toggle-offcanvas"
        onClick={handleToggleSidebar}
      >
        <i className="fa fa-arrow-left"></i>
      </button>
      <div className="sidebar-scroll">
        <div className="user-account">
          {user && user.profilePhoto && (
            <img
            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}?${Date.now()}`} 
              className="rounded-circle user-photo"
              alt="User Profile Picture"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
              }}
            />
          )}
          <div className="dropdown" ref={dropdownRef}>
            <span>Welcome,</span>
            {user ? (
              <a
                href="#!"
                className="dropdown-toggle user-name"
                data-toggle="dropdown"
                onClick={(e) => {
                  e.stopPropagation();
                  HandletoggleDropdown(); 
                }}
                aria-expanded={isOpen ? "true" : "false"}
              >
                <strong>{`${user.name} ${user.lastName}`}</strong>
              </a>
            ) : (
              <strong>Guest</strong>
            )}
            <ul
              className={`dropdown-menu dropdown-menu-right account ${
                isOpen ? "show" : ""
              }`}
              style={{
                position: "absolute",
                top: isOpen ? "100%" : "80%",
                left: "0",
                transform: isOpen ? "translate3d(-54px, 42px, 0px)" : "none",
                willChange: "transform",
              }}
            >
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  {item.action ? (
                    <a href="#!" onClick={item.action}>
                      <i className={`fa ${item.icon}`}></i> {item.label}
                    </a>
                  ) : (
                    <Link to={item.path} state={item.state}>
                      <i className={`fa ${item.icon}`}></i> {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="divider"></li>
            </ul>
          </div>
          <hr />
          <ul className="row list-unstyled">
            {stats.map((stat, index) => (
              <li className="col-4" key={index}>
                <small>{stat.label}</small>
                <h6>{stat.value}</h6>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebarprofile;
