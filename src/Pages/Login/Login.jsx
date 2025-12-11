// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './LoginStyles.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useAuth } from '../../AuthContext';
// import postAPI from '../../api/postAPI';
// import VerificationPopup from './VerificationPopup';

// const Login = () => {
//   const [input, setInput] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const navigate = useNavigate();
//   const { login, userType, status: userStatus } = useAuth();

//   const normalizeUserType = (userType) => {
//     const userTypeMap = {
//       'super-admin': 'Super-Admin',
//       'super_admin': 'Super-Admin',
//       'SUPER_ADMIN': 'Super-Admin',
//       'Super-Admin': 'Super-Admin',
//       'artist': 'Artist',
//       'ARTIST': 'Artist',
//       'buyer': 'Buyer',
//       'BUYER': 'Buyer',
//       'seller': 'Seller',
//       'SELLER': 'Seller',
//     };
//     return userTypeMap[userType.toLowerCase()] || userType;
//   };

//   useEffect(() => {
//     console.log('Login component mounted. Initial state:', {
//       userType,
//       userStatus,
//       localStorage: {
//         token: localStorage.getItem('token'),
//         userType: localStorage.getItem('userType'),
//         status: localStorage.getItem('status'),
//       },
//     });

//     const token = localStorage.getItem('token');
//     const storedUserType = localStorage.getItem('userType');
//     const storedStatus = localStorage.getItem('status');

//     if (token && storedUserType) {
//       if ((storedUserType === 'Artist' || storedUserType === 'Seller') && (storedStatus === 'Unverified' || storedStatus === 'Rejected')) {
//         setShowPopup(true);
//       } else if (storedUserType === 'Buyer') {
//         console.log('Navigating to / for Buyer');
//         navigate('/');
//       } else {
//         console.log('Navigating to dashboard:', `/${storedUserType.toLowerCase()}/dashboard`);
//         navigate(`/${storedUserType.toLowerCase()}/dashboard`);
//       }
//     } else {
//     }

//     const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
//     if (savedRememberMe) {
//       setRememberMe(true);
//       setInput(localStorage.getItem('rememberedEmailOrPhone') || '');
//       setPassword(localStorage.getItem('rememberedPassword') || '');
//     }
//   }, [navigate, userType, userStatus]);

//   useEffect(() => {
//     console.log('AuthContext updated:', { userType, userStatus });
//     if ((userType === 'Artist' || userType === 'Seller') && (userStatus === 'Unverified' || userStatus === 'Rejected')) {
//       setShowPopup(true);
//     } else {
//       setShowPopup(false);
//     }
//   }, [userType, userStatus]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await postAPI('/auth/login', {
//         emailOrPhone: input,
//         password,
//       }, true);

//       const { token, userType, email, userId, status } = res.data;
//       console.log('Login API response:', { token, userType, email, userId, status });

//       if (!token || !userType) {
//         throw new Error('Invalid response from server');
//       }

//       const normalizedUserType = normalizeUserType(userType);
//       const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : null;

//       login(token, normalizedUserType, normalizedStatus);

//       localStorage.setItem('token', token);
//       localStorage.setItem('userType', normalizedUserType);
//       localStorage.setItem('email', email);
//       localStorage.setItem('userId', userId);
//       localStorage.setItem('status', normalizedStatus);

//       console.log('localStorage after login:', {
//         token: localStorage.getItem('token'),
//         userType: localStorage.getItem('userType'),
//         status: localStorage.getItem('status'),
//       });

//       if (rememberMe) {
//         localStorage.setItem('rememberedEmailOrPhone', input);
//         localStorage.setItem('rememberedPassword', password);
//         localStorage.setItem('rememberMe', 'true');
//       } else {
//         localStorage.removeItem('rememberedEmailOrPhone');
//         localStorage.removeItem('rememberedPassword');
//         localStorage.setItem('rememberMe', 'false');
//       }

//       toast.success('Login Successful!');

//       if (normalizedUserType === 'Buyer') {
//         navigate('/');
//       } else if ((normalizedUserType === 'Artist' || normalizedUserType === 'Seller') && (normalizedStatus === 'Unverified' || normalizedStatus === 'Rejected')) {
//         setShowPopup(true);
//       } else {
//         navigate(`/${normalizedUserType.toLowerCase()}/dashboard`);
//       }
//     } catch (error) {
//       const message = error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
//       console.error('Login error:', message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <VerificationPopup show={showPopup} onHide={() => setShowPopup(false)} />
//       <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-lg-row">
//         <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
//           <h2 className="fw-bold mb-3 mb-md-4 text-dark fs-2 fs-md-1">Login to your Account</h2>
//           <p className="mb-3 mb-md-4 text-dark text-center" style={{ fontSize: '20px', fontWeight: 'normal', lineHeight: '1.4' }}>
//             Let's get you all set up so you can <br className="d-none d-md-block" />start creating your first onboarding experience.
//           </p>

//           <form onSubmit={handleSubmit} className="w-100">
//             <div className="mb-3 position-relative">
//               <label htmlFor="email" className="form-label position-absolute text-dark px-2"
//                 style={{ top: '-12px', left: '15px', fontStyle: 'italic', fontSize: '1rem', zIndex: '1', background: 'white' }}>
//                 Email/Phone
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="email"
//                 required
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 style={{ height: '48px', border: '1px solid #6b4f36', fontSize: '16px', color: 'black' }}
//               />
//             </div>

//             <div className="mb-3 position-relative">
//               <label htmlFor="password" className="form-label position-absolute text-dark px-2"
//                 style={{ top: '-12px', left: '15px', fontStyle: 'italic', fontSize: '1rem', zIndex: '1', background: 'white' }}>
//                 Password
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   className="form-control"
//                   id="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={{ height: '48px', border: '1px solid #6b4f36', fontSize: '16px', color: 'black', paddingRight: '40px' }}
//                 />
//                 <button
//                   type="button"
//                   style={{
//                     position: 'absolute',
//                     right: '10px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     border: 'none',
//                     background: 'transparent',
//                     outline: 'none',
//                     cursor: 'pointer',
//                     color: '#6b4f36'
//                   }}
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? 'Hide password' : 'Show password'}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mb-md-4">
//               <div className="form-check mb-2 mb-sm-0">
//                 <input
//                   className="form-check-input me-2"
//                   type="checkbox"
//                   id="remember"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   style={{
//                     width: '16px',
//                     height: '16px',
//                     border: '2px solid #6b4f36',
//                     borderRadius: '25%',
//                     appearance: 'none',
//                     cursor: 'pointer',
//                     backgroundColor: rememberMe ? '#6b4f36' : 'transparent'
//                   }}
//                 />
//                 <label className="form-check-label text-dark fst-italic" htmlFor="remember" style={{ fontSize: '1rem' }}>
//                   Remember Me
//                 </label>
//               </div>
//               <Link to="/forgotpassword" className="text-decoration-none" style={{ color: '#6b4f36', fontSize: '1rem' }}>
//                 Forgot Password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               className="btn w-100 text-white fst-italic mb-3 mb-md-0 login-btn"
//               style={{
//                 backgroundColor: '#6b4f36',
//                 fontSize: '1.1rem',
//                 height: '48px',
//                 transition: 'all 0.3s ease',
//                 fontStyle: 'italic'
//               }}
//               disabled={loading}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         </div>

//         <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 text-white right-panel">
//           <h3 className="mb-3 mb-md-4 fs-3 fs-md-2">Don't Have An Account?</h3>
//           <p className="mb-3 mb-md-4 text-center" style={{ fontSize: '20px', fontWeight: 'normal', lineHeight: '1.4' }}>
//             Let's get you all set up so you can <br className="d-none d-md-block" />start creating your first onboarding experience.
//           </p>
//           <Link
//             to="/register"
//             className="btn btn-outline-light py-2 mt-2 mt-md-3 signup-btn"
//             style={{
//               width: '25%',
//               fontSize: '20px',
//               fontStyle: 'italic',
//               border: '2px solid',
//               transition: 'all 0.3s ease',
//             }}
//           >
//             Sign Up
//           </Link >

//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginStyles.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import postAPI from "../../api/postAPI";
import VerificationPopup from "./VerificationPopup";
// import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
const Login = () => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [googlePassword, setGooglePassword] = useState("");
  const navigate = useNavigate();
  const { login, userType, status: userStatus } = useAuth();
  
  const normalizeUserType = (userType) => {
    const userTypeMap = {
      "super-admin": "Super-Admin",
      super_admin: "Super-Admin",
      SUPER_ADMIN: "Super-Admin",
      "Super-Admin": "Super-Admin",
      artist: "Artist",
      ARTIST: "Artist",
      buyer: "Buyer",
      BUYER: "Buyer",
      seller: "Seller",
      SELLER: "Seller",
    };
    return userTypeMap[userType.toLowerCase()] || userType;
  };

  useEffect(() => {
    console.log("Login component mounted. Initial state:", {
      userType,
      userStatus,
      localStorage: {
        token: localStorage.getItem("token"),
        userType: localStorage.getItem("userType"),
        status: localStorage.getItem("status"),
      },
    });

    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");
    const storedStatus = localStorage.getItem("status");

    if (token && storedUserType) {
      if (
        (storedUserType === "Artist" || storedUserType === "Seller") &&
        (storedStatus === "Unverified" || storedStatus === "Rejected")
      ) {
        setShowPopup(true);
      } else if (storedUserType === "Buyer") {
        console.log("Navigating to / for Buyer");
        navigate("/");
        window.location.reload();
      } else {
        console.log(
          "Navigating to dashboard:",
          `/${storedUserType.toLowerCase()}/dashboard`
        );
        navigate(`/${storedUserType.toLowerCase()}/dashboard`);
        window.location.reload();
      }
    }

    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe) {
      setRememberMe(true);
      setInput(localStorage.getItem("rememberedEmailOrPhone") || "");
      setPassword(localStorage.getItem("rememberedPassword") || "");
    }
  }, [navigate, userType, userStatus]);

  useEffect(() => {
    console.log("AuthContext updated:", { userType, userStatus });
    if (
      (userType === "Artist" || userType === "Seller") &&
      (userStatus === "Unverified" || userStatus === "Rejected")
    ) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [userType, userStatus]);

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log("Google login response", codeResponse);

      try {
        const { code } = codeResponse;
        const res = await postAPI("/auth/googlelogin", { code }, true);
        console.log("google login api response", res);

        const { token, userType, email, userId, status, userrole } = res.data;
        if (!token || !userType) {
          throw new Error("Invalid response from server");
        }

        const normalizedUserType = normalizeUserType(userType);
        const normalizedStatus = status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : null;

        login(token, normalizedUserType, normalizedStatus);

        localStorage.setItem("token", token);
        localStorage.setItem("userType", normalizedUserType);
        localStorage.setItem("email", email);
        localStorage.setItem("userId", userId);
        localStorage.setItem("status", normalizedStatus);
        localStorage.setItem("userrole", userrole);

        console.log("localStorage after login:", {
          token: localStorage.getItem("token"),
          userType: localStorage.getItem("userType"),
          status: localStorage.getItem("status"),
        });

        if (rememberMe) {
          localStorage.setItem("rememberedEmailOrPhone", input);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmailOrPhone");
          localStorage.removeItem("rememberedPassword");
          localStorage.setItem("rememberMe", "false");
        }

        toast.success("Login Successful!");
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Google Login Failed", error);
        toast.error(error?.response?.data?.message || "Google Login Failed");
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await postAPI(
        "/auth/login",
        {
          emailOrPhone: input,
          password,
        },
        true
      );

      const { token, userType, email, userId, status, userrole } = res.data;
      console.log("Login API response:", {
        token,
        userType,
        email,
        userId,
        status,
      });

      if (!token || !userType) {
        throw new Error("Invalid response from server");
      }

      const normalizedUserType = normalizeUserType(userType);
      const normalizedStatus = status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : null;

      login(token, normalizedUserType, normalizedStatus);

      localStorage.setItem("token", token);
      localStorage.setItem("userType", normalizedUserType);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userId);
      localStorage.setItem("status", normalizedStatus);
      localStorage.setItem("userrole", userrole);
      localStorage.setItem("name", res.data.name);

      console.log("localStorage after login:", {
        token: localStorage.getItem("token"),
        userType: localStorage.getItem("userType"),
        status: localStorage.getItem("status"),
      });

      if (rememberMe) {
        localStorage.setItem("rememberedEmailOrPhone", input);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmailOrPhone");
        localStorage.removeItem("rememberedPassword");
        localStorage.setItem("rememberMe", "false");
      }

      toast.success("Login Successful!");

      if (normalizedUserType === "Buyer") {
        navigate("/");
        window.location.reload();
      } else if (
        (normalizedUserType === "Artist" || normalizedUserType === "Seller") &&
        (normalizedStatus === "Unverified" || normalizedStatus === "Rejected")
      ) {
        setShowPopup(true);
      } else {
        navigate(`/${normalizedUserType.toLowerCase()}/dashboard`);
        window.location.reload();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      console.error("Login error:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <VerificationPopup show={showPopup} onHide={() => setShowPopup(false)} />
      <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-lg-row">
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
          <h2 className="fw-bold mb-3 mb-md-4 text-dark fs-2 fs-md-1">
            Login to your Account
          </h2>
          <p
            className="mb-3 mb-md-4 text-dark text-center"
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              lineHeight: "1.4",
            }}
          >
            Let's get you all set up so you can{" "}
            <br className="d-none d-md-block" />
            start creating your first onboarding experience.
          </p>

          <form onSubmit={handleSubmit} className="w-100">
            <div className="mb-3 position-relative">
              <label
                htmlFor="email"
                className="form-label position-absolute text-dark px-2"
                style={{
                  top: "-12px",
                  left: "15px",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  zIndex: "1",
                  background: "white",
                }}
              >
                Email/Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                required
                value={input}
                onChange={(e) => setInput(e.target.value.trim())}
                style={{
                  height: "48px",
                  border: "1px solid #6b4f36",
                  fontSize: "16px",
                  color: "black",
                }}
              />
            </div>

            <div className="mb-3 position-relative">
              <label
                htmlFor="password"
                className="form-label position-absolute text-dark px-2"
                style={{
                  top: "-12px",
                  left: "15px",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  zIndex: "1",
                  background: "white",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  style={{
                    height: "48px",
                    border: "1px solid #6b4f36",
                    fontSize: "16px",
                    color: "black",
                    paddingRight: "40px",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    cursor: "pointer",
                    color: "#6b4f36",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
                    width: "16px",
                    height: "16px",
                    border: "2px solid #6b4f36",
                    borderRadius: "25%",
                    appearance: "none",
                    cursor: "pointer",
                    backgroundColor: rememberMe ? "#6b4f36" : "transparent",
                  }}
                />
                <label
                  className="form-check-label text-dark fst-italic"
                  htmlFor="remember"
                  style={{ fontSize: "1rem" }}
                >
                  Remember Me
                </label>
              </div>
              <Link
                to="/forgotpassword"
                className="text-decoration-none"
                style={{ color: "#6b4f36", fontSize: "1rem" }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fst-italic mb-3 mb-md-0 login-btn"
              style={{
                backgroundColor: "#6b4f36",
                fontSize: "1.1rem",
                height: "48px",
                transition: "all 0.3s ease",
                fontStyle: "italic",
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              className="btn w-100 text-white fst-italic mb-3 mb-md-0 login-btn"
              style={{
                backgroundColor: "#6b4f36",
                fontSize: "1.1rem",
                height: "48px",
                transition: "all 0.3s ease",
                fontStyle: "italic",
                marginTop: "10px",
              }}
              onClick={() => loginWithGoogle()}
            >
              <FcGoogle size={22} />
              &nbsp; Continue with Google
            </button>
          </form>

          {/* Password Popup Modal */}
          {showPasswordPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              {/* Modal Container */}
              <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm mx-4 transition-all duration-300 transform scale-100 opacity-100">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                  Set Your Password
                </h3>

                {/* Password Input Field */}
                <div className="mb-6 relative">
                  <label
                    htmlFor="google-password-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="google-password-input"
                    placeholder="Enter password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition duration-150 text-gray-900"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/4 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => {
                    setShowPasswordPopup(false);
                    toast.success("Password saved!");
                  }}
                  className="w-full px-4 py-2 mb-3 bg-amber-800 text-white font-semibold rounded-md hover:bg-amber-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-800 focus:ring-offset-2"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordPopup(false);
                    setGooglePassword("");
                  }}
                  className="w-full px-4 py-2 text-amber-800 bg-gray-100 border border-gray-300 font-semibold rounded-md hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 text-white right-panel">
          <h3 className="mb-3 mb-md-4 fs-3 fs-md-2">Don't Have An Account?</h3>
          <p
            className="mb-3 mb-md-4 text-center"
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              lineHeight: "1.4",
            }}
          >
            Let's get you all set up so you can{" "}
            <br className="d-none d-md-block" />
            start creating your first onboarding experience.
          </p>
          <Link
            to="/register"
            className="btn btn-outline-light py-2 mt-2 mt-md-3 signup-btn"
            style={{
              width: "25%",
              fontSize: "20px",
              fontStyle: "italic",
              border: "2px solid",
              transition: "all 0.3s ease",
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