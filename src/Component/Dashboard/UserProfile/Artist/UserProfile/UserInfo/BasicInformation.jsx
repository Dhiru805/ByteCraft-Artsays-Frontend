import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import ArtistInfo from "./ArtistProfessionalInfo";
import SocialMedia from "./SocialMediaPromotion";
import BankDetails from "./BankandPaymentDetails";
import ArtworkDetails from "./ArtworkListingdetails";
import Agreement from "./Agreements";
import Verification from "./Verifications";
import putAPI from "../../../../../../api/putAPI";
import { toast } from "react-toastify";
import { DEFAULT_PROFILE_IMAGE } from "../../../../../../Constants/ConstantsVariables";
import getAPI from "../../../../../../api/getAPI";
import AddressModal from "./AddressModal";
import postAPI from "../../../../../../api/postAPI";
import { FaCheck } from "react-icons/fa";

const Settings = ({
  userId,
  profileData,
  previewImage,
  handleImageUpload,
  handleChange,
  setProfileData,
  handleAddressChange,
  handleSubmit,
  passwordData,
  handlePasswordChange,
  fetchProfile,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [localPreviewImage, setLocalPreviewImage] = useState(previewImage);

  const fileInputRef = useRef(null);

  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const actualImage =
    !localPreviewImage || imageError
      ? DEFAULT_PROFILE_IMAGE
      : localPreviewImage;

  const [allUsernames, setAllUsernames] = useState([]);
  const [originalUsername, setOriginalUsername] = useState("");
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const usernameCheckTimeout = useRef(null);

  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingPhoneOTP, setLoadingPhoneOTP] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [showOTPField, setShowOTPField] = useState(false);
  const [showPhoneOTPField, setShowPhoneOTPField] = useState(false);

  useEffect(() => {
    if (profileData) {
      setIsEmailVerified(profileData.emailVerified);
      setIsPhoneVerified(profileData.numberVerified);
    }
  }, [profileData]);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const normalizePhone = (phone) => {
    if (!phone) return null;

    // Convert to string and remove all non-digits
    let digits = phone.toString().replace(/\D/g, "");

    // Remove leading country code if present
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }

    // Validate Indian mobile number length
    if (digits.length !== 10) return null;

    return `+91${digits}`;
  };

  const handleSendOTP = async () => {
    const input = profileData.email.trim();
    const isEmail = isValidEmail(input);

    if (!isEmail) {
      toast.error("Please enter a valid email ");
      return;
    }

    try {
      setLoadingOTP(true);

      const payload = { email: input };

      await postAPI("/auth/send-otp", payload);
      setShowOTPField(true);
      toast.success(`OTP sent to your email !`);

      setIsEmailVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingOTP(false);
    }
  };
  const handleSendOTPtoPhone = async () => {
    const input = profileData.phone.trim();
    const isPhone = isValidPhone(input);

    if (!isPhone) {
      toast.error("Please enter a valid  phone number");
      return;
    }

    try {
      setLoadingPhoneOTP(true);

      const payload = { phone: normalizePhone(input) };

      await postAPI("/auth/send-otp", payload);
      setShowPhoneOTPField(true);
      toast.success(`OTP sent to your number !`);

      setIsPhoneVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingPhoneOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    const input = profileData?.email.trim();
    const isEmail = isValidEmail(input);

    try {
      setLoadingOTP(true);

      if (isEmail) {
        const payload = { email: input, otp };

        const response = await postAPI("/auth/verify-otp", payload);

        if (response.data.success) {
          setIsEmailVerified(true)
          setProfileData((prev)=>({...prev,emailVerified:true}))
          toast.success("Email verified successfully!");

          setShowOTPField(false);
          setOtp("");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoadingOTP(false);
    }
  };
  const handleVerifyPhoneOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    const input = profileData?.phone.trim();
    const isPhone = isValidPhone(input);
    try {
      setLoadingPhoneOTP(true);

      if (isPhone) {
        const payload = { phone: normalizePhone(input), otp };

        const response = await postAPI("/auth/verify-otp", payload);

        if (response.data.success) {
          setIsPhoneVerified(true);
          setProfileData((pre)=>({...pre,numberVerified:true}))
          toast.success("Phone verified successfully!");
        }
        setShowPhoneOTPField(false);
        setOtp("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoadingPhoneOTP(false);
    }
  };

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
      if (!userId) {
        toast.error("Please log in again.");
        return;
      }

      setLoading(true);

      await putAPI(`/auth/users/${userId}`, { profilePhoto: null });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setLocalPreviewImage(null);

      toast.success("Profile image deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting profile image:",
        error.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message || "Failed to delete profile image"
      );
    } finally {
      setLoading(false);
    }
  };
  const validateRequired = () => {
    const missing = [];
    const requiredMap = {
      "First Name": profileData.name,
      "Last Name": profileData.lastName,
      Birthdate: profileData.birthdate,
      Gender: profileData.gender,
      "Address Line 1": profileData.address?.line1,
      "Address Line 2": profileData.address?.line2,
      Pincode: profileData.address?.pincode,
      City: profileData.address?.city,
      "State/Province": profileData.address?.state,
      Country: profileData.address?.country,
      Username: profileData.username,
      Email: profileData.email,
      "Phone Number": profileData.phone,
      Bio: profileData.bio,
    };

    Object.entries(requiredMap).forEach(([label, value]) => {
      if (!value || String(value).trim() === "") missing.push(label);
    });

    if (missing.length) {
      toast.warn(`Please fill the required fields: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = (setter, currentState) => {
    setter(!currentState);
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const res = await getAPI("/auth/all-usernames");
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
        .filter(
          (uname) => uname && uname.trim().toLowerCase() !== originalUsername
        ) // ignore user's current username
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
      <h6>Profile Photo</h6>
      <div className="media">
        <div
          className="media-left m-r-15"
          style={{
            width: "140px",
            height: "140px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {isImageLoaded && (
            <img
              src={actualImage}
              alt="User"
              className="user-photo media-object"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          )}

          {isImageLoaded &&
            actualImage !== DEFAULT_PROFILE_IMAGE &&
            !imageError && (
              <button
                onClick={handleDeleteImage}
                style={{
                  position: "absolute",
                  bottom: "3px",
                  right: "3px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "none",
                  transition: "transform 0.1s ease-in-out",
                  zIndex: 2,
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.9)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                title="Delete photo"
              >
                <i className="fa fa-trash" />
              </button>
            )}
        </div>
        <div className="media-body">
          <p>
            Upload your photo.
            <br /> <em>Image should be at least 140px x 140px</em>
          </p>
          <button
            type="button"
            className="btn btn-default"
            id="btn-upload-photo"
            onClick={() => document.getElementById("filePhoto").click()}
          >
            Upload Photo
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
              <label htmlFor="firstName">
                First Name <span style={{ color: "red" }}>*</span>
              </label>
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
              <label>
                Gender <span style={{ color: "red" }}>*</span>
              </label>
              <label className="fancy-radio mx-2">
                <input
                  name="gender"
                  value="male"
                  type="radio"
                  checked={profileData.gender === "male"}
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
                  checked={profileData.gender === "female"}
                  onChange={handleChange}
                />
                <span>
                  <i /> Female
                </span>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="birthdate">
                Birthdate <span style={{ color: "red" }}>*</span>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-calendar"></i>
                  </span>
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
              <label htmlFor="addressLine2">
                Address Line 2 <span style={{ color: "red" }}>*</span>
              </label>
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
              <label htmlFor="city">
                City <span style={{ color: "red" }}>*</span>
              </label>
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
              <label htmlFor="country">
                Country <span style={{ color: "red" }}>*</span>
              </label>
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
              <label htmlFor="lastName">
                Last Name <span style={{ color: "red" }}>*</span>
              </label>
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
                <FaPlus className="mr-1" /> Set Address
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">
                Address Line 1 <span style={{ color: "red" }}>*</span>
              </label>
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
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">
                State/Province <span style={{ color: "red" }}>*</span>
              </label>
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
              <label htmlFor="pincode">
                Pincode <span style={{ color: "red" }}>*</span>
              </label>
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
              <label htmlFor="username">
                Username <span style={{ color: "red" }}>*</span>
              </label>
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
                  handleChange({
                    target: { name: e.target.name, value: lowercaseValue },
                  });
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
              <label htmlFor="email">
                Email <span style={{ color: "red" }}>*</span>
              </label>
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
                  backgroundRepeat: "no-repeat",
                  backgroundSize: 20,
                  backgroundPosition: "97% center",
                  cursor: "auto",
                  paddingRight: isValidEmail(profileData.email)
                    ? "50px"
                    : "10px",
                }}
                data-temp-mail-org={0}
                fdprocessedid="yelneg"
                disabled={isEmailVerified}
              />
              {!isEmailVerified &&
                isValidEmail(profileData.email) &&
                !showOTPField && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loadingOTP}
                    style={{
                      position: "absolute",
                      right: "25px",
                      top: !showPhoneOTPField?"52%":"43%",
                      transform: "translateY(-44%)",
                      background: "#6b4f36",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "26px",
                      fontSize: "12px",
                    }}
                  >
                    {loadingOTP ? "Sending..." : "Send OTP"}
                  </button>
                )}

              {}
              {isEmailVerified && (
                <div
                  style={{
                    position: "absolute",
                    right: "26px",
                    top: !showPhoneOTPField ? "52%" : "43%",
                    transform: "translateY(-48%)",
                    color: "#28a745",
                    fontSize: "22px",
                  }}
                >
                  <FaCheck />
                </div>
              )}
            </div>
            {showOTPField && (
              <div className="mb-3 position-relative">
                <label
                  className="form-label position-absolute text-dark px-2"
                  style={{
                    top: "-12px",
                    left: "15px",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                    zIndex: "1",
                    background: "white",
                  }}
                >
                  Enter OTP
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    maxLength={6}
                    // style={{
                    //   height: '48px',
                    //   border: "1px solid #6b4f36",
                    //   fontSize: "20px",
                    //   letterSpacing: '10px'
                    // }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={loadingOTP || otp.length !== 6}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "52%",
                      transform: "translateY(-44%)",
                      background: "#6b4f36",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "26px",
                      fontSize: "12px",
                    }}
                  >
                    Enter OTP
                  </button>
                </div>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="phone">
                Phone Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Phone Number"
                fdprocessedid="eszxtb"
                value={profileData.phone}
                onChange={handleChange}
                name="phone"
                disabled={isPhoneVerified}
                style={{
                  
                  paddingRight: isValidPhone(profileData.phone)
                    ? "50px"
                    : "10px",
                }}
              />
              {!isPhoneVerified &&
                isValidPhone(profileData.phone) &&
                !showPhoneOTPField && (
                  <button
                    type="button"
                    onClick={handleSendOTPtoPhone}
                    disabled={loadingPhoneOTP}
                    style={{
                      position: "absolute",
                      right: "25px",
                      top: "85%",
                      transform: "translateY(-44%)",
                      background: "#6b4f36",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "26px",
                      fontSize: "12px",
                    }}
                  >
                    {loadingPhoneOTP ? "Sending..." : "Send OTP"}
                  </button>
                )}
              {isPhoneVerified && (
                <div
                  style={{
                    position: "absolute",
                    right: "26px",
                    top: !showPhoneOTPField ? "52%" : "43%",
                    transform: "translateY(-48%)",
                    color: "#28a745",
                    fontSize: "22px",
                  }}
                >
                  <FaCheck />
                </div>
              )}
            </div>
            {showPhoneOTPField && (
              <div className="mb-3 position-relative">
                <label
                  className="form-label position-absolute text-dark px-2"
                  style={{
                    top: "-12px",
                    left: "15px",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                    zIndex: "1",
                    background: "white",
                  }}
                >
                  Enter OTP
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    maxLength={6}
                    // style={{
                    //   height: '48px',
                    //   border: "1px solid #6b4f36",
                    //   fontSize: "20px",
                    //   letterSpacing: '10px'
                    // }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPhoneOTP}
                    disabled={loadingPhoneOTP || otp.length !== 6}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "47%",
                      transform: "translateY(-44%)",
                      background: "#6b4f36",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "26px",
                      fontSize: "12px",
                    }}
                  >
                    Enter OTP
                  </button>
                </div>
              </div>
            )}
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
                    onClick={() =>
                      togglePasswordVisibility(
                        setShowCurrentPassword,
                        showCurrentPassword
                      )
                    }
                  >
                    <i
                      className={`fa ${
                        showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
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
                    onClick={() =>
                      togglePasswordVisibility(
                        setShowNewPassword,
                        showNewPassword
                      )
                    }
                  >
                    <i
                      className={`fa ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
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
                    onClick={() =>
                      togglePasswordVisibility(
                        setShowConfirmPassword,
                        showConfirmPassword
                      )
                    }
                  >
                    <i
                      className={`fa ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="bio">
            Bio <span style={{ color: "red" }}>*</span>
          </label>
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
        <button
          type="button"
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

              const backendMsg =
                err?.response?.data?.message || "Failed to update profile";
              toast.error(backendMsg);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
      <ArtistInfo userId={userId} />

      <Verification userId={userId} />

      <ArtworkDetails userId={userId} />

      <BankDetails userId={userId} />

      <SocialMedia userId={userId} profileData={profileData} />

      <Agreement userId={userId} />

      <AddressModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        userId={userId}
        fetchProfile={fetchProfile}
      />
    </div>
  );
};

export default Settings;
