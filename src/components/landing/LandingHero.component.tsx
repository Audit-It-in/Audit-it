"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";
import { KineticHeadline } from "@/src/components/landing/KineticHeadline.component";
import { OrbitRing } from "@/src/components/landing/OrbitRing.component";
import { MagneticContainer } from "@/src/components/landing/MagneticContainer.component";

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  return (
    <section aria-label='Hero' className='py-10 sm:py-14'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <Card
          variant='default'
          size='lg'
          className='relative overflow-hidden rounded-2xl border-2 border-primary-100/60 bg-white shadow-neumorphic-xl md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl'
        >
          <div ref={heroRef} className='relative p-8 md:p-10 lg:p-12 text-center space-y-6'>
            <AnimatedReveal>
              <Badge className='inline-block bg-primary-50 text-primary-800 border-primary-200/60 shadow-neumorphic-md'>
                Your Finance, Crafted, Clear, Connected
              </Badge>
            </AnimatedReveal>

            <KineticHeadline
              lines={["Meet Your Next", "Chartered Accountant"]}
              className='text-3xl lg:text-5xl font-extrabold'
            />

            <AnimatedReveal delayMs={80}>
              <p className='text-lg lg:text-xl text-primary-800 max-w-3xl mx-auto'>
                Discover professionals who speak your business. Search by city or specialization and start a focused
                conversation in minutes.
              </p>
            </AnimatedReveal>

            <AnimatedReveal delayMs={120}>
              <div className='flex items-center justify-center'>
                <OrbitRing
                  size={240}
                  items={[
                    { id: "1", label: "Tax Filing" },
                    { id: "2", label: "GST" },
                    { id: "3", label: "Audit & Assurance" },
                    { id: "4", label: "Business Setup" },
                    { id: "5", label: "Startup Finance" },
                    { id: "6", label: "Compliance" },
                  ]}
                  className='hidden md:block'
                />
              </div>
            </AnimatedReveal>

            <AnimatedReveal delayMs={180}>
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
                        placeholder='Try "Bengaluru GST" or "Startup CFO"'
                        aria-label='Search'
                      />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3'>
                      <MagneticContainer className='w-full'>
                        <Link href='/accountants' className='w-full block'>
                          <Button className='w-full min-h-[44px]' variant='primary'>
                            Explore Experts
                          </Button>
                        </Link>
                      </MagneticContainer>
                      <MagneticContainer className='w-full'>
                        <Link href='/auth?join=ca' className='w-full block'>
                          <Button className='w-full min-h-[44px]' variant='outline'>
                            Join as CA
                          </Button>
                        </Link>
                      </MagneticContainer>
                    </div>
                  </div>
                </Card>
              </div>
            </AnimatedReveal>
          </div>
        </Card>
      </div>
    </section>
  );
}
