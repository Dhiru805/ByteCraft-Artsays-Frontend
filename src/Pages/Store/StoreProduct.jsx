import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ProductContext } from '../../Contexts/ProductProvider';
import StoreCarousl from "./Storeupper"
// import './StoreProduct.css';
import './Clone.css'
import { getProducts } from '../../Component/redux/action/action';
import { addToCart} from "../../Component/redux/action/cartaction";
import { useDispatch, useSelector } from 'react-redux';
const Store = () => {
  const { product, addToCartFromStore, addToWishlist, currency, convertPrice, getSymbol } = useContext(ProductContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [unit, setUnit] = useState('in');
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [width, setWidth] = useState({ in: '', cm: '' });
  const [height, setHeight] = useState({ in: '', cm: '' });
  const dispatch =useDispatch();
  const [selectedSort, setSelectedSort] = useState('Default sorting');
  // const { cartItems, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProducts()); // Dispatch the action to fetch products
    // dispatch(getCart());
  }, [dispatch]);
  
  const { products } = useSelector(state => state.getproductsdata); // Correct destructuring
  console.log(products);
  const sortedProducts = [...products].sort((a, b) => {
    switch (selectedSort) {
      case 'Low to High':
        return a.newPrice - b.newPrice; // Ascending price
      case 'High to Low':
        return b.newPrice - a.newPrice; // Descending price
      case 'Newest First':
        return new Date(b.createdAt) - new Date(a.createdAt); // Latest product
      default:
        return 0; // Default order (no sorting)
    }
  });

  const handleSortChange = (event, sortOption) => {
    event.preventDefault();
    setSelectedSort(sortOption);
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId)); // Add product to cart
};

  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 992);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleCustomSize = () => {
    setShowCustomSize(!showCustomSize);
  };

  const convertUnits = (value, fromUnit, toUnit) => {
    if (fromUnit === 'in' && toUnit === 'cm') {
      return (value * 2.54).toFixed(2);
    } else if (fromUnit === 'cm' && toUnit === 'in') {
      return (value / 2.54).toFixed(2);
    }
    return value;
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    if (newUnit === 'cm') {
      setWidth({ cm: width.in ? convertUnits(width.in, 'in', 'cm') : '', in: width.in });
      setHeight({ cm: height.in ? convertUnits(height.in, 'in', 'cm') : '', in: height.in });
    } else if (newUnit === 'in') {
      setWidth({ in: width.cm ? convertUnits(width.cm, 'cm', 'in') : '', cm: width.cm });
      setHeight({ in: height.cm ? convertUnits(height.cm, 'cm', 'in') : '', cm: height.cm });
    }
    setUnit(newUnit);
  };

  const handleWidthChange = (e) => {
    const value = e.target.value;
    if (unit === 'in') {
      setWidth({ in: value, cm: value ? convertUnits(value, 'in', 'cm') : '' });
    } else {
      setWidth({ cm: value, in: value ? convertUnits(value, 'cm', 'in') : '' });
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (unit === 'in') {
      setHeight({ in: value, cm: value ? convertUnits(value, 'in', 'cm') : '' });
    } else {
      setHeight({ cm: value, in: value ? convertUnits(value, 'cm', 'in') : '' });
    }
  };

  const artists = [
    "Artists You Follow",
    "Alec Egan",
    "Alejandro Cardenas",
    "Alex Da Corte",
    "Alex Gardner",
    "Alex Katz",
    "Alicia Viebrock",
    "Artists You Follow",
    "Alec Egan",
    "Alejandro Cardenas",
    "Alex Da Corte",
    "Alex Gardner",
  ];
  const displayedArtists = showMore ? artists : artists.slice(0, 7);

  const material = [
    "Acrylic",
    "Aluminum",
    "Aquatint",
    "Art paper",
    "Brass",
    "Bronze",
    "C-print",
    "Canvas",
    "Clay",
    "Copper",
    "Gold",
    "Wood",
  ];
  const displayedMaterial = showMore ? material : material.slice(0, 7);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 576) {
        setItemsPerPage(26);
      } else if (window.innerWidth >= 576 && window.innerWidth < 992) {
        setItemsPerPage(28);
      } else {
        setItemsPerPage(30);
      }
    };


    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  const handleMinChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const [pintingType, setPintingType] = useState('');

  const handlePintingTypeChange = (event) => {
    setPintingType(event.target.value);
  };

  const [isListView, setIsListView] = useState(false);
  const toggleView = () => {
    setIsListView(!isListView);
  };


  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

  const tags = ['Plant', 'Floor', 'Indoor', 'Green', 'Healthy', 'Outdoor'];
  const [activeIndices, setActiveIndices] = useState([]);

  const handleClick = (index) => {
    if (activeIndices.includes(index)) {
      // Remove the index if it's already active
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      // Add the index if it's not active
      setActiveIndices([...activeIndices, index]);
    }
  };

 
  return (
    <div id="pageWrapper" >
      <main>
        {/* <Breadcrumb /> */}
        <StoreCarousl/>
        <div className="twoColumns abtSecHolder pt-lg-10 pb-lg-20 pt-md-16 pb-md-4 mt-5">
          <div className="row ml-0 mr-0">
            <div className="col-12 col-lg-9 order-lg-3 store-wrapper pr-1">
              <article id="content">
                <header className="show-head d-flex flex-wrap justify-content-between">
                  <ul className="list-unstyled viewFilterLinks d-flex flex-nowrap align-items-center">
                    <li className="mr-2 fas fa-filters">
                      <a href="#" onClick={toggleSidebar}>
                        <i className="fas fa-filter"></i>
                      </a>
                    </li>
                    <li className="mr-2 store-list ">
                      <a href="#" onClick={() => setIsListView(false)}>
                        <i className="fas fa-th-large"></i>
                      </a>
                    </li>
                    <li className="mr-2 store-list">
                      <a href="#" onClick={() => setIsListView(true)}>
                        <i className="fas fa-list" ></i>
                      </a>
                    </li>

                    <li className="mr-2">Showing {firstIndex + 1}–{Math.min(lastIndex, filteredProducts.length)} of {filteredProducts.length} results</li>
                  </ul>
                  {/* Sort by dropdown */}
                  <div className="sortGroup ">
                    <div className="d-flex flex-nowrap align-items-center">
                      <strong className="groupTitle mr-2">Sort by:</strong>
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle buttonReset "
                          type="button"
                          id="sortGroup"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {selectedSort}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="sortGroup">
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'Relevance')}>
                              Relevance
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'Low to High')}>
                              Price-- Low to High
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'High to Low')}>
                              Price-- High to Low
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'Newest First')}>
                              Newest First
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </header>
                {
                  isListView ? (
                    <div className=' p-2'>
                      {products.map((product, index) => (
                        <div className='d-flex w-100 image-description-box' key={index}>
                          <div className='col-3 p-1 d-flex align-items-center'>
                            <div className='img-holder'>
                              <img src={product.images[0]} alt={product.productName} className='img-art' />
                            </div>
                          </div>
                          <div className='col-6 p-1 pl-3 pr-3   '>
                            <div className='image-description p-2'>
                              <h2 className='headingVII fwEbold font-size-title mb-1 pt-1 pb-1 pl-0'>{product.productName}</h2>
                              <div className='rating'>
                                <i className="fa fa-star" aria-hidden="true"></i>
                                <i className="fa fa-star" aria-hidden="true"></i>
                                <i className="fa fa-star" aria-hidden="true"></i>
                                <i className="fa fa-star" aria-hidden="true"></i>
                                .  4.0
                              </div>
                              <div>
                                <ul className=''>
                                  <li className='ml-0'>ljadjaj</li>
                                  <li className='ml-0'>ygdih ajhfiin sfia</li>
                                  <li className='ml-0'>sSYDJSHJHFSK SJSHFKSJKJF SBSFJNLA BFKAJK</li>
                                  <li className='ml-0'>SSJSFIAEJF AIHFIEFBE 56A JHFHEF FEJ</li>
                                  <li className='ml-0'>SSJSFIAEJF AIHFIEFBE 56A JHFHEF FEJ</li>
                                  <li className='ml-0'> AFEUFHEB ADFNAKjskajd  jfkjfnn jngnjbk kjgnffk gskng andfj</li>
                                  <li className='ml-0'> AFEUFHEB ADFNAKjskajd  jfkjfnn jngnjbk kjgnffk gskng andfj</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className='col-3 p-1 pl-3 pr-3 '>
                            <div className='p-2'>
                              {/* <div className='new-price fwEbold '>₹{product.newPrice}</div> */}
                              {product.oldPrice ? (
                                <span className="price block fwEbold " data-currency={currency} data-price={convertPrice(product.newPrice)}>
                                  <span className='cards-price store-price'>{getSymbol()}{convertPrice(product.newPrice).toFixed(2)}</span>
                                  <del className='ml-2 store-old-price' data-currency={currency} data-price={convertPrice(product.newPrice)}>
                                    {getSymbol()}{convertPrice(product.oldPrice).toFixed(2)}
                                  </del>
                                </span>
                              ) : (
                                <span className="cards-price fwEbold store-price" data-currency={currency} data-price={convertPrice(product.newPrice)}>
                                  {getSymbol()}{convertPrice(product.newPrice).toFixed(2)}
                                </span>
                              )}
                              <div className="shop-now-btnn">
                                <Link
                                  to="#"
                                  className="btn btnTheme  fwEbold text-white rounded p-2 pl-3 pr-3 mb-2 mt-2 bgcol"
                                >
                                  Order Now <i className="fas fa-arrow-right "></i>
                                </Link>
                                <Link
                                  to="#"
                                  className="btn btnTheme  fwEbold text-white rounded p-2 pl-3 pr-3 mb-2 bgcol"
                                >
                                  Add To Cart
                                  <i className="fas fa-arrow-right "></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="image-collectiones store-card">
                      {sortedProducts.map((product) => (
                        <div className="cardes" key={product.productId}>
                          <div className="ImageHolderes">
                            <NavLink to={`/product-details/${product.productId}`}>
                              <img src={product.images[0]} alt={product.productName} className="cards-images" />
                            </NavLink>
                            <ul className="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                              <li className="overflow-hidden"><Link className="icon-heart " onClick={() => addToWishlist(product)} ></Link></li>
                              <li className="overflow-hidden"><Link className="icon-cart " onClick={() => handleAddToCart(product._id)} ></Link></li>  
                              {/* onClick={() => handleAddToCart(product.productId)} */}
                              {/* onClick={() => addToCartFromStore(product, 'L')} */}
                              <li className="overflow-hidden"><a className="icon-eye "></a></li>
                              <li className="overflow-hidden"><a className="icon-arrow "></a></li>
                            </ul>
                          </div>
                          <div className="cards-contentss store-card">
                            <NavLink to={`/product-details`}>
                              <h5 className="store-cards-title mb-2">{product.productName}</h5>
                            </NavLink>
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
                              <span className='store-img-size-span'>{product.size} cm</span>
                            </div>
                            </div>
                            <div className='store-rating mb-2 d-flex  '>
                              <div className='store-artist'>Artist : </div>
                              <span className='pl-1 store-artist-name'>{product.paintedBy}</span>
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
                  )
                }

                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center p-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-items ${i + 1 === currentPage ? 'active' : ''}`}>
                        <a className="page-links" href="#" onClick={() => handlePagination(i + 1)}>
                          {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                {/* Product cards and pagination */}
              </article>
            </div>
            <div className=" col-lg-3 order-lg-1 pl-1">
              <aside id="sidebar" className={isSidebarVisible ? "visible" : "hidden"}>
                {/* Sidebar content */}
                <button
                  className={`sidebar-back-button ${isSidebarVisible ? 'hidden' : 'visible'}`}
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-chevron-circle-left"></i>
                </button>
                <section className="widget overflow-hidden mb-9 search-top">
                  <form
                    action="#"
                    className="searchForm position-relative border "
                    onSubmit={(e) => e.preventDefault()}
                  >

                    <input
                      type="search"
                      className="form-controls store-search "
                      placeholder="Search product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="position-absolute"><i className="icon-search"></i></button>

                  </form>
                </section>
                <section className="widget overflow-hidden mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">PRODUCT CATEGORIES</h3>
                  <ul className="list-unstyled categoryList mb-0">
                    <li className="mb-5 overflow-hidden"><a href="#">Dried <span className="num border float-right">6</span></a></li>
                    <li className="mb-5 overflow-hidden"><a href="#">Vegetables <span className="num border float-right">8</span></a></li>
                    <li className="mb-4 overflow-hidden"><a href="#">Fruits <span className="num border float-right">9</span></a></li>
                  </ul>
                </section>
                <section className="widget overflow-hidden mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">Artists</h3>
                  <ul className="list-unstyled categoryList mb-0">
                    {displayedArtists.map((artist, index) => (
                      <li key={index} className="mb-4 overflow-hidden">
                        <label>
                          <input type="checkbox" className="mr-2 artist-checkbox" />
                          {artist}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <a href="#" className="show-more" onClick={(e) => { e.preventDefault(); setShowMore(!showMore); }}>{showMore ? "Show less" : "Show more"}</a>
                </section>
                <section className="widget overflow-hidden mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">Price</h3>
                  <div className="range-slider">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={maxPrice}
                      onChange={handleMaxChange}
                      className="filter"
                    />
                  </div>
                  <div className="price-inputs">
                    <div className={`price-input-group ${minPrice ? 'has-value' : ''}`}>
                      <input
                        type="number"
                        value={minPrice || ''}
                        onChange={handleMinChange}
                        className="price-input rounded"
                      />
                      <label className="placeholder ">Min</label>
                      <span className="currency mr-2">₹INR</span>
                    </div>
                    <div className={`price-input-group ${maxPrice ? 'has-value' : ''}`}>
                      <input
                        type="number"
                        value={maxPrice || ''}
                        onChange={handleMaxChange}
                        className="price-input rounded"
                      />
                      <label className="placeholder mb-0">Max</label>
                      <span className="currency">₹INR</span>
                    </div>
                  </div>
                  <div className="price-range">
                    <span>₹{minPrice || 0}</span> - <span>{maxPrice >= 50000 ? '50000+' : `₹${maxPrice || 0}`}</span>
                  </div>
                </section>
                <section className="widget overflow-hidden mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">Size</h3>
                  <p className="description">This is based on the artwork's average dimension.</p>
                  <div className="unit-selection mb-4 tab-radio-group">
                    <label className={`rounded mr-3 ${unit === 'cm' ? 'radio-background' : ''}`}>
                      <input
                        type="radio"
                        name="unit"
                        value="cm"
                        className="unit-radio"
                        onChange={handleUnitChange}
                        checked={unit === 'cm'}
                      />
                      <span>cm</span>
                    </label>
                    <label className={`rounded ${unit === 'in' ? 'radio-background' : ''}`}>
                      <input
                        type="radio"
                        name="unit"
                        value="in"
                        className="unit-radio"
                        onChange={handleUnitChange}
                        checked={unit === 'in'}
                      />
                      <span>in</span>
                    </label>
                  </div>
                  <div className="size-options">
                    <label>
                      <input type="checkbox" name="size" value="small" className="size-checkbox" />
                      <span>Small (under 16{unit})</span>
                    </label>
                    <label>
                      <input type="checkbox" name="size" value="medium" className="size-checkbox" />
                      <span>Medium (16{unit} – 40{unit})</span>
                    </label>
                    <label>
                      <input type="checkbox" name="size" value="large" className="size-checkbox" />
                      <span>Large (over 40{unit})</span>
                    </label>
                  </div>
                  <button className="custom-size-btn" onClick={toggleCustomSize}>
                    {showCustomSize ? 'Hide custom size' : 'Show custom size'}
                  </button>

                  {showCustomSize && (
                    <div className="custom-size-section">
                      <div className="custom-size-inputs">
                        <div className="input-group justify-content-center">
                          <div className='mr-5'>Width</div>
                          <input
                            type="number"
                            className="custom-input "
                            placeholder="Width"
                            value={width[unit]}
                            onChange={handleWidthChange}
                          />
                          <span className="unit-label ml-0">{unit}</span>
                          {/* <input
                            type="number"
                            className="custom-input"
                            placeholder="Width"
                            value={width[unit]}
                            onChange={handleWidthChange}
                          />
                          <span className="unit-label">{unit}</span> */}
                        </div>
                        <div className="input-group justify-content-center">
                          <div className='mr-4'>Height</div>
                          <input
                            type="number"
                            className="custom-input"
                            placeholder="Height"
                            value={height[unit]}
                            onChange={handleHeightChange}
                          />
                          <span className="unit-label ml-0">{unit}</span>
                          {/* <input
                            type="number"
                            className="custom-input"
                            placeholder="Height"
                            value={height[unit]}
                            onChange={handleHeightChange}
                          />
                          <span className="unit-label">{unit}</span> */}
                        </div>
                        <button className="set-size-btn">Set size</button>
                      </div>
                    </div>
                  )}
                </section>
                <section className="widget overflow-hidden mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">Select Your Preference</h3>
                  <div className="unit-selection tab-radio-group mb-0">
                    <label className={`mr-3 rounded ${pintingType === 'Original' ? 'radio-background' : ''}`}>
                      <input
                        type="radio"
                        name="pintingType"
                        value="Original"
                        className="pinting-Type"
                        onChange={handlePintingTypeChange}
                        checked={pintingType === 'Original'}
                      />
                      <span>Original</span>
                    </label>
                    <label className={`rounded ${pintingType === 'Copy' ? 'radio-background' : ''}`}>
                      <input
                        type="radio"
                        name="pintingType"
                        value="Copy"
                        className="pinting-Type"
                        onChange={handlePintingTypeChange}
                        checked={pintingType === 'Copy'}
                      />
                      <span>Copy</span>
                    </label>
                  </div>
                </section>
                <section className="widget overflow-hidden mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">Material</h3>
                  <ul className="list-unstyled categoryList mb-0">
                    {displayedMaterial.map((material, index) => (
                      <li key={index} className="mb-4 overflow-hidden">
                        <label>
                          <input type="checkbox" className="mr-2 artist-checkbox" />
                          {material}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <a href="#" className="show-more" onClick={(e) => { e.preventDefault(); setShowMore(!showMore); }}>{showMore ? "Show less" : "Show more"}</a>
                </section>

                <section className="widget mb-9">
                  <h3 className="headingVII fwEbold text-uppercase mb-5">Product Tags</h3>
                  <div className="tag-nav d-flex flex-wrap mb-0">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`mt-1 mb-1  mr-2 tag-name text-center pt-1 pb-1 pl-2 pr-2 ${activeIndices.includes(index) ? 'active' : ''}`}
                        onClick={() => handleClick(index)}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Store;
