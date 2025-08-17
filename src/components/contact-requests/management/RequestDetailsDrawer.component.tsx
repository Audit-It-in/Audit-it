"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import type { ContactRequestDetails } from "@/src/types/contact-request.type";

interface Props {
  open: boolean;
  onClose: () => void;
  request?: ContactRequestDetails | null;
}

export const RequestDetailsDrawer: React.FC<Props> = ({ open, onClose, request }) => {
  if (!open || !request) return null;
  return (
    <div className='fixed inset-0 z-[70]'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='absolute right-0 top-0 h-full w-full max-w-xl p-4'>
        <Card className='h-full p-6 rounded-l-2xl shadow-neumorphic-xl border-2 bg-white overflow-y-auto'>
          <div className='flex items-start justify-between gap-3 mb-4'>
            <h3 className='text-lg font-bold'>Request Details</h3>
            <button onClick={onClose} className='px-3 py-1 rounded-lg shadow-neumorphic-inset border'>
              Close
            </button>
          </div>
          <div className='space-y-3 text-sm'>
            <div>
              <span className='font-semibold'>Subject:</span> {request.subject}
            </div>
            <div>
              <span className='font-semibold'>Message:</span> {request.message}
            </div>
            <div>
              <span className='font-semibold'>Urgency:</span> {request.urgency}
            </div>
            <div>
              <span className='font-semibold'>Status:</span> {request.status}
            </div>
            <div>
              <span className='font-semibold'>Customer:</span> {request.customer_name} ({request.customer_email})
            </div>
            {request.customer_phone && (
              <div>
                <span className='font-semibold'>Phone:</span> {request.customer_phone}
              </div>
            )}
            <div>
              <span className='font-semibold'>Location:</span>{" "}
              {[request.location_city, request.location_state].filter(Boolean).join(", ")}
            </div>
            {request.service_specialization_names?.length ? (
              <div>
                <span className='font-semibold'>Service:</span> {request.service_specialization_names.join(", ")}
              </div>
            ) : null}
            <div>
              <span className='font-semibold'>Created:</span> {new Date(request.created_at).toLocaleString()}
            </div>
            <div>
              <span className='font-semibold'>Updated:</span> {new Date(request.updated_at).toLocaleString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
