import React from 'react';
import HeroImgCollections from './hero-img/hero';
import ArtGalleryContent from './ArtGallery/ArtGalleryContent';

const ArtGallery = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCollections/>
        <ArtGalleryContent/>
    </div>
  );
};

export default ArtGallery;
