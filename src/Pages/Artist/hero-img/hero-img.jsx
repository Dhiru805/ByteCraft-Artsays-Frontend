import React from 'react';
import '../../store/hero-img/hero-img.css';

const HeroImgArtist = () => {
    const mainImage = "/banners/artist.png";
    return (
        <div className="relative w-full h-[300px] sm:h-[250px] md:h-[300px] overflow-hidden flex items-center justify-center">
            <img
                src={mainImage}
                alt="Artist Hero"
                className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 to-transparent flex items-center">
                <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
                    <div className="w-full">
                        <span className="inline-block px-3 py-1 bg-white text-[#000000] backdrop-blur-md rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase mb-4 animate-fade-in">
                            Meet Our Creators
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                            Artsays Artists
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl font-medium text-white leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none">
                            Discover the visionary minds behind the world's most captivating art.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroImgArtist;
