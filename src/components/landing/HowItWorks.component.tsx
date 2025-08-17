"use client";

import { useEffect, useRef } from "react";
import { MagnifyingGlassIcon, ChatsCircleIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";
import { useTelemetry } from "@/src/hooks/useTelemetry";
import { cn } from "@/src/helpers/tailwind.helper";

const steps = [
  {
    title: "Search",
    desc: "Browse verified CAs by location and specialization.",
    Icon: MagnifyingGlassIcon,
  },
  {
    title: "Connect",
    desc: "Message and receive quick responses from experts.",
    Icon: ChatsCircleIcon,
  },
  {
    title: "Get It Done",
    desc: "Hire with confidence and track progress.",
    Icon: CheckCircleIcon,
  },
];

export function HowItWorks() {
  const { track } = useTelemetry();
  const hasTrackedViewRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedViewRef.current) {
      hasTrackedViewRef.current = true;
      track("how_it_works_view");
    }
  }, [track]);

  return (
    <section aria-label='How it works' className='py-4'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl lg:text-3xl font-bold text-primary-900'>How It Works</h2>
          <p className='text-primary-800 mt-2'>Three simple steps to expert help.</p>
        </div>
        <div className='p-6 shadow-neumorphic-xl border-2 border-primary-100/60 bg-white rounded-2xl'>
          <div role='list' className='relative grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6'>
            <div className='pointer-events-none hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary-100 -z-10' />

            {steps.map(({ title, desc, Icon }, i) => (
              <AnimatedReveal
                key={title}
                delayMs={i * 90}
                className='motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100'
              >
                <div
                  role='listitem'
                  tabIndex={0}
                  aria-labelledby={`hiw-title-${i}`}
                  aria-describedby={`hiw-desc-${i}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                      e.preventDefault();
                    }
                  }}
                  onFocus={() => track("how_it_works_focus", { step: i + 1 })}
                  className={cn(
                    "relative rounded-2xl border-2 border-primary-100/60 bg-white p-5",
                    "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-inset",
                    "transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    "motion-reduce:transform-none motion-reduce:transition-none"
                  )}
                >
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='p-2 rounded-xl bg-white border border-primary-200/60 shadow-neumorphic-md'>
                      <Icon className='h-6 w-6 text-primary-700' weight='fill' />
                    </div>
                    <h3 id={`hiw-title-${i}`} className='text-base lg:text-lg font-semibold text-primary-900'>
                      <span className='sr-only'>Step {i + 1}: </span>
                      {title}
                    </h3>
                  </div>
                  <p id={`hiw-desc-${i}`} className='text-sm lg:text-base text-primary-800'>
                    {desc}
                  </p>

                  <div className='absolute top-2 right-2 w-6 h-6 rounded-full border border-primary-200/60 bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center'>
                    {i + 1}
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
