"use client";

import React from "react";
import { Badge } from "@/src/components/ui/badge";

interface DashboardHeaderProps {
  appName: string;
  name: string;
}

export function DashboardHeader({ appName, name }: DashboardHeaderProps) {
  return (
    <div className='mb-8'>
      <Badge className='mb-4'>Welcome to {appName}</Badge>
      <h1 className='text-3xl font-bold text-neutral-900 mb-2'>Welcome back, {name}!</h1>
      <p className='text-lg text-neutral-600'>Great to see you again. Here&apos;s your dashboard overview.</p>
    </div>
  );
}

export default DashboardHeader;
