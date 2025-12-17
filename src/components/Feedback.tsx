import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Snackbar,
  Avatar,
  Grid,
  Paper,
  IconButton,
  Fade,
  Slide,
  Grow,
  Zoom,
  Tooltip,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Modal,
  Backdrop,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from "../api/apiConfig";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SecurityIcon from '@mui/icons-material/Security';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { keyframes } from '@emotion/react';

interface FeedbackData {
  rating: number;
  feedback: string;
}

interface ProfileData {
  name: string;
  designation: string;
  companyName: string;
  profileImage?: string;
}

// Enhanced Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideInRight = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const { user, token: authToken, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    rating: 0,
    feedback: ''
  });
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showProfileUpdatePopup, setShowProfileUpdatePopup] = useState(false);
  const [error, setError] = useState('');
  const [hover, setHover] = useState(-1);
  const [characterCount, setCharacterCount] = useState(0);
  const [activeTip, setActiveTip] = useState(0);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  
  // Rating labels with colors and icons
  const ratingLabels = [
    { 
      value: 1, 
      label: 'Poor', 
      color: '#ef4444', 
      icon: <SentimentVeryDissatisfiedIcon />,
      description: 'Very dissatisfied'
    },
    { 
      value: 2, 
      label: 'Fair', 
      color: '#f97316', 
      icon: <SentimentDissatisfiedIcon />,
      description: 'Somewhat dissatisfied'
    },
    { 
      value: 3, 
      label: 'Good', 
      color: '#eab308', 
      icon: <SentimentNeutralIcon />,
      description: 'Neutral experience'
    },
    { 
      value: 4, 
      label: 'Very Good', 
      color: '#84cc16', 
      icon: <SentimentSatisfiedIcon />,
      description: 'Satisfied'
    },
    { 
      value: 5, 
      label: 'Excellent', 
      color: '#22c55e', 
      icon: <SentimentVerySatisfiedIcon />,
      description: 'Extremely satisfied'
    }
  ];

  // Tips for feedback
  const feedbackTips = [
    {
      title: 'Be Specific',
      description: 'Mention specific features or interactions that stood out',
      icon: '🎯'
    },
    {
      title: 'Suggest Improvements',
      description: 'Provide actionable suggestions for enhancement',
      icon: '💡'
    },
    {
      title: 'Share Impact',
      description: 'Explain how this affects your workflow or experience',
      icon: '📈'
    },
    {
      title: 'Keep it Constructive',
      description: 'Focus on solutions rather than just problems',
      icon: '🤝'
    }
  ];

  // Get emoji component for rating
  const getEmojiForRating = (rating: number) => {
    switch (rating) {
      case 1: return <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: '#ef4444' }} />;
      case 2: return <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: '#f97316' }} />;
      case 3: return <SentimentNeutralIcon sx={{ fontSize: 80, color: '#eab308' }} />;
      case 4: return <SentimentSatisfiedIcon sx={{ fontSize: 80, color: '#84cc16' }} />;
      case 5: return <SentimentVerySatisfiedIcon sx={{ fontSize: 80, color: '#22c55e' }} />;
      default: return <EmojiEmotionsIcon sx={{ fontSize: 80, color: '#9ca3af' }} />;
    }
  };

  // Check token and authentication
  const validateToken = async () => {
    try {
      const token = authToken || localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
        return false;
      }

      const validationResponse = await fetch(API_ENDPOINTS.PROFILES, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (validationResponse.status === 401 || validationResponse.status === 403) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Token validation error:', err);
      setError('Unable to verify authentication. Please login again.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const isValid = await validateToken();
      if (isValid) {
        fetchProfileData();
        checkPreviousFeedback();
      }
    };

    init();

    // Rotate tips every 5 seconds
    const tipInterval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % feedbackTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, [user, navigate, authToken]);

  const checkPreviousFeedback = async () => {
    try {
      const token = authToken || localStorage.getItem('token');
      
      const response = await fetch(`${API_ENDPOINTS.FEEDBACK}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasSubmitted) {
          setHasSubmittedBefore(true);
          setError('You have already submitted feedback. Thank you for your input!');
          setTimeout(() => navigate('/'), 3000);
        }
      }
    } catch (err) {
      console.error('Error checking previous feedback:', err);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const token = authToken || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.PROFILES, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed');
        }
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      
      const profile = data.profile || data.data || data;
      
      setProfileData({
        name: profile.name || user?.name || 'User',
        designation: profile.designation || profile.title || '',
        companyName: profile.companyName || profile.company || '',
        profileImage: profile.profileImage || profile.image || profile.avatar
      });
      
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      
      setProfileData({
        name: user?.name || 'User',
        designation: '',
        companyName: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setFeedbackData(prev => ({ ...prev, rating: newValue }));
    }
  };

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 1000) {
      setFeedbackData(prev => ({ ...prev, feedback: value }));
      setCharacterCount(value.length);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (feedbackData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!feedbackData.feedback.trim()) {
      setError('Please provide your feedback');
      return;
    }
    
    if (feedbackData.feedback.trim().length < 10) {
      setError('Feedback must be at least 10 characters');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const isValid = await validateToken();
      if (!isValid) return;
      
      const token = authToken || localStorage.getItem('token');
      
      const submissionData = {
        rating: Number(feedbackData.rating),
        feedback: feedbackData.feedback.trim(),
        submittedAt: new Date().toISOString()
      };

      console.log('Submitting feedback:', submissionData);
      
      const response = await fetch(API_ENDPOINTS.FEEDBACK, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("You have already submitted feedback. Thank you!");
        }

        if (response.status === 422) {
          const errors = responseData.detail || responseData.errors;
          const errorMsg = Array.isArray(errors)
            ? errors.map((e: any) => e.msg || e.message).join(", ")
            : responseData.detail || responseData.message;

          throw new Error(`Validation failed: ${errorMsg}`);
        }

        const errorMessage =
          responseData.message ||
          responseData.detail ||
          "Failed to submit feedback";

        if (
          errorMessage.toLowerCase().includes("update your profile") ||
          errorMessage.toLowerCase().includes("failed to submit feedback")
        ) {
          setShowProfileUpdatePopup(true);
        }

        throw new Error(errorMessage);
      }

      setSuccess(true);
      setShowSuccessPopup(true);
      setHasSubmittedBefore(true);
      
      setTimeout(() => {
        setFeedbackData({ rating: 0, feedback: '' });
        setCharacterCount(0);
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  // Success Popup Component
  const SuccessPopup = () => (
    <Modal
      open={showSuccessPopup}
      onClose={() => setShowSuccessPopup(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showSuccessPopup}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 450,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'success.light',
            animation: `${slideInRight} 0.5s ease-out`,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 50, color: 'white' }} />
          </Box>

          <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
            Thank You! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your feedback has been submitted successfully and will help us improve.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            mt: 3 
          }}>
            <Button
              variant="outlined"
              onClick={() => setShowSuccessPopup(false)}
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/');
              }}
              sx={{ borderRadius: 2 }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          animation: `${gradientFlow} 8s ease infinite`,
          backgroundSize: '400% 400%',
        }}
      >
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ 
            color: 'white',
            mb: 3,
            animation: `${pulse} 1.5s ease-in-out infinite`
          }}
        />
        <Typography variant="h6" color="white" sx={{ animation: `${float} 2s ease-in-out infinite` }}>
          Loading your profile...
        </Typography>
      </Box>
    );
  }

  if (hasSubmittedBefore) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          animation: `${gradientFlow} 8s ease infinite`,
          backgroundSize: '400% 400%',
          p: 3
        }}
      >
        <Zoom in={true} timeout={800}>
          <Card
            sx={{
              maxWidth: 400,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(255,255,255,0.9)'
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  animation: `${pulse} 2s ease-in-out infinite`
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 50, color: 'white' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
                Thank You! 🎉
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You have already submitted your feedback. We appreciate your valuable input!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #ec4899)',
          animation: `${gradientFlow} 3s ease infinite`
        }
      }}
    >
      {/* Success Popup */}
      <SuccessPopup />

      {/* Profile Update Popup */}
      <Modal
        open={showProfileUpdatePopup}
        onClose={() => setShowProfileUpdatePopup(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={showProfileUpdatePopup}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 450,
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
              border: '2px solid',
              borderColor: 'warning.light',
            }}
          >
            <WarningIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold" color="warning.main">
              Profile Update Required
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Please update your profile information before submitting feedback.
            </Typography>
            <Button
              variant="contained"
              color="warning"
              onClick={handleNavigateToProfile}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Update Profile
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          animation: `${float} 8s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
          animation: `${float} 10s ease-in-out infinite reverse`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 6, animation: `${slideInLeft} 0.6s ease-out` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Go back">
                <IconButton
                  onClick={handleBack}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                    '&:hover': { 
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateX(-5px)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  Share Your Feedback
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="normal">
                  Help us improve your experience
                </Typography>
              </Box>
            </Box>
            
            {profileData && (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    minWidth: 200
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={profileData.profileImage}
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: 'primary.main',
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}
                    >
                      {profileData.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {profileData.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {profileData.designation || 'Feedback Provider'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>

        {/* Two Column Layout */}
        <Grid container spacing={4}>
          {/* Left Column - Rating Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Slide in={true} direction="right" timeout={800}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <RateReviewIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Rate Your Experience
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      How would you rate your overall experience?
                    </Typography>
                  </Box>

                  {/* Rating Display */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    mb: 6,
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'grey.50'
                  }}>
                    {/* Large Emoji Display */}
                    <Box
                      sx={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        bgcolor: 'white',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        animation: feedbackData.rating > 0 ? `${pulse} 2s ease-in-out infinite` : 'none',
                        border: '3px solid',
                        borderColor: feedbackData.rating > 0 ? 
                          ratingLabels.find(r => r.value === feedbackData.rating)?.color || 'primary.main' 
                          : 'transparent'
                      }}
                    >
                      {getEmojiForRating(feedbackData.rating)}
                    </Box>
                    
                    {/* Rating Value */}
                    {feedbackData.rating > 0 && (
                      <Zoom in={true}>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography
                            variant="h1"
                            fontWeight="bold"
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {feedbackData.rating.toFixed(1)}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color="text.secondary"
                            sx={{ 
                              color: ratingLabels.find(r => r.value === feedbackData.rating)?.color 
                            }}
                          >
                            {ratingLabels.find(r => r.value === feedbackData.rating)?.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ratingLabels.find(r => r.value === feedbackData.rating)?.description}
                          </Typography>
                        </Box>
                      </Zoom>
                    )}
                  </Box>

                  {/* Star Rating */}
                  <Box sx={{ mb: 4 }}>
                    <Rating
                      name="rating"
                      value={feedbackData.rating}
                      onChange={handleRatingChange}
                      onChangeActive={(event, newHover) => setHover(newHover)}
                      size="large"
                      max={5}
                      icon={
                        <StarIcon 
                          fontSize="inherit" 
                          sx={{ 
                            fontSize: 56,
                            animation: feedbackData.rating > 0 ? `${pulse} 1s ease-in-out` : 'none'
                          }} 
                        />
                      }
                      emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ fontSize: 56 }} />}
                      sx={{
                        justifyContent: 'center',
                        '& .MuiRating-iconFilled': {
                          color: (theme) => 
                            feedbackData.rating === 1 ? '#ef4444' :
                            feedbackData.rating === 2 ? '#f97316' :
                            feedbackData.rating === 3 ? '#eab308' :
                            feedbackData.rating === 4 ? '#84cc16' :
                            feedbackData.rating === 5 ? '#22c55e' :
                            'primary.main'
                        },
                      }}
                    />
                    
                    {/* Rating Labels */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 3,
                      px: 1
                    }}>
                      {ratingLabels.map((rating) => (
                        <Tooltip key={rating.value} title={rating.description}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1,
                              cursor: 'pointer',
                              p: 1,
                              borderRadius: 2,
                              bgcolor: feedbackData.rating === rating.value ? `${rating.color}15` : 'transparent',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: `${rating.color}20`,
                                transform: 'translateY(-2px)'
                              }
                            }}
                            onClick={() => handleRatingChange(null as any, rating.value)}
                          >
                            <Box sx={{ color: rating.color }}>
                              {rating.icon}
                            </Box>
                            <Typography 
                              variant="caption" 
                              fontWeight="medium"
                              sx={{ 
                                color: feedbackData.rating === rating.value ? rating.color : 'text.secondary'
                              }}
                            >
                              {rating.label}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  {/* Tips Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'primary.50',
                      border: '1px solid',
                      borderColor: 'primary.100'
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon color="primary" /> Why Your Rating Matters
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your rating helps us prioritize improvements and enhance user experience.
                      Each rating point provides valuable insights into what's working and what needs attention.
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Right Column - Feedback Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Slide in={true} direction="left" timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #764ba2, #ec4899)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  

                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <FeedbackIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Share Your Thoughts
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Your detailed feedback helps us understand your experience better
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    {/* Feedback Text Area */}
                    <Box sx={{ mb: 4 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        placeholder="Tell us what you loved, what could be better, or any suggestions you have..."
                        value={feedbackData.feedback}
                        onChange={handleFeedbackChange}
                        disabled={submitting}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                            },
                            '&.Mui-focused': {
                              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
                            }
                          }
                        }}
                      />
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 2 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InfoIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Minimum 10 characters required
                          </Typography>
                        </Box>
                        <Chip
                          label={`${characterCount}/1000`}
                          size="small"
                          sx={{
                            bgcolor: characterCount >= 10 ? 'success.main' : 
                                     characterCount > 800 ? 'warning.main' : 
                                     'grey.300',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>

                    
                   {/* Error Message */}
                  {error && (
                    <Slide in={!!error} direction="down">
                      <Alert 
                        severity="error" 
                        icon={<ErrorIcon />}
                        onClose={() => setError('')}
                        sx={{ 
                          mb: 4, 
                          borderRadius: 2,
                          animation: `${pulse} 1s ease-in-out`
                        }}
                      >
                        <Typography fontWeight="bold">{error}</Typography>
                      </Alert>
                    </Slide>
                  )}


                    {/* Tips Section */}
                    <Box sx={{ mb: 6 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <TipsAndUpdatesIcon color="warning" /> Writing Great Feedback
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {feedbackTips.map((tip, index) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                height: '100%',
                                borderRadius: 2,
                                bgcolor: activeTip === index ? 'warning.50' : 'grey.50',
                                border: '1px solid',
                                borderColor: activeTip === index ? 'warning.200' : 'transparent',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                              }}
                              onClick={() => setActiveTip(index)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Typography variant="h4">{tip.icon}</Typography>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    {tip.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {tip.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Submit Section */}
                    <Box sx={{ 
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Ready to Submit?
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Your feedback will be stored securely and analyzed anonymously
                          </Typography>
                        </Box>
                        <SecurityIcon color="success" />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={
                            submitting ||
                            feedbackData.rating === 0 ||
                            feedbackData.feedback.trim().length < 10
                          }
                          startIcon={submitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                          sx={{
                            flex: 1,
                            py: 2,
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                            minWidth: 200,
                            '&:hover': {
                              boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
                              transform: 'translateY(-3px)',
                              transition: 'all 0.3s'
                            },
                            '&:disabled': {
                              bgcolor: 'grey.300',
                              transform: 'none',
                              boxShadow: 'none'
                            }
                          }}
                        >
                          {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>

                        <Button
                          variant="outlined"
                          size="large"
                          onClick={handleBack}
                          sx={{
                            py: 2,
                            borderRadius: 3,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textTransform: 'none'
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                        ⚡ Your rating ({feedbackData.rating || 0}) will be stored as a number for analysis
                      </Typography>
                    </Box>
                  </form>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Footer Stats */}
        <Fade in={true} timeout={1500}>
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <ThumbUpIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Your feedback helps improve the experience for thousands of users
            </Typography>
          </Box>
        </Fade>

        {/* Success Snackbar */}
        <Snackbar
          open={success && !showSuccessPopup}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Slide}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: 2,
              animation: `${pulse} 2s ease-in-out infinite`
            }}
            icon={<CheckCircleIcon />}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Feedback submitted successfully! 🎉
            </Typography>
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Feedback;