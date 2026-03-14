import React from 'react';
import HeroImgCelebrity from './hero-img/hero-img';
import CelebrityCard from './celebrity-card/celebrity-card';
import SponsoredProducts from '../../Component/Common/SponsoredProducts';

const Celebrity = () => {
  return (
    <div className="w-full font-[poppins]">
      <HeroImgCelebrity />
      <CelebrityCard />
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
        <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

export default Celebrity;
