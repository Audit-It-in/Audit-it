"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/helpers/tailwind.helper";
import type { ContactRequestDetails } from "@/src/types/contact-request.type";

interface RequestsPreviewListProps {
  title: string;
  items: ContactRequestDetails[];
  onViewAll: () => void;
  emptyMessage: string;
}

export function RequestsPreviewList({ title, items, onViewAll, emptyMessage }: RequestsPreviewListProps) {
  return (
    <Card
      role='region'
      aria-label={title}
      className={cn(
        "relative overflow-hidden p-6 rounded-2xl",
        "shadow-neumorphic-xl hover:shadow-neumorphic-primary-xl",
        "border-2 border-primary-100/60 bg-white",
        "transition-all duration-500 neumorphic-optimized"
      )}
    >
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h3 className='text-lg font-bold text-primary-900'>{title}</h3>
        <Button variant='outline' className='border-2' onClick={onViewAll} aria-label='View all requests'>
          View All
        </Button>
      </div>

      {items.length === 0 ? (
        <div className='p-4 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-neutral-200/60 text-sm text-neutral-700'>
          {emptyMessage}
        </div>
      ) : (
        <ul role='list' className='space-y-3'>
          {items.slice(0, 5).map((item) => (
            <li
              key={item.id}
              role='listitem'
              className='p-4 rounded-xl shadow-neumorphic-md bg-white border-2 border-primary-100/60'
            >
              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='text-sm font-bold text-primary-900 truncate'>{item.subject}</div>
                  <div className='text-xs text-neutral-600'>{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
                <div className='text-xs text-neutral-700 truncate'>{item.message}</div>
                <div className='text-xs text-neutral-600'>{item.customer_name || item.ca_first_name || ""}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default RequestsPreviewList;
