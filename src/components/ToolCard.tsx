import { useState } from "react";
import { AITool } from "@/hooks/useGoogleSheets";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface ToolCardProps {
  tool: AITool;
}

const getMicrolinkScreenshotUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&screenshot.width=1280&screenshot.height=800`;

export const ToolCard = ({ tool }: ToolCardProps) => {
  const [imgError, setImgError] = useState(false);
  const tags = tool.標籤 ? tool.標籤.split(",").map(t => t.trim()).filter(Boolean) : [];
  const primaryCategory = tool.工具分類[0] || "";
  const categoryConfig = getCategoryConfig(primaryCategory);
  const CategoryIcon = categoryConfig.icon;
  const hasLink = !!tool.工具網址;

  return (
    <div className="flex flex-col">
      {/* Screenshot — clickable */}
      <a
        href={hasLink ? tool.工具網址 : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full h-40 border border-border overflow-hidden bg-muted mb-3.5 flex-shrink-0 group"
        tabIndex={hasLink ? 0 : -1}
        aria-label={`前往 ${tool.工具名稱} 網站`}
      >
        {tool.工具網址 && !imgError ? (
          <img
            src={getMicrolinkScreenshotUrl(tool.工具網址)}
            alt={`${tool.工具名稱} 網站截圖`}
            className="w-full h-full object-cover object-top transition-opacity group-hover:opacity-85"
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
      </a>

      {/* Name + category */}
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2 mb-2">
        <a
          href={tool.工具網址}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-xl font-bold text-foreground leading-tight hover:opacity-70 transition-opacity"
        >
          {tool.工具名稱}
        </a>
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
