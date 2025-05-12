import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginStyles.css';
import postAPI from '../../api/postAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Please enter a valid email address');
      }

      await postAPI('/api/createotp', {
        email
      }, true);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (otp.length !== 6) {
        throw new Error('Please enter a 6-digit OTP');
      }

      await postAPI('/api/verifyotp', {
        email, otp
      });

      toast.success('OTP verified! Now set your new password');
      setStep(3);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await postAPI('/api/resetpassword', {
        email, otp, newPassword
      }, true);

      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-lg-row">
        {/* Left Panel */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn btn-link align-self-start mb-3 text-decoration-none"
              style={{ color: '#6b4f36', fontSize: '1rem' }}
            >
              {/* <FaArrowLeft className="me-2" /> Back */}
            </button>
          )}

          <h2 className="fw-bold mb-3 mb-md-4 text-dark fs-2 fs-md-1">
            {step === 1 ? 'Forgot Password' :
              step === 2 ? 'Verify OTP' :
                'Reset Password'}
          </h2>

          <p className="mb-3 mb-md-4 text-dark text-center"
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              lineHeight: '1.4',
            }}
          >
            {step === 1 ? "Enter your email to receive a verification code" :
              step === 2 ? "Check your email for the 6-digit verification code" :
                "Create a new password for your account"}
          </p>

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="w-100">
              <div className="mb-3 position-relative">
                <label htmlFor="email" className="form-label position-absolute text-dark px-2" style={{
                  top: '-12px',
                  left: '15px',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  zIndex: '1',
                  background: "white",
                }}>
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black" }}
                />
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fst-italic mb-3 mb-md-0 login-btn"
                style={{
                  backgroundColor: '#6b4f36',
                  fontSize: '1.1rem',
                  height: '48px',
                  transition: 'all 0.3s ease',
                  fontStyle: 'italic'
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="w-100">
              <div className="mb-3 position-relative">
                <label htmlFor="otp" className="form-label position-absolute text-dark px-2" style={{
                  top: '-12px',
                  left: '15px',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  zIndex: '1',
                  background: "white",
                }}>
                  OTP Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black" }}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fst-italic mb-3 mb-md-0 login-btn"
                style={{
                  backgroundColor: '#6b4f36',
                  fontSize: '1.1rem',
                  height: '48px',
                  transition: 'all 0.3s ease',
                  fontStyle: 'italic'
                }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="w-100">
              <div className="mb-3 position-relative">
                <label htmlFor="newPassword" className="form-label position-absolute text-dark px-2" style={{
                  top: '-12px',
                  left: '15px',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  zIndex: '1',
                  background: "white",
                }}>
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black" }}
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

              <div className="mb-3 position-relative">
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
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black" }}
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

              <button
                type="submit"
                className="btn w-100 text-white fst-italic mb-3 mb-md-0 login-btn"
                style={{
                  backgroundColor: '#6b4f36',
                  fontSize: '1.1rem',
                  height: '48px',
                  transition: 'all 0.3s ease',
                  fontStyle: 'italic'
                }}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>

        {/* Right Panel */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 text-white right-panel">
          <h3 className="mb-3 mb-md-4 fs-3 fs-md-2">Remember your password?</h3>
          <p className="mb-3 mb-md-4 text-center"
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              lineHeight: '1.4',
            }}>
            No worries! You can always <br className="d-none d-md-block" />login with your credentials.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-outline-light py-2 mt-2 mt-md-3 signup-btn"
            style={{
              width: '25%',
              fontSize: '20px',
              fontStyle: 'italic',
              border: '2px solid',
              transition: 'all 0.3s ease',
            }}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

