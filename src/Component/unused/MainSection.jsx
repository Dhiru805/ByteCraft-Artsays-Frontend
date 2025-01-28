import React, { useState, useRef, useEffect } from 'react';
import './MainSection.css';
 
function MainArtSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);
  const runNextAutoRef = useRef(null); // Ref for runNextAuto
 
  // Time constants
  const timeRunning = 3000; // Time for the animation
  const timeAutoNext = 7000; // Time to automatically move to the next slide
 
  // Function to show slider
  const showSlider = (type) => {
    const sliderItems = sliderRef.current.querySelectorAll('.art-item');
    const thumbnailItems = thumbnailRef.current.querySelectorAll('.art-item');
 
    if (type === 'next') {
      sliderRef.current.appendChild(sliderItems[0]);
      thumbnailRef.current.appendChild(thumbnailItems[0]);
    } else {
      sliderRef.current.prepend(sliderItems[sliderItems.length - 1]);
      thumbnailRef.current.prepend(thumbnailItems[thumbnailItems.length - 1]);
    }
 
    carouselRef.current.classList.add(`art-${type}`);
 
    setTimeout(() => {
      carouselRef.current.classList.remove(`art-${type}`);
    }, timeRunning);
 
    // Automatically advance to the next slide
    clearTimeout(runNextAutoRef.current); // Clear previous timeout
    runNextAutoRef.current = setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sliderItems.length);
    }, timeAutoNext);
  };
 
  useEffect(() => {
    // Start automatic transition
    runNextAutoRef.current = setTimeout(() => {
      showSlider('next'); // Call showSlider to move to the next slide
    }, timeAutoNext);
 
    // Cleanup timeout on component unmount
    return () => {
      clearTimeout(runNextAutoRef.current);
    };
  }, [activeIndex]); // Depend on activeIndex to trigger effect on state change
 
  const handleNext = () => {
    showSlider('next');
  };
 
  const handlePrev = () => {
    showSlider('prev');
  };
 
  return (
    <>
      <div className="art-carousel " ref={carouselRef}>
        <div className="art-list" ref={sliderRef}>
          <div className="art-item">
            <img src="./artimages/img1.jpg" alt="Art 1" />
            <div className="art-content">
              <div className="art-author">WELCOME</div>
              <div className="art-title">art-desIGN SLIDER</div>
              <div className="art-topic">ANIMAL</div>
              <div className="art-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut
                sequi, rem magnam nesciunt minima placeat, itaque eum neque
                officiis unde, eaque optio ratione aliquid assumenda facere ab
              </div>
              <div className="art-buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="art-item">
            <img src="./artimages/img2.jpg" alt="Art 2" />
            <div className="art-content">
              <div className="art-author">WELCOME</div>
              <div className="art-title">art-desIGN SLIDER</div>
              <div className="art-topic">ANIMAL</div>
              <div className="art-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut
                sequi, rem magnam nesciunt minima placeat, itaque eum neque
                officiis unde, eaque optio ratione aliquid assumenda facere ab
              </div>
              <div className="art-buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="art-item">
            <img src="./artimages/img3.jpg" alt="Art 3" />
            <div className="art-content">
              <div className="art-author">WELCOME</div>
              <div className="art-title">art-desIGN SLIDER</div>
              <div className="art-topic">ANIMAL</div>
              <div className="art-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut
                sequi, rem magnam nesciunt minima placeat, itaque eum neque
                officiis unde, eaque optio ratione aliquid assumenda facere ab
              </div>
              <div className="art-buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="art-item">
            <img src="./artimages/img4.jpg" alt="Art 4" />
            <div className="art-content">
              <div className="art-author">WELCOME</div>
              <div className="art-title">art-desIGN SLIDER</div>
              <div className="art-topic">ANIMAL</div>
              <div className="art-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut
                sequi, rem magnam nesciunt minima placeat, itaque eum neque
                officiis unde, eaque optio ratione aliquid assumenda facere ab
              </div>
              <div className="art-buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="art-item">
            <img src="./artimages/img5.jpg" alt="Art 5" />
            <div className="art-content">
              <div className="art-author">WELCOME</div>
              <div className="art-title">art-desIGN SLIDER</div>
              <div className="art-topic">ANIMAL</div>
              <div className="art-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut
                sequi, rem magnam nesciunt minima placeat, itaque eum neque
                officiis unde, eaque optio ratione aliquid assumenda facere ab
              </div>
              <div className="art-buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>
        <div className="art-thumbnail" ref={thumbnailRef}>
          <div className="art-item">
            <img src="https://cdn.shopify.com/s/files/1/0625/3818/6989/files/2_5acf9bab-5dd3-4e04-b42c-d4985ccda17b.jpg?v=1676615530" alt="Thumbnail 1" />
            <div className="art-content">
              <div className="art-title">Name Slider</div>
              <div className="art-description">art-description</div>
            </div>
          </div>
          <div className="art-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR6oExRVtrt8IfW3aqSpMG2DRI9BeZaONyiw&s" alt="Thumbnail 2" />
            <div className="art-content">
              <div className="art-title">Name Slider</div>
              <div className="art-description">art-description</div>
            </div>
          </div>
          <div className="art-item">
            <img src="https://img2.exportersindia.com/product_images/bc-full/dir_107/3202216/modern-art-paintings-1302313.jpg" alt="Thumbnail 3" />
            <div className="art-content">
              <div className="art-title">Name Slider</div>
              <div className="art-description">art-description</div>
            </div>
          </div>
          <div className="art-item">
            <img src="https://cdn.shopify.com/s/files/1/0625/3818/6989/files/11_2ad0b7f0-56a9-4fb5-9409-f57489e9011d.jpg?v=1676615870" alt="Thumbnail 4" />
            <div className="art-content">
              <div className="art-title">Name Slider</div>
              <div className="art-description">art-description</div>
            </div>
          </div>
          <div className="art-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpYAiP99Nt67rj-1VhfXXCgjF97FBu4kdFsg&s" alt="Thumbnail 5" />
            <div className="art-content">
              <div className="art-title">Name Slider</div>
              <div className="art-description">art-description</div>
            </div>
          </div>
        </div>
        <div className="art-arrows">
          <button id="art-prev" onClick={handlePrev}>&lt;</button>
          <button id="art-next" onClick={handleNext}>&gt;</button>
        </div>
        <div className="art-time"></div>
      </div>
    </>
  );
}
 
export default MainArtSlider;
 
 