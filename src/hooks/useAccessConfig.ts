import { useQuery } from "@tanstack/react-query";

interface AccessConfig {
  isInternal: boolean;
}

// 公司對外的固定 IP。從這些 IP 連進來才看得到內部工具。
const INTERNAL_PUBLIC_IPS: string[] = [
  "60.250.135.18",
  "60.250.134.87",
  "60.250.133.153",
  "60.248.31.111",
  "203.69.6.99",
  "211.72.195.139",
];

export const useAccessConfig = () => {
  return useQuery<AccessConfig>({
    queryKey: ["accessConfig"],
    queryFn: async () => {
      // 查不到對外 IP 時一律當作外網，避免誤露內部工具
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (!res.ok) return { isInternal: false };

        const body: unknown = await res.json();
        const ip =
          typeof body === "object" && body !== null && "ip" in body
            ? (body as { ip: unknown }).ip
            : null;

        if (typeof ip !== "string") return { isInternal: false };
        return { isInternal: INTERNAL_PUBLIC_IPS.includes(ip) };
      } catch {
        return { isInternal: false };
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
