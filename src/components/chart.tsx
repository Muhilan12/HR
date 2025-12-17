import { TrendingUp,  Users, Sparkles, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BarChart3, Zap} from "lucide-react";
import { FaShieldAlt } from "react-icons/fa";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);
  const [topRowVisible, setTopRowVisible] = useState(false);
  const [bottomRowVisible, setBottomRowVisible] = useState(false);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  const colors = {
    background: '#f8fafcff ',
    foreground: '#0f172a',
    card: '#ffffff',
    primary: '#7c3aed',
    primaryForeground: '#ffffff',
    secondary: '#f1f5f9',
    muted: '#e2e8f0',
    mutedForeground: '#64748b',
    border: '#e4e4e7',
  };

  const gradients = {
    primary: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    card: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)'
  };

  // Hero text animation - blur to clear, letter by letter
  useEffect(() => {
    setMounted(true);
    
    if (heroTitleRef.current) {
      const text = "Built for everyone";
      heroTitleRef.current.innerHTML = "";
      
      text.split("").forEach((char: string, i: number) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.filter = "blur(12px)";
        span.style.transform = "translateY(20px)";
        span.style.display = "inline-block";
        span.style.animation = `letterReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
        span.style.animationDelay = `${i * 0.08}s`;
        if (char === " ") {
          span.style.width = "0.5em";
        }
        heroTitleRef.current?.appendChild(span);
      });
    }

    // Auto trigger top row after hero animation
    setTimeout(() => {
      setTopRowVisible(true);
    }, 1800);

  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes letterReveal {
        0% {
          opacity: 0;
          filter: blur(12px);
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes barGrow {
        from {
          height: 0;
          opacity: 0;
        }
        to {
          height: var(--target-height);
          opacity: 1;
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      
      @keyframes pulseSoft {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
      
      @keyframes avatarPop {
        0% {
          opacity: 0;
          transform: scale(0);
        }
        70% {
          opacity: 1;
          transform: scale(1.15);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes sparkle {
        0%, 100% {
          opacity: 0;
          transform: scale(0) translateX(-50%);
        }
        50% {
          opacity: 1;
          transform: scale(1) translateX(-50%);
        }
      }
      
      @keyframes circleFloat {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes cardSlideIn {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes rowReveal {
        from {
          opacity: 0;
          transform: translateY(60px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes glowPulse {
        0%, 100% {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
        }
        50% {
          box-shadow: 0 0 30px rgba(124, 58, 237, 0.4);
        }
      }
      
      .attendance-chart__bar {
        animation: barGrow 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .training-chart__bar {
        animation: barGrow 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .team-avatars__avatar {
        opacity: 0;
        animation: avatarPop 0.6s ease-out forwards;
      }
      
      .employee-list__item {
        opacity: 0;
        transform: translateX(-10px);
        animation: slideUp 0.4s ease-out forwards;
      }
      
      .top-row-card {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      
      .bottom-row-card {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      
      .bottom-row-container {
        opacity: 0;
        transform: translateY(60px);
      }
      
      .top-row-visible .top-row-card:nth-child(1) {
        animation: cardSlideIn 0.6s ease-out 0.1s forwards;
      }
      
      .top-row-visible .top-row-card:nth-child(2) {
        animation: cardSlideIn 0.6s ease-out 0.2s forwards;
      }
      
      .top-row-visible .top-row-card:nth-child(3) {
        animation: cardSlideIn 0.6s ease-out 0.3s forwards;
      }
      
      .bottom-row-visible .bottom-row-container {
        animation: rowReveal 0.8s ease-out forwards;
      }
      
      .bottom-row-visible .bottom-row-card:nth-child(1) {
        animation: cardSlideIn 0.6s ease-out 0.3s forwards;
      }
      
      .bottom-row-visible .bottom-row-card:nth-child(2) {
        animation: cardSlideIn 0.6s ease-out 0.4s forwards;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleTopRowMouseLeave = () => {
    setTimeout(() => {
      setBottomRowVisible(true);
    }, 300);
  };

  return (
    <div style={{
      backgroundColor: colors.background,
      position: 'relative',
      overflowX: 'hidden',
      minHeight: '100vh',
      cursor: 'default'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(17, 11, 27, 0.1), rgba(8, 8, 8, 0.1))',
          filter: 'blur(60px)',
          top: '-200px',
          right: '-200px',
          animation: 'circleFloat 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(20, 184, 166, 0.1))',
          filter: 'blur(60px)',
          bottom: '-150px',
          left: '-150px',
          animation: 'circleFloat 20s ease-in-out infinite 5s'
        }} />
      </div>

      {/* Hero Section */}
      <div style={{
        paddingTop: '8rem',
        paddingBottom: '4rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        position: 'relative',
        minHeight: '30vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'sparkle 2s ease-in-out infinite 0.5s'
          }}>
            <Sparkles size={24} color={colors.primary} />
          </div>
          
         <h1
  ref={heroTitleRef}
  style={{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    color: colors.foreground,
    marginBottom: "1.5rem",
    fontWeight: 700,       // BOLD
    lineHeight: 1.2,
    letterSpacing: "0.01em"
  }}
>
  Built for everyone
</h1>

          
          <p style={{
            fontSize: '1.125rem',
            color: colors.mutedForeground,
            maxWidth: '42rem',
            margin: '0 auto 2rem',
            animation: 'fadeIn 1s ease-out 1.5s forwards',
            opacity: 0,
            lineHeight: 1.6
          }}>
            Thousands of businesses, from startups to enterprises, use CoreShift to handle payments.
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <section id="features" style={{ 
        padding: '0 1.5rem 5rem', 
        position: 'relative', 
        zIndex: 1,
        minHeight: 'calc(100vh - 30vh)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Top Row - 3 Cards */}
          <div 
            ref={topRowRef}
            className={topRowVisible ? 'top-row-visible' : ''}
            onMouseLeave={handleTopRowMouseLeave}
            style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              transition: 'all 0.5s ease',
              opacity: topRowVisible ? 1 : 0,
              transform: topRowVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            {/* HR Card */}
            <div className="top-row-card" style={{
              backgroundColor: colors.card,
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 20px -4px rgba(148, 163, 184, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px -4px rgba(148, 163, 184, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 20px -4px rgba(148, 163, 184, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                
                <AttendanceChart />
                
              </div>
              <h3 style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontSize: '1.5rem',
                color: colors.foreground,
                marginBottom: '0.5rem'
              }}>For HR professionals</h3>
              <p style={{
                fontSize: '0.875rem',
                color: colors.mutedForeground,
                lineHeight: 1.6
              }}>
                Use a single cloud system for your employees, candidates and HR processes info.
              </p>
            </div>

            {/* Managers Card */}
            <div className="top-row-card" style={{
              backgroundColor: colors.card,
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 20px -4px rgba(148, 163, 184, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px -4px rgba(148, 163, 184, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 20px -4px rgba(148, 163, 184, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <InsightsWidget />
              </div>
              <h3 style={{
                fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontSize: '1.5rem',
                color: colors.foreground,
                marginBottom: '0.5rem'
              }}>For managers & leaders</h3>
              <p style={{
                fontSize: '0.875rem',
                color: colors.mutedForeground,
                lineHeight: 1.6
              }}>
                Get always up-to-date data and monitor performance of the company.
              </p>
             
            </div>

            {/* Legal Card */}
            <div className="top-row-card" style={{
              backgroundColor: colors.card,
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 20px -4px rgba(148, 163, 184, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px -4px rgba(148, 163, 184, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 20px -4px rgba(148, 163, 184, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <LegalWidget />
              </div>
              <h3 style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontSize: '1.5rem',
                color: colors.foreground,
                marginBottom: '0.5rem'
              }}>For legal teams</h3>
              <p style={{
                fontSize: '0.875rem',
                color: colors.mutedForeground,
                lineHeight: 1.6
              }}>
                CoreShift helps legal teams by streamlining compliance, managing contracts and policies.
              </p>
            </div>
          </div>

          {/* Bottom Row - 2 Cards */}
          <div 
            ref={bottomRowRef}
            className={`bottom-row-container ${bottomRowVisible ? 'bottom-row-visible' : ''}`}
            style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: bottomRowVisible ? '2fr 1fr' : '1.5fr 1fr',
              transition: 'all 0.6s ease-out',
              opacity: bottomRowVisible ? 1 : 0,
              transform: bottomRowVisible ? 'translateY(0)' : 'translateY(60px)'
            }}
          >
            {/* Employee Data Card - Card 4 (Larger) */}
            <div className="bottom-row-card" style={{
              backgroundColor: colors.card,
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 20px -4px rgba(148, 163, 184, 0.5)',
              transition: 'all 0.3s ease',
              transform: bottomRowVisible ? 'scale(1)' : 'scale(0.95)',
              opacity: bottomRowVisible ? 1 : 0
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px -4px rgba(148, 163, 184, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 20px -4px rgba(148, 163, 184, 0.5)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem',marginLeft:'120px' }}>
                  <EmployeeListWidget />
                  <TrainingChart />
                </div>
              </div>
              <h3
  style={{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontSize: "1.5rem",
    color: colors.foreground,
    marginBottom: "0.5rem",
    marginTop: "-1rem"     
  }}
>
  All employee data at once
</h3>

              <p style={{
                fontSize: '0.875rem',
                width:'350px',
                color: colors.mutedForeground,
                lineHeight: 1.6
              }}>
                Contact and personal information, paid and unpaid leave balances, career history, projects and more.
              </p>
            </div>

            {/* Teams Card - Card 5 (Smaller) */}
            <div className="bottom-row-card" style={{
              backgroundColor: colors.card,
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 20px -4px rgba(148, 163, 184, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative',
              transform: bottomRowVisible ? 'scale(1)' : 'scale(0.95)',
              opacity: bottomRowVisible ? 1 : 0
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px -4px rgba(148, 163, 184, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 20px -4px rgba(148, 163, 184, 0.5)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}>
              <div style={{ marginBottom: '1.5rem', height: '200px' }}>
                <TeamAvatars />
              </div>
              <h3 style={{
                fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontSize: '1.5rem',
                color: colors.foreground,
                marginBottom: '0.5rem'
              }}>For teams & employees</h3>
              <p style={{
                fontSize: '0.875rem',
                color: colors.mutedForeground,
                lineHeight: 1.6
              }}>
                Get to know who is going to be out of office and be aware of upcoming events.
              </p>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


// Widget Components
const AttendanceChart = () => {
  const attendanceData = [
    { day: "Tue", primary: 85, secondary: 65 },
    { day: "Wed", primary: 60, secondary: 75 },
    { day: "Thu", primary: 40, secondary: 55 },
    { day: "Fri", primary: 50, secondary: 35 },
  ];

  return (
    
    <div style={{
  backgroundColor: 'white',
  borderRadius: '1rem',
  padding: '1.2rem',
  boxShadow: '0 0 30px rgba(0,0,0,0.25)', // darker, wider, no vertical offset
  width: '80%',
  height: '160px',       
  maxWidth: '420px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column'
}}>


      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <span style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#111827'
        }}>
          Attendance Report
        </span>
      </div>

      {/* Chart Container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        flex: 1,
        minHeight: 0,
        marginBottom: "0",
      }}>

        {/* Y-axis Labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '40px',
          paddingRight: '0.75rem'
        }}>
          {attendanceData.map((item) => (
            <span key={item.day} style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textAlign: 'right',
              lineHeight: 1,
              margin: '6px 0'
            }}>
              {item.day}
            </span>
          ))}
        </div>

        {/* Chart Area */}
        <div style={{
          flex: 1,
          position: 'relative',
          minWidth: 0
        }}>

          {/* Bars Container */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 0.5rem'
          }}>
            {attendanceData.map((item) => (
              <div key={item.day} style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '6px',
                height: '100%',
                flex: 1,
                maxWidth: '55px',
                position: 'relative'
              }}>

                {/* PURPLE multi-layer bar */}
                <div style={{
  width: '100%',
  maxWidth: '20px',
  borderRadius: '6px 6px 0 0',
  background: `
    linear-gradient(
      180deg,
      #A78BFA 0%,
      #A78BFA 33%,
      #8B5CF6 33%,
      #8B5CF6 66%,
      #7C3AED 66%,
      #7C3AED 100%
    )
  `,
  height: `${item.secondary}%`,
  minHeight: '4px',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}}
 />

                {/* PINK multi-layer bar */}
                <div style={{
  width: '100%',
  maxWidth: '20px',
  borderRadius: '6px 6px 0 0',
  background: `
    linear-gradient(
      180deg,
      #FF6B8B 0%,
      #FF6B8B 33%,
      #FF3D6A 33%,
      #FF3D6A 66%,
      #FF1744 66%,
      #FF1744 100%
    )
  `,
  height: `${item.primary}%`,
  minHeight: '4px',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}}
 />

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};


interface CardData {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const cardsData: CardData[] = [
  {
    id: 1,
    icon: <BarChart3 size={20} />,
    title: "Access Real-Time Insights",
    description: "Make Data-Driven Decisions"
  },
  {
    id: 2,
    icon: <Zap size={20} />,
    title: "Instant Performance Metrics",
    description: "Monitor Key Indicators"
  },
  {
    id: 3,
    icon: <TrendingUp size={20} />,
    title: "Track Growth Analytics",
    description: "Optimize Business Strategy"
  },
];

const InsightsWidget = () => {
  const [cards, setCards] = useState(cardsData);
  const [isShuffling, setIsShuffling] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShuffling(true);
      
      setTimeout(() => {
        setCards((prevCards) => {
          const newCards = [...prevCards];
          const firstCard = newCards.shift();
          if (firstCard) {
            newCards.push(firstCard);
          }
          return newCards;
        });
        setActiveIndex((prev) => (prev + 1) % cardsData.length);
        setIsShuffling(false);
      }, 600);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '10vh',
      padding: '2rem',
      backgroundColor: 'white'
    }}>
      <div style={{
        position: 'relative',
        width: '320px',
        height: '98px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Outer Circle Frame */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '2px solid transparent',
          background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%) border-box',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '2px',
          opacity: '0.3'
        }} />
        
        {/* Inner Circle Frame */}
        <div style={{
          position: 'absolute',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Animated Gradient Ring */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, #ffffffff, #ffffffff, transparent)',
            animation: 'rotate 3s linear infinite',
            opacity: '0.4',
            filter: 'blur(8px)'
          }} />
        </div>

        {/* Cards Stack */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '230px',
          perspective: '1000px',
          marginBottom: '60px'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: `0 4px 20px -4px rgba(124, 58, 237, 0.15),
                           0 2px 8px -2px rgba(15, 23, 42, 0.08)`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #e2e8f0',
                backfaceVisibility: 'hidden',
                zIndex: 3 - index,
                transform: index === 0 ? 'translateY(0) scale(1)' :
                           index === 1 ? 'translateY(12px) scale(0.95)' :
                           'translateY(24px) scale(0.9)',
                opacity: index === 0 ? 1 : index === 1 ? 0.8 : 0.6,
                animation: isShuffling && index === 0 ? 'shuffleOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' :
                          isShuffling && index === 2 ? 'shuffleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none'
              }}
            >
              {/* Card Icon */}
              <div style={{
                width: '30px',
                height: '30px',
                minWidth: '30px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px -2px rgba(124, 58, 237, 0.3)'
              }}>
                {card.icon}
              </div>

              {/* Card Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {card.title}
                </h4>
                <p style={{
                  fontSize: '9px',
                  color: '#64748b',
                  margin: '2px 0 0 0',
                  lineHeight: 1.3
                }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style >{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shuffleOut {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) translateX(20px) scale(0.85) rotateZ(5deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(24px) scale(0.9);
            opacity: 0.6;
            z-index: 1;
          }
        }
        
        @keyframes shuffleIn {
          0% {
            transform: translateY(24px) scale(0.9);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) scale(0.92);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
            z-index: 3;
          }
        }
        
        /* Card hover effect */
        div[style*="position: absolute"][style*="width: 100%"]:hover {
          
        }
        
        /* Responsive styles */
        @media (max-width: 640px) {
          div[style*="position: relative"][style*="width: 320px"] {
            width: 280px;
            height: 440px;
          }
          
          div[style*="position: absolute"][style*="width: 300px"] {
            width: 260px;
            height: 260px;
          }
          
          div[style*="position: absolute"][style*="width: 280px"] {
            width: 240px;
            height: 240px;
          }
          
          div[style*="position: relative"][style*="width: 200px"] {
            width: 170px;
            height: 70px;
          }
          
          div[style*="position: absolute"][style*="width: 100%"] {
            padding: 12px;
            gap: 10px;
          }
          
          div[style*="width: 40px"][style*="minWidth: 40px"] {
            width: 34px;
            height: 34px;
            min-width: 34px;
          }
          
          h4 {
            font-size: 12px !important;
          }
          
          p {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};


const LegalWidget = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "220px",
        height: "180px",
        borderRadius: "20px",
        
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >

      {/* Left faded card */}
      <div
        style={{
          position: "absolute",
          width: "130px",
          height: "95px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.9)",
          opacity: 0.85,
          border: "1px solid rgba(0,0,0,0.08)",
          transform: "rotate(-12deg) translateX(-55px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "6px",
        }}
      >
        {/* Avatar frame */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "#e5e7eb",
          }}
        ></div>

        {/* 2 text lines */}
        <div
          style={{
            width: "80px",
            height: "6px",
            borderRadius: "4px",
            background: "#e5e7eb",
          }}
        ></div>

        <div
          style={{
            width: "60px",
            height: "6px",
            borderRadius: "4px",
            background: "#e5e7eb",
          }}
        ></div>
      </div>

      {/* Right faded card */}
      <div
        style={{
          position: "absolute",
          width: "130px",
          height: "95px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.9)",
          opacity: 0.85,
          border: "1px solid rgba(0,0,0,0.08)",
          transform: "rotate(12deg) translateX(55px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "6px",
        }}
      >
        {/* Avatar frame */}
        <div
          style={{
            width: "28px",
            marginLeft: "auto",
            height: "28px",
            borderRadius: "8px",
            background: "#e5e7eb",
          }}
        ></div>

        {/* 2 text lines */}
        <div
          style={{
            width: "80px",
            height: "6px",
            borderRadius: "4px",
            background: "#e5e7eb",
          }}
        ></div>

        <div
          style={{
            width: "60px",
            height: "6px",
            borderRadius: "4px",
            background: "#e5e7eb",
          }}
        ></div>
      </div>

      {/* Main purple icon card */}
      <div
  style={{
    width: "70px",
    height: "70px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
    animation: "float 4s ease-in-out infinite",
    zIndex: 10,
    marginBottom: "-100px",
  }}
>
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L3 6V11C3 16.55 7.58 21.74 12 22C16.42 21.74 21 16.55 21 11V6L12 2Z"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#ffffff"
    />
  </svg>
</div>


      {/* Bottom gray lines */}
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          width: "80px",
          height: "6px",
          borderRadius: "4px",
          background: "#e5e7eb",
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          bottom: "8px",
          width: "55px",
          height: "6px",
          borderRadius: "4px",
          background: "#e5e7eb",
        }}
      ></div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};



const EmployeeListWidget = () => {
  const employees = [
    { name: "William Gray", role: "Visual Designer", color: '#7c3aed' },
    { name: "Derek Sydall", role: "PM/BA", color: '#f97316' },
    { name: "Chris Rivera", role: "PM/BA", color: '#14b8a6' },
  ];

  return (
    <div style={{
      position: "relative",      
      backgroundColor: 'rgba(241, 245, 249, 0.5)',
      borderRadius: '1.5rem',
      padding: '1rem',
      flex: 1
    }}>

     
     <div
  style={{
    position: "absolute",
    top: "14px",
    left: "-104px",
    width: "60px",           
    height: "60px",          
    borderRadius: "1rem",    
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  }}
>
  {/* Hollow circle icon container */}
  <div
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "2px solid #f97316", // hollow circle with orange border
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent", // remove fill
    }}
  >
    <svg
      width="24"
      height="24"
      fill="#f97316"   // icon in orange
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 
        1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 
        20V4h7v5h5v11H6z" />
    </svg>
  </div>
</div>


      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#0f172a'
        }}>Employees</span>
        <span style={{
          fontSize: '0.75rem',
          color: '#64748b',
          cursor: 'pointer',
          transition: 'color 0.2s ease'
        }}>
          See all
        </span>
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <span style={{
          fontSize: '0.75rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          color: '#64748b',
          cursor: 'pointer'
        }}>
          Project Dept
        </span>
        <span style={{
          fontSize: '0.75rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          color: '#7c3aed',
          cursor: 'pointer',
          fontWeight: 500
        }}>
          Sales Dept
        </span>
      </div>

      {/* Employee List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {employees.map((emp, i) => (
          <div key={i} className="employee-list__item" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem',
            borderRadius: '0.5rem',
            animationDelay: `${0.1 * i}s`
          }}>
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              backgroundColor: emp.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{
                fontSize: '0.625rem',
                color: '#ffffff',
                fontWeight: 600
              }}>{emp.name[0]}</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#0f172a'
              }}>{emp.name}</p>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b'
              }}>{emp.role}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};


const TrainingChart = () => {
  const bars = [40, 60, 80, 50, 70, 90, 65];

  return (
    <div style={{
      backgroundColor: 'rgba(241, 245, 249, 0.5)',
      borderRadius: '1.5rem',
      padding: '1rem',
      flex: 1
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#0f172a'
        }}>Training</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            fontWeight: 500
          }}>
            Monthly
          </span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.5rem',
        height: '80px'
      }}>
        {bars.map((h, i) => (
          <div 
            key={i}
            className="training-chart__bar"
            style={{
              flex: 1,
              background: 'linear-gradient(to top, #7c3aed, rgba(124, 58, 237, 0.6))',
              borderRadius: '0.25rem 0.25rem 0 0',
              transition: 'filter 0.2s ease',
              animationDelay: `${0.05 * i}s`,
              '--target-height': `${h}%`
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          />
        ))}
      </div>
    </div>
  );
};

const TeamAvatars = () => {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&crop=face"
  ];
  const centerImage =
    "https://static.vecteezy.com/system/resources/thumbnails/067/868/385/small_2x/two-people-sitting-at-a-table-icon-for-discussion-vector.jpg";
  const containerSize = 16 * 16; // container = 16rem => 256px
  const avatarSize = 3.3 * 16;   // avatar = 3.3rem => 52px
  // radius = half container - half avatar - padding
  const radius = containerSize / 2 - avatarSize / 2 - 12;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "1rem"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "16rem",
          height: "16rem"
        }}
      >
        {/* CENTER IMAGE */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "5rem",
            height: "5rem",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={centerImage}
            alt="center"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "0.4rem"
            }}
          />
        </div>
        {/* AUTO-POSITIONED AVATARS */}
        {avatars.map((avatar, i) => {
          const angle = (i * (360 / avatars.length)) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: `${x}px`,
                marginTop: `${y}px`,
                transform: `translate(-50%, -50%)`,
                width: "3.3rem",
                height: "3.3rem",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `url('${avatar}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Index;