import React, { useState } from 'react';
import Companyinfo from "../UserInfo/CompanyInfo"


const Settings = ({ userId, profileData, previewImage,}) => {


  
  return (
    <div className="body">
      <h6>Profile Photo</h6>
      <div className="media">
        <div className="media-left m-r-15" style={{ width: '140px', height: '140px', overflow: 'hidden' }}>
          <img
            src={previewImage}
            className="user-photo media-object"
            alt="User"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div className="body">
        <h5 className="mb-2">Basic Information</h5>
        <hr className="mt-1" />
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="First Name"
                value={profileData.name}
                name="name"
                disabled
              />
            </div>
      
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Last Name"
                value={profileData.lastName}
                name="lastName"
                disabled
              />
            </div>

          </div>
        </div>
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                name="email"
                value={profileData.email}
                disabled
                style={{
                  backgroundImage: 'url("data:image/png',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 20,
                  backgroundPosition: '97% center',
                  cursor: 'auto',
                }}
                data-temp-mail-org={0}
                fdprocessedid="yelneg"
              />
            </div>
           
          </div>
          <div className="col-lg-6 col-md-12">
          <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Phone Number"
                fdprocessedid="eszxtb"
                value={profileData.phone}
                disabled
                name="phone"
              />
            </div>
          </div>
        </div>
      </div>
    
      <Companyinfo
        userId={userId} />
    </div>
  );
};

export default Settings;