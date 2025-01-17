import React, { useState,useEffect,useRef } from "react";
import "./storedetails.css";
import { Link } from "react-router-dom";
import ShareButton from "../Product-Details/Sub-product-detail-component/ShareButton";
import Productreview from "../Product-Details/Sub-product-detail-component/Productreview";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { ImEye } from "react-icons/im";

import PropTypes from "prop-types";

import ProductDiscription from "../Product-Details/Sub-product-detail-component/ProductDiscription";
import AdditionalproductInfo from "../Product-Details/Sub-product-detail-component/AdditionalproductInfo";

const StoreDetails = () => {
  const [paintingDimensions, setPaintingDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [activeTab, setActiveTab] = useState(1);
  const [mainImage, setMainImage] = useState("images/img58.jpg");
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const [sizeTab, setSizeTab] = useState(1);
  const [unit, setUnit] = useState("inches");
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [postalCode, setPostalCode] = useState("");
  const [stockStatus, setStockStatus] = useState("Out of stock in this area");
  const [isPostalCodeEntered, setIsPostalCodeEntered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artworkPosition, setArtworkPosition] = useState({ left: 0, top: 0 });
  
  // const [isClicked, setIsClicked] = useState(false);

  const imageThumbnails = [
    "images/img58.jpg",
    "images/img59.jpg",
    "images/img60.jpg",
    "images/img61.jpg",
  ];

  const handleTabClick = (tabIndex) => setActiveTab(tabIndex);
  const handleImageClick = (image) => setMainImage(image);
  const [qty, setQty] = useState(1); // Adding state to manage quantity
  const handleMouseEnter = () => setZoomVisible(true);
  const handleMouseLeave = () => setZoomVisible(false);
  const handleMouseMove = (e) => {
    const { top, left, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    const lensX = e.pageX - left - 50;
    const lensY = e.pageY - top - 50;

    setZoomPosition({ x, y });
    setLensPosition({ x: lensX, y: lensY });
  };

  const handleSizeTabClick = (tabIndex) => setSizeTab(tabIndex);
  const handleUnitChange = (e) => setUnit(e.target.value);
  const [activeButton, setActiveButton] = useState("");

  const dimensions = {
    inches: "12 × 10 in | 30.5 × 25.4 cm",
    centimeters: "30.5 × 25.4 cm | 12 × 10 in",
  };

  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  const handlePostalCodeSubmit = () => {
    // Mock check: In this example, let's assume postal codes starting with '12' are in stock
    if (postalCode.startsWith("12")) {
      setIsPostalCodeEntered(true);
      setStockStatus("In stock in this area");
    } else {
      setIsPostalCodeEntered(true);
      setStockStatus("Out of stock in this area");
    }
  };
  const handleQtyChange = (e) => {
    setQty(e.target.value);
  };

  const QtyField = ({ name, value, onChange }) => {
    const qtyControl = (qty) =>
      onChange({
        target: {
          name,
          type: "radio",
          value: qty < 1 ? 1 : qty,
        },
      });

    return (
      <InputGroup className="ezy__epoverview2-qty d-inline-flex mb-2">
        <Button
          variant=""
          className="px-4"
          type="button"
          onClick={() => qtyControl(parseInt(value) - 1)}
        >
          -
        </Button>
        <input
          type="number"
          placeholder=""
          className="input-QTY"
          value={value}
          onChange={(e) => qtyControl(parseInt(e.target.value))}
        />
        <Button
          variant=""
          className="px-4"
          type="button"
          onClick={() => qtyControl(parseInt(value) + 1)}
        >
          +
        </Button>
      </InputGroup>
    );
  };

  QtyField.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
  };

  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue);
  };

  // Select all buttons with the class 'button'
  const buttons = document.querySelectorAll(".button");

  // Function to handle the click event
  function handleClick(event) {
    const button = event.currentTarget;

    // Remove 'deactivate' class if it exists
    if (button.classList.contains("deactivate")) {
      button.classList.remove("deactivate");
    }

    // Add 'deactivate' class if 'active' class exists
    if (button.classList.contains("active")) {
      button.classList.add("deactivate");
    }

    // Toggle 'animate', 'active', and 'inactive' classes
    button.classList.toggle("animate");
    button.classList.toggle("active");
    button.classList.toggle("inactive");
  }

  // Attach click event listeners to all buttons
  buttons.forEach((button) => {
    button.addEventListener("click", handleClick);
  });

 
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(8); // Default scale to 8ft
  const [customWidth, setCustomWidth] = useState(8); // Default custom width in ft
  const [customHeight, setCustomHeight] = useState(8); // Default custom height in ft
  const mainRoomImageHolderRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCustomSizeChange = (width, height) => {
    setCustomWidth(width);
    setCustomHeight(height);

    // Adjust scale based on the new size relative to the default size (e.g., 8ft)
    const newScale = Math.min(width / 8, height / 8); // Scale relative to 8ft size
    setScale(newScale);
  };

  // Function to dynamically adjust scale based on screen width
  const adjustScaleBasedOnScreenSize = () => {
    const screenWidth = window.innerWidth;

    // Define dynamic scaling: smaller screen widths will result in smaller scales
    const newScale = Math.max(2, (screenWidth / 1700) * 7); // Adjusted to keep default scale to 8ft

    setScale(newScale);
  };

  useEffect(() => {
    // Initial scale adjustment
    adjustScaleBasedOnScreenSize();

    // Add event listener for screen resize
    window.addEventListener('resize', adjustScaleBasedOnScreenSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', adjustScaleBasedOnScreenSize);
    };
  }, []);

  return (
    <>
      <div className="product-details">
        <div className="product-showcase">
          <div className="twoColumns container-store pt-xl-23 pb-xl-20 pt-lg-20 pb-lg-20 py-md-16 py-10">
            <div className="row mb-6 first-section-product ">
              <div className="col-12 col-lg-6 order-lg-1">
                <div className="mb-lg-0 mb-4 image-container">
                  <div
                    className="main-image-container"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a className="button one inactive heart-icon">
                      <div className="btn__effect">
                        <svg
                          className="heart-stroke icon-svg icon-svg--size-4 icon-svg--color-silver"
                          width="48"
                          height="16"
                          viewBox="20 18 29 28"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M28.3 21.1a4.3 4.3 0 0 1 4.1 2.6 2.5 2.5 0 0 0 2.3 1.7c1 0 1.7-.6 2.2-1.7a3.7 3.7 0 0 1 3.7-2.6c2.7 0 5.2 2.7 5.3 5.8.2 4-5.4 11.2-9.3 15a2.8 2.8 0 0 1-2 1 3.4 3.4 0 0 1-2.2-1c-9.6-10-9.4-13.2-9.3-15 0-1 .6-5.8 5.2-5.8m0-3c-5.3 0-7.9 4.3-8.2 8.5-.2 3.2.4 7.2 10.2 17.4a6.3 6.3 0 0 0 4.3 1.9 5.7 5.7 0 0 0 4.1-1.9c1.1-1 10.6-10.7 10.3-17.3-.2-4.6-4-8.6-8.4-8.6a7.6 7.6 0 0 0-6 2.7 8.1 8.1 0 0 0-6.2-2.7z"></path>
                        </svg>
                        <svg
                          className="heart-full icon-svg icon-svg--size-4 icon-svg--color-blue"
                          width="48"
                          height="16"
                          viewBox="0 0 19.2 18.5"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M9.66 18.48a4.23 4.23 0 0 1-2.89-1.22C.29 10.44-.12 7.79.02 5.67.21 2.87 1.95.03 5.42.01c1.61-.07 3.16.57 4.25 1.76A5.07 5.07 0 0 1 13.6 0c2.88 0 5.43 2.66 5.59 5.74.2 4.37-6.09 10.79-6.8 11.5-.71.77-1.7 1.21-2.74 1.23z"></path>
                        </svg>
                        <svg
                          className="broken-heart"
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="16"
                          viewBox="5.707 17 48 16"
                        >
                          <g fill="#dc3545">
                            <path
                              className="broken-heart--left"
                              d="M29.865 32.735V18.703a4.562 4.562 0 0 0-3.567-1.476c-2.916.017-4.378 2.403-4.538 4.756-.118 1.781.227 4.006 5.672 9.737a3.544 3.544 0 0 0 2.428 1.025l-.008-.008.013-.002z"
                            />
                            <path
                              className="broken-heart--right"
                              d="M37.868 22.045c-.135-2.588-2.277-4.823-4.697-4.823a4.258 4.258 0 0 0-3.302 1.487l-.004-.003v14.035a3.215 3.215 0 0 0 2.289-1.033c.598-.596 5.882-5.99 5.714-9.663z"
                            />
                          </g>
                          <path
                            className="broken-heart--crack"
                            fill="none"
                            stroke=""
                            strokeMiterlimit="10"
                            d="M29.865 18.205v14.573"
                          />
                        </svg>
                        <div className="effect-group">
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                          <span className="effect"></span>
                        </div>
                      </div>
                    </a>




                    <div className="view-in-room">
      <button onClick={openModal} className="button-view-in-room">
        <ImEye /> View in Room
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src="artimages/pngtree-white-couch-on-red-wall-interior-design-image_15623080.webp"
              alt="Room view"
              className="room-image-main"
            />
            <div className="main-room-image-holder" ref={mainRoomImageHolderRef}>
              <img
                src="artimages/product9.jpg"
                alt="Main view in room"
                className="room-image-painting"
                style={{
                  transform: `scale(${scale / 8})`, // Adjust the scaling based on the scale value
                }}
              />
              {/* <div className="scale-of-image">{`${scale.toFixed(1)}ft`}</div> */}
              <div className="scale-of-image">8ft</div>
            </div>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>

                    <img
                      src={mainImage}
                      alt="Main product"
                      className="img-fluid main-image-width"
                    />
                    {zoomVisible && (
                      <div
                        className="zoom-lens"
                        style={{
                          top: `${lensPosition.y}px`,
                          left: `${lensPosition.x}px`,
                        }}
                      />
                    )}
                  </div>
                  <div className="thumbnail-row mt-3 ">
                    {imageThumbnails.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="thumbnail-img"
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 order-lg-3">
                <div className="productTextHolder  pt-0">
                  <div className="name-share-container">
                    <h2 className="fwEbold mb-1  pl-0 ml-0 m-1">
                      Pellentesque aliquet
                    </h2>
                    <ShareButton
                      url="https://yourwebsite.com"
                      title="Check this product!"
                    />
                  </div>

                  <strong className="price d-block mb-1 text-green m-1">
                    ₹65.00
                  </strong>
                  <p className="mb-2 m-1">
                    Aenean id ullamcorper libero. Vestibulum imperdiet nibh.
                    Lorem ullamcorper volutpat. Vestibulum lacinia risus.
                  </p>

                  <div className="size-tab-containers list-unstyled sizeList d-flex flex-wrap mb-2 h-10">
                    <div className="size-main-tab-containers">
                      <ul className="tab-buttons list-unstyled d-flex pl-0 ">
                        <li
                          className={`tab-item ${
                            sizeTab === 1 ? "active" : ""
                          } mr-4 m-1`}
                          onClick={() => handleSizeTabClick(1)}
                        >
                          Tab 1
                        </li>
                        <li
                          className={`tab-item ${
                            sizeTab === 2 ? "active" : ""
                          } mr-4 m-1`}
                          onClick={() => handleSizeTabClick(2)}
                        >
                          Tab 2
                        </li>
                      </ul>
                      <div className="tab-panel d-flex pl-0">
                        <div className="unit-selector m-1">
                          <label htmlFor="unit" className="label-dropdown-unit">
                            Select Unit:{" "}
                          </label>
                          <select
                            id="unit-tab2"
                            value={unit}
                            onChange={handleUnitChange}
                          >
                            <option value="inches">Inches</option>
                            <option value="centimeters">Centimeters</option>
                          </select>
                        </div>

                        <div className="QTY-main-container">
                          <div className="m-1 ml-4 d-flex align-items-center QTY-inner-container">
                            <label className="m-1 ezy__epoverview2-title mb-2">
                              QTY:
                            </label>
                            <QtyField
                              name="quantity"
                              value={qty}
                              onChange={handleQtyChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tab-content-unit">
                        {sizeTab === 1 && (
                          <p className="m-1">{dimensions[unit]}</p>
                        )}
                        {sizeTab === 2 && (
                          <div className="tab-panel p-1">
                            <button
                              className={`size-buttons ${
                                activeButton === "item1" ? "active" : ""
                              }`}
                              onClick={() => handleButtonClick("item1")}
                            >
                              {unit === "inches" ? "12×16 in" : "30.5×40.6 cm"}
                            </button>
                            <button
                              className={`size-buttons ${
                                activeButton === "item2" ? "active" : ""
                              }`}
                              onClick={() => handleButtonClick("item2")}
                            >
                              {unit === "inches" ? "12×16 in" : "30.5×40.6 cm"}
                            </button>
                            <button
                              className={`size-buttons ${
                                activeButton === "item3" ? "active" : ""
                              }`}
                              onClick={() => handleButtonClick("item3")}
                            >
                              {unit === "inches" ? "12×16 in" : "30.5×40.6 cm"}
                            </button>
                            <button
                              className={`size-buttons ${
                                activeButton === "item4" ? "active" : ""
                              }`}
                              onClick={() => handleButtonClick("item4")}
                            >
                              {unit === "inches" ? "12×16 in" : "30.5×40.6 cm"}
                            </button>
                            <button
                              className={`size-buttons ${
                                activeButton === "item5" ? "active" : ""
                              }`}
                              onClick={() => handleButtonClick("item5")}
                            >
                              {unit === "inches" ? "12×16 in" : "30.5×40.6 cm"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="holder overflow-hidden d-flex flex-wrap mb-2  flex-column justify-content-center align-content-start p-1">
                    <div className="order-continer d-flex">
                      <div className="shop-now-btn">
                        <Link
                          to="#"
                          className="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4 m-1"
                        >
                          Order Now <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                        <Link
                          to="#"
                          className="btn btnTheme btnShop fwEbold text-white md-round py-3 px-4 py-md-3 px-md-4 m-1"
                        >
                          Add To Cart{" "}
                          <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                      </div>

                      <div className="postal-code-container mb-4">
                        <label
                          htmlFor="postal-code-input"
                          className="postal-code-input"
                        >
                          <label className="zip-text-main"> Postal code:</label>

                          <div className="input-zip-code">
                            <div className="input-and-btn">
                              <input
                                type="text"
                                id="postal-code-input"
                                value={postalCode}
                                onChange={handlePostalCodeChange}
                                className=""
                              />
                              <button
                                onClick={handlePostalCodeSubmit}
                                className="postal-code-button"
                              >
                                Check
                              </button>
                            </div>
                          </div>
                        </label>
                        {isPostalCodeEntered && (
                          <p className="stock-status m-0">{stockStatus}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <ul className="list-unstyled productInfoDetail mb-2 overflow-hidden">
                    <li className="mb-1 productinfoDetail-shippingtax">
                      <span className="p-1 m-1 Shipping-tax">
                        {" "}
                        Shipping tax:{" "}
                      </span>
                      <span className="p-1 m-1">Free</span>
                    </li>
                  </ul>
                  <ul className="list-unstyled productInfoDetail mb-0">
                    <li className="mb-1 categories-of-product">
                      <span className=" p-1 m-1 "> Categories:</span>{" "}
                      <Link className="p-1 m-1" href="#">
                        Butter &amp; Eggs,
                      </Link>{" "}
                      <Link className="p-1 m-1" href="#">
                        Fruits,
                      </Link>{" "}
                      <Link className="p-1 m-1" href="#">
                        Milk &amp; Cream,
                      </Link>{" "}
                    </li>
                    <li className="mb-1 tags-of-product">
                      <span className=" p-1 m-1 "> Tags:</span>
                      <Link className="p-1 m-1" href="#">
                        organic food
                      </Link>{" "}
                      <Link className="p-1 m-1" href="#">
                        fruits,
                      </Link>
                      <Link className="p-1 m-1" href="#">
                        juice
                      </Link>
                    </li>
                    <li className="mb-2 Art-type">
                      <span className=" p-1 m-1 ">Type</span>{" "}
                      <Link className="p-1 m-1" href="#">
                        KFC
                      </Link>
                    </li>
                  </ul>
                </div>
                {zoomVisible && (
                  <div className="zoom-container">
                    <img
                      src={mainImage}
                      alt="Zoomed product"
                      className="zoom-image"
                      style={{
                        top: `-${zoomPosition.y * 1}%`,
                        left: `-${zoomPosition.x * 1}%`,
                        transform: `scale(1)`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="row ml-10 main-tab-discription">
              <div className="tab-container">
                <div className="tab-container-main p-5">
                  <ul className="tab-buttons list-unstyled ">
                    <li
                      className={`tab-item ${
                        activeTab === 1 ? "active" : ""
                      } mr-4 font-xl-large`}
                      onClick={() => handleTabClick(1)}
                    >
                      Description
                    </li>
                    <li
                      className={`tab-item ${
                        activeTab === 2 ? "active" : ""
                      } mr-4 font-xl-large`}
                      onClick={() => handleTabClick(2)}
                    >
                      Reviews
                    </li>
                    <li
                      className={`tab-item ${
                        activeTab === 3 ? "active" : ""
                      } mr-4 font-xl-large`}
                      onClick={() => handleTabClick(3)}
                    >
                      Artist Information
                    </li>
                  </ul>
                  <div className="tab-content m-1">
                    {activeTab === 1 && (
                      <div className="tab-panel p-1">
                        <ProductDiscription />
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div className="tab-panel">
                        <Productreview />
                      </div>
                    )}
                    {activeTab === 3 && (
                      <div className="tab-panel">
                        <AdditionalproductInfo />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container p-5 m-2">
              <div className="row pl-6 pb-1 pt-1 pr-1 related-tags-main">
                <div className="col-12 p-1">
                  <div>
                    <div className="related-tags ">
                      <h4 className="related-tags-title">Related Tags</h4>
                      <ul className="related-tags-list list-unstyled d-flex flex-wrap">
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/organic-food"
                            className="related-tag-link"
                          >
                            Organic Food
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link to="/tag/fruits" className="related-tag-link">
                            Fruits
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/vegetables"
                            className="related-tag-link"
                          >
                            Vegetables
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link to="/tag/dairy" className="related-tag-link">
                            Dairy
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                        <li className="related-tag-item mr-5 mt-butt">
                          <Link
                            to="/tag/gluten-free"
                            className="related-tag-link"
                          >
                            Gluten-Free
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="related-tags"></div>
      </div>
    </>
  );
};

export default StoreDetails;
