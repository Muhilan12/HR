import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../api/apiConfig";
import { Link } from "react-router-dom";
import "../styles/login.scss";

type MessageType = {
  text: string;
  type: "success" | "error" | "";
};

const Register = () => {
  const [showSplash, setShowSplash] = useState(true);

  const [message, setMessage] = useState<MessageType>({
    text: "",
    type: "",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* Splash screen timer */
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  /* Auto-hide message */
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Frontend validation */
    if (form.password !== form.confirmPassword) {
      setMessage({
        text: "Passwords do not match!",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      /* 🔥 IMPORTANT FIX – Convert backend errors to string */
      if (!res.ok) {
        let errorText = "Registration failed. Please try again.";

        if (typeof data.detail === "string") {
          errorText = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorText = data.detail.map((err: any) => err.msg).join(", ");
        }

        setMessage({
          text: errorText,
          type: "error",
        });
        return;
      }

      /* Success */
      setMessage({
        text: "Registration successful! Redirecting to login...",
        type: "success",
      });

      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage({
        text: "Network error. Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <div className="login-wrapper">
      {/* Message Popup - Right Side Center */}
      {message.text && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 9999,
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: message.type === "success" ? "#10b981" : "#ef4444",
              color: "white",
              padding: "16px 24px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: "300px",
              maxWidth: "400px",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {message.type === "success" ? "✓" : "✕"}
            </span>
            <span
              style={{
                fontSize: "15px",
                lineHeight: "1.5",
                flex: 1,
              }}
            >
              {message.text}
            </span>
            <button
              onClick={() => setMessage({ text: "", type: "" })}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateY(-50%) translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateY(-50%) translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Splash Screen */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <h1 className="splash-title">Create Account</h1>
            <div className="splash-loader"></div>
          </div>
        </div>
      )}

      {/* Main Container */}
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

            <h2 className="left-title">Join Us Today</h2>
            <p className="left-subtitle">
              Create your account and get started.....
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-title">Sign Up</h2>
            <p className="login-subtitle">
              Fill in the details to create your account
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    placeholder="Enter phone number"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    placeholder="Enter email"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    placeholder="Create password"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    placeholder="Confirm password"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-button">
                Create Account
              </button>
            </form>

            <div className="signup-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;