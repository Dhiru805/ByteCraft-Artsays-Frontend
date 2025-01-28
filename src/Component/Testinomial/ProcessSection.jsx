import React, { useState, useEffect, useRef } from "react";
import './ProcessSection.css';

const steps = [
  { id: 1, title: "Initial Meeting", icon: "fas fa-handshake" },
  { id: 2, title: "Evaluation & Planning", icon: "fas fa-file-alt" },
  { id: 3, title: "Design & Development", icon: "fas fa-code" },
  { id: 4, title: "Quality Testing", icon: "fas fa-thumbs-up" },
  { id: 5, title: "Maintenance", icon: "fas fa-cogs" },
  { id: 6, title: "Delivery", icon: "fas fa-envelope" },
];

const ProcessSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Simulate progress with delays for circle hold and line fill
  useEffect(() => {
    if (!inView) return;

    let stepInterval;
    const animateSteps = () => {
      stepInterval = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < steps.length) {
            return prevStep + 1;
          } else {
            clearInterval(stepInterval);
            return prevStep;
          }
        });
      }, 3000); // Adjust timing as needed
    };

    animateSteps();

    return () => clearInterval(stepInterval);
  }, [inView]);

  return (
    <div className="resell-process-container">
      <h2 className="resell-process-title">Process of Build App</h2>
      <p className="resell-process-description">
        Delivering work within time and budget which meets client’s requirements is our motto.
      </p>
      <div className="resell-steps-wrapper">
        <div className="resell-steps-line">
          <div
            className="resell-steps-line-fill "  ref={ref}
            style={{ width: `${(currentStep / steps.length) * 122}%` }}
          ></div>
        </div>
        <div className="d-md-flex p-0 resell">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`col-md-2 resell-step-item ${index % 2 === 0 ? 'top' : 'bottom'} ${index < currentStep ? 'active' : ''}`}
            >
              <div className={index % 2 === 0 ? 'resell-cards-bottom' : 'resell-cards-top'}>
                <div className="flip-container flipper">
                  <div className="front">
                    <div className="resell-step-title">{step.title}</div>
                    <div className="resell-step-icon">
                      <i className={step.icon}></i>
                    </div>
                  </div>
                  <div className="back">
                    <div className="description">
                      <h3>Project Title</h3>
                      <p>This is the project description that appears when flipped.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="resell-step-circle">
                <span className="resell-step-number">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSteps;
