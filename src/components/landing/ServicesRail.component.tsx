"use client";

import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ReceiptIcon, BarcodeIcon, ClipboardTextIcon, BuildingsIcon } from "@phosphor-icons/react";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";

const services = [
  { label: "Tax Filing", href: "/accountants", Icon: ReceiptIcon },
  { label: "GST Services", href: "/accountants", Icon: BarcodeIcon },
  { label: "Audit Services", href: "/accountants", Icon: ClipboardTextIcon },
  { label: "Business Setup", href: "/accountants", Icon: BuildingsIcon },
];

export function ServicesRail() {
  return (
    <section aria-label='Services' className='py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl lg:text-3xl font-bold text-primary-900'>Popular Services</h2>
          <p className='text-primary-800 mt-2'>Everything you need — fast, focused, near you.</p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {services.map(({ label, href, Icon }, idx) => (
            <AnimatedReveal key={label} delayMs={idx * 80}>
              <Card
                variant='default'
                className='rounded-2xl border-2 border-primary-100/60 bg-primary-50 shadow-neumorphic-xl transition-transform duration-300 hover:-translate-y-1 hover:rotate-[0.25deg] p-6 group'
              >
                <div className='flex items-center gap-3 mb-4'>
                  <div className='p-3 rounded-xl bg-white border border-primary-200/60 shadow-neumorphic-md group-hover:scale-105 transition-transform'>
                    <Icon className='h-6 w-6 text-primary-700' weight='bold' />
                  </div>
                  <h3 className='text-lg font-semibold text-primary-900'>{label}</h3>
                </div>
                <Link href={href}>
                  <Button variant='ghost' className='min-h-[44px]'>
                    Explore
                  </Button>
                </Link>
              </Card>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
