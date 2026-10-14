import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogClient from "@/components/catalog/CatalogClient";
import Breadcrumb from "@/components/layout/Breadcrumb";
import StickyBar from "@/components/layout/StickyBar";
import { getBrands, getCategories, getCategory, getProducts, getSite } from "@/lib/content";

export const revalidate = 86400;

type RouteParams = {
  params: Promise<{ categoria: string }>;
};

export function generateStaticParams() {
  return getCategories().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { categoria } = await params;
  const cat = getCategory(categoria);
  if (!cat) return { title: "Catálogo" };
  return {
    title: cat.meta.title,
    description: cat.meta.description,
  };
}

export default async function CatalogoCategoriaPage({ params }: RouteParams) {
  const { categoria } = await params;
  const cat = getCategory(categoria);
  if (!cat) {
    notFound();
  }

  const products = getProducts();
  const brands = getBrands();
  const site = getSite();

  return (
    <>
      <div className="container-site flex flex-col gap-4 pt-6 pb-16 md:gap-5 md:pt-8 md:pb-20">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo", href: "/catalogo/" },
            { label: cat.nombre },
          ]}
        />

        <Suspense fallback={null}>
          <CatalogClient
            products={products}
            brands={brands}
            respuestaHoras={site.respuesta_horas}
            categorySlug={cat.slug}
            initialLinea={cat.linea}
            title={cat.h1}
            subtitle={cat.intro}
          />
        </Suspense>
      </div>
      <StickyBar />
    </>
  );
}
