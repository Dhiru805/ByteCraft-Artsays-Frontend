import React from 'react';
import HeroImgBid from './hero-img/hero-img';
import BidProduct from './bidProduct/bidProduct';

const Bid = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgBid/>
        <BidProduct/>
    </div>
  );
};

export default Bid;
