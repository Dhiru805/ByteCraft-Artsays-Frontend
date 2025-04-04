import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginStyles.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmailOrPhone = localStorage.getItem('rememberedEmailOrPhone');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
  
    if (savedRememberMe && savedEmailOrPhone && savedPassword) {
      setInput(savedEmailOrPhone);
      setPassword(savedPassword);
      setRememberMe(savedRememberMe);
    }
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (token && userType) {
      navigate(`/${userType}/Dashboard`);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: input, password }),
      });
  
      const data = await response.json();
  
      const { token, userType, email } = data;
  
      if (!token || !userType || !email) {
        throw new Error('Invalid response from server');
      }
  
      // Handle Remember Me FIRST
      if (rememberMe) {
        localStorage.setItem('rememberedEmailOrPhone', input);
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmailOrPhone');
        localStorage.removeItem('rememberedPassword');
        localStorage.setItem('rememberMe', 'false');
      }
  
  
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('email', email);
  
      toast.success('Login Successful!');
      navigate(`/${userType}/Dashboard`);
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error(`Error logging in: ${error.message}`);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-lg-row">
        {/* Left Panel */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
          <h2 className="fw-bold mb-3 mb-md-4 text-dark fs-2 fs-md-1">Login to your Account</h2>
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
            <div className="mb-3 position-relative">
              <label htmlFor="email" className="form-label position-absolute  text-dark px-2" style={{
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ height: '48px', border: "1px solid #6b4f36 ", fontSize: "16px", color: "black" }}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label position-absolute  text-dark  px-2" style={{
                top: '-12px',
                left: '15px',
                fontStyle: 'italic',
                fontSize: '1rem',
                zIndex: '1',
                background: "white",
              }}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control py-3"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ height: '48px', border: "1px solid #6b4f36 ", fontSize: "16px", color: "black" }}
              />
              <button
                type="button"
                style={{ border: "none", background: "transparent", outline: "none" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mb-md-4">
              <div className="form-check mb-2 mb-sm-0">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #6b4f36',
                    borderRadius: '25%',
                    appearance: 'none',
                  }}
                />
                <label className="form-check-label text-dark fst-italic" htmlFor="remember" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                  Remember Me
                </label>
              </div>
              <a href="#" className="text-decoration-none" style={{ color: '#6b4f36', fontSize: '1rem' }}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn w-100  text-white fst-italic mb-3 mb-md-0 login-btn"
              style={{
                backgroundColor: '#6b4f36',
                fontSize: '1.1rem',
                height: '48px',
                transition: 'all 0.3s ease',
              }}
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 text-white right-panel">
          <h3 className="mb-3 mb-md-4 fs-3 fs-md-2">Don't Have An Account?</h3>
          <p className="mb-3 mb-md-4  text-center"
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              lineHeight: '1.4',
            }}>
            Let's get you all set up so you can <br className="d-none d-md-block" />start creating your first onboarding experience.
          </p>
          <Link
            to="/register"
            className="btn btn-outline-light py-2 mt-2 mt-md-3 signup-btn"
            style={{
              width: '25%',
              fontSize: '20px',
              fontStyle: 'italic',
              border: '2px solid',
              transition: 'all 0.3s ease',
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;