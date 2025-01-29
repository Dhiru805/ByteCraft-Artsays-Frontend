import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../../Contexts/ProductProvider';
// import './ImgCollectionSlider.css';

const Carousel = () => {
  const { products, addToCartFromStore, addToWishlist, currency, convertPrice, getSymbol } = useContext(ProductContext);
  const totalImages = products.length;
  const duplicatedImages = [...products, ...products]; // Duplicate for smooth looping
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4); // Default to 4 items per slide
  const containerRef = useRef(null);

  const updateItemsPerSlide = () => {
    if (window.innerWidth <= 576) {
      setItemsPerSlide(1);
    } else if (window.innerWidth <= 768) {
      setItemsPerSlide(2);
    } else if (window.innerWidth <= 1200) {
      setItemsPerSlide(3);
    } else {
      setItemsPerSlide(4);
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
    if (!container || !container.querySelector('.carousel-card')) return; // Exit if not rendered

    const cardWidth = container.querySelector('.carousel-card').offsetWidth;
    const marginRight = parseInt(window.getComputedStyle(container.querySelector('.carousel-card')).marginRight);
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

  return (
    <section className="FeaturedSec">
      <header className="col-12 mainHeader text-center carousal-header">
        <h1 className="headingIV playfair fwEbold mb-5">Daily Deal</h1>
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
        {/* <div id="defaultCountdown" className="comming-timer"></div> */}
      </header>
      <div className="carousel-container-deals">
        <div className="carousel-wrapper " ref={containerRef}>
          {duplicatedImages.map((product, index) => (
            <div className="carousel-card" key={index}>
             <div  className="carousal-imgage-hold ">
             <Link to={`/shop-detail/${product.id}`}>
                <img src={product.imageUrl} alt={product.title} className="carousel-image" />
              </Link>
             </div>
              <ul className="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                <li className="overflow-hidden">
                  <Link href="#" className="icon-heart" onClick={() => addToWishlist(product)}></Link>
                </li>
                <li className="overflow-hidden">
                  <Link href="#" className="icon-cart" onClick={() => addToCartFromStore(product, 'L')}></Link>
                </li>
                <li className="overflow-hidden">
                  <Link href="#" className="icon-eye"></Link>
                </li>
                <li className="overflow-hidden">
                  <Link href="#" className="icon-arrow"></Link>
                </li>
              </ul>
              {/* <div className="carousel-content">
                <Link to={`/shop-detail/${product.id}`}>
                  <h5 className="carousel-title">{product.title}</h5>
                </Link>
                {product.oldPrice ? (
                  <span className="price block fwEbold">
                    <del className='mr-2'>
                      {getSymbol()}{convertPrice(product.oldPrice).toFixed(2)}
                    </del>
                    {getSymbol()}{convertPrice(product.newPrice).toFixed(2)}
                  </span>
                ) : (
                  <span className="carousel-price fwEbold">
                    {getSymbol()}{convertPrice(product.newPrice).toFixed(2)}
                  </span>
                )}
              </div> */}
              <div className="cards-contentss store-card">
                <Link to={`/shop-detail/${product.id}`}>
                  <h5 className="store-cards-title mb-2">{product.title}</h5>
                </Link>
                <div className='store-rating mb-2 d-flex justify-content-between  '>
                  <div>
                    <i className="fa fa-star store-rat " aria-hidden="true"></i>
                    <i className="fa fa-star store-rat " aria-hidden="true"></i>
                    <i className="fa fa-star store-rat " aria-hidden="true"></i>
                    <i className="fa fa-star store-rat" aria-hidden="true"></i>
                    <i className="fa fa-star store-rat" aria-hidden="true"></i>
                    {/* <div className='store-rat '>4.5 <i className="fa fa-star " aria-hidden="true"></i></div> */}
                    <span className='no-pourches'>(10255)</span>
                  </div>
                  <div className='d-flex store-rat pl-1 '>
                    <div>Size : </div>
                    <span className='store-img-size-span'>545×545 cm</span>
                  </div>
                </div>
                <div className='store-rating mb-2 d-flex  '>
                  <div className='store-artist'>Artist : </div>
                  <span className='pl-1 store-artist-name'>ablo ablo</span>
                  <div className='store-artist-rat pl-2 '>4.5 <i className="fa fa-star " aria-hidden="true"></i></div>
                </div>
                <div className=''>
                  {product.oldPrice ? (
                    <span className="price block mb-2 " data-currency={currency} data-price={convertPrice(product.newPrice)}>
                      <span className='cards-price fwEbold'> {getSymbol()}{convertPrice(product.newPrice).toFixed(2)}</span>
                      <del className='ml-1 store-old-price fwEbold  ' data-currency={currency} data-price={convertPrice(product.oldPrice)}>
                        {getSymbol()}{convertPrice(product.oldPrice).toFixed(2)}
                      </del>
                    </span>
                  ) : (
                    <span className="cards-price fwEbold" data-currency={currency} data-price={convertPrice(product.newPrice)}>
                      {getSymbol()}{convertPrice(product.newPrice).toFixed(2)}
                    </span>
                  )}

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
