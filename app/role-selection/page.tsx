"use client";

import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { UserIcon, BriefcaseIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { UserRole } from "@/src/types/auth.type";
import { RoleSelectionHeader } from "@/src/components/role-selection/RoleSelectionHeader.component";
import { RoleOptionCard } from "@/src/components/role-selection/RoleOptionCard.component";
import { cn } from "@/src/helpers/tailwind.helper";
import { Loader, InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";

const roleOptions = [
  {
    role: UserRole.ACCOUNTANT,
    title: "I am a CA",
    description: "Chartered Accountant looking for clients",
    icon: <BriefcaseIcon className='h-8 w-8' weight='bold' />,
    benefits: [
      "Create your professional profile with expertise showcase",
      "Display certifications and build credibility with clients",
      "Receive qualified contact requests from potential clients",
      "Manage your service offerings, pricing, and availability",
    ],
  },
  {
    role: UserRole.CUSTOMER,
    title: "I need CA services",
    description: "Looking for a Chartered Accountant",
    icon: <UserIcon className='h-8 w-8' weight='bold' />,
    benefits: [
      "Browse verified CA profiles with detailed expertise",
      "Filter CAs by location, specialization, and ratings",
      "Send direct contact requests with your requirements",
      "Compare services, expertise, and client reviews",
    ],
  },
];

export default function RoleSelectionPage() {
  const { user, updateProfile, authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    try {
      await updateProfile({ role: selectedRole });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Loader
        action={LoadingAction.LOADING}
        title='Setting up your experience'
        subtitle='This will just take a moment...'
      />
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  const selectedOption = roleOptions.find((option) => option.role === selectedRole);

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-primary-200/40 to-accent-200/40 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-accent-200/40 to-primary-200/40 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10'>
        <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <RoleSelectionHeader />

            {/* Side by side grid layout */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10'>
              {roleOptions.map((option, index) => (
                <div
                  key={option.role}
                  className={cn("transform transition-all duration-500", "animate-in slide-in-from-bottom-4 fade-in")}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RoleOptionCard {...option} isSelected={selectedRole === option.role} onSelect={setSelectedRole} />
                </div>
              ))}
            </div>

            <div className='flex justify-center'>
              <div className='w-full max-w-sm'>
                <Button
                  onClick={handleRoleSelection}
                  disabled={!selectedRole || isSubmitting}
                  className={cn(
                    "group relative overflow-hidden w-full",
                    "text-white font-bold text-lg",
                    "px-6 py-4 rounded-xl",
                    "transform transition-all duration-500 ease-out",
                    "shadow-[4px_4px_16px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.2)]",
                    selectedRole &&
                      !isSubmitting &&
                      "hover:scale-105 hover:shadow-[6px_6px_20px_rgba(0,0,0,0.2),-3px_-3px_12px_rgba(255,255,255,0.3)]",
                    "active:scale-95 active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]",
                    !selectedRole && "opacity-40 cursor-not-allowed",
                    selectedOption?.role === UserRole.ACCOUNTANT
                      ? "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 hover:from-primary-500 hover:to-primary-700"
                      : "bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 hover:from-accent-500 hover:to-accent-700"
                  )}
                >
                  <div className='flex items-center justify-center gap-3 relative z-10'>
                    {isSubmitting ? (
                      <>
                        <InlineLoader action={LoadingAction.PROCESSING} size={SpinnerSize.SMALL} />
                        <span>Setting up your account...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Dashboard</span>
                        <ArrowRightIcon
                          className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            "group-hover:translate-x-1 group-active:translate-x-0"
                          )}
                        />
                      </>
                    )}
                  </div>

                  {/* Animated shine effect */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
                      "translate-x-[-120%] group-hover:translate-x-[120%]",
                      "transition-transform duration-800 ease-out",
                      !selectedRole && "hidden"
                    )}
                  />

                  {/* Subtle glow effect */}
                  {selectedRole && !isSubmitting && (
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl blur-lg opacity-25 -z-10",
                        selectedOption?.role === UserRole.ACCOUNTANT ? "bg-primary-600" : "bg-accent-600"
                      )}
                    ></div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
