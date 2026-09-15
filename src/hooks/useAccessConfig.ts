import { useQuery } from "@tanstack/react-query";

interface AccessConfig {
  isInternal: boolean;
}

// 公司對外的固定 IP。從這些 IP 連進來才可能看到內部工具。
const INTERNAL_PUBLIC_IPS: string[] = [
  "60.250.135.18",
  "60.250.134.87",
  "60.250.133.153",
  "60.248.31.111",
  "203.69.6.99",
  "211.72.195.139",
];

// 內部公告用的解鎖連結：.../?internal=udn2026
// 點過一次就記在該瀏覽器，之後開一般網址即可。
const UNLOCK_TOKEN = "udn2026";
// github.io 的所有 repo 共用同一個 origin，key 必須加上專案前綴避免撞名
const UNLOCK_STORAGE_KEY = "ai-treasure-chest:internal-access";

// 走過解鎖連結的瀏覽器才算數，單靠對外 IP 不足以解鎖
const hasUnlocked = (): boolean => {
  try {
    if (new URLSearchParams(window.location.search).get("internal") === UNLOCK_TOKEN) {
      localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
      return true;
    }
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const useAccessConfig = () => {
  return useQuery<AccessConfig>({
    queryKey: ["accessConfig"],
    queryFn: async () => {
      if (!hasUnlocked()) return { isInternal: false };

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
