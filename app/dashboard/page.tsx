"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Header } from "@/src/components/layout/Header.component";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { UserIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";

export default function DashboardPage() {
  const { user, profile, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    } else if (!authLoading && isAuthenticated && profile !== undefined) {
      // If user is authenticated but doesn't have a role, redirect to role selection
      if (!profile || !profile.role) {
        router.push("/role-selection");
      }
    }
  }, [authLoading, isAuthenticated, profile, router]);

  if (authLoading) {
    return <Loader action={LoadingAction.LOADING} title="Loading Dashboard" subtitle="Preparing your personalized experience" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-neutral-50'>
      <Header />

      <main className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Welcome Section */}
          <div className='mb-8'>
            <Badge className='mb-4'>Welcome to {APP_CONFIG.name}</Badge>
            <h1 className='text-3xl font-bold text-neutral-900 mb-2'>
              Welcome back, {profile?.first_name || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className='text-lg text-neutral-600'>Great to see you again. Here&apos;s your dashboard overview.</p>
          </div>

          {/* User Info Card */}
          <Card className='p-6 mb-8'>
            <div className='flex items-center space-x-4'>
                              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary-600'>
                <UserIcon className='h-8 w-8 text-white' weight='bold' />
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-semibold text-neutral-900'>
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : user?.email}
                </h3>
                <p className='text-neutral-600'>{user?.email}</p>
                <div className='flex items-center space-x-2 mt-2'>
                  <CheckCircleIcon className='h-4 w-4 text-green-500' weight='bold' />
                  <span className='text-sm text-green-600'>Account verified</span>
                </div>
              </div>
              {profile?.role && (
                <Badge variant='secondary' className='capitalize'>
                  {profile.role}
                </Badge>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card className='p-6 hover:shadow-lg transition-shadow'>
              <h4 className='font-semibold text-neutral-900 mb-2'>Profile Setup</h4>
              <p className='text-sm text-neutral-600 mb-4'>Complete your profile to get better CA recommendations.</p>
              <Button 
                variant='outline' 
                size='sm'
                onClick={() => router.push('/profile')}
              >
                Complete Profile
              </Button>
            </Card>

                         <Card className='p-6 hover:shadow-lg transition-shadow'>
               <h4 className='font-semibold text-neutral-900 mb-2'>Find CAs</h4>
               <p className='text-sm text-neutral-600 mb-4'>Search for chartered accountants in your area.</p>
               <Button variant='outline' size='sm'>
                 Browse CAs
               </Button>
             </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow'>
              <h4 className='font-semibold text-neutral-900 mb-2'>Contact Requests</h4>
              <p className='text-sm text-neutral-600 mb-4'>View and manage your contact requests.</p>
              <Button variant='outline' size='sm'>
                View Requests
              </Button>
            </Card>
          </div>

          {/* Auth Debug Info (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <Card className='p-6 mt-8 bg-neutral-100'>
              <h4 className='font-semibold text-neutral-900 mb-4'>Debug Info (Dev Only)</h4>
              <div className='space-y-2 text-sm'>
                <p>
                  <strong>User ID:</strong> {user?.id}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Profile ID:</strong> {profile?.id || "Not created"}
                </p>
                <p>
                  <strong>Role:</strong> {profile?.role || "Not set"}
                </p>
                <p>
                  <strong>Created:</strong> {user?.created_at}
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
