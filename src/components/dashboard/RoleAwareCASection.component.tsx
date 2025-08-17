"use client";

import React from "react";
import ContactRequestsSummaryCard from "@/src/components/dashboard/ContactRequestsSummaryCard.component";
import RequestsPreviewList from "@/src/components/dashboard/RequestsPreviewList.component";
import { useContactRequestsByCA, useContactRequestStatsRPC } from "@/src/services/contact-requests.service";
import type { PaginationParams } from "@/src/types/contact-request.type";

interface RoleAwareCASectionProps {
  profileId: string;
}

export default function RoleAwareCASection({ profileId }: RoleAwareCASectionProps) {
  const pagination: PaginationParams = { page: 1, limit: 5 };

  const { data: stats } = useContactRequestStatsRPC(profileId);
  const { data: preview } = useContactRequestsByCA(profileId, {}, pagination);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      <ContactRequestsSummaryCard
        total={stats?.totalRequests || 0}
        newCount={stats?.newRequests || 0}
        replied={stats?.repliedRequests || 0}
        closed={stats?.closedRequests || 0}
        responseRate={stats?.responseRate || 0}
        averageResponseTimeHours={stats?.averageResponseTime || 0}
      />

      <RequestsPreviewList
        title='Recent Inbound Requests'
        items={preview?.data || []}
        emptyMessage='No recent requests.'
        onViewAll={() => {
          window.location.assign("/dashboard/contact-requests");
        }}
      />
    </div>
  );
}


