import React from 'react';
import HeroImgLicensingPartner from './hero-img/hero-img';
import LicensingPartnerContent from "./LicensingPartnerContent/LicensingPartnerContent"

const LicensingPartner = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgLicensingPartner/>
        <LicensingPartnerContent/>
    </div>
  );
};

export default LicensingPartner;
