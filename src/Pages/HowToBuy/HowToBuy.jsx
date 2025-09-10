import React from 'react';
import HeroImgHowToBuy from './hero-img/hero-img';
import HowToBuyContent from './HowToBuyContent/HowToBuyContent'

const HowToBuy = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgHowToBuy/>
        <HowToBuyContent/>
    </div>
  );
};

export default HowToBuy;
