"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  frameCount: number;
};

export default function ScrollFrames({ frameCount }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint móvil
    };

    handleResize(); // detectar al montar
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const framePath = (i: number) => {
    const folder = isMobile ? "frames-ver" : "frames-hor";
    return `/hero/${folder}/frame_${String(i).padStart(3, "0")}.webp`;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const container = containerRef.current!;
    const wrapper = wrapperRef.current!;

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadFirst = Math.min(20, frameCount);

    for (let i = 0; i < preloadFirst; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === preloadFirst) {
          setLoaded(true);
          drawFrame(0);
          playEntrance();
        }
      };
      images[i] = img;
    }

    for (let i = preloadFirst; i < frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      images[i] = img;
    }

    imagesRef.current = images;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(0);
    }

    function drawFrame(index: number) {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cw = canvas.width / (window.devicePixelRatio || 1);
      const ch = canvas.height / (window.devicePixelRatio || 1);

      const scale = Math.min(cw / img.width, ch / img.height);
      const x = (cw - img.width * scale) / 2;
      const y = (ch - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    // Drop + bounce entrance animation on the canvas wrapper
    function playEntrance() {
      gsap.fromTo(
        wrapper,
        {
          y: -120,
          opacity: 0,
          scale: 0.85,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "bounce.out",
          delay: 0.15,
        }
      );
    }

    resize();
    window.addEventListener("resize", resize);

    const state = { frame: 0 };

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const frame = Math.max(
          0,
          Math.min(frameCount - 1, Math.floor(self.progress * frameCount))
        );
        if (frame !== state.frame) {
          state.frame = frame;
          drawFrame(frame);
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("resize", resize);
    };
  }, [frameCount]);

  return (
    <div ref={containerRef} className="h-[200vh]">
      <div className="sticky top-0 grid h-screen place-items-center bg-white pt-20">
        {!loaded && (
          <div className="absolute text-zinc-400 animate-pulse text-sm tracking-widest uppercase">
            Cargando…
          </div>
        )}
        {/* Wrapper is what gets the entrance animation */}
        <div
          ref={wrapperRef}
          style={{ opacity: 0 }} // starts invisible; GSAP animates it in
          className="h-full w-full flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full max-h-[900px] max-w-[900px]"
          />
        </div>
      </div>
    </div>
  );
}
