import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../api/apiConfig";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../styles/login.scss";

const Login: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /* Splash screen timer */
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /* Error popup handler */
  const showErrorPopup = (message: string) => {
    setErrorMsg(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  /* Login submit */
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!emailOrMobile || !password) {
      showErrorPopup("Email/Mobile and Password are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", emailOrMobile);
      formData.append("password", password);

      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        showErrorPopup(data.detail || "Login failed");
        return;
      }

      // 🔥 FIXED: Pass both token and user data to login function
      // Assuming API returns: { access_token, user: { name, email, ... } }
      login(data.access_token, data.user || { 
        name: data.name || emailOrMobile.split('@')[0],
        email: data.email || emailOrMobile 
      });

      // ✅ Redirect without reloading
      navigate("/");
    } catch (error) {
      showErrorPopup("Server not reachable");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Splash Screen */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <h1 className="splash-title">All-in-one HR Platform</h1>
            <div className="splash-loader"></div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && <div className="error-popup">{errorMsg}</div>}

      <div className={`login-container ${!showSplash ? "show" : ""}`}>
        {/* Left Section */}
        <div className="login-left">
          <div className="animated-image">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>

            <div className="illustration">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7QzRyJw07jCCQs0aS34TRBG8Wal49-fF4_Q&s"
                alt="HR Illustration"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
            </div>

            <h2 className="left-title">All-in-one HR Platform</h2>
            <p className="left-subtitle">Manage your workforce efficiently</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-title">Sign In</h2>
            <p className="login-subtitle">
              Enter your credentials to access your account
            </p>

            <div className="login-form">
              <div className="form-group">
                <label>Email or Mobile</label>
                <input
                  type="text"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="Enter your email or mobile number"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">
                  Forgot Password?
                </a>
              </div>

              <button className="login-button" onClick={handleSubmit}>
                Sign In
              </button>
            </div>

            <div className="signup-redirect" style={{ marginTop: "1rem" }}>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;