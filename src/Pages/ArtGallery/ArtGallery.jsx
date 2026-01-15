import React from 'react';
import HeroImgCollections from './hero-img/hero';
import ArtGalleryContent from './ArtGallery/ArtGalleryContent';
import SuccessPartner from './SuccessPartner/SuccessPartner';

const ArtGallery = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgCollections/>
        <ArtGalleryContent/>
        <SuccessPartner/>
    </div>
  );
};

export default ArtGallery;
