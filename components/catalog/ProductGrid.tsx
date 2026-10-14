import ProductCard from "@/components/product/ProductCard";
import type { Brand, Product } from "@/lib/schemas";

type Props = {
  products: Product[];
  brands: Brand[];
  activeRangoId?: string | null;
  activeRangoIds?: string[];
  respuestaHoras?: number;
};

export default function ProductGrid({
  products,
  brands,
  activeRangoId,
  activeRangoIds,
  respuestaHoras = 2,
}: Props) {
  const brandBySlug = new Map(brands.map((b) => [b.slug, b]));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          brand={brandBySlug.get(product.marca)}
          activeRangoId={activeRangoId}
          activeRangoIds={activeRangoIds}
          respuestaHoras={respuestaHoras}
        />
      ))}
    </div>
  );
}
