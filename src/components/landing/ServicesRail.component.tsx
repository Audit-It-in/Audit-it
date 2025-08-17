"use client";

import type React from "react";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReceiptIcon, BarcodeIcon, ClipboardTextIcon, BuildingsIcon } from "@phosphor-icons/react";
import { AnimatedReveal } from "@/src/components/landing/AnimatedReveal.component";
import { IconBadge } from "@/src/components/ui/icon-badge";
import type { IconBadgeProps } from "@/src/components/ui/icon-badge";
import { encodeFiltersToQuery } from "@/src/helpers/search-url.helper";
import { useTelemetry } from "@/src/hooks/useTelemetry";

type PopularService = {
  title: string;
  slug: string;
  Icon: IconBadgeProps["icon"];
  description?: string;
};

const popularServices: ReadonlyArray<PopularService> = [
  { title: "Tax Filing", slug: "tax-filing", Icon: ReceiptIcon, description: "ITR filing and advisory" },
  { title: "GST Services", slug: "gst-services", Icon: BarcodeIcon, description: "Registration, returns, audits" },
  { title: "Audit Services", slug: "audit", Icon: ClipboardTextIcon, description: "Statutory and internal" },
  { title: "Business Setup", slug: "business-setup", Icon: BuildingsIcon, description: "Incorporation and compliance" },
];

export function ServicesRail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useTelemetry();

  const navigateToService = useCallback(
    (slug: string) => {
      track("popular_services_click", { serviceSlug: slug });
      const current = new URLSearchParams(searchParams?.toString());
      const params = encodeFiltersToQuery({ specializations: [slug] });

      ["district", "specializations", "languages"].forEach((k) => current.delete(k));
      params.forEach((v, k) => current.set(k, v));

      const query = current.toString();
      router.push(query ? `/accountants?${query}` : "/accountants");
    },
    [router, searchParams, track]
  );

  return (
    <section role='region' aria-label='Popular services' className='py-4'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-6 sm:mb-8'>
          <h2 className='text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary-900'>Popular Services</h2>
          <p className='text-sm sm:text-base text-primary-800 mt-2'>Everything you need — fast, focused, near you.</p>
        </div>

        {/* XS: horizontal scroll-snap rail */}
        <div className='sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory' aria-hidden={false}>
          <div className='flex gap-3 py-1'>
            {popularServices.map(({ title, Icon, slug, description }, idx) => (
              <AnimatedReveal key={slug} delayMs={idx * 80}>
                <div className='snap-center shrink-0 w-[78vw] min-w-[260px] max-w-xs'>
                  <button
                    type='button'
                    aria-label={`Find accountants for ${title}`}
                    onClick={() => navigateToService(slug)}
                    className='w-full text-left px-4 py-3 rounded-xl shadow-neumorphic-md bg-white border-2 border-primary-200/60 transition-all duration-300 hover:shadow-neumorphic-lg active:shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary-500'
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <IconBadge variant='default' size='default' icon={Icon} />
                      <h3 className='text-sm font-semibold text-primary-900'>{title}</h3>
                    </div>
                    {description ? <p className='text-xs text-primary-700 line-clamp-2'>{description}</p> : null}
                  </button>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>

        {/* sm+ : responsive grid */}
        <div className='hidden sm:grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 sm:gap-4'>
          {popularServices.map(({ title, Icon, slug, description }, idx) => (
            <AnimatedReveal key={slug} delayMs={idx * 80}>
              <button
                type='button'
                aria-label={`Find accountants for ${title}`}
                onClick={() => navigateToService(slug)}
                className='w-full h-full text-left px-4 py-3 rounded-xl shadow-neumorphic-md bg-white border-2 border-primary-200/60 transition-all duration-300 hover:shadow-neumorphic-lg active:shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <div className='flex items-center gap-3 mb-2'>
                  <IconBadge variant='default' size='default' icon={Icon} />
                  <h3 className='text-sm sm:text-base font-semibold text-primary-900'>{title}</h3>
                </div>
                {description ? <p className='text-xs sm:text-sm text-primary-700 line-clamp-2'>{description}</p> : null}
              </button>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
