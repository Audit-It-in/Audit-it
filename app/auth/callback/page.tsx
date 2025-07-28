"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentSession } from "@/src/services/auth.service";
import { useSetAtom } from "jotai";
import { authUserAtom } from "@/src/store/auth.store";
import { CircleNotchIcon } from "@phosphor-icons/react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useSetAtom(authUserAtom);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for OAuth errors in URL parameters
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        console.error("OAuth error:", error, errorDescription);

        // Handle specific OAuth errors
        if (error === "access_denied") {
          // User cancelled the OAuth flow
          router.push("/auth?message=cancelled");
          return;
        }

        // Other OAuth errors
        router.push(`/auth?error=${error}`);
        return;
      }

      try {
        const { user, session } = await getCurrentSession();

        if (user && session) {
          setUser(user);
          router.push("/dashboard");
        } else {
          router.push("/auth");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth?error=callback_error");
      }
    };

    handleAuthCallback();
  }, [router, setUser, searchParams]);

  return (
    <div className='min-h-screen bg-neutral-50 flex items-center justify-center'>
      <div className='text-center'>
        <CircleNotchIcon className='h-8 w-8 animate-spin mx-auto mb-4 text-primary-600' />
        <h2 className='text-lg font-semibold text-neutral-900 mb-2'>Completing sign in...</h2>
        <p className='text-neutral-600'>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-neutral-50 flex items-center justify-center'>
          <div className='text-center'>
            <CircleNotchIcon className='h-8 w-8 animate-spin mx-auto mb-4 text-primary-600' />
            <h2 className='text-lg font-semibold text-neutral-900 mb-2'>Loading...</h2>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
