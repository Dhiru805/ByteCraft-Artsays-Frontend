// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const BiddingPass = () => {
//   const navigate = useNavigate();
//   const [selectedPass, setSelectedPass] = useState('monthly');

//   return (
//     <div className="container-fluid mt-3">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Choose Bidding Pass</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
//                   <i className="fa fa-dashboard"></i>
//                 </span>
//               </li>
//               <li className="breadcrumb-item active">
//                 <span onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
//                   All Product
//                 </span>
//               </li>
//               <li className="breadcrumb-item">Bidding Pass</li>
//             </ul>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="d-flex flex-row-reverse">
//               <div className="page_action">
//                 <button
//                   type="button"
//                   className="btn btn-secondary mr-2"
//                   onClick={() => window.open('/bidding', '_blank')}                >
//                   <i className="fa fa-info-circle"></i> Pass Info
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row mt-4">
//         {[
//           {
//             id: 'one-time',
//             label: 'One-Time Pass',
//             description: 'Access to 1 bidding session for a single product. No expiration.',
//             price: 99
//           },
//           {
//             id: 'monthly',
//             label: 'Monthly Pass',
//             description: 'Unlimited bidding access for 30 days from purchase.',
//             price: 249
//           },
//           {
//             id: 'annual',
//             label: 'Annual Pass',
//             description: 'Full year of unlimited bidding on all eligible products.',
//             price: 999
//           }
//         ].map(pass => (
//           <div className="col-md-4 mb-4" key={pass.id}>
//             <div
//               className={`card h-100 p-3 ${selectedPass === pass.id ? 'border-info' : ''}`}
//               style={{
//                 minHeight: '500px',
//                 borderWidth: selectedPass === pass.id ? '2px' : '1px',
//                 borderStyle: 'solid',
//                 transition: 'border-color 0.3s',
//                 cursor: 'pointer',
//                 userSelect: 'none'
//               }}
//               onClick={() => setSelectedPass(pass.id)} >

//               <div className="d-flex align-items-center mb-3">
//                 <div
//                   style={{
//                     width: '20px',
//                     height: '20px',
//                     borderRadius: '50%',
//                     border: `2px solid ${selectedPass === pass.id ? '#3BB29D' : '#3BB29D'}`,
//                     marginRight: '10px',
//                     position: 'relative',
//                     flexShrink: 0,
//                     cursor: 'pointer'
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedPass(pass.id);
//                   }}
//                 >
//                   {selectedPass === pass.id && (
//                     <div
//                       style={{
//                         width: '10px',
//                         height: '10px',
//                         backgroundColor: '#3BB29D',
//                         borderRadius: '50%',
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)'
//                       }}
//                     ></div>
//                   )}
//                 </div>
//                 <h6 className="mb-0" style={{ fontSize: '1.25rem' }}>{pass.label}</h6>
//               </div>

//               <div className="mb-3">
//                 <div className="border p-2 text-muted rounded small bg-light">
//                   {pass.description}
//                 </div>
//               </div>

//               <p className="mb-0 text-right font-weight-bold" style={{ fontSize: '1.125rem' }}>
//                 Price: ₹{pass.price}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BiddingPass;


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
