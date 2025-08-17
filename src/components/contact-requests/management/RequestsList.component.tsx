"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import type { ContactRequestDetails } from "@/src/types/contact-request.type";

interface RequestsListProps {
  role?: "ca" | "customer";
  loading: boolean;
  data: ContactRequestDetails[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  onSelect?: (r: ContactRequestDetails) => void;
}

export const RequestsList: React.FC<RequestsListProps> = ({ loading, data, total, page, onPageChange, onSelect }) => {
  const totalPages = Math.max(1, Math.ceil(total / 10));

  if (loading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className='p-4 rounded-2xl border-2 shadow-neumorphic-lg bg-white h-20 animate-pulse' />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <Card className='p-8 rounded-2xl border-2 shadow-neumorphic-lg bg-white text-center text-neutral-700'>
        No contact requests yet.
      </Card>
    );
  }

  return (
    <div className='space-y-3'>
      {data.map((r) => (
        <Card key={r.id} className='p-4 rounded-2xl border-2 shadow-neumorphic-lg bg-white'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='text-xs text-neutral-500'>{new Date(r.created_at).toLocaleString()}</div>
              <div className='font-semibold text-neutral-900 truncate'>{r.subject}</div>
              <div className='text-sm text-neutral-700 line-clamp-2'>{r.message}</div>
            </div>
            <div className='text-right text-sm'>
              <div className='px-2 py-1 rounded-lg shadow-neumorphic-inset border inline-block mb-1'>{r.urgency}</div>
              <div className='px-2 py-1 rounded-lg shadow-neumorphic-inset border inline-block'>{r.status}</div>
            </div>
          </div>
          <div className='flex items-center justify-end gap-2 mt-3'>
            <Button variant='outline' size='sm' onClick={() => onSelect?.(r)}>
              View Details
            </Button>
          </div>
        </Card>
      ))}

      <div className='flex items-center justify-center gap-3 pt-4'>
        <Button variant='outline' disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </Button>
        <div className='text-sm text-neutral-700'>
          Page {page} of {totalPages}
        </div>
        <Button variant='outline' disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};
