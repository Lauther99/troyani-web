"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Users, Award, CheckCircle, Clock } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Calidad Certificada",
    description: "Cumplimos con las normativas internacionales ASME y API para garantizar seguridad absoluta.",
    features: ["Certificación ASME", "Normas API", "Inspección de calidad"],
  },
  {
    icon: Zap,
    title: "Durabilidad Extrema",
    description: "Materiales de alta resistencia y acabados anticorrosivos para una vida útil prolongada.",
    features: ["Materiales premium", "Anti-corrosión", "Resistencia UV"],
  },
  {
    icon: Users,
    title: "Ingeniería a Medida",
    description: "Diseñamos soluciones específicas según el espacio y las necesidades de tu planta.",
    features: ["Diseño personalizado", "Asesoría técnica", "Soporte 24/7"],
  },
];

const stats = [
  { number: "500+", label: "Proyectos Completados", icon: Award },
  { number: "99%", label: "Satisfacción del Cliente", icon: CheckCircle },
  { number: "15+", label: "Años de Experiencia", icon: Clock },
];

export default function WhyTroyani() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".scroll-animate").forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("visible");
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="beneficios" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            ¿Por qué elegir Troyani?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Más de 15 años brindando soluciones de almacenamiento industrial con los más altos estándares de calidad
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all"></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3">
                  {benefit.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full -z-10"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-dark-section to-black rounded-3xl p-12 scroll-animate">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 scroll-animate">
          <p className="text-center text-text-secondary mb-8 text-lg font-medium">
            Confían en nosotros:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for client logos */}
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium"
              >
                Cliente {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
