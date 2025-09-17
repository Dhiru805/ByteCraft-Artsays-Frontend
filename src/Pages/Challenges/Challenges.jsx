import React from 'react';
import HeroImgChallenges from './hero-img/hero-img';
import ChallengesContent from './ChallengesContent/ChallengesContent'
import JoinChallenges from './JoinChallenges/JoinChallenges'

const Challenge = () => {
  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
        <HeroImgChallenges/>
        <ChallengesContent/>
        <JoinChallenges/>
    </div>
  );
};

export default Challenge;
