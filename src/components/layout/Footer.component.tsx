"use client";

import Link from "next/link";
import { APP_CONFIG } from "@/src/constants/app.constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-neutral-900 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='py-12 grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='md:col-span-1'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600'>
                <span className='text-sm font-bold text-white'>TF</span>
              </div>
              <div>
                <h3 className='text-lg font-bold'>{APP_CONFIG.name}</h3>
                <p className='text-sm text-neutral-400'>{APP_CONFIG.tagline}</p>
              </div>
            </div>
            <p className='text-sm text-neutral-300 leading-relaxed'>{APP_CONFIG.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-sm font-semibold text-white mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/accountants' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Find CAs
                </Link>
              </li>
              <li>
                <Link href='/services' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Services
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/contact' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For CAs */}
          <div>
            <h4 className='text-sm font-semibold text-white mb-4'>For CAs</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/accountant/register' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Join as CA
                </Link>
              </li>
              <li>
                <Link href='/accountant/dashboard' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  CA Dashboard
                </Link>
              </li>
              <li>
                <Link href='/accountant/pricing' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href='/accountant/help' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='text-sm font-semibold text-white mb-4'>Legal</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/privacy' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href='/disclaimer' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href='/refund' className='text-sm text-neutral-300 hover:text-white transition-colors'>
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-neutral-800 py-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0'>
            <p className='text-sm text-neutral-400'>
              © {currentYear} {APP_CONFIG.name}. All rights reserved.
            </p>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-neutral-400'>Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
