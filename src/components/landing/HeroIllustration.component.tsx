"use client";

import { cn } from "@/src/helpers/tailwind.helper";

interface HeroIllustrationProps {
  className?: string;
}

export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-md md:max-w-lg", className)}>
      <div className='rounded-2xl border-2 border-primary-100/60 bg-white shadow-neumorphic-lg p-4 md:p-6 neumorphic-optimized'>
        <div className='relative aspect-[4/3] w-full flex items-center justify-center'>
          <svg
            role='img'
            aria-label='Complete CA journey: Search, Connect, Get Expert Services'
            viewBox='0 0 480 360'
            className='w-full h-full'
          >
            {/* Phone/App mockup with search */}
            <g className='animate-reveal-up' style={{ animationDelay: "40ms" }}>
              <rect x='48' y='56' width='120' height='200' rx='20' fill='#ffffff' stroke='#bfdbfe' strokeWidth='4' />
              <rect x='56' y='64' width='104' height='16' rx='8' fill='#dbeafe' />
              <rect x='64' y='88' width='88' height='12' rx='6' fill='#bfdbfe' />
              <circle cx='132' cy='94' r='8' fill='none' stroke='#2563eb' strokeWidth='3' />
              <line x1='136' y1='98' x2='142' y2='104' stroke='#2563eb' strokeWidth='3' />

              {/* Search results list */}
              <rect x='64' y='112' width='80' height='8' rx='4' fill='#93c5fd' />
              <rect x='64' y='124' width='72' height='8' rx='4' fill='#60a5fa' />
              <rect x='64' y='136' width='76' height='8' rx='4' fill='#3b82f6' />

              {/* Scanning animation */}
              <rect x='52' y='60' width='8' height='192' fill='#3b82f6' opacity='0.08' className='animate-scan-slow' />
            </g>

            {/* CA Profile with credentials */}
            <g className='animate-reveal-up' style={{ animationDelay: "120ms" }}>
              <rect x='200' y='40' width='200' height='120' rx='16' fill='#ecfdf5' stroke='#a7f3d0' strokeWidth='4' />

              {/* Profile photo */}
              <circle cx='230' cy='84' r='20' fill='#93c5fd' />
              <rect x='225' y='79' width='10' height='10' rx='2' fill='#ffffff' />

              {/* Name & details */}
              <rect x='260' y='70' width='80' height='10' rx='5' fill='#1e40af' />
              <rect x='260' y='84' width='64' height='8' rx='4' fill='#60a5fa' />
              <rect x='260' y='96' width='72' height='8' rx='4' fill='#93c5fd' />

              {/* Credentials */}
              <rect x='220' y='116' width='60' height='12' rx='6' fill='#10b981' />
              <rect x='288' y='116' width='48' height='12' rx='6' fill='#34d399' />

              {/* Verified badge with animation */}
              <g className='will-change-transform animate-float-slow' style={{ animationDuration: "6s" }}>
                <circle cx='380' cy='64' r='16' fill='#10b981' stroke='#059669' strokeWidth='3' />
                <path d='M372 64l6 6 12-12' stroke='#ffffff' strokeWidth='4' fill='none' strokeLinecap='round' />
              </g>

              {/* Specializations */}
              <rect x='220' y='136' width='32' height='8' rx='4' fill='#a78bfa' />
              <rect x='256' y='136' width='28' height='8' rx='4' fill='#f472b6' />
              <rect x='288' y='136' width='36' height='8' rx='4' fill='#fb7185' />
            </g>

            {/* Connection line with data flow */}
            <g className='animate-reveal-up' style={{ animationDelay: "180ms" }}>
              <path
                d='M168 140c32 8 64 4 84 -20'
                stroke='#2563eb'
                strokeWidth='3'
                fill='none'
                strokeDasharray='4,4'
                className='animate-scan-slow'
              />
              <circle cx='226' cy='108' r='6' fill='#3b82f6' className='animate-sparkle' />
            </g>

            {/* Services dashboard */}
            <g className='animate-reveal-up' style={{ animationDelay: "220ms" }}>
              <rect x='60' y='200' width='180' height='120' rx='16' fill='#ffffff' stroke='#bfdbfe' strokeWidth='4' />

              {/* Service icons */}
              <circle cx='88' cy='228' r='12' fill='#dbeafe' />
              <text x='88' y='233' textAnchor='middle' fontSize='12' fontWeight='bold' fill='#2563eb'>
                T
              </text>

              <circle cx='128' cy='228' r='12' fill='#f0fdf4' />
              <text x='128' y='233' textAnchor='middle' fontSize='12' fontWeight='bold' fill='#16a34a'>
                G
              </text>

              <circle cx='168' cy='228' r='12' fill='#fef3c7' />
              <text x='168' y='233' textAnchor='middle' fontSize='12' fontWeight='bold' fill='#d97706'>
                A
              </text>

              <circle cx='208' cy='228' r='12' fill='#fce7f3' />
              <text x='208' y='233' textAnchor='middle' fontSize='12' fontWeight='bold' fill='#be185d'>
                C
              </text>

              {/* Service labels */}
              <text x='88' y='256' textAnchor='middle' fontSize='10' fill='#4b5563'>
                Tax
              </text>
              <text x='128' y='256' textAnchor='middle' fontSize='10' fill='#4b5563'>
                GST
              </text>
              <text x='168' y='256' textAnchor='middle' fontSize='10' fill='#4b5563'>
                Audit
              </text>
              <text x='208' y='256' textAnchor='middle' fontSize='10' fill='#4b5563'>
                Comply
              </text>

              {/* Progress bars */}
              <rect
                x='80'
                y='268'
                width='40'
                height='6'
                rx='3'
                fill='#1d4ed8'
                className='origin-left animate-bar-grow'
              />
              <rect
                x='80'
                y='280'
                width='64'
                height='6'
                rx='3'
                fill='#60a5fa'
                className='origin-left animate-bar-grow'
                style={{ animationDelay: "200ms" }}
              />
              <rect
                x='80'
                y='292'
                width='52'
                height='6'
                rx='3'
                fill='#93c5fd'
                className='origin-left animate-bar-grow'
                style={{ animationDelay: "400ms" }}
              />
            </g>

            {/* Quote/Invoice card */}
            <g className='animate-reveal-up' style={{ animationDelay: "260ms" }}>
              <rect x='280' y='200' width='160' height='120' rx='16' fill='#ffffff' stroke='#a7f3d0' strokeWidth='4' />

              {/* Header */}
              <rect x='300' y='220' width='60' height='10' rx='5' fill='#1d4ed8' />
              <rect x='368' y='220' width='32' height='10' rx='5' fill='#10b981' />

              {/* Line items */}
              <rect x='300' y='240' width='80' height='6' rx='3' fill='#60a5fa' />
              <rect x='388' y='240' width='24' height='6' rx='3' fill='#93c5fd' />

              <rect x='300' y='252' width='72' height='6' rx='3' fill='#60a5fa' />
              <rect x='388' y='252' width='20' height='6' rx='3' fill='#93c5fd' />

              <rect x='300' y='264' width='76' height='6' rx='3' fill='#60a5fa' />
              <rect x='388' y='264' width='28' height='6' rx='3' fill='#93c5fd' />

              {/* Total */}
              <rect x='300' y='284' width='48' height='8' rx='4' fill='#1e40af' />
              <g className='will-change-transform animate-float-slow' style={{ animationDuration: "5s" }}>
                <circle cx='396' cy='288' r='16' fill='#34d399' stroke='#059669' strokeWidth='3' />
                <text x='396' y='294' textAnchor='middle' fontSize='16' fontWeight='bold' fill='#064e3b'>
                  ₹
                </text>
              </g>
            </g>

            {/* Floating elements */}
            <g>
              <circle cx='440' cy='80' r='4' fill='#3b82f6' className='animate-sparkle' />
              <rect
                x='20'
                y='160'
                width='8'
                height='8'
                rx='2'
                fill='#10b981'
                className='animate-sparkle'
                style={{ animationDelay: "300ms" }}
              />
              <circle
                cx='440'
                cy='280'
                r='3'
                fill='#2563eb'
                className='animate-sparkle'
                style={{ animationDelay: "600ms" }}
              />
              <rect
                x='40'
                y='320'
                width='6'
                height='6'
                rx='2'
                fill='#059669'
                className='animate-sparkle'
                style={{ animationDelay: "900ms" }}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
