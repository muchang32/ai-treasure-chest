import { X, ArrowRight } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";

interface ToolDetailModalProps {
  tool: AITool | null;
  onClose: () => void;
}

export const ToolDetailModal = ({ tool, onClose }: ToolDetailModalProps) => {
  if (!tool) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-14"
      style={{ background: "rgba(17,17,17,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-2 border-foreground"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b-2 border-foreground px-6 md:px-9 pt-6 md:pt-7 pb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[10px] tracking-widest border border-[#B8321A] text-[#B8321A] px-2 py-0.5">
                自製工具
              </span>
              {tool.負責單位 && (
                <span className="text-xs tracking-wide text-muted-foreground">{tool.負責單位}</span>
              )}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-foreground leading-tight">
              {tool.工具名稱}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="w-8 h-8 flex-shrink-0 border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 md:px-9 pb-8 md:pb-9">
          <p className="font-serif text-base leading-relaxed text-foreground/90 py-5 border-b border-border">
            {tool.功能簡介}
          </p>

          {tool.操作說明 && (
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-x-5 md:gap-x-6">
              <div className="text-[10px] tracking-[0.2em] text-muted-foreground pt-5">操作說明</div>
              <p className="text-sm leading-relaxed text-foreground/80 py-5 border-b border-border whitespace-pre-line">
                {tool.操作說明}
              </p>
            </div>
          )}

          {/* CTA */}
          {tool.工具網址 && tool.工具網址 !== "#" ? (
            <a
              href={tool.工具網址}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 h-14 bg-foreground text-background text-sm font-bold tracking-wider hover:opacity-90 transition-opacity mt-2"
            >
              開啟工具
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <div className="flex items-center justify-center h-14 bg-muted text-muted-foreground text-sm mt-2">
              此工具尚未開放連結
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
