"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/src/components/ui/button";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";

interface LoadMoreTriggerProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const LoadMoreTrigger: React.FC<LoadMoreTriggerProps> = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rootMargin = "120px",
}) => {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!hasNextPage) return null;

  return (
    <div ref={ref} className='flex justify-center py-8'>
      {isFetchingNextPage ? (
        <div className='flex items-center gap-2 text-neutral-600'>
          <InlineLoader action={LoadingAction.LOADING} size={SpinnerSize.SMALL} />
          <span className='text-sm'>Loading more accountants...</span>
        </div>
      ) : (
        <Button
          variant='outline'
          onClick={onLoadMore}
          className='gap-2 shadow-neumorphic-sm hover:shadow-neumorphic-md'
        >
          Load More Accountants
        </Button>
      )}
    </div>
  );
};
