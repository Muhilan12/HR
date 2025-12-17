import React, { useState, useEffect, useRef } from 'react';
import { Star, Calendar, Quote, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from "../api/apiConfig";

const VIEW_FEEDBACK_ENDPOINT = API_ENDPOINTS.VIEW_FEEDBACK;

interface Testimonial {
  id: number;
  userName: string;
  designation: string;
  companyName: string;
  rating: number;
  feedback: string;
  createdOn: string;
  profileImage: string | null
}

// Function to generate avatar URL as fallback
const generateAvatarUrl = (name: string, index: number): string => {
  const colors = [
    'FF5733', '33FF57', '3357FF', 'F333FF', '33FFF3',
    'FF33A1', 'A133FF', '33FFA1', 'FFC733', '33C7FF'
  ];
  const color = colors[index % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=400`;
};

// Function to check if profile image URL is valid
const isValidProfileImage = (imageUrl: string | null): boolean => {
  if (!imageUrl) return false;
  
  // Check if it's a data URL (base64)
  if (imageUrl.startsWith('data:')) {
    return imageUrl.startsWith('data:image/');
  }
  
  // Check if it's a valid URL
  try {
    const url = new URL(imageUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Function to format date from ISO string
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

type AnimationPhase = 'idle' | 'envelope-rise' | 'envelope-open' | 'cards-appear' | 'cards-ready';

const Mail: React.FC = () => {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [clickHintVisible, setClickHintVisible] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingUsed, setRatingUsed] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get(VIEW_FEEDBACK_ENDPOINT, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          const feedbacks = response.data.data;
          
          // Transform API response to match Testimonial interface
          const transformedTestimonials = feedbacks.map((feedback: any, index: number) => ({
            id: feedback.id || index + 1,
            userName: feedback.userName || 'Anonymous User',
            designation: feedback.designation || 'User',
            companyName: feedback.companyName || 'Unknown Company',
            rating: feedback.rating || 5,
            feedback: feedback.feedback || 'No feedback provided.',
            createdOn: feedback.createdOn || new Date().toISOString(),
            profileImage: feedback.profileImage || null
          }));

          setTestimonials(transformedTestimonials);
          setRatingUsed(response.data.rating_used);
          
          // Start animation once data is loaded
          setShowEnvelope(true);
          setPhase('envelope-rise');
          
          setTimeout(() => {
            setClickHintVisible(true);
          }, 1500);
        } else {
          setTestimonials([]);
          setError('No testimonials available yet.');
        }
      } catch (err: any) {
        console.error('Error fetching testimonials:', err);
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Authentication required. Please log in.');
          } else if (err.response.status === 404) {
            setError('No testimonials found in the database.');
          } else if (err.response.status >= 500) {
            setError('Server error. Please try again later.');
          } else {
            setError(`Error ${err.response.status}: ${err.response.data?.message || 'Failed to load testimonials.'}`);
          }
        } else if (err.request) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to load testimonials. Please try again.');
        }
        
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate cards when in cards-ready phase
  useEffect(() => {
    if (phase !== 'cards-ready' || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      rotateCards();
    }, 4000);

    return () => clearInterval(interval);
  }, [phase, activeCardIndex, testimonials.length]);

  const handleEnvelopeClick = () => {
    if (phase === 'envelope-rise') {
      setClickHintVisible(false);
      setPhase('envelope-open');
      
      setTimeout(() => {
        setPhase('cards-appear');
      }, 800);
      
      setTimeout(() => {
        setPhase('cards-ready');
      }, 1600);
    }
  };

  const rotateCards = () => {
    if (isRotating || testimonials.length <= 1) return;
    
    setIsRotating(true);
    setActiveCardIndex(prev => (prev + 1) % testimonials.length);
    
    setTimeout(() => setIsRotating(false), 1000);
  };

  const getCardPosition = (index: number) => {
    if (testimonials.length === 0) return 0;
    const diff = (index - activeCardIndex + testimonials.length) % testimonials.length;
    return diff;
  };

  // Function to get avatar source - checks if profile image is valid
  const getAvatarSource = (testimonial: Testimonial, index: number): string => {
    if (isValidProfileImage(testimonial.profileImage)) {
      return testimonial.profileImage!;
    }
    return generateAvatarUrl(testimonial.userName, index);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="mail-testimonial-page-wrapper" style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Loading testimonials...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show error state or empty state
  if (error || testimonials.length === 0) {
    return (
      <div className="mail-testimonial-page-wrapper" style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Quote size={32} color="#94a3b8" />
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '12px'
          }}>
            No Testimonials Yet
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#64748b',
            marginBottom: '24px'
          }}>
            {error || 'No testimonials have been submitted yet. Check back soon!'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mail-testimonial-page-wrapper" ref={containerRef}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mail-testimonial-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          padding: 80px 20px 100px;
          overflow: hidden;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .mail-testimonial-header-section {
          text-align: center;
          margin-bottom: 80px;
        }

        .mail-testimonial-title-animated {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 24px 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .mail-testimonial-title-letter {
          display: inline-block;
          opacity: 0;
          animation: mailLetterReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .mail-testimonial-title-letter:nth-child(1) { animation-delay: 0.05s; }
        .mail-testimonial-title-letter:nth-child(2) { animation-delay: 0.1s; }
        .mail-testimonial-title-letter:nth-child(3) { animation-delay: 0.15s; }
        .mail-testimonial-title-letter:nth-child(4) { animation-delay: 0.2s; }
        .mail-testimonial-title-letter:nth-child(5) { animation-delay: 0.25s; }
        .mail-testimonial-title-letter:nth-child(7) { animation-delay: 0.35s; }
        .mail-testimonial-title-letter:nth-child(8) { animation-delay: 0.4s; }
        .mail-testimonial-title-letter:nth-child(10) { animation-delay: 0.5s; }
        .mail-testimonial-title-letter:nth-child(11) { animation-delay: 0.55s; }
        .mail-testimonial-title-letter:nth-child(12) { animation-delay: 0.6s; }
        .mail-testimonial-title-letter:nth-child(13) { animation-delay: 0.65s; }
        .mail-testimonial-title-letter:nth-child(14) { animation-delay: 0.7s; }
        .mail-testimonial-title-letter:nth-child(15) { animation-delay: 0.75s; }
        .mail-testimonial-title-letter:nth-child(16) { animation-delay: 0.8s; }
        .mail-testimonial-title-letter:nth-child(17) { animation-delay: 0.85s; }
        .mail-testimonial-title-letter:nth-child(18) { animation-delay: 0.9s; }
        .mail-testimonial-title-letter:nth-child(19) { animation-delay: 0.95s; }
        .mail-testimonial-title-letter:nth-child(20) { animation-delay: 1s; }
        .mail-testimonial-title-letter:nth-child(21) { animation-delay: 1.05s; }

        .mail-testimonial-title-gap {
          width: 12px;
          display: inline-block;
        }

        .mail-testimonial-subtitle-animated {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
          opacity: 0;
          animation: mailSubtitleReveal 0.8s 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .mail-testimonial-api-info {
          font-size: 0.875rem;
          color: #94a3b8;
          margin-top: 10px;
          font-style: italic;
        }

        @keyframes mailLetterReveal {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes mailSubtitleReveal {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mail-testimonial-mail-area {
          perspective: 2000px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 600px;
          position: relative;
          margin-top: 60px;
        }

        .mail-envelope-container {
          position: absolute;
          z-index: 50;
          opacity: 0;
          transform: translateY(100px) scale(0.9);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }

        .mail-envelope-container:hover {
          transform: translateY(-15px) scale(0.98);
          filter: drop-shadow(0 20px 40px rgba(59, 130, 246, 0.25));
        }

        .mail-envelope-container.visible {
          opacity: 1;
          animation: mailEnvelopeRiseAnimation 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .mail-envelope-container.envelope-open {
          animation: mailEnvelopeOpenAnimation 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .mail-envelope-container.cards-appear,
        .mail-envelope-container.cards-ready {
          opacity: 0 !important;
          transform: translateY(-200px) scale(0.5) !important;
          pointer-events: none;
          visibility: hidden;
        }

        @keyframes mailEnvelopeRiseAnimation {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          70% {
            opacity: 1;
            transform: translateY(-20px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mailEnvelopeOpenAnimation {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.85);
            opacity: 0;
          }
        }

        .mail-envelope-body {
          position: relative;
          width: 420px;
          height: 300px;
          background: linear-gradient(145deg, #f0f4f8, #d9e2ec);
          border-radius: 20px;
          box-shadow: 
            0 30px 100px rgba(59, 130, 246, 0.2),
            0 15px 50px rgba(139, 92, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform-style: preserve-3d;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mail-envelope-container:hover .mail-envelope-body {
          background: linear-gradient(145deg, #e3e8f0, #c8d4e8);
          box-shadow: 
            0 40px 120px rgba(59, 130, 246, 0.3),
            0 20px 60px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .mail-envelope-body::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.7) 48%, rgba(255, 255, 255, 0.7) 52%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.7) 48%, rgba(255, 255, 255, 0.7) 52%, transparent 52%);
          background-size: 40px 40px;
          opacity: 0.4;
        }

        .mail-envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 150px;
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          transform-origin: top center;
          transform: rotateX(0deg);
          transition: transform 0.6s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
          border-radius: 20px 20px 0 0;
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .mail-envelope-container:hover .mail-envelope-flap {
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        }

        .mail-envelope-flap.open {
          transform: rotateX(-180deg);
          z-index: 1;
        }

        .mail-envelope-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 210px;
          background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
          border-radius: 0 0 20px 20px;
          overflow: hidden;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .mail-envelope-stamp {
          position: absolute;
          top: 25px;
          right: 25px;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(15deg);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
          animation: mailStampPulse 2s infinite ease-in-out;
        }

        @keyframes mailStampPulse {
          0%, 100% { transform: rotate(15deg) scale(1); }
          50% { transform: rotate(15deg) scale(1.05); }
        }

        .mail-envelope-stamp span {
          color: white;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .mail-user-opinions-text {
          position: relative;
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 40px;
          text-align: center;
          letter-spacing: -0.5px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          animation: mailTextGlow 3s infinite alternate;
        }

        @keyframes mailTextGlow {
          0% {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1),
                         0 0 20px rgba(59, 130, 246, 0.2);
          }
          100% {
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15),
                         0 0 30px rgba(59, 130, 246, 0.3);
          }
        }

        .mail-user-opinions-text::before,
        .mail-user-opinions-text::after {
          display: none;
        }

        .mail-circles-layer-animation {
          position: absolute;
          width: 100%;
          height: 120px;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .mail-circles-layer {
          position: absolute;
          border-radius: 50%;
          border: 2px solid;
          animation: mailCircleExpand 4s ease-out infinite;
        }

        .mail-circles-layer.layer-1 {
          width: 60px;
          height: 60px;
          border-color: rgba(59, 130, 246, 0.6);
          animation-delay: 0s;
        }

        .mail-circles-layer.layer-2 {
          width: 60px;
          height: 60px;
          border-color: rgba(139, 92, 246, 0.5);
          animation-delay: 1s;
        }

        .mail-circles-layer.layer-3 {
          width: 60px;
          height: 60px;
          border-color: rgba(59, 130, 246, 0.4);
          animation-delay: 2s;
        }

        .mail-circles-layer.layer-4 {
          width: 60px;
          height: 60px;
          border-color: rgba(139, 92, 246, 0.3);
          animation-delay: 3s;
        }

        @keyframes mailCircleExpand {
          0% {
            width: 60px;
            height: 60px;
            opacity: 1;
            border-width: 2px;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
            border-width: 1px;
          }
        }

        .mail-click-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: mailHintReveal 0.8s 1.5s ease-out forwards;
        }

        @keyframes mailHintReveal {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mail-click-text {
          font-size: 15px;
          font-weight: 800;
          color: #3b82f6;
          letter-spacing: 1px;
          text-transform: uppercase;
          animation: mailHintPulse 2s infinite;
        }

        @keyframes mailHintPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .mail-click-arrow {
          animation: mailArrowBounce 1.5s infinite;
        }

        @keyframes mailArrowBounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        .mail-envelope-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          transform: translateX(-100%);
          animation: mailEnvelopeShine 3s infinite;
        }

        @keyframes mailEnvelopeShine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .mail-envelope-line {
          height: 3px;
          background: linear-gradient(90deg, #94a3b8, #cbd5e1);
          border-radius: 2px;
          margin-bottom: 12px;
          opacity: 0.8;
        }

        .mail-envelope-line.short {
          width: 60%;
        }

        .mail-arc-wrapper {
          position: relative;
          width: 100%;
          height: 600px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mail-arc-wrapper.visible {
          opacity: 1;
        }

        .mail-arc-stage {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .mail-arc-item {
          position: absolute;
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }

        /* U-Shaped Arc Layout - Cards forming an upward facing "U" */
        .mail-arc-item.arc-pos-0 {
          transform: translate(-50%, 0) translateX(-300px) translateY(200px) rotate(20deg) scale(0.85);
          z-index: 10;
          filter: blur(2px);
          opacity: 0.7;
          left: 42%;
          top: -30%;
        }

        .mail-arc-item.arc-pos-1 {
          transform: translate(-50%, 0) translateY(50px) rotate(0deg) scale(1);
          z-index: 20;
          filter: blur(0);
          opacity: 1;
          left: 50%;
          top: 10%;
          box-shadow: 0 25px 80px rgba(59, 130, 246, 0.25);
        }

        .mail-arc-item.arc-pos-2 {
          transform: translate(-50%, 0) translateX(300px) translateY(200px) rotate(-20deg) scale(0.85);
          z-index: 10;
          filter: blur(2px);
          opacity: 0.7;
          left: 57%;
          top: -35%;
        }

        .mail-arc-item.rotating {
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mail-card-component {
          width: 350px;
          min-height: 370px;
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 24px;
          padding: 42px 38px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            0 8px 30px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .mail-card-component::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 24px 24px 0 0;
        }

        .mail-card-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .mail-avatar-wrapper {
          position: relative;
          width: 72px;
          height: 72px;
          flex-shrink: 0;
        }

        .mail-avatar-image {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
        }

        .mail-avatar-badge {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .mail-avatar-badge svg {
          color: white;
          width: 14px;
          height: 14px;
        }

        .mail-user-details {
          flex: 1;
          min-width: 0;
        }

        .mail-user-name {
          font-weight: 700;
          font-size: 1.4rem;
          color: #1e293b;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }

        .mail-user-position {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .mail-card-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(226, 232, 240, 0.6);
        }

        .mail-rating-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mail-stars-group {
          display: flex;
          gap: 2px;
        }

        .mail-rating-number {
          font-weight: 700;
          font-size: 1rem;
          color: #3b82f6;
        }

        .mail-date-section {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .mail-date-section svg {
          color: #94a3b8;
          width: 14px;
          height: 14px;
        }

        .mail-quote-area {
          position: relative;
          margin-bottom: 24px;
        }

        .mail-quote-icon {
          position: absolute;
          top: -8px;
          left: -8px;
          color: rgba(59, 130, 246, 0.15);
          width: 20px;
          height: 20px;
        }

        .mail-quote-text {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: #475569;
          margin: 0;
          padding-left: 20px;
        }

        .mail-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .mail-tag-item {
          padding: 6px 14px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border-radius: 16px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .mail-card-footer {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mail-decoration-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          border-radius: 2px;
        }

        .mail-decoration-dots {
          display: flex;
          gap: 6px;
        }

        .mail-decoration-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }

        .mail-decoration-dot:nth-child(1) { opacity: 0.3; }
        .mail-decoration-dot:nth-child(2) { opacity: 0.6; }
        .mail-decoration-dot:nth-child(3) { opacity: 1; }

        .mail-progress-nav {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 30;
        }

        .mail-progress-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mail-progress-bullet:hover {
          background: rgba(59, 130, 246, 0.4);
          transform: scale(1.2);
        }

        .mail-progress-bullet.active {
          background: #3b82f6;
          transform: scale(1.3);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        /* Arc visualization */
        .mail-arc-visual {
          position: absolute;
          top: 250px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 300px;
          pointer-events: none;
          opacity: 0.1;
        }

        .mail-arc-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px dashed #3b82f6;
          border-radius: 400px 400px 0 0;
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .mail-card-component {
            width: 340px;
            min-height: 300px;
            padding: 32px 28px;
          }

          .mail-arc-item.arc-pos-0 {
            transform: translate(-50%, 0) translateX(-180px) translateY(150px) rotate(-8deg) scale(0.75);
          }

          .mail-arc-item.arc-pos-2 {
            transform: translate(-50%, 0) translateX(180px) translateY(150px) rotate(8deg) scale(0.75);
          }

          .mail-envelope-body {
            width: 340px;
            height: 260px;
          }
          
          .mail-user-opinions-text {
            font-size: 26px;
          }

          .mail-arc-visual {
            width: 400px;
          }
        }
      `}</style>

      <div className="mail-testimonial-header-section">
        <h1 className="mail-testimonial-title-animated">
          <span className="mail-testimonial-title-letter">W</span>
          <span className="mail-testimonial-title-letter">o</span>
          <span className="mail-testimonial-title-letter">r</span>
          <span className="mail-testimonial-title-letter">d</span>
          <span className="mail-testimonial-title-letter">s</span>
          <span className="mail-testimonial-title-gap"></span>
          <span className="mail-testimonial-title-letter">o</span>
          <span className="mail-testimonial-title-letter">f</span>
          <span className="mail-testimonial-title-gap"></span>
          <span className="mail-testimonial-title-letter">A</span>
          <span className="mail-testimonial-title-letter">p</span>
          <span className="mail-testimonial-title-letter">p</span>
          <span className="mail-testimonial-title-letter">r</span>
          <span className="mail-testimonial-title-letter">e</span>
          <span className="mail-testimonial-title-letter">c</span>
          <span className="mail-testimonial-title-letter">i</span>
          <span className="mail-testimonial-title-letter">a</span>
          <span className="mail-testimonial-title-letter">t</span>
          <span className="mail-testimonial-title-letter">i</span>
          <span className="mail-testimonial-title-letter">o</span>
          <span className="mail-testimonial-title-letter">n</span>
        </h1>
        <p className="mail-testimonial-subtitle-animated">
          Hear from our valued clients about their experience with CoreShift
          {ratingUsed && (
            <span className="mail-testimonial-api-info">
              {" "}(Showing {testimonials.length} testimonials with rating {ratingUsed}+)
            </span>
          )}
        </p>
      </div>
      
      <div className="mail-testimonial-mail-area">
        <div 
          className={`mail-envelope-container ${showEnvelope ? 'visible' : ''} ${phase}`}
          onClick={handleEnvelopeClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="mail-envelope-body">
            <div className="mail-envelope-shine" />
            <div className={`mail-envelope-flap ${phase === 'envelope-open' || phase === 'cards-appear' || phase === 'cards-ready' ? 'open' : ''}`} />
            <div className="mail-envelope-content">
              
              <div className="mail-user-opinions-text">
                {/* Content removed as requested */}
              </div>
              
              <div className="mail-circles-layer-animation">
                <div className="mail-circles-layer layer-1"></div>
                <div className="mail-circles-layer layer-2"></div>
                <div className="mail-circles-layer layer-3"></div>
                <div className="mail-circles-layer layer-4"></div>
              </div>
              
              {clickHintVisible && phase === 'envelope-rise' && (
                <div className="mail-click-hint">
                  <span className="mail-click-text">Client success</span>
                  <ChevronDown className="mail-click-arrow" size={20} color="#3b82f6" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`mail-arc-wrapper ${phase === 'cards-appear' || phase === 'cards-ready' ? 'visible' : ''}`}>
          <div className="mail-arc-visual">
            <div className="mail-arc-line"></div>
          </div>
          
          <div className="mail-arc-stage">
            {testimonials.map((testimonial, index) => {
              const position = getCardPosition(index);
              const isActive = position === 1;
              const avatarSrc = getAvatarSource(testimonial, index);
              
              return (
                <div
                  key={testimonial.id}
                  className={`mail-arc-item arc-pos-${position} ${isRotating ? 'rotating' : ''}`}
                  onClick={!isActive ? rotateCards : undefined}
                >
                  <div className="mail-card-component">
                    <div className="mail-card-header">
                      <div className="mail-avatar-wrapper">
                        <img 
                          src={avatarSrc} 
                          alt={testimonial.userName}
                          className="mail-avatar-image"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to generated avatar if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = generateAvatarUrl(testimonial.userName, index);
                          }}
                        />
                        <div className="mail-avatar-badge">
                          <Quote size={14} />
                        </div>
                      </div>
                      <div className="mail-user-details">
                        <h3 className="mail-user-name">{testimonial.userName}</h3>
                        <p className="mail-user-position">
                          {testimonial.designation} • {testimonial.companyName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mail-card-info">
                      <div className="mail-rating-section">
                        <div className="mail-stars-group">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              fill={i < Math.floor(testimonial.rating) ? "#fbbf24" : "#e5e7eb"}
                              stroke={i < Math.floor(testimonial.rating) ? "#fbbf24" : "#e5e7eb"}
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="mail-rating-number">{testimonial.rating.toFixed(1)}</span>
                      </div>
                      <div className="mail-date-section">
                        <Calendar size={14} />
                        <span>{formatDate(testimonial.createdOn)}</span>
                      </div>
                    </div>
                    
                    <div className="mail-quote-area">
                      <Quote className="mail-quote-icon" size={20} />
                      <p className="mail-quote-text">{testimonial.feedback}</p>
                    </div>
                    
                    <div className="mail-tags-list">
                      <span className="mail-tag-item">Rating: {testimonial.rating}★</span>
                    </div>
                    
                    <div className="mail-card-footer">
                      <div className="mail-decoration-line" />
                      <div className="mail-decoration-dots">
                        <div className="mail-decoration-dot" />
                        <div className="mail-decoration-dot" />
                        <div className="mail-decoration-dot" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {testimonials.length > 1 && (
            <div className="mail-progress-nav">
              {testimonials.map((_, index) => (
                <div 
                  key={index}
                  className={`mail-progress-bullet ${index === activeCardIndex ? 'active' : ''}`}
                  onClick={() => {
                    if (index !== activeCardIndex && !isRotating) {
                      setIsRotating(true);
                      setActiveCardIndex(index);
                      setTimeout(() => setIsRotating(false), 1000);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mail;