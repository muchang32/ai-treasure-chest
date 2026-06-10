import { 
  Sparkles, 
  Image, 
  FileText, 
  Video, 
  Mic, 
  Search,
  Presentation,
  Code,
  Zap,
  MessageSquare
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const categoryMap: Record<string, CategoryConfig> = {
  "圖片生成": { icon: Image, color: "#8b5cf6", bgColor: "#f3e8ff" },
  "影音生成": { icon: Video, color: "#ef4444", bgColor: "#fee2e2" },
  "會議與語音轉錄": { icon: Mic, color: "#10b981", bgColor: "#d1fae5" },
  "簡報生成": { icon: Presentation, color: "#f59e0b", bgColor: "#fef3c7" },
  "網頁、影片摘要": { icon: Search, color: "#14b8a6", bgColor: "#ccfbf1" },
  "程式開發": { icon: Code, color: "#6366f1", bgColor: "#e0e7ff" },
  "工作優化": { icon: Zap, color: "#f97316", bgColor: "#ffedd5" },
  "聊天機器人": { icon: MessageSquare, color: "#ec4899", bgColor: "#fce7f3" },
};

const defaultConfig: CategoryConfig = {
  icon: Sparkles,
  color: "#8b5cf6",
  bgColor: "#f3e8ff"
};

export const getCategoryConfig = (category: string): CategoryConfig => {
  return categoryMap[category] || defaultConfig;
};
