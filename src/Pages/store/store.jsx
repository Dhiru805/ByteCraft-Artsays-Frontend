import React from 'react';
import HeroImg from '../store/hero-img/hero-img';
import Product from "./products/product";

const Store = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImg/>
        <Product/>
    </div>
  );
};

export default Store;
