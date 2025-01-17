import React, { useState, useEffect } from 'react';
import "./StoreCarousl.css";
import AboutCarousal from "../About/Sub/AboutPageCards"

const Carousel = () => {
  
 
  return (
    <div className="store-carousel-container">
      {/* Carousel Main Display */}
      <div className="store-carousel-slide">
        {/* First Slide Design */}
          <div className="first-slide">
            {/* Left Side with Card Animation */}
            <div className="slide-left1">
              <div className="store-card-animation">
                {/* Example of an animated card */}
                <div className="store-animation-card">
                  <AboutCarousal/>
                </div>
              </div>
            </div>
            
            {/* Right Side with Heading, Paragraph, and Button */}
            <div className="slide-right1">
              <h1>Exciting Offer!</h1>
              <p>Get the best deals on our exclusive products. Limited time offer!</p>
              {/* <button className="cta-button">Shop Now</button> */}
              <div className="ci-notify-btn btn btn" role="button">Buy →</div>
            </div>
          </div>
        {/* Placeholder for other slides */}
        {/* {currentSlide !== 0 && <h1>Slide {slides[currentSlide]}</h1>} */}
      </div>

      {/* Navigation Controls */}
    </div>
  );
};

export default Carousel;
