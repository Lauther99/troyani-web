import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogClient from "@/components/catalog/CatalogClient";
import Breadcrumb from "@/components/layout/Breadcrumb";
import StickyBar from "@/components/layout/StickyBar";
import { getBrands, getProducts, getSite } from "@/lib/content";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Catálogo de tanques y accesorios",
  description:
    "Catálogo completo de tanques de polietileno Rotoplas, cisternas, biodigestores, tolvas, bombas, termas y accesorios Banjo de 250 a 25,000 litros.",
};

export default function CatalogoPage() {
  const products = getProducts();
  const brands = getBrands();
  const site = getSite();

  return (
    <>
      <div className="container-site flex flex-col gap-4 pt-6 pb-16 md:gap-5 md:pt-8 md:pb-20">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo" },
          ]}
        />

        <Suspense fallback={null}>
          <CatalogClient
            products={products}
            brands={brands}
            respuestaHoras={site.respuesta_horas}
            title="Catálogo de tanques y accesorios"
            subtitle="Tanques de polietileno, cisternas, biodigestores, tolvas y equipamiento de 250 a 25,000 litros para hogar y agroindustria."
          />
        </Suspense>
      </div>
      <StickyBar />
    </>
  );
}
