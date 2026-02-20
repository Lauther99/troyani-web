"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { formatPhoneNumber, phoneNumber } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#productos", label: "Productos" },
    { href: "#contacto", label: "Contacto" },
  ];

  const products = [
    { href: "#", label: "Cisternas" },
    { href: "#", label: "Tanques" },
    { href: "#", label: "Tolvas" },
    { href: "#", label: "Biodigestores" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/Troyaniinversiones.pe", label: "Facebook" },
    {
      icon: Instagram,
      href: "https://instagram.com/troyani.inversiones",
      label: "Instagram",
    },
    // {
    //   icon: Linkedin,
    //   href: "https://linkedin.com/company/troyani",
    //   label: "LinkedIn",
    // },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Image
              src="/logo-t2.webp"
              alt="Troyani Inversiones"
              width={180}
              height={60}
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              Distribuidores autorizados <b>Rotoplas</b> con más de <b>11
              años</b> de experiencia en el mercado.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <svg
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-6">Productos</h3>
            <ul className="space-y-3">
              {products.map((product) => (
                <li key={product.label}>
                  <Link
                    href={product.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <svg
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>Piura, Perú</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <a
                  href={`tel:+${phoneNumber}`}
                  className="hover:text-primary transition-colors"
                >
                  {formatPhoneNumber(phoneNumber)}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <a
                  href="mailto:ventas@troyani.com"
                  className="hover:text-primary transition-colors"
                >
                  stroyani@troyaniinversiones.com
                </a>
              </li>
            </ul>

            {/* Certifications Badge */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-2">Certificaciones:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-400">
                  ASME
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-400">
                  API
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-400">
                  ISO 9001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Troyani Inversiones. Todos los derechos
              reservados.
            </p>
            {/* <div className="flex gap-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Términos de Servicio
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
