import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { AITool } from "@/hooks/useGoogleSheets";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface ToolCardProps {
  tool: AITool;
}

const getMicrolinkScreenshotUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

export const ToolCard = ({ tool }: ToolCardProps) => {
  const [imgError, setImgError] = useState(false);
  const tags = tool.標籤 ? tool.標籤.split(",").map(t => t.trim()).filter(Boolean) : [];
  const primaryCategory = tool.工具分類[0] || "";
  const categoryConfig = getCategoryConfig(primaryCategory);
  const CategoryIcon = categoryConfig.icon;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg border-0 bg-card shadow-md flex flex-col">
      {/* Screenshot preview at top */}
      <div className="relative w-full h-40 bg-muted overflow-hidden flex-shrink-0">
        {tool.工具網址 && !imgError ? (
          <img
            src={getMicrolinkScreenshotUrl(tool.工具網址)}
            alt={`${tool.工具名稱} 網站截圖`}
            className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: categoryConfig.bgColor }}
          >
            <CategoryIcon className="w-12 h-12" style={{ color: categoryConfig.color }} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Tool name + tags */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-card-foreground leading-snug">
            {tool.工具名稱}
          </h3>
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1 flex-shrink-0">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[3.5rem]">
          {tool.功能簡介}
        </p>

        {/* Visit website button */}
        <Button
          className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          asChild
        >
          <a
            href={tool.工具網址}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            前往網站
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
};
