import React from 'react';
import HeroImgCertification from './hero-img/hero-img';
import CertificationContent from './CertificationContent/CertificationContent';
import SponsoredProducts from "../../Component/Common/SponsoredProducts";

const Certification = () => {
  return (
    <div className="w-full font-[poppins]">
      <HeroImgCertification />
      <CertificationContent />
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
        <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

export default Certification;
