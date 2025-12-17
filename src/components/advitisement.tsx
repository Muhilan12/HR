import { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";

interface Tool {
  id: number;
  name: string;
  description: string;
  logo: string;
}

const tools: Tool[] = [
  {
    id: 1,
    name: "Notion",
    description: "Notes & project management",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  },
  {
    id: 2,
    name: "Google Drive",
    description: "Cloud storage & collaboration",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
  },
  {
    id: 3,
    name: "Microsoft Outlook",
    description: "Email & schedule management",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCPv5TzmZCeb6h4WzvIahPQynPBQlWarcFZg&s",
  },
  {
    id: 4,
    name: "Microsoft Teams",
    description: "Team communication & meetings",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQychPQjxHP_T53JXZDtA3L5BHAu_REHa92NQ&s",
  },
  {
    id: 5,
    name: "Gmail",
    description: "Email & productivity suite",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
  },
  {
    id: 6,
    name: "Slack",
    description: "Workplace communication",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  },
];

const Advertisement = () => {
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [textAnimation, setTextAnimation] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Continuous rotation animation - SLOWER
  useEffect(() => {
    let animationId: number;
    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Rotate continuously (anticlockwise = negative rotation) - SLOWER
      setRotation(prev => prev - (deltaTime * 0.01));
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollPosition = windowHeight - rect.top;
      const sectionHeight = rect.height;
      const progress = Math.min(Math.max(scrollPosition / sectionHeight, 0), 1);
      
      if (progress > 0.3 && progress < 0.8) {
        setIsVisible(true);
        setTextAnimation(true);
      } else {
        setTextAnimation(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    setTextAnimation(true);
  }, []);
  
  // Split title into letters for animation
  const titleLetters = "Integrate with your existing tools in seconds".split('');

  // Create multiple copies of tools array for seamless loop
  const extendedTools = [...tools, ...tools, ...tools];

  // Calculate position for each icon along the arc
  const getCardPosition = (index: number) => {
    const totalItems = tools.length;
    
    // Calculate angle for this specific icon (0° to 180° range for bottom semicircle)
    // Start from right edge (0°) to left edge (180°)
    const baseAngle = (index / totalItems) * 180 + rotation;
    
    // Normalize angle to always be within visible range
    let normalizedAngle = baseAngle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    
    // Only show icons in the bottom semicircle (0° to 180° range)
    // Map to actual position: 0° = right edge, 90° = bottom center, 180° = left edge
    const isVisible = normalizedAngle >= 0 && normalizedAngle <= 180;
    
    if (!isVisible) {
      return { display: 'none', rotation: 0 };
    }
    
    // Oval shape: TIGHTER radius for closer icons
    const radiusX = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.35, 480) : 400;
    const radiusY = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.14, 170) : 150;
    
    // Convert angle to radians for calculation
    const rad = (normalizedAngle * Math.PI) / 180;
    
    // Calculate position (oval at bottom)
    const x = Math.cos(rad) * radiusX;
    const y = Math.sin(rad) * radiusY;
    
    // Scale based on position (larger at bottom center)
    const distanceFromCenter = Math.abs(90 - normalizedAngle);
    const scale = 1.3 - (distanceFromCenter / 180) * 0.6;
    
    // Opacity based on position
    const opacity = 1 - (distanceFromCenter / 180) * 0.4;
    
    // Z-index based on Y position (lower = higher z-index)
    const zIndex = Math.round(100 + y);
    
    // Calculate rotation so icon faces the center
    // Icons on the left side should rotate clockwise, icons on right should rotate counter-clockwise
    const iconRotation = -(normalizedAngle - 90);
    
        return {
      left: `calc(50% + ${x}px)`,
      top: `calc(100% - 80px - ${y}px)`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      display: 'block',
    };
  };

  // Find which tool is at the bottom center
  const getCenterTool = () => {
    const totalItems = tools.length;
    
    // Find which index is closest to 90° (bottom center)
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    for (let i = 0; i < totalItems; i++) {
      const baseAngle = (i / totalItems) * 180 + rotation;
      let normalizedAngle = baseAngle % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;
      
      if (normalizedAngle >= 0 && normalizedAngle <= 180) {
        const distance = Math.abs(90 - normalizedAngle);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
    }
    
    return tools[closestIndex];
  };

  const centerTool = getCenterTool();

  return (
    <div style={{
      width: '100%',
      minHeight: '30vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      padding: '2rem 0',
    }}>
      <section 
        ref={sectionRef}
        style={{
          width: '100%',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div 
          ref={containerRef} 
          style={{
            width: '90%',
            maxWidth: '1400px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '3rem 2rem 6rem',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(229, 231, 235, 0.8)',
          }}
        >
          
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #ffffffff 0%, #fbfbfcff 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            color: 'white',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.25)',
          }}>
            <Settings size={28} style={{ color: '#FFA500' }} />
          </div>
          
          <h2 style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            margin: '0 auto 4rem',
            fontWeight: 700,
            color: '#1f2937',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            maxWidth: '580px',
            padding: '0 2rem',
          }}>
            {titleLetters.map((letter, index) => (
              <span 
                key={index}
                style={{
                  display: 'inline-block',
                  opacity: textAnimation ? 1 : 0,
                  transform: textAnimation ? 'translateY(0) scale(1)' : 'translateY(10px) scale(1.2)',
                  filter: textAnimation ? 'blur(0)' : 'blur(5px)',
                  animation: textAnimation ? `letterReveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s forwards` : 'none',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h2>

          <div style={{
            position: 'relative',
            height: '320px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}>
              {/* Wide oval arc SVG - TIGHTER curve */}
              <svg 
                style={{
                  position: 'absolute',
                  bottom: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '140px',
                  pointerEvents: 'none',
                }}
                viewBox="0 0 960 280"
                preserveAspectRatio="xMidYMax meet"
              >
                <ellipse
                  cx="480"
                  cy="280"
                  rx="460"
                  ry="170"
                  fill="none"
                  stroke="rgba(252, 253, 255, 0.4)"
                  strokeWidth="3"
                  strokeDasharray="8,8"
                  style={{
                    clipPath: 'inset(0 0 50% 0)',
                  }}
                />
              </svg>
              
              {/* Active tool name at arc center */}
              <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '70px',
                transform: 'translateX(-50%)',
                zIndex: 200,
                width: '340px',
                textAlign: 'center',
              }}>
                
                  <h3 style={{
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#222222ff',
                    margin: '0 0 0.5rem',
                  }}>
                    {centerTool.name}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    margin: 0,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}>
                    {centerTool.description}
                  </p>
                
              </div>
              
              {/* Icons moving continuously along the arc - SMALLER */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}>
                {extendedTools.map((tool, index) => {
                  const position = getCardPosition(index);
                  
                  if (position.display === 'none') return null;
                  
                  return (
                    <div
                      key={`${tool.id}-${index}`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        ...position,
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'white',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: hoveredIndex === index
                          ? '0 30px 80px rgba(59, 130, 246, 0.4), 0 15px 50px rgba(59, 130, 246, 0.25)'
                          : '0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)',
                        border: '3px solid rgba(229, 231, 235, 0.95)',
                        transition: 'all 0.3s ease',
                        transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)',
                      }}>
                        <img 
                          src={tool.logo} 
                          alt={tool.name}
                          style={{
                            width: '55px',
                            height: '55px',
                            objectFit: 'contain',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>
      
      <style>{`
        @keyframes letterReveal {
          from {
            opacity: 0;
            transform: translateY(10px) scale(1.2);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes centerPulse {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25), 0 10px 40px rgba(59, 130, 246, 0.2);
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
            box-shadow: 0 25px 70px rgba(59, 130, 246, 0.3), 0 12px 50px rgba(59, 130, 246, 0.25);
          }
        }
      `}</style>
    </div>
  );
};

export default Advertisement;