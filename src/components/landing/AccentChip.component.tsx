import { cn } from "@/src/helpers/tailwind.helper";

interface AccentChipProps {
  label: string;
  tint: "primary" | "accent";
  orbit?: boolean;
  className?: string;
  style?: React.CSSProperties; // supports CSS vars via cast at call-site
}

export function AccentChip({ label, tint, orbit = false, className, style }: AccentChipProps) {
  return (
    <div
      className={cn(
        "absolute select-none pointer-events-none rounded-xl px-3 py-2 text-xs font-semibold",
        "border-2 shadow-neumorphic-md neumorphic-optimized neumorphic-idle-motion will-change-transform",
        tint === "primary"
          ? "bg-primary-50 text-primary-800 border-primary-200/60"
          : "bg-accent-50 text-accent-800 border-accent-200/60",
        orbit ? "motion-safe:animate-chip-orbit" : "motion-safe:animate-float-slow",
        className
      )}
      style={style}
    >
      {label}
    </div>
  );
}
