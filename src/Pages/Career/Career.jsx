import React from 'react';
import HeroImgCareer from './hero-img/hero-img';
import JoinArtsays from './JoinArtsays/JoinArtsays'
import OpenRoles from './OpenRoles/OpenRoles'
import LifeAtArtsays from './LifeAtArtsays/LifeAtArtsays'

const Career = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCareer/>
        <JoinArtsays/>
        <OpenRoles/>
        <LifeAtArtsays/>
    </div>
  );
};

export default Career;
