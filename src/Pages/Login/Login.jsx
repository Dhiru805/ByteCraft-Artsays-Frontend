import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginStyles.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import { SESSION_STATE } from "../../auth/SessionOrchestrator";
import postAPI from "../../api/postAPI";
import VerificationPopup from "./VerificationPopup";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";

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
  const { login, userType, status: userStatus, sessionState } = useAuth();

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

  // Load remembered credentials once on mount — no session dependency needed.
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe) {
      setRememberMe(true);
      setInput(localStorage.getItem("rememberedEmailOrPhone") || "");
      setPassword(localStorage.getItem("rememberedPassword") || "");
    }
  }, []);

  // Redirect away from /login only once the session is fully confirmed.
  // Guarding on SESSION_STATE.AUTHENTICATED prevents premature redirects while
  // the orchestrator is still refreshing an expired token (SOFT_EXPIRED / REFRESHING).
  useEffect(() => {
    if (sessionState !== SESSION_STATE.AUTHENTICATED) return;

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
        navigate("/");
      } else {
        navigate(`/${storedUserType.toLowerCase()}/dashboard`);
      }
    }
  }, [sessionState, navigate]);

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

          const {
            token,
            refreshToken,
            userType,
            email,
            userId,
            status,
            userrole,
            username,
            firstName,
            lastName,
          } = res.data;
          if (!token || !userType) {
            throw new Error("Invalid response from server");
          }

          const normalizedUserType = normalizeUserType(userType);
          const normalizedStatus = status
            ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            : null;

          login(
            token,
            normalizedUserType,
            normalizedStatus,
            username,
            firstName,
            lastName,
            userId,
            userrole,
            refreshToken
          );

        localStorage.setItem("email", email);

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
        } else if (
          (normalizedUserType === "Artist" || normalizedUserType === "Seller") &&
          (normalizedStatus === "Unverified" || normalizedStatus === "Rejected")
        ) {
          setShowPopup(true);
        } else {
          navigate(`/${normalizedUserType.toLowerCase()}/dashboard`);
        }
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
        const {
          token,
          refreshToken,
          userType,
          email,
          userId,
          status,
          userrole,
          username,
          firstName,
          lastName,
        } = res.data;
        console.log("Login API response:", {
          token,
          userType,
          email,
          userId,
          status,
          username,
        });

        if (!token || !userType) {
          throw new Error("Invalid response from server");
        }

        const normalizedUserType = normalizeUserType(userType);
        const normalizedStatus = status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : null;

        login(token, normalizedUserType, normalizedStatus, username, firstName, lastName, userId, userrole, refreshToken);

      localStorage.setItem("email", email);
      
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
      } else if (
        (normalizedUserType === "Artist" || normalizedUserType === "Seller") &&
        (normalizedStatus === "Unverified" || normalizedStatus === "Rejected")
      ) {
        setShowPopup(true);
      } else {
        navigate(`/${normalizedUserType.toLowerCase()}/dashboard`);
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
      
      <div className="login-page-wrapper">
        <div className="login-left-panel">
          <div className="login-form-container">
            <Link to="/" className="login-brand-logo">
              Artsays
            </Link>
            
            <h1 className="login-title">Login to your Account</h1>
            <p className="login-subtitle">
              Let's get you all set up so you can start creating your first onboarding experience.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="email" className="login-form-label">
                  Email/Phone
                </label>
                <input
                  type="text"
                  className="login-form-input"
                  id="email"
                  required
                  value={input}
                  onChange={(e) => setInput(e.target.value.trim())}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-form-label">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-form-input"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    style={{ paddingRight: "50px" }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-options-row">
                <div className="remember-me-wrapper">
                  <input
                    className="remember-me-checkbox"
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="remember-me-label" htmlFor="remember">
                    Remember Me
                  </label>
                </div>
                <Link to="/forgotpassword" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="login-divider">
                <span className="login-divider-line"></span>
                <span className="login-divider-text">or</span>
                <span className="login-divider-line"></span>
              </div>

              <button
                type="button"
                className="login-google-btn"
                onClick={() => loginWithGoogle()}
              >
                <FaGoogle size={20} />
                Login with Google
              </button>
            </form>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-decorative-shapes">
            <div className="login-shape login-shape-1"></div>
            <div className="login-shape login-shape-2"></div>
            <div className="login-shape login-shape-3"></div>
          </div>
          
          <div className="login-right-content">
            <h2 className="login-right-title">Don't Have An Account?</h2>
            <p className="login-right-subtitle">
              Let's get you all set up so you can start creating your first onboarding experience.
            </p>
            <Link to="/register" className="login-signup-btn">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {showPasswordPopup && (
        <div className="password-popup-overlay">
          <div className="password-popup-container">
            <h3 className="password-popup-title">Set Your Password</h3>
            <div className="login-form-group">
              <label htmlFor="google-password-input" className="login-form-label">
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="google-password-input"
                  placeholder="Enter password"
                  value={googlePassword}
                  onChange={(e) => setGooglePassword(e.target.value)}
                  className="login-form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPasswordPopup(false);
                toast.success("Password saved!");
              }}
              className="password-popup-btn password-popup-btn-primary"
            >
              Save Password
            </button>
            <button
              onClick={() => {
                setShowPasswordPopup(false);
                setGooglePassword("");
              }}
              className="password-popup-btn password-popup-btn-secondary"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
