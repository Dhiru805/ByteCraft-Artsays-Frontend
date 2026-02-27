import React from 'react';
import HeroImgCollections from './hero-img/hero';
import ArtGalleryContent from './ArtGallery/ArtGalleryContent';
import SuccessPartner from './SuccessPartner/SuccessPartner';

const ArtGallery = () => {
  return (
    <div className="w-full font-[poppins]">
        <HeroImgCollections/>
        <ArtGalleryContent/>
        <SuccessPartner/>
    </div>
  );
};

export default ArtGallery;
