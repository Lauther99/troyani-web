"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { phoneNumber, formatPhoneNumber } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);
  const contactsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const trustRef     = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ─── Title: slide from left ───────────────────────────────────────────
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0,
          duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // ─── Contact items: cascade from left, one by one ─────────────────────
    contactsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0,
          duration: 0.7, ease: "power2.out",
          delay: i * 0.18,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ─── Trust indicators: fade in after contacts ─────────────────────────
    if (trustRef.current) {
      gsap.fromTo(
        trustRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.7, ease: "power2.out",
          delay: 0.5,
          scrollTrigger: {
            trigger: trustRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // ─── Card: 3D flip rotateY (naipe que se da vuelta) ───────────────────
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          rotateY: 90,
          opacity: 0,
          scale: 0.95,
          transformOrigin: "center center",
          transformPerspective: 1000,
        },
        {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const contactItems = [
    {
      icon: Phone,
      label: "Teléfono",
      value: formatPhoneNumber(phoneNumber),
    },
    {
      icon: Mail,
      label: "Email",
      value: "ventas@troyani.com",
    },
    {
      icon: MapPin,
      label: "Ubicación",
      value: "Piura, Perú",
    },
  ];

  const trustItems = [
    "Respuesta en 24h",
    "Asesoría gratis",
    "Sin compromiso",
  ];

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-dark-section via-black to-dark-section relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: CTA Content ──────────────────────────────────────── */}
          <div>
            {/* Title + description */}
            <div ref={titleRef} style={{ opacity: 0 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para iniciar su proyecto?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Solicite hoy mismo una cotización personalizada y reciba
                asesoría técnica sin costo por parte de nuestros especialistas.
              </p>
            </div>

            {/* Contact items — each animates independently */}
            <div className="space-y-4 mb-8">
              {contactItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    ref={(el) => { contactsRef.current[i] = el; }}
                    style={{ opacity: 0 }}
                    className="flex items-center gap-4 text-gray-300"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust indicators */}
            <div
              ref={trustRef}
              style={{ opacity: 0 }}
              className="flex flex-wrap gap-4"
            >
              {trustItems.map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: CTA Card (3D flip) ──────────────────────────────── */}
          <div style={{ perspective: "1000px" }}>
            <div
              ref={cardRef}
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-700"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  Cotización Inmediata
                </h3>
                <p className="text-gray-300">
                  Contáctanos ahora y obtén tu cotización personalizada en minutos
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${phoneNumber}?text=Hola, me interesa solicitar una cotización para tanques industriales`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-5 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 text-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Hablar con un Asesor</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-8 py-5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3 text-lg">
                  <Mail className="w-6 h-6" />
                  <span>Ver Catálogo Completo</span>
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-center text-gray-400 text-sm">
                  🔒 Tus datos están seguros y protegidos
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
