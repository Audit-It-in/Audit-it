"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { useGoogleSignIn } from "@/src/services/auth.service";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { SignInForm } from "@/src/components/auth/SignInForm.component";
import { SignUpForm } from "@/src/components/auth/SignUpForm.component";
import { Header } from "@/src/components/layout/Header.component";
import { Footer } from "@/src/components/layout/Footer.component";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const searchParams = useSearchParams();

  const googleSignInMutation = useGoogleSignIn();

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error) {
      switch (error) {
        case "access_denied":
          setStatusMessage({ type: "info", text: "Sign in was cancelled. You can try again whenever you're ready." });
          break;
        case "callback_error":
          setStatusMessage({ type: "error", text: "There was an error during sign in. Please try again." });
          break;
        default:
          setStatusMessage({ type: "error", text: "An error occurred during sign in. Please try again." });
      }
    } else if (message === "cancelled") {
      setStatusMessage({ type: "info", text: "Sign in was cancelled. You can try again whenever you're ready." });
    }

    // Clear the URL parameters after showing the message
    if (error || message) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const onGoogleSignIn = async () => {
    try {
      setStatusMessage(null); // Clear any previous messages
      await googleSignInMutation.mutateAsync();
    } catch (error: unknown) {
      console.error("Google sign in error:", error);
      setStatusMessage({ type: "error", text: "Failed to initiate Google sign in. Please try again." });
    }
  };

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
                        activeTab === "signup" ? "translate-x-full" : "translate-x-0"
                      }`}
                    />

                    {/* Tab buttons */}
                    <div className='relative flex'>
                      <button
                        onClick={() => setActiveTab("signin")}
                        className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          activeTab === "signin"
                            ? "text-white relative z-10"
                            : "text-neutral-600 hover:text-neutral-800"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          activeTab === "signup"
                            ? "text-white relative z-10"
                            : "text-neutral-600 hover:text-neutral-800"
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className='px-6 pb-2'>
                  <div className={`p-4 rounded-xl text-sm ${
                    statusMessage.type === "error" 
                      ? "bg-red-50/80 border border-red-200/60 text-red-700" 
                      : "bg-blue-50/80 border border-blue-200/60 text-blue-700"
                  }`}>
                    {statusMessage.text}
                  </div>
                </div>
              )}

              {/* Form container with proper height and centering */}
              <div className='px-6'>
                <div className='bg-neutral-50/60 rounded-2xl p-5 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.95)] border border-white/50'>
                  {/* Fixed height container - same height for both forms */}
                  <div className='h-[400px] flex flex-col justify-center'>
                    {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
                  </div>
                </div>
              </div>

              {/* Unified Google Sign In section */}
              <div className='p-6 pt-4'>
                {/* Beautiful divider */}
                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent'></div>
                  </div>
                  <div className='relative flex justify-center'>
                    <span className='bg-white/95 backdrop-blur-sm px-6 py-2 text-xs font-medium text-neutral-500 rounded-full shadow-sm border border-white/70'>
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Beautiful unified Google button */}
                <Button
                  type='button'
                  onClick={onGoogleSignIn}
                  disabled={googleSignInMutation.isPending}
                  className='w-full h-13 bg-white/90 backdrop-blur-sm border-2 border-neutral-200/40 text-neutral-700 font-semibold rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08),-2px_-2px_8px_rgba(255,255,255,0.9),2px_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06)] hover:bg-neutral-50/90 hover:border-neutral-300/50 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 group'
                >
                  <div className='flex items-center justify-center space-x-3'>
                    <GoogleLogoIcon className='h-5 w-5 transition-transform duration-300 group-hover:scale-110' />
                    <span>{googleSignInMutation.isPending ? "Connecting..." : `Continue with Google`}</span>
                    {googleSignInMutation.isPending && (
                      <div className='w-4 h-4 border-2 border-neutral-400/30 border-t-neutral-600 rounded-full animate-spin ml-2' />
                    )}
                  </div>
                </Button>
              </div>

              {/* Terms footer */}
              <div className='px-6 pb-6'>
                <p className='text-xs text-neutral-500 leading-relaxed text-center'>
                  By continuing, you agree to our{" "}
                  <Link
                    href='/terms'
                    className='text-primary-600 hover:text-primary-700 font-medium transition-colors underline-offset-2 hover:underline'
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href='/privacy'
                    className='text-primary-600 hover:text-primary-700 font-medium transition-colors underline-offset-2 hover:underline'
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
