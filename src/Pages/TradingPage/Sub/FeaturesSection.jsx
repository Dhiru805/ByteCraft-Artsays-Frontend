import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const data = [
    {
      number: '01.',
      title: 'Huge collection',
      description: 'A collection of 5,000 unique Nerkos built to go beyond the digital space that will unlock numerous benefits for our community.'
    },
    {
      number: '02.',
      title: 'High quality',
      description: 'The nerko’s collection includes dozens of rare heads, costumes, and colorways of the artist’s palette. They are drawn with great care.'
    },
    {
      number: '03.',
      title: 'Top resource',
      description: 'Tasty design resources made with care for each pixel. Tokens, metaverse and game resources NFTs. Access additional drops.'
    },
    {
      number: '04.',
      title: 'Big community',
      description: 'Be part of a community of nerko owners and create user-generated items. Rent, advertise, launch stores, create items. We make it easy to discover.'
    }
  ];

  return (
    <div className="features-section">
      <h2 className="features-section-title">Why choose us?</h2>
      <div className="features-section-content">
        {data.map((item, index) => (
          <div
            className={`features-section-item ${index % 2 === 0 ? 'up' : 'down'}`}
            key={index}
          >
            <h3 className="features-section-item-number">{item.number}</h3>
            <h4 className="features-section-item-title">{item.title}</h4>
            <p className="features-section-item-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
