import React from 'react';
import HeroImgCommission from './hero-img/hero-img';
import CommissionContent from './commissionContent/commissionContent'

const Commission = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCommission/>
        <CommissionContent/>
    </div>
  );
};

export default Commission;
