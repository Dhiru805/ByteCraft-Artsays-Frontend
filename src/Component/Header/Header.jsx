import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../../Contexts/ProductProvider";
import LanguageComponent from "./sub/LanguageComponent";
import MegaMenu from "../Header/sub/Megamenu";
import { content } from "../../server/ContentData";

function Header() {
  const { cart, wishlist, currency, changeCurrency } =
    useContext(ProductContext);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const headerRef = useRef(null);
  const megaMenuRef = useRef(null);

  const totalItemsInCart = cart.length;
  const totalItemsInWishlist = wishlist.length;

  const handleCurrencyChange = (event) => {
    changeCurrency(event.target.dataset.value);
  };

  const handleMouseEnter = () => {
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMegaMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setActiveSubmenu(null);
    }
  };

  const toggleSubmenu = (key) => {
    setActiveSubmenu(activeSubmenu === key ? null : key);
  };

  const handleMegaMenuEnter = () => {
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    setIsMegaMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        id="header"
        className={`position-sticky  w-100 z-3 ${
          isMegaMenuOpen ? "header-active" : ""
        }`}
      >
        <div className="container-fluid px-lg-5 px-md-3 px-0 d-flex align-items-center justify-content-between bg-light">
          <div className="col-6 col-sm-3 col-lg-2 order-sm-2 order-md-0 dis-none">
            <ul className="nav nav-tabs langList pr-2 pl-2 border-bottom-0 flex-nowrap justify-content-start d-flex w-4 pageNav1">
              {/* <LanguageComponent /> */}
              <li className="nav-item dropdown">
                <Link className="d-block" to="/Bidding-page">
                  BID
                </Link>
              </li>
              <li className="nav-item">
                <Link className="d-block" to="/Trading-page">
                  TRADE
                </Link>
              </li>
              <li className="nav-item">
                <Link className="d-block" to="/Resell-page">
                  RESELL
                </Link>
              </li>
            </ul>
          </div>

          <div className="mainHolder justify-content-center mx-2">
            <nav className="navbar navbar-expand-lg navbar-light p-0 pageNav1 position-static">
              <button
                type="button"
                className="navbar-toggle collapsed position-relative mt-md-2"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-center"
                id="navbarNav"
              >
                <ul className="navbar-nav text-uppercase d-inline-block align-items-center">
                  <li className="nav-item dropdown">
                    <Link
                      className="dropdown-toggle d-block movbile-Link"
                      to="/store"
                    >
                      STORE
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="dropdown-toggle d-block" to="/about">
                      ABOUT US
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="dropdown-toggle d-block" to="/blog">
                      BLOG
                    </Link>
                  </li>
                  <li
                    className="nav-item mega-menu-container p-1"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link className="nLogo" to="/">
                      <img
                        src="images/Artsays-logo.png"
                        alt="Artsays"
                        className="img-fluid-art-logo rounded-0"
                      />
                    </Link>
                    <MegaMenu
                      ref={megaMenuRef}
                      isOpen={isMegaMenuOpen}
                      className="mega-menu display-none-mobile"
                      onMouseEnter={handleMegaMenuEnter}
                      onMouseLeave={handleMegaMenuLeave}
                    />
                  </li>
                  <li className="nav-item dropdown">
                    <Link className="dropdown-toggle d-block" to="/login">
                      Login
                    </Link>
                  </li>

                  <li className="nav-item dropdown mega-menu-mobile">
                    <span
                      className="dropdown-toggle text-center"
                      onClick={toggleDropdown}
                    >
                      Categories
                      <span
                        className={`arrow-icon ${
                          isDropdownOpen ? "rotate" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </span>
                    <div
                      className={`custom-dropdown-menu ${
                        isDropdownOpen ? "open" : ""
                      }`}
                    >
                      <div className="p-1 custom-dropdown-sub1">
                        {Object.keys(content).map((key, index) => (
                          <div className="custom-dropdown-sub" key={index}>
                            <span
                              className={`dropdown-item dropdown-toggle text-center   ${
                                activeSubmenu === key ? "active-submenu" : ""
                              }`}
                              onClick={() => toggleSubmenu(key)}
                            >
                              {content[key].heading}
                              <span
                                className={`arrow-icon ${
                                  activeSubmenu === key ? "rotate" : ""
                                }`}
                              >
                                ▼
                              </span>
                            </span>
                            <div
                              className={`submenu  ${
                                activeSubmenu === key ? "open" : ""
                              }`}
                            >
                              <div className="">
                                <div className="fw-normal">
                                  {content[key].items1.map((item, idx) => (
                                    <Link
                                      key={idx}
                                      to="#"
                                      className="custom-submenu-item d-block fw-normal"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                                <div className="fw-normal">
                                  {content[key].items2.map((item, idx) => (
                                    <Link
                                      key={idx}
                                      to="#"
                                      className="custom-submenu-item d-block fw-normal"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>

                  <li className="make-show nav-item  ">
                    <Link className="dropdown-toggle d-block" to="/login">
                      BID
                    </Link>
                  </li>
                  <li className="make-show nav-item  ">
                    <Link className="dropdown-toggle d-block" to="/login">
                      TRADE
                    </Link>
                  </li>
                  <li className="make-show nav-item">
                    <Link className="dropdown-toggle d-block" to="/login">
                      RESELL
                    </Link>
                  </li>

                  <li className="nav-item dropdown">
                    <Link className="dropdown-toggle d-block" to="/register">
                      REGISTER
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="dropdown-toggle d-block" to="/contact">
                      CONTACT US
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="logo">
              <Link to="/">
                <img
                  src="images/Artsays-logo.png"
                  alt="Artsays"
                  className="img-fluid"
                />
              </Link>
            </div>
          </div>

          <div className="col-6 col-sm-3 col-lg-2 order-sm-3 order-md-0 dis-none">
            <ul className="nav nav-tabs wishList pr-2 pl-2 mr-xl-3 mr-0 justify-content-end border-bottom-0">
              <li className="nav-item">
                <a className="nav-link icon-search" href="#"></a>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link position-relative icon-heart bg-none"
                  to="wishlist"
                >
                  <span className="num rounded d-block">
                    {totalItemsInWishlist}
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link position-relative icon-cart"
                  to="cart-page"
                >
                  <span className="num rounded d-block">
                    {totalItemsInCart}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {isMegaMenuOpen && <div className="mega-menu-overlay"></div>}

      <div className="page-content">{/* Your other page content */}</div>
    </>
  );
}

export default Header;
