import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface ToolListItemProps {
  tool: AITool;
}

const getMicrolinkScreenshotUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

export const ToolListItem = ({ tool }: ToolListItemProps) => {
  const [imgError, setImgError] = useState(false);
  const tags = tool.標籤 ? tool.標籤.split(",").map(t => t.trim()).filter(Boolean) : [];
  const primaryCategory = tool.工具分類[0] || "";
  const categoryConfig = getCategoryConfig(primaryCategory);
  const CategoryIcon = categoryConfig.icon;

  return (
    <div className="group relative overflow-hidden transition-all hover:shadow-md border bg-card shadow-sm rounded-lg animate-fade-in">
      <div className="flex items-stretch gap-0">
        {/* Screenshot / fallback on the left */}
        <div className="flex-shrink-0 w-24 sm:w-36 md:w-44 overflow-hidden rounded-l-lg">
          {tool.工具網址 && !imgError ? (
            <img
              src={getMicrolinkScreenshotUrl(tool.工具網址)}
              alt={`${tool.工具名稱} 網站截圖`}
              className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full min-h-[96px] flex items-center justify-center"
              style={{ backgroundColor: categoryConfig.bgColor }}
            >
              <CategoryIcon className="w-8 h-8" style={{ color: categoryConfig.color }} />
            </div>
          )}
        </div>

        {/* Tool info */}
        <div className="flex flex-1 items-center gap-4 p-4 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground mb-1">
              {tool.工具名稱}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {tool.功能簡介}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    +{tags.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Visit button */}
          <div className="flex-shrink-0">
            <Button
              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={tool.工具網址}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                前往網站
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
