import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Login/LoginStyles.css';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import postAPI from '../../api/postAPI';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    userType: 'Buyer',
    role: 'buyer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
  const { id, value } = e.target;
  let updatedValue = value;
  
  if (id === 'firstName' || id === 'lastName') {
    updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
  }

  setFormData({
    ...formData,
    [id]: updatedValue,
  });

  if (id === 'emailOrPhone' && isEmailVerified) {
    setIsEmailVerified(false);
    setShowOTPField(false);
  }
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
    if (!isValidEmail(formData.emailOrPhone)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoadingOTP(true);
      await postAPI('/auth/send-otp', { email: formData.emailOrPhone });
      setShowOTPField(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoadingOTP(true);
      const response = await postAPI('/auth/verify-otp', { 
        email: formData.emailOrPhone, 
        otp 
      });
      
      if (response.data.success) {
        setIsEmailVerified(true);
        setShowOTPField(false);
        setOtp('');
        toast.success("Email verified successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
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

    if (isEmail && !isEmailVerified) {
      toast.error("Please verify your email before signing up");
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
      delete payload.emailOrPhone;

      const response = await postAPI('/auth/createuser', payload);

      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
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
      <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-lg-row">
        <div className="col-12 col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center p-4 p-md-5 text-white right-panel-register">
          <h2 className="fw-bold mb-3 mb-md-4 fs-2 fs-md-1">Already Sign up?</h2>
          <p className="mb-3 mb-md-4 text-center"
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              lineHeight: '1.4',
            }}
          >
            Let's get you all set up so you can <br className="d-none d-md-block" />start creating your first onboarding experience.
          </p>
          <Link
            to="/login"
            className="btn btn-outline-light py-2 mt-2 mt-md-3 signup-btn"
            style={{
              width: '25%',
              fontSize: '20px',
              fontStyle: 'italic',
              border: '2px solid',
              transition: 'all 0.3s ease',
            }}
          >
            Sign In
          </Link>
        </div>

        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
          <h2 className="fw-bold mb-4 mb-md-3 text-dark fs-3 fs-md-1 text-center">Sign up for an Account</h2>
          <p className="mb-3 mb-md-4 text-dark text-center"
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              lineHeight: '1.4',
            }}
          >
            Let's get you all set up so you can <br className="d-none d-md-block" />start creating your first onboarding experience.
          </p>

          <form onSubmit={handleSubmit} className="w-100">
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="position-relative">
                  <label htmlFor="firstName" className="form-label position-absolute text-dark px-2" style={{
                    top: '-12px',
                    left: '15px',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    zIndex: '1',
                    background: "white",
                  }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black"}}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="position-relative">
                  <label htmlFor="lastName" className="form-label position-absolute text-dark px-2" style={{
                    top: '-12px',
                    left: '15px',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    zIndex: '1',
                    background: "white",
                  }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black" }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="emailOrPhone" className="form-label position-absolute text-dark px-2" style={{
                top: '-12px',
                left: '15px',
                fontStyle: 'italic',
                fontSize: '1rem',
                zIndex: '1',
                background: "white",
              }}>
                Email/Phone
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  id="emailOrPhone"
                  required
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  style={{
                    height: '48px',
                    border: "1px solid #6b4f36",
                    fontSize: "16px",
                    color: "black",
                    paddingRight: isValidEmail(formData.emailOrPhone) ? '50px' : '10px'
                  }}
                  disabled={isEmailVerified}
                />
                {isValidEmail(formData.emailOrPhone) && (
                  isEmailVerified ? (
                    <span
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#28a745',
                        fontSize: '18px'
                      }}
                    >
                      <FaCheck />
                    </span>
                  ) : (
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: "none",
                        background: "#6b4f36",
                        color: "white",
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onClick={handleSendOTP}
                      disabled={loadingOTP}
                    >
                      {loadingOTP ? 'Sending...' : 'Send OTP'}
                    </button>
                  )
                )}
              </div>
            </div>

            {showOTPField && !isEmailVerified && isValidEmail(formData.emailOrPhone) && (
              <div className="mb-3 position-relative">
                <label htmlFor="otp" className="form-label position-absolute text-dark px-2" style={{
                  top: '-12px',
                  left: '15px',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  zIndex: '1',
                  background: "white",
                }}>
                  Enter OTP
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    style={{
                      height: '48px',
                      border: "1px solid #6b4f36",
                      fontSize: "16px",
                      color: "black",
                      paddingRight: '80px'
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: "none",
                      background: "#6b4f36",
                      color: "white",
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={handleVerifyOTP}
                    disabled={loadingOTP || otp.length !== 6}
                  >
                    {loadingOTP ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="position-relative">
                  <label htmlFor="password" className="form-label position-absolute text-dark px-2" style={{
                    top: '-12px',
                    left: '15px',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    zIndex: '1',
                    background: "white",
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        height: '48px',
                        border: "1px solid #6b4f36",
                        fontSize: "16px",
                        color: "black",
                        paddingRight: '40px'
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: "none",
                        background: "transparent",
                        outline: "none",
                        cursor: 'pointer',
                        color: '#6b4f36'
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="position-relative">
                  <label htmlFor="confirmPassword" className="form-label position-absolute text-dark px-2" style={{
                    top: '-12px',
                    left: '15px',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    zIndex: '1',
                    background: "white",
                  }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{
                        height: '48px',
                        border: "1px solid #6b4f36",
                        fontSize: "16px",
                        color: "black",
                        paddingRight: '40px'
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: "none",
                        background: "transparent",
                        outline: "none",
                        cursor: 'pointer',
                        color: '#6b4f36'
                      }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-start align-items-center mb-3 mb-md-4">
              <div className="form-check">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  required
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #6b4f36',
                    borderRadius: '25%',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundColor: acceptTerms ? '#6b4f36' : 'transparent'
                  }}
                />
                <label className="form-check-label text-dark fst-italic" htmlFor="acceptTerms" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                  I accept&nbsp;      
                  <a href="/terms-services" target="_blank" rel="noopener noreferrer" style={{ color: '#6b4f36', textDecoration: 'underline' }}>
                    Terms & Conditions
                  </a> 
                  <span style={{ color: 'red' }}> *</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fst-italic mb-3 mb-md-0 register-btn"
              style={{
                backgroundColor: '#6b4f36',
                fontSize: '1.1rem',
                height: '48px',
                transition: 'all 0.3s ease',
                fontStyle: 'italic',
                opacity: isValidEmail(formData.emailOrPhone) && !isEmailVerified ? 0.6 : 1
              }}
              disabled={loadingSubmit || (isValidEmail(formData.emailOrPhone) && !isEmailVerified)}
            >
              {loadingSubmit ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="d-flex justify-content-center align-items-center my-3 w-100">
            <span className="text-dark" style={{
              fontSize: '1.0rem',
            }}
            >
              OR
            </span>
          </div>
          <Link
            to="/artist-seller-register"
            type="button"
            className="btn w-100 d-flex align-items-center justify-content-center artist-seller-register-btn"
            style={{
              border: '1px solid #6b4f36',
              fontSize: '1.1rem',
              height: '48px',
              transition: 'all 0.3s ease',
              fontStyle: 'italic',
              color: '#6b4f36',
              backgroundColor: 'white'
            }}
            >
            Register to Become an Artist or Seller
          </Link>
        </div>
        <div className="d-block d-md-none">
          <div className="mobile-signup-section text-center">
            <h3 className="mb-4 fs-4">Already Signed up?</h3>
            <p className="mb-4 fs-5">
              Let's get you all set up so you can <br /> start creating your first
              onboarding experience.
            </p>
            <Link
              to="/login"
              className="btn btn-outline-light py-2 mt-2 mt-md-3 signup-btn"
              style={{
                width: '25%',
                fontSize: '20px',
                fontStyle: 'italic',
                border: '2px solid',
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;