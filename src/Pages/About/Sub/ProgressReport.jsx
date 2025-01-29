import React, { useEffect, useRef } from 'react';
import AboutPageCard from "./AboutPageCards"
const ProgressReport = () => {
  const counters = [
    { count: 229, label: 'Happy Clients' },
    { count: 109, label: 'Completed Projects' },
    { count: 22, label: 'Awesome Staff' },
    { count: 11, label: 'Winning Awards' },
  ];

  const counterRefs = useRef([]);

  useEffect(() => {
    const animateCounter = (element, target) => {
      let start = 0;
      const duration = 2500;
      const increment = target / (duration / 16.67);

      const updateCounter = () => {
        start += increment;
        if (start < target) {
          element.textContent = `${Math.floor(start)}+`;
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = `${target}+`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <section className="abtSecHolder   pb-xl-12  pb-lg-10  pb-md-8  pb-5">
        <div className="rows d-flex flex-wrap">
          <div className="col-12 col-md-7 pt-xl-12 pt-lg-8">
            <h2 className="playfair fwEbold position-relative mb-lg-7 pb-5">
              <strong className="d-block">A Minimal Team</strong>
              <strong className="d-block">For a Better World</strong>
            </h2>
            <p className="pr-xl-16 pr-lg-10 mb-lg-0 mb-6">
              Lorem Khaled Ipsum is a major key to success. The ladies always say Khaled you smell good, I use no cologne. Cocoa butter is the key. To succeed you must believe. When you believe, you will succeed. They will try to close the door on you, just open it. The key is to drink coconut, fresh coconut, trust me. It’s important to use cocoa butter. It’s the key to more success, why not live smooth?
            </p>
          </div>
          <div className="col-lg-5A  ">
             <AboutPageCard/>
            {/* <img src="images/img80.jpg" alt="image description" className="img-fluid" /> */}
          </div>
        </div>
      </section>

      <section className="counterSec abtSecHolder pt-xl-18 pb-xl-24 pt-lg-10 pb-lg-20 pt-md-8  pt-5 pb-10">
        <div className="rows ml-0 mr-0">
          <div className="col-12">
            <ul className="progressCounter list-unstyled mb-2 d-flex flex-wrap text-capitalize text-center">
              {counters.map((counter, index) => (
                <li className="mb-md-0 mb-3" key={index}>
                  <strong
                    ref={(el) => (counterRefs.current[index] = el)}
                    className="d-block fwEbold counter mb-2"
                    data-target={counter.count}
                  >
                    0+
                  </strong>
                  <strong className="d-block text-uppercase txtWrap">{counter.label}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressReport;
