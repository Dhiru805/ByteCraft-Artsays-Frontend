import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavUserState, NavGuestState } from "./NavLoginState";
import MegaMenu from "./MegaMenu";

const NavBar = () => {
  const [showMegamenu, setShowMegamenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="px-6 md:px-20 h-[100px] max-w-[1440px] mx-auto flex items-center text-primary-900">
      {/* Left Section: BID / RESELL */}
      <div className="flex flex-1 gap-4 font-bold leading-[28px]">
        <Link to="/bid">BID</Link>
        <Link to="/resell">RESELL</Link>
      </div>

      {/* Center Section */}
      <div className="flex flex-[2] justify-center items-center gap-8 font-semibold">
        <div className="flex gap-6">
          <Link to="/about-us">ABOUT US</Link>
          <Link to="/store" className="font-bold">STORE</Link>
          <Link to="/collections">COLLECTIONS</Link>
        </div>

        {/* Logo + Mega Menu */}
        <div
          className="relative h-full cursor-pointer"
          onMouseEnter={() => setShowMegamenu(true)}
          onMouseLeave={() => setShowMegamenu(false)}
          aria-haspopup="true"
          aria-expanded={showMegamenu}
        >
          <img src="/assets/home/logo.svg" alt="Logo" className="h-10 w-auto" />

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

        <div className="flex gap-4">
          <Link to="/register">REGISTER</Link>
          <Link to="/blog">BLOG</Link>
          <Link to="/contact">CONTACT US</Link>
        </div>
      </div>

      {/* Right Section: User */}
      <div className="flex flex-1 justify-end">
        {isLoggedIn ? <NavGuestState /> : <NavUserState />}
      </div>
    </nav>
  );
};

export default NavBar;
