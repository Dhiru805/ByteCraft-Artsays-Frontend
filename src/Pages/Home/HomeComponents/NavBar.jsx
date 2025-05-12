import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NavGuestState, NavUserState } from "./NavLoginState";
import { AnimatePresence, motion } from "framer-motion";
import MegaMenu from "./MegaMenu";
const NavBar = () => {
  const [showMegamenu, setShowMegamenu] = useState(false);
  return (
    <nav className=" px-20 h-[100px] max-w-[1440px] text-primary-900  flex flex-row items-center mx-auto  ">
      <div className="flex-1/2 flex  gap-3   font-bold leading-[28px]">
        <Link to={"#"}>BID</Link>
        <Link to={"#"}>RESELL</Link>
      </div>

      <div className="flex-1 flex font-semibold gap-[40px] flex-row  justify-center items-center  ">
        <div className="flex-row flex  gap-3">
          <Link to={"#"}>ABOUT US</Link>
          <Link to={"#"}>STORE</Link>
          <Link to={"#"}>COLLECTIONS</Link>
        </div>

        <div
          onMouseLeave={() => setShowMegamenu(false)}
          onMouseEnter={() => setShowMegamenu(true)}
          className="mx-2  h-full  cursor-pointer"
        >
          <img src="/assets/home/logo.svg" alt="Logo" />

          {showMegamenu && (
            <AnimatePresence>
              <motion.div
                className={" z-[9999] relative mx-auto"}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className=" w-[70vw] absolute left-1/2 transform -translate-x-1/2 top-0  z-[9999] ">
                  <MegaMenu />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="flex gap-3">
          <Link to={"#"}>REGISTER</Link>
          <Link to={"#"}>BLOG</Link>
          <Link to={"#"}>CONTACT US</Link>
        </div>
      </div>

      <div className="flex-1/4">
        <NavUserState />
      </div>
    </nav>
  );
};

export default NavBar;
