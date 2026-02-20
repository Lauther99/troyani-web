"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const team = [
  { name: "Placeholder", role: "Gerente General", initials: "GG" },
  { name: "Placeholder", role: "Jefe Comercial", initials: "JC" },
  { name: "Placeholder", role: "Logística y Distribución", initials: "LD" },
  { name: "Placeholder", role: "Atención al Cliente", initials: "AC" },
];


export default function Equipo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.15,
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <span className="text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-3 block">
            Las personas detrás
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Nuestro{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Equipo
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4" />
          {/* TODO: reemplazar con fotos reales del equipo cuando el cliente las proporcione */}
          <p className="text-text-secondary text-sm italic">
            * Fotografías del equipo próximamente
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group text-center"
              style={{ opacity: 0 }}
            >
              {/* Avatar placeholder */}
              <div className="relative mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden">
                {/* TODO: reemplazar con <Image> cuando el cliente entregue las fotos */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/20 rounded-full group-hover:border-primary/60 transition-colors duration-300">
                  <span className="text-2xl font-bold text-primary/50 group-hover:text-primary transition-colors duration-300">
                    {member.initials}
                  </span>
                </div>
                {/* Hover ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/40 transition-all duration-300 scale-110 group-hover:scale-100" />
              </div>
              <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-text-secondary text-sm mt-1">{member.role}</p>
              {/* TODO: agregar nombre real */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
