import React from 'react';
import Password from "./Password"
const Settings = ({userId, profileData, previewImage, handleImageUpload, handleChange, handleAddressChange, handleSubmit }) => {
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
        <h6>Basic Information</h6>
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={profileData.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="fancy-radio">
                <input
                  name="gender"
                  value="male"
                  type="radio"
                  checked={profileData.gender === 'male'}
                  onChange={handleChange}
                />
                <span>
                  <i /> Male
                </span>
              </label>
              <label className="fancy-radio">
                <input
                  name="gender"
                  value="female"
                  type="radio"
                  checked={profileData.gender === 'female'}
                  onChange={handleChange}
                />
                <span>
                  <i /> Female
                </span>
              </label>
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Address Line 1"
                value={profileData.address?.line1}
                name="address.line1" 
                onChange={handleAddressChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={profileData.address?.city}
                name="address.city" 
                onChange={handleAddressChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                value={profileData.address?.country}
                name="address.country" 
                onChange={handleAddressChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Website"
                value={profileData.website}
                name="website"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={profileData.lastName}
                name="lastName"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"><i className="fa fa-calendar"></i></span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Birthdate"
                  name="birthdate"
                  value={profileData.birthdate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Address Line 2"
                value={profileData.address?.line2}
                name="address.line2" 
                onChange={handleAddressChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="State/Province"
                value={profileData.address?.state}
                name="address.state" 
                onChange={handleAddressChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Pincode"
                value={profileData.address?.pincode}
                name="address.pincode" 
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-primary mx-2" onClick={handleSubmit}>Update</button>
      </div>
      <Password
        userId={userId}
        email={profileData.email}
        username={profileData.username}
        phoneNumber={profileData.phone}
        />
    </div>
  );
};

export default Settings;
