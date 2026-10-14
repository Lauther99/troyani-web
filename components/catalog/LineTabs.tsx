"use client";

import { useEffect, useRef } from "react";
import type { Linea } from "@/lib/schemas";

type LineTabKey = "all" | Linea;

type Props = {
  activeLinea: Linea | null;
  counts: {
    all: number;
    hogar: number;
    agroindustria: number;
  };
  onChange: (linea: Linea | null) => void;
};

const TABS: {
  key: LineTabKey;
  label: string;
  desc: string;
}[] = [
  {
    key: "all",
    label: "Todo el catálogo",
    desc: "Hogar y agroindustria",
  },
  {
    key: "hogar",
    label: "Línea Hogar",
    desc: "Tanques, cisternas y biodigestores para vivienda",
  },
  {
    key: "agroindustria",
    label: "Línea Agroindustria",
    desc: "Tanques industriales, tolvas y químicos",
  },
];

export default function LineTabs({ activeLinea, counts, onChange }: Props) {
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const indRef = useRef<HTMLDivElement | null>(null);

  const activeKey: LineTabKey = activeLinea ?? "all";

  const updateIndicator = () => {
    const wrap = tabsRef.current;
    const ind = indRef.current;
    if (!wrap || !ind) return;
    if (wrap.offsetParent === null) return;

    const btn = wrap.querySelector<HTMLButtonElement>(`[data-tab="${activeKey}"]`);
    if (!btn) return;

    ind.style.left = `${btn.offsetLeft}px`;
    ind.style.top = `${btn.offsetTop}px`;
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.height = `${btn.offsetHeight}px`;
  };

  useEffect(() => {
    updateIndicator();
    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeKey]);

  return (
    <div
      ref={tabsRef}
      className="relative hidden sm:grid grid-cols-3 gap-1.5 rounded-[22px] bg-[#e6ebef] p-1.5"
    >
      {/* Sliding background pill indicator */}
      <div
        ref={indRef}
        aria-hidden="true"
        className="pointer-events-none absolute rounded-[17px] bg-[#0e1f2e] shadow-[0_14px_30px_-14px_rgba(14,31,46,0.6)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      />

      {TABS.map((tab) => {
        const isActive = activeKey === tab.key;
        const count = counts[tab.key];

        return (
          <button
            key={tab.key}
            type="button"
            data-tab={tab.key}
            onClick={() => onChange(tab.key === "all" ? null : tab.key)}
            className="group relative flex min-h-[72px] cursor-pointer items-center justify-between gap-3 rounded-[17px] bg-transparent px-4 py-3 text-left transition-colors md:px-5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span
                style={{ color: isActive ? "#ffffff" : "#0e1f2e" }}
                className="font-sans text-[clamp(15px,1.4vw,18px)] font-semibold leading-tight tracking-[-0.02em] transition-colors"
              >
                {tab.label}
              </span>
              <span
                style={{ color: isActive ? "#a9bccd" : "#5b7083" }}
                className="line-clamp-1 text-xs leading-normal transition-colors"
              >
                {tab.desc}
              </span>
            </div>

            <span
              style={{
                background: isActive ? "#1769c2" : "#ffffff",
                color: isActive ? "#ffffff" : "#3d5a73",
              }}
              className="flex h-[34px] min-w-[34px] shrink-0 items-center justify-center rounded-full px-2.5 font-display text-xs font-semibold tabular-nums transition-colors"
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
