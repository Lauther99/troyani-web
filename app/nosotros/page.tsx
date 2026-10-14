import type { Metadata } from "next";
import StickyBar from "@/components/layout/StickyBar";
import NosotrosClient from "@/components/nosotros/NosotrosClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Nosotros | Troyani Inversiones - Distribuidor Autorizado Rotoplas",
  description:
    "Conoce a Troyani Inversiones, distribuidor autorizado Rotoplas en Perú desde 2015. Soluciones integrales de almacenamiento de agua y productos químicos para hogar, industria y agro.",
};

export default function NosotrosPage() {
  return (
    <>
      <NosotrosClient />
      <StickyBar />
    </>
  );
}
