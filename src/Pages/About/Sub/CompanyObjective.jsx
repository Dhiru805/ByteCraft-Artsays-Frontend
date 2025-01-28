import React, { useState, useRef, useEffect } from 'react';
 
const CompanyObjective = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const accordionRefs = useRef([]);
 
  const accordionItems = [
    {
      title: 'connecting people',
      content: 'To succeed you must believe. When you believe, you will succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, you have to make it through the jungle to make it to paradise, that’s the key, Lion! Lion!'
    },
    {
      title: 'we build your dream',
      content: 'To succeed you must believe. When you believe, you will succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, you have to make it through the jungle to make it to paradise, that’s the key, Lion! Lion!'
    },
    {
      title: 'nothing to fear',
      content: 'To succeed you must believe. When you believe, you will succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, you have to make it through the jungle to make it to paradise, that’s the key, Lion! Lion!'
    },
    {
      title: 'make the world better',
      content: 'To succeed you must believe. When you believe, you will succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, you have to make it through the jungle to make it to paradise, that’s the key, Lion! Lion!'
    }
  ];
 
  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };
 
  useEffect(() => {
    // Apply smooth height transition
    accordionRefs.current.forEach((ref, index) => {
      if (ref) {
        if (activeIndex === index) {
          ref.style.maxHeight = `${ref.scrollHeight}px`; // Set max-height to the scroll height of content
        } else {
          ref.style.maxHeight = '0'; // Collapse the element by setting max-height to 0
        }
      }
    });
  }, [activeIndex]);
 
  return (
    <section className="introSec bg-lightGray pt-xl-12 pb-xl-7 pt-lg-10 pb-10">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 mb-lg-0 mb-6">
            <img src="images/img81.png" alt="image description" className="img-fluid pt-lg-6" />
          </div>
          <div className="col-12 col-lg-6">
            <div id="accordion" className="accordionList pt-lg-6 pb-lg-6">
              {accordionItems.map((item, index) => (
                <div className="card mb-2" key={index}>
                  <div className="card-header px-xl-5 py-xl-3" id={`heading${index}`}>
                    <h5 className="mb-0">
                      <button
                        className={`btn btn-link fwEbold text-uppercase text-left w-100 p-0 ${activeIndex === index ? '' : 'collapsed'}`}
                        onClick={() => handleToggle(index)}
                        aria-expanded={activeIndex === index}
                        aria-controls={`collapse${index}`}
                      >
                        {item.title} <i className="fas fa-sort-down float-right"></i>
                      </button>
                    </h5>
                  </div>
                  <div
                    id={`collapse${index}`}
                    className={`collapse ${activeIndex === index ? 'show' : ''}`}
                    aria-labelledby={`heading${index}`}
                    data-parent="#accordion"
                    ref={(el) => (accordionRefs.current[index] = el)} // Store reference to each accordion item
                    style={{ maxHeight: '0', overflow: 'hidden', transition: 'max-height 0.5s ease' }} // Apply CSS transition
                  >
                    <div className="card-body px-xl-5 py-3">
                      <p className="mb-7">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default CompanyObjective;
 
 