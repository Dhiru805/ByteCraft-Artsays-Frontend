import React from 'react';
import HeroImgArtist from './hero-img/hero-img';
import ArtistCard from './artist-card/artist-card';
import SponsoredProducts from '../../Component/Common/SponsoredProducts';

const Artist = () => {
  return (
    <div className="w-full mx-auto font-[poppins]">
        <HeroImgArtist/>
        <ArtistCard/>
        <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
            <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
        </div>
    </div>
  );
};

export default Artist;
