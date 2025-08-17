"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";

export const RequestsListSkeleton: React.FC = () => {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className='h-20 rounded-2xl border-2 shadow-neumorphic-lg bg-white animate-pulse' />
      ))}
    </div>
  );
};
