import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { UsernameAvailability } from "@/src/types/profile.type";
import { useUsernameAvailability } from "@/src/services/profile.service";

interface UseDebouncedUsernameAvailabilityOptions {
  username: string | undefined;
  stateId: number | undefined;
  districtId: number | undefined;
  excludeUserId?: string;
  enabled?: boolean;
  delayMs?: number;
}

interface UseDebouncedUsernameAvailabilityResult {
  isChecking: boolean;
  result: UsernameAvailability | null;
  checkNow: () => Promise<UsernameAvailability>;
}

export function useDebouncedUsernameAvailability(
  options: UseDebouncedUsernameAvailabilityOptions
): UseDebouncedUsernameAvailabilityResult {
  const { username, stateId, districtId, excludeUserId, enabled = true, delayMs = 800 } = options;

  const mutation = useUsernameAvailability();
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<UsernameAvailability | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);

  const canCheck = useMemo(() => {
    return (
      enabled === true &&
      !!username &&
      username.length >= 3 &&
      !!stateId &&
      stateId > 0 &&
      !!districtId &&
      districtId > 0
    );
  }, [username, stateId, districtId, enabled]);

  const doCheck = useCallback(async (): Promise<UsernameAvailability> => {
    const currentId = ++reqIdRef.current;
    setIsChecking(true);
    try {
      const res = await mutation.mutateAsync({
        username: username ?? "",
        stateId: stateId ?? 0,
        districtId: districtId ?? 0,
        excludeUserId,
      });
      if (reqIdRef.current === currentId) {
        setResult(res);
      }
      return res;
    } finally {
      if (reqIdRef.current === currentId) {
        setIsChecking(false);
      }
    }
  }, [mutation, username, stateId, districtId, excludeUserId]);

  const checkNow = useCallback(async () => {
    // Cancel pending debounce
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    return doCheck();
  }, [doCheck]);

  useEffect(() => {
    // Reset state when inputs change
    setResult(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!canCheck) {
      setIsChecking(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      void doCheck();
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [canCheck, doCheck, delayMs, username, stateId, districtId]);

  return { isChecking, result, checkNow };
}
