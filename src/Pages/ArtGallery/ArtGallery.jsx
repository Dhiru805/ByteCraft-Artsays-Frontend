import React from 'react';
import HeroImgCollections from './hero-img/hero';
import ArtGalleryContent from './ArtGallery/ArtGalleryContent';
import SuccessPartner from './SuccessPartner/SuccessPartner';
import SponsoredProducts from '../../Component/Common/SponsoredProducts';

const ArtGallery = () => {
  return (
    <div className="w-full font-[poppins]">
        <HeroImgCollections/>
        <ArtGalleryContent/>
        <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
            <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
        </div>
        <SuccessPartner/>
    </div>
  );
};

export default ArtGallery;
