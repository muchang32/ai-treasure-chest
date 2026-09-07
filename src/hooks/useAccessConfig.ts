import { useQuery } from "@tanstack/react-query";

interface AccessConfig {
  isInternal: boolean;
}

export const useAccessConfig = () => {
  return useQuery<AccessConfig>({
    queryKey: ["accessConfig"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/config");
        if (!res.ok) return { isInternal: false };
        return (await res.json()) as AccessConfig;
      } catch {
        // No /api/config endpoint (e.g. GitHub Pages) → external-only view
        return { isInternal: false };
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
