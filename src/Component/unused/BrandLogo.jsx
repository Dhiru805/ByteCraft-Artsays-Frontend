import React from 'react';
import './brandlogo.css';

const logos = [
  "./images/p-logo1.png",
  "./images/p-logo2.png",
  "./images/p-logo3.png",
  "./images/p-logo4.png",
  "./images/p-logo5.png",
  "./images/p-logo6.png"
];

const LogoSlider = () => {
  return (
    <div className="logos">
      <div className="logo_items">
        {logos.map((src, index) => (
          <img key={index} src={src} alt={`logo-${index}`} />
        ))}
      </div>
      {/* Duplicate logo_items to create infinite loop effect */}
      <div className="logo_items">
        {logos.map((src, index) => (
          <img key={index + logos.length} src={src} alt={`logo-${index + logos.length}`} />
        ))}
      </div>
    </div>
  );
};

export default LogoSlider;
