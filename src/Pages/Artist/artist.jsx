import React from 'react';
import HeroImgArtist from './hero-img/hero-img';
import ArtistCard from './artist-card/artist-card';

const Artist = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgArtist/>
        <ArtistCard/>
    </div>
  );
};

export default Artist;
