import React, { useState } from "react";
import "./CategoryComponent.css";

const CategoryComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Photography"); // Default active category
  const [clickedBtn, setClickedBtn] = useState(""); // State for clicked button

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
  const additionalButtons = Array.from({ length: 30 }, (_, i) => `Button ${i + 1}`);

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

  return (
    <div className="category-wrapper">
      <div className="category-nav">
        <button
          className={`scroll-btn left ${clickedBtn === "left" ? "clicked" : ""}`}
          onClick={() => scroll("left")}
        >
          &#x276E;
        </button>
        <div id="category-container" className="category-container">
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
        <div className="more-buttons">
          {additionalButtons.map((button, index) => (
            <button key={index} className="additional-btn">
              {button}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryComponent;
