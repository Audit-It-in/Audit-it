"use client";

import { format, parse, isValid } from "date-fns";

/**
 * Converts a JS Date to ISO local date string (yyyy-MM-dd).
 */
export function dateToIso(date: Date): string {
  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

/**
 * Parses an ISO local date string (yyyy-MM-dd) to Date.
 */
export function isoToDate(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : undefined;
}

/**
 * Formats an ISO date (yyyy-MM-dd) to dd/MM/yyyy for display.
 */
export function formatIsoToDisplay(iso: string | null | undefined): string {
  const d = isoToDate(iso);
  if (!d) return "";
  try {
    return format(d, "dd/MM/yyyy");
  } catch {
    return "";
  }
}

/**
 * Parses a dd/MM/yyyy display string to ISO (yyyy-MM-dd).
 */
export function parseDisplayToIso(display: string | null | undefined): string {
  if (!display) return "";
  const d = parse(display, "dd/MM/yyyy", new Date());
  return isValid(d) ? dateToIso(d) : "";
}
