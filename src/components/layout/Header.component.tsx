"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { UserRole } from "@/src/types/auth.type";
import { ListIcon, XIcon, UserIcon, SignOutIcon, GearIcon } from "@phosphor-icons/react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo and Brand */}
          <div className='flex items-center space-x-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600'>
                <span className='text-sm font-bold text-white'>TF</span>
              </div>
              <div className='hidden sm:block'>
                <h1 className='text-xl font-bold text-neutral-900'>{APP_CONFIG.name}</h1>
                <p className='text-xs text-neutral-600'>{APP_CONFIG.tagline}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='/accountants'
              className='text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors'
            >
              Find CAs
            </Link>
            <Link
              href='/services'
              className='text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors'
            >
              Services
            </Link>
            <Link
              href='/about'
              className='text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors'
            >
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-3'>
                {profile?.role === UserRole.ACCOUNTANT && (
                  <Badge variant='secondary' className='hidden sm:inline-flex'>
                    CA
                  </Badge>
                )}

                <div className='relative group'>
                  <Button variant='ghost' size='sm' className='flex items-center space-x-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={profile?.profile_picture_url} />
                      <AvatarFallback>{profile?.first_name?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className='hidden sm:block text-sm'>{profile?.first_name || "Profile"}</span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                    <div className='py-1'>
                      <Link
                        href='/profile'
                        className='flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50'
                      >
                        <UserIcon className='h-4 w-4 mr-2' />
                        Profile
                      </Link>
                      <Link
                        href='/settings'
                        className='flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50'
                      >
                        <GearIcon className='h-4 w-4 mr-2' />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                      >
                        <SignOutIcon className='h-4 w-4 mr-2' />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link href='/auth'>
                  <Button
                    size='sm'
                    className='bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='sm'
              className='md:hidden'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon className='h-5 w-5' /> : <ListIcon className='h-5 w-5' />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t'>
              <Link
                href='/accountants'
                className='block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find CAs
              </Link>
              <Link
                href='/services'
                className='block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href='/about'
                className='block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              {!isAuthenticated && (
                <div className='px-3 pt-4 pb-2'>
                  <Link href='/auth' onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className='w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0'>
                      Join Audit-it
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
