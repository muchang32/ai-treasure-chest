import { ArrowRight, ExternalLink } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";

interface InternalToolCardProps {
  tool: AITool;
  index: number;
  onDetail: (tool: AITool) => void;
}

export const InternalToolCard = ({ tool, index, onDetail }: InternalToolCardProps) => {
  const tags = tool.標籤 ? tool.標籤.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="border-b border-border py-6 pr-7">
      <div className="flex items-baseline gap-3 mb-2.5 flex-wrap">
        <span className="font-serif text-sm text-muted-foreground/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-serif text-2xl font-bold text-foreground leading-tight">
          {tool.工具名稱}
        </h3>
        <span className="text-[10px] tracking-widest border border-[#B8321A] text-[#B8321A] px-2 py-0.5 flex-shrink-0">
          自製
        </span>
        {tool.負責單位 && (
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
            {tool.負責單位}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-foreground/70 mb-3.5 max-w-prose">
        {tool.功能簡介}
      </p>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => onDetail(tool)}
          className="inline-flex items-center gap-1.5 border-b border-[#B8321A] pb-0.5 text-sm font-bold text-[#B8321A] hover:opacity-75 transition-opacity"
        >
          查看說明
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        {tool.工具網址 && tool.工具網址 !== "#" && (
          <a
            href={tool.工具網址}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 text-sm font-bold text-foreground hover:opacity-70 transition-opacity"
          >
            開啟工具
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {tags.length > 0 && (
          <div className="ml-auto flex gap-2">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs text-muted-foreground">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
