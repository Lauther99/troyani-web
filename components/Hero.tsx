"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const letters = "TROYANI".split("");

  const letterVariants = {
    initial: { 
      y: -100, 
      opacity: 0, 
      rotateX: -90,
      scale: 0.8,
    },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="inicio" className="relative min-h-screen bg-white flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Animated TROYANI Title */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            className="mb-6 flex justify-center items-center gap-1 md:gap-2 perspective-1000"
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent inline-block"
                style={{ 
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={contentVariants}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            className="text-xl sm:text-2xl md:text-3xl font-light text-text-secondary mb-4"
          >
            Inversiones
          </motion.p>

          {/* Description */}
          <motion.p
            variants={contentVariants}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8"
          >
            Soluciones de almacenamiento industrial certificadas para el almacenamiento 
            de fluidos con estándares internacionales de calidad.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="https://wa.me/51999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Contactar por WhatsApp</span>
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            <a
              href="#productos"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Ver Catálogo Completo
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="mt-16"
          >
            <div className="flex flex-col items-center gap-2 text-text-light">
              <span className="text-sm font-medium">Descubre más</span>
              <svg 
                className="w-6 h-6 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
