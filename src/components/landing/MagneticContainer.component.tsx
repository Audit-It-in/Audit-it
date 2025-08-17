"use client";

import { useRef } from "react";
import { cn } from "@/src/helpers/tailwind.helper";

interface MagneticContainerProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // px max translation
}

export function MagneticContainer({ children, className, strength = 10 }: MagneticContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * strength;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * strength;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("transition-transform duration-200 will-change-transform", className)}
    >
      {children}
    </div>
  );
}
