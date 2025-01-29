import React, { useEffect, useRef } from "react";
import "./herosection2.css";

const HeroSection2 = () => {
  const secondImageRef = useRef(null);
  const creativeTextRef = useRef(null);
  const pagesTextRef = useRef(null);
  const awesomTextRef = useRef(null);
  const websiteTextRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const height = window.innerHeight;

      const secondImage = secondImageRef.current;
      const creativeText = creativeTextRef.current;
      const pagesText = pagesTextRef.current;
      const awesomtext = awesomTextRef.current;
      const websitetext = websiteTextRef.current;

      if (secondImage && creativeText && pagesText) {
        const scrollFactor = Math.min(scrollTop / height, 1);

        secondImage.style.transform = `translateY(${scrollFactor * 30}%)`;
        creativeText.style.transform = `translateX(-${scrollFactor * 50}%)`;
        pagesText.style.transform = `translateX(${scrollFactor * 50}%)`;
        awesomtext.style.transform = `translateX(${scrollFactor * 50}%)`;
        websitetext.style.transform =
          window.innerWidth <= 480
            ? `translateX(-${scrollFactor * 50}%)`
            : `translateX(-${scrollFactor * 10}%)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div className="section-container">
        <div className="hero2-main-container">
          <div className="hero2-text-area">
            <div className="text-area-insider">
              <div className="title-hero2">
                <h1>Welcome to the page </h1>
              </div>
              <div className="paragraph-hero2">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Praesentium, ad exercitationem deserunt illo dolore alias quia
                  omnis ipsum iusto ipsam.
                </p>
              </div>
              <div className="hero2-button">
                <button className="btn-hover color-11">BUTTON</button>
              </div>
            </div>
            <div className="hero2-text-area2">
              <div className="title-hero2">
                <h1 ref={awesomTextRef}>Awesome </h1>
              </div>
              <div className="title-hero2">
                <h1 ref={websiteTextRef}>Website</h1>
              </div>
            </div>
          </div>
          <div className="hero-image-section">
            <div className="img1">
              <img
                src="herosectionimg/main-img2.png"
                alt=""
                className="img1-image"
                ref={secondImageRef}
              />
            </div>
            <div className="img-main">
              <img
                src="herosectionimg/main-img.png"
                alt=""
                className="img2-image"
              />
            </div>
            <div className="image-section-text">
              <h1 ref={creativeTextRef}>Creative</h1>
              <h1 className="image-section-text2" ref={pagesTextRef}>
                Pages
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection2;
