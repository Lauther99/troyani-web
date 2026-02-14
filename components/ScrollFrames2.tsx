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
  const [loadProgress, setLoadProgress] = useState(0);

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
        setLoadProgress(Math.floor((loadedCount / preloadFirst) * 100));
        if (loadedCount === preloadFirst) {
          setTimeout(() => {
            setLoaded(true);
            drawFrame(0);
          }, 300);
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
      if (loaded) {
        drawFrame(Math.floor((ScrollTrigger.getById("frameScroll")?.progress || 0) * frameCount));
      }
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
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };
    
    window.addEventListener("resize", handleResize);

    const state = { frame: 0 };

    ScrollTrigger.create({
      id: "frameScroll",
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
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
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [frameCount, loaded]);

  return (
    <div ref={containerRef} className="h-[200vh]">
      <div className="sticky top-0 grid h-screen place-items-center bg-white">
        {!loaded && (
          <div className="absolute z-10 flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-600">
              Cargando animación... {loadProgress}%
            </p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`h-full w-full max-h-[900px] max-w-[900px] transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
