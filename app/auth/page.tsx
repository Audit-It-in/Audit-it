"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignInForm } from "@/src/components/auth/SignInForm.component";
import { SignUpForm } from "@/src/components/auth/SignUpForm.component";
import { GoogleSignInButton } from "@/src/components/auth/GoogleSignInButton.component";
import { Header } from "@/src/components/layout/Header.component";
import { Footer } from "@/src/components/layout/Footer.component";
import { Loader } from "@/src/components/common/Loader.component";
import { StatusMessage } from "@/src/components/common/StatusMessage.component";
import { TabButton } from "@/src/components/common/TabButton.component";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";
import { AUTH_LOADING_MESSAGES } from "@/src/constants/auth.constants";
import { AuthTab, AuthLoadingState } from "@/src/types/auth.type";
import { StatusMessage as StatusMessageType, StatusMessageType as MessageType } from "@/src/types/common.type";
import { LoadingAction } from "@/src/types/ui.type";
import { getAuthErrorMessage } from "@/src/helpers/auth.helper";

function AuthPageContent() {
  const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.SIGNIN);
  const [statusMessage, setStatusMessage] = useState<StatusMessageType | null>(null);
  const searchParams = useSearchParams();
  const { shouldShowAuth, isLoading, isRedirecting } = useAuthRedirect();

  // Auth redirect logic is now handled by useAuthRedirect hook

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error || message) {
      setStatusMessage(getAuthErrorMessage(error || message));

      // Clear URL parameters
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const handleGoogleSignInError = (message: string) => {
    setStatusMessage({ type: MessageType.ERROR, text: message });
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loader action={LoadingAction.LOADING} title={AUTH_LOADING_MESSAGES[AuthLoadingState.LOADING]} />;
  }

  // Show redirecting state for authenticated users
  if (isRedirecting) {
    return (
      <Loader
        action={LoadingAction.LOADING}
        title={AUTH_LOADING_MESSAGES[AuthLoadingState.REDIRECTING]}
        subtitle='Taking you to your dashboard...'
      />
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-accent-50/10'>
      <Header />

      <main className='flex items-center justify-center px-4 py-8 min-h-[calc(100vh-160px)]'>
        <div className='w-full max-w-md'>
          {/* Main auth container with consistent neumorphic design */}
          <div className='relative'>
            {/* Background layers for depth */}
            <div className='absolute inset-0 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary-900/10 transform translate-y-1'></div>

            {/* Main card */}
            <div className='relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/30 overflow-hidden'>
              {/* Enhanced tab switcher */}
              <div className='p-6 pb-4'>
                <div className='relative bg-neutral-100/70 backdrop-blur-sm rounded-2xl p-1.5 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]'>
                  <div className='relative'>
                    {/* Animated tab indicator */}
                    <div
                      className={`absolute top-0 h-full w-1/2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-[0_2px_8px_rgba(37,99,235,0.4)] transition-all duration-300 ease-out ${
                        activeTab === AuthTab.SIGNUP ? "translate-x-full" : "translate-x-0"
                      }`}
                    />

                    {/* Tab buttons */}
                    <div className='relative flex'>
                      <TabButton isActive={activeTab === AuthTab.SIGNIN} onClick={() => setActiveTab(AuthTab.SIGNIN)}>
                        Sign In
                      </TabButton>
                      <TabButton isActive={activeTab === AuthTab.SIGNUP} onClick={() => setActiveTab(AuthTab.SIGNUP)}>
                        Sign Up
                      </TabButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && <StatusMessage message={statusMessage} />}

              {/* Form container with proper height and centering */}
              <div className='px-6'>
                <div className='bg-neutral-50/60 rounded-2xl p-5 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.95)] border border-white/50'>
                  {/* Fixed height container - same height for both forms */}
                  <div className='h-[400px] flex flex-col justify-center'>
                    {activeTab === AuthTab.SIGNIN ? <SignInForm /> : <SignUpForm />}
                  </div>
                </div>
              </div>

              {/* Unified Google Sign In section */}
              <div className='p-6 pt-4'>
                {/* Beautiful divider */}
                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-neutral-200/60'></div>
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white/90 px-4 text-neutral-500 font-medium tracking-wider'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleSignInButton mode={activeTab} onError={handleGoogleSignInError} />
              </div>
            </div>
          </div>

          {/* Enhanced footer with better spacing */}
          <div className='text-center mt-8 space-y-4'>
            <p className='text-sm text-neutral-600'>
              By continuing, you agree to our{" "}
              <Link href='/terms' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href='/privacy' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
                Privacy Policy
              </Link>
            </p>
            <p className='text-xs text-neutral-500'>Secure authentication powered by Supabase</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <Loader action={LoadingAction.LOADING} title={AUTH_LOADING_MESSAGES[AuthLoadingState.LOADING]} />
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
