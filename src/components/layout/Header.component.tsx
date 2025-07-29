"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { ChartBarIcon, UserIcon, MathOperationsIcon, NotEqualsIcon, PiIcon } from "@phosphor-icons/react";
import { Logo } from "@/src/components/common/Logo.component";

export function Header() {
  const { user, profile, isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full bg-white'>
      {/* Brand-colored neumorphic header container */}
      <div className='bg-white shadow-[inset_0_2px_4px_rgba(37,99,235,0.1),inset_0_-2px_4px_rgba(37,99,235,0.05)] border-b border-primary-200/50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo and Brand - Neumorphic */}
            <div className='flex items-center space-x-3'>
              <Link href='/' className='flex items-center space-x-3 group'>
                {/* Brand-colored neumorphic logo container */}
                <div className='p-2 bg-white rounded-xl shadow-[4px_4px_8px_rgba(37,99,235,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)] group-hover:shadow-[2px_2px_4px_rgba(37,99,235,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)] transition-all duration-200'>
                  <Logo />
                </div>
                <span className='font-bold text-xl text-primary-900 drop-shadow-sm'>
                  {APP_CONFIG.name.toLowerCase()}
                </span>
              </Link>
            </div>

            {/* Authentication Actions - Neumorphic */}
            <div className='flex items-center space-x-4'>
              {isAuthenticated ? (
                <>
                  {/* User Avatar - Neumorphic */}
                  <div className='flex items-center space-x-3'>
                    <div className='p-1 bg-white rounded-full shadow-[inset_2px_2px_4px_rgba(37,99,235,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]'>
                      <Avatar className='h-8 w-8 shadow-[2px_2px_4px_rgba(37,99,235,0.2)]'>
                        <AvatarImage src={profile?.profile_picture_url} />
                        <AvatarFallback className='bg-primary-100 text-primary-700'>
                          <UserIcon className='h-4 w-4' weight='bold' />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className='hidden sm:block text-sm font-medium text-primary-700 drop-shadow-sm'>
                      {profile?.first_name || user?.email?.split("@")[0] || "User"}
                    </span>
                  </div>

                  {/* Dashboard Button - Neumorphic */}
                  <Link href='/dashboard'>
                    <div className='bg-white rounded-lg shadow-[4px_4px_8px_rgba(37,99,235,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_4px_rgba(37,99,235,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_4px_rgba(37,99,235,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all duration-200 cursor-pointer'>
                      <div className='flex items-center space-x-2 px-4 py-2 text-primary-700'>
                        <PiIcon className='h-4 w-4' weight='bold' />
                        <span className='hidden sm:inline text-sm font-medium'>Dashboard</span>
                      </div>
                    </div>
                  </Link>

                  {/* Sign Out Button - Neumorphic */}
                  <div
                    onClick={handleSignOut}
                    className='bg-red-50 rounded-lg shadow-[4px_4px_8px_rgba(239,68,68,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_4px_rgba(239,68,68,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_4px_rgba(239,68,68,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all duration-200 cursor-pointer'
                  >
                    <div className='flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700'>
                      <NotEqualsIcon className='h-4 w-4' weight='bold' />
                      <span className='hidden sm:inline text-sm font-medium'>Sign Out</span>
                    </div>
                  </div>
                </>
              ) : (
                <Link href='/auth'>
                  {/* Brand-colored neumorphic Sign In Button */}
                  <div className='bg-white rounded-2xl shadow-[4px_4px_8px_rgba(37,99,235,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_4px_rgba(37,99,235,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_4px_rgba(37,99,235,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all duration-200 cursor-pointer'>
                    <div className='flex items-center space-x-2 px-4 py-2'>
                      <MathOperationsIcon className='h-5 w-5 text-primary-600' weight='bold' />
                      <span className='text-primary-700 font-semibold text-md'>Sign In</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
