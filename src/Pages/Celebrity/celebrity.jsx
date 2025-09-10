import React from 'react';
import HeroImgCelebrity from './hero-img/hero-img';
import CelebrityCard from './celebrity-card/celebrity-card';

const Celebrity = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCelebrity/>
        <CelebrityCard/>
    </div>
  );
};

export default Celebrity;
