import { cn } from "@/lib/utils";

export type SourceFilter = "all" | "外部" | "內部";

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sourceFilter: SourceFilter;
  onSourceFilterChange: (f: SourceFilter) => void;
  totalCount: number;
  internalCount: number;
  externalCount: number;
  canSeeInternal: boolean;
}

const SOURCE_OPTIONS: { value: SourceFilter; label: string; dot?: boolean }[] = [
  { value: "all", label: "全部" },
  { value: "內部", label: "自製工具", dot: true },
  { value: "外部", label: "外部工具" },
];

export const CategorySidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sourceFilter,
  onSourceFilterChange,
  totalCount,
  internalCount,
  externalCount,
  canSeeInternal,
}: CategorySidebarProps) => {
  const sourceCounts = { all: totalCount, 內部: internalCount, 外部: externalCount };

  return (
    <aside
      className="hidden md:flex flex-col w-64 flex-shrink-0 bg-sidebar border-r border-border min-h-screen"
    >
      <div className="flex flex-col h-full p-6">

        {/* Logo */}
        <div className="mb-7 pb-6 border-b-2 border-foreground">
          <h1 className="font-serif text-2xl font-black text-foreground flex items-center gap-2">
            <img
              src={`${import.meta.env.BASE_URL}favicon_192.png`}
              alt=""
              className="w-7 h-7"
            />
            AI精選寶箱
          </h1>
          <p className="text-[10px] tracking-[0.2em] text-muted-foreground mt-1.5 uppercase">
            內部工具目錄 · 2026
          </p>
        </div>

        {/* Source filter — hidden in external-only mode */}
        {canSeeInternal && <nav aria-label="工具來源" className="mb-7">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-3">
            來源
          </h2>
          <div className="flex flex-col">
            {SOURCE_OPTIONS.map(({ value, label, dot }) => (
              <button
                key={value}
                onClick={() => onSourceFilterChange(value)}
                aria-current={sourceFilter === value ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-border/40 py-2.5 text-sm transition-colors text-left",
                  sourceFilter === value
                    ? "font-bold text-foreground"
                    : "font-normal text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  {dot && (
                    <span className="w-2.5 h-2.5 bg-[#B8321A] inline-block flex-shrink-0" />
                  )}
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">{sourceCounts[value]}</span>
              </button>
            ))}
          </div>
        </nav>}

        {/* Category filter */}
        <nav aria-label="工具分類" className="flex-1 overflow-y-auto">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-3">
            分類
          </h2>
          <div className="flex flex-col">
            <button
              onClick={() => onSelectCategory("all")}
              aria-current={selectedCategory === "all" ? "true" : undefined}
              className={cn(
                "flex items-center gap-3 py-2 text-sm transition-colors text-left",
                selectedCategory === "all"
                  ? "font-bold text-foreground"
                  : "font-normal text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-[10px] text-muted-foreground/50 w-5 font-normal">00</span>
              全部分類
            </button>
            {categories.map((category, i) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                aria-current={selectedCategory === category ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3 py-2 text-sm transition-colors text-left",
                  selectedCategory === category
                    ? "font-bold text-foreground"
                    : "font-normal text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-[10px] text-muted-foreground/50 w-5 font-normal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs leading-relaxed text-muted-foreground">
            標示{" "}
            <span className="inline-block w-2 h-2 bg-[#B8321A] mx-0.5 align-middle" />{" "}
            者為部門自行開發，附操作步驟與使用說明。
          </p>
        </div>
      </div>
    </aside>
  );
};
