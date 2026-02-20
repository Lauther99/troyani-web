"use client";

import { phoneNumber } from "@/lib/data";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl"
      style={{ backgroundColor: "#25D366" }}
    >
      {/* WhatsApp SVG oficial */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-white"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.774L0 32l8.426-2.01A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.756-1.845l-.484-.287-5.003 1.194 1.235-4.865-.316-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.353-1.161-2.718-1.294-.365-.133-.63-.199-.896.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.199-1.681-.62-3.203-1.977-1.184-1.057-1.983-2.362-2.215-2.76-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.896-2.16-1.228-2.957-.323-.776-.651-.671-.896-.683l-.763-.013c-.265 0-.697.1-.1063.497-.365.398-1.394 1.361-1.394 3.318s1.427 3.849 1.626 4.115c.199.265 2.808 4.287 6.804 6.014.951.41 1.692.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.353-.961 2.685-1.889.332-.928.332-1.724.232-1.889-.099-.166-.365-.265-.763-.464z" />
      </svg>

      {/* Ping animado para llamar la atención */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: "#25D366" }} />
    </a>
  );
}
