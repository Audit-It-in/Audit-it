"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export function LandingHero() {
  const headline = useMemo(() => "Find Your Perfect Chartered Accountant", []);
  const subcopy = useMemo(
    () =>
      "Connect with verified CAs near you. Get expert help for tax filing, GST, audits, and all your financial needs.",
    []
  );

  return (
    <section aria-label='Hero' className='py-10 sm:py-14'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <Card
          variant='default'
          size='lg'
          className='relative overflow-hidden rounded-2xl border-2 border-primary-100/60 bg-white shadow-neumorphic-xl md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl'
        >
          <div className='p-8 md:p-10 lg:p-12 text-center space-y-6'>
            <Badge className='inline-block bg-primary-50 text-primary-800 border-primary-200/60 shadow-neumorphic-md'>
              Featured Platform
            </Badge>

            <h1 className='text-3xl lg:text-5xl font-extrabold text-primary-900'>{headline}</h1>

            <p className='text-lg lg:text-xl text-primary-800 max-w-3xl mx-auto'>{subcopy}</p>

            <div className='max-w-2xl mx-auto w-full'>
              <Card
                variant='inset'
                className='rounded-2xl border-primary-100/60 bg-white shadow-neumorphic-inset p-4 md:p-6'
              >
                <div className='space-y-4'>
                  <div className='relative'>
                    <MagnifyingGlassIcon
                      className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400'
                      weight='bold'
                    />
                    <Input
                      className='pl-12 h-12 md:h-14 text-base md:text-lg rounded-xl border-2 border-primary-100 focus-visible:ring-0 focus-visible:outline-none focus:border-primary-400'
                      placeholder='Search by location, specialization, or CA name'
                      aria-label='Search'
                    />
                  </div>

                  <div className='flex flex-col sm:flex-row gap-3'>
                    <Link href='/accountants' className='w-full'>
                      <Button className='w-full min-h-[44px]' variant='primary'>
                        Search CAs
                      </Button>
                    </Link>
                    <Link href='/auth?join=ca' className='w-full'>
                      <Button className='w-full min-h-[44px]' variant='outline'>
                        Join as CA
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            <p className='text-sm text-primary-700'>Trusted by thousands across India with {APP_CONFIG.name}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
