import React from 'react';
import HeroImgInsurance from './hero-img/hero-img';
import WhyInsurance from './WhyInsurance/WhyInsurance';
import HowToGet from './HowToGet/HowToGet';
import InsurancePlan from './InsurancePlan/InsurancePlan';

const Insurance = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgInsurance/>
        <WhyInsurance/>
        <HowToGet/>
        <InsurancePlan/>
    </div>
  );
};

export default Insurance;