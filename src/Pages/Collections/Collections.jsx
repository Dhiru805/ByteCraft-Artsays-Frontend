import React from 'react';
import HeroImgCollections from './hero-img/hero-img';
import CollectionsContent from './CollectionsContent/CollectionsContent'

const Collections = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCollections/>
        <CollectionsContent/>
    </div>
  );
};

export default Collections;
