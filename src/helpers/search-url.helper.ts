export type SearchFilters = {
  district?: string | null;
  specializations?: string[];
  languages?: string[];
};

const toSortedUnique = (values?: string[]): string[] => {
  if (!values || values.length === 0) return [];
  return Array.from(new Set(values)).sort();
};

export function encodeFiltersToQuery(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();

  const district = filters.district?.trim();
  const specializations = toSortedUnique(filters.specializations);
  const languages = toSortedUnique(filters.languages);

  if (district) params.set("district", district);
  if (specializations.length > 0) params.set("specializations", specializations.join(","));
  if (languages.length > 0) params.set("languages", languages.join(","));

  return params;
}

export function parseFiltersFromQuery(search: string | URLSearchParams): Required<SearchFilters> {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;

  const getCsv = (key: string): string[] => {
    const raw = params.get(key) || "";
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .sort();
  };

  const district = (params.get("district") || "").trim() || null;
  const specializations = getCsv("specializations");
  const languages = getCsv("languages");

  return { district, specializations, languages };
}
