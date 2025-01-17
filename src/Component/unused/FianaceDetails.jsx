import React, { useState, useEffect, useRef } from 'react';
import './financedetails.css';

const FianaceDetails = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  const slides = [
    {
      heading: "Details of finance 1",
      paragraph: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, veniam. Voluptatum molestiae veniam, enim est harum necessitatibus. Voluptatibus ea corrupti ab dolorem rem nemo ex? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab totam labore quia perspiciatis, sed non enim corrupti excepturi odit dolorem.",
      buttonText: "Learn More 1"
    },
    {
      heading: "Details of finance 2",
      paragraph: "Another set of details about finance. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, veniam. Voluptatum molestiae veniam, enim est harum necessitatibus. Voluptatibus ea corrupti ab dolorem rem nemo ex?",
      buttonText: "Learn More 2"
    },
    {
      heading: "Details of finance 3",
      paragraph: "More details of finance. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, veniam. Voluptatum molestiae veniam, enim est harum necessitatibus. Voluptatibus ea corrupti ab dolorem rem nemo ex?",
      buttonText: "Learn More 3"
    }
  ];

  const startSlider = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 4 seconds
  };

  const stopSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startSlider();
    return () => stopSlider(); // Cleanup on unmount
  }, [slides.length]);

  const handlePrevClick = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const handleNextClick = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  return (
    <div className='finance-detail-main'>
      <div className='finance-detail-inner'>
        <div className='finance-detail-container1'>
          <div className='finance-image1'>
            <img src="financedetails/financedetails1.jpg" alt="" className='finance-img1' />
          </div>
          
        </div>
        <div className='finance-detail-container2 '>
          <div
            className='finance-text-container'
            onMouseEnter={stopSlider}
            onMouseLeave={startSlider}
          >
            <div className='inner-text-box d-flex align-content-center' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, index) => (
                <div className='slide' key={index}>
                  <div className='finenace-content-content'>
                  <div className='finance-heading'>
                    <h1>{slide.heading}</h1>
                  </div>
                  <div className='finance-paragraph'>
                    <p>{slide.paragraph}</p>
                  </div>
                  <div className='finance-button'>
                    <button className="btn-hoverr color-11">{slide.buttonText}</button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
            
        
          </div>
          <div className='finance-arrow-section'>
          <button className="scroll-button left" onClick={handlePrevClick}>
              &#x276E;
            </button>
            <button className="scroll-button right" onClick={handleNextClick}>
              &#x276F;
            </button>
       
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default FianaceDetails;
