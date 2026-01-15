import React, { useState, useEffect } from 'react';
import ArtistInfo from "./ArtistProfessionalInfo";
import SocialMedia from "./SocialMediaPromotion";
import BankDetails from "./BankandPaymentDetails"
import Notification from "./NotificationPreferences"
import Agreement from "./Agreements"
import Verification from "./Verifications"
import { DEFAULT_PROFILE_IMAGE } from "../../../../../../Constants/ConstantsVariables";

const Settings = ({ userId, profileData, previewImage }) => {
  const [imageError, setImageError] = useState(false);
  const [localPreviewImage, setLocalPreviewImage] = useState(previewImage);

  useEffect(() => {
    setLocalPreviewImage(previewImage);
  }, [previewImage]);

  const actualImage = !localPreviewImage || imageError ? DEFAULT_PROFILE_IMAGE : localPreviewImage;

  useEffect(() => {
    if (!previewImage) return;

    const img = new Image();
    img.src = previewImage;
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
  }, [previewImage]);

  const selectedAddress = Array.isArray(profileData?.address)
    ? profileData.address.find((addr) => addr._id === profileData?.selectedAddress)
    : {};


  return (
    <div className="body">
      <h6>Profile Photo</h6>
      <div className="media">
        <div className="media-left m-r-15" style={{ width: '140px', height: '140px', overflow: 'hidden' }}>
          <img
            src={actualImage}
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
                value={profileData?.name || ''}
                name="name"
                disabled
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <label className="fancy-radio mx-2">
                <input
                  name="gender"
                  value="male"
                  type="radio"
                  checked={profileData.gender?.trim().toLowerCase() === 'male'}
                  disabled
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
                  checked={profileData.gender?.trim().toLowerCase() === 'female'}
                  disabled
                />
                <span>
                  <i /> Female
                </span>
              </label>
            </div>
            <div className="form-group" >
              <label htmlFor="birthdate">Birthdate</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"><i className="fa fa-calendar"></i></span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  id="birthdate"
                  placeholder="Birthdate"
                  name="birthdate"
                  value={profileData?.birthdate || '' }
                  disabled
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                className="form-control"
                id="addressLine2"
                placeholder="Address Line 2"
                value={selectedAddress?.line2 || ''}
                name="address.line2"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="City"
                value={selectedAddress?.city || ''}
                name="address.city"
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                className="form-control"
                id="country"
                placeholder="Country"
                value={selectedAddress?.country || ''}
                name="address.country"
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
                value={profileData?.lastName || ''}
                name="lastName"
                disabled
              />
            </div>

            <div className="form-group" style={{ marginTop: "63px" }}>
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                type="text"
                className="form-control"
                id="addressLine1"
                placeholder="Address Line 1"
                value={selectedAddress?.line1 || ''}
                name="address.line1"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="landmark">Land Mark</label>
              <input
                type="text"
                className="form-control"
                id="landmark"
                placeholder="Land Mark"
                value={selectedAddress?.landmark || ''}
                name="address.landmark"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                className="form-control"
                id="state"
                placeholder="State/Province"
                value={selectedAddress?.state || ''}
                name="address.state"
                disabled
              />
            </div>


            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                className="form-control"
                id="pincode"
                placeholder="Pincode"
                value={selectedAddress?.pincode || ''}
                name="address.pincode"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                fdprocessedid="du108l"
                name="username"
                value={profileData?.username || ''}
                disabled
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
                value={profileData?.phone || ''}
                disabled
                name="phone"
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                name="email"
                value={profileData?.email || ''}
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
            {/* <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="input-group">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="form-control"
                id="currentPassword"
                placeholder="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                disabled
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
          </div> */}
            {/* <div className="form-group">
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
          </div> */}
            {/* <div className="form-group">
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
          </div> */}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            className="form-control"
            id="bio"
            placeholder="Bio"
            value={profileData?.bio || ''}
            name="bio"
            disabled
            rows={3}
          />
        </div>
      </div>
      {/* <ArtistInfo userId={userId} /> */}

      < Verification userId={userId} />

      <BankDetails
        userId={userId} />

      <SocialMedia
        userId={userId}
        profileData={profileData} />


      <Notification
        userId={userId} />

      <Agreement
        userId={userId} />


    </div>
  );
};

export default Settings;