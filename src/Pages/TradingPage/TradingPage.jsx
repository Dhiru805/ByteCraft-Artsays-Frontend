import React, { useState, useEffect } from 'react';
import HeroSection2 from './Sub/HeroSection2';
import FeaturesSection from './Sub/FeaturesSection';
import Roadmap from './Sub/Roadmap';
import Newslider from "../../Component/newSlider/NewSlider"
const TradingPage = () => {
	
	return (
		<>
         <HeroSection2/>
		 <FeaturesSection/>
		 <Roadmap/>
		 <Newslider/>
        </>
	)
}

export default TradingPage;