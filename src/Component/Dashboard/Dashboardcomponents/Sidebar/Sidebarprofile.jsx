import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ user, isOpen, handleToggleSidebar, HandletoggleDropdown }) => {
  const dropdownRef = useRef(null);

  const sidebarItems = [
    {
      label: "My Profile",
      icon: "fa-user",
      path: "/completeprofile",
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
      path: "/page-login.html",
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
      <button type="button" className="btn-toggle-offcanvas" onClick={handleToggleSidebar}>
        <i className="fa fa-arrow-left"></i>
      </button>
      <div className="sidebar-scroll">
        <div className="user-account">
          {user && user.profilePhoto && (
            <img
              src={`http://localhost:3001${user.profilePhoto}`}
              className="rounded-circle user-photo"
              alt="User Profile Picture"
            />
          )}
          <div className="dropdown" ref={dropdownRef}>
            <span>Welcome,</span>
            {user ? (
              <a
                href="javascript:void(0);"
                className="dropdown-toggle user-name"
                data-toggle="dropdown"
                onClick={HandletoggleDropdown}
                aria-expanded={isOpen ? "true" : "false"}
              >
                <strong>{`${user.name} ${user.lastName}`}</strong>
              </a>
            ) : (
              <strong>Guest</strong>
            )}
            <ul
              className={`dropdown-menu dropdown-menu-right account ${isOpen ? "show" : ""}`}
              style={{
                position: "absolute",
                top: isOpen ? "100%" : "80%",
                left: "0",
                transform: isOpen ? "translate3d(-54px, 42px, 0px)" : "none",
                willChange: "transform",
              }}
              x-placement="bottom-end"
            >
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>
                    <i className={`fa ${item.icon}`}></i> {item.label}
                  </Link>
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

export default Sidebar;
