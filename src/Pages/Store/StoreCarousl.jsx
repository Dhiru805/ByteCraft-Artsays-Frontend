import React, { useState, useEffect } from 'react';
import "./StoreCarousl.css";
import AboutCarousal from "../About/Sub/AboutPageCards"

const Carousel = () => {
  const slides = [1, 2, 3, 4]; // Array directly defined inside Carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        nextSlide();
      }
    }, 5000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [currentSlide, isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="store-carousel-container">
      {/* Carousel Main Display */}
      <div className="store-carousel-slide">
        {/* First Slide Design */}
        {currentSlide === 0 && (
          <div className="first-slide">
            {/* Left Side with Card Animation */}
            <div className="slide-left">
              <div className="card-animation">
                {/* Example of an animated card */}
                <div className="store-animated-card"><img className='store-animated-card-img' src="./artimages/product7.webp" alt="" /></div>
              </div>
            </div>
            
            {/* Right Side with Heading, Paragraph, and Button */}
            <div className="slide-right">
              <h1>Exciting Offer!</h1>
              <p>Get the best deals on our exclusive products. Limited time offer!</p>
              <button className="cta-button">Shop Now</button>
            </div>
          </div>
        )},
         {currentSlide === 1 && (
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
              <button className="cta-button">Shop Now</button>
            </div>
          </div>
        )},
        {currentSlide === 2 && (
          <div className="first-slide">
            {/* Left Side with Card Animation */}
            <div className="slide-left">
              <div className="card-animation">
                {/* Example of an animated card */}
                <div className="store-animated-card"><img className='store-animated-card-img' src="./artimages/product7.webp" alt="" /></div>
              </div>
            </div>
            
            {/* Right Side with Heading, Paragraph, and Button */}
            <div className="slide-right">
              <h1>Exciting Offer!</h1>
              <p>Get the best deals on our exclusive products. Limited time offer!</p>
              <button className="cta-button">Shop Now</button>
            </div>
          </div>
        )},
        {currentSlide === 3 && (
          <div className="first-slide">
            {/* Left Side with Card Animation */}
            <div className="slide-left1">
              <div className="store-card-animation">
                {/* Example of an animated card */}
                <div className="store--card">
                  <AboutCarousal/>
                </div>
              </div>
            </div>
            
            {/* Right Side with Heading, Paragraph, and Button */}
            <div className="slide-right1">
              <h1>Exciting Offer!</h1>
              <p>Get the best deals on our exclusive products. Limited time offer!</p>
              <button className="cta-button">Shop Now</button>
            </div>
          </div>
        )}
        {/* Placeholder for other slides */}
        {/* {currentSlide !== 0 && <h1>Slide {slides[currentSlide]}</h1>} */}
      </div>

      {/* Navigation Controls */}
      <button className="store-prev" onClick={prevSlide}>
        <svg width="22px" height="40px" viewBox="0 0 11 20">
          <path style={{ fill: 'none', stroke: '#000', strokeWidth: '1px' }} d="M9.554,1.001l-8.607,8.607l8.607,8.606" />
        </svg>
      </button>
      <button className="store-next" onClick={nextSlide}>
        <svg width="22px" height="40px" viewBox="0 0 11 20">
          <path style={{ fill: 'none', stroke: '#000', strokeWidth: '1px' }} d="M1.054,18.214l8.606,-8.606l-8.606,-8.607" />
        </svg>
      </button>

      {/* Dots for each slide */}
      <div className="store-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`store-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
