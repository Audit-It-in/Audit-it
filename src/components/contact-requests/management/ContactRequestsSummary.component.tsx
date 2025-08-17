"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";
import { useContactRequestStatsRPC } from "@/src/services/contact-requests.service";

export const ContactRequestsSummary: React.FC<{ caProfileId: string }> = ({ caProfileId }) => {
  const { data } = useContactRequestStatsRPC(caProfileId);
  return (
    <Card className={cn("p-4 rounded-2xl border-2", "shadow-neumorphic-lg bg-white")}>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'>
        {[
          { label: "Total", value: data?.totalRequests ?? 0 },
          { label: "New", value: data?.newRequests ?? 0 },
          { label: "Replied", value: data?.repliedRequests ?? 0 },
          { label: "Closed", value: data?.closedRequests ?? 0 },
          { label: "Response %", value: `${Math.round(data?.responseRate ?? 0)}%` },
          { label: "Avg Resp (h)", value: `${Math.round(data?.averageResponseTime ?? 0)}` },
        ].map((m) => (
          <div key={m.label} className='text-center p-3 rounded-xl shadow-neumorphic-inset bg-neutral-50 border'>
            <div className='text-xs text-neutral-600'>{m.label}</div>
            <div className='text-lg font-bold text-neutral-900'>{m.value as React.ReactNode}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
