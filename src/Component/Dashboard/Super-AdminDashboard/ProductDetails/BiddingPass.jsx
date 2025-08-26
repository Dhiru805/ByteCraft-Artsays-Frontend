import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BiddingPass = () => {
  const navigate = useNavigate();
  const [selectedPass, setSelectedPass] = useState(0);

  const biddingPasses = [
    {
      id: 'one-time',
      label: 'One-Time Pass',
      description: 'Access to 1 bidding session for a single product. No expiration.',
      price: 99
    },
    {
      id: 'monthly',
      label: 'Monthly Pass',
      description: 'Unlimited bidding access for 30 days from purchase.',
      price: 249
    },
    {
      id: 'annual',
      label: 'Annual Pass',
      description: 'Full year of unlimited bidding on all eligible products.',
      price: 999
    }
  ];

  return (
    <div className="container-fluid mt-3">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Choose Bidding Pass</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding Pass</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button type="button" className="btn btn-secondary mr-2">
                  <i className="fa fa-info-circle"></i> Pass Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="row clearfix">
        {biddingPasses.map((pass, index) => {
          const isActive = selectedPass === index;
          return (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div
                className={`card position-relative ${isActive ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedPass(index)}
              >
                {/* Radio button top-left inside card */}
                <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
                  <input
                    type="radio"
                    name="passPlan"
                    checked={isActive}
                    onChange={() => setSelectedPass(index)}
                    className="form-check-input"
                    style={{ width: '20px', height: '20px', marginLeft: '1px', cursor: 'pointer' }}
                  />
                  <label
                    className="form-check-label fw-bold mb-0"
                    style={{ fontSize: '2rem', marginLeft: '50px', cursor: 'pointer' }}
                  >
                    {pass.label}
                  </label>
                </div>
                <ul className={`pricing body text-center ${isActive ? 'active' : ''}`}>
                  <li>{pass.description}</li>
                  <li>Responsive Design</li>
                  <li>Color Customization</li>
                  <li>HTML5 &amp; CSS3</li>
                  <li>Styled elements</li>
                  <li>
                    <h3>${pass.price}</h3>
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
          <i className="bi-gem pr-1"></i> Purchase Pass
        </button>
      </div>
    </div>
  );
};

export default BiddingPass;