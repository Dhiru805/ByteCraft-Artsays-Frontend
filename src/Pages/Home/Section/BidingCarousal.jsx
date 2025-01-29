import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../../Contexts/ProductProvider';
// import './ImgCollectionSlider.css';
// import './Biding.css';

const Carousel = () => {
  const { products, addToCartFromStore, addToWishlist, currency, convertPrice, getSymbol } = useContext(ProductContext);
  const totalImages = products.length;
  const duplicatedImages = [...products, ...products]; // Duplicate for smooth looping
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4); // Default to 4 items per slide
  const containerRef = useRef(null);

  const updateItemsPerSlide = () => {
    if (window.innerWidth <= 576) {
      setItemsPerSlide(2);
    } else if (window.innerWidth <= 768) {
      setItemsPerSlide(3);
    } else if (window.innerWidth <= 1200) {
      setItemsPerSlide(4);
    } else {
      setItemsPerSlide(5);
    }
  };

  useEffect(() => {
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);

    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.querySelector('.biding-carousel-card')) return; // Exit if not rendered

    const cardWidth = container.querySelector('.biding-carousel-card').offsetWidth;
    const marginRight = parseInt(window.getComputedStyle(container.querySelector('.biding-carousel-card')).marginRight);
    const translateValue = (cardWidth + marginRight) * currentIndex;

    if (currentIndex >= totalImages) {
      setTimeout(() => {
        container.style.transition = 'none';
        setCurrentIndex(0); // Reset the index
        container.style.transform = `translateX(0)`;
      }, 1000);
    } else {
      container.style.transition = 'transform 1s ease-in-out';
      container.style.transform = `translateX(-${translateValue}px)`;
    }
  }, [currentIndex, totalImages, itemsPerSlide]);

  const toggleLike = (index) => {
    const updatedArtworks = products.map((product, i) =>
      i === index ? { ...product, liked: !product.liked } : product
    );
    // setArtworks(updatedArtworks);
  };

  return (
    <section className="FeaturedSec">
      <header className="col-12 mainHeader  text-center carousal-header">
        <h1 className="headingIV playfair fwEbold mb-5">Biding Deal</h1>
        <span className="headerBorder d-block mb-md-5 mb-3">
          <img src="images/hbdr.png" alt="Header Border" className="img-fluid img-bdr" />
        </span>
        <div className='DailyDeals-container-2'>
          <div className='col-10  ml-0 mr-0  '>
            <div className="bid-para  ">There are many variations of passages of lorem ipsum available.</div>
            {/* <div className="ci-notify-btn btn btn view-btn" role="button">view All → </div> */}
          </div>
          <div className='ml-0 mr-0 '>
            <div className="ci-notify-btn btn btn " role="button">view All → </div>
          </div>
        </div>
      </header>
      <div className="carousel-container-biding" >
        <div className='biding-bid' >
        <div className="bid-carousel-wrappe" ref={containerRef}>
          {duplicatedImages.map((product, index) => (
            <div className="biding-carousel-card" key={index}>
              <Link to={`/shop-detail/${product.id}`}>
                <img src={product.imageUrl} alt={product.title} className="biding-carousel-image" />
              </Link>
              <div className="bid-card-content">
            <h3 className="bid-card-title">{product.title}</h3>
            <div className="bid-card-details">
              <div className="bid-card-price">{product.newPrice}</div>
              <div className="bid-card-time">00:00:00 Left</div>
            </div>
            <div className="card-actions">
              <span 
                className={`bid-heart-btn ${product.liked ? 'liked' : ''}`} 
                onClick={() => toggleLike(index)}
              >
                {product.liked ? '❤️' : '🤍'}
              </span>
              <div className="btn bid-btn-place-bid">Place Bid</div>
              <span className="share-button">🔗</span>
            </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
