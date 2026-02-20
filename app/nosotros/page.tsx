"use client";

import MorphHero from "./components/MorphHero";
import HistoriaTimeline from "./components/HistoriaTimeline";
import MisionVision from "./components/MisionVision";
import Valores from "./components/Valores";
import CifrasClave from "./components/CifrasClave";
import Equipo from "./components/Equipo";
import CTAFinal from "./components/CTAFinal";
import NosotrosHero from "./components/NosotrosHero";
import NosotrosHero3D from "./components/NosotrosHero3D";
import NosotrosBlueprintHero from "./components/NosotrosHeroBlueprint";




export default function NosotrosPage() {
  return (
    <main className="overflow-x-hidden">
      {/* <MorphHero /> */}
      {/* <NosotrosHero /> */}
      {/* <NosotrosHero3D /> */}
      <NosotrosBlueprintHero />
      <HistoriaTimeline />
      <MisionVision />
      <Valores />
      <CifrasClave />
      <Equipo />
      <CTAFinal />
    </main>
  );
}
