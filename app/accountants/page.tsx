"use client";

import React, { Suspense } from "react";
import { AccountantDiscoveryPage } from "@/src/components/contact-requests/discovery/AccountantDiscoveryPage.component";
import { parseFiltersFromQuery } from "@/src/helpers/search-url.helper";
import { useSearchParams } from "next/navigation";
import { toSlug } from "@/src/helpers/slug.helper";
import { useLanguages, useSpecializations, useAllDistricts } from "@/src/services/profile.service";
import type { CADiscoveryFilters } from "@/src/types/contact-request.type";
import { Loader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";

function AccountantsPageContent() {
  const searchParams = useSearchParams();
  const { district, languages, specializations } = parseFiltersFromQuery(searchParams?.toString() || "");

  // Lookups to map slugs -> ids
  const { data: districts = [] } = useAllDistricts();
  const districtId = districts.find((d) => toSlug(d.name) === district || undefined)?.id;
  const selectedDistrict = districts.find((d) => d.id === districtId);
  const stateId = selectedDistrict?.state_id;

  const { data: langs = [] } = useLanguages();
  const languageIds = languages
    .map((slug) => langs.find((l) => toSlug(l.name) === slug)?.id)
    .filter((v): v is number => typeof v === "number");
  const { data: specs = [] } = useSpecializations();
  const specializationIds = specializations
    .map((slug) => specs.find((s) => toSlug(s.name) === slug)?.id)
    .filter((v): v is number => typeof v === "number");

  const initialFilters: CADiscoveryFilters = {
    location: { stateId, districtId },
    languages: languageIds.length ? languageIds : undefined,
    specializations: specializationIds.length ? specializationIds : undefined,
  };

  return <AccountantDiscoveryPage initialFilters={initialFilters} />;
}

export default function AccountantsPage() {
  return (
    <Suspense
      fallback={<Loader action={LoadingAction.LOADING} title='Loading Accountants' subtitle='Preparing results' />}
    >
      <AccountantsPageContent />
    </Suspense>
  );
}
