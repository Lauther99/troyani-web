"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { phoneNumber } from "@/lib/data";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/productos", label: "Productos" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-[0_1px_24px_0_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            {/* ── Izquierda: ícono de menú ── */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg transition-colors text-text-primary hover:opacity-70"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* ── Centro: Logo ── */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-t2.webp"
                  alt="Troyani Inversiones"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* ── Derecha: carrito ── */}
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cotizar por WhatsApp"
              className="p-2 rounded-lg transition-colors text-text-primary hover:opacity-70 relative"
            >
              <ShoppingCart className="h-6 w-6" />
            </a>
          </div>
        </div>
      </nav>

      {/* ─── OVERLAY ─── */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ─── DRAWER LATERAL ─── */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 z-50 flex flex-col
          bg-dark-section text-text-inverse
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Botón cerrar */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-70 transition-opacity text-text-inverse"
          aria-label="Cerrar menú"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Links de navegación */}
        <nav className="flex flex-col justify-center flex-1 px-8 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-4xl font-light tracking-tight transition-colors py-2 ${
                  isActive
                    ? "text-secondary"
                    : "text-text-inverse hover:text-secondary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          {/* CTA en el drawer */}
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="text-4xl font-light tracking-tight text-secondary hover:text-secondary-hover transition-colors py-2"
          >
            Cotizar →
          </a>
        </nav>

        {/* Pie del drawer */}
        <div className="px-8 pb-8 text-sm text-text-light">
          <p>
            © {new Date().getFullYear()} Troyani Inversiones. Todos los derechos
            reservados.
          </p>
        </div>
      </aside>
    </>
  );
}
