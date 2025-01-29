import React, { useRef, useEffect } from 'react';
import { FaPaintBrush, FaLightbulb, FaHeadset, FaChartLine, FaBullhorn, FaMoneyBillWave, FaShieldAlt, FaRocket } from 'react-icons/fa';
import './WhyChooseUs.css';  

const WhyChooseUs = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const container = featuresRef.current;

    if (!container || window.innerWidth > 767) return;

    const scrollAmount = 1;
    const scrollInterval = 20;

    const autoScroll = () => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollAmount;
      }
    };

    const intervalId = setInterval(autoScroll, scrollInterval);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const features = [
    { icon: <FaPaintBrush />, title: 'Modern Design', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaLightbulb />, title: 'Creative Design', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaHeadset />, title: '24x7 User Support', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaChartLine />, title: 'Business Growth', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaBullhorn />, title: 'Market Strategy', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaMoneyBillWave />, title: 'Affordable Cost', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaShieldAlt />, title: 'Safe', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <FaRocket />, title: 'Fast', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];

  return (
    <>
      <div className="choose-wrapper">
        <h2 className="choose-heading">Why Choose Us</h2>
        <p className="choose-subheading">Get more free slide templates: JustFreeSlide.com</p>
        <div className="choose-features" ref={featuresRef}>
          {features.map((feature, index) => (
            <div key={index} className="choose-feature">
              <div className="choose-icon">{feature.icon}</div>
              <h3 className="choose-title">{feature.title}</h3>
              <p className="choose-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WhyChooseUs;
