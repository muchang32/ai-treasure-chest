import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface ToolCardProps {
  tool: AITool;
  index: number;
}

const getMicrolinkScreenshotUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

export const ToolCard = ({ tool, index }: ToolCardProps) => {
  const [imgError, setImgError] = useState(false);
  const tags = tool.標籤 ? tool.標籤.split(",").map(t => t.trim()).filter(Boolean) : [];
  const primaryCategory = tool.工具分類[0] || "";
  const categoryConfig = getCategoryConfig(primaryCategory);
  const CategoryIcon = categoryConfig.icon;

  return (
    <div className="flex flex-col">
      {/* Screenshot */}
      <div className="relative w-full h-40 border border-border overflow-hidden bg-muted mb-3.5 flex-shrink-0">
        {tool.工具網址 && !imgError ? (
          <img
            src={getMicrolinkScreenshotUrl(tool.工具網址)}
            alt={`${tool.工具名稱} 網站截圖`}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: categoryConfig.bgColor }}
          >
            <CategoryIcon className="w-10 h-10" style={{ color: categoryConfig.color }} />
          </div>
        )}
        <span className="absolute top-0 left-0 bg-background border-r border-b border-border font-serif text-xs text-muted-foreground px-2.5 py-1 leading-none pt-1.5">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Name + category */}
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2 mb-2">
        <h3 className="font-serif text-xl font-bold text-foreground leading-tight">
          {tool.工具名稱}
        </h3>
        {primaryCategory && (
          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            {primaryCategory}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground/70 mb-3 flex-1">
        {tool.功能簡介}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3">
        <a
          href={tool.工具網址}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 text-sm font-bold text-foreground hover:opacity-70 transition-opacity"
        >
          前往網站
          <ExternalLink className="w-3 h-3" />
        </a>
        {tags.length > 0 && (
          <div className="flex gap-2">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs text-muted-foreground">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
