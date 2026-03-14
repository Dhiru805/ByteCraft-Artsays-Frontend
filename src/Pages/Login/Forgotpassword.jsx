import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

      await postAPI('/api/createotp', { email }, true);
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

      await postAPI('/api/verifyotp', { email, otp });
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

      await postAPI('/api/resetpassword', { email, otp, newPassword }, true);
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Forgot Password';
      case 2: return 'Verify OTP';
      case 3: return 'Reset Password';
      default: return 'Forgot Password';
    }
  };

  const getStepSubtitle = () => {
    switch(step) {
      case 1: return 'Enter your email to receive a verification code';
      case 2: return 'Check your email for the 6-digit verification code';
      case 3: return 'Create a new password for your account';
      default: return '';
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-page-wrapper">
        <div className="login-left-panel">
          <div className="login-form-container">
            <Link to="/" className="login-brand-logo">
              Artsays
            </Link>
            
            <h1 className="login-title">{getStepTitle()}</h1>
            <p className="login-subtitle">{getStepSubtitle()}</p>

            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="login-form-group">
                  <label htmlFor="email" className="login-form-label">Email</label>
                  <input
                    type="email"
                    className="login-form-input"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                  />
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="login-form-group">
                  <label htmlFor="otp" className="login-form-label">OTP Code</label>
                  <input
                    type="text"
                    className="login-form-input"
                    id="otp"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    style={{ textAlign: 'center', letterSpacing: '8px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  className="login-google-btn"
                  onClick={() => setStep(1)}
                  style={{ marginTop: '1rem' }}
                >
                  Back to Email
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="login-form-group">
                  <label htmlFor="newPassword" className="login-form-label">New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="login-form-input"
                      id="newPassword"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="login-form-group">
                  <label htmlFor="confirmPassword" className="login-form-label">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="login-form-input"
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  className="login-google-btn"
                  onClick={() => setStep(2)}
                  style={{ marginTop: '1rem' }}
                >
                  Back to OTP
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-decorative-shapes">
            <div className="login-shape login-shape-1"></div>
            <div className="login-shape login-shape-2"></div>
            <div className="login-shape login-shape-3"></div>
          </div>
          
          <div className="login-right-content">
            <h2 className="login-right-title">Remember Your Password?</h2>
            <p className="login-right-subtitle">
              No worries! You can always login with your credentials.
            </p>
            <Link to="/login" className="login-signup-btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
