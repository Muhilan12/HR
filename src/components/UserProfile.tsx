import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../api/apiConfig";
import { Settings } from "lucide-react";

// Types
interface ProfileData {
  userId: number;
  name: string;
  gender: string;
  dateOfBirth: string;
  designation: string;
  companyName: string;
  profileImage: string;
  profile_image_public_id: string;
  createdOn: string;
  updatedOn: string;
}

interface ProfileFormData {
  name: string;
  gender: string;
  dateOfBirth: string;
  designation: string;
  companyName: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    gender: "",
    dateOfBirth: "",
    designation: "",
    companyName: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token]);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log("Fetching profile from:", API_ENDPOINTS.PROFILE);
      
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          setProfile(null);
          setError("Profile not found. Please create your profile.");
        } else if (response.status === 401) {
          logout();
          navigate("/login");
          return;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        console.log("Profile response data:", data);
        
        if (data.profile) {
          // Map the backend response to our frontend ProfileData interface
          const profileData: ProfileData = {
            userId: data.profile.userId || 0,
            name: data.profile.name || "",
            gender: data.profile.gender || "",
            dateOfBirth: data.profile.dateOfBirth || "",
            designation: data.profile.designation || "",
            companyName: data.profile.companyName || "",
            profileImage: data.profile.profileImage || "",
            profile_image_public_id: data.profile.profile_image_public_id || data.profile.image_public_id || "",
            createdOn: data.profile.createdOn || "",
            updatedOn: data.profile.updatedOn || ""
          };
          
          setProfile(profileData);
          setError("");
          
          // Pre-fill form for edit mode
          setFormData({
            name: profileData.name || "",
            gender: profileData.gender || "",
            dateOfBirth: formatDateForInput(profileData.dateOfBirth) || "",
            designation: profileData.designation || "",
            companyName: profileData.companyName || "",
          });
          setPreviewImage(profileData.profileImage || "");
        } else {
          setProfile(null);
          setError("Profile data not found in response");
        }
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Success popup handler
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      setSuccessMessage("");
    }, 3000);
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    setRemoveImage(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setRemoveImage(true);
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle create/update profile submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError("");

    try {
      let endpoint = isEditMode ? API_ENDPOINTS.UPDATE_PROFILE : API_ENDPOINTS.CREATE_PROFILE;
      
      // For create mode, name and designation are required
      if (!isEditMode && !formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!isEditMode && !formData.designation.trim()) {
        throw new Error("Designation is required");
      }

      // Prepare FormData
      const formDataObj = new FormData();
      
      // Add fields to FormData
      if (isEditMode) {
        // For update, only add fields that have values or changed
        if (formData.name && formData.name !== profile?.name) {
          formDataObj.append("name", formData.name);
        }
        if (formData.gender && formData.gender !== profile?.gender) {
          formDataObj.append("gender", formData.gender);
        }
        if (formData.dateOfBirth !== profile?.dateOfBirth) {
          formDataObj.append("dateOfBirth", formData.dateOfBirth || "");
        }
        if (formData.designation && formData.designation !== profile?.designation) {
          formDataObj.append("designation", formData.designation);
        }
        if (formData.companyName !== profile?.companyName) {
          formDataObj.append("companyName", formData.companyName || "");
        }
        if (removeImage) {
          formDataObj.append("remove", "true");
        }
      } else {
        // For create, add all fields
        formDataObj.append("name", formData.name);
        formDataObj.append("gender", formData.gender || "");
        formDataObj.append("dateOfBirth", formData.dateOfBirth || "");
        formDataObj.append("designation", formData.designation);
        formDataObj.append("companyName", formData.companyName || "");
      }
      
      // Add file if selected
      if (selectedFile) {
        formDataObj.append("file", selectedFile);
      }

      console.log("Submitting to:", endpoint);
      console.log("Method:", isEditMode ? "PUT" : "POST");

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Server returned invalid response");
      }

      if (!response.ok) {
        // Handle validation errors (422)
        if (response.status === 422) {
          const errorMsg = responseData.detail || "Validation error";
          throw new Error(errorMsg);
        }
        
        // Handle other errors
        if (response.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        
        throw new Error(responseData.error || responseData.detail || responseData.message || `HTTP error! status: ${response.status}`);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      // Success
      console.log("✅ Success:", responseData);
      setShowModal(false);
      setPreviewImage("");
      setSelectedFile(null);
      setRemoveImage(false);
      showSuccessMessage(isEditMode ? "Profile updated successfully!" : "Profile created successfully!");
      await fetchProfile();
      
    } catch (err: any) {
      console.error("Submission error:", err);
      setModalError(err.message || "Failed to submit profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open modal for create/edit
  const openModal = (editMode: boolean) => {
    setIsEditMode(editMode);
    setModalError("");
    setPreviewImage("");
    setSelectedFile(null);
    setRemoveImage(false);
    
    if (editMode && profile) {
      // Pre-fill with existing data
      setFormData({
        name: profile.name || "",
        gender: profile.gender || "",
        dateOfBirth: formatDateForInput(profile.dateOfBirth) || "",
        designation: profile.designation || "",
        companyName: profile.companyName || "",
      });
      setPreviewImage(profile.profileImage || "");
    } else {
      // Reset for create
      setFormData({
        name: user?.name || "",
        gender: "",
        dateOfBirth: "",
        designation: "",
        companyName: "",
      });
      setPreviewImage("");
    }
    
    setShowModal(true);
    
    // Focus on name input after modal opens
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 100);
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00" || dateString === "0001-01-01") return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00" || dateString === "0001-01-01") return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/");
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "4px solid rgba(255,255,255,0.3)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      position: "relative",
    }}>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          padding: "20px",
        }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
            animation: "popIn 0.5s ease-out",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 20px",
              position: "relative",
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "#10B981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "scaleIn 0.5s ease-out",
              }}>
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  style={{ animation: "drawCheck 0.5s ease-out 0.3s both" }}
                >
                  <path 
                    d="M20 6L9 17L4 12" 
                    stroke="white" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="0"
                  />
                </svg>
              </div>
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "#10B981",
                borderRadius: "50%",
                opacity: "0.3",
                animation: "pulse 1.5s ease-out infinite",
              }}></div>
            </div>
            
            <h3 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "10px",
            }}>
              Success!
            </h3>
            <p style={{
              fontSize: "16px",
              color: "#6B7280",
              marginBottom: "30px",
            }}>
              {successMessage}
            </p>
            
            <button
              onClick={() => setShowSuccessPopup(false)}
              style={{
                padding: "10px 24px",
                background: "#10B981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#10B981"}
            >
              OK
            </button>
            
            <style>
              {`
                @keyframes popIn {
                  0% { transform: scale(0.5); opacity: 0; }
                  100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes scaleIn {
                  0% { transform: scale(0); }
                  70% { transform: scale(1.1); }
                  100% { transform: scale(1); }
                }
                
                @keyframes drawCheck {
                  0% { stroke-dashoffset: 100; }
                  100% { stroke-dashoffset: 0; }
                }
                
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 0.3; }
                  50% { transform: scale(1.2); opacity: 0.1; }
                  100% { transform: scale(1.3); opacity: 0; }
                }
              `}
            </style>
          </div>
        </div>
      )}

      {/* Create/Edit Profile Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 0.3s ease",
        }}>
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}
          </style>

          <div style={{
            background: "white",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
            animation: "slideUp 0.4s ease",
          }}>
            {/* Header with Gradient */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "30px",
              borderRadius: "20px 20px 0 0",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Decorative circles */}
              <div style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "150px",
                height: "150px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
              }} />

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}>
                <div>
                  <h2 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 8px 0",
                  }}>
                    {isEditMode ? "✨ Edit Your Profile" : "🎉 Create Your Profile"}
                  </h2>
                  <p style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    margin: 0,
                  }}>
                    {isEditMode ? "Update your information below" : "Fill in your details to get started"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setPreviewImage("");
                    setSelectedFile(null);
                    setRemoveImage(false);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    fontSize: "24px",
                    color: "white",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.transform = "rotate(0deg)";
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div style={{ padding: "30px" }}>
              {/* Error Message */}
              {modalError && (
                <div style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                  color: "#DC2626",
                  borderRadius: "12px",
                  marginBottom: "25px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  border: "1px solid #FCA5A5",
                  animation: "slideUp 0.3s ease",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div style={{ flex: 1 }}>{modalError}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Name Field - Only for create mode */}
                {!isEditMode && (
                  <div style={{
                    marginBottom: "25px",
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #E5E7EB",
                    transition: "all 0.3s",
                  }}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Name <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isEditMode}
                      placeholder="Enter your full name"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.outline = "none";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#667eea";
                          e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#E5E7EB";
                          e.target.parentElement.style.boxShadow = "none";
                        }
                      }}
                    />
                  </div>
                )}

                {/* Profile Image Upload Section */}
                <div style={{
                  marginBottom: "30px",
                  padding: "25px",
                  background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
                  borderRadius: "16px",
                  border: "2px dashed #D1D5DB",
                  transition: "all 0.3s",
                }}>
                  <label style={{
                    display: "flex",
                    marginBottom: "20px",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "16px",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Profile Picture (Optional)
                  </label>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "25px",
                    flexWrap: "wrap",
                  }}>
                    {/* Image Preview */}
                    <div style={{
                      position: "relative",
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: "3px solid #667eea",
                        position: "relative",
                        boxShadow: "0 8px 16px rgba(102, 126, 234, 0.2)",
                      }}>
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            color: "#9CA3AF",
                          }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span style={{ fontSize: "11px", fontWeight: "600" }}>Add Photo</span>
                          </div>
                        )}
                      </div>
                      {previewImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            background: "#EF4444",
                            border: "2px solid white",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div style={{ flex: 1, minWidth: "250px" }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          borderRadius: "10px",
                          color: "white",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          justifyContent: "center",
                          fontSize: "14px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {previewImage ? "Change Photo" : "Upload Photo"}
                      </button>
                      <p style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        marginTop: "12px",
                        lineHeight: "1.5",
                        textAlign: "center",
                      }}>
                        JPG, PNG or GIF (Max 5MB)<br/>
                        <span style={{ color: "#9CA3AF" }}>
                          {isEditMode 
                            ? "Leave blank to keep current image, remove to set gender-based default"
                            : "Default avatar will be set based on gender if not provided"
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout for Form Fields */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                  marginBottom: "25px",
                }}>
                  {/* Gender */}
                  <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #E5E7EB",
                    transition: "all 0.3s",
                  }}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Gender {!isEditMode && <span style={{ color: "#EF4444" }}>*</span>}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required={!isEditMode}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "15px",
                        background: "white",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.outline = "none";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#667eea";
                          e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#E5E7EB";
                          e.target.parentElement.style.boxShadow = "none";
                        }
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">👨 Male</option>
                      <option value="female">👩 Female</option>
                      <option value="other">⚧ Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #E5E7EB",
                    transition: "all 0.3s",
                  }}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.outline = "none";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#667eea";
                          e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#E5E7EB";
                          e.target.parentElement.style.boxShadow = "none";
                        }
                      }}
                    />
                  </div>

                  {/* Designation */}
                  <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #E5E7EB",
                    transition: "all 0.3s",
                  }}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Designation {!isEditMode && <span style={{ color: "#EF4444" }}>*</span>}
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required={!isEditMode}
                      placeholder="Software Engineer"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.outline = "none";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#667eea";
                          e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#E5E7EB";
                          e.target.parentElement.style.boxShadow = "none";
                        }
                      }}
                    />
                  </div>

                  {/* Company Name */}
                  <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #E5E7EB",
                    transition: "all 0.3s",
                  }}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21H21M3 7V21M7 21V7M11 21V7M15 21V7M19 21V7M21 7L12 3L3 7" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Acme Inc."
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.outline = "none";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#667eea";
                          e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB";
                        if (e.target.parentElement) {
                          e.target.parentElement.style.borderColor = "#E5E7EB";
                          e.target.parentElement.style.boxShadow = "none";
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: "flex",
                  gap: "15px",
                  paddingTop: "10px",
                }}>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!isEditMode && (!formData.name.trim() || !formData.designation.trim() || !formData.gender.trim()))}
                    style={{
                      flex: 1,
                      padding: "16px",
                      background: isSubmitting || (!isEditMode && (!formData.name.trim() || !formData.designation.trim() || !formData.gender.trim()))
                        ? "#D1D5DB"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: isSubmitting || (!isEditMode && (!formData.name.trim() || !formData.designation.trim() || !formData.gender.trim())) ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      boxShadow: isSubmitting ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting && (isEditMode || (formData.name.trim() && formData.designation.trim() && formData.gender.trim()))) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isSubmitting ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)";
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: "20px",
                          height: "20px",
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTop: "3px solid white",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }} />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {isEditMode ? "Update Profile" : "Create Profile"}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setPreviewImage("");
                      setSelectedFile(null);
                      setRemoveImage(false);
                    }}
                    disabled={isSubmitting}
                    style={{
                      padding: "16px 28px",
                      background: "white",
                      border: "2px solid #E5E7EB",
                      borderRadius: "12px",
                      color: "#6B7280",
                      fontWeight: "600",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      fontSize: "16px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = "#F9FAFB";
                        e.currentTarget.style.borderColor = "#D1D5DB";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "#E5E7EB";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px",
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

          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "700", margin: 0 }}>
            My Profile
          </h1>

          <div style={{ width: "120px" }} />
        </div>

        {/* Profile Content */}
        {profile ? (
          /* Profile Exists - Display Profile */
          <div style={{
            background: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* Cover Section */}
            <div style={{
              height: "200px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              position: "relative",
            }}>
              {/* Profile Image */}
              <div style={{
                position: "absolute",
                bottom: "-60px",
                left: "50px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                border: "6px solid white",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                background: "white",
              }}>
                <img
                  src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=160&background=667eea&color=fff`}
                  alt={profile.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=160&background=667eea&color=fff`;
                  }}
                />
              </div>

              {/* Edit Button */}
              <button
                onClick={() => openModal(true)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#667eea",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Profile
              </button>

              <button
  onClick={() => navigate("/settings")}
  style={{
    position: "absolute",
    top: "20px",
    right: "170px", // adjust if needed
    padding: "10px 20px",
    background: "rgba(255,255,255,0.9)",
    border: "none",
    borderRadius: "10px",
    color: "#667eea",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "white";
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.9)";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
 <Settings />
  Account Settings
</button>
            </div>
 



            {/* Profile Content */}
            <div style={{ padding: "80px 50px 50px" }}>
              {/* Name and Title */}
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "8px",
                }}>
                  {profile.name}
                </h2>
                <p style={{
                  fontSize: "18px",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}>
                  {profile.designation || "No designation"}
                </p>
                <p style={{
                  fontSize: "16px",
                  color: "#9CA3AF",
                  marginBottom: "4px",
                }}>
                  {profile.companyName || "No company"}
                </p>
                {/* Display email from auth context */}
                {user?.email && (
                  <p style={{
                    fontSize: "14px",
                    color: "#9CA3AF",
                    marginBottom: "4px",
                  }}>
                  </p>
                )}
              </div>

              {/* Information Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "30px",
                marginBottom: "40px",
              }}>
                {/* Gender */}
                <InfoCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  label="Gender"
                  value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not specified"}
                />

<InfoCard
  icon={
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" 
        stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  }
  label="Email"
  value={user?.email || "Not provided"}
/>


                {/* Date of Birth */}
                <InfoCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6M8 2V6M3 10H21" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  label="Date of Birth"
                  value={formatDateForDisplay(profile.dateOfBirth)}
                />

                {/* User ID */}
                <InfoCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  label="User ID"
                  value={`NO : ${profile.userId}`}
                />

                {/* Member Since */}
                <InfoCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  label="Member Since"
                  value={formatDateForDisplay(profile.createdOn)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                gap: "15px",
                paddingTop: "30px",
                borderTop: "1px solid #E5E7EB",
                flexWrap: "wrap",
              }}>
                <button
                  onClick={() => openModal(true)}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: "14px 24px",
                    background: "white",
                    color: "#EF4444",
                    border: "2px solid #EF4444",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#EF4444";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#EF4444";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* No Profile - Create Profile Card */
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            textAlign: "center",
            maxWidth: "500px",
            margin: "0 auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* User Info Display */}
            {user && (
              <div style={{
                background: "#F9FAFB",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "30px",
                textAlign: "left",
              }}>
                <h3 style={{ color: "#374151", marginBottom: "10px", fontSize: "16px" }}>Your Account Information:</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Username:</span>
                  <span style={{ color: "#111827", fontWeight: "600" }}>{user.name || "N/A"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Email:</span>
                  <span style={{ color: "#111827", fontWeight: "600" }}>{user.email || "N/A"}</span>
                </div>
              </div>
            )}

            <div style={{
              width: "80px",
              height: "80px",
              background: "#FEE2E2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 style={{ color: "#111827", marginBottom: "10px", fontSize: "24px" }}>Profile Not Found</h2>
            <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "15px" }}>
              {error || "You haven't created a profile yet."}
            </p>
            
            <p style={{ 
              color: "#9CA3AF", 
              fontSize: "14px", 
              marginBottom: "30px",
              padding: "15px",
              background: "#F9FAFB",
              borderRadius: "8px",
              textAlign: "left"
            }}>
              <strong>To get started:</strong><br/>
              • Create your profile to access all features<br/>
              • Profile image is optional (upload file)<br/>
              • Name, gender, and designation are required<br/>
              • You can edit your profile anytime
            </p>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={handleBack}
                style={{
                  padding: "12px 24px",
                  background: "#3B82F6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#2563EB"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#3B82F6"}
              >
                Go Back Home
              </button>
              <button
                onClick={() => openModal(false)}
                style={{
                  padding: "12px 24px",
                  background: "#10B981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#10B981"}
              >
                Create Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <div style={{
      padding: "20px",
      background: "#F9FAFB",
      borderRadius: "12px",
      border: "1px solid #E5E7EB",
      transition: "all 0.3s",
      cursor: "default",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#F3F4F6";
      e.currentTarget.style.borderColor = "#D1D5DB";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#F9FAFB";
      e.currentTarget.style.borderColor = "#E5E7EB";
    }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "10px",
      }}>
        {icon}
        <span style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}>
          {label}
        </span>
      </div>
      <p style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#111827",
        margin: 0,
        wordBreak: "break-word",
      }}>
        {value}
      </p>
    </div>
  );
};

export default UserProfile;