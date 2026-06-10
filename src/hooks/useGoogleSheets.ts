import { useQuery } from "@tanstack/react-query";

export interface AITool {
  工具名稱: string;
  功能簡介: string;
  工具網址: string;
  標籤: string;
  工具分類: string[];  // Changed to array to support multiple categories
  開發國家?: string;
  備註?: string;
  付費使用?: string;
  支援繁體中文?: string;
}

const SHEET_ID = "1yhHwflK2OawWfslbaD_B7ncviMn3R-cu2Hb3ebLdyhY";
const GID = "825042355"; // Sheet gid from URL

export const useGoogleSheets = () => {
  return useQuery({
    queryKey: ["aiTools"],
    queryFn: async () => {
      try {
        // Using Google Sheets public CSV export
        const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
        
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        
        if (rows.length < 2) return [];
        
        const headers = rows[0];
        const tools: AITool[] = rows.slice(1).map(row => {
          const tool: any = {};
          headers.forEach((header, index) => {
            if (header === '工具分類') {
              // Split categories by comma and trim whitespace
              tool[header] = row[index] ? row[index].split(',').map((cat: string) => cat.trim()).filter(Boolean) : [];
            } else {
              tool[header] = row[index] || "";
            }
          });
          return tool as AITool;
        }).filter(tool => tool.工具名稱); // Filter out empty rows
        
        return tools;
      } catch (error) {
        console.error("Error fetching Google Sheets data:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Simple CSV parser
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
