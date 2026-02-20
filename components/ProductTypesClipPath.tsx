"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { phoneNumber } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    title: "Cisternas",
    description:
      "Soluciones de almacenamiento de agua para la industria agrícola, ideales para riego y abastecimiento.",
    image: "/productos/1.webp",
    features: [
      "Capacidades: 1 200, 2 000, 2 800, 5 000 y 10 000 Lts.",
      "Alta resistencia",
      "Uso agrícola",
    ],
  },
  {
    id: 2,
    title: "Tanques",
    description:
      "Tanques industriales para los sectores pesquero y petrolero, diseñados para almacenamiento seguro de fluidos.",
    image: "/productos/2.webp",
    features: [
      "Capacidades: 5 000, 10 000, 15 000 y 25 000 Lts.",
      "Uso industrial",
      "Alta durabilidad",
    ],
  },
  {
    id: 3,
    title: "Tolvas",
    description:
      "Tolvas especializadas para almacenamiento y manejo de insumos en la industria alimentaria.",
    image: "/productos/3.webp",
    features: [
      "Capacidades: 600, 1 300, 3 000 y 7 000 Lts.",
      "Diseño cónico",
      "Aptas para alimentos",
    ],
  },
  {
    id: 4,
    title: "Biodigestores",
    description:
      "Sistemas ecológicos para el tratamiento de residuos orgánicos en el sector agrícola.",
    image: "/productos/4.webp",
    features: [
      "Capacidades: 600, 1 300, 3 000 y 7 000 Lts.",
      "Sistema ecológico",
      "Bajo mantenimiento",
    ],
  },
];

export default function ProductTypesClipPath() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;

    // ─── Header: simple fade in ───────────────────────────────────────────
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // ─── Cards: clip-path reveal (descorrido de abajo hacia arriba) ────────
    // Each card starts fully clipped (inset 100% from bottom = invisible)
    // and reveals upward as it enters the viewport.
    // Stagger: each card triggers slightly later so they cascade.
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      gsap.fromTo(
        card,
        {
          clipPath: "inset(100% 0% 0% 0%)", // fully hidden below its own edge
          opacity: 0,
          y: 40,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)", // fully revealed
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.25, // stagger between cards
        },
      );
    });

    // ─── Bottom CTA: fade up ──────────────────────────────────────────────
    if (bottomRef.current) {
      gsap.fromTo(
        bottomRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="productos"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-dark-section to-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="text-center mb-16"
          style={{ opacity: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestros Tipos de Tanques
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Diseñados bajo normativa específica para cada industria
          </p>
        </div>

        {/* ── Products Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{
                opacity: 0,
                clipPath: "inset(100% 0% 0% 0%)",
                willChange: "clip-path, opacity, transform",
              }}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6 relative z-20">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-secondary transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <svg
                        className="w-4 h-4 text-secondary flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className="w-full bg-primary/20 hover:bg-primary text-white py-3 rounded-lg font-medium transition-all duration-300 border border-primary/30 hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/50">
                  Más información
                </button>
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <div
          ref={bottomRef}
          className="text-center mt-16"
          style={{ opacity: 0 }}
        >
          <p className="text-gray-300 mb-6 text-lg">
            ¿No encuentras lo que buscas? Comunícate con nosotros
          </p>
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-dark-section px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Solicitar Cotización Personalizada
          </a>
        </div>
      </div>
    </section>
  );
}
