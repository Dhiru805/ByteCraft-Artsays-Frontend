import React, { useState, useEffect } from 'react';
import './OurServices.css';  // Import the CSS file

const services = [
  {
    id: 1,
    title: 'Service 01',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.',
    imageUrl: 'artimages/product1.jpg',
  },
  {
    id: 2,
    title: 'Service 02',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.',
    imageUrl: 'artimages/product3.jpg',
  },
  {
    id: 3,
    title: 'Service 03',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.',
    imageUrl: 'artimages/product1.jpg',
  },
];

const OurServices = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(services[0].imageUrl);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    setCurrentImage(services[activeIndex].imageUrl);
  }, [activeIndex]);

  return (
    <div className="services-wrapper">
      <h2 className="services-heading">Our Services</h2>
      <p className="services-subheading">Insert your awesome subtitle here</p>
      <div className="services-content">
        <div className="services-image">
          <img src={currentImage} alt="Service" />
        </div>
        <div className="services-details">
          <div className="services-slider">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`service-item ${index === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setCurrentImage(service.imageUrl)}
              >
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
