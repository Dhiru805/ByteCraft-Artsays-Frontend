import React from 'react';
import HeroImgHowToBid from './hero-img/hero-img'; // Update banner image if needed
import HowToBidContent from './HowToBidContent/bidContent';

const HowToBid = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgHowToBid />
        <HowToBidContent />
    </div>
  );
};

export default HowToBid;
