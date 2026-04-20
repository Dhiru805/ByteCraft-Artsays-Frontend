import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Login/LoginStyles.css';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import postAPI from '../../api/postAPI';
import { useAuth } from '../../AuthContext';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    userType: 'Artist',
    role: 'artist',
    artistName: '',
    businessName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    let updatedValue = value;

    if (id === 'firstName' || id === 'lastName') {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1).trim();
    }
    if (id === 'emailOrPhone' || id === 'password') {
      updatedValue = value.trim();
    }

    setFormData({
      ...formData,
      [id]: updatedValue,
    });

    if (id === 'emailOrPhone') {
      if (isEmailVerified) setIsEmailVerified(false);
      if (isPhoneVerified) setIsPhoneVerified(false);
      setShowOTPField(false);
    }
  };

  const handleToggle = () => {
    const newIsBusiness = !isBusiness;
    setIsBusiness(newIsBusiness);
    setFormData({
      ...formData,
      userType: newIsBusiness ? 'Seller' : 'Artist',
      role: newIsBusiness ? 'seller' : 'artist',
      artistName: newIsBusiness ? '' : formData.artistName,
      businessName: newIsBusiness ? formData.businessName : ''
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const normalizePhone = (phone) => {
    return `+91${phone.replace(/^\+91/, '')}`;
  };

  const handleSendOTP = async () => {
    const input = formData.emailOrPhone.trim();
    const isEmail = isValidEmail(input);
    const isPhone = isValidPhone(input);

    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email or phone number");
      return;
    }

    try {
      setLoadingOTP(true);
      const payload = isEmail
        ? { email: input }
        : { phone: normalizePhone(input) };

      await postAPI('/auth/send-otp', payload);
      setShowOTPField(true);
      toast.success(`OTP sent to your ${isEmail ? 'email' : 'phone'}!`);
      setIsEmailVerified(false);
      setIsPhoneVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    const input = formData.emailOrPhone.trim();
    const isEmail = isValidEmail(input);

    try {
      setLoadingOTP(true);
      const payload = isEmail
        ? { email: input, otp }
        : { phone: normalizePhone(input), otp };

      const response = await postAPI('/auth/verify-otp', payload);

      if (response.data.success) {
        if (isEmail) {
          setIsEmailVerified(true);
          toast.success("Email verified successfully!");
        } else {
          setIsPhoneVerified(true);
          toast.success("Phone verified successfully!");
        }
        setShowOTPField(false);
        setOtp('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const requiredFields = ['firstName', 'lastName', 'emailOrPhone', 'password', 'confirmPassword'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        setLoadingSubmit(false);
        return;
      }
    }

    const isEmail = isValidEmail(formData.emailOrPhone);
    const isPhone = isValidPhone(formData.emailOrPhone);

    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email or phone number (10 digits with optional +91)");
      setLoadingSubmit(false);
      return;
    }

    if ((isEmail && !isEmailVerified) || (isPhone && !isPhoneVerified)) {
      toast.error("Please verify your email or phone with OTP first");
      setLoadingSubmit(false);
      return;
    }

    if (formData.userType === 'Artist' && !formData.artistName) {
      toast.error("Artist name is required");
      setLoadingSubmit(false);
      return;
    }

    if (formData.userType === 'Seller' && !formData.businessName) {
      toast.error("Business name is required");
      setLoadingSubmit(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      setLoadingSubmit(false);
      return;
    }

    if (!acceptTerms) {
      toast.error("You must accept the Terms and Conditions");
      setLoadingSubmit(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: isEmail ? formData.emailOrPhone : undefined,
        phone: isPhone ? normalizePhone(formData.emailOrPhone) : undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: formData.userType,
        role: formData.role
      };

      if (formData.userType === 'Artist') {
        payload.artistName = formData.artistName;
      } else if (formData.userType === 'Seller') {
        payload.businessName = formData.businessName;
      }

      const response = await postAPI('/auth/createuser', payload);
      toast.success(response.data.message || `${formData.userType} account created successfully!`);

      const { token, refreshToken, user } = response.data;

      if (token && user) {
        // Auto-login and redirect directly to profile page
        sessionStorage.setItem('showCompleteProfilePopup', 'true');
        login(
          token,
          user.userType,
          user.status,
          user.username || '',
          user.name,
          user.lastName,
          user.id,
          user.userrole || user.role,
          refreshToken
        );
        setTimeout(() => {
          navigate(`/${user.userType.toLowerCase()}/profile`);
        }, 800);
      } else {
        // Fallback: go to login if token not returned
        sessionStorage.setItem('showCompleteProfilePopup', 'true');
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-page-wrapper">
        <div className="login-right-panel" style={{ order: -1 }}>
          <div className="login-decorative-shapes">
            <div className="login-shape login-shape-1"></div>
            <div className="login-shape login-shape-2"></div>
            <div className="login-shape login-shape-3"></div>
          </div>
          <div className="login-right-content">
            <h2 className="login-right-title">Already Have An Account?</h2>
            <p className="login-right-subtitle">
              Let's get you all set up so you can start creating your first onboarding experience.
            </p>
            <Link to="/login" className="login-signup-btn">
              Sign In
            </Link>
          </div>
        </div>

        <div className="login-left-panel">
          <div className="login-form-container" style={{ maxWidth: '520px' }}>
            <Link to="/" className="login-brand-logo">
              Artsays
            </Link>
            
            <h1 className="login-title">Sign up for an Account</h1>
            <p className="login-subtitle">
              Let's get you all set up so you can start creating your first onboarding experience.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="login-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="firstName" className="login-form-label">First Name</label>
                  <input
                    type="text"
                    className="login-form-input"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="login-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="lastName" className="login-form-label">Last Name</label>
                  <input
                    type="text"
                    className="login-form-input"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="emailOrPhone" className="login-form-label">Email or Phone</label>
                <div className="password-input-wrapper">
                  <input
                    type="text"
                    className="login-form-input"
                    id="emailOrPhone"
                    required
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    placeholder="example@gmail.com or +919876543210"
                    style={{ paddingRight: (isEmailVerified || isPhoneVerified) ? '50px' : '120px' }}
                    disabled={isEmailVerified || isPhoneVerified}
                  />
                  {!isEmailVerified && !isPhoneVerified && (isValidEmail(formData.emailOrPhone) || isValidPhone(formData.emailOrPhone)) && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loadingOTP}
                      className="password-toggle-btn"
                      style={{ 
                        background: 'linear-gradient(135deg, #6b4f36 0%, #8b6914 100%)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        width: 'auto'
                      }}
                    >
                      {loadingOTP ? 'Sending...' : 'Send OTP'}
                    </button>
                  )}
                  {(isEmailVerified || isPhoneVerified) && (
                    <span className="password-toggle-btn" style={{ color: '#28a745', fontSize: '20px' }}>
                      <FaCheck />
                    </span>
                  )}
                </div>
              </div>

              {showOTPField && (
                <div className="login-form-group">
                  <label className="login-form-label">Enter OTP</label>
                  <div className="password-input-wrapper">
                    <input
                      type="text"
                      className="login-form-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      style={{ textAlign: 'center', letterSpacing: '8px', paddingRight: '100px' }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={loadingOTP || otp.length !== 6}
                      className="password-toggle-btn"
                      style={{ 
                        background: 'linear-gradient(135deg, #6b4f36 0%, #8b6914 100%)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        width: 'auto'
                      }}
                    >
                      {loadingOTP ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  onClick={handleToggle}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    width: '200px',
                    height: '44px',
                    borderRadius: '22px',
                    border: '2px solid #e8e0d8',
                    cursor: 'pointer',
                    background: '#fdfcfb',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '100px',
                      height: '40px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #6b4f36 0%, #8b6914 100%)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: '600',
                      color: 'white',
                      fontSize: '14px',
                      left: isBusiness ? '98px' : '2px',
                      transition: 'all 0.3s ease',
                      zIndex: 2,
                      boxShadow: '0 4px 15px rgba(107, 79, 54, 0.3)'
                    }}
                  >
                    {isBusiness ? 'Seller' : 'Artist'}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-around',
                      zIndex: 1,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <span style={{ color: !isBusiness ? 'transparent' : '#6b4f36' }}>Artist</span>
                    <span style={{ color: isBusiness ? 'transparent' : '#6b4f36' }}>Seller</span>
                  </div>
                </div>
              </div>

              {!isBusiness ? (
                <div className="login-form-group">
                  <label htmlFor="artistName" className="login-form-label">Artist Name</label>
                  <input
                    type="text"
                    className="login-form-input"
                    id="artistName"
                    required
                    value={formData.artistName}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className="login-form-group">
                  <label htmlFor="businessName" className="login-form-label">Business Name</label>
                  <input
                    type="text"
                    className="login-form-input"
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="login-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="password" className="login-form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="login-form-input"
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      style={{ paddingRight: '50px' }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="login-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="confirmPassword" className="login-form-label">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="login-form-input"
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ paddingRight: '50px' }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="login-options-row" style={{ justifyContent: 'flex-start' }}>
                <div className="remember-me-wrapper">
                  <input
                    className="remember-me-checkbox"
                    type="checkbox"
                    id="acceptTerms"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label className="remember-me-label" htmlFor="acceptTerms" style={{ marginBottom: 0 }}>
                    I have read and agree to the{' '}
                    <a href="/policy" target="_blank" rel="noopener noreferrer" className="forgot-password-link">
                      Terms & Conditions.
                    </a>
                    <span style={{ color: 'red' }}> *</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loadingSubmit || (isValidEmail(formData.emailOrPhone) && !isEmailVerified) || (isValidPhone(formData.emailOrPhone) && !isPhoneVerified)}
                style={{
                  opacity: (isValidEmail(formData.emailOrPhone) && !isEmailVerified) || (isValidPhone(formData.emailOrPhone) && !isPhoneVerified) ? 0.6 : 1
                }}
              >
                {loadingSubmit ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="login-divider">
                <span className="login-divider-line"></span>
                <span className="login-divider-text">or</span>
                <span className="login-divider-line"></span>
              </div>

              <Link
                to="/register"
                className="login-google-btn"
                style={{ textDecoration: 'none', fontWeight: '600' }}
              >
                Register to Become a Buyer / Collector
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
