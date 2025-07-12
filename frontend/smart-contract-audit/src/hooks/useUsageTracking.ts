import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getToday } from "@/utils/analysisUtils";

export const useUsageTracking = (maxUsage: number) => {
  const { isSignedIn, user } = useUser();
  const [usageCount, setUsageCount] = useState<number>(0);
  const [lastReset, setLastReset] = useState<string>("");

  useEffect(() => {
    if (isSignedIn && user) {
      const storageKey = `analysis_usage_${user.id}`;
      const dateKey = `analysis_usage_date_${user.id}`;
      const storedCount = localStorage.getItem(storageKey);
      const storedDate = localStorage.getItem(dateKey);
      const today = getToday();

      if (storedDate !== today) {
        localStorage.setItem(storageKey, "0");
        localStorage.setItem(dateKey, today);
        setUsageCount(0);
        setLastReset(today);
      } else {
        setUsageCount(storedCount ? parseInt(storedCount) : 0);
        setLastReset(storedDate || today);
      }
    }
  }, [isSignedIn, user]);

  const incrementUsage = () => {
    if (user) {
      const newUsageCount = usageCount + 1;
      setUsageCount(newUsageCount);
      const storageKey = `analysis_usage_${user.id}`;
      const dateKey = `analysis_usage_date_${user.id}`;
      const today = getToday();
      localStorage.setItem(storageKey, newUsageCount.toString());
      localStorage.setItem(dateKey, today);
      return newUsageCount;
    }
    return usageCount;
  };

  return {
    usageCount,
    lastReset,
    incrementUsage,
    hasReachedLimit: usageCount >= maxUsage,
    remainingUsage: Math.max(0, maxUsage - usageCount),
  };
};
