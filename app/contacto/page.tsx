import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contacto y Cotizaciones | Troyani Inversiones",
  description:
    "Comunícate con Silvana Troyani para asesoría técnica y cotización personalizada de tanques de polietileno, cisternas, biodigestores y accesorios Rotoplas en todo el Perú.",
};

export default function ContactoPage() {
  return <ContactClient />;
}
