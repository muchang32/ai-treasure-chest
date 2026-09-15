import { useQuery } from "@tanstack/react-query";

interface AccessConfig {
  isInternal: boolean;
}

// 公司對外的固定 IP。從這些 IP 連進來才看得到內部工具。
const INTERNAL_PUBLIC_IPS: string[] = [
  "60.250.133.153",
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
