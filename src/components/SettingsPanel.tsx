import { Moon, Sun, Type, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useFontSize } from "@/contexts/FontSizeContext";

interface SettingsPanelProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const SettingsPanel = ({ viewMode, onViewModeChange }: SettingsPanelProps) => {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="flex items-center gap-2">
      {/* View Mode Toggle */}
      <div className="flex items-center border rounded-lg">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
          title="網格視圖"
          className="rounded-r-none"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("list")}
          title="列表視圖"
          className="rounded-l-none"
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Font Size Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="字體大小">
            <Type className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setFontSize("small")}
            className={fontSize === "small" ? "bg-accent" : ""}
          >
            小
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize("medium")}
            className={fontSize === "medium" ? "bg-accent" : ""}
          >
            中
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize("large")}
            className={fontSize === "large" ? "bg-accent" : ""}
          >
            大
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title={theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
};
