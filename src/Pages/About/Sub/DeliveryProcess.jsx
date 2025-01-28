import React, { useEffect, useRef } from 'react';
import './Delivery.css';

const DeliveryProcess = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Choose your products',
      description: 'There are many variations of passages of lorem ipsum available, but the majority have suffered alteration in some form, by injected humour.',
      isRightArrow: false
    },
    {
      stepNumber: '02',
      title: 'Connect nearest store',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      isRightArrow: true
    },
    {
      stepNumber: '03',
      title: 'Share your location',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      isRightArrow: false
    },
    {
      stepNumber: '04',
      title: 'Get delivered fast',
      description: 'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment.',
      isRightArrow: true
    }
  ];

  const deliveryRef = useRef();

  useEffect(() => {
    const deliveryItems = deliveryRef.current.querySelectorAll('.stepCol');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    deliveryItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="processStepSec abtSecHolder pt-xl-23 pb-xl-10 pt-lg-20 pb-lg-10 pt-md-16 pb-md-8 pt-10 pb-0">
      <div className="rows  ml-0 mr-0">
        <header className="col-12 mainHeader mb-3 text-center">
          <h1 className="headingIV playfair fwEblod mb-4">Delivery Process</h1>
          <span className="headerBorder d-block mb-5">
            <img src="images/hbdr.png" alt="Header Border" className="img-fluid img-bdr" />
          </span>
        </header>
      </div>
      <div className="row position-relative mr-0 ml-0" ref={deliveryRef}>
        <div className="process-line"></div>
        {steps.map((step, index) => (
          <div className={`col-12 d-flex ${step.isRightArrow ? 'justify-content-end' : 'justify-content-start'} mb-lg-3 mb-10`} key={index}>
            <div className={`stepCol ${step.isRightArrow ? 'rightArrow' : 'leftArrow'} position-relative bg-lightGray py-6 px-6`}>
              <strong className="mainTitle text-uppercase mt-n8 mb-5 d-block text-center py-1 px-3">Step {step.stepNumber}</strong>
              <h2 className="headingV fwEblod text-uppercase mb-3">{step.title}</h2>
              <p className="mb-5">{step.description}</p>
            </div>
            <div className="process-dot"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeliveryProcess;
