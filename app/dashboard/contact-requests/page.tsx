"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";
import { useContactRequestsByCA, useContactRequestsByCustomer } from "@/src/services/contact-requests.service";
import { ContactRequestFilters, SortOrder, ContactRequestSortOption } from "@/src/types/contact-request.type";
import { useContactRequestStatsRPC } from "@/src/services/contact-requests.service";
import { RequestsFilters } from "@/src/components/contact-requests/management/RequestsFilters.component";
import { RequestsList as RequestsListComponent } from "@/src/components/contact-requests/management/RequestsList.component";
import { RequestDetailsDrawer } from "@/src/components/contact-requests/management/RequestDetailsDrawer.component";
import type { ContactRequestDetails } from "@/src/types/contact-request.type";

// Lightweight inline filter state to unblock initial UI; full component added below
function useDefaultFilters(): ContactRequestFilters {
  return {
    sortBy: ContactRequestSortOption.CREATED_DATE,
    sortOrder: SortOrder.DESC,
  };
}

export default function ContactRequestsPage() {
  return (
    <Suspense
      fallback={
        <Loader action={LoadingAction.LOADING} title='Loading Contact Requests' subtitle='Preparing your workspace' />
      }
    >
      <ContactRequestsContent />
    </Suspense>
  );
}

function ContactRequestsContent() {
  const { profile, isAuthenticated, authLoading, isCA, isCustomer } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"ca" | "customer">("ca");
  const [filters, setFilters] = React.useState<ContactRequestFilters>(useDefaultFilters());
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/auth";
    }
  }, [authLoading, isAuthenticated]);

  React.useEffect(() => {
    if (isCA) setActiveTab("ca");
    else if (isCustomer) setActiveTab("customer");
  }, [isCA, isCustomer]);

  const caProfileId = profile?.id || "";
  const customerProfileId = profile?.id || "";

  const caQuery = useContactRequestsByCA(caProfileId, filters, { page, limit: 10 });
  const customerQuery = useContactRequestsByCustomer(customerProfileId, filters, { page, limit: 10 });
  const stats = useContactRequestStatsRPC(caProfileId);

  const showCA = isCA || (!isCustomer && isCA); // default to CA when only CA
  const showCustomer = isCustomer || (!isCA && isCustomer);

  const [selected, setSelected] = React.useState<ContactRequestDetails | null>(null);

  return (
    <div className='min-h-screen bg-neutral-50'>
      <main className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto space-y-6'>
          <div>
            <nav
              role='navigation'
              aria-label='Contact Requests navigation'
              className='mb-3 flex items-center space-x-2 p-2 rounded-lg shadow-neumorphic-inset bg-neutral-50/80 border border-primary-100/50'
            >
              <button
                onClick={() => router.back()}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200",
                  "shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset focus:shadow-neumorphic-focus",
                  "bg-white/80 text-primary-600 hover:text-primary-700 text-sm font-medium",
                  "min-h-[44px] transition-neumorphic"
                )}
                aria-label='Go back'
              >
                <ArrowLeftIcon className='h-3.5 w-3.5' weight='bold' />
                Back
              </button>
            </nav>
            <h1 className='text-2xl font-bold text-neutral-900 mb-2'>Contact Requests</h1>
            <p className='text-neutral-600'>View, filter and manage your conversations.</p>
          </div>

          <RequestsFilters
            value={filters}
            onChange={(f) => {
              setPage(1);
              setFilters(f);
            }}
          />

          {showCA && showCustomer && (
            <div className='flex items-center gap-3'>
              <button
                className={cn(
                  "px-3 py-1.5 rounded-xl border-2",
                  activeTab === "ca" ? "shadow-neumorphic-primary-xl" : "shadow-neumorphic-sm"
                )}
                onClick={() => setActiveTab("ca")}
              >
                CA
              </button>
              <button
                className={cn(
                  "px-3 py-1.5 rounded-xl border-2",
                  activeTab === "customer" ? "shadow-neumorphic-primary-xl" : "shadow-neumorphic-sm"
                )}
                onClick={() => setActiveTab("customer")}
              >
                Customer
              </button>
            </div>
          )}

          {showCA && activeTab === "ca" && (
            <div className='space-y-6'>
              {/* Analytics summary */}
              <Card className={cn("p-4 rounded-2xl border-2", "shadow-neumorphic-lg bg-white")}>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'>
                  {[
                    { label: "Total", value: stats.data?.totalRequests ?? 0 },
                    { label: "New", value: stats.data?.newRequests ?? 0 },
                    { label: "Replied", value: stats.data?.repliedRequests ?? 0 },
                    { label: "Closed", value: stats.data?.closedRequests ?? 0 },
                    { label: "Response %", value: `${Math.round(stats.data?.responseRate ?? 0)}%` },
                    { label: "Avg Resp (h)", value: `${Math.round(stats.data?.averageResponseTime ?? 0)}` },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className='text-center p-3 rounded-xl shadow-neumorphic-inset bg-neutral-50 border'
                    >
                      <div className='text-xs text-neutral-600'>{m.label}</div>
                      <div className='text-lg font-bold text-neutral-900'>{m.value as React.ReactNode}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* List */}
              <RequestsListComponent
                role='ca'
                loading={caQuery.isLoading}
                data={caQuery.data?.data || []}
                total={caQuery.data?.pagination.total || 0}
                page={page}
                onPageChange={setPage}
                onSelect={setSelected}
              />
            </div>
          )}

          {showCustomer && activeTab === "customer" && (
            <RequestsListComponent
              role='customer'
              loading={customerQuery.isLoading}
              data={customerQuery.data?.data || []}
              total={customerQuery.data?.pagination.total || 0}
              page={page}
              onPageChange={setPage}
              onSelect={setSelected}
            />
          )}
        </div>
      </main>
      <RequestDetailsDrawer open={!!selected} onClose={() => setSelected(null)} request={selected} />
    </div>
  );
}

// (inline RequestsList component removed; using dedicated component instead)
