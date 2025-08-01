import React, { useState,useEffect,useRef } from 'react';
import BusinessProfile from "./BusinessProfile";
import SocialMedia from "./SocialMediaPromotion";
import BankDetails from "./BankandPaymentDetails"
import ArtworkDetails from "./ArtworkSellingDetails"
import Agreement from "./Agreements"
import TaxCompliance from "./TaxLegalCompliance"
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";
import { DEFAULT_PROFILE_IMAGE } from "../../../../../Constants/ConstantsVariables";
import getAPI from '../../../../../api/getAPI';


const Settings = ({ userId, profileData, previewImage, handleImageUpload, handleChange, handleAddressChange, handleSubmit, passwordData, handlePasswordChange }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
  const [localPreviewImage, setLocalPreviewImage] = useState(previewImage);

  const fileInputRef = useRef(null); 

  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false); 
  const [allUsernames, setAllUsernames] = useState([]);
  const [originalUsername, setOriginalUsername] = useState('');
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const usernameCheckTimeout = useRef(null);


const actualImage = !localPreviewImage || imageError ? DEFAULT_PROFILE_IMAGE : localPreviewImage;

 useEffect(() => {
    if (!previewImage) {
      setIsImageLoaded(true);
      return;
    }

    const img = new Image();
    img.src = previewImage;
    img.onload = () => {
      setImageError(false);
      setIsImageLoaded(true);
    };
    img.onerror = () => {
      setImageError(true);
      setIsImageLoaded(true);
    };
  }, [previewImage]);

  useEffect(() => {
    setLocalPreviewImage(previewImage); 
  }, [previewImage]);


const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token || !userId) {
        toast.error('Please log in again.');
        return;
      }

      setLoading(true);

      await putAPI(
        `/auth/users/${userId}`,
        { profilePhoto: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setLocalPreviewImage(null); 

      toast.success('Profile image deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile image:', error.response?.data || error.message);
      toast.error(error?.response?.data?.message || 'Failed to delete profile image');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (setter, currentState) => {
    setter(!currentState);
  };

  const validateRequired = () => {
    const missing = [];
    const requiredMap = {
      'First Name'        : profileData.name,
      'Last Name'         : profileData.lastName,
      'Birthdate'         : profileData.birthdate,
      'Gender'            : profileData.gender,
      'Address Line 1'    : profileData.address?.line1,
    'Address Line 2'    : profileData.address?.line2,
    'Pincode'          : profileData.address?.pincode,
      'City'              : profileData.address?.city,
      'State/Province'    : profileData.address?.state,
      'Country'           : profileData.address?.country,
      'Username'          : profileData.username,
      'Email'             : profileData.email,
      'Phone Number'      : profileData.phone,
      'Bio'               : profileData.bio,
    };
  
    Object.entries(requiredMap).forEach(([label, value]) => {
      if (!value || String(value).trim() === '') missing.push(label);
    });
  
    if (missing.length) {
      toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };
  
    useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const res = await getAPI('/auth/all-usernames'); 
        setAllUsernames(res.data?.usernames || []);
        console.log("All usernames from backend:", res.data?.usernames || []);
      } catch (err) {
        console.error("Failed to fetch usernames", err);
      }
    };

    fetchUsernames();
  }, []);


  const handleLiveUsernameCheck = (username) => {
    const typed = username.trim().toLowerCase();

    if (!typed) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameCheckLoading(true);
    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }

    usernameCheckTimeout.current = setTimeout(() => {
      const isTaken = allUsernames
        .filter((uname) => uname && uname.trim().toLowerCase() !== originalUsername) // ignore user's current username
        .some((uname) => uname.trim().toLowerCase() === typed);

      setUsernameAvailable(!isTaken);
      setUsernameCheckLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (profileData.username) {
      setOriginalUsername(profileData.username.trim().toLowerCase());
    }
  }, [profileData.username]);


  return (
    <div className="body">
      <h5>Business Logo</h5>
      <div className="media">
        <div className="media-left m-r-15" style={{ width: '140px', height: '140px', overflow: 'hidden',position: 'relative' }}>
          {isImageLoaded && (
            <img
              src={actualImage}
              alt="User"
              className="user-photo media-object"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          )}

        {isImageLoaded && actualImage !== DEFAULT_PROFILE_IMAGE && !imageError && (
            <button
              onClick={handleDeleteImage}
              style={{
                position: 'absolute',
                bottom: '3px',
                right: '3px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: 'none',
                transition: 'transform 0.1s ease-in-out',
                zIndex: 2
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Delete photo"
            >
              <i className="fa fa-trash" />
            </button>
          )}
        </div>
        <div className="media-body">
          <p>Upload your logo.<br /> <em>Logo should be at least 140px x 140px</em></p>
          <button
            type="button"
            className="btn btn-default"
            id="btn-upload-photo"
            onClick={() => document.getElementById('filePhoto').click()}
          >
            Upload Logo
          </button>
          <input
            type="file"
            id="filePhoto"
            className="sr-only"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </div>
      </div>

      <div className="body">
        <h5 className="mb-2">Basic Information</h5>
        <hr className="mt-1" />
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="firstName">First Name <span style={{ color: 'red' }}>*</span></label>
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
            <div className="form-group">
              <label>Gender <span style={{ color: 'red' }}>*</span></label>
              <label className="fancy-radio mx-2">
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
            <div className="form-group" >
              <label htmlFor="birthdate">Birthdate <span style={{ color: 'red' }}>*</span></label>
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
                  value={profileData.birthdate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2 <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="addressLine2"
                placeholder="Address Line 2"
                value={profileData.address?.line2}
                name="address.line2"
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="City"
                value={profileData.address?.city}
                name="address.city"
                onChange={handleAddressChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="country"
                placeholder="Country"
                value={profileData.address?.country}
                name="address.country"
                onChange={handleAddressChange}
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="lastName">Last Name <span style={{ color: 'red' }}>*</span></label>
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

            <div className="form-group" style={{ marginTop: "63px" }}>
              <label htmlFor="addressLine1">Address Line 1 <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="addressLine1"
                placeholder="Address Line 1"
                value={profileData.address?.line1}
                name="address.line1"
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="landmark">Land Mark</label>
              <input
                type="text"
                className="form-control"
                id="landmark"
                placeholder="Land Mark"
                value={profileData.address?.landmark}
                name="address.landmark"
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="state"
                placeholder="State/Province"
                value={profileData.address?.state}
                name="address.state"
                onChange={handleAddressChange}
              />
            </div>


            <div className="form-group">
              <label htmlFor="pincode">Pincode <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="pincode"
                placeholder="Pincode"
                value={profileData.address?.pincode}
                name="address.pincode"
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12">
            <div className="form-group">
              <label htmlFor="username">Username <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                fdprocessedid="du108l"
                name="username"
                value={profileData.username}
                onChange={(e) => {
                  const lowercaseValue = e.target.value.toLowerCase();
                  handleChange({ target: { name: e.target.name, value: lowercaseValue } });
                  handleLiveUsernameCheck(lowercaseValue);
                }}
              />
              {usernameCheckLoading && (
                <small className="text-muted">Checking availability...</small>
              )}
              {usernameAvailable === true && (
                <small className="text-success">Username is available</small>
              )}
              {usernameAvailable === false && (
                <small className="text-danger">Username is already taken</small>
              )}
           
            </div>
            <div className="form-group">
              <label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></label>
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
              <label htmlFor="phone">Phone Number <span style={{ color: 'red' }}>*</span></label>
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
        <div className="form-group">
          <label htmlFor="bio">Bio <span style={{ color: 'red' }}>*</span></label>
          <textarea
            className="form-control"
            id="bio"
            placeholder="Bio"
            value={profileData.bio}
            name="bio"
            onChange={handleChange}
            rows={3}
          />
        </div>
        <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading || usernameAvailable === false}
          onClick={async (e) => {
            if (!validateRequired()) return;

            setLoading(true);
            try {
              await handleSubmit(e); 

              toast.success("Profile updated successfully!");
              window.location.reload(); 
            } catch (err) {
              console.error("Update failed:", err);

             
              const backendMsg = err?.response?.data?.message || "Failed to update profile";
              toast.error(backendMsg);
            } finally {
              setLoading(false);
            }
          }}
        >{loading ? "Updating..." : "Update"}</button>
      </div>
      <BusinessProfile userId={userId} />

      {/* < Verification userId={userId} /> */}

        < TaxCompliance userId={userId} />
  

      <ArtworkDetails
        userId={userId} />

      <BankDetails
        userId={userId} />

      <SocialMedia
        userId={userId}
        profileData={profileData} />

      <Agreement
        userId={userId} />


    </div>
  );
};

export default Settings;