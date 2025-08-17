"use client";

import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { APP_CONFIG } from "@/src/constants/app.constants";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";

export function BottomCTA() {
  return (
    <section aria-label='Get Started' className='py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <AnimatedReveal>
          <Card
            variant='default'
            className='rounded-2xl border-2 border-primary-100/60 bg-accent-50 shadow-neumorphic-xl p-8 text-center'
          >
            <p className='text-sm font-semibold text-primary-800 mb-2'>Let’s get practical</p>
            <h2 className='text-2xl lg:text-3xl font-bold text-primary-900 mb-4'>
              Start a conversation with a CA today
            </h2>
            <p className='text-primary-800 mb-6'>
              Find someone who understands your stage — and your ambitions — on {APP_CONFIG.name}.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Link href='/accountants'>
                <Button className='min-h-[44px]' variant='primary'>
                  Explore Experts
                </Button>
              </Link>
              <Link href='/auth?join=ca'>
                <Button className='min-h-[44px]' variant='outline'>
                  Join as CA
                </Button>
              </Link>
            </div>
          </Card>
        </AnimatedReveal>
      </div>
    </section>
  );
}
