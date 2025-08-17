import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: (() => {
    const isProd = (process.env.NEXT_PUBLIC_APP_URL || "").includes("auditit.in");
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
        <LandingHero />
        <ServicesRail />
        <HowItWorks />
        <BottomCTA />
      </main>
    </div>
  );
}
