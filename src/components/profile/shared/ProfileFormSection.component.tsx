"use client";

import { Card } from "@/src/components/ui/card";
// IconBadge - removing unused import
import { cn } from "@/src/helpers/tailwind.helper";

interface ProfileFormSectionProps {
  title: string;
  icon: React.ComponentType<{
    className?: string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  }>;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "inset";
  overlay?: "primary" | "accent";
}

export function ProfileFormSection({
  title,
  icon: Icon,
  children,
  className,
  variant = "default",
  overlay = "primary",
}: ProfileFormSectionProps) {
  return (
    <Card variant={variant} size='default' overlay={overlay} className={cn("space-y-4", className)}>
      <div className='flex items-center gap-3 mb-6'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.1)]'>
          <Icon className='h-5 w-5' weight='bold' />
        </div>
        <h3 className='text-lg font-bold text-primary-900'>{title}</h3>
      </div>
      {children}
    </Card>
  );
}
