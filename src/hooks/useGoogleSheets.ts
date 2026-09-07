import { useQuery } from "@tanstack/react-query";

export interface InternalStep {
  title: string;
  desc: string;
}

export interface AITool {
  工具名稱: string;
  功能簡介: string;
  工具網址: string;
  標籤: string;
  工具分類: string[];
  開發國家?: string;
  備註?: string;
  付費使用?: string;
  支援繁體中文?: string;
  來源: "外部" | "內部";
  負責單位?: string;
  適用情境?: string[];
  操作步驟?: InternalStep[];
  使用限制?: string[];
}

const SHEET_ID = "1yhHwflK2OawWfslbaD_B7ncviMn3R-cu2Hb3ebLdyhY";
const GID = "825042355";

const FAKE_INTERNAL_TOOLS: AITool[] = [
  {
    工具名稱: "公文助理",
    功能簡介: "依選擇的公文類型，自動填入格式範本與文字，大幅縮短撰寫時間。",
    工具網址: "#",
    標籤: "自動化,文書處理",
    工具分類: ["文書處理"],
    來源: "內部",
    負責單位: "資訊處",
    適用情境: [
      "需要快速起草簽呈、函文或呈文時",
      "不熟悉公文格式的新進人員",
      "需要大量重複性公文的部門",
    ],
    操作步驟: [
      { title: "選擇公文類型", desc: "從下拉選單選擇簽、函、呈等公文類型。" },
      { title: "填入主旨與說明", desc: "輸入公文主旨，並在說明欄填入各段內容。" },
      { title: "產生與複製", desc: "點擊「產生公文」，系統自動套用格式，複製後貼入公文系統。" },
    ],
    使用限制: [
      "僅限內網使用，外網無法存取",
      "產生結果僅供參考，需由承辦人審核後送出",
    ],
  },
  {
    工具名稱: "資料彙整工具",
    功能簡介: "批次讀取多份 Excel 表格，依指定欄位自動彙整為統一格式報表，支援去重與加總。",
    工具網址: "#",
    標籤: "Excel,資料整理",
    工具分類: ["資料分析"],
    來源: "內部",
    負責單位: "企劃組",
    適用情境: [
      "每月需從各單位收集填報表格並彙整時",
      "需要跨檔案合併同格式資料時",
    ],
    操作步驟: [
      { title: "上傳檔案", desc: "將多份 Excel 拖曳上傳，支援 .xlsx / .csv 格式。" },
      { title: "設定彙整規則", desc: "指定 Key 欄位（如編號、日期），選擇彙整方式（疊加或加總）。" },
      { title: "下載報表", desc: "點擊「產生報表」，下載合併完成的 Excel 檔案。" },
    ],
    使用限制: [
      "單次最多上傳 20 份檔案，每份不超過 10MB",
      "中文欄位名稱須完全一致，否則無法對應",
    ],
  },
  {
    工具名稱: "會議紀錄助理",
    功能簡介: "上傳會議錄音或逐字稿，AI 自動整理為結構化會議紀錄，含決議事項與待辦追蹤。",
    工具網址: "#",
    標籤: "AI,會議,摘要",
    工具分類: ["文字生成"],
    來源: "內部",
    負責單位: "資訊處",
    適用情境: [
      "會後需快速產出會議紀錄時",
      "錄音檔需要轉成文字並分段整理時",
    ],
    操作步驟: [
      { title: "上傳素材", desc: "上傳 mp3/mp4 錄音檔或貼入逐字稿文字。" },
      { title: "設定輸出格式", desc: "選擇是否包含出席人員、決議追蹤、行動項目等欄位。" },
      { title: "審閱與匯出", desc: "預覽 AI 產生的紀錄，手動修改後匯出 Word 或複製文字。" },
    ],
    使用限制: [
      "錄音檔最長支援 2 小時",
      "內容涉及保密資訊請勿上傳，系統不加密儲存",
    ],
  },
];

export const useGoogleSheets = () => {
  return useQuery({
    queryKey: ["aiTools"],
    queryFn: async () => {
      try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const csvText = await response.text();
        const rows = parseCSV(csvText);

        if (rows.length < 2) return FAKE_INTERNAL_TOOLS;

        const headers = rows[0];
        const externalTools: AITool[] = rows
          .slice(1)
          .map(row => {
            const tool: Record<string, unknown> = {};
            headers.forEach((header, index) => {
              if (header === "工具分類") {
                tool[header] = row[index]
                  ? row[index].split(",").map((cat: string) => cat.trim()).filter(Boolean)
                  : [];
              } else {
                tool[header] = row[index] || "";
              }
            });
            tool["來源"] = "外部";
            return tool as AITool;
          })
          .filter(tool => tool.工具名稱);

        return [...FAKE_INTERNAL_TOOLS, ...externalTools];
      } catch (error) {
        console.error("Error fetching Google Sheets data:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      }
      if (char === "\r" && nextChar === "\n") i++;
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}
