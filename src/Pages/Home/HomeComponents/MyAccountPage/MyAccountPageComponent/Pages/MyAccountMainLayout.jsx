import React from 'react';
import NavBar from '../../../../../Home/HomeComponents/NavBar';
import Footer from '../../../../../Home/HomeComponents/Footer';
import MyAccountFooter from '../MyAccountFooter';
import { Outlet } from 'react-router-dom';

const MyAccountMainLayout = () => {
  return (
    <div className="">
      <NavBar />
      <main className="">
        <Outlet />
      </main>
      <MyAccountFooter />
      <Footer />
    </div>
  );
};

export default MyAccountMainLayout;
