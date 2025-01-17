import React, { useState, useEffect } from 'react';
import NFTCard from './sub/NFTCard';
import WhyChooseUs from './sub/WhyChooseUs';
import CreativeInspiration from './sub/CreativeInspiration';
import ImageCollection from './sub/ImageCollection';
import FAQ from '../../Component/FAQ/FAQ';
const BidingPage = () => {
	
	return (
		<>
         <NFTCard/>
		 <WhyChooseUs/>
		 <CreativeInspiration/>
		 <ImageCollection/>
		 <FAQ/>
        </>
	)
}

export default BidingPage;