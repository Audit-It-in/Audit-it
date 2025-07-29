import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export const useAuthRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, authLoading, profile } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated && profile !== undefined) {
      const destination = !profile || !profile.role ? "/role-selection" : "/dashboard";
      router.push(destination);
    }
  }, [authLoading, isAuthenticated, profile, router]);

  return {
    shouldShowAuth: !authLoading && !isAuthenticated,
    isLoading: authLoading,
    isRedirecting: !authLoading && isAuthenticated,
  };
};
