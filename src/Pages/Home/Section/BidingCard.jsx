import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../../../Contexts/ProductProvider';
import './BidingCarousal.css';

const Carousel = () => {
  const { products } = useContext(ProductContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000); // Change content every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [products.length]);

  const getVisibleProducts = (index) => {
    const visibleProducts = [];
    for (let i = 0; i < products.length; i++) {
      const productIndex = (index + i) % products.length;
      visibleProducts.push(products[productIndex]);
    }
    return visibleProducts;
  };

  const visibleProducts = getVisibleProducts(currentIndex);

  return (
    <section className="FeaturedSec">
      <header className="col-12 mainHeader text-center carousal-header">
        <h1 className="headingIV playfair fwEbold mb-5">Biding Deal</h1>
        <span className="headerBorder d-block mb-md-5 mb-3">
          <img src="images/hbdr.png" alt="Header Border" className="img-fluid img-bdr" />
        </span>
        <div className='DailyDeals-container-2'>
        <div className='d-flex align-content-center justify-content-center'>
        <div className="pl-5">There are many variations of passages of lorem ipsum available.</div>
        
       </div>
      
       <div className="ci-notify-btn btn btn" role="button">view All → </div>
       </div>
      </header>

      <div className="bid-carousel-container">
        <div className="bid-carousel-cards-container" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 1s ease-in-out' }}>
          {visibleProducts.map((product, index) => (
            <div className="static-carousel-card" key={index}>
              <img src={product.imageUrl} alt={product.title} className="biding-carousel-image" />
              <div className="bid-card-content">
                <h3 className="bid-card-title">{product.title}</h3>
                <div className="bid-card-details">
                  <p className="bid-card-price">{product.newPrice}</p>
                  <p className="bid-card-time">00:00:00 Left</p>
                </div>
                <div className="bid-card-actions">
                  <span className="heart-btn">❤️</span>
                  <div className="btn btn-place-bid">Place Bid</div>
                  <span className="share-button">🔗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
