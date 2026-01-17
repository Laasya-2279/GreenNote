import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PageLoader = ({ onLoadComplete }) => {
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const overlayTopRef = useRef(null);
  const overlayBottomRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onLoadComplete) onLoadComplete();
      }
    });

    const counter = { value: 0 };
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(counter.value);
        }
      }
    });

    tl.from(textRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, 0.3);

    // Fade out counter and text
    tl.to([counterRef.current, textRef.current], {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    }, "-=0.5");

    // Split and slide away overlays
    tl.to(overlayTopRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut"
    }, "-=0.3");

    tl.to(overlayBottomRef.current, {
      yPercent: 100,
      duration: 1,
      ease: "power4.inOut"
    }, "<");

    // Remove loader from DOM
    tl.to(loaderRef.current, {
      display: "none",
      duration: 0
    });

    return () => {
      tl.kill();
    };
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <div
        ref={overlayTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black to-black"
      />
      
      {/* Bottom Overlay */}
      <div
        ref={overlayBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-black"
      />

      {/* Counter and Text Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Counter */}
          <div className="text-center mb-6">
            <span
              ref={counterRef}
              className="text-8xl md:text-9xl font-bold text-white tracking-tight"
            >
              0
            </span>
            <span className="text-6xl md:text-7xl font-bold text-white/60">%</span>
          </div>

          {/* Loading Text */}
          <div className="overflow-hidden">
            <p
              ref={textRef}
              className="text-lg md:text-xl text-white/80 tracking-widest uppercase font-light text-center"
            >
              Loading Experience
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;