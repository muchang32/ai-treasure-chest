import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CategorySidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isOpen = false,
  onClose,
}: CategorySidebarProps) => {
  const handleSelect = (category: string) => {
    onSelectCategory(category);
    onClose?.();
  };

  const content = (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <img src="/favicon_192.png" alt="AI精選寶箱" className="w-7 h-7 rounded-md" />
            AI精選寶箱
          </h1>
          <p className="text-sm text-muted-foreground mt-1">精選 AI 工具目錄</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          分類
        </h2>

        <button
          onClick={() => handleSelect("all")}
          className={cn(
            "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            selectedCategory === "all"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          全部工具
        </button>

        {categories.map((category) => {
          const categoryConfig = getCategoryConfig(category);
          const CategoryIcon = categoryConfig.icon;
          return (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                selectedCategory === category
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <CategoryIcon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: categoryConfig.color }}
              />
              <span>{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <aside
        className="hidden md:block w-64 flex-shrink-0 bg-sidebar min-h-screen"
        style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.05)" }}
      >
        {content}
      </aside>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside
            className="relative w-72 bg-sidebar min-h-screen z-10 overflow-y-auto"
            style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.15)" }}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
