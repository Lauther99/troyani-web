// Animation utilities for Framer Motion

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const letterAnimation = {
  initial: { y: -100, opacity: 0, rotateX: -90 },
  animate: { y: 0, opacity: 1, rotateX: 0 },
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3, ease: "easeInOut" },
};

export const hoverLift = {
  y: -10,
  transition: { duration: 0.3, ease: "easeOut" },
};

// Scroll reveal hook utility
export const useScrollReveal = () => {
  if (typeof window === "undefined") return { ref: null };
  
  const ref = { current: null };
  
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    
    return { ref, observer };
  }
  
  return { ref, observer: null };
};
