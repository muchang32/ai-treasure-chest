import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface ToolListItemProps {
  tool: AITool;
  index: number;
  onDetail?: (tool: AITool) => void;
}

const getMicrolinkScreenshotUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

export const ToolListItem = ({ tool, index, onDetail }: ToolListItemProps) => {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const primaryCategory = tool.工具分類[0] || "";
  const categoryConfig = getCategoryConfig(primaryCategory);
  const CategoryIcon = categoryConfig.icon;
  const isInternal = tool.來源 === "內部";

  if (isInternal) {
    return (
      <div className="border-b border-border py-4">
        <div className="flex items-baseline gap-2.5 mb-2">
          <span className="font-serif text-xs text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-lg font-bold text-foreground">
            {tool.工具名稱}
          </h3>
          <span className="text-[9px] tracking-wider border border-[#B8321A] text-[#B8321A] px-1.5 py-0.5 flex-shrink-0">
            自製
          </span>
        </div>

        <p className="text-sm leading-relaxed text-foreground/70 mb-3">
          {tool.功能簡介.length > 70 ? tool.功能簡介.slice(0, 70) + "…" : tool.功能簡介}
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onDetail ? onDetail(tool) : setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 border-b border-[#B8321A] pb-0.5 text-xs font-bold text-[#B8321A]"
          >
            {expanded && !onDetail ? "收起說明" : "查看說明"}
            {!onDetail && (expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
          </button>
          {tool.工具網址 && tool.工具網址 !== "#" && (
            <a
              href={tool.工具網址}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-foreground pb-0.5 text-xs font-bold text-foreground"
            >
              開啟工具
            </a>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{primaryCategory}</span>
        </div>

        {/* Inline expandable steps (when no modal handler) */}
        {expanded && !onDetail && tool.操作步驟 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-[10px] tracking-widest text-muted-foreground mb-3">操作步驟</div>
            <div className="flex flex-col gap-3 mb-4">
              {tool.操作步驟.map((st, i) => (
                <div key={i} className="flex gap-3">
                  <div className="font-serif text-lg font-bold text-[#B8321A] leading-tight w-5 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground mb-0.5">{st.title}</div>
                    <div className="text-xs leading-relaxed text-foreground/70">{st.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {tool.使用限制 && tool.使用限制.length > 0 && (
              <div className="border-t border-border/50 pt-3 mb-4">
                <div className="text-[10px] tracking-widest text-[#B8321A] mb-2">使用限制</div>
                {tool.使用限制.map((l, i) => (
                  <div key={i} className="text-xs leading-relaxed text-foreground/60">— {l}</div>
                ))}
              </div>
            )}
            {tool.工具網址 && tool.工具網址 !== "#" && (
              <a
                href={tool.工具網址}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-11 bg-foreground text-background text-sm font-bold"
              >
                開啟工具
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  // External tool
  return (
    <div className="border-b border-border py-4">
      <div className="relative w-full h-36 border border-border overflow-hidden bg-muted mb-3 flex-shrink-0">
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
            <CategoryIcon className="w-8 h-8" style={{ color: categoryConfig.color }} />
          </div>
        )}
        <span className="absolute top-0 left-0 bg-background border-r border-b border-border font-serif text-xs text-muted-foreground px-2 py-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-2 border-b border-border pb-2 mb-2">
        <h3 className="font-serif text-lg font-bold text-foreground">{tool.工具名稱}</h3>
        {primaryCategory && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">{primaryCategory}</span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground/70 mb-3">{tool.功能簡介}</p>
      <a
        href={tool.工具網址}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 text-xs font-bold text-foreground hover:opacity-70 transition-opacity"
      >
        前往網站
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
