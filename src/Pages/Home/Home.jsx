import React from "react";
import NavBar from "./HomeComponents/NavBar";
import Footer from "./HomeComponents/Footer";
const Home = () => {
  return (
    <div className="w-full h-screen w-max[1440px] bg-base ">
      <NavBar />

      <main className="border border-t-[1px] h-[50%] bg-base border-primary-900"></main>
      <Footer />
    </div>
  );
};

export default Home;
