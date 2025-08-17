"use client";

import { cn } from "@/src/helpers/tailwind.helper";

interface OrbitRingProps {
  size?: number;
  items: Array<{ id: string; label: string }>;
  className?: string;
  speedMs?: number;
}

export function OrbitRing({ size = 260, items, className, speedMs = 14000 }: OrbitRingProps) {
  const radius = size / 2;

  return (
    <div className={cn("relative select-none", className)} style={{ width: size, height: size }} aria-hidden>
      <div
        className='absolute inset-0 rounded-full border-2 border-primary-100/60 shadow-neumorphic-md'
        style={{ animation: `spin-slow ${speedMs}ms linear infinite` }}
      />
      {items.map((item, idx) => {
        const angle = (idx / items.length) * Math.PI * 2;
        const x = radius + Math.cos(angle) * (radius - 24) - 44;
        const y = radius + Math.sin(angle) * (radius - 24) - 16;
        return (
          <div
            key={item.id}
            className='absolute px-3 py-1 rounded-xl bg-white border-2 border-primary-100/60 shadow-neumorphic-md text-primary-700 text-xs'
            style={{ left: x, top: y }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
