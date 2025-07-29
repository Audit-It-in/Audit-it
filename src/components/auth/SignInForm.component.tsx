"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useSignIn } from "@/src/services/auth.service";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";

const signInSchema = z.object({
  email: z.string().pipe(z.email("Please enter a valid email")),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useSignIn();

  const onSubmit = async (data: SignInForm) => {
    try {
      await signInMutation.mutateAsync(data);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className='flex flex-col justify-center h-full'>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        {/* Email field */}
        <div className='space-y-2'>
          <Label htmlFor='signin-email' className='text-sm font-semibold text-neutral-700 block'>
            Email Address
          </Label>
          <Input
            id='signin-email'
            type='email'
            placeholder='Enter your email'
            {...form.register("email")}
            className='h-12 px-4 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400'
          />
          {form.formState.errors.email && (
            <p className='text-xs text-red-500 font-medium mt-1 px-1'>{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className='space-y-2'>
          <Label htmlFor='signin-password' className='text-sm font-semibold text-neutral-700 block'>
            Password
          </Label>
          <div className='relative'>
            <Input
              id='signin-password'
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              {...form.register("password")}
              className='h-12 px-4 pr-12 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-neutral-700 transition-colors duration-200 rounded-lg hover:bg-white/60'
            >
              {showPassword ? (
                <EyeSlashIcon className='h-5 w-5' weight='bold' />
              ) : (
                <EyeIcon className='h-5 w-5' weight='bold' />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className='text-xs text-red-500 font-medium mt-1 px-1'>{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Forgot password link */}
        <div className='flex items-center justify-end pt-1'>
          <Link
            href='/auth/forgot-password'
            className='text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 underline-offset-2 hover:underline'
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <div className='pt-4'>
          <Button
            type='submit'
            disabled={signInMutation.isPending}
            className='w-full h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 border-0'
          >
            {signInMutation.isPending ? (
              <div className='flex items-center justify-center space-x-2'>
                <InlineLoader action={LoadingAction.PROCESSING} size={SpinnerSize.SMALL} className='text-white' />
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
