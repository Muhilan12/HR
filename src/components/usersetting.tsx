import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../api/apiConfig';
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  phone?: string;
}

interface UserUpdateData {
  email?: string;
  phone?: string;
  old_password?: string;
  new_password?: string;
}

const UserSettings: React.FC = () => {
  const { user: authUser, token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState<UserUpdateData>({
    email: '',
    phone: '',
    old_password: '',
    new_password: ''
  });
  
  const [errors, setErrors] = useState<UserUpdateData>({});

  // Fetch user data with phone number
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        setIsLoadingUser(true);
        const response = await fetch(API_ENDPOINTS.PROTECTED, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.user_id,
            email: data.email,
            phone: data.phone || ''
          });
          
          setFormData(prev => ({
            ...prev,
            email: data.email || '',
            phone: data.phone || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [token]);


    const handleBack = () => {
    navigate("/profile");
  };

  useEffect(() => {
    if (authUser && 'phone' in authUser) {
      setUser(authUser as User);
      setFormData(prev => ({
        ...prev,
        email: authUser.email || '',
        phone: (authUser as any).phone || ''
      }));
      setIsLoadingUser(false);
    }
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof UserUpdateData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: UserUpdateData = {};

    if (activeTab === 'personal') {
      if (formData.email && formData.email !== user?.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
      }

      if (formData.phone && formData.phone.length > 15) {
        newErrors.phone = 'Phone number is too long';
      }
    } else if (activeTab === 'security') {
      if (formData.old_password || formData.new_password) {
        if (!formData.old_password && formData.new_password) {
          newErrors.old_password = 'Old password is required when setting new password';
        }
        if (formData.old_password && !formData.new_password) {
          newErrors.new_password = 'New password is required';
        }
        if (formData.new_password && formData.new_password.length < 6) {
          newErrors.new_password = 'Password must be at least 6 characters';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload: UserUpdateData = {};
      
      if (formData.email && formData.email !== user?.email) {
        payload.email = formData.email;
      }
      
      if (formData.phone !== undefined && formData.phone !== user?.phone) {
        payload.phone = formData.phone;
      }
      
      if (formData.old_password) {
        payload.old_password = formData.old_password;
      }
      if (formData.new_password) {
        payload.new_password = formData.new_password;
      }

      if (Object.keys(payload).length === 0) {
        setErrorMessage('No changes detected');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.UPDATE_USER, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update user information');
      }

      setSuccessMessage(data.message || 'Information updated successfully!');
      
      if (activeTab === 'security') {
        setFormData(prev => ({
          ...prev,
          old_password: '',
          new_password: ''
        }));
      }
      
      if (token) {
        const userResponse = await fetch(API_ENDPOINTS.PROTECTED, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            id: userData.user_id,
            email: userData.email,
            phone: userData.phone || ''
          });
        }
      }
      
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '80%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        transform: 'rotate(15deg)',
        animation: 'float 20s infinite linear',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-50%',
        left: '-20%',
        width: '80%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: 'rotate(-15deg)',
        animation: 'floatReverse 25s infinite linear',
      }} />

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
      }}>

        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '40px 20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          animation: 'slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>

             <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "10px",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              e.currentTarget.style.transform = "translateX(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>


          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px',
            letterSpacing: '-0.5px',
          }}>
            Account Settings
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Manage your personal information and security preferences
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: '1',
        }}>
          {/* Floating particles */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  background: `rgba(102, 126, 234, ${Math.random() * 0.3 + 0.1})`,
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `floatParticle ${Math.random() * 20 + 10}s infinite linear`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '0 40px',
          }}>
            {(['personal', 'security'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  clearMessages();
                }}
                style={{
                  flex: 1,
                  padding: '28px 0',
                  background: 'transparent',
                  border: 'none',
                  position: 'relative',
                  color: activeTab === tab ? '#667eea' : '#64748b',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {activeTab === tab && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '3px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    animation: 'slideIn 0.3s ease-out',
                  }} />
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: activeTab === tab ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  transition: 'all 0.3s',
                }}>
                  {tab === 'personal' ? (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                      </svg>
                      Personal Information
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15V17M6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V13C20 12.4696 19.7893 11.9609 19.4142 11.5858C19.0391 11.2107 18.5304 11 18 11H6C5.46957 11 4.96086 11.2107 4.58579 11.5858C4.21071 11.9609 4 12.4696 4 13V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                      </svg>
                      Security
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '50px' }}>
            {/* Messages */}
            {successMessage && (
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.9) 0%, rgba(167, 243, 208, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                color: '#065F46',
                borderRadius: '16px',
                marginBottom: '30px',
                border: '1px solid rgba(110, 231, 183, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                animation: 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(110, 231, 183, 0.2)',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: '#10B981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{ fontWeight: '500' }}>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(254, 202, 202, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                color: '#991B1B',
                borderRadius: '16px',
                marginBottom: '30px',
                border: '1px solid rgba(252, 165, 165, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                animation: 'shake 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(252, 165, 165, 0.2)',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: '#EF4444',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                      strokeWidth="2" strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span style={{ fontWeight: '500' }}>{errorMessage}</span>
              </div>
            )}

            {isLoadingUser ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '80px',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                  background: 'conic-gradient(from 0deg, transparent, #667eea)',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
                }} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.6s ease-out' }}>
                {activeTab === 'personal' ? (
                  <div>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '40px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                    }}>
                      Update Personal Information
                    </h2>

                    <div style={{
                      display: 'grid',
                      gap: '35px',
                      maxWidth: '600px',
                    }}>
                      {/* Email Field */}
                      <div style={{ position: 'relative' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '15px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" 
                                  stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            Email Address
                          </div>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter new email address"
                          style={{
                            width: '100%',
                            padding: '18px 24px 18px 60px',
                            border: `2px solid ${errors.email ? '#EF4444' : '#e5e7eb'}`,
                            borderRadius: '16px',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                            background: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 4px 30px rgba(102, 126, 234, 0.2)';
                            e.target.style.background = '#f8fafc';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.email ? '#EF4444' : '#e5e7eb';
                            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                            e.target.style.background = 'white';
                          }}
                        />
                        {errors.email && (
                          <p style={{
                            color: '#EF4444',
                            fontSize: '14px',
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                        <div style={{
                          position: 'absolute',
                          left: '20px',
                          top: '54px',
                          color: '#6b7280',
                          pointerEvents: 'none',
                        }}>
                          @
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div style={{ position: 'relative' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '15px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" 
                                  stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            Phone Number
                          </div>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          placeholder="Enter new phone number"
                          style={{
                            width: '100%',
                            padding: '18px 24px 18px 60px',
                            border: `2px solid ${errors.phone ? '#EF4444' : '#e5e7eb'}`,
                            borderRadius: '16px',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                            background: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 4px 30px rgba(102, 126, 234, 0.2)';
                            e.target.style.background = '#f8fafc';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.phone ? '#EF4444' : '#e5e7eb';
                            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                            e.target.style.background = 'white';
                          }}
                        />
                        {errors.phone && (
                          <p style={{
                            color: '#EF4444',
                            fontSize: '14px',
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              />
                            </svg>
                            {errors.phone}
                          </p>
                        )}
                        <div style={{
                          position: 'absolute',
                          left: '20px',
                          top: '54px',
                          color: '#6b7280',
                          pointerEvents: 'none',
                        }}>
                          📱
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '40px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                    }}>
                      Security Settings
                    </h2>

                    <div style={{
                      display: 'grid',
                      gap: '35px',
                      maxWidth: '600px',
                    }}>
                      {/* Old Password */}
                      <div style={{ position: 'relative' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '15px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M16.5 10.5V6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5V10.5M12 14.5V16.5M19 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10H19C20.1046 10 21 10.8954 21 12V19C21 20.1046 20.1046 21 19 21Z" 
                                  stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            Current Password
                          </div>
                        </label>
                        <input
                          type="password"
                          name="old_password"
                          value={formData.old_password}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                          style={{
                            width: '100%',
                            padding: '18px 24px 18px 60px',
                            border: `2px solid ${errors.old_password ? '#EF4444' : '#e5e7eb'}`,
                            borderRadius: '16px',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                            background: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            letterSpacing: '2px',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 4px 30px rgba(102, 126, 234, 0.2)';
                            e.target.style.background = '#f8fafc';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.old_password ? '#EF4444' : '#e5e7eb';
                            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                            e.target.style.background = 'white';
                          }}
                        />
                        {errors.old_password && (
                          <p style={{
                            color: '#EF4444',
                            fontSize: '14px',
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              />
                            </svg>
                            {errors.old_password}
                          </p>
                        )}
                      </div>

                      {/* New Password */}
                      <div style={{ position: 'relative' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '15px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15V17M6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V13C20 12.4696 19.7893 11.9609 19.4142 11.5858C19.0391 11.2107 18.5304 11 18 11H6C5.46957 11 4.96086 11.2107 4.58579 11.5858C4.21071 11.9609 4 12.4696 4 13V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                                  stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            New Password
                          </div>
                        </label>
                        <input
                          type="password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleInputChange}
                          placeholder="Enter new password (min. 6 characters)"
                          style={{
                            width: '100%',
                            padding: '18px 24px 18px 60px',
                            border: `2px solid ${errors.new_password ? '#EF4444' : '#e5e7eb'}`,
                            borderRadius: '16px',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                            background: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            letterSpacing: '2px',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 4px 30px rgba(102, 126, 234, 0.2)';
                            e.target.style.background = '#f8fafc';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.new_password ? '#EF4444' : '#e5e7eb';
                            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                            e.target.style.background = 'white';
                          }}
                        />
                        {errors.new_password && (
                          <p style={{
                            color: '#EF4444',
                            fontSize: '14px',
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              />
                            </svg>
                            {errors.new_password}
                          </p>
                        )}
                      </div>

                      {/* Password Requirements Card */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'glow 2s infinite alternate',
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          width: '100px',
                          height: '100px',
                          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
                          borderRadius: '0 20px 0 100px',
                        }} />
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#374151',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                              stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            />
                          </svg>
                          Password Requirements
                        </h4>
                        <ul style={{
                          color: '#4b5563',
                          fontSize: '14px',
                          paddingLeft: '24px',
                          margin: '0',
                          lineHeight: '1.8',
                          display: 'grid',
                          gap: '8px',
                        }}>
                          <li style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '-20px', color: '#667eea' }}>•</span>
                            Minimum 6 characters
                          </li>
                          <li style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '-20px', color: '#667eea' }}>•</span>
                            Include uppercase & lowercase letters
                          </li>
                          <li style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '-20px', color: '#667eea' }}>•</span>
                            Include numbers and special characters
                          </li>
                          <li style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '-20px', color: '#667eea' }}>•</span>
                            Avoid common patterns
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div style={{
                  marginTop: '60px',
                  paddingTop: '40px',
                  borderTop: '1px solid rgba(229, 231, 235, 0.5)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '18px 48px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      opacity: loading ? 0.8 : 1,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: loading ? 'shimmer 1.5s infinite' : 'none',
                    }} />
                    
                    {loading ? (
                      <>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTop: '3px solid white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13L9 17L19 7" 
                            stroke="white" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                        Update {activeTab === 'personal' ? 'Information' : 'Password'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          animation: 'fadeIn 1s ease-out 0.6s both',
        }}>
          <p>Need help? Contact our support team</p>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: rotate(15deg) translateY(0); }
            50% { transform: rotate(15deg) translateY(-20px); }
          }
          
          @keyframes floatReverse {
            0%, 100% { transform: rotate(-15deg) translateY(0); }
            50% { transform: rotate(-15deg) translateY(20px); }
          }
          
          @keyframes floatParticle {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(0) translateX(20px); }
            75% { transform: translateY(20px) translateX(10px); }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          
          @keyframes glow {
            from { box-shadow: 0 0 20px rgba(102, 126, 234, 0.1); }
            to { box-shadow: 0 0 30px rgba(102, 126, 234, 0.2); }
          }
          
          @keyframes slideIn {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          
          input, button {
            font-family: inherit;
          }
          
          input::placeholder {
            color: #9ca3af;
          }
          
          button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
          }
          
          * {
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
};

export default UserSettings;