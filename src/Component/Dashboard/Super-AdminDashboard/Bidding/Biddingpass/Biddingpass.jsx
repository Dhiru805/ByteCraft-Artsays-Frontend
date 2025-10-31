import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";


const BiddingPass = () => {
  const navigate = useNavigate();
  const [selectedPass, setSelectedPass] = useState(0);
  const [userType, setUserType] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [userId, setUserId] = useState("");

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

  useEffect(() => {
    if (!userType) {
      setUserOptions([]);
      setUserId("");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await getAPI(`/api/users-by-type?userType=${userType}`, {}, true);
        console.log("Fetched users response:", response);
        if (!response.hasError && Array.isArray(response.data.data)) {
          const options = response.data.data;
          setUserOptions(options);
          setUserId("");
        } else {
          toast.error(`Failed to fetch ${userType}s: ${response.message}`);
        }
      } catch (error) {
        toast.error("Error fetching users.");
      }
    };

    fetchUsers();
  }, [userType]);

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
     
<div className="form-group mb-3">
  <label>Select User Type</label>
  <select
    className="form-control"
    value={userType}
    onChange={(e) => setUserType(e.target.value)}
  >
    <option value="">-- Choose User Type --</option>  
    <option value="Artist">Artist</option>
    <option value="Seller">Seller</option>
  </select>
</div>

      {/* Select User */}
      <div className="form-group mb-4">
        <label>{userType ? `${userType} List` : "Select User"}</label>
        <Select
          options={userOptions.map((user) => ({
            value: user._id,
            label: `${user.name} ${user.lastName || ""}`.trim(),
          }))}
          value={
            userOptions
              .map((user) => ({
                value: user._id,
                label: `${user.name} ${user.lastName || ""}`.trim(),
              }))
              .find((o) => o.value === userId) || null
          }
          onChange={(option) => setUserId(option ? option.value : "")}
          placeholder={`Select ${userType || "Artist or Seller"}`}
          isClearable
          isDisabled={!userType || userOptions.length === 0}
        />
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