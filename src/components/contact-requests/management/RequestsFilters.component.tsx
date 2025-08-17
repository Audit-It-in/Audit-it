"use client";

import React from "react";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { CheckboxGroup } from "@/src/components/ui/checkbox-group";
import { cn } from "@/src/helpers/tailwind.helper";
import {
  ContactRequestFilters,
  ContactRequestSortOption,
  SortOrder,
  ContactRequestStatus,
  UrgencyLevel,
} from "@/src/types/contact-request.type";
import { useSpecializations } from "@/src/services/profile.service";

interface RequestsFiltersProps {
  value: ContactRequestFilters;
  onChange: (next: ContactRequestFilters) => void;
  className?: string;
}

export const RequestsFilters: React.FC<RequestsFiltersProps> = ({ value, onChange, className }) => {
  const { data: specs = [] } = useSpecializations();
  const [search, setSearch] = React.useState(value.searchQuery || "");

  const set = (patch: Partial<ContactRequestFilters>) => onChange({ ...value, ...patch });

  return (
    <Card
      className={cn("p-4 rounded-2xl border-2", "shadow-neumorphic-lg bg-white transition-all duration-300", className)}
    >
      <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Search</label>
          <Input
            placeholder='Search subject, message, name'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && set({ searchQuery: search })}
            className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Status</label>
          <CheckboxGroup
            items={[
              { id: "s-new", label: ContactRequestStatus.NEW, value: ContactRequestStatus.NEW },
              { id: "s-replied", label: ContactRequestStatus.REPLIED, value: ContactRequestStatus.REPLIED },
              { id: "s-closed", label: ContactRequestStatus.CLOSED, value: ContactRequestStatus.CLOSED },
            ]}
            value={(value.status as string[]) || []}
            onChange={(v) => set({ status: v as ContactRequestStatus[] })}
            className='flex flex-wrap gap-2'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Urgency</label>
          <CheckboxGroup
            items={[
              { id: "u-low", label: UrgencyLevel.LOW, value: UrgencyLevel.LOW },
              { id: "u-medium", label: UrgencyLevel.MEDIUM, value: UrgencyLevel.MEDIUM },
              { id: "u-high", label: UrgencyLevel.HIGH, value: UrgencyLevel.HIGH },
              { id: "u-urgent", label: UrgencyLevel.URGENT, value: UrgencyLevel.URGENT },
            ]}
            value={(value.urgency as string[]) || []}
            onChange={(v) => set({ urgency: v as UrgencyLevel[] })}
            className='flex flex-wrap gap-2'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Service Type</label>
          <Select
            onValueChange={(v) => set({ serviceType: v ? [v] : [] })}
            value={(value.serviceType && value.serviceType[0]) || ""}
          >
            <SelectTrigger className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
              <SelectValue placeholder='All services' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All</SelectItem>
              {specs.map((s) => (
                <SelectItem key={s.code} value={s.code}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 items-end'>
        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Sort By</label>
          <Select
            value={value.sortBy || ContactRequestSortOption.CREATED_DATE}
            onValueChange={(v) => set({ sortBy: v as ContactRequestSortOption })}
          >
            <SelectTrigger className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ContactRequestSortOption).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Order</label>
          <Select value={value.sortOrder || SortOrder.DESC} onValueChange={(v) => set({ sortOrder: v as SortOrder })}>
            <SelectTrigger className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOrder.DESC}>Desc</SelectItem>
              <SelectItem value={SortOrder.ASC}>Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-semibold text-neutral-700'>Actions</label>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => set({ searchQuery: search })} className='shadow-neumorphic-sm'>
              Apply
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                setSearch("");
                onChange({ sortBy: ContactRequestSortOption.CREATED_DATE, sortOrder: SortOrder.DESC });
              }}
              className='shadow-neumorphic-sm'
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
