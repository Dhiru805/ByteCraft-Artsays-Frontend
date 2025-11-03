import React, { useEffect, useState } from "react";
import "./Headerstyle.css";
import artLogo from "./artlogo.png";
import inactive from "./inactive.png";
import AIcon from "./AIcon.png";
import artwork from "./artwork.jpg";
import { NavUserState, NavGuestState } from "./NavLoginState";
import MegaMenu from "./MegaMenu";

import { AnimatePresence, motion } from "framer-motion";
import { BsHammer } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { use } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { Bell, FileX, Menu, User } from "lucide-react"; 
import { RiMoneyRupeeCircleLine, RiAuctionFill, RiMapPin2Line, RiLockPasswordLine  } from "react-icons/ri";
import { PiHandbagBold } from "react-icons/pi";
import { HiOutlineHeart } from "react-icons/hi";
import { BiCart, BiLogOut } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { FaUser, FaChevronLeft, FaTools } from "react-icons/fa";
import { MdOutlineSecurity, MdVerified, MdLibraryAdd } from "react-icons/md";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";

const NavBar = () => {
  const [showMegamenu, setShowMegamenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Usertype, setUserType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  
  const navigate = useNavigate();
  const location = useLocation();

  const isOnSocialMedia = location.pathname === "/social-media";

  const handleDashboardClick = (Usertype) => {
    if (Usertype === 'Artist') {
        navigate("/artist/dashboard");
    } else if (Usertype === 'Super-Admin') {
        navigate("/Super-Admin/dashboard");
    } else if(Usertype === 'Seller') {
      navigate("/seller/dashboard");
    }
  }

  const handleUserIconClick = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePhoto');
    window.dispatchEvent(new Event('profilePhotoUpdated'));
    window.location.href = '/';
  };

  useEffect(() => {
  if (location.pathname.startsWith("/social-media")) {
    setIsToggled(true);
  } else {
    setIsToggled(false);
  }
  }, [location.pathname]);
 
const handleToggle = () => {
  if (isToggled) {
    navigate("/");
  } else {
    navigate("/social-media");
  }
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);

    const box = document.getElementById("searchBox");
    const input = document.getElementById("searchInput");

    const activateSearch = () => {
      box?.classList.add("active");
      input?.setAttribute("placeholder", "Paintings, Crafts...");
      input?.focus();
    };

    const collapseSearchBox = () => {
      box?.classList.remove("active");
      if (input) {
        input.value = "";
        input.setAttribute("placeholder", "");
        input.blur();
      }
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") collapseSearchBox();
    };

    box?.addEventListener("click", activateSearch);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    const toggleBtn = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("mobileSidebar");
    const closeBtn = document.getElementById("closeSidebar");
    const overlay = document.getElementById("overlay1");

    const openSidebar = () => {
      sidebar?.classList.add("active");
      overlay?.classList.add("active");
    };

    const closeSidebar = () => {
      sidebar?.classList.remove("active");
      overlay?.classList.remove("active");
    };

    toggleBtn?.addEventListener("click", openSidebar);
    closeBtn?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    return () => {
      box?.removeEventListener("click", activateSearch);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      toggleBtn?.removeEventListener("click", openSidebar);
      closeBtn?.removeEventListener("click", closeSidebar);
      overlay?.removeEventListener("click", closeSidebar);
    };
  }, [isToggled]);

  return (
    <div className="w-full">
      <header className="header-h">
        <div className="">
          <div className="flex items-center">
            {/* Left Section */}
            <div className="col-md-5 col-6 d-flex justify-content-end">
              <div className="d-flex items-center">
                <a className="nav-link-h me-3" href="/bid">
                  BID
                </a>
                <a className="nav-link-h d-none d-md-inline-block me-3" href="/store">
                  STORES
                </a>
                <a
                  className="nav-link-h icon-link-h d-none d-md-inline-block me-3"
                  href="/"
                >
                  <i className="fas fa-store" />
                </a>
              </div>
            </div>
            {/* Logo Center */}
            {isLoggedIn === false && (
              <div className="col-md-2 col-12 text-center order-md-1 order-0">
                <div className="logo-container-h">
                  <a className="logo-h" href="/">
                    <img src="/assets/home/logo.svg"/>
                  </a>
                  <div className="mega-menu">
                    {/* Top Header Bar */}
                    <div className="header-wrapper-m">
                      <div className="corner left-corner" />
                      <div className="scroll-container">
                        <div className="header-bar-m">
                          <div className="art-type active">Sculpture</div>
                          <div className="art-type">Digital Art</div>
                          <div className="art-type">Handmade Crafts</div>
                          <div className="art-type">Painting</div>
                          <div className="art-type">Pop Art</div>
                          <div className="art-type">Abstract</div>
                          <div className="art-type">Folk Art</div>
                          <div className="art-type">Miniature Art</div>
                          <div className="art-type">Modern Art</div>
                          <div className="art-type">Traditional Art</div>
                          <div className="art-type">Antique Crafts</div>
                          <div className="art-type">Metal Sculpture</div>
                          <div className="art-type">Wood Carving</div>
                        </div>
                      </div>
                      <div className="corner right-corner" />
                    </div>
                    {/* Main Content */}
                    <div className="container-custom-m">
                      {/* Sidebar */}
                      <div className="sidebar-wrapper-m">
                        <div className="sidebar-m">
                          <button className="sidebar-btn-m active">
                            Medium-Based
                          </button>
                          <button className="sidebar-btn-m">
                            Style/Genre-Based
                          </button>
                          <button className="sidebar-btn-m">Subject-Based</button>
                          <button className="sidebar-btn-m">Surface-Based</button>
                          <button className="sidebar-btn-m">
                            Cultural/Traditional Forms
                          </button>
                        </div>
                      </div>
                      {/* Table Section */}
                      <div className="table-section">
                        <div className="table-wrapper table-responsive">
                          <table className="mb-0">
                            <tbody>
                              <tr>
                                <td>
                                  <span className="hover-underline">
                                    Abstract
                                  </span>
                                </td>
                                <td>
                                  <span className="hover-underline">Pop Art</span>
                                </td>
                                <td>
                                  <span className="hover-underline">
                                    Surrealism
                                  </span>
                                </td>
                                <td>
                                  <span className="hover-underline">
                                    Minimalism
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="sales-support">
                          <div id="supportText">Sales Support</div>
                          <a href="/" style={{ textDecoration: "none", color: "white" }}>
                            <span id="slider" className="align-content-center">
                              Sales Support
                            </span>
                          </a>
                        </div>
                      </div>
                      {/* Featured Artwork Card */}
                      <div className="art-card position-relative overflow-hidden rounded-4 align-content-center">
                        <img
                          src={artwork}
                          alt=""
                          className="w-100 img-fluid card-image"
                        />
                        <div
                          className="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3"
                          style={{ textAlign: "left" }}
                        >
                          <div className="border-bottom border-white">
                            <h5 className="text-white mb-1">
                              Medieval Sculpture
                            </h5>
                            <p className="text-white-50 mb-1 small">
                              Own the Exclusive art
                            </p>
                            <p className="text-white-50 small">
                              Lorem ipsum dolor sit lala color amet, consectetur
                            </p>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="text-white fw-bold fs-6">
                              ₹ 500.00
                            </span>
                            <div className="d-flex gap-2">
                              <button className="btn-h btn-light btn-sm fs-6">
                                Buy Now
                              </button>
                              <button className="btn-h btn-outline-light btn-sm rounded-circle fs-6">
                                <i className="bi bi-send" />
                              </button>
                              <button className="btn-h btn-outline-light btn-sm rounded-circle fs-6">
                                <i className="bi bi-bookmark" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isLoggedIn === true && (
              <div className="col-md-2 col-12 d-flex justify-content-center text-center order-md-1 order-0">
                <a className="logo-h" href="/">
                  <img src="/assets/home/logo.svg"/>
                </a>
              </div>
            )}
            {/* Right Section */}
            <div className="col-md-5 col-6 order-md-2 order-1 d-flex justify-content-start">
              <div className="d-flex align-items-center justify-content-end">
                <div className="search-box-h me-3" id="searchBox">
                  <input
                    type="text"
                    id="searchInput"
                    className="search-input-h"
                    placeholder="Paintings, Crafts..."
                    aria-label="Search"
                  />
                  <i className="ri-search-line text-2xl font-bold search-icon-h" />
                </div>
                {Usertype === "Buyer" ? 
                <a className="nav-link-h icon-link-h me-3" onClick={() => navigate("/my-account/my-cart")}>
                  <i className="fas fa-shopping-cart" />
                </a> : (Usertype === "Artist" || Usertype === "Super-Admin") ?
                <a className="nav-link-h me-3" href="/blog">
                  BLOG
                </a> : (!isLoggedIn) ? <a className="nav-link-h icon-link-h me-3" href="/">
                  <i className="fas fa-shopping-cart" />
                </a> : null}
                {isLoggedIn === false && (
                  <a className="nav-link-h btn-started-h ms-2" href="/login">
                    GET STARTED
                  </a>
                )}
                {isLoggedIn && (
                  <div className="flex items-center">
                    <div className="dropdown position-relative">
                      <div
                        className="ms-4 user-icon"
                        style={{
                          borderRadius: "50%",
                          cursor: "pointer",
                          border: "2px solid #3e2e22",
                        }}
                        onClick={handleUserIconClick}
                      >
                        {console.log("user saved data", { 
                          token: localStorage.getItem('token'),
                          usertype: localStorage.getItem('usertype'),
                          profilePhoto: localStorage.getItem('profilePhoto')
                          }
                      )}
                        {console.log("BASE_URL:", BASE_URL)}
                        <img
                          src={
                            localStorage.getItem('profilePhoto')
                                ? `${BASE_URL}${localStorage.getItem('profilePhoto')}`
                                : DEFAULT_PROFILE_IMAGE
                            }
                              className="rounded-circle avatar"
                              alt="User Profile"
                              style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              }}
                            />
                      </div>
                      {showDropdown && Usertype === "Buyer" && (
                        <div
                          className="dropdown-menu-h user-dropdown-h shadow"
                          style={{
                            display: "block",
                            position: "absolute",
                            background: "#fff",
                            minWidth: "220px",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                            zIndex: 1,
                          }}
                        >
                          <div className="dropdown-arrow-h" />
                          <a className="dropdown-item-h" onClick={() => navigate("/my-account")}>
                            <i className="fas fa-user me-2" /> Your Account
                          </a>
                         {!isOnSocialMedia  ?
                          <a className="dropdown-item-h" onClick={() => navigate("/social-media")}>
                            <img 
                              alt="community-logo" 
                              src={artLogo} 
                              style={{width: '18px', height: '18px', marginRight: '2px'}}/>Switch to Community
                          </a> :
                          <a className="dropdown-item-h" onClick={() => navigate("/")}>
                        
                            <img src={AIcon} alt="Artsays-Icon" style={{width: '16px', height: '16px', marginRight: '9px'}}/>Switch to Artsays
                          </a>
                         }
                          <a className="dropdown-item-h" onClick={() => navigate("/my-account/my-orders")}>
                            <i className="fas fa-box me-2" /> Orders
                          </a>
                          <a className="dropdown-item-h" onClick={() => navigate("/my-account/buyer-wallet")}>
                            <i className="fas fa-wallet me-2" /> Wallet
                          </a>
                          <a className="dropdown-item-h" href="/">
                            <i className="fas fa-bell me-2" /> Notification
                          </a>
                          <a className="dropdown-item-h" onClick={() => navigate("/my-account/wishlist")}>
                            <i className="fas fa-heart me-2" /> Wishlist
                          </a>
                          <div className="dropdown-item-h" onClick={handleSignOut}>
                            <i className="fas fa-sign-out-alt me-2" /> Logout
                          </div>
                        </div>
                      )}
                      {showDropdown && Usertype !== "Buyer" && (
                        <div
                          className="dropdown-menu-h user-dropdown-h shadow"
                          style={{
                            display: "block",
                            position: "absolute",
                            background: "#fff",
                            minWidth: "190px",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                            zIndex: 1,
                          }}
                        >
                          <div className="dropdown-arrow-h" />
                          <div className="dropdown-item-group-h"> 
                              <a className="dropdown-item-h" onClick={() => {
                              handleDashboardClick(Usertype);
                            }}>
                              <i className="fas fa-tachometer-alt me-1" />
                              My Dashboard
                            </a>
                            {!isOnSocialMedia  ?
                          <a className="dropdown-item-h" onClick={() => navigate("/social-media")}>
                            <img 
                              alt="community-logo" 
                              src={artLogo} 
                              style={{width: '20px', height: '20px', marginRight: '2px'}}/>Switch to Community
                          </a> :
                          <a className="dropdown-item-h" onClick={() => navigate("/")}>
                            <img src={AIcon} alt="Artsays-Icon" style={{width: '16px', height: '16px', marginRight: '7px'}}/>Switch to Artsays
                          </a>
                         }
                            <a className="dropdown-item-h" href="/">
                              <i className="fas fa-bell me-2" /> Notifications
                            </a>
                            <div className="dropdown-item-h" onClick={handleSignOut}>
                              <i className="fas fa-sign-out-alt me-2" /> Logout
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {
        !isLoggedIn && (
          <nav className="navbar-h navbar-light-h w-full shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
            <a href="/" className="navbar-brand-h mb-0 h1">
              <img src="/assets/home/logo.svg" style={{height: '40px', objectFit: 'contain'}}/>
            </a>
            <a className="nav-link-h btn-started-h" 
            href="/login">
              GET STARTED 
            </a>
          </nav>
        )
      }
      {
        isLoggedIn && (
          <>
          <nav className="navbar-h navbar-light-h w-full shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
             <div>
                <a href="/" className="navbar-brand-h mb-0 h1">
                  <img src="/assets/home/logo.svg" style={{height: '40px', objectFit: 'contain'}}/>
                </a>
            </div>
            <div className="flex items-center space-x-4 cursor-pointer">
            <Bell className="w-5 h-5 text-gray-700" />
            <div>
              <Menu className="w-5 h-5 text-gray-700" id="mobileToggle" onClick={() => setShowProfileMenu(!showProfileMenu)}/>
              {
                showProfileMenu && (
                  <>
                    <a className="dropdown-item-h" onClick={() => navigate("/social-media")}>
                      <img 
                        alt="community-logo" 
                        src={artLogo} 
                        tyle={{width: '20px', height: '20px', marginRight: '2px'}}/>Switch to Community
                    </a>
                    </>
                )
              }
            </div>
          </div>
          </nav>
                <div className="profile-menu-h" id="mobileSidebar">
                <div className="profile-header-h">
                <button className="close-btn-h" id="closeSidebar">
                  &times;
                </button>
                <img
                  src={
                      localStorage.getItem('profilePhoto')
                      ? `${BASE_URL}${localStorage.getItem('profilePhoto')}`
                      : DEFAULT_PROFILE_IMAGE
                    }
                    className="rounded-circle avatar"
                    alt="User Profile"
                    style={{
                    width: '131px',
                    height: '131px',
                    top: '65.89',
                    left: '74.5',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block',
                    margin: '0 auto',
                    }}
                />
                <div className="profile-name-container">
                  <span className="profile-name-h">July Singh</span>
                  <MdVerified className="verified-icon" />
                </div> 
              </div>
             { (Usertype === "Seller" || Usertype === "Artist" || Usertype === "Super-Admin") ?
              <div className="profile-content-h">
                <div className="profile-item-h">
                  <i class="bi bi-person-fill"/>
                  <span>My Dashboard</span>
                </div>
                <div className="profile-item-h">
                  <a className="dropdown-item-h" onClick={() => navigate("/")}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                    <img 
                      src={AIcon} 
                      className="icon-sidebar"
                      alt="Artsays-Icon" 
                      style={{ width: "16px", height: "16px", marginRight: '17px', marginLeft: '4px' }} 
                    />
                    Switch to Artsays
                  </span>
                  </a>
                </div>
                <div className="profile-item-h">
                  <i className="bi bi-patch-check-fill" />
                  <span>Account Verification</span>
                </div>
                <div className="profile-item-h">
                  <i className="bi bi-lock-fill" />
                  <span>Security and Agreements</span>
                </div>
                <div className="profile-item-h">
                  <i className="bi bi-question-circle" />
                  <span>Help</span>
                </div>
                <div className="profile-item-h">
                  <i className="bi bi-shield-shaded" />
                  <span>Privacy Center</span>
                </div>
                <div className="profile-item-h" onClick={handleSignOut}>
                  <i className="bi bi-box-arrow-left" />
                  <span>Logout</span>
                </div>
              </div> :
              <div className="profile-content-h">
                <div className="profile-item-h">
                  <FaUser style={{ marginRight: "15px", marginLeft: '6px' }}/>
                  <span>My Account</span>
                </div>
                <div className="profile-item-h">
                  <a className="dropdown-item-h" onClick={() => navigate("/")}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                    <img 
                      src={AIcon} 
                      className="icon-sidebar"
                      alt="Artsays-Icon" 
                      style={{ width: "16px", height: "16px", marginRight: '15px', marginLeft: '4px' }} 
                    />
                    Switch to Artsays
                  </span>
                  </a>
                </div>
                <div className="profile-item-h">
                  <MdLibraryAdd className="icon-sidebar"/>
                  <span>Collections</span>
                </div>
                <div className="profile-item-h">
                  <RiAuctionFill className="icon-sidebar"/>
                  <span>Bid</span>
                </div>
                <div className="profile-item-h">
                  <PiHandbagBold className="icon-sidebar"/>
                  <span>Store</span>
                </div>
                <div className="profile-item-h">
                  <BiCart className="icon-sidebar"/>
                  <span>Cart</span>
                </div>
                <div className="profile-item-h">
                  <IoWalletOutline className="icon-sidebar"/>
                  <span>Wallet</span>
                </div>
                <div className="profile-item-h">
                  <IoMdNotificationsOutline className="icon-sidebar"/>
                  <span>Notification and Preferences</span>
                </div>
                <div className="profile-item-h">
                  <HiOutlineHeart className="icon-sidebar"/>
                  <span>Wishlist</span>
                </div>
                <div className="profile-item-h">
                  <BsBoxSeam className="icon-sidebar"/>
                  <span>Orders</span>
                </div>
                <div className="profile-item-h">
                  <RiMapPin2Line className="icon-sidebar"/>
                  <span>Manage Address</span>
                </div>
                <div className="profile-item-h">
                  <RiMoneyRupeeCircleLine className="icon-sidebar"/>
                  <span>Payment Methods</span>
                </div>
                <div className="profile-item-h">
                  <MdOutlineSecurity className="icon-sidebar"/>
                  <span>Password Manager</span>
                </div>
                <div className="profile-item-h">
                  <MdVerified className="icon-sidebar"/>
                  <span>Account Verification</span>
                </div>
                <div className="profile-item-h">
                  <img src={artLogo} style={{ height: 24 }} className="icon-sidebar"/>
                  <span>Social Media Promotion</span>
                </div>
                <div className="profile-item-h">
                  <FaTools  className="icon-sidebar" size={20} style={{marginRight: '14px'}}/>
                  <span>Custom Request</span>
                </div>
                <div className="profile-item-h">
                  <RiLockPasswordLine className="icon-sidebar"/>
                  <span>Security and Agreements</span>
                </div>
                <div className="profile-item-h" onClick={handleSignOut}>
                  <BiLogOut  className="icon-sidebar"/>
                  <span>Logout</span>
                </div>
              </div>
            }
            </div>
          <div className="overlay-h" id="overlay1" />
        </>
        )
      }
    </div>
  );
};

export default NavBar;
