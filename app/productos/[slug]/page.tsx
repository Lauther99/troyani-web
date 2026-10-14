import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { getBrands, getProduct, getProducts, getRelacionados } from "@/lib/content";

export const dynamicParams = false;
export const revalidate = 86400;

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };

  const brand = product.marca === "banjo" ? "Banjo" : "Rotoplas";
  return {
    title: `${product.nombre} | ${brand} - Troyani Inversiones`,
    description: product.subtitulo || product.resumen || product.nombre,
    openGraph: {
      title: `${product.nombre} | ${brand}`,
      description: product.subtitulo || product.resumen || product.nombre,
      images: product.imagen_principal ? [{ url: product.imagen_principal }] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: RouteParams) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const brands = getBrands();
  const brand = brands.find((b) => b.slug === product.marca);

  // Relacionados: misma línea / categoría excluyendo el producto actual
  const allProducts = getProducts();
  let related = allProducts
    .filter((p) => p.slug !== product.slug && p.linea === product.linea)
    .slice(0, 4);

  if (related.length === 0) {
    related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 4);
  }

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={related}
      brand={brand}
    />
  );
}
