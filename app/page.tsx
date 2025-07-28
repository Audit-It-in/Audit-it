"use client";

import { Header } from "@/src/components/layout/Header.component";
import { Footer } from "@/src/components/layout/Footer.component";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { APP_CONFIG } from "@/src/constants/app.constants";
import {
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />

      <main>
        {/* Hero Section */}
        <section className='relative bg-primary-900 overflow-hidden'>
          {/* Background patterns and decorative elements */}
          <div className='absolute inset-0 bg-pattern-dots opacity-10' />

          {/* Content */}
          <div className='relative z-10 container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
            <div className='text-center'>
              <Badge className='mb-4 bg-white/10 text-white border-white/20'>Featured Platform</Badge>

              <h1 className='text-3xl lg:text-5xl font-bold text-white mb-6'>
                Find Your Perfect <span className='text-accent-400'>Chartered Accountant</span>
              </h1>

              <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
                Connect with verified CAs near you. Get expert help for tax filing, GST, audits, and all your financial
                needs.
              </p>

              {/* Search Section */}
              <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto mb-8'>
                <div className='space-y-4'>
                  {/* Main search input */}
                  <div className='relative'>
                    <MagnifyingGlassIcon className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400' />
                    <Input
                      className='pl-12 h-14 text-lg rounded-xl border-neutral-200 focus:border-primary-500'
                      placeholder='Search by location, specialization, or CA name...'
                    />
                  </div>

                  {/* Quick filter pills */}
                  <div className='flex flex-wrap gap-2 justify-center'>
                    <Button variant='secondary' className='rounded-full px-4 py-2 text-sm'>
                      Tax Filing
                    </Button>
                    <Button variant='secondary' className='rounded-full px-4 py-2 text-sm'>
                      GST Services
                    </Button>
                    <Button variant='secondary' className='rounded-full px-4 py-2 text-sm'>
                      Audit Services
                    </Button>
                    <Button variant='secondary' className='rounded-full px-4 py-2 text-sm'>
                      Business Setup
                    </Button>
                  </div>

                  <Link href='/accountants'>
                    <Button className='w-full h-12 text-lg bg-primary-600 hover:bg-primary-700'>Search CAs</Button>
                  </Link>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80'>
                <div className='flex items-center space-x-1'>
                  <StarIcon className='h-5 w-5 text-accent-400' />
                  <span>4.8/5 Average Rating</span>
                </div>
                <div className='hidden sm:block text-white/40'>•</div>
                <div className='flex items-center space-x-1'>
                  <UsersIcon className='h-5 w-5 text-accent-400' />
                  <span>500+ Verified CAs</span>
                </div>
                <div className='hidden sm:block text-white/40'>•</div>
                <div className='flex items-center space-x-1'>
                  <ShieldCheckIcon className='h-5 w-5 text-accent-400' />
                  <span>100% Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-16 lg:py-24 bg-neutral-50'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <Badge className='mb-4'>Why Choose {APP_CONFIG.name}</Badge>
              <h2 className='text-3xl lg:text-4xl font-bold text-neutral-900 mb-4'>Trusted by Thousands</h2>
              <p className='text-lg text-neutral-600 max-w-2xl mx-auto'>
                We make finding the right CA simple, secure, and efficient for all your financial needs.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Feature Card 1 */}
              <Card className='group overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                <div className='h-2 bg-primary-600' />
                <div className='p-6'>
                  <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg'>
                    <ShieldCheckIcon className='h-8 w-8 text-primary-600 group-hover:rotate-6 transition-transform' />
                  </div>
                  <h3 className='text-xl font-semibold text-neutral-800 mb-2'>Verified Professionals</h3>
                  <p className='text-neutral-600'>
                    All CAs are thoroughly verified with valid certifications and licenses.
                  </p>
                </div>
              </Card>

              {/* Feature Card 2 */}
              <Card className='group overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                <div className='h-2 bg-accent-500' />
                <div className='p-6'>
                  <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg'>
                    <MapPinIcon className='h-8 w-8 text-accent-600 group-hover:rotate-6 transition-transform' />
                  </div>
                  <h3 className='text-xl font-semibold text-neutral-800 mb-2'>Location-Based Search</h3>
                  <p className='text-neutral-600'>
                    Find CAs in your city with detailed location and contact information.
                  </p>
                </div>
              </Card>

              {/* Feature Card 3 */}
              <Card className='group overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                <div className='h-2 bg-primary-600' />
                <div className='p-6'>
                  <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg'>
                    <ClockIcon className='h-8 w-8 text-primary-600 group-hover:rotate-6 transition-transform' />
                  </div>
                  <h3 className='text-xl font-semibold text-neutral-800 mb-2'>Quick Response</h3>
                  <p className='text-neutral-600'>
                    Get responses from CAs within hours, not days. Fast and efficient service.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='relative bg-primary-600'>
          <div className='px-4 py-16 text-center'>
            <Badge className='mb-4 bg-white/10 text-white border-white/20'>Get Started Today</Badge>
            <h2 className='text-2xl lg:text-4xl font-bold text-white mb-6'>Ready to connect with top CAs?</h2>
            <p className='text-lg text-white/90 mb-8 max-w-xl mx-auto'>
              Join thousands who trust {APP_CONFIG.name} for their financial needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/accountants'>
                <Button className='bg-white text-primary-900 hover:bg-neutral-50 shadow-lg hover:shadow-xl px-8 py-3'>
                  Find CAs Near Me
                </Button>
              </Link>
              <Link href='/accountant/register'>
                <Button
                  variant='outline'
                  className='border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3'
                >
                  Join as CA
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
