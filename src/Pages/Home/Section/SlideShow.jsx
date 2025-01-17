import React, { useState, useEffect } from "react";

const slides = [
  {
    backgroundImage: "url(images/b-bg.jpg)",
    title: "Artsays",
    subtitle: "The Perfect Choice.",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry has been the industry's standard.",
    buttonText: "Shop Now",
    buttonLink: "shop.html",
    imgSrc: "artimages/Slider-img1.jpg",
  },
  {
    backgroundImage: "url(images/b-bg2.jpg)",
    title: "welcome to artsays",
    subtitle: "Arts Gonna Make People Happy.",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    buttonText: "Shop Now",
    buttonLink: "shop.html",
    imgSrc: "artimages/Slider-img2.jpg",
  },
  {
    backgroundImage: "url(images/b-bg3.jpg)",
    title: "welcome to artsays",
    subtitle: "Artsays for healthy",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    buttonText: "Shop Now",
    buttonLink: "shop.html",
    imgSrc: "artimages/Slider-img3.jpg",
  },
];

const SlideShow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e) => {
    e.preventDefault();
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = (e) => {
    e.preventDefault();
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div id="pageWrapper">
        <main>
          <section className="introBlock position-relative">
            <div className="slick-fade">
              {slides.map((slide, index) => (
                <div key={index} >
                  <div className="align w-100 d-flex align-items-center bgCover" style={{ backgroundImage: slide.backgroundImage }}>
                    <div className="container position-relative holder pt-xl-10 pt-0">
                      <div className="row">
                        <div className="col-12 col-xl-7">
                          {index === 0 && (
                            <div className="txtwrap pr-lg-10">
                              <h1 className="fwEbold position-relative pb-lg-8 pb-4 mb-xl-7 mb-lg-6">{slide.title} <span className="text-break d-block">{slide.subtitle}</span></h1>
                              <p className="mb-xl-15 mb-lg-10">{slide.description}</p>
                              <a href={slide.buttonLink} className="btn btnTheme btnShop fwEbold text-white md-round py-md-3 px-md-4 py-2 px-3">{slide.buttonText} <i className="fas fa-arrow-right ml-2"></i></a>
                            </div>
                          )}
                          {index === 1 && (
                            <div className="txtwrap pr-lg-10">
                              <span className="title d-block text-uppercase fwEbold position-relative pl-2 mb-lg-5 mb-sm-3 mb-1">{slide.title}</span>
                              <h2 className="fwEbold position-relative mb-xl-7 mb-lg-5">{slide.subtitle.split(' ').slice(0, -2).join(' ')} <span className="text-break d-block">{slide.subtitle.split(' ').slice(-2).join(' ')}</span></h2>
                              <p className="mb-xl-15 mb-lg-10">{slide.description}</p>
                              <a href={slide.buttonLink} className="btn btnTheme btnShop fwEbold text-white md-round py-2 px-3 py-md-3 px-md-4">{slide.buttonText} <i className="fas fa-arrow-right ml-2"></i></a>
                            </div>
                          )}
                          {index === 2 && (
                            <div className="txtwrap pr-lg-10">
                              <span className="title d-block text-uppercase fwEbold position-relative pl-2 mb-lg-5 mb-sm-3 mb-1">{slide.title}</span>
                              <h2 className="fwEbold position-relative mb-xl-7 mb-lg-5">{slide.subtitle.split(' ').slice(0, -2).join(' ')} <span className="text-break d-block">{slide.subtitle}</span></h2>
                              <p className="mb-xl-15 mb-lg-10">{slide.description}</p>
                              <a href={slide.buttonLink} className="btn btnTheme btnShop fwEbold text-white md-round py-2 px-3 py-md-3 px-md-4">{slide.buttonText} <i className="fas fa-arrow-right ml-2"></i></a>
                            </div>
                          )}
                        </div>
                        <div className="imgHolder">
                          <img src={slide.imgSrc} alt="image description" className="img-fluid w-80 px-2  ml-10"  />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="slickNavigatorsWrap">
              <a href="#" onClick={prevSlide} className="slick-prev"><i className="icon-leftarrow"></i></a>
              <a href="#" onClick={nextSlide} className="slick-next"><i className="icon-rightarrow"></i></a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SlideShow;
