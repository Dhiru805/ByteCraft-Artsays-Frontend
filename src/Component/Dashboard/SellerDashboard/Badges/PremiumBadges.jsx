import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PremiumBadge = () => {
  const navigate = useNavigate();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0); // Default: Trusted Badge

  const pricingPlans = [
    {
      title: 'Trusted Badge',
      price: 99,
      description: 'Access to 1 premium session for a single product. No expiration.',
    },
    {
      title: 'Master Badge',
      price: 249,
      description: 'Unlimited premium access for 30 days from purchase.',
    },
  ];

  return (
    <div className="container-fluid mt-3">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Choose Premium Badge</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Premium Badge</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => window.open('/bidding', '_blank')}
                >
                  <i className="fa fa-info-circle"></i> Badge Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards with Radio Selection */}
      <div className="row clearfix">
        {pricingPlans.map((plan, index) => {
          const isActive = selectedPlanIndex === index;
          return (
            <div key={index} className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className={`card ${isActive ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedPlanIndex(index)}>
                <div className="text-start px-3 pt-2 align-center ">
                  <input
                    type="radio"
                    name="badgePlan"
                    checked={isActive}
                    onChange={() => setSelectedPlanIndex(index)}
                    className="form-check-input mr-2"
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label className="form-check-label fw-bold ml-2" style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                    {plan.title}
                  </label>
                </div>
                <ul className={`pricing body text-center ${isActive ? 'active' : ''}`}>
                  <li>{plan.description}</li>
                  <li>Responsive Design</li>
                  <li>Color Customization</li>
                  <li>HTML5 &amp; CSS3</li>
                  <li>Styled elements</li>
                  <li>
                    <h3>${plan.price}</h3>
                    <span>per month</span>
                  </li>
                </ul>
              </div>
            </div>

          );
        })}
      </div>

      <div className="pt-2 pb-4">
        <button type="button" className="btn btn-secondary">
          <i className="bi-gem pr-1"></i> Purchase Badge
        </button>
      </div>
    </div>
  );
};

export default PremiumBadge;
