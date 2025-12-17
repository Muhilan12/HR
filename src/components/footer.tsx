import { Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "../styles/footer.scss";

const Footer = () => {
  const coreShiftLetters = "CoreShift".split("");
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [isMouseInFooter, setIsMouseInFooter] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      setIsMouseInFooter(true);
      
      // Only trigger animation once per page visit
      if (!hasAnimated) {
        setHasAnimated(true);
        
        // Trigger sequential animation for each letter
        lettersRef.current.forEach((letter, index) => {
          if (letter) {
            // Reset any existing styles first
            letter.style.transform = 'translateY(-40px)';
            letter.style.filter = 'blur(20px)';
            letter.style.opacity = '0';
            
            // Apply animation with delay for each letter
            setTimeout(() => {
              letter.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
              letter.style.transform = 'translateY(0)';
              letter.style.filter = 'blur(0)';
              letter.style.opacity = '1';
              
              // Remove transition after animation completes
              setTimeout(() => {
                letter.style.transition = '';
              }, 600);
            }, index * 100); // 100ms delay between each letter
          }
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      // Update CSS variables for mouse position
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);

      // Only apply wave effect if mouse is in footer
      if (isMouseInFooter) {
        lettersRef.current.forEach((letter, index) => {
          if (letter) {
            const distance = Math.abs(index - ((x / 100) * (lettersRef.current.length - 1)));
            const intensity = Math.max(0, 1 - distance / 3);
            
            letter.style.transform = `
              translateY(${-intensity * 10}px)
              rotateZ(${(Math.sin(Date.now() * 0.002 + index * 0.3) * intensity * 3)}deg)
              scale(${1 + intensity * 0.05})
            `;
            letter.style.filter = `blur(${Math.max(0, 1.5 - intensity * 1.5)}px)`;
          }
        });
      }
    };

    const handleMouseLeave = () => {
      setIsMouseInFooter(false);
      
      // Smoothly reset letters when mouse leaves
      lettersRef.current.forEach((letter) => {
        if (letter) {
          letter.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
          letter.style.transform = 'translateY(0) rotateZ(0) scale(1)';
          letter.style.filter = 'blur(0)';
          letter.style.opacity = '1';
          
          // Remove transition after reset
          setTimeout(() => {
            if (letter) {
              letter.style.transition = '';
            }
          }, 300);
        }
      });
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMouseInFooter, hasAnimated]);

  const navColumns = [
    {
      title: "Product",
      links: ["CoreHR", "Recruit", "Perform", "Pulse"],
    },
    {
      title: "Features",
      links: ["Desk", "Time", "Analytics"],
    },
    {
      title: "Pricing",
      links: [],
    },
    {
      title: "Resources",
      links: [],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer__container" ref={containerRef}>
        {/* Top section */}
        <div className="footer__top">
          {/* Description */}
          <div className="footer__description">
            <p>
              CoreShift is the HRM platform that build a thriving workplace
              culture—all in one place.
            </p>
          </div>

          {/* Navigation columns */}
          <nav className="footer__nav">
            {navColumns.map((column) => (
              <div key={column.title} className="footer__nav-column">
                <h4>{column.title}</h4>
                {column.links.length > 0 && (
                  <ul>
                    {column.links.map((link) => (
                      <li key={link}>
                        <a href="#">{link}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          {/* Social icons */}
          <div className="footer__social">
            <h4>Follow us</h4>
            <div className="footer__social-icons">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="footer__social-link" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Large CoreShift text with animation */}
        <div className="footer__brand">
          <div className="footer__brand-text">
            {coreShiftLetters.map((letter, index) => (
              <span 
                key={index} 
                className="footer__letter footer__letter--initial"
                ref={(el: HTMLSpanElement | null) => {
                  lettersRef.current[index] = el;
                }}
                data-index={index}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="footer__gradient-overlay" />
          
          {/* Mouse position indicator */}
          <div className="footer__mouse-indicator" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;