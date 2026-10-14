import CategoryCards from "@/components/home/CategoryCards";
import ClosingCta from "@/components/home/ClosingCta";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import GradeComparison from "@/components/home/GradeComparison";
import Hero from "@/components/home/Hero";
import StickyBar from "@/components/layout/StickyBar";
import TrustBar from "@/components/trust/TrustBar";
import {
  getBrands,
  getCategories,
  getDestacados,
  getProducts,
  getSite,
} from "@/lib/content";

// Revalidación diaria: precio (> 30 días) y disponibilidad (> 15 días) degradan solos sin deploy.
export const revalidate = 86400;

export default function Home() {
  const site = getSite();
  const products = getProducts();
  const categories = getCategories();
  const destacados = getDestacados(4);
  const brands = getBrands();
  const ciudadPrincipal = site.almacenes[0]?.ciudad ?? "Lima";

  return (
    <>
      <Hero ciudad={ciudadPrincipal} />
      <TrustBar items={site.datos_confianza} />
      <CategoryCards categories={categories} products={products} />
      <FeaturedProducts
        products={destacados}
        brands={brands}
        respuestaHoras={site.respuesta_horas}
      />
      <GradeComparison products={products} />
      <ClosingCta respuestaHoras={site.respuesta_horas} />
      {/* <StickyBar /> */}
    </>
  );
}
