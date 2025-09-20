import HeroImgAboutUs from './hero-img/hero-img';
import WhoWeAre from './WhoWeAre/WhoWeAre'
import WhatWeDo from './WhatWeDo/WhatWeDo'
import MissionVision from './MissionVision/MissionVision'
import OurValues from './OurValues/OurValues'
import DeliveryProcess from './DeliveryProcess/DeliveryProcess'
import MeetTeam from './MeetTeam/MeetTeam'
import Testimonials from './Testimonials/Testimonials'

const AboutUs = () => {
  return (
    <div className="font-[poppins]">
        <HeroImgAboutUs/>
        <WhoWeAre/>
        <WhatWeDo/>
        <MissionVision/>
        <OurValues/>
        <DeliveryProcess/>
        <MeetTeam/>
        <Testimonials/>
    </div>
  );
};

export default AboutUs;
