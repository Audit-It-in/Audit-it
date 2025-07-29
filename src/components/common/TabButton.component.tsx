import { cn } from "@/src/helpers/tailwind.helper";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabButton = ({ isActive, onClick, children, className, disabled = false }: TabButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      isActive ? "text-white relative z-10" : "text-neutral-600 hover:text-neutral-800",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);
