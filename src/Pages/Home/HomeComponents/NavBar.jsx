import React from "react";
import { Link } from "react-router-dom";
import { NavGuestState, NavUserState } from "./NavLoginState";
const NavBar = () => {
  return (
    <nav className="md:w-[90%] w-[95%] h-[100px] text-primary-900 p-2 flex flex-row items-center mx-auto  ">
      <div className="flex-1/2 flex  gap-4   font-bold">
        <Link to={"#"}>BID</Link>
        <Link to={"#"}>RESELL</Link>
      </div>
      {/* middle */}
      <div className="flex-1 flex font-semibold gap-4 flex-row  justify-center items-center  ">
        {/* first of middle */}
        <div className="flex-row flex  gap-4">
          <Link to={"#"}>ABOUT US</Link>
          <Link to={"#"}>STORE</Link>
          <Link to={"#"}>COLLECTIONS</Link>
        </div>
        
          <Link className="mx-2">
          <img src="/assets/home/logo.svg" alt="Logo" />
          </Link>
       
        

        <div className="flex gap-4">
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
