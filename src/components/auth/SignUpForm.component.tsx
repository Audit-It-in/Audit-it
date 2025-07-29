"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useSignUp } from "@/src/services/auth.service";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().pipe(z.email("Please enter a valid email")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUpMutation = useSignUp();

  const onSubmit = async (data: SignUpForm) => {
    try {
      await signUpMutation.mutateAsync(data);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className='flex flex-col justify-center h-full'>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Name fields */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='firstName' className='text-sm font-semibold text-neutral-700 block'>
              First Name
            </Label>
            <Input
              id='firstName'
              type='text'
              placeholder='First name'
              {...form.register("firstName")}
              className='h-11 px-3 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400 text-sm'
            />
            {form.formState.errors.firstName && (
              <p className='text-xs text-red-500 font-medium mt-0.5 px-1'>{form.formState.errors.firstName.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='lastName' className='text-sm font-semibold text-neutral-700 block'>
              Last Name
            </Label>
            <Input
              id='lastName'
              type='text'
              placeholder='Last name'
              {...form.register("lastName")}
              className='h-11 px-3 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400 text-sm'
            />
            {form.formState.errors.lastName && (
              <p className='text-xs text-red-500 font-medium mt-0.5 px-1'>{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email field */}
        <div className='space-y-1.5'>
          <Label htmlFor='signup-email' className='text-sm font-semibold text-neutral-700 block'>
            Email Address
          </Label>
          <Input
            id='signup-email'
            type='email'
            placeholder='Enter your email'
            {...form.register("email")}
            className='h-11 px-3 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400 text-sm'
          />
          {form.formState.errors.email && (
            <p className='text-xs text-red-500 font-medium mt-0.5 px-1'>{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className='space-y-1.5'>
          <Label htmlFor='signup-password' className='text-sm font-semibold text-neutral-700 block'>
            Password
          </Label>
          <div className='relative'>
            <Input
              id='signup-password'
              type={showPassword ? "text" : "password"}
              placeholder='Create a password'
              {...form.register("password")}
              className='h-11 px-3 pr-10 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400 text-sm'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-700 transition-colors duration-200 rounded-lg hover:bg-white/60'
            >
              {showPassword ? (
                <EyeSlashIcon className='h-4 w-4' weight='bold' />
              ) : (
                <EyeIcon className='h-4 w-4' weight='bold' />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className='text-xs text-red-500 font-medium mt-0.5 px-1'>{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Confirm password field */}
        <div className='space-y-1.5'>
          <Label htmlFor='confirmPassword' className='text-sm font-semibold text-neutral-700 block'>
            Confirm Password
          </Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Confirm your password'
              {...form.register("confirmPassword")}
              className='h-11 px-3 pr-10 bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(37,99,235,0.15)] focus:border-primary-400 focus:bg-white/90 transition-all duration-300 text-neutral-800 placeholder:text-neutral-400 text-sm'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-700 transition-colors duration-200 rounded-lg hover:bg-white/60'
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className='h-4 w-4' weight='bold' />
              ) : (
                <EyeIcon className='h-4 w-4' weight='bold' />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className='text-xs text-red-500 font-medium mt-0.5 px-1'>
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <div className='pt-3'>
          <Button
            type='submit'
            disabled={signUpMutation.isPending}
            className='w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 border-0'
          >
            {signUpMutation.isPending ? (
              <div className='flex items-center justify-center space-x-2'>
                <InlineLoader action={LoadingAction.PROCESSING} size={SpinnerSize.SMALL} className='text-white' />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
