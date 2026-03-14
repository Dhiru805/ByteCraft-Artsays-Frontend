import React from 'react';
import HeroImg from '../store/hero-img/hero-img';
import Product from "./products/product";

const Store = () => {
  return (
    <div className="w-full font-[poppins]">
        <HeroImg/>
        <Product/>
    </div>
  );
};

export default Store;
