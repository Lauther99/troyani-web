import Hero from "@/components/Hero";
import ScrollFrames from "@/components/ScrollFrames";
import ProductTypes from "@/components/ProductTypes";
import WhyTroyani from "@/components/WhyTroyani";
import Gallery from "@/components/Gallery";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      {/* Hero Section with animated title */}
      <Hero />

      {/* 3D Animation Section - Your GSAP scroll frames */}
      <ScrollFrames frameCount={191} />

      {/* Product Types Section - Dark background */}
      <ProductTypes />

      {/* Why Choose Troyani - Light background */}
      <WhyTroyani />

      {/* Gallery Section - Dark background */}
      <Gallery />

      {/* Final CTA Section - Dark background */}
      <CTASection />
    </>
  );
}
