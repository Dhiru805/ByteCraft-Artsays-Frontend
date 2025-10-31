import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../LogoutConfirmation";
import useUserType from '../urlconfig';
import { useAuth } from '../../../AuthContext';
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const Sidebarprofile = ({ user, userId, isOpen, handleToggleSidebar, HandletoggleDropdown }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const userType = useUserType();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const { logout } = useAuth();
  const status = localStorage.getItem("status");

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
      label: "Badges",
      icon: "bi-gem",
      path: `/${userType ? userType.toLowerCase() : "user"}/premium-badges`,
      state: { _id: userId }
    },
     ...(userType && ["artist", "seller", "buyer"].includes(userType.toLowerCase()) ? [{
    label: "Wallet",
    icon: "bi-wallet",
    path: `/${userType.toLowerCase()}/wallet`,
    state: { _id: userId }
  }] : []),

  //   ...(userType?.toLowerCase() === "super-admin" ? [{
  //   label: "Wallet Management",
  //   icon: "bi-wallet-fill",
  //   path: `/${userType.toLowerCase()}/wallet-management`,
  //   state: { _id: userId }
  // }] : []),
   
    {
      label: "Logout",
      icon: "bi-power",
      action: () => handleLogout(navigate, logout),
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

  const renderVerificationBadge = () => {
    if (status?.toLowerCase() === "verified") {
      return (
        <div style={styles.verificationIconBlue} title="Verified">
          <FaCheckCircle color="white" size={10} />
        </div>
      );
    } else if (status?.toLowerCase() === "unverified") {
      return (
        <div style={styles.verificationIconRed} title="Unverified">
          <FaTimesCircle color="white" size={10} />
        </div>
      );
    }
    return null;
  };

  const styles = {

    verificationIconBlue: {
      position: "absolute",
      top: "36px",
      left: "42px",
      backgroundColor: "#58d0ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "15px",
      height: "15px",
      pointerEvents: "auto",
    },

    verificationIconRed: {
      position: "absolute",
      top: "36px",
      left: "42px",
      backgroundColor: "red",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "15px",
      height: "15px",
      pointerEvents: "auto",
    },
  };


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
          {/* {user && user.profilePhoto && ( */}
          <div style={{ position: "relative", display: "inline-block", width: "65px", height: "40px" }}>
            <img
              src={user.profilePhoto ? `${BASE_URL}${user.profilePhoto}` : DEFAULT_PROFILE_IMAGE}
              className="rounded-circle user-photo"
              alt="User Profile Picture"
              style={{
                width: '55px',
                height: '55px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {userType?.toLowerCase() !== "super-admin" && renderVerificationBadge()}
          </div>

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
              className={`dropdown-menu dropdown-menu-right account ${isOpen ? "show" : ""
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
                    <a
                      href="#!"
                      onClick={() => {
                        item.action();
                        HandletoggleDropdown();
                      }}
                    >
                      <i className={`fa ${item.icon}`}></i> {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      state={item.state}
                      onClick={() => {
                        HandletoggleDropdown();
                      }}
                    >
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
