import type { Metadata } from "next";
import { Suspense } from "react";
import { APP_CONFIG } from "@/src/constants/app.constants";

export const metadata: Metadata = {
  robots: (() => {
    const isProd = APP_CONFIG.url.includes("auditit.in");
    return { index: isProd, follow: isProd } as const;
  })(),
};

import { LandingHero } from "@/src/components/landing/LandingHero.component";
import { ServicesRail } from "@/src/components/landing/ServicesRail.component";
import { HowItWorks } from "@/src/components/landing/HowItWorks.component";
import { BottomCTA } from "@/src/components/landing/BottomCTA.component";

export default function HomePage() {
  return (
    <div className='min-h-screen bg-primary-50'>
      <main>
        <Suspense fallback={null}>
          <LandingHero />
        </Suspense>
        <Suspense fallback={null}>
          <ServicesRail />
        </Suspense>
        <HowItWorks />
        <BottomCTA />
      </main>
    </div>
  );
}
