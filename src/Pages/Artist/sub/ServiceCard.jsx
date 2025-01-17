import React, { useState } from "react";
import './ServiceCard.css'; // Link to your CSS file for styling
import { FaCheckCircle, FaRegHeart } from "react-icons/fa";
import { FaTag } from "react-icons/fa6";

const ServiceCard = ({ images, profileImg, name, delivery, description, category, price }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="svc-unique-service-card">
      <div className="svc-unique-card-header">
        <div className="svc-unique-carousel-container">
          <img className="svc-unique-service-image" src={images[currentImageIndex]} alt="Service" />
          <div className="carousel-dots">
            {images.map((_, index) => (
              <div
                key={index}
                className={`carousel-dot ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
        <img className="svc-unique-profile-image" src={profileImg} alt="Profile" />
      </div>
      <div className="svc-unique-card-content">
        <div className="svc-unique-card-header-content">
          <h4>{name} <FaCheckCircle className="user-profile-crd-check-icon" /></h4>
          <FaRegHeart className="heart-icon" />
        </div>
        <p className="svc-unique-delivery">Delivery: <span>{delivery}</span></p>
        <h3 className="svc-unique-description">{description}</h3>
        <div className="svc-category-price">
          <p className="svc-unique-category"><FaTag />{category}</p>
          <p className="svc-unique-price">${price}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
