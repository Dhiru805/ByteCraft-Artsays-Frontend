import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './NewSlider.css';
 
// Custom Next Arrow Component
const NextArrow = ({ onClick }) => (
  <button className="slider-arrows next" onClick={onClick}>
    &gt;
  </button>
);
 
// Custom Previous Arrow Component
const PrevArrow = ({ onClick }) => (
  <button className="slider-arrows prev" onClick={onClick}>
    &lt;
  </button>
);
 
const NewSlider = () => {
  const sliderRef = React.useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contentClass, setContentClass] = useState('slide-in');
 
  const settings = {
    focusOnSelect: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 400,
    afterChange: (index) => {
      setContentClass('slide-out');
      setTimeout(() => {
        setCurrentSlide(index); // Only update the current slide state here
        setContentClass('slide-in');
      }, 500); // Match with CSS animation duration
    },
    nextArrow: <NextArrow />,  // Use custom next arrow
    prevArrow: <PrevArrow />,  // Use custom prev arrow
  };
 
  const cards = [
    {
      title: 'Cappadocia',
      location: 'Turkey',
      image: 'artimages/product9.jpg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    },
    {
      title: 'Malgovik',
      location: 'Sweden',
      image: 'artimages/product9.jpg',
      description: 'Discover the serene beauty of Malgovik, a small village in Sweden surrounded by stunning natural landscapes.',
    },
    {
      title: 'Komodo',
      location: 'Indonesia',
      image: 'artimages/product9.jpg',
      description: 'Explore the wild and untamed Komodo, home to the famous Komodo dragons and pristine marine environments.',
    },
    {
      title: 'Kerala',
      location: 'India',
      image: 'artimages/product9.jpg',
      description: 'Experience the lush green landscapes of Kerala, a state on India\'s tropical Malabar Coast, known for its palm-lined beaches.',
    },
  ];
 
  useEffect(() => {
    setContentClass('slide-in');
  }, []);
 
  const handleNext = () => {
    sliderRef.current.slickNext();
  };
 
  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };
 
  const handleDotClick = (index) => {
    sliderRef.current.slickGoTo(index);
  };
 
  return (
    <div className="carousel-container">
      <div className="carousel-background">
        <div className="carousel-content-trading">
          <div className={`content-wrapper ${contentClass}`}>
            <h1>{cards[currentSlide].title}</h1>
            <p>{cards[currentSlide].description}</p>
            <button className=" ci-notify-btn btn btn">Explore →</button>
          </div>
        </div>
 
        <div className="slider-container-main">
          {/* Vertical dots for navigation */}
          <div className="vertical-dots">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`dot-container ${currentSlide === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              >
                <div className={`dot-active ${currentSlide === index ? 'active' : ''}`}>
                  {currentSlide === index && (
                    <span className="active-slide-number">{index + 1}</span>
                  )}
                </div>
              </div>
            ))}
            <div className="vertical-line"></div>
          </div>
 
          {/* The Slider */}
          <Slider ref={sliderRef} {...settings} className="Slider-container">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`carousel-card-trading ${currentSlide === index ? 'active' : ''}`}
              >
                <img src={card.image} alt={card.title} className='slider-trading-image' />
                <div className="card-overlay">
                  <h2>{card.title}</h2>
                  <p>{card.location}</p>
                </div>
              </div>
            ))}
          </Slider>
 
          {/* Navigation arrows */}
          <div className="trading-arrows">
            <button id="art-prev" onClick={handlePrevious}>&lt;</button>
            <button id="art-next" onClick={handleNext}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default NewSlider;
 
 