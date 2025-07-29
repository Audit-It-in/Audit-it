"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentSession } from "@/src/services/auth.service";
import { useSetAtom } from "jotai";
import { authUserAtom } from "@/src/store/auth.store";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";

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

          // Check if user has a profile and role set
          try {
            const { fetchUserProfile } = await import("@/src/services/auth.service");
            const profile = await fetchUserProfile(user.id);

            if (!profile || !profile.role) {
              // Redirect to role selection if no profile or role
              router.push("/role-selection");
            } else {
              // Redirect to dashboard if profile and role exist
              router.push("/dashboard");
            }
          } catch {
            console.log("No profile found, redirecting to role selection");
            router.push("/role-selection");
          }
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
    <Loader
      action={LoadingAction.PROCESSING}
      title='Completing sign in...'
      subtitle='Please wait while we set up your account.'
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={<Loader action={LoadingAction.LOADING} title='Loading...' subtitle='Setting up authentication...' />}
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
