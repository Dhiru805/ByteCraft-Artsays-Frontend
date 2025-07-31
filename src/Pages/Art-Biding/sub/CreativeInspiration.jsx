import React, { useRef, useEffect } from 'react';
import './CreativeInspiration.css';
 
const CreativeInspiration = () => {
  const columnUpRef = useRef(null);
  const columnDownRef = useRef(null);
 
  const images = [
    { src: "artimages/product4.jpg", alt: "Design 1" },
    { src: "artimages/product3.jpg", alt: "Design 2" },
    { src: "artimages/product2.jpg", alt: "Design 3" },
    { src: "artimages/product5.jpg", alt: "Design 4" },
    { src: "artimages/product6.jpg", alt: "Design 5" },
    { src: "artimages/product7.jpg", alt: "Design 6" },
    { src: "artimages/product3.jpg", alt: "Design 7" },
    { src: "artimages/product5.jpg", alt: "Design 8" },
    { src: "artimages/product6.jpg", alt: "Design 9" },
    { src: "artimages/product3.jpg", alt: "Design 10" },
  ];
 
 
 
  const reversedImages = [...images].reverse();
 
  useEffect(() => {
    const columnUp = columnUpRef.current;
    const columnDown = columnDownRef.current;
 
    const handleMouseEnter = () => {
      columnUp.style.animationPlayState = 'paused';
      columnDown.style.animationPlayState = 'paused';
    };
 
    const handleMouseLeave = () => {
      columnUp.style.animationPlayState = 'running';
      columnDown.style.animationPlayState = 'running';
    };
 
    columnUp.addEventListener('mouseenter', handleMouseEnter);
    columnUp.addEventListener('mouseleave', handleMouseLeave);
    columnDown.addEventListener('mouseenter', handleMouseEnter);
    columnDown.addEventListener('mouseleave', handleMouseLeave);
 
    return () => {
      columnUp.removeEventListener('mouseenter', handleMouseEnter);
      columnUp.removeEventListener('mouseleave', handleMouseLeave);
      columnDown.removeEventListener('mouseenter', handleMouseEnter);
      columnDown.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
 
  return (
    <div className="ci-container">
      <div className="ci-left-section">
        <h1>Get Inspiration from Brands & Creatives.</h1>
        <p>Save hours on creative research and find the best design across thousands of screenshots updated every week.</p>
        <div className="ci-email-signup">
          <div className="ci-notify-btn btn btn">Notify Me →</div>
        </div>
      </div>
      <div className="ci-right-section">
        <div className="ci-image-column ci-image-column-up" ref={columnUpRef}>
          {images.map((image, index) => (
            <div key={index} className="ci-image-item">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
        <div className="ci-image-column ci-image-column-down" ref={columnDownRef}>
          {reversedImages.map((image, index) => (
            <div key={index} className="ci-image-item">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default CreativeInspiration;