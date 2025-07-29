"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CheckCircleIcon, SparkleIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";
import { UserRole } from "@/src/types/auth.type";

interface RoleOptionCardProps {
  role: UserRole;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

export const RoleOptionCard = ({
  role,
  title,
  description,
  benefits,
  icon,
  isSelected,
  onSelect,
}: RoleOptionCardProps) => {
  const isCA = role === UserRole.ACCOUNTANT;

  return (
    <Card
      className={cn(
        "group relative cursor-pointer transition-all duration-500 ease-out overflow-hidden h-full",
        "border-2 hover:scale-[1.02] active:scale-[0.99]",
        isSelected
          ? cn(
              "shadow-[inset_4px_4px_12px_rgba(0,0,0,0.15),inset_-4px_-4px_12px_rgba(255,255,255,0.9)]",
              isCA
                ? "border-primary-400/80 bg-gradient-to-br from-primary-50/80 via-primary-100/40 to-primary-200/60"
                : "border-accent-400/80 bg-gradient-to-br from-accent-50/80 via-accent-100/40 to-accent-200/60"
            )
          : cn(
              "shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_20px_rgba(0,0,0,0.15),-8px_-8px_20px_rgba(255,255,255,0.95)]",
              isCA
                ? "border-neutral-200 bg-gradient-to-br from-neutral-50 to-primary-50/30 hover:border-primary-300/50"
                : "border-neutral-200 bg-gradient-to-br from-neutral-50 to-accent-50/30 hover:border-accent-300/50"
            )
      )}
      onClick={() => onSelect(role)}
    >
      {/* Background gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          isSelected && "opacity-100",
          isCA
            ? "bg-gradient-to-br from-primary-100/20 via-transparent to-primary-200/30"
            : "bg-gradient-to-br from-accent-100/20 via-transparent to-accent-200/30"
        )}
      />

      {/* Selection indicator */}
      {isSelected && (
        <div className='absolute -top-2 -right-2 z-20'>
          <div className={cn("relative rounded-full p-1.5 shadow-lg", isCA ? "bg-primary-600" : "bg-accent-600")}>
            <CheckCircleIcon className='h-5 w-5 text-white' weight='bold' />
            <div className='absolute inset-0 rounded-full animate-ping bg-current opacity-20'></div>
          </div>
        </div>
      )}

      {/* Sparkle decoration for selected state */}
      {isSelected && (
        <div className='absolute top-3 left-3 z-10'>
          <SparkleIcon className={cn("h-3 w-3 animate-pulse", isCA ? "text-primary-500" : "text-accent-500")} weight='bold' />
        </div>
      )}

      <CardHeader className='pb-4 pt-6 px-6 relative z-10'>
        <CardTitle className='flex items-center gap-4'>
          <div
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 shadow-lg flex-shrink-0",
              isSelected
                ? cn(
                    "shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]",
                    isCA
                      ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                      : "bg-gradient-to-br from-accent-600 to-accent-700 text-white"
                  )
                : cn(
                    "shadow-[3px_3px_8px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.9)] group-hover:shadow-[4px_4px_12px_rgba(0,0,0,0.15),-4px_-4px_12px_rgba(255,255,255,0.95)]",
                    isCA
                      ? "bg-gradient-to-br from-primary-100/60 to-primary-200/40 text-primary-700 group-hover:from-primary-200/80 group-hover:to-primary-300/60"
                      : "bg-gradient-to-br from-accent-100/60 to-accent-200/40 text-accent-700 group-hover:from-accent-200/80 group-hover:to-accent-300/60"
                  )
            )}
          >
            <div className='text-2xl transform transition-transform duration-300 group-hover:scale-110'>{icon}</div>

            {/* Glow effect when selected */}
            {isSelected && (
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl blur-lg opacity-30",
                  isCA ? "bg-primary-600" : "bg-accent-600"
                )}
              ></div>
            )}
          </div>

          <div className='flex-1 space-y-1 min-w-0'>
            <h3
              className={cn(
                "text-xl font-bold transition-all duration-300",
                isSelected
                  ? isCA
                    ? "text-primary-700"
                    : "text-accent-700"
                  : "text-neutral-800 group-hover:text-primary-700"
              )}
            >
              {title}
            </h3>
            <p className='text-sm text-neutral-600 font-medium'>{description}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className='pt-0 pb-6 px-6 relative z-10 flex-1'>
        <div
          className={cn(
            "rounded-xl p-4 transition-all duration-300 border h-full",
            isSelected
              ? cn(
                  "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
                  isCA ? "bg-primary-50/60 border-primary-200/80" : "bg-accent-50/60 border-accent-200/80"
                )
              : cn(
                  "shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]",
                  isCA
                    ? "bg-primary-50/30 border-primary-200/50 group-hover:bg-primary-100/40 group-hover:border-primary-300/60"
                    : "bg-accent-50/30 border-accent-200/50 group-hover:bg-accent-100/40 group-hover:border-accent-300/60"
                )
          )}
        >
          <ul className='space-y-3'>
            {benefits.map((benefit) => (
              <li key={benefit} className='flex items-start gap-3 text-sm'>
                <div
                  className={cn(
                    "mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 transition-all duration-300 shadow-sm",
                    isSelected
                      ? isCA
                        ? "bg-primary-600 shadow-primary-600/50"
                        : "bg-accent-600 shadow-accent-600/50"
                      : isCA
                      ? "bg-primary-400 group-hover:bg-primary-600"
                      : "bg-accent-400 group-hover:bg-accent-600"
                  )}
                ></div>
                <span
                  className={cn(
                    "leading-relaxed transition-colors duration-300",
                    isSelected ? "text-neutral-800 font-medium" : "text-neutral-600 group-hover:text-neutral-800"
                  )}
                >
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced selection indicator at bottom */}
        <div
          className={cn(
            "mt-4 h-1 rounded-full transition-all duration-500 relative overflow-hidden",
            isSelected
              ? cn(
                  "shadow-sm",
                  isCA
                    ? "bg-gradient-to-r from-primary-400/80 via-primary-600 to-primary-400/80"
                    : "bg-gradient-to-r from-accent-400/80 via-accent-600 to-accent-400/80"
                )
              : "bg-transparent"
          )}
        >
          {isSelected && (
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse'></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
