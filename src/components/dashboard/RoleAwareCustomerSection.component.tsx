"use client";

import React from "react";
import RequestsPreviewList from "@/src/components/dashboard/RequestsPreviewList.component";
import { useContactRequestsByCustomer } from "@/src/services/contact-requests.service";
import type { PaginationParams } from "@/src/types/contact-request.type";

interface RoleAwareCustomerSectionProps {
  profileId: string;
}

export default function RoleAwareCustomerSection({ profileId }: RoleAwareCustomerSectionProps) {
  const pagination: PaginationParams = { page: 1, limit: 5 };
  const { data: preview } = useContactRequestsByCustomer(profileId, {}, pagination);

  return (
    <div className='mb-8'>
      <RequestsPreviewList
        title='My Recent Requests'
        items={preview?.data || []}
        emptyMessage='You have not sent any requests yet.'
        onViewAll={() => {
          window.location.assign("/dashboard/contact-requests");
        }}
      />
    </div>
  );
}


