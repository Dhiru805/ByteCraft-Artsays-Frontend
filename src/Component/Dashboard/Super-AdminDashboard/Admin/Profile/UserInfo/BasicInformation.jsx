import React, { useState } from 'react';
import Companyinfo from "../UserInfo/CompanyInfo"


const Settings = ({ userId, profileData, previewImage, handleImageUpload, handleChange,loading, handleSubmit, passwordData, handlePasswordChange }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (setter, currentState) => {
    setter(!currentState);
  };
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
        <div className="media-body">
          <p>Upload your photo.<br /> <em>Image should be at least 140px x 140px</em></p>
          <button
            type="button"
            className="btn btn-default"
            id="btn-upload-photo"
            onClick={() => document.getElementById('filePhoto').click()}
          >
            Upload Photo
          </button>
          <input
            type="file"
            id="filePhoto"
            className="sr-only"
            onChange={handleImageUpload}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Phone Number"
                fdprocessedid="eszxtb"
                value={profileData.phone}
                onChange={handleChange}
                name="phone"
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="input-group">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="form-control"
                  id="currentPassword"
                  placeholder="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility(setShowCurrentPassword, showCurrentPassword)}
                  >
                    <i className={`fa ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control"
                  id="newPassword"
                  placeholder="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility(setShowNewPassword, showNewPassword)}
                  >
                    <i className={`fa ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility(setShowConfirmPassword, showConfirmPassword)}
                  >
                    <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button 
        type="button" 
        className="btn btn-primary mx-2" 
        onClick={handleSubmit}
        disabled={loading}>
          {loading?"Updating.....":"Update"}
          </button>
      </div>
    
      <Companyinfo
        userId={userId} />
    </div>
  );
};

export default Settings;