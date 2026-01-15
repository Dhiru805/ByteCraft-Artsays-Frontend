import React from 'react';
import HeroImgCertification from './hero-img/hero-img';
import Certificate from './Certificate/Certificate';
import Benifits from './Benifits/Benifits';
import Path from './Path/Path';
import Examples from './Examples/Examples';

const Certification = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCertification/>
        <Certificate/>
        <Benifits/>
        <Path/>
        <Examples/>
    </div>
  );
};

export default Certification;