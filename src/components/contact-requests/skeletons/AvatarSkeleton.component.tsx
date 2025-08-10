"use client";

import React from "react";

interface AvatarSkeletonProps {
  size?: number;
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({ size = 64 }) => {
  const dimension = `${size}px`;
  return (
    <div
      className='rounded-full shadow-neumorphic-sm animate-pulse bg-gradient-to-br from-neutral-200 to-neutral-100'
      style={{ width: dimension, height: dimension }}
    />
  );
};
