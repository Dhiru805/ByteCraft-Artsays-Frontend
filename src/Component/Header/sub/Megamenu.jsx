import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Transition } from "react-transition-group";
import "./Megamenu.css";
import { content } from "../../../server/ContentData";

const images = [
  "artimages/product1.webp",
  "artimages/product2.webp",
  "artimages/product3.webp",
];

const MegaMenu = forwardRef(({ isOpen }, ref) => {
  const nodeRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Banking");
  const [isHoveredOnColumns, setIsHoveredOnColumns] = useState(false); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);
  const [tabChangeKey, setTabChangeKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("Banking");
    }
  }, [isOpen]);

  useEffect(() => {
    setTabChangeKey((prevKey) => prevKey + 1);
    setContentChanged(true);
  }, [activeTab]);

  useEffect(() => {
    if (contentChanged) {
      const timer = setTimeout(() => {
        setContentChanged(false);
      }, 1000); // Match with animation duration
      return () => clearTimeout(timer);
    }
  }, [contentChanged]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll fast
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const container = scrollContainerRef.current;
    container.addEventListener("wheel", handleWheel);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDragging, startX, scrollLeft]);

  const handleTabMouseEnter = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setContentChanged(true);
    }
  };

  const handleColumnsMouseEnter = () => {
    setIsHoveredOnColumns(true);
  };

  const handleColumnsMouseLeave = () => {
    setIsHoveredOnColumns(false);
    setSelectedItem(null);
  };

  const handleItemMouseEnter = (item) => {
    setSelectedItem(item);
  };

  const scrollLeftHandler = () => {
    scrollContainerRef.current.scrollLeft -= 200;
  };

  const scrollRightHandler = () => {
    scrollContainerRef.current.scrollLeft += 200;
  };

  const handleMouseDown = (e) => {
    if (e.touches || e.button !== 0) return; // Prevent touch and non-left click dragging
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll fast
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const tabContent = content[activeTab] || {
    heading: "",
    items1: [],
    items2: [],
  };

  const renderContent = () => {
    if (selectedItem) {
      return (
        <div className="selected-item-details ">
          <h3>{selectedItem.name}</h3>
          <p>{selectedItem.description}</p>
        </div>
      );
    }
    return (
      <div className="slider-container">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Promotion ${index + 1}`}
            className={`promo-image ${
              index === currentImageIndex ? "active" : ""
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mega-menu-container">
      <Transition in={isOpen} timeout={300} nodeRef={nodeRef}>
        {(state) => (
          <div ref={nodeRef} className={`dropdown-container ${state}`}>
            <div className="carousel-container-megamenu">
              <button className="scroll1-btn left ml-2" onClick={scrollLeftHandler}>
                &#x276E;
              </button>
              <div
                className="tabs-container"
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {Object.keys(content).map((tab) => (
                  <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? "active" : ""}`}
                    onMouseEnter={() => handleTabMouseEnter(tab)}
                    onMouseLeave={() => setContentChanged(false)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="scroll1-btn right mr-2" onClick={scrollRightHandler}>
                &#x276F;
              </button>
            </div>
            <div
              className={`megamenu-container-2 ${contentChanged ? "animate-columns" : ""}`}
              key={tabChangeKey}
              onMouseEnter={handleColumnsMouseEnter}
              onMouseLeave={handleColumnsMouseLeave}
            >
              <div
                className={`megamenu-column ${activeTab ? 'active-tab' : ''} ${contentChanged ? "animate" : ""}`}
              >
                <ul className="megamenu-ul">
                  {tabContent.items1.map((item, index) => (
                    <li
                      key={index}
                      className="megamenu-li1"
                      onMouseEnter={() => handleItemMouseEnter(item)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`megamenu-column ${activeTab ? 'active-tab' : ''} ${contentChanged ? "animate" : ""}`}
              >
                <ul className="megamenu-ul">
                  {tabContent.items2.map((item, index) => (
                    <li
                      key={index}
                      className="megamenu-li2"
                      onMouseEnter={() => handleItemMouseEnter(item)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`text-center megamenu-column third-column justify-content-center text-center align-items-center align-content-center p-0  ${isHoveredOnColumns ? 'highlight' : ''}`}
              >
                {renderContent()}
              </div>
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
});

export default MegaMenu;
