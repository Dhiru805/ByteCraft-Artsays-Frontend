import React from 'react';
import './ServiceFeature.css';

function ServiceFeature({ title, description, imgSrc }) {
  return (
    <div className="service-feature">
      <img src={imgSrc} alt={title} />
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function ServiceFeatures() {
  return (
    <div className="service-features-container">
      <ServiceFeature
        title="Reliable Dealings"
        description="Consectetur adipiscing elit sed do eiusmod tempor incididunt utnale labore etdolore"
        imgSrc="https://themebing.com/wp/prolancer/wp-content/uploads/elementor/thumbs/s-1-pgwx03fce8sb2k2xj8e5lvoxxehksx5ao5dsd3na34.jpg"
      />
      <ServiceFeature
        title="Data Secured"
        description="Consectetur adipiscing elit sed do eiusmod tempor incididunt utnale labore etdolore"
        imgSrc="https://themebing.com/wp/prolancer/wp-content/uploads/elementor/thumbs/s-3-pgwx0igrflcw8bh33ew6prwbfkfg82t027tk1j0zbk.jpg"
      />
      <ServiceFeature
        title="Live Chat Support 24"
        description="Consectetur adipiscing elit sed do eiusmod tempor incididunt utnale labore etdolore"
        imgSrc="https://themebing.com/wp/prolancer/wp-content/uploads/elementor/thumbs/s-2-pgwx0gl31xabl3jtee2xksde8sopsoljdyil2z3ro0.jpg"
      />
    </div>
  );
}

export default ServiceFeatures;
