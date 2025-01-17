import React, { useState, useEffect } from 'react';
// import './Testimonial.css';
 
const testimonials = [
  {
    
    text: 'Lorem ipsum dolor sit amet consectetur,magni qui atque laboriosam dolorem quo illo eius optio similique vel? Iusto molestias magni odio ad in nisi nesciunt nulla tenetur, ullam veritatis',
    name: 'Ronald Row',
    title: 'Designer, LLC Team',
    profileImg:'images/avatar2.png'
  },
  {
    text: 'Lorem ipsum doloruas harum. Adto, earum sed cupiditate hic quia neque vitae eaque, magni qui atque laboriosam dolorem quo illo eius optio similique vel? Iusto molestias magni odio ad in nisi nesciunt nulla tenetur, ullam veritatis',
    name: 'Jane Doe',
    title: 'Developer, XYZ Corp',
    profileImg:'images/avatar2.png'
  },
  {
    text: 'Lorem ipsum dolor sit amet eius quas harum. Adipisci architecto,oriosam dolorem quo illo eius optio similique vel? Iusto molestias magni odio ad in nisi nesciunt nulla tenetur, ullam veritatis',
    name: 'John Smith',
    title: 'Manager, ABC Ltd',
    profileImg:'images/avatar2.png'
  },
  {
    text: 'Lorem ipsum doloruas harum. Adto, earum sed cupiditate hic quia neque vitae eaque, magni qui atque laboriosam dolorem quo illo eius optio similique vel? Iusto molestias magni odio ad in nisi nesciunt nulla tenetur, ullam veritatis',
    name: 'Jane Doe',
    title: 'Developer, XYZ Corp',
    profileImg:'images/avatar2.png'
  },
  {
    text: 'Lorem ipsum dolor sit amet eius quas harum. Adipisci architecto,oriosam dolorem quo illo eius optio similique vel? Iusto molestias magni odio ad in nisi nesciunt nulla tenetur, ullam veritatis',
    name: 'John Smith',
    title: 'Manager, ABC Ltd',
    profileImg:'images/avatar2.png'
  },
  // Add more testimonials here if needed
];
 
function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
 
    window.addEventListener('resize', handleResize);
 
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000); // Change slide every 6 seconds
 
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);
 
  const visibleTestimonials = () => {
    let numVisible;
  
    if (windowWidth < 768) {
      numVisible = 1; // Show 1 testimonial for small screens
    } else if (windowWidth <= 996) {
      numVisible = 2; // Show 2 testimonials for medium screens
    } else {
      numVisible = Math.min(testimonials.length, Math.floor(windowWidth / 500)); 
      // Adjust the number of testimonials for larger screens, 
      // ensuring they fit within the window width (300px per testimonial as an example)
    }
  
    const visible = [];
    for (let i = 0; i < numVisible; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };
 
  return (
    <section className="testimonial-area pt-5">
      <div className="container">
        <div className="sec-title">
          <h2>Our Testimonial</h2>
          <p>What client say about us?</p>
        </div>
        <div className="testimonial-content">
          {visibleTestimonials().map((testimonial, index) => (
            <div className="single-testimonial" key={index}>
              <span className="quote quote-left">“</span>
              <p>{testimonial.text}</p>
              <span className="quote quote-right">”</span>
              <div className="client-info">
                <div className="client-pic">
                    <img src={testimonial.profileImg} alt={testimonial.name} />
                </div>
                <div className="client-details">
                  <h6>{testimonial.name}</h6>
                  <span>{testimonial.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="dots py-5">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
 
export default Testimonial;