"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mensajeGenerico, whatsappUrl } from "@/lib/whatsapp";

type TankColor = "Crema" | "Blanco" | "Negro";

type Props = {
  ciudad?: string;
  initialColor?: TankColor;
  autoRotate?: boolean;
  animate?: boolean;
  particles?: boolean;
  parallax?: number;
  slideSeconds?: number;
};

type Bubble = {
  x: number;
  y: number;
  r: number;
  v: number;
  a: number;
  ph: number;
};

const COLOR_SWATCHES: { id: TankColor; label: string; hex: string }[] = [
  { id: "Crema", label: "Beige Plus+", hex: "#d9c398" },
  { id: "Negro", label: "Negro UV", hex: "#15181c" },
  { id: "Blanco", label: "Blanco Ind.", hex: "#eef1f3" },
];

export default function Hero({
  initialColor = "Crema",
  autoRotate = true,
  animate = true,
  particles = true,
  parallax = 1,
  slideSeconds = 7,
}: Props) {
  const [ctaHover, setCtaHover] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [tankColor, setTankColor] = useState<TankColor>(initialColor);

  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const applyColorRef = useRef<((c: TankColor) => void) | null>(null);
  const dragRef = useRef<{ x: number } | null>(null);
  const spinVelRef = useRef(0);

  const whatsappHref = whatsappUrl(mensajeGenerico("/"));

  useEffect(() => {
    if (applyColorRef.current) {
      applyColorRef.current(tankColor);
    }
  }, [tankColor]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const depthEls = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let spin = -0.5;
    let cw = 0;
    let ch = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    let bubbles: Bubble[] = [];
    let raf = 0;
    let disposed = false;

    const newBubble = (init: boolean): Bubble => {
      const right = Math.random() < 0.75;
      return {
        x: right ? cw * (0.45 + Math.random() * 0.55) : Math.random() * cw,
        y: init ? Math.random() * ch : ch + 10,
        r: 1.2 + Math.random() * 4,
        v: 0.15 + Math.random() * 0.45,
        a: 0.12 + Math.random() * 0.35,
        ph: Math.random() * 6.28,
      };
    };

    const setupCanvas = () => {
      const cv = canvasRef.current;
      if (!cv || !root) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = root.clientWidth;
      const h = root.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx = cv.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      cw = w;
      ch = h;
      bubbles = Array.from({ length: Math.round(Math.min(46, w / 30)) }, () => newBubble(true));
    };

    // Intro animations
    if (animate && !reduced) {
      const ease = "cubic-bezier(.16,1,.3,1)";
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((el) => {
        const i = Number(el.dataset.line || 0);
        el.animate([{ transform: "translateY(105%)" }, { transform: "none" }], {
          duration: 1100,
          delay: 250 + i * 110,
          easing: ease,
          fill: "backwards",
        });
      });
      root.querySelectorAll<HTMLElement>("[data-enter]").forEach((el) => {
        const i = Number(el.dataset.enter || 0);
        const d = i === 0 ? 100 : 650 + i * 120;
        el.animate(
          [
            { opacity: 0, transform: "translateY(18px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 900, delay: d, easing: ease, fill: "backwards" },
        );
      });
      root.querySelectorAll<HTMLElement>("[data-chip]").forEach((el) => {
        const i = Number(el.dataset.chip || 0);
        el.animate(
          [
            { opacity: 0, transform: "scale(.8)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 800,
            delay: 1300 + i * 160,
            easing: "cubic-bezier(.34,1.56,.64,1)",
            fill: "backwards",
          },
        );
      });
      const c = countRef.current;
      if (c) {
        const start = performance.now() + 1000;
        const dur = 1600;
        const tick = (now: number) => {
          if (disposed) return;
          const k = Math.min(1, Math.max(0, (now - start) / dur));
          c.textContent = Math.round(250 + (1 - Math.pow(1 - k, 4)) * 24750).toLocaleString("en-US");
          if (k < 1) requestAnimationFrame(tick);
        };
        c.textContent = "250";
        requestAnimationFrame(tick);
      }
    }

    setupCanvas();

    // 3D Scene state
    let renderer3D: import("three").WebGLRenderer | null = null;
    let scene3D: import("three").Scene | null = null;
    let cam3D: import("three").PerspectiveCamera | null = null;
    let tankGroup: import("three").Group | null = null;
    let mouseLight3D: import("three").PointLight | null = null;
    let rings3D: import("three").Mesh<import("three").RingGeometry, import("three").MeshBasicMaterial>[] = [];
    let ro: ResizeObserver | null = null;
    let intro3D = 0;

    const resize3D = () => {
      const host = stageRef.current;
      if (!renderer3D || !cam3D || !host) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer3D.setSize(w, h, false);
      cam3D.aspect = w / h;
      cam3D.updateProjectionMatrix();
    };

    const init3D = async () => {
      const T = await import("three");
      if (disposed || !stageRef.current) return;
      const host = stageRef.current;

      const renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.VSMShadowMap;
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
      host.appendChild(renderer.domElement);
      renderer3D = renderer;

      const scene = new T.Scene();
      scene3D = scene;
      const cam = new T.PerspectiveCamera(26, 1, 0.1, 50);
      cam.position.set(0, 1.0, 3.85);
      cam.lookAt(0, 0.56, 0);
      cam3D = cam;

      // Studio environment for reflections
      const pmrem = new T.PMREMGenerator(renderer);
      const env = new T.Scene();
      const room = new T.Mesh(
        new T.BoxGeometry(12, 8, 12),
        new T.MeshBasicMaterial({ color: 0x9aa3ab, side: T.BackSide }),
      );
      env.add(room);
      const panel = (
        w: number,
        h: number,
        x: number,
        y: number,
        z: number,
        c: number,
        ry = 0,
        rx = 0,
      ) => {
        const m = new T.Mesh(
          new T.PlaneGeometry(w, h),
          new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }),
        );
        m.position.set(x, y, z);
        m.rotation.set(rx, ry, 0);
        env.add(m);
      };
      panel(6, 1.4, 0, 3.9, 0, 0xffffff, 0, Math.PI / 2);
      panel(1.2, 5, -5.8, 1, 1, 0xffffff, Math.PI / 2);
      panel(1.6, 5, 5.8, 1, -1, 0xcfe3ff, -Math.PI / 2);
      panel(4, 2, 0, 1, 5.9, 0xf2f4f6, Math.PI);
      scene.environment = pmrem.fromScene(env, 0.04).texture;

      scene.add(new T.HemisphereLight(0xffffff, 0xb9c4cc, 0.6));
      const key = new T.DirectionalLight(0xffffff, 2.2);
      key.position.set(0.6, 5, 1.2);
      key.castShadow = true;
      key.shadow.camera.left = -3;
      key.shadow.camera.right = 3;
      key.shadow.camera.top = 3;
      key.shadow.camera.bottom = -3;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.radius = 14;
      key.shadow.blurSamples = 20;
      key.shadow.bias = -0.0006;
      scene.add(key);

      const rim = new T.DirectionalLight(0x7fb6ff, 2.4);
      rim.position.set(-3, 2, -2.5);
      scene.add(rim);

      const mLight = new T.PointLight(0xffffff, 6, 8, 2);
      mLight.position.set(0, 1.6, 2.5);
      scene.add(mLight);
      mouseLight3D = mLight;

      // Ground shadow plane
      const ac = document.createElement("canvas");
      ac.width = ac.height = 256;
      const ag = ac.getContext("2d");
      if (ag) {
        const agr = ag.createRadialGradient(128, 128, 0, 128, 128, 128);
        agr.addColorStop(0, "#fff");
        agr.addColorStop(0.55, "#fff");
        agr.addColorStop(1, "#000");
        ag.fillStyle = agr;
        ag.fillRect(0, 0, 256, 256);
      }
      const shadowMat = new T.ShadowMaterial({ opacity: 0.22, transparent: true });
      (shadowMat as unknown as { alphaMap: import("three").Texture }).alphaMap =
        new T.CanvasTexture(ac);
      const ground = new T.Mesh(new T.PlaneGeometry(2.4, 2.4), shadowMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Floor glow + water rings
      const gc = document.createElement("canvas");
      gc.width = gc.height = 256;
      const g = gc.getContext("2d");
      if (g) {
        const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(0, "rgba(23,105,194,0.55)");
        grd.addColorStop(1, "rgba(23,105,194,0)");
        g.fillStyle = grd;
        g.fillRect(0, 0, 256, 256);
      }
      const glowTex = new T.CanvasTexture(gc);
      glowTex.colorSpace = T.SRGBColorSpace;
      const glow = new T.Mesh(
        new T.PlaneGeometry(1.9, 1.9),
        new T.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false }),
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.002;
      scene.add(glow);

      rings3D = [0, 1, 2].map((i) => {
        const r = new T.Mesh(
          new T.RingGeometry(0.98, 1, 96),
          new T.MeshBasicMaterial({
            color: 0x1769c2,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          }),
        );
        r.rotation.x = -Math.PI / 2;
        r.position.y = 0.003 + i * 0.0005;
        scene.add(r);
        return r;
      });

      // Build Rotoplas Tank 3D mesh
      const V = (x: number, y: number) => new T.Vector2(x, y);
      const R = 0.55;
      const H = 0.9;
      const pts = [V(0, 0), V(0.47, 0)];
      for (let i = 0; i <= 8; i++) {
        const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
        pts.push(V(0.5 + 0.05 * Math.cos(a), 0.05 + 0.05 * Math.sin(a)));
      }
      const grooves = [0.14, 0.27, 0.4, 0.53, 0.66, 0.79];
      for (let y = 0.056; y <= H; y += 0.004) {
        let r = R;
        for (const gy of grooves) r -= 0.009 * Math.exp(-Math.pow((y - gy) / 0.011, 2));
        pts.push(V(r, y));
      }
      for (let i = 1; i <= 14; i++) {
        const a = (i / 14) * (Math.PI / 2);
        pts.push(V(0.43 + 0.12 * Math.cos(a), H + 0.11 * Math.sin(a)));
      }
      for (let i = 1; i <= 10; i++) {
        const t = i / 10;
        pts.push(V(0.43 - 0.11 * t, H + 0.11 + 0.055 * Math.sin((t * Math.PI) / 2)));
      }
      pts.push(V(0.3, 1.075), V(0, 1.075));

      const matBody = new T.MeshPhysicalMaterial({
        name: "polietileno",
        color: 0xd9c398,
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.35,
        clearcoatRoughness: 0.35,
      });
      const matDetail = new T.MeshPhysicalMaterial({
        name: "polietileno_detalle",
        color: 0xc9b285,
        roughness: 0.5,
        clearcoat: 0.2,
      });

      const group = new T.Group();
      group.name = "tanque";
      const body = new T.Mesh(new T.LatheGeometry(pts, 96), matBody);
      body.name = "cuerpo";
      body.castShadow = true;
      group.add(body);

      const lp = [V(0, 1.175)];
      for (let i = 1; i <= 16; i++) {
        const t = i / 16;
        lp.push(V(0.3 * t, 1.175 - 0.045 * t * t));
      }
      lp.push(V(0.325, 1.12), V(0.335, 1.1), V(0.335, 1.06), V(0.31, 1.055), V(0.29, 1.07));
      const lid = new T.Mesh(new T.LatheGeometry(lp, 96), matBody);
      lid.name = "tapa";
      lid.castShadow = true;
      group.add(lid);

      const ribGeo = new T.BoxGeometry(0.014, 0.045, 0.018);
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const rib = new T.Mesh(ribGeo, matDetail);
        rib.position.set(Math.cos(a) * 0.338, 1.082, Math.sin(a) * 0.338);
        rib.rotation.y = -a;
        rib.name = "tapa_nervio";
        group.add(rib);
      }

      const ventA = Math.PI * 0.22;
      const vent = new T.Group();
      vent.name = "respiradero";
      const vb = new T.Mesh(new T.CylinderGeometry(0.055, 0.062, 0.08, 40), matDetail);
      vb.position.y = 0.04;
      vb.castShadow = true;
      const vc = new T.Mesh(new T.CylinderGeometry(0.072, 0.072, 0.03, 40), matBody);
      vc.position.y = 0.095;
      vc.castShadow = true;
      const vt = new T.Mesh(
        new T.SphereGeometry(0.072, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        matBody,
      );
      vt.position.y = 0.11;
      vt.scale.y = 0.35;
      vent.add(vb, vc, vt);
      vent.position.set(Math.cos(ventA) * 0.4, 1.02, Math.sin(ventA) * 0.4);
      group.add(vent);

      const fit = new T.Group();
      fit.name = "salida";
      const pipe = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.09, 32), matDetail);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.x = 0.04;
      const nut = new T.Mesh(new T.CylinderGeometry(0.048, 0.048, 0.025, 6), matDetail);
      nut.rotation.z = Math.PI / 2;
      nut.position.x = 0.0;
      fit.add(pipe, nut);
      fit.rotation.y = -Math.PI * 0.12;
      const fa = Math.PI * 0.12;
      fit.position.set(Math.cos(fa) * 0.545, 0.1, Math.sin(fa) * 0.545);
      group.add(fit);

      const logoTex = new T.TextureLoader().load("/hero/logo-rotoplas-white.png");
      logoTex.colorSpace = T.SRGBColorSpace;
      logoTex.anisotropy = 8;
      const lh = 0.15;
      const lw = lh * (375 / 135);
      const th = lw / 0.553;
      const matLogo = new T.MeshStandardMaterial({
        name: "logo",
        map: logoTex,
        transparent: true,
        alphaTest: 0.25,
        roughness: 0.55,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        side: T.FrontSide,
      });
      const logo = new T.Mesh(
        new T.CylinderGeometry(0.5535, 0.5535, lh, 64, 1, true, -th / 2, th),
        matLogo,
      );
      logo.position.y = 0.465;
      logo.name = "logo";
      group.add(logo);

      applyColorRef.current = (c: TankColor) => {
        const pal: Record<TankColor, [number, number, number, number]> = {
          Crema: [0xd9c398, 0xc9b285, 0.5, 0x1a1a1a],
          Blanco: [0xeef1f3, 0xe2e6ea, 0.5, 0x1a1a1a],
          Negro: [0x15181c, 0x1d2126, 0.42, 0xf2f2f2],
        };
        const p = pal[c] ?? pal.Crema;
        matBody.color.set(p[0]);
        matDetail.color.set(p[1]);
        matBody.roughness = p[2];
        matLogo.color.set(p[3]);
      };

      applyColorRef.current(tankColor);
      tankGroup = group;
      scene.add(group);

      resize3D();
      ro = new ResizeObserver(() => resize3D());
      ro.observe(host);
      intro3D = performance.now();
    };

    init3D().catch((err) => {
      console.warn("3D no disponible", err);
      setFallback(true);
    });

    const t0 = performance.now();
    let last = t0;

    const loop = (now: number) => {
      if (disposed) return;
      const t = now - t0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const motion = animate && !reduced;
      const k = parallax;

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      for (const el of depthEls) {
        const d = Number(el.dataset.depth || 0) * k;
        const f =
          motion && el.dataset.float ? Math.sin(t / 1400 + d) * Number(el.dataset.float) : 0;
        el.style.transform = `translate3d(${(mouse.x * d).toFixed(2)}px,${(
          mouse.y * d +
          f
        ).toFixed(2)}px,0)`;
      }

      if (tankGroup && renderer3D && scene3D && cam3D) {
        if (!dragRef.current) {
          const isMobile = window.innerWidth < 768;
          if (motion && isMobile) {
            spin += dt * 0.35;
          }
          spin += spinVelRef.current;
          spinVelRef.current *= 0.94;
        }
        const ip = intro3D ? Math.min(1, (now - intro3D) / 1600) : 1;
        const e = motion ? 1 - Math.pow(1 - ip, 4) : 1;

        tankGroup.rotation.y += (spin + mouse.x * 0.7 * k - tankGroup.rotation.y) * 0.12;
        tankGroup.rotation.x += (mouse.y * 0.14 * k - tankGroup.rotation.x) * 0.08;
        tankGroup.rotation.z += (-mouse.x * 0.05 * k - tankGroup.rotation.z) * 0.08;
        tankGroup.position.x += (mouse.x * 0.06 * k - tankGroup.position.x) * 0.08;
        tankGroup.position.y =
          (motion ? Math.sin(t / 1400) * 0.015 + 0.015 : 0) - (1 - e) * 0.35;
        tankGroup.scale.setScalar(0.85 + 0.15 * e);

        if (mouseLight3D) {
          mouseLight3D.position.set(mouse.x * 2.6, 1.4 - mouse.y * 1.2, 2.4);
        }

        rings3D.forEach((r, i) => {
          const p = motion ? (t / 4200 + i / 3) % 1 : i / 3;
          r.scale.setScalar(0.45 + p * 0.45);
          r.material.opacity = (1 - p) * Math.min(1, p * 4) * 0.55 * e;
        });

        renderer3D.render(scene3D, cam3D);
      }

      if (ctx) {
        ctx.clearRect(0, 0, cw, ch);
        if (particles) {
          for (let i = 0; i < bubbles.length; i++) {
            const b = bubbles[i];
            if (motion) {
              b.y -= b.v;
              b.x += Math.sin(t / 900 + b.ph) * 0.15;
            }
            if (b.y < -10) bubbles[i] = newBubble(false);
            const fade = Math.min(1, b.y / (ch * 0.35));
            ctx.beginPath();
            ctx.arc(b.x + mouse.x * b.r * 1.5, b.y + mouse.y * b.r * 1.5, b.r, 0, 6.283);
            ctx.fillStyle = `rgba(255,255,255,${0.7 * b.a * fade})`;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(23,105,194,${b.a * fade})`;
            ctx.stroke();
          }
        }
      }

      if (progressRef.current) {
        const dur = slideSeconds * 1000;
        progressRef.current.style.width = `${(((t % dur) / dur) * 100).toFixed(2)}%`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const onResize = () => {
      setupCanvas();
      resize3D();
    };

    const onWinMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.x;
        dragRef.current.x = e.clientX;
        spinVelRef.current = dx * 0.006;
        spin += dx * 0.01;
      }
    };

    const onWinUp = () => {
      if (dragRef.current && stageRef.current) {
        stageRef.current.style.cursor = "grab";
      }
      dragRef.current = null;
    };

    const onMouseLeaveDoc = () => {
      mouse.tx = 0;
      mouse.ty = 0;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onWinMove);
    window.addEventListener("pointerup", onWinUp);
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onWinMove);
      window.removeEventListener("pointerup", onWinUp);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      if (ro) ro.disconnect();
      if (renderer3D) {
        renderer3D.dispose();
        renderer3D.domElement.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero-home"
      data-screen-label="Hero Rotoplas 3D"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "rgb(244,246,247)",
        color: "#0e1f2e",
        isolation: "isolate",
      }}
    >
      {/* Fondo técnico + glows + canvas de burbujas */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(14,31,46,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(14,31,46,.055) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 30% 40%,#000 0%,transparent 75%)",
            maskImage: "radial-gradient(ellipse 70% 80% at 30% 40%,#000 0%,transparent 75%)",
          }}
        />
        <div
          data-depth="-10"
          style={{
            position: "absolute",
            right: "-18%",
            top: "-40%",
            width: "75%",
            height: "150%",
            background: "radial-gradient(closest-side,rgba(23,105,194,.16),rgba(23,105,194,0))",
          }}
        />
        <div
          data-depth="-6"
          style={{
            position: "absolute",
            left: "-12%",
            bottom: "-55%",
            width: "55%",
            height: "110%",
            background: "radial-gradient(closest-side,rgba(23,105,194,.08),rgba(23,105,194,0))",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>

      {/* Contenedor principal */}
      <div
        style={{
          position: "relative",
          maxWidth: 1360,
          margin: "0 auto",
          padding: "clamp(88px,8vw,112px) clamp(20px,5vw,72px) clamp(32px,5vw,72px)",
          display: "flex",
          flexWrap: "wrap-reverse",
          alignItems: "center",
          gap: "clamp(8px,3vw,56px)",
          minHeight: "clamp(520px,72vh,700px)",
        }}
      >
        {/* Columna izquierda: copy + CTAs + métricas */}
        <div
          style={{
            flex: "1 1 420px",
            maxWidth: 600,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(18px,2.2vw,26px)",
          }}
        >
          <div
            data-enter="0"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-display), monospace",
              fontSize: 12,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#3d5a73",
            }}
          >
            <span style={{ width: 28, height: 2, background: "#1769c2", flex: "none" }} />
            <span className="mt-4" style={{ textWrap: "pretty" }} >
              Distribuidor autorizado Rotoplas · Troyani Inversiones
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "clamp(40px,5.4vw,76px)",
              lineHeight: 1,
              letterSpacing: "-.035em",
              color: "#0e1f2e",
            }}
          >
            <span style={{ display: "block", overflow: "hidden", paddingBottom: ".08em" }}>
              <span data-line="0" style={{ display: "block" }}>
                Agua segura,
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: ".08em" }}>
              <span data-line="1" style={{ display: "block" }}>
                a escala
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: ".08em" }}>
              <span data-line="2" style={{ display: "block", color: "#1769c2" }}>
                industrial.
              </span>
            </span>
          </h1>

          <p
            data-enter="1"
            style={{
              margin: 0,
              fontSize: "clamp(15px,1.25vw,18px)",
              lineHeight: 1.6,
              color: "#45596b",
              maxWidth: 500,
              textWrap: "pretty",
            }}
          >
            Tanques, cisternas y soluciones agroindustriales de 250 a 25,000 litros, con garantía Rotoplas y despacho a todo el Perú.
          </p>

          <div
            data-enter="2"
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4 }}
          >
            <Link
              href="/catalogo/"
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                position: "relative",
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                height: 56,
                padding: "0 8px 0 26px",
                borderRadius: 999,
                background: "#0e1f2e",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 15,
                boxShadow: ctaHover
                  ? "0 18px 36px -14px rgba(23,105,194,.65)"
                  : "0 10px 24px -14px rgba(14,31,46,.5)",
                transform: ctaHover ? "translateY(-2px)" : "none",
                transition: "transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "60%",
                  background:
                    "linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.18),rgba(255,255,255,0))",
                  transform: ctaHover ? "translateX(220%)" : "translateX(-120%)",
                  transition: "transform .8s cubic-bezier(.2,.8,.2,1)",
                  pointerEvents: "none",
                }}
              />
              <span style={{ position: "relative" }}>Ver soluciones</span>
              <span
                style={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "#1769c2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    transform: ctaHover ? "translateX(3px)" : "none",
                    transition: "transform .45s cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8h11M9 3.5 13.5 8 9 12.5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2.5 rounded-full border-[1.5px] border-[#0e1f2e]/18 bg-white/60 px-6 text-[15px] font-medium text-[#0e1f2e] transition-colors duration-300 hover:border-[#0e1f2e] hover:bg-white"
            >
              Cotizar por WhatsApp
            </a>
          </div>

          <div
            data-enter="3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(16px,2.4vw,32px)",
              paddingTop: "clamp(16px,2vw,24px)",
              marginTop: 4,
              borderTop: "1px solid rgba(14,31,46,.1)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "clamp(18px,1.6vw,22px)",
                  letterSpacing: "-.02em",
                }}
              >
                250 – <span ref={countRef}>25,000</span> L
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#5b7083",
                }}
              >
                Capacidades
              </span>
            </div>

            <div style={{ width: 1, background: "rgba(14,31,46,.1)" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "clamp(18px,1.6vw,22px)",
                  letterSpacing: "-.02em",
                }}
              >
                Todo el Perú
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#5b7083",
                }}
              >
                Despacho
              </span>
            </div>

            <div style={{ width: 1, background: "rgba(14,31,46,.1)" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "clamp(18px,1.6vw,22px)",
                  letterSpacing: "-.02em",
                }}
              >
                Garantía
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#5b7083",
                }}
              >
                Oficial Rotoplas
              </span>
            </div>
          </div>
        </div>

        {/* Columna derecha: Escenario 3D interactivo */}
        <div
          style={{
            flex: "1 1 460px",
            minWidth: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            data-enter-product="1"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "min(620px,66vh)",
              aspectRatio: "1/1",
            }}
          >
            <div
              ref={stageRef}
              onPointerDown={(e) => {
                dragRef.current = { x: e.clientX };
                spinVelRef.current = 0;
                e.currentTarget.style.cursor = "grabbing";
              }}
              style={{
                position: "absolute",
                inset: 0,
                cursor: "grab",
                touchAction: "pan-y",
              }}
            />

            {fallback && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/hero/tanques-hero.png"
                alt="Tanques Rotoplas"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "15%",
                  width: "100%",
                  mixBlendMode: "multiply",
                }}
              />
            )}

            <div
              data-chip="0"
              className="hidden md:block"
              style={{ position: "absolute", left: "-4%", top: "12%", pointerEvents: "none" }}
            >
              <div
                data-depth="16"
                data-float="5"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px 10px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.88)",
                  backdropFilter: "blur(8px)",
                  boxShadow:
                    "0 10px 30px -10px rgba(14,31,46,.25),0 0 0 1px rgba(14,31,46,.06)",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: "#1769c2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2 5 8.5l4.5-5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Protección UV
              </div>
            </div>

            <div
              data-chip="1"
              className="hidden md:block"
              style={{ position: "absolute", right: "-4%", top: "44%", pointerEvents: "none" }}
            >
              <div
                data-depth="22"
                data-float="6"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px 10px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.88)",
                  backdropFilter: "blur(8px)",
                  boxShadow:
                    "0 10px 30px -10px rgba(14,31,46,.25),0 0 0 1px rgba(14,31,46,.06)",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: "#1769c2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2 5 8.5l4.5-5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Capa antibacterial
              </div>
            </div>

            <div
              data-chip="2"
              className="hidden md:block"
              style={{ position: "absolute", left: "-2%", bottom: "16%", pointerEvents: "none" }}
            >
              <div
                data-depth="12"
                data-float="4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px 10px 10px",
                  borderRadius: 999,
                  background: "#0e1f2e",
                  color: "#ffffff",
                  boxShadow: "0 12px 30px -10px rgba(14,31,46,.45)",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display), monospace",
                    fontSize: 11,
                    letterSpacing: ".08em",
                    color: "#8fc0f0",
                  }}
                >
                  HASTA
                </span>
                25,000 litros
              </div>
            </div>

            {/* Selector de color del tanque 3D + indicador "Arrastra para girar" (oculto en mobile) */}
            <div
              data-enter="4"
              className="hidden md:flex"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "2%",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "0 8px",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.85)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px -4px rgba(14,31,46,.15)",
                  pointerEvents: "auto",
                }}
              >
                {COLOR_SWATCHES.map((s) => {
                  const active = tankColor === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTankColor(s.id)}
                      aria-pressed={active}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        background: active ? "#0e1f2e" : "transparent",
                        color: active ? "#ffffff" : "#3d5a73",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: s.hex,
                          border: "1px solid rgba(14,31,46,.25)",
                        }}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#5b7083",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    border: "1.5px solid #5b7083",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "#1769c2",
                    }}
                  />
                </span>
                Arrastra para girar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso inferior */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "rgba(14,31,46,.06)",
          zIndex: 2,
        }}
      >
        <div
          ref={progressRef}
          style={{ height: "100%", width: 0, background: "#1769c2" }}
        />
      </div>
    </section>
  );
}
