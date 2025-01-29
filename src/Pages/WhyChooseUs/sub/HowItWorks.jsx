import React from 'react';
import { FaHeart, FaLaptop, FaSmile } from 'react-icons/fa';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <h2 className="how-it-works-title">How It Works</h2>
      <div className="how-it-works-steps">
        <div className="how-it-works-step">
          <FaHeart className="how-it-works-icon" />
          <h3 className="how-it-works-heading">Discover Original Art You Love</h3>
          <p className="how-it-works-description">Find the perfect piece by browsing our carefully curated collection.</p>
        </div>
        <div className="how-it-works-step">
          <FaLaptop className="how-it-works-icon" />
          <h3 className="how-it-works-heading">Easily Place Your Order Online</h3>
          <p className="how-it-works-description">Check out smoothly. Once we receive your order, we ship your artwork securely and are here to help every step of the way.</p>
        </div>
        <div className="how-it-works-step">
          <FaSmile className="how-it-works-icon" />
          <h3 className="how-it-works-heading">Open Your New Artwork and Enjoy</h3>
          <p className="how-it-works-description">Love at first sight. If not, simply return it within 14 days.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
