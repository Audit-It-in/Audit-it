"use client";

import React from "react";

interface ChipSkeletonProps {
  width?: string;
}

export const ChipSkeleton: React.FC<ChipSkeletonProps> = ({ width = "6rem" }) => {
  return <div className='h-6 rounded-full shadow-neumorphic-inset bg-neutral-100 animate-pulse' style={{ width }} />;
};
