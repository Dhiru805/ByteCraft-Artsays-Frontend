import React from 'react';
import HeroImgHowToSell from './hero-img/hero-img';
import HowToSellContent from './HowToSellContent/HowToSellContent'

const HowToSell = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgHowToSell/>
        <HowToSellContent/>
    </div>
  );
};

export default HowToSell;
