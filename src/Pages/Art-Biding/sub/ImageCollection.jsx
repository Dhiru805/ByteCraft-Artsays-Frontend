import React, { useState } from 'react';
import './ImageCollection.css';

const ImageCollection = () => {
  const [artworks, setArtworks] = useState([
    {
      src: 'artimages/product1.jpg',
      title: 'Colorful Abstract Painting',
      price: '0.08 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
    },
    {
      src: 'artimages/product2.jpg',
      title: 'Liquid Forest Princess',
      price: '0.68 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: true,
    },
    {
      src: 'artimages/product3.jpg',
      title: 'Animal Girl Painting',
      price: '1.29 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
    },
     {
      src: 'artimages/product4.jpg',
      title: 'Animal Girl Painting',
      price: '1.29 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
      bid: true,
    },
    {
      src: 'images/img81.png',
      title: 'Animal Girl Painting',
      price: '1.29 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
      bid: true,
    },
    {
      src: 'artimages/product3.jpg',
      title: 'Animal Girl Painting',
      price: '1.29 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
      bid: true,
    },
    {
      src: 'artimages/product2.jpg',
      title: 'Liquid Forest Princess',
      price: '0.68 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: true,
      bid: true,
    },
    {
      src: 'images/img69.jpg',
      title: 'Colorful Abstract Painting',
      price: '0.08 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
      bid: false,
    },
    {
      src: 'artimages/product3.jpg',
      title: 'Animal Girl Painting',
      price: '1.29 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: false,
      bid: true,
    },
    {
      src: 'artimages/product2.jpg',
      title: 'Liquid Forest Princess',
      price: '0.68 ETH',
      timeLeft: '00:00:00 LEFT',
      liked: true,
      bid: true,
    },
    // Add more artwork objects as needed
  ]);

  const toggleLike = (index) => {
    const updatedArtworks = artworks.map((artwork, i) =>
      i === index ? { ...artwork, liked: !artwork.liked } : artwork
    );
    setArtworks(updatedArtworks);
  };

  return (
    <div className="image-collection">
      {artworks.map((artwork, index) => (
        <div className="card-img" key={index}>
          <img src={artwork.src} alt={artwork.title} className="card-image" />
          <div className="card-content">
            <h3 className="card-title">{artwork.title}</h3>
            <div className="card-details">
              <p className="card-price">{artwork.price}</p>
              {artwork.timeLeft && <p className="card-time">{artwork.timeLeft}</p>}
            </div>
            <div className="card-actions">
              <span 
                className={`heart-btn ${artwork.liked ? 'liked' : ''}`} 
                onClick={() => toggleLike(index)}
              >
                {artwork.liked ? '❤️' : '🤍'}
              </span>
              <div className="btn btn-place-bid">Place Bid</div>
              <span className="share-button">🔗</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCollection;
