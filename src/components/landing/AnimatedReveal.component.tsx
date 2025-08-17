"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/src/helpers/tailwind.helper";

interface AnimatedRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function AnimatedReveal({ children, className, delayMs = 0 }: AnimatedRevealProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setMounted(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [inView, delayMs]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}
