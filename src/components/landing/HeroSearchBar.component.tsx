"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/helpers/tailwind.helper";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { useAllDistricts, useLanguages, useSpecializations } from "@/src/services/profile.service";

// Schema - removed state field
const heroSearchSchema = z.object({
  district: z.string().optional().nullable(),
  specializations: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

export type HeroSearchFormValues = z.input<typeof heroSearchSchema>;

export interface BasicOption {
  id: string;
  label: string;
  slug: string; // hyphenated, lowercase
  disabled?: boolean;
}

export interface HeroSearchBarProps {
  className?: string;
  defaultValues?: Partial<HeroSearchFormValues>;
  onSubmit?: (values: HeroSearchFormValues) => void;
}

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({ className, defaultValues, onSubmit }) => {
  const form = useForm<HeroSearchFormValues>({
    resolver: zodResolver(heroSearchSchema),
    defaultValues: {
      district: defaultValues?.district ?? null,
      specializations: defaultValues?.specializations ?? [],
      languages: defaultValues?.languages ?? [],
    },
    mode: "onChange",
  });

  // Async lookups
  const { data: languages = [] } = useLanguages();
  const [langQuery, setLangQuery] = React.useState("");
  const debouncedLangQuery = useDebouncedValue(langQuery, 275);

  const { data: specializations = [] } = useSpecializations();
  const [specQuery, setSpecQuery] = React.useState("");
  const debouncedSpecQuery = useDebouncedValue(specQuery, 275);

  // Map languages to select options
  const languageOptions: BasicOption[] = React.useMemo(
    () =>
      languages
        .filter((l) => l.name.toLowerCase().includes(debouncedLangQuery.toLowerCase()))
        .map((l) => ({ id: String(l.id), label: l.name, slug: l.name.toLowerCase().replace(/\s+/g, "-") })),
    [languages, debouncedLangQuery]
  );

  // Map specializations to select options
  const specializationOptions: BasicOption[] = React.useMemo(
    () =>
      specializations
        .filter((s) => s.name.toLowerCase().includes(debouncedSpecQuery.toLowerCase()))
        .map((s) => ({ id: String(s.id), label: s.name, slug: s.name.toLowerCase().replace(/\s+/g, "-") })),
    [specializations, debouncedSpecQuery]
  );

  // Get all districts from all states for the district dropdown
  const { data: districts = [] } = useAllDistricts();
  const [districtQuery, setDistrictQuery] = React.useState("");
  const debouncedDistrictQuery = useDebouncedValue(districtQuery, 275);
  const districtOptions: BasicOption[] = React.useMemo(
    () =>
      (districts || [])
        .filter((d) => d.name.toLowerCase().includes(debouncedDistrictQuery.toLowerCase()))
        .map((d) => ({ id: String(d.id), label: d.name, slug: d.name.toLowerCase().replace(/\s+/g, "-") })),
    [districts, debouncedDistrictQuery]
  );

  const handleSubmit = (values: HeroSearchFormValues) => {
    const sortedUnique = (arr: string[]) => Array.from(new Set(arr)).sort();
    const normalized: HeroSearchFormValues = {
      district: values.district || null,
      specializations: sortedUnique(values.specializations || []),
      languages: sortedUnique(values.languages || []),
    };
    onSubmit?.(normalized);
  };

  return (
    <Card
      variant='inset'
      className={cn(
        "rounded-2xl border-primary-100/60 bg-white shadow-neumorphic-inset p-3 md:p-4",
        "focus-within:shadow-neumorphic-primary-lg transition-neumorphic neumorphic-optimized",
        className
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-3'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
            {/* City/District (single) */}
            <FormField
              control={form.control}
              name='district'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/District</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <SelectTrigger className='h-11 rounded-xl border-2 border-primary-100 focus-visible:ring-4 focus-visible:ring-primary-300'>
                        <SelectValue placeholder='Select a city/district' />
                      </SelectTrigger>
                      <SelectContent>
                        <div className='p-2'>
                          <input
                            className='w-full rounded-md border px-2 py-1 text-sm'
                            placeholder='Type to filter...'
                            value={districtQuery}
                            onChange={(e) => setDistrictQuery(e.target.value)}
                          />
                        </div>
                        {districtOptions.length === 0 ? (
                          <SelectItem value='__none__' disabled>
                            No districts available
                          </SelectItem>
                        ) : (
                          districtOptions.map((d) => (
                            <SelectItem key={d.id} value={d.slug}>
                              {d.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specialisations (single select) */}
            <FormField
              control={form.control}
              name='specializations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialisations</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.[0] ?? undefined}
                      onValueChange={(value) => field.onChange(value ? [value] : [])}
                    >
                      <SelectTrigger className='h-11 rounded-xl border-2 border-primary-100 focus-visible:ring-4 focus-visible:ring-primary-300'>
                        <SelectValue placeholder='Select specialisation' />
                      </SelectTrigger>
                      <SelectContent>
                        <div className='p-2'>
                          <input
                            className='w-full rounded-md border px-2 py-1 text-sm'
                            placeholder='Type to filter...'
                            value={specQuery}
                            onChange={(e) => setSpecQuery(e.target.value)}
                          />
                        </div>
                        {specializationOptions.length === 0 ? (
                          <SelectItem value='__none__' disabled>
                            No specialisations available
                          </SelectItem>
                        ) : (
                          specializationOptions.map((s) => (
                            <SelectItem key={s.id} value={s.slug}>
                              {s.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Languages (single select) */}
            <FormField
              control={form.control}
              name='languages'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.[0] ?? undefined}
                      onValueChange={(value) => field.onChange(value ? [value] : [])}
                    >
                      <SelectTrigger className='h-11 rounded-xl border-2 border-primary-100 focus-visible:ring-4 focus-visible:ring-primary-300'>
                        <SelectValue placeholder='Select language' />
                      </SelectTrigger>
                      <SelectContent>
                        <div className='p-2'>
                          <input
                            className='w-full rounded-md border px-2 py-1 text-sm'
                            placeholder='Type to filter...'
                            value={langQuery}
                            onChange={(e) => setLangQuery(e.target.value)}
                          />
                        </div>
                        {languageOptions.length === 0 ? (
                          <SelectItem value='__none__' disabled>
                            No languages available
                          </SelectItem>
                        ) : (
                          languageOptions.map((l) => (
                            <SelectItem key={l.id} value={l.slug}>
                              {l.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              variant='primary'
              className='min-h-[44px] px-6 shadow-neumorphic-md hover:shadow-neumorphic-lg'
            >
              Search
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
