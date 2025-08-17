"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";
import { KineticHeadline } from "@/src/components/landing/KineticHeadline.component";
import { MagneticContainer } from "@/src/components/landing/MagneticContainer.component";
import { HeroIllustration } from "@/src/components/landing/HeroIllustration.component";
import { HeroSearchBar, type HeroSearchFormValues } from "@/src/components/landing/HeroSearchBar.component";
import { encodeFiltersToQuery } from "@/src/helpers/search-url.helper";

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleHeroSearchSubmit = (values: HeroSearchFormValues) => {
    const current = new URLSearchParams(searchParams?.toString());
    const params = encodeFiltersToQuery(values);

    // Preserve unrelated params
    ["district", "specializations", "languages"].forEach((k) => current.delete(k));
    params.forEach((v, k) => current.set(k, v));

    const query = current.toString();
    router.push(query ? `/accountants?${query}` : "/accountants");
  };

  return (
    <section role='region' aria-label='Hero' className='py-4'>
      <div className='container mx-auto px-4 sm:px-4 lg:px-6'>
        <Card
          variant='default'
          size='lg'
          className='relative overflow-hidden rounded-2xl border-2 border-primary-100/60 bg-white shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl neumorphic-optimized p-0'
        >
          <div ref={heroRef} className='relative p-4 md:p-6 lg:p-8'>
            <div className='md:grid md:grid-cols-12 md:gap-8 items-center'>
              <div className='md:col-span-7 space-y-6 text-center md:text-left'>
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
                  <p className='text-lg lg:text-xl text-primary-800 md:max-w-xl'>Get clarity on your numbers, fast.</p>
                </AnimatedReveal>

                <AnimatedReveal delayMs={140}>
                  <div className='max-w-3xl md:max-w-none mx-auto md:mx-0'>
                    <HeroSearchBar onSubmit={handleHeroSearchSubmit} />
                  </div>
                </AnimatedReveal>

                <AnimatedReveal delayMs={180}>
                  <div className='mt-2 flex flex-col sm:flex-row gap-3 max-w-3xl md:max-w-none mx-auto md:mx-0 justify-between'>
                    <MagneticContainer className='w-full sm:w-[40%]'>
                      <Link href='/accountants' className='w-full block'>
                        <Button
                          className='w-full min-h-[44px] transition-neumorphic hover:scale-110 active:scale-95 hover:shadow-neumorphic-hover active:shadow-neumorphic-inset'
                          variant='outline'
                        >
                          Explore Experts
                        </Button>
                      </Link>
                    </MagneticContainer>
                    <div className='flex-1 hidden sm:block' />
                    <MagneticContainer className='w-full sm:w-[40%]'>
                      <Link href='/auth?join=ca' className='w-full block'>
                        <Button
                          className='w-full min-h-[44px] transition-neumorphic hover:scale-110 active:scale-95 hover:shadow-neumorphic-hover active:shadow-neumorphic-inset'
                          variant='primary'
                        >
                          Join as CA
                        </Button>
                      </Link>
                    </MagneticContainer>
                  </div>
                </AnimatedReveal>
              </div>

              <div className='md:col-span-5 hidden md:block lg:pb-14'>
                <AnimatedReveal delayMs={120}>
                  <div className='mx-auto max-w-4xl'>
                    <HeroIllustration className='max-h-64 w-full' />
                  </div>
                </AnimatedReveal>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
