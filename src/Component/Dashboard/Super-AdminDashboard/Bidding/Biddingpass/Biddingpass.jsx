import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BiddingPass = () => {
  const navigate = useNavigate();
  const [selectedPass, setSelectedPass] = useState('monthly');

  return (
    <div className="container-fluid mt-3">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Choose Bidding Pass</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                  All Product
                </span>
              </li>
              <li className="breadcrumb-item">Bidding Pass</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => window.open('/bidding', '_blank')}                >
                  <i className="fa fa-info-circle"></i> Pass Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        {[
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
        ].map(pass => (
          <div className="col-md-4 mb-4" key={pass.id}>
            <div
              className={`card h-100 p-3 ${selectedPass === pass.id ? 'border-info' : ''}`}
              style={{
                minHeight: '500px',
                borderWidth: selectedPass === pass.id ? '2px' : '1px',
                borderStyle: 'solid',
                transition: 'border-color 0.3s',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => setSelectedPass(pass.id)} >

              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${selectedPass === pass.id ? '#3BB29D' : '#3BB29D'}`,
                    marginRight: '10px',
                    position: 'relative',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPass(pass.id);
                  }}
                >
                  {selectedPass === pass.id && (
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#3BB29D',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                  )}
                </div>
                <h6 className="mb-0" style={{ fontSize: '1.25rem' }}>{pass.label}</h6>
              </div>

              <div className="mb-3">
                <div className="border p-2 text-muted rounded small bg-light">
                  {pass.description}
                </div>
              </div>

              <p className="mb-0 text-right font-weight-bold" style={{ fontSize: '1.125rem' }}>
                Price: ₹{pass.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiddingPass;
