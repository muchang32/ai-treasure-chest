import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface ToolListItemProps {
  tool: AITool;
  index: number;
  onDetail?: (tool: AITool) => void;
}

const getLogoUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return null;
  }
};

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

export const ToolListItem = ({ tool, index, onDetail }: ToolListItemProps) => {
  const [logoError, setLogoError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const primaryCategory = tool.工具分類[0] || "";
  const categoryConfig = getCategoryConfig(primaryCategory);
  const CategoryIcon = categoryConfig.icon;
  const isInternal = tool.來源 === "內部";

  const logoUrl = tool.工具網址 ? getLogoUrl(tool.工具網址) : null;
  const faviconUrl = tool.工具網址 ? getFaviconUrl(tool.工具網址) : null;

  const LogoFallback = () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: categoryConfig.bgColor }}
    >
      <CategoryIcon className="w-5 h-5" style={{ color: categoryConfig.color }} />
    </div>
  );

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

        {expanded && !onDetail && tool.操作說明 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-[10px] tracking-widest text-muted-foreground mb-2">操作說明</div>
            <p className="text-xs leading-relaxed text-foreground/70 mb-4 whitespace-pre-line">
              {tool.操作說明}
            </p>
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

  // External tool — horizontal layout: logo left, text center, link right
  return (
    <div className="border-b border-border py-4 flex gap-4 items-center">
      {/* Logo */}
      <a
        href={tool.工具網址}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 w-14 h-14 border border-border overflow-hidden bg-muted flex items-center justify-center group"
        aria-label={`前往 ${tool.工具名稱} 網站`}
        tabIndex={-1}
      >
        {logoUrl && !logoError ? (
          <img
            src={logoUrl}
            alt={`${tool.工具名稱} logo`}
            className="w-10 h-10 object-contain transition-opacity group-hover:opacity-75"
            onError={() => setLogoError(true)}
          />
        ) : faviconUrl && !faviconError ? (
          <img
            src={faviconUrl}
            alt={`${tool.工具名稱} favicon`}
            className="w-8 h-8 object-contain transition-opacity group-hover:opacity-75"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <LogoFallback />
        )}
      </a>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <a
            href={tool.工具網址}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-base font-bold text-foreground hover:opacity-70 transition-opacity"
          >
            {tool.工具名稱}
          </a>
          {primaryCategory && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">{primaryCategory}</span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-foreground/70 line-clamp-2">{tool.功能簡介}</p>
      </div>

      {/* Link */}
      <a
        href={tool.工具網址}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-bold text-foreground hover:opacity-60 transition-opacity"
      >
        前往網站
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
