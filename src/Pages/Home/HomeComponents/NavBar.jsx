import React, { useEffect, useState } from "react";
import "./Headerstyle.css";
import artLogo from "./artlogo.png";
import inactive from "./inactive.png";
import artwork from "./artwork.jpg";
import { BsHammer } from "react-icons/bs";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Usertype, setUserType] = useState(null);
  const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('profilePhoto'); // Clear profile photo
        window.dispatchEvent(new Event('profilePhotoUpdated')); // Notify other components
        window.location.href = '/';
      };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const storedUserType = localStorage.getItem("userType");

    setUserType(storedUserType);
    // Search Box Expand/Collapse
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
      if (!box?.contains(e.target)) collapseSearchBox();
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") collapseSearchBox();
    };

    box?.addEventListener("click", activateSearch);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Mode toggle
    const modeToggle = document.getElementById("modeToggle");
    const toggleMode = () => modeToggle?.classList.toggle("active");
    modeToggle?.addEventListener("click", toggleMode);

    // User Dropdown
    const userIcon = document.getElementById("userDropdown");
    const userMenu = document.getElementById("userDropdownMenu");

    const toggleUserMenu = (e) => {
      e.preventDefault();
      if (userMenu)
        userMenu.style.display =
          userMenu.style.display === "block" ? "none" : "block";
    };

    const closeUserMenu = (e) => {
      if (
        userIcon &&
        userMenu &&
        !userIcon.contains(e.target) &&
        !userMenu.contains(e.target)
      ) {
        userMenu.style.display = "none";
      }
    };

    userIcon?.addEventListener("click", toggleUserMenu);
    document.addEventListener("click", closeUserMenu);

    // Mobile Sidebar
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
      modeToggle?.removeEventListener("click", toggleMode);
      userIcon?.removeEventListener("click", toggleUserMenu);
      document.removeEventListener("click", closeUserMenu);
      toggleBtn?.removeEventListener("click", openSidebar);
      closeBtn?.removeEventListener("click", closeSidebar);
      overlay?.removeEventListener("click", closeSidebar);
    };
  }, []);

  return (
    <div className="w-full">
      {/* External links (Fonts, Bootstrap, Icons) */}
      
      
      <header className="header-h">
        <div className="">
          <div className="flex items-center">
            {/* Left Section - 40% width */}
            <div className="col-md-5 col-6 d-flex justify-content-end">
              <div className="d-flex items-center">
                <a className="nav-link-h me-3" href="/bid">
                  BID
                </a>
                <a className="nav-link-h d-none d-md-inline-block me-3" href="/store">
                  STORES
                </a>
                {/* <a class="nav-link d-md-none" href="#"><i class="fas fa-store"></i></a> */}
                <a
                  className="nav-link-h icon-link-h d-none d-md-inline-block me-3"
                  href="/"
                >
                  <i className="fas fa-store" />
                </a>
              </div>
            </div>
            {/* Logo Center - 20% width */}
             {isLoggedIn===false && (
              <div className="col-md-2 col-12 text-center order-md-1 order-0">
              <div className="logo-container-h">
                <a className="logo-h" href="/">
                  Artsays
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
                        <button className="sidebar-btn-m">Medium-Based</button>
                        <button className="sidebar-btn-m">
                          Style/Genre-Based
                        </button>
                        <button className="sidebar-btn-m">Subject-Based</button>
                        <button className="sidebar-btn-m">Surface-Based</button>
                        <button className="sidebar-btn-m">
                          Cultural/Traditional Forms
                        </button>
                        <button className="sidebar-btn-m">Medium-Based</button>
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
                      {/* Table inside scrollable wrapper */}
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
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Impressionism
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">Realism</span>
                              </td>
                              <td>
                                <span className="hover-underline">Pop Art</span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Expressionism
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">Pop Art</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Impressionism
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Minimalism
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Surrealism
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">Pop Art</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Street Art / Graffiti
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Expressionism
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Abstract
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">Pop Art</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="hover-underline">
                                  Fantasy Art
                                </span>
                              </td>
                              <td>
                                <span className="hover-underline">Realism</span>
                              </td>
                              <td>
                                <span className="hover-underline">Pop Art</span>
                              </td>
                              <td>
                                <span className="hover-underline">
                                  Street Art
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Sticky Sales Support */}
                      <div className="sales-support">
                        <div id="supportText">Sales Support</div>
                        <a
                          href="/"
                          style={{ textDecoration: "none", color: "white" }}
                        >
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
            {/* Logo Center - 20% width */}
            {isLoggedIn===true && (
               <div className="col-md-2 col-12 d-flex justify-content-center text-center order-md-1 order-0">
               <Link to={"/social-media"}>
                                <div id="modeToggle" className="mode-toggle-h">
                  <div className="toggle-icon-h left-h">
                    <span>A</span>
                  </div>
                  <div className="toggle-icon-h right-h">
                    {/* Inactive icon */}
                    <img
                      src={inactive}
                      alt="socialLogo"
                      className="icon-inactive-h"
                      style={{ height: 40 }}
                    />
                    <img
                      src={artLogo}
                      alt="socialLogoActive"
                      className="icon-active-h"
                      style={{ height: 40 }}
                    />
                  </div>
                  <div className="toggle-slider-h" />
                </div>
               </Link>
              </div>
            )}
        
            {/* Right Section - 40% width */}

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
                  <i className=" ri-search-line text-2xl font-bold search-icon-h " />
                </div>
                {isLoggedIn === false && (
                  <a className="nav-link-h btn-started-h ms-2" href="/login">
                  GET STARTED
                </a>
                )}
                {isLoggedIn && (
                  <div className="flex items-center">
                  <a className="nav-link-h icon-link-h me-3" href="/">
                    <i className="fas fa-shopping-cart" />
                  </a>
                  <div className="dropdown position-relative">
                    <div
                      className="nav-link-h btn-started-h ms-2 user-icon"
                      
                      id="userDropdown"
                      style={{
                        padding: "12px 20px !important",
                        borderRadius: "50%",
                      }}
                       onClick={()=>{
                        console.log("clicked");
                      }}
                    >
                      <i className="fas fa-user" />
                    </div>
                    { Usertype ==="Buyer" && (
                      <div
                      className="dropdown-menu-h user-dropdown-h shadow"
                      id="userDropdownMenu"
                     
                      
                    >
                      <div className="dropdown-arrow-h" />
                      <a className="dropdown-item-h" href="/">
                        <i className="fas fa-user me-2" /> Your Account
                      </a>
                      <a className="dropdown-item-h" href="/">
                        <i className="fas fa-box me-2" /> Orders
                      </a>
                      <a className="dropdown-item-h" href="/">
                        <i className="fas fa-wallet me-2" /> Wallet
                      </a>
                      <a className="dropdown-item-h" href="/">
                        <i className="fas fa-bell me-2" /> Notification
                      </a>
                      <a className="dropdown-item-h" href="/">
                        <i className="fas fa-heart me-2" /> Wishlist
                      </a>
                      <div className="dropdown-item-h"  onClick={handleSignOut}>
                        <i className="fas fa-sign-out-alt me-2" /> Logout
                      </div>

                      
                    </div>
                    )}
                    {Usertype !=="Buyer" && (
                      <div
                      className="dropdown-menu-h user-dropdown-h shadow"
                      id="userDropdownMenu"
                    >
                      <div className="dropdown-arrow-h" />
                      <a className="dropdown-item-h" href="/">
                        <i className="fa-solid fa-gauge" /> My Dashboard
                      </a>
                      <a className="dropdown-item-h" href="/">
                        <i className="fas fa-bell me-2" /> Notifications
                      </a>
                      <div className="dropdown-item-h" 
                      onClick={handleSignOut}>
                        <i className="fas fa-sign-out-alt me-2" /> Logout
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
     
      {/* Top Navbar */}
      <nav className=" navbar-h navbar-light-h w-full shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
        {/* Logo */}
        <a href="/" className="navbar-brand-h mb-0 h1">
          Artsays
        </a>
        <a className="nav-link-h btn-started-h ms-2" href="/login">
          GET STARTED
        </a>
      </nav>

      <nav className=" navbar-h navbar-light-h w-full shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
        {/* Logo */}
        <div id="modeToggle" className="mode-toggle-h">
          <div className="toggle-icon-h left-h">
            <span>A</span>
          </div>
          <div className="toggle-icon-h right-h">
            {/* Inactive icon */}
            <img
              src={inactive}
              alt="socialLogo"
              className="icon-inactive-h"
              style={{ height: 30 }}
            />
            {/* Active icon */}
            <img
              src={artLogo}
              alt="socialLogoActive"
              className="icon-active-h"
              style={{ height: 30 }}
            />
          </div>
          <div className="toggle-slider-h" />
        </div>
        {/* Notification Icon */}
        <div>
          {/* Notification Icon */}
          <button className="btn-h d-md-none border-0 fs-2">
            <i className="bi bi-bell" />
          </button>
          {/* Mobile Hamburger */}
          <button className="btn-h d-md-none border-0 fs-2" id="mobileToggle">
            <i className="bi bi-list" />
          </button>
        </div>
      </nav>
   
      {/* Slide-in Sidebar */}
      
      
         <div className="profile-menu-h" id="mobileSidebar">
          <div className="profile-header-h">
            <button className="close-btn-h" id="closeSidebar">
              ×
            </button>
            <img src={artLogo} alt="Profile" className="profile-pic-h" />
            <div className="profile-name-h">July Singh</div>
            <div className="profile-category-h">Artist</div>
          </div>
          <div className="profile-content-h">
            <div className="profile-item-h active">
              <i className="bi bi-person-fill" />
              <span>My Account</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-collection" />
              <span>Collections</span>
            </div>
            <div className="profile-item-h">
              <i className="bi " ><BsHammer /></i>
              <span>Bid</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-shop-window" />
              <span>Store</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-cart3" />
              <span>Cart</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-wallet2" />
              <span>Wallet</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-bell" />
              <span>Notification Preferences</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-heart" />
              <span>Wishlist</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-box-seam" />
              <span>Orders</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-geo-alt" />
              <span>Manage Address</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-credit-card" />
              <span>Payment Methods</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-key" />
              <span>Password Manager</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-shield-check" />
              <span>Account Verification</span>
            </div>
            <div className="profile-item-h">
              <img
                src={artLogo}
                alt=""
                style={{ height: 20, marginRight: 12 }}
              />
              <span>Social Media Promotion</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-sliders" />
              <span>Custom Request</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-lock-fill" />
              <span>Security and Agreements</span>
            </div>
            <div className="profile-item-h">
              <i className="bi bi-box-arrow-left" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      

        <div className="profile-menu-h" id="mobileSidebar">
          <div className="profile-header-h">
            <button className="close-btn-h" id="closeSidebar">
              ×
            </button>
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="profile-pic-h"
            />
            <div className="profile-name-h">July Singh</div>
            <div className="profile-category-h">Artist</div>
          </div>
          <div className="profile-content-h">
            <div className="profile-item-h active">
              <i className="bi bi-speedometer" />
              <span>My Dashboard</span>
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
            <div className="profile-item-h">
              <i className="bi bi-box-arrow-left" />
              <span>Logout</span>
            </div>
          </div>
        </div>
     
      {/* Sidebar  overlay */}

      <div className="overlay-h" id="overlay1" />
    </div>
  );
};

export default NavBar;
