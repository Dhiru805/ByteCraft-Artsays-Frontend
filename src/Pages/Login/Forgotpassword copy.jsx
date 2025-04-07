import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginStyles.css';
import { FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification, 3: New password
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate email format
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && !email.match(/^[0-9]{10}$/)) {
        throw new Error('Please enter a valid email or phone number');
      }

      const response = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      toast.success('OTP sent successfully!');
      setStep(2);
    } catch (error) {
      console.error('Error:', error.message);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      const response = await fetch('http://localhost:3001/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      toast.success('OTP verified successfully!');
      setStep(3);
    } catch (error) {
      console.error('Error:', error.message);
      toast.error(error.message || 'Invalid OTP. Please try again.');
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

      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Error:', error.message);
      toast.error(error.message || 'Something went wrong. Please try again.');
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

          <h2 className="fw-bold mb-3 mb-md-4 text-dark fs-2 fs-md-1">
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
          </h2>
          
          <p className="mb-3 mb-md-4 text-dark text-center"
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              lineHeight: '1.4',
            }}
          >
            {step === 1 ? "Enter your email or phone number to receive a verification code" : 
             step === 2 ? "We've sent a 6-digit code to your email/phone" : 
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
                  Email/Phone
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
                  type="password"
                  className="form-control"
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ height: '48px', border: "1px solid #6b4f36", fontSize: "16px", color: "black" }}
                />
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
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>

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
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;