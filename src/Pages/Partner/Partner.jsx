import React from 'react';
import HeroImgPartner from './hero-img/hero-img';
import PartnerTypes from './PartnerTypes/PartnerTypes';
import SuccessPartner from './SuccessPartner/SuccessPartner';
import HowToPartner from './HowToPartner/HowToPartner';

const Partner = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgPartner/>
        <PartnerTypes/>
        <SuccessPartner/>
        <HowToPartner/>
    </div>
  );
};

export default Partner;