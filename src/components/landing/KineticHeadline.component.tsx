"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";

interface KineticHeadlineProps {
  lines: string[];
  className?: string;
}

export function KineticHeadline({ lines, className }: KineticHeadlineProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const split = useMemo(() => lines.map((l) => l.split(" ")), [lines]);

  return (
    <div className={className}>
      {split.map((words, i) => (
        <AnimatedReveal key={i} delayMs={i * 80}>
          <div className='flex flex-wrap justify-center gap-2'>
            {words.map((w, idx) => (
              <span
                key={idx}
                className='inline-block text-primary-900 will-change-transform'
                style={{
                  transition: "transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 700ms",
                  transform: mounted ? "none" : "translateY(12px) scale(0.98)",
                  opacity: mounted ? 1 : 0,
                  transitionDelay: `${idx * 40}ms`,
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </AnimatedReveal>
      ))}
    </div>
  );
}
