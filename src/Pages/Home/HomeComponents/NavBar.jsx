import React from "react";
import { Link } from "react-router-dom";
import { NavGuestState, NavUserState } from "./NavLoginState";
const NavBar = ({setShowMegamenu}) => {
  return (
    <nav className=" px-20 h-[100px] max-w-[1440px] text-primary-900  flex flex-row items-center mx-auto  ">
      <div className="flex-1/2 flex  gap-3   font-bold leading-[28px]">
        <Link to={"#"}>BID</Link>
        <Link to={"#"}>RESELL</Link>
      </div>
      {/* middle */}
      <div className="flex-1 flex font-semibold gap-[40px] flex-row  justify-center items-center  ">
        {/* first of middle */}
        <div className="flex-row flex  gap-3">
          <Link to={"#"}>ABOUT US</Link>
          <Link to={"#"}>STORE</Link>
          <Link to={"#"}>COLLECTIONS</Link>
        </div>
        
          <button
           onMouseLeave={()=>setShowMegamenu(false)}
          onMouseEnter={()=>setShowMegamenu(true)} className="mx-2">
          <img src="/assets/home/logo.svg" alt="Logo" />
          </button >
       
        

        <div className="flex gap-3">
          <Link to={"#"}>REGISTER</Link>
          <Link to={"#"}>BLOG</Link>
          <Link to={"#"}>CONTACT US</Link>
        </div>
      </div>

      <div className="flex-1/4">
       <NavUserState/>
      </div>
    </nav>
  );
};

export default NavBar;
