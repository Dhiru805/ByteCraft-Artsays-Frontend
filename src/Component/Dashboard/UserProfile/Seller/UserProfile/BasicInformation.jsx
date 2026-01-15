import React, { useState, useEffect, useRef } from 'react';
import BusinessProfile from "./BusinessProfile";
import { FaPlus, FaCheck } from "react-icons/fa";
import SocialMedia from "./SocialMediaPromotion";
import BankDetails from "./BankandPaymentDetails"
import ArtworkDetails from "./ArtworkSellingDetails"
import Agreement from "./Agreements"
import TaxCompliance from "./TaxLegalCompliance"
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";
import { DEFAULT_PROFILE_IMAGE } from "../../../../../Constants/ConstantsVariables";
import getAPI from '../../../../../api/getAPI';
import postAPI from '../../../../../api/postAPI';
import AddressModal from './AddressModal'


const Settings = ({ userId, profileData, previewImage, handleImageUpload, handleChange, handleAddressChange, handleSubmit, passwordData, handlePasswordChange,fetchProfile }) => {
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
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');

  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);

  useEffect(() => {
    if (profileData) {
      setEmailVerified(profileData.emailVerified || false);
      setPhoneVerified(profileData.numberVerified || false);
      setOriginalEmail(profileData.email || '');
      setOriginalPhone(profileData.phone || '');
    }
  }, [profileData]);

  const handleEmailChangeLocal = (e) => {
    const newEmail = e.target.value;
    handleChange(e);
    if (newEmail !== originalEmail) {
      setEmailVerified(false);
    } else {
      setEmailVerified(profileData.emailVerified || false);
    }
  };

  const handlePhoneChangeLocal = (e) => {
    const newPhone = e.target.value;
    handleChange(e);
    if (newPhone !== originalPhone) {
      setPhoneVerified(false);
    } else {
      setPhoneVerified(profileData.numberVerified || false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!profileData.email) {
      toast.error('Please enter an email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      setSendingEmailOtp(true);
      const response = await postAPI('/auth/send-otp', { email: profileData.email, mode: 'profile', userId });
      if (response.data?.success) {
        toast.success('OTP sent to your email');
        setShowEmailOtpModal(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setVerifyingEmailOtp(true);
      const response = await postAPI('/auth/verify-otp', { email: profileData.email, otp: emailOtp });
      if (response.data?.success) {
        await putAPI(`/auth/users/${userId}`, { email: profileData.email, emailVerified: true });
        toast.success('Email verified successfully');
        setEmailVerified(true);
        setOriginalEmail(profileData.email);
        setShowEmailOtpModal(false);
        setEmailOtp('');
        fetchProfile();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!profileData.phone) {
      toast.error('Please enter a phone number');
      return;
    }
    const cleanPhone = profileData.phone.replace(/\D/g, '').replace(/^(\+91|91)/, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    try {
      setSendingPhoneOtp(true);
      const response = await postAPI('/auth/send-otp', { phone: profileData.phone, mode: 'profile', userId });
      if (response.data?.success) {
        toast.success('OTP sent to your phone');
        setShowPhoneOtpModal(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setVerifyingPhoneOtp(true);
      const response = await postAPI('/auth/verify-otp', { phone: profileData.phone, otp: phoneOtp });
      if (response.data?.success) {
        await putAPI(`/auth/users/${userId}`, { phone: profileData.phone, numberVerified: true });
        toast.success('Phone verified successfully');
        setPhoneVerified(true);
        setOriginalPhone(profileData.phone);
        setShowPhoneOtpModal(false);
        setPhoneOtp('');
        fetchProfile();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setVerifyingPhoneOtp(false);
    }
  };


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

  const openShippingModal = () => {
    setIsShippingModalOpen(true);
  };

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
            accept=".jpg,.jpeg,.png"
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
                disabled
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
                disabled
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
                disabled
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

                 <div className="form-group d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={openShippingModal} 
                          >
                            <FaPlus className="mr-1" /> Set  Address
                          </button>
                        </div>

            <div className="form-group" >
              <label htmlFor="addressLine1">Address Line 1 <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                id="addressLine1"
                placeholder="Address Line 1"
                value={profileData.address?.line1}
                name="address.line1"
                onChange={handleAddressChange}
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
                value={profileData.address?.landmark}
                name="address.landmark"
                onChange={handleAddressChange}
                disabled
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
                disabled
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
                disabled
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
                <div className="d-flex gap-2 align-items-center">
                  <div className="position-relative flex-grow-1">
                    <input
                      type="email"
                      className={`form-control`}
                      id="email"
                      placeholder="Email"
                      name="email"
                      value={profileData.email || ''}
                      onChange={handleEmailChangeLocal}
                      readOnly={emailVerified && profileData.email === originalEmail}
                      data-temp-mail-org={0}
                    />
                    {emailVerified && profileData.email === originalEmail && (
                      <span className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#28a745', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaCheck /> Verified
                      </span>
                    )}
                  </div>
                  {(!emailVerified || profileData.email !== originalEmail) && (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={sendingEmailOtp}
                      className="btn btn-primary btn-sm"
                      style={{ height: '38px', whiteSpace: 'nowrap' }}
                    >
                      {sendingEmailOtp ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number <span style={{ color: 'red' }}>*</span></label>
                <div className="d-flex gap-2 align-items-center">
                  <div className="position-relative flex-grow-1">
                    <input
                      type="text"
                      className={`form-control`}
                      id="phone"
                      placeholder="Phone Number"
                      value={profileData.phone || ''}
                      onChange={handlePhoneChangeLocal}
                      name="phone"
                      readOnly={phoneVerified && profileData.phone === originalPhone}
                    />
                    {phoneVerified && profileData.phone === originalPhone && (
                      <span className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#28a745', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaCheck /> Verified
                      </span>
                    )}
                  </div>
                  {(!phoneVerified || profileData.phone !== originalPhone) && (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={sendingPhoneOtp}
                      className="btn btn-primary btn-sm"
                      style={{ height: '38px', whiteSpace: 'nowrap' }}
                    >
                      {sendingPhoneOtp ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                </div>
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

        <AddressModal
          isOpen={isShippingModalOpen}
          onClose={() => setIsShippingModalOpen(false)}
          userId={userId}
           fetchProfile={fetchProfile}
        />

        {showEmailOtpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowEmailOtpModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', width: '100%', maxWidth: '400px', margin: '0 1rem' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Verify Email</h3>
              <p className="text-gray-600 mb-4" style={{ color: '#666', marginBottom: '1rem' }}>Enter the 6-digit OTP sent to {profileData.email}</p>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                className="form-control mb-4 text-center text-2xl tracking-widest"
                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}
                maxLength={6}
              />
              <div className="d-flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowEmailOtpModal(false); setEmailOtp(''); }}
                  className="btn btn-outline-secondary flex-grow-1"
                  style={{ flex: 1, marginRight: '0.5rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyEmailOtp}
                  disabled={verifyingEmailOtp || emailOtp.length !== 6}
                  className="btn btn-primary flex-grow-1 justify-content-center"
                  style={{ flex: 1 }}
                >
                  {verifyingEmailOtp ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              <button
                type="button"
                onClick={handleSendEmailOtp}
                disabled={sendingEmailOtp}
                className="btn btn-link w-100 mt-3"
                style={{ color: '#5C4033', textDecoration: 'underline', marginTop: '1rem', width: '100%' }}
              >
                {sendingEmailOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        {showPhoneOtpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowPhoneOtpModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', width: '100%', maxWidth: '400px', margin: '0 1rem' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Verify Phone</h3>
              <p className="text-gray-600 mb-4" style={{ color: '#666', marginBottom: '1rem' }}>Enter the 6-digit OTP sent to {profileData.phone}</p>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                className="form-control mb-4 text-center text-2xl tracking-widest"
                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}
                maxLength={6}
              />
              <div className="d-flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowPhoneOtpModal(false); setPhoneOtp(''); }}
                  className="btn btn-outline-secondary flex-grow-1"
                  style={{ flex: 1, marginRight: '0.5rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPhoneOtp}
                  disabled={verifyingPhoneOtp || phoneOtp.length !== 6}
                  className="btn btn-primary flex-grow-1 justify-content-center"
                  style={{ flex: 1 }}
                >
                  {verifyingPhoneOtp ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              <button
                type="button"
                onClick={handleSendPhoneOtp}
                disabled={sendingPhoneOtp}
                className="btn btn-link w-100 mt-3"
                style={{ color: '#5C4033', textDecoration: 'underline', marginTop: '1rem', width: '100%' }}
              >
                {sendingPhoneOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
      </div>

  );
};

export default Settings;