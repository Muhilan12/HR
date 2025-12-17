import React, { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';

const leftCards = [
  { id: 1, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  { id: 2, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { id: 3, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  { id: 4, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  
];

const rightCards = [
  { id: 5, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
  { id: 6, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop" },
  { id: 7, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop" },
  { id: 8, image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=400&fit=crop" },
];

const Hero = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);
  const [descriptionAnimationComplete, setDescriptionAnimationComplete] = useState(false);
  const [buttonAnimationComplete, setButtonAnimationComplete] = useState(false);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  // Intersection Observer for scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start text animations sequentially
          setTimeout(() => {
            setTitleAnimationComplete(true);
          }, 1000);
          
          setTimeout(() => {
            setDescriptionAnimationComplete(true);
          }, 1700);
          
          setTimeout(() => {
            setButtonAnimationComplete(true);
          }, 2700);
          
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Split title into words for letter-by-letter animation
  const titleText = "Core HR\nsolutions";
  const descriptionText = "Streamline HR processes in one centralized\nplatform, enhancing team transparency.";

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          overflow-x: hidden;
        }

        /* Page container animation */
        .hero-section {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(100px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero Content */
        .hero-content {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          position: relative;
          padding: 0 2rem;
        }

        /* Arc Container - Smaller dimensions for tighter arc */
        .arc-container {
          position: absolute;
          height: 250px;
          width: 280px;
          overflow: visible;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.8s ease 0.5s;
        }

        .hero-section.visible .arc-container {
          opacity: 1;
        }

        .arc-container * {
          pointer-events: auto;
        }

        @media (max-width: 1024px) {
          .arc-container {
            height: 200px;
            width: 150px;
          }
        }

        @media (max-width: 768px) {
          .arc-container {
            height: 160px;
            width: 120px;
          }
        }

        .arc-left {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        .arc-right {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        .arc-track {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Arc Cards - Standard size for all */
        .arc-card {
          position: absolute;
          width: 120px;
          height: 150px;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.3);
          background: #ffffff;
          transition: all 0.3s ease;
          pointer-events: auto;
          opacity: 0;
          transform-origin: center center;
        }

        .hero-section.visible .arc-card {
          opacity: 1;
        }

        /* Center card is larger and has stronger shadow */
        .center-card {
          z-index: 20 !important;
          width: 140px;
          height: 170px;
          box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.4);
        }

        .front-card {
          z-index: 15 !important;
          width: 130px;
          height: 160px;
          box-shadow: 0 10px 36px -6px rgba(0, 0, 0, 0.35);
        }

        .back-card {
          z-index: 10 !important;
          width: 110px;
          height: 140px;
          box-shadow: 0 6px 28px -4px rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 1024px) {
          .arc-card {
            width: 90px;
            height: 120px;
          }
          
          .center-card {
            width: 110px;
            height: 140px;
          }
          
          .front-card {
            width: 100px;
            height: 130px;
          }
          
          .back-card {
            width: 85px;
            height: 115px;
          }
        }

        @media (max-width: 768px) {
          .arc-card {
            width: 70px;
            height: 90px;
            border-radius: 0.75rem;
          }
          
          .center-card {
            width: 85px;
            height: 110px;
          }
          
          .front-card {
            width: 80px;
            height: 100px;
          }
          
          .back-card {
            width: 65px;
            height: 85px;
          }
        }

        .arc-card:hover {
          box-shadow: 0 16px 48px -12px rgba(0, 0, 0, 0.4);
          transform: scale(1.05);
          z-index: 30 !important;
        }

        .arc-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Left arc cards - PROPER ARC MOVEMENT */
        .arc-left .arc-card {
          right: 0;
          top: 50%;
          transform-origin: 100% 50%;
          animation: moveAlongLeftArc 15s linear infinite;
          animation-play-state: paused;
        }

        .hero-section.visible .arc-left .arc-card {
          animation-play-state: running;
        }

        /* Position each card along the arc with delays */
        .arc-left .arc-card:nth-child(1) {
          animation-delay: 0s;
        }

        .arc-left .arc-card:nth-child(2) {
          animation-delay: -3.75s;
        }

        .arc-left .arc-card:nth-child(3) {
          animation-delay: -7.5s;
        }

        .arc-left .arc-card:nth-child(4) {
          animation-delay: -11.25s;
        }

        /* Right arc cards - PROPER ARC MOVEMENT */
        .arc-right .arc-card {
          left: 0;
          top: 50%;
          transform-origin: 0% 50%;
          animation: moveAlongRightArc 15s linear infinite;
          animation-play-state: paused;
        }

        .hero-section.visible .arc-right .arc-card {
          animation-play-state: running;
        }

        /* Position each card along the arc with delays */
        .arc-right .arc-card:nth-child(1) {
          animation-delay: 0s;
        }

        .arc-right .arc-card:nth-child(2) {
          animation-delay: -3.75s;
        }

        .arc-right .arc-card:nth-child(3) {
          animation-delay: -7.5s;
        }

        .arc-right .arc-card:nth-child(4) {
          animation-delay: -11.25s;
        }

        /* PROPER ARC ANIMATIONS */
        @keyframes moveAlongLeftArc {
          0% {
            transform: translateY(-50%) rotate(-90deg) translateX(-180px) rotate(90deg);
            opacity: 0;
            z-index: 1;
          }
          5% {
            opacity: 1;
          }
          20% {
            transform: translateY(-50%) rotate(-60deg) translateX(-180px) rotate(60deg);
            z-index: 10;
          }
          40% {
            transform: translateY(-50%) rotate(-30deg) translateX(-180px) rotate(30deg);
            z-index: 15;
          }
          50% {
            transform: translateY(-50%) rotate(0deg) translateX(-180px) rotate(0deg);
            z-index: 20;
          }
          60% {
            transform: translateY(-50%) rotate(30deg) translateX(-180px) rotate(-30deg);
            z-index: 15;
          }
          80% {
            transform: translateY(-50%) rotate(60deg) translateX(-180px) rotate(-60deg);
            z-index: 10;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) rotate(90deg) translateX(-180px) rotate(-90deg);
            opacity: 0;
            z-index: 1;
          }
        }

        @keyframes moveAlongRightArc {
          0% {
            transform: translateY(-50%) rotate(90deg) translateX(180px) rotate(-90deg);
            opacity: 0;
            z-index: 1;
          }
          5% {
            opacity: 1;
          }
          20% {
            transform: translateY(-50%) rotate(60deg) translateX(180px) rotate(-60deg);
            z-index: 10;
          }
          40% {
            transform: translateY(-50%) rotate(30deg) translateX(180px) rotate(-30deg);
            z-index: 15;
          }
          50% {
            transform: translateY(-50%) rotate(0deg) translateX(180px) rotate(0deg);
            z-index: 20;
          }
          60% {
            transform: translateY(-50%) rotate(-30deg) translateX(180px) rotate(30deg);
            z-index: 15;
          }
          80% {
            transform: translateY(-50%) rotate(-60deg) translateX(180px) rotate(60deg);
            z-index: 10;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) rotate(-90deg) translateX(180px) rotate(90deg);
            opacity: 0;
            z-index: 1;
          }
        }

        /* Center Content */
        .center-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem;
          z-index: 2;
          position: relative;
          max-width: 600px;
        }

        @media (max-width: 768px) {
          .center-content {
            padding: 1.5rem;
            max-width: 90%;
          }
        }

        .icon-container {
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
        }

        .hero-section.visible .icon-container {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .icon-container {
            width: 3rem;
            height: 3rem;
            margin-bottom: 1rem;
          }
        }

        .hero-icon {
          width: 1.75rem;
          height: 1.75rem;
          color: #000000;
        }

        @media (max-width: 768px) {
          .hero-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
        }

        /* Title with letter-by-letter animation */
        .hero-title {
          font-size: 3.5rem;
          font-weight: Bold;
          line-height: 0.5;
          color: #000000;
          margin-bottom: 1rem;
          white-space: pre-line;
          overflow: hidden;
        }

        .title-word {
          display: inline-block;
          overflow: hidden;
        }

        .title-letter {
          display: inline-block;
          opacity: 0;
          filter: blur(10px);
          transform: translateY(10px);
          animation: letterReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes letterReveal {
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }

        /* Line break for title */
        .title-line {
          display: block;
          overflow: hidden;
          line-height: 1.2;
        }

        /* Description with word-by-word animation */
        .hero-description {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          white-space: pre-line;
          overflow: hidden;
        }

        .description-word {
          display: inline-block;
          overflow: hidden;
        }

        .description-letter {
          display: inline-block;
          opacity: 0;
          filter: blur(8px);
          transform: translateY(5px);
          animation: letterReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
            margin-bottom: 0.75rem;
          }

          .hero-description {
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }
          
          .hero-description br {
            display: none;
          }
        }

        .btn {
  padding: 0.75rem 2rem;
  border-radius: 12px;        
  font-weight: 500;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  filter: blur(5px);
  min-width: 240px;
  animation: buttonReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes buttonReveal {
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.btn-default {
  background: #8562e7ff;
  color: #ffffff;
  border-radius: 12px !important;   /* ensure curve stays */
}

.btn-default:hover {
  background: #c857f5ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4);
}

.learn-more-btn {
  padding: 1rem 2.5rem;
  font-size: 1rem;
  border-radius: 12px;              /* matching curved shape */
}

@media (max-width: 800px) {
  .learn-more-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
}
      `}</style>

      <section 
        ref={sectionRef} 
        className={`hero-section ${isVisible ? 'visible' : ''}`}
      >
        {/* Hero Content */}
        <div className="hero-content">
          {/* Left Arc */}
          <div className="arc-container arc-left">
            <div className="arc-track">
              {leftCards.map((card, index) => {
                // Determine card class based on position in animation
                let cardClass = "arc-card";
                if (index === 1) cardClass += " center-card";  // Center position
                else if (index === 2) cardClass += " front-card";  // Front of center
                else if (index === 0 || index === 3) cardClass += " back-card";  // Behind center
                
                return (
                  <div key={card.id} className={cardClass}>
                    <img src={card.image} alt={`Team member ${card.id}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Content */}
          <div className="center-content">
            <div className="icon-container">
              <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 448 512"
  width="32"
  height="32"
  fill="#1D4ED8" // full blue shade
>
  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 0 0 0 256zm89.6 32h-11.2c-22.2 10.4-46.7 16-72.4 16s-50.2-5.6-72.4-16h-11.2C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
</svg>

            </div>
            
            <h1 className="hero-title" ref={titleRef}>
              {titleText.split('\n').map((line, lineIndex) => (
                <span key={lineIndex} className="title-line">
                  {line.split(' ').map((word, wordIndex) => (
                    <span 
                      key={wordIndex} 
                      className="title-word"
                      style={{ 
                        animation: titleAnimationComplete ? 'none' : '',
                        animationDelay: `${(lineIndex * 0.5 + wordIndex * 0.1)}s`
                      }}
                    >
                      {word.split('').map((letter, letterIndex) => (
                        <span 
                          key={letterIndex} 
                          className="title-letter"
                          style={{ 
                            animationDelay: `${(lineIndex * 0.5 + wordIndex * 0.1 + letterIndex * 0.03)}s`,
                            animationPlayState: titleAnimationComplete ? 'running' : 'paused'
                          }}
                        >
                          {letter}
                        </span>
                      ))}
                      <span style={{ marginRight: '0.25em' }}> </span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            
            <p className="hero-description" ref={descriptionRef}>
              {descriptionText.split('\n').map((line, lineIndex) => (
                <span key={lineIndex} style={{ display: 'block' }}>
                  {line.split(' ').map((word, wordIndex) => (
                    <span 
                      key={wordIndex} 
                      className="description-word"
                      style={{ 
                        animation: descriptionAnimationComplete ? 'none' : '',
                        animationDelay: `${(lineIndex * 0.3 + wordIndex * 0.05)}s`
                      }}
                    >
                      {word.split('').map((letter, letterIndex) => (
                        <span 
                          key={letterIndex} 
                          className="description-letter"
                          style={{ 
                            animationDelay: `${(lineIndex * 0.3 + wordIndex * 0.05 + letterIndex * 0.02)}s`,
                            animationPlayState: descriptionAnimationComplete ? 'running' : 'paused'
                          }}
                        >
                          {letter}
                        </span>
                      ))}
                      <span style={{ marginRight: '0.25em' }}> </span>
                    </span>
                  ))}
                </span>
              ))}
            </p>
            
            <button 
              ref={buttonRef}
              className="btn btn-default learn-more-btn"
              style={{
                animationDelay: '0.8s',
                animationPlayState: buttonAnimationComplete ? 'running' : 'paused'
              }}
            >
              Learn more
            </button>
          </div>

          {/* Right Arc */}
          <div className="arc-container arc-right">
            <div className="arc-track">
              {rightCards.map((card, index) => {
                // Determine card class based on position in animation
                let cardClass = "arc-card";
                if (index === 1) cardClass += " center-card";  // Center position
                else if (index === 2) cardClass += " front-card";  // Front of center
                else if (index === 0 || index === 3) cardClass += " back-card";  // Behind center
                
                return (
                  <div key={card.id} className={cardClass}>
                    <img src={card.image} alt={`Team member ${card.id}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;