"use client";

import { Card } from "@/src/components/ui/card";
import { NumberCircleOneIcon, NumberCircleTwoIcon, NumberCircleThreeIcon } from "@phosphor-icons/react";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";

const steps = [
  {
    title: "Search",
    desc: "Browse verified CAs by location and specialization.",
    Icon: NumberCircleOneIcon,
    tint: "bg-primary-50",
  },
  {
    title: "Connect",
    desc: "Message and receive quick responses from experts.",
    Icon: NumberCircleTwoIcon,
    tint: "bg-accent-50",
  },
  {
    title: "Get It Done",
    desc: "Hire with confidence and track progress.",
    Icon: NumberCircleThreeIcon,
    tint: "bg-primary-50",
  },
];

export function HowItWorks() {
  return (
    <section aria-label='How It Works' className='py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl lg:text-3xl font-bold text-primary-900'>How It Works</h2>
          <p className='text-primary-800 mt-2'>Three simple steps to expert help.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {steps.map(({ title, desc, Icon, tint }, i) => (
            <AnimatedReveal key={title} delayMs={i * 90}>
              <Card
                variant='default'
                className={`rounded-2xl border-2 border-primary-100/60 ${tint} shadow-neumorphic-xl p-6 transition-transform hover:-translate-y-1`}
              >
                <div className='flex items-center gap-3 mb-3'>
                  <div className='p-2 rounded-xl bg-white border border-primary-200/60 shadow-neumorphic-md'>
                    <Icon className='h-7 w-7 text-primary-700' weight='fill' />
                  </div>
                  <h3 className='text-lg font-semibold text-primary-900'>{title}</h3>
                </div>
                <p className='text-primary-800'>{desc}</p>
              </Card>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
