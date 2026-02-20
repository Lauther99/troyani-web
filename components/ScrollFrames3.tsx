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
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const framePath = (i: number) =>
    `/frames/frame_${String(i).padStart(3, "0")}.webp`;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const container = containerRef.current!;

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadFirst = Math.min(20, frameCount);

    // Precarga primeros frames
    for (let i = 0; i < preloadFirst; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === preloadFirst) {
          setLoaded(true);
          drawFrame(0);
        }
      };
      images[i] = img;
    }

    // Carga el resto en background
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
      <div className="sticky top-0 grid h-screen place-items-center bg-black">
        {!loaded && (
          <div className="absolute text-zinc-400">Cargando animación…</div>
        )}
        <canvas
          ref={canvasRef}
          className="h-full w-full max-h-[900px] max-w-[900px]"
        />
      </div>
    </div>
  );
}