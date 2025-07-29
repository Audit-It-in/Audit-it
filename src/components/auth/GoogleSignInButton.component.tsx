"use client";

import { Button } from "@/src/components/ui/button";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { useGoogleSignIn } from "@/src/services/auth.service";

interface GoogleSignInButtonProps {
  mode: "signin" | "signup";
  onError?: (message: string) => void;
}

export function GoogleSignInButton({ mode, onError }: GoogleSignInButtonProps) {
  const googleSignInMutation = useGoogleSignIn();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignInMutation.mutateAsync();
    } catch (error: unknown) {
      console.error("Google sign in error:", error);
      onError?.("Failed to initiate Google sign in. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={googleSignInMutation.isPending}
      className='w-full h-12 bg-white hover:bg-neutral-50 text-neutral-700 shadow-[4px_4px_12px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.9)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.95)] active:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.15),inset_-2px_-2px_8px_rgba(255,255,255,0.8)] transition-all duration-300 rounded-xl border-0 font-semibold text-base'
    >
      <GoogleLogoIcon className='mr-3 h-5 w-5' weight='bold' />
      {googleSignInMutation.isPending
        ? "Connecting..."
        : `${mode === "signin" ? "Sign in" : "Sign up"} with Google`}
    </Button>
  );
} 