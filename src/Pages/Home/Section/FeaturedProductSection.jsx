import React, { useState, useEffect, useContext } from 'react';
// import './FeaturedProductSection.css';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../../Contexts/ProductProvider';
import CategoryComponent from '../../../Component/Category/CategoryComponent';

const FeaturedProductSection = () => {
  const { products, addToCartFromStore, addToWishlist, currency, convertPrice, getSymbol } = useContext(ProductContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const adjustFontSize = () => {
      const titles = document.querySelectorAll('.cards-title');
      titles.forEach(title => {
        let fontSize = 20;
        while (title.scrollWidth > title.clientWidth && fontSize > 12) {
          fontSize--;
          title.style.fontSize = `${fontSize}px`;
        }
      });
    };

    const updateItemsPerRow = () => {
      if (window.innerWidth <= 576) {
        setItemsPerRow(2); // Show 2 items per row on small screens
      } else if (window.innerWidth <= 768) {
        setItemsPerRow(3); // Show 3 items per row on medium screens
      } else {
        setItemsPerRow(5); // Show 5 items per row on large screens
      }
    };

    updateItemsPerRow();
    adjustFontSize();

    window.addEventListener('resize', adjustFontSize);
    window.addEventListener('resize', updateItemsPerRow);

    return () => {
      window.removeEventListener('resize', adjustFontSize);
      window.removeEventListener('resize', updateItemsPerRow);
    };
  }, []);

  const itemsPerPage = itemsPerRow * 5; // 5 rows of items

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <section className="FeaturedSec mt-8">
      <header className="col-12 mainHeader mb-5 text-center">
        <h1 className="headingIV playfair fwEblod mb-4 mt-4">Featured Product</h1>
        <span className="headerBorder d-block mb-md-5 mb-3">
         <CategoryComponent/>
          {/* <img src="images/hbdr.png" alt="Header Border" className="img-fluid img-bdr" /> */}
        </span>
        <p>Lorem ipsum is simply dummy text of the printing and typesetting industry.</p>
      </header>
      <div className="image-collections">
        {currentProducts.map((product,index) => (
          <div className="cards" key={index}>
            <div className="ImageHolders">
              <Link to={`/shop-detail/${product.id}`}>
                <img src={product.imageUrl} alt={product.title} className="cards-images" />
              </Link>
              <ul className="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                <li className="overflow-hidden">
                  <Link href="#" className="icon-heart " onClick={() => addToWishlist(product)}></Link>
                </li>
                <li className="overflow-hidden">
                  <Link href="#" className="icon-cart " onClick={() => addToCartFromStore(product, 'L')}></Link>
                </li>
                <li className="overflow-hidden">
                  <Link href="#" className="icon-eye "></Link>
                </li>
                <li className="overflow-hidden">
                  <Link href="#" className="icon-arrow "></Link>
                </li>
              </ul>
            </div>
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
      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-button">Previous</button>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-button">Next</button>
      </div>
    </section>
  );
};

export default FeaturedProductSection;
