// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";
// import { NavUserState, NavGuestState } from "./NavLoginState";
// import MegaMenu from "./MegaMenu";

// const NavBar = () => {
//   const [showMegamenu, setShowMegamenu] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check login status from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   return (
//     <nav className="px-6 md:px-20 h-[100px] max-w-[1440px] mx-auto flex items-center text-primary-900">
//       {/* Left Section: BID / RESELL */}
//       <div className="flex flex-1 gap-4 font-bold leading-[28px]">
//         <Link to="/bid">BID</Link>
//         <Link to="/resell">RESELL</Link>
//       </div>

//       {/* Center Section */}
//       <div className="flex flex-[2] justify-center items-center gap-8 font-semibold">
//         <div className="flex gap-6">
//           <Link to="/about-us">ABOUT US</Link>
//           <Link to="/store" className="font-bold">STORE</Link>
//           <Link to="/collections">COLLECTIONS</Link>
//         </div>

//         {/* Logo + Mega Menu */}
//         <div
//           className="relative h-full cursor-pointer"
//           onMouseEnter={() => setShowMegamenu(true)}
//           onMouseLeave={() => setShowMegamenu(false)}
//           aria-haspopup="true"
//           aria-expanded={showMegamenu}
//         >
//           <img src="/assets/home/logo.svg" alt="Logo" className="h-10 w-auto" />

//           <AnimatePresence>
//             {showMegamenu && (
//               <motion.div
//                 className="absolute left-1/2 top-full transform -translate-x-1/2 z-50 w-[70vw]"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <MegaMenu />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         <div className="flex gap-4">
//           <Link to="/register">REGISTER</Link>
//           <Link to="/blog">BLOG</Link>
//           <Link to="/contact">CONTACT US</Link>
//         </div>
//       </div>

//       {/* Right Section: User */}
//       <div className="flex flex-1 justify-end">
//         {isLoggedIn ? <NavGuestState /> : <NavUserState />}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;


"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { NavUserState } from "./nav-user-state" 
import { NavGuestState } from "./NavLoginState" 
import MegaMenu from "./MegaMenu"
import { Menu, Search, ShoppingCart, Store, X } from 'lucide-react'

export default function NavBar() {
  const [showMegamenu, setShowMegamenu] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModeToggleActive, setIsModeToggleActive] = useState(false); 


  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: "Poppins", serif; /* Poppins is a common Google Font, Windhavi would need to be imported */
          background-color: #fff;
        }
      `}</style>

      {/* Desktop Header */}
      <header className="header hidden lg:block">
        <div className="container-fluid">
          <div className="row align-items-center flex justify-between items-center">
            {/* Left Section - 40% width */}
            <div className="col-md-5 col-6 d-flex justify-content-end flex-1 flex justify-end items-center">
              <Link className="nav-link me-3" to="/bid">
                BID
              </Link>
              <Link className="nav-link d-none d-md-inline-block me-3" to="/stores">
                STORES
              </Link>
              <Link className="nav-link icon-link d-none d-md-inline-block me-3" to="/stores">
                <Store className="h-5 w-5" />
              </Link>
            </div>
            {/* Logo/Mode Toggle Center - 20% width */}
            <div
              className="col-md-2 col-12 d-flex justify-content-center text-center order-md-1 order-0 flex-shrink-0"
              onMouseEnter={() => setShowMegamenu(true)}
              onMouseLeave={() => setShowMegamenu(false)}
              aria-haspopup="true"
              aria-expanded={showMegamenu}
            >
              {/* Mode Toggle */}
              <div id="modeToggle" className={`mode-toggle ${isModeToggleActive ? 'active' : ''}`} onClick={() => setIsModeToggleActive(!isModeToggleActive)}>
                <div className="toggle-icon left">
                  <span>A</span> 
                </div>
                <div className="toggle-icon right">
                  <img src="/assets/Navbar/2.png?height=40&width=40" alt="socialLogo" className="icon-inactive" style={{ height: '40px' }} />
                  <img src="/assets/Navbar/3.png?height=40&width=40" alt="socialLogoActive" className="icon-active" style={{ height: '40px' }} />
                </div>
                <div className="toggle-slider"></div>
              </div>
              <AnimatePresence>
                {showMegamenu && (
                  <motion.div
                    className="absolute left-1/2 top-full transform -translate-x-1/2 z-50 w-[70vw]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MegaMenu />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Right Section - 40% width */}
            <div className="col-md-5 col-6 order-md-2 order-1 flex-1 flex justify-start">
              <div className="flex items-center justify-end w-full">
                <div
                  className={`search-box me-3 ${isSearchActive ? "active" : ""}`}
                  id="searchBox"
                  onClick={() => setIsSearchActive(!isSearchActive)}
                >
                  <input
                    type="text"
                    id="searchInput"
                    className="search-input"
                    placeholder="Paintings, Crafts..."
                    aria-label="Search"
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => setIsSearchActive(false)}
                    onClick={(e) => e.stopPropagation()} // Prevent click from propagating to search-box
                  />
                  <Search className="search-icon" />
                </div>
                <Link className="nav-link icon-link me-3" to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                {/* Render NavGuestState if logged in, NavUserState if logged out */}
                {isLoggedIn ? <NavGuestState /> : <NavUserState />}
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .header {
            padding: 12px 40px;
            color: #48372d;
            background-color: #f8f8f8;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            position: relative; /* Needed for mega-menu positioning */
            z-index: 999; /* Ensure header is above overlay */
          }
          .container-fluid {
            width: 100%;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto;
          }
          .row {
            display: flex;
            flex-wrap: wrap;
            margin-right: -15px;
            margin-left: -15px;
          }
          .align-items-center {
            align-items: center;
          }
          .col-md-5 {
            flex: 0 0 auto;
            width: 41.66666667%;
          }
          .col-6 {
            flex: 0 0 auto;
            width: 50%;
          }
          .col-md-2 {
            flex: 0 0 auto;
            width: 16.66666667%;
          }
          .col-12 {
            flex: 0 0 auto;
            width: 100%;
          }
          .d-flex {
            display: flex;
          }
          .justify-content-end {
            justify-content: flex-end;
          }
          .justify-content-start {
            justify-content: flex-start;
          }
          .justify-content-center {
            justify-content: center;
          }
          .text-center {
            text-align: center;
          }
          .order-md-1 {
            order: 1;
          }
          .order-0 {
            order: 0;
          }
          .order-md-2 {
            order: 2;
          }
          .order-1 {
            order: 1;
          }
          .me-3 {
            margin-right: 1rem !important;
          }
          .ms-2 {
            margin-left: 0.5rem !important;
          }
          .d-none {
            display: none !important;
          }
          .d-md-inline-block {
            display: inline-block !important;
          }

          .logo {
            font-size: 50px;
            font-family: "Windhavi", serif; /* Fallback to generic serif */
            color: #48372d;
            font-weight: bold;
            position: relative;
            text-align: center;
            text-decoration: none;
            display: inline-block; /* To allow relative positioning for mega menu */
          }
          .logo .says {
            position: relative;
            display: inline-block;
            padding-left: 2px;
          }
          .logo .says::before {
            content: "";
            position: absolute;
            top: -10px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #48372d;
          }
          .nav-link {
            color: #48372d !important;
            font-weight: bold;
            font-size: 20px;
            padding: 8px 25px !important;
            text-decoration: none;
          }
          .btn-started {
            background-color: #48372d;
            color: white !important;
            border-radius: 20px;
            padding: 8px 25px !important;
            font-size: 18px;
            font-weight: bold;
          }
          .btn-started:hover {
            background-color: transparent;
            border: 2px solid #48372d;
            color: #48372d !important;
            transition: all 0.3s ease;
          }
          .icon-link {
            font-size: 18px;
            padding: 8px 25px !important;
          }

          /* --- SEARCH --- */
          .search-box {
            position: relative;
            height: 38px;
            width: 40px; /* collapsed */
            border-radius: 20px;
            background: #fff;
            overflow: hidden;
            transition: width 0.35s ease;
            cursor: text;
          }
          .search-input {
            width: 0;
            opacity: 0;
            border: 1px solid #48372d;
            border-radius: 20px;
            outline: 0;
            background: transparent;
            height: 100%;
            padding: 0;
            font-size: 14px;
            transition: width 0.35s ease, opacity 0.2s ease, padding 0.35s ease;
          }
          .search-icon {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            color: #48372d;
            pointer-events: none; /* icon moves with the box, click handled on wrapper */
            font-size: 16px;
          }
          .search-box.active {
            width: 260px; /* expanded */
          }
          .search-box.active .search-input {
            width: 100%;
            opacity: 1;
            padding: 6px 34px 6px 12px; /* leave space for icon on right */
          }

          /* General nav-link hover & active effect (excluding logo) */
          .nav-link:not(.logo):hover,
          .nav-link:not(.logo):focus,
          .nav-link:not(.logo).active {
            border: 1px solid #48372d;
            border-radius: 30px;
            background-color: #ffffff;
            color: #2a1e17 !important;
            transition: all 0.3s ease;
          }

          /* Mode Toggle Styles */
          .mode-toggle {
            position: relative;
            width: 160px;
            height: 60px;
            background-color: #48372d;
            border-radius: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            cursor: pointer;
            user-select: none;
          }
          .toggle-icon {
            width: 80px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 35px;
            font-weight: bold;
            z-index: 2;
            font-family: "Windhavi", serif;
            transition: color 0.3s ease;
          }
          .toggle-slider {
            position: absolute;
            top: 1px;
            left: 1px;
            width: 78px;
            height: 58px;
            background-color: white;
            border-radius: 100px;
            transition: left 0.3s ease;
            z-index: 1;
          }
          .mode-toggle.active .toggle-slider {
            left: 81px;
          }
          /* ACTIVE STATE: toggle is switched to right */
          .mode-toggle.active .left {
            color: #ffffff;
          }
          .mode-toggle.active .right {
            color: #48372d;
          }
          /* INACTIVE STATE: toggle is on the left */
          .mode-toggle:not(.active) .left {
            color: #48372d;
          }
          .mode-toggle:not(.active) .right {
            color: #ffffff;
          }
          /* Hide active icon by default */
          .icon-active {
            display: none;
          }
          /* When toggle is active, hide inactive and show active */
          .mode-toggle.active .icon-inactive {
            display: none;
          }
          .mode-toggle.active .icon-active {
            display: inline-block;
          }

          /* Media Queries for Desktop Header */
          @media (max-width: 992px) {
            .header {
              display: none; /* Hide desktop header on mobile */
            }
          }
        `}</style>
      </header>

      {/* Mobile Navbar */}
      <nav className="navbar lg:hidden px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6 text-[#48372d]" />
        </button>

        <Link className="logo" to="/">
          Artsays
        </Link>

        <div className="flex items-center gap-2">
          <div
            className={`search-box ${isSearchActive ? "active" : ""}`}
            id="searchBoxMobile"
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <input
              type="text"
              id="searchInputMobile"
              className="search-input"
              placeholder="Paintings, Crafts..."
              aria-label="Search"
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
              onClick={(e) => e.stopPropagation()}
            />
            <Search className="search-icon" />
          </div>
          <Link to="/cart" className="nav-link icon-link">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          {isLoggedIn ? <NavGuestState /> : <NavUserState />}
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                className="profile-menu"
                initial={{ right: "-100%" }}
                animate={{ right: "0%" }}
                exit={{ right: "-100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="profile-header">
                  <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                    <X className="h-8 w-8" />
                  </button>
                  <img
                    src="/placeholder.svg?height=150&width=150"
                    alt="Profile Picture"
                    width={150}
                    height={150}
                    className="profile-pic"
                  />
                  <div className="profile-name">Guest User</div>
                  <div className="profile-category">Browse Categories</div>
                </div>
                <div className="profile-content">
                  <Link to="/bid" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    BID
                  </Link>
                  <Link to="/resell" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    RESELL
                  </Link>
                  <Link to="/about-us" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    ABOUT US
                  </Link>
                  <Link to="/store" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    STORE
                  </Link>
                  <Link to="/collections" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    COLLECTIONS
                  </Link>
                  <Link to="/register" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    REGISTER
                  </Link>
                  <Link to="/blog" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    BLOG
                  </Link>
                  <Link to="/contact" className="profile-item" onClick={() => setIsMobileMenuOpen(false)}>
                    CONTACT US
                  </Link>
                  {/* NavUserState/NavGuestState will be rendered here based on login status */}
                  {isLoggedIn ? <NavGuestState /> : <NavUserState />}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <style jsx>{`
          .navbar {
            background-color: #ffeee1;
          }
          .navbar-brand {
            font-size: 30px;
            font-family: "Windhavi", serif;
            color: #48372d;
            font-weight: bold;
          }
          .logo {
            font-size: 32px; /* Adjusted for mobile */
            font-family: "Windhavi", serif;
            color: #48372d;
            font-weight: bold;
            text-decoration: none;
          }
          .nav-link {
            color: #48372d !important;
            font-weight: bold;
            font-size: 20px;
            padding: 8px 25px !important;
            text-decoration: none;
          }
          .icon-link {
            font-size: 18px;
            padding: 8px 25px !important;
          }
          .btn-started {
            background-color: #48372d;
            color: white !important;
            border-radius: 20px;
            padding: 4px 15px !important; /* Smaller padding for mobile */
            font-size: 16px; /* Smaller font size for mobile */
            font-weight: bold;
            text-decoration: none;
          }
          .btn-started:hover {
            background-color: transparent;
            border: 2px solid #48372d;
            color: #48372d !important;
            transition: all 0.3s ease;
          }

          /* --- SEARCH --- */
          .search-box {
            position: relative;
            height: 38px;
            width: 40px; /* collapsed */
            border-radius: 20px;
            background: #fff;
            overflow: hidden;
            transition: width 0.35s ease;
            cursor: text;
          }
          .search-input {
            width: 0;
            opacity: 0;
            border: 1px solid #48372d;
            border-radius: 20px;
            outline: 0;
            background: transparent;
            height: 100%;
            padding: 0;
            font-size: 14px;
            transition: width 0.35s ease, opacity 0.2s ease, padding 0.35s ease;
          }
          .search-icon {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            color: #48372d;
            pointer-events: none;
            font-size: 16px;
          }
          .search-box.active {
            width: 180px; /* expanded for mobile */
          }
          .search-box.active .search-input {
            width: 100%;
            opacity: 1;
            padding: 6px 34px 6px 12px;
          }

          /* General nav-link hover & active effect (excluding logo) */
          .nav-link:not(.logo):hover,
          .nav-link:not(.logo):focus,
          .nav-link:not(.logo).active {
            border: 1px solid #48372d;
            border-radius: 30px;
            background-color: #ffffff;
            color: #2a1e17 !important;
            transition: all 0.3s ease;
          }

          /* Mobile Menu Styles */
          .mobile-menu-trigger {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .profile-menu {
            position: fixed;
            top: 0;
            right: -100%; /* Start off-screen */
            width: 300px;
            height: 100%;
            background: #fff;
            z-index: 1050;
            transition: right 0.3s ease-in-out;
            box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }
          .profile-menu.active {
            right: 0;
          }
          .profile-header {
            padding: 20px;
            background-color: #4a372b;
            text-align: center;
            border-bottom: 1px solid #eee;
            position: sticky;
            top: 0;
            z-index: 1;
          }
          .close-btn {
            position: absolute;
            top: 15px;
            left: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            color: #ffffff;
            cursor: pointer;
          }
          .profile-pic {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-bottom: 10px;
            object-fit: cover;
          }
          .profile-name {
            font-weight: bold;
            font-size: 1.5rem;
            color: white;
          }
          .profile-category {
            font-size: 1rem;
            color: #ffffff;
            font-weight: bold;
          }
          .profile-content {
            padding: 15px 0;
            flex: 1;
            overflow-y: auto;
          }
          .profile-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            font-size: 16px;
            color: #333;
            margin: 10px;
            transition: background 0.2s;
            cursor: pointer;
            text-decoration: none;
            border-radius: 10px; /* Added for consistency with hover */
          }
          .profile-item i {
            font-size: 18px;
            margin-right: 12px;
          }
          .profile-item:hover,
          .profile-item.active {
            background-color: #4a372b;
            color: #ffffff;
            border-radius: 10px;
          }
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1040;
            display: block; /* Always block, opacity controlled by framer-motion */
          }

          /* Mobile Mode Toggle adjustments */
          @media (max-width: 992px) {
            .mode-toggle {
              width: 80px;
              height: 40px;
              padding: 0 10px;
            }
            .toggle-icon {
              width: 30px;
              height: 40px;
              font-size: 30px;
            }
            .btn-started {
              padding: 4px 15px !important;
              font-size: 16px;
            }
            .toggle-slider {
              width: 38px;
              height: 38px;
            }
            .mode-toggle.active .toggle-slider {
              left: 41px;
            }
          }

          /* Hide mobile navbar on desktop */
          @media (min-width: 992px) {
            .navbar {
              display: none !important;
            }
          }
        `}</style>
      </nav>
    </>
  )
}
