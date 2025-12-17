import { Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "../styles/Index.scss";
import Section from "./hero";
import Chart from "./chart";
import Advitisement from "./advitisement";
import Mail from "./mailcard";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../api/apiConfig";

/** Extend HTMLElement to support custom timeout property */
interface MouseTrackDiv extends HTMLDivElement {
  _timeoutId?: ReturnType<typeof setTimeout>;
}

// Extend EventTarget for inline event handlers
declare global {
  interface EventTarget {
    _timeoutId?: ReturnType<typeof setTimeout>;
  }
}

interface ProfileData {
  userId: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  designation: string;
  companyName: string;
  profileImage: string;
  createdOn: string;
  updatedOn: string;
}

const Index = () => {
  const [showTick, setShowTick] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // ✅ FIX: profile dropdown state
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // typed ref for mouse tracking
  const textContainerRef = useRef<MouseTrackDiv>(null);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching profile for Index...");
      
      const response = await fetch(API_ENDPOINTS.PROFILES, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Profile response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          setProfile(null);
          setProfileError("");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        console.log("Profile data received:", data);
        
        if (data.profile) {
          setProfile(data.profile);
          setProfileError("");
        } else {
          setProfile(null);
        }
      }
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setProfileError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when component mounts and token changes
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Show feedback button when user is logged in
  useEffect(() => {
    if (user) {
      setShowFeedbackButton(true);
    } else {
      setShowFeedbackButton(false);
    }
  }, [user]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!textContainerRef.current || !showContent) return;

    const target = textContainerRef.current;
    const rect = target.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    requestAnimationFrame(() => {
      target.style.setProperty("--mouse-x", `${x}%`);
      target.style.setProperty("--mouse-y", `${y}%`);
      target.classList.add("mouse-move-active");

      if (target._timeoutId) clearTimeout(target._timeoutId);

      target._timeoutId = setTimeout(() => {
        target.classList.remove("mouse-move-active");
      }, 1000);
    });
  };

  const handleMouseLeave = () => {
    const target = textContainerRef.current;
    if (target && target._timeoutId) {
      clearTimeout(target._timeoutId);
      target.classList.remove("mouse-move-active");
    }
  };

  useEffect(() => {
    return () => {
      const target = textContainerRef.current;
      if (target && target._timeoutId) {
        clearTimeout(target._timeoutId);
      }
    };
  }, []);

  const imageUrls = {
    avatarBlue:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    bulb:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
    location:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    shield:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    chat:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698",
    avatarYellow:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786",
    center:
      "https://images.unsplash.com/photo-1552664730-d307ca884978",
  };

  useEffect(() => {
    const imagePromises = Object.values(imageUrls).map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        })
    );

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => console.log("Some images failed to load"));

    const tickTimer = setTimeout(() => setShowTick(true), 1000);

    const tickInterval = setInterval(() => {
      setShowTick((prev) => !prev);
    }, 3000);

    const contentTimer = setTimeout(() => setShowContent(true), 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal");
        });
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => {
      clearTimeout(tickTimer);
      clearInterval(tickInterval);
      clearTimeout(contentTimer);
      observer.disconnect();
    };
  }, []);

  // Handle feedback button click
  const handleFeedbackClick = () => {
    navigate("/feedback");
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get profile image URL or fallback
  const getProfileImage = () => {
    if (profile?.profileImage) {
      // Check if it's a base64 data URL or regular URL
      if (profile.profileImage.startsWith('data:')) {
        return profile.profileImage;
      } else if (profile.profileImage.startsWith('http')) {
        return profile.profileImage;
      } else {
        // Assuming it's a relative path
        return `${window.location.origin}${profile.profileImage}`;
      }
    }
    return null;
  };

  // Handle logout with profile cleanup
  const handleLogout = () => {
    logout();
    setProfile(null);
    navigate("/login");
  };

  return (
    <>
      <div className="page-container">
        {/* ===== NAVBAR ===== */}
        <nav className="navbar">
          <div className="nav-wrapper">
            <Typography variant="h6" className="logo">
              CoreShift
            </Typography>

            <div className="nav-links">
              {["Product", "Features", "Pricing", "Resources"].map((item) => (
                <a key={item} href="#" className="nav-item">
                  <span>{item}</span>
                </a>
              ))}
            </div>

            {/* ===== AUTH SECTION ===== */}
            <div className="auth-section">
              {!user ? (
                <>
                  <span
                    className="signin"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </span>

                  <button
                    className="demo-btn"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="profile-wrapper"
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: profileOpen ? '#F3F4F6' : 'transparent',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!profileOpen) e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      if (!profileOpen) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div 
                      className="profile-circle"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: getProfileImage() 
                          ? 'transparent'
                          : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '16px',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                        transition: 'transform 0.2s',
                        transform: profileOpen ? 'scale(1.05)' : 'scale(1)',
                        overflow: 'hidden',
                        border: getProfileImage() ? '2px solid #3B82F6' : 'none',
                      }}
                    >
                      {getProfileImage() ? (
                        <img 
                          src={getProfileImage()!}
                          alt="Profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            // If image fails to load, show initials
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerText = getUserInitials();
                            e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)';
                          }}
                        />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                    
                    <span 
                      className="profile-name"
                      style={{
                        fontWeight: '600',
                        color: '#111827',
                        fontSize: '15px',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {profile?.name || user.name || 'User'}
                    </span>

                    {/* Dropdown Arrow */}
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <path 
                        d="M6 9L12 15L18 9" 
                        stroke="#6B7280" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Enhanced Dropdown Menu */}
                  {profileOpen && (
                    <div 
                      className="profile-dropdown"
                      style={{
                        position: 'absolute',
                        top: '60px',
                        right: '0',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        minWidth: '220px',
                        padding: '8px',
                        zIndex: 1000,
                        animation: 'dropdownFadeIn 0.2s ease',
                      }}
                    >
                      {/* User Info Header */}
                      <div style={{
                        padding: '12px',
                        borderBottom: '1px solid #F3F4F6',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: getProfileImage() 
                            ? 'transparent'
                            : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '18px',
                          overflow: 'hidden',
                          border: getProfileImage() ? '2px solid #3B82F6' : 'none',
                        }}>
                          {getProfileImage() ? (
                            <img 
                              src={getProfileImage()!}
                              alt="Profile"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerText = getUserInitials();
                                e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)';
                              }}
                            />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                        <div>
                          <div style={{
                            fontWeight: '600',
                            color: '#111827',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}>
                            {profile?.name || user.name || 'User'}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {profile?.email || user.email || 'user@example.com'}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F3F4F6';
                          e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path 
                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                        My Profile
                      </div>

                      {/* Divider */}
                      <div style={{
                        height: '1px',
                        background: '#F3F4F6',
                        margin: '8px 0',
                      }} />

                      {/* Logout */}
                      <div
                        className="dropdown-item logout"
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#EF4444',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FEF2F2';
                          e.currentTarget.style.color = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#EF4444';
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path 
                            d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                        Logout
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="hero" ref={heroRef}>
          {/* Icons Grid */}
          <div className="icons-layout">
            {/* SVG Filters for soft glow */}
            <svg className="svg-filters">
              <defs>
                {/* Main glow filter */}
                <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
                  <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                  <feMerge>
                    <feMergeNode in="offsetBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                
                {/* Gradient definitions */}
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
                </linearGradient>
                
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.6" />
                </linearGradient>
                
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.6" />
                </linearGradient>
                
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
                </linearGradient>
                
                <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.6" />
                </linearGradient>
                
                <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.6" />
                </linearGradient>
                
                <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Animated connecting lines with nodes */}
            <svg className="grid-lines">
              {/* Curved line from left avatar to center */}
              <path 
                d="M140,115 Q250,100 400,160" 
                className="line line-1" 
                strokeDasharray="300"
                strokeDashoffset="300"
              />
              <circle cx="140" cy="115" r="3" className="node start-node" />
              
              {/* Curved line from bulb to center */}
              <path 
                d="M215,55 Q300,80 400,160" 
                className="line line-2"
                strokeDasharray="250"
                strokeDashoffset="250"
              />
              <circle cx="215" cy="55" r="3" className="node" />
              
              {/* Curved line from location to center */}
              <path 
                d="M180,220 Q280,200 400,160" 
                className="line line-3"
                strokeDasharray="280"
                strokeDashoffset="280"
              />
              <circle cx="180" cy="220" r="3" className="node" />
              
              {/* Curved line from shield to center */}
              <path 
                d="M635,67.5 Q500,100 400,160" 
                className="line line-4"
                strokeDasharray="300"
                strokeDashoffset="300"
              />
              <circle cx="635" cy="67.5" r="3" className="node" />
              
              {/* Straight angled line from chat to center */}
              <path 
                d="M665,165 L400,160" 
                className="line line-5"
                strokeDasharray="265"
                strokeDashoffset="265"
              />
              <circle cx="665" cy="165" r="3" className="node" />
              
              {/* Curved line from right avatar to center */}
              <path 
                d="M597.5,217.5 Q500,200 400,160" 
                className="line line-6"
                strokeDasharray="280"
                strokeDashoffset="280"
              />
              <circle cx="597.5" cy="217.5" r="3" className="node" />
              
              {/* Vertical line from center down */}
              <path 
                d="M400,160 L400,220" 
                className="line line-7"
                strokeDasharray="60"
                strokeDashoffset="60"
              />
              <circle cx="400" cy="220" r="3" className="node" />
              
              {/* Center node (larger) */}
              <circle cx="400" cy="160" r="4" className="node end-node" />
            </svg>

            {/* Left Avatar - Professional Profile */}
            <div className="card avatar-blue pulse">
              <img
                src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
                alt="Professional avatar"
                className="card-image"
                loading="lazy"
              />
            </div>

            {/* Yellow Bulb - Idea */}
            <div className="card bulb-card float">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="#FFFFFF"
                xmlns="http://www.w3.org/2000/svg"
                className="card-image"
              >
                <path d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4 12.75V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.25A7 7 0 0 0 12 2Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z"/>
              </svg>
            </div>

            {/* Blue Location - Map Pin */}
            <div className="card location-card float delay-1">
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="card-image"
              >
                {/* Balloon Left */}
                <ellipse cx="8" cy="7" rx="4" ry="5" fill="#ffffff" />
                <path d="M8 12 C7.2 13 7 14 7 15 L7 19" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

                {/* Balloon Right */}
                <ellipse cx="15.5" cy="8.5" rx="4" ry="5" fill="#ffffff" />
                <path d="M15.5 14.5 C14.7 15.5 14.5 16.5 14.5 17.5 L14.5 20.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

                {/* Balloon Strings Criss-Cross */}
                <line x1="7" y1="19" x2="14.5" y2="20.5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="14.5" y1="17.5" x2="7" y2="15" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Center Card */}
            <div className="center-card" style={{
              width: "20%",
              height: "32%",
            }}>
              <img 
                src="https://assets-v2.lottiefiles.com/a/b3497a14-1150-11ee-8f36-0f83069a3c82/CFKyrs2JTS.gif"
                alt="Team member GIF"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none"
                }}
              />
              <div className="center-glow"></div>
            </div>

            {/* Shield - Security */}
            <div className="card shield-card pulse delay-2">
              <svg 
                width="44" 
                height="44" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="card-image"
              >
                {/* Outer Shield */}
                <path 
                  d="M12 2 L19 5.5 V11.5 C19 16.5 15.5 20.5 12 22 C8.5 20.5 5 16.5 5 11.5 V5.5 L12 2 Z" 
                  fill="#ffffff"
                />

                {/* Thunder / Lightning Bolt */}
                <path 
                  d="M13 6 L9 13 H12 L11 18 L15 11.5 H12 L13 6 Z" 
                  fill="#ef4444"
                />
              </svg>
            </div>

            {/* Chat - Messages */}
            <div className="card chat-card float delay-3">
              <img 
                src="https://www.shutterstock.com/image-vector/eyes-icon-vector-two-260nw-1065383702.jpg"
                alt="Team member"
                className="card-image"
                loading="lazy"
              />
            </div>

            {/* Right Avatar - Team Member */}
            <div className="card avatar-yellow float delay-4">
              <img 
                src="https://vanlawfirm.com/wp-content/uploads/2023/03/what-is-the-reasonable-person-standard.jpg"
                alt="Team member"
                className="card-image"
                loading="lazy"
              />
            </div>
          </div>

          {/* Animated Headline */}
          <div 
            className={`text-content ${showContent ? "visible" : ""}`} 
            ref={textRef}
            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
              // Check if the element exists and showContent is true
              if (showContent && e.currentTarget) {
                const target = e.currentTarget;
                const rect = target.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // Use requestAnimationFrame for smoother performance
                requestAnimationFrame(() => {
                  if (target) {
                    target.style.setProperty('--mouse-x', `${x}%`);
                    target.style.setProperty('--mouse-y', `${y}%`);
                    target.classList.add('mouse-move-active');
                  }
                });
                
                // Remove the class after animation completes
                const timeoutId = setTimeout(() => {
                  if (target) {
                    target.classList.remove('mouse-move-active');
                  }
                }, 1000);
                
                // Store the timeout ID to clean up if needed
                e.currentTarget._timeoutId = timeoutId;
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
              // Clean up timeout on mouse leave
              if (e.currentTarget && e.currentTarget._timeoutId) {
                clearTimeout(e.currentTarget._timeoutId);
                e.currentTarget.classList.remove('mouse-move-active');
              }
            }}
          >
            <div className="text-blocks">
              <div className="text-block title-block">
                <Typography variant="h2" className="title">
                  <span className="text-line">All-in-one HR</span>
                  <span className="text-line">platform</span>
                </Typography>
              </div>
              
              <div className="text-block subtitle-block">
                <Typography className="subtitle">
                  CoreShift is a modern, all-in-one HR platform designed to perfectly fit your business needs
                </Typography>
              </div>
            </div>

            {/* Animated CTA */}
            <Button className="orange-btn scale-on-hover">
              <span className="btn-text">Request a Demo</span>
              <span className="btn-arrow"></span>
            </Button>
          </div>
        </main>
        <Section />
        <Chart />
        <Advitisement />
        <Mail />
        <Footer />
      </div>

      {/* Floating Feedback Button (Only shows when user is logged in) */}
      {showFeedbackButton && (
        <>
          <style>
            {`
              @keyframes floatBounce {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }

              @keyframes shineEffect {
                0% {
                  left: -100%;
                }
                100% {
                  left: 100%;
                }
              }
              
              @keyframes pulseGlow {
                0%, 100% {
                  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1);
                }
                50% {
                  box-shadow: 0 4px 30px rgba(59, 130, 246, 0.4), 0 0 0 2px rgba(59, 130, 246, 0.2);
                }
              }
            `}
          </style>

          <div 
            onClick={handleFeedbackClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              zIndex: 1000,
              cursor: 'pointer',
              textDecoration: 'none',
              transform: isHovered ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)',
              transition: 'transform 0.3s ease',
              animation: 'floatBounce 3s ease-in-out infinite',
            }}
            aria-label="Send Feedback"
            title="Share your feedback"
          >
            <div 
              style={{
                width: '60px',
                height: '60px',
                background: isHovered 
                  ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' 
                  : 'linear-gradient(135deg, #2563eb 0%, #3B82F6 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered
                  ? '0 10px 30px rgba(59, 130, 246, 0.3), 0 0 0 3px rgba(59, 130, 246, 0.1)'
                  : '0 4px 20px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }}
            >
              {/* Shine effect overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: isHovered ? '100%' : '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s ease',
                }}
              />

              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Message bubble */}
                <path 
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" 
                  fill="#ffffff"
                  style={{ transition: 'fill 0.3s ease' }}
                />
                {/* Message lines */}
                <path 
                  d="M7 9H17V11H7V9ZM7 12H14V14H7V12ZM7 6H17V8H7V6Z" 
                  fill="#ffffff"
                  style={{ transition: 'fill 0.3s ease' }}
                />
              </svg>
              
              {/* Notification dot (optional) */}
              <div 
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #ffffff',
                  animation: isHovered ? 'none' : 'pulseGlow 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Mobile Responsive Styles */}
          <style>
            {`
              @media (max-width: 768px) {
                div[aria-label="Send Feedback"] {
                  bottom: 20px !important;
                  right: 20px !important;
                }
                div[aria-label="Send Feedback"] > div {
                  width: 50px !important;
                  height: 50px !important;
                }
                div[aria-label="Send Feedback"] svg {
                  width: 24px !important;
                  height: 24px !important;
                }
              }

              @media (max-width: 1024px) and (min-width: 769px) {
                div[aria-label="Send Feedback"] {
                  bottom: 25px !important;
                  right: 25px !important;
                }
                div[aria-label="Send Feedback"] > div {
                  width: 55px !important;
                  height: 55px !important;
                }
              }
            `}
          </style>
        </>
      )}

      {/* Dropdown Animation Styles */}
      <style>
        {`
          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Index;