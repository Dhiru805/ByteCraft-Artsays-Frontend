import React from 'react';
import HeroImgBid from './hero-img/hero-img';
import BidProduct from './bidProduct/bidProduct';
import SponsoredProducts from '../../Component/Common/SponsoredProducts';

const Bid = () => {
  return (
    <div className="w-full mx-auto font-[poppins]">
        <HeroImgBid/>
        <BidProduct/>
        <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
            <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
        </div>
    </div>
  );
};

export default Bid;
