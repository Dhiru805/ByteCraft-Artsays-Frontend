import React, { useState, useRef } from "react";
import "./CategoryComponent.css";
 
const CategoryComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Photography"); // Default active category
  const [clickedBtn, setClickedBtn] = useState(""); // State for clicked button
  const [selectedAdditionalButton, setSelectedAdditionalButton] = useState(""); // State for selected additional button
  const [isDragging, setIsDragging] = useState(false); // State to track dragging
  const [startX, setStartX] = useState(0); // Initial position of the drag
  const [scrollLeft, setScrollLeft] = useState(0); // Initial scroll position
  const containerRef = useRef(null); // Ref to access category container
 
  // Main categories
  const mainCategories = [
    "Photoshop",
    "Best of Behance",
    "Graphic Design",
    "Photography",
    "Illustration",
    "Best",
    "Photo",
    "3D Art",
    "Graphic-Design",
    "graphy",
    "Illstration",
    "3D-Art",
  ];
 
  // Additional buttons for the More section
  const additionalButtons = Array.from({ length: 24 }, (_, i) => `Button ${i + 1}`);
 
  // Scroll the container left or right
  const scroll = (direction) => {
    const container = document.getElementById("category-container");
    const scrollAmount = direction === "left" ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setClickedBtn(direction); // Set the clicked button direction
  };
 
  // Toggle button functionality
  const toggleActive = () => {
    setIsActive(!isActive);
  };
 
  // Handle click on additional button
  const handleAdditionalButtonClick = (button) => {
    setSelectedAdditionalButton(button); // Set the selected additional button
    setIsActive(false); // Hide the more-buttons-container
    setActiveCategory(button); // Set the active category based on selected button
  };
 
  // Mouse event handlers for smoother dragging
  const handleMouseDown = (e) => {
    const container = containerRef.current;
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };
 
  const handleMouseMove = (e) => {
    if (!isDragging) return; // Only run if dragging
    e.preventDefault();
    const container = containerRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust the multiplier for smoother scroll
    container.scrollLeft = scrollLeft - walk;
  };
 
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
 
  return (
    <div className="category-wrapper">
      <div className="category-nav">
        <button
          className={`scroll-btn left ${clickedBtn === "left" ? "clicked" : ""}`}
          onClick={() => scroll("left")}
        >
          &#x276E;
        </button>
        <div
          id="category-container"
          className="category-container"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{ cursor: isDragging ? "grabbing" : "grab", transition: "all 0.3s ease" }} // Smooth interaction
        >
          {mainCategories.map((category, index) => (
            <div
              key={index}
              className={`category-item ${category === activeCategory ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <button
          className={`scroll-btn right ${clickedBtn === "right" ? "clicked" : ""}`}
          onClick={() => scroll("right")}
        >
          &#x276F;
        </button>
        <button className="toggle-btn" onClick={toggleActive}>
          {isActive ? "Less" : "More"}
        </button>
      </div>
 
      {isActive && (
        <div className="more-buttons-container">
          <div className="arrow"></div> {/* Arrow Indicator */}
          <div className="more-buttons">
            {additionalButtons.map((button, index) => (
              <button
                key={index}
                className="additional-btn"
                onClick={() => handleAdditionalButtonClick(button)}
              >
                {button}
              </button>
            ))}
          </div>
        </div>
      )}
 
      {/* Display related items or selected button content */}
      {selectedAdditionalButton && (
        <div className="related-items">
          <h3>Related items for: {selectedAdditionalButton}</h3>
          {/* Display related items or content here based on the selectedAdditionalButton */}
        </div>
      )}
    </div>
  );
};
 
export default CategoryComponent;
 
 