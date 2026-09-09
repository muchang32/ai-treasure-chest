import { useState, useMemo } from "react";
import { useGoogleSheets, AITool } from "@/hooks/useGoogleSheets";
import { useAccessConfig } from "@/hooks/useAccessConfig";
import { CategorySidebar, SourceFilter } from "@/components/CategorySidebar";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";
import { ToolListItem } from "@/components/ToolListItem";
import { InternalToolCard } from "@/components/InternalToolCard";
import { ToolDetailModal } from "@/components/ToolDetailModal";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCE_TABS: { value: SourceFilter; label: string; dot?: boolean }[] = [
  { value: "all", label: "全部" },
  { value: "內部", label: "自製工具", dot: true },
  { value: "外部", label: "外部工具" },
];

const Index = () => {
  const { data: tools, isLoading, error } = useGoogleSheets();
  const { data: accessConfig } = useAccessConfig();
  const canSeeInternal = accessConfig?.isInternal ?? false;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  const categories = useMemo(() => {
    if (!tools) return [];
    const allCats = tools.flatMap(t => t.工具分類);
    return Array.from(new Set(allCats.filter(Boolean))).sort();
  }, [tools]);

  const allInternal = useMemo(() => tools?.filter(t => t.來源 === "內部") ?? [], [tools]);
  const allExternal = useMemo(() => tools?.filter(t => t.來源 === "外部") ?? [], [tools]);

  const applyFilters = (list: AITool[]) => {
    let filtered = list;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.工具分類.includes(selectedCategory));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        (t.工具名稱 + t.功能簡介 + t.標籤).toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const filteredInternal = useMemo(() => applyFilters(allInternal), [allInternal, selectedCategory, searchQuery]);
  const filteredExternal = useMemo(() => applyFilters(allExternal), [allExternal, selectedCategory, searchQuery]);

  const showInternal = canSeeInternal && sourceFilter !== "外部" && filteredInternal.length > 0;
  const showExternal = sourceFilter !== "內部" && filteredExternal.length > 0;
  const totalFiltered = (showInternal ? filteredInternal.length : 0) + (showExternal ? filteredExternal.length : 0);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">載入失敗</h2>
          <p className="text-muted-foreground">無法載入工具資料，請稍後再試</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Desktop sidebar ── */}
      {!isLoading && tools && (
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          totalCount={(canSeeInternal ? allInternal.length : 0) + allExternal.length}
          internalCount={allInternal.length}
          externalCount={allExternal.length}
          canSeeInternal={canSeeInternal}
        />
      )}

      <main className="flex-1 min-w-0">

        {/* ══════════════════════════════════
            MOBILE STICKY HEADER
        ══════════════════════════════════ */}
        <div className="md:hidden sticky top-0 z-30 bg-background border-b-2 border-foreground">
          <div className="flex items-baseline justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}favicon_192.png`}
                alt="AI精選寶箱"
                className="w-8 h-8"
              />
              <span className="font-serif text-xl font-black text-foreground">AI精選寶箱</span>
            </div>
            <div className="flex items-center gap-2">
              {!isLoading && (
                <span className="text-[10px] tracking-widest text-muted-foreground">
                  {totalFiltered} TOOLS
                </span>
              )}
              <SettingsPanel viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>

          <div className="px-4 pb-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜尋" />
          </div>

          {/* Source filter — only shown when internal access is available */}
          {!isLoading && tools && canSeeInternal && (
            <div className="flex gap-5 px-4 pb-2.5">
              {SOURCE_TABS.map(({ value, label, dot }) => (
                <button
                  key={value}
                  onClick={() => setSourceFilter(value)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm pb-1 border-b-2 transition-colors",
                    sourceFilter === value
                      ? "border-foreground font-bold text-foreground"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  {dot && <span className="w-2 h-2 bg-[#B8321A] inline-block" />}
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Category tabs */}
          {!isLoading && tools && (
            <div className="flex overflow-x-auto scrollbar-hide px-4 gap-6 border-t border-border/50">
              {["all", ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap py-2.5 text-sm transition-colors flex-shrink-0 border-b-2 -mb-px",
                    selectedCategory === cat
                      ? "border-foreground font-bold text-foreground"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  {cat === "all" ? "全部分類" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════
            DESKTOP HEADER
        ══════════════════════════════════ */}
        <div className="hidden md:flex items-end justify-between border-b-2 border-foreground px-11 pt-6 pb-5 gap-4">
          <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            {isLoading ? "載入中…" : "內部工具目錄 · 2026"}
          </p>
          <div className="flex items-end gap-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜尋" />
            <SettingsPanel viewMode={viewMode} onViewModeChange={setViewMode} />
            <div className="text-right">
              <div className="font-serif text-3xl font-black text-foreground leading-none">
                {isLoading ? "—" : totalFiltered}
              </div>
              <div className="text-[10px] tracking-widest text-muted-foreground mt-1">TOOLS</div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            CONTENT
        ══════════════════════════════════ */}
        <div className="px-4 py-6 md:px-11 md:py-8">

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && (
            <>
              {/* ── 自製工具 section ── */}
              {showInternal && (
                <section className="mb-12 md:mb-16">
                  <div className="flex items-baseline gap-3 md:gap-4 border-b-2 border-foreground pb-2.5 mb-1.5">
                    <span className="w-2.5 h-2.5 bg-[#B8321A] inline-block flex-shrink-0" />
                    <h2 className="font-serif text-xl md:text-2xl font-black text-foreground">自製工具</h2>
                    <span className="text-[10px] tracking-widest text-muted-foreground hidden md:inline">
                      IN-HOUSE
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      部門自行開發，共 {filteredInternal.length} 個
                    </span>
                  </div>

                  {/* Desktop: 2-col text grid */}
                  <div className="hidden md:grid grid-cols-2">
                    {filteredInternal.map((tool, i) => (
                      <InternalToolCard
                        key={tool.工具名稱}
                        tool={tool}
                        index={i}
                        onDetail={setSelectedTool}
                      />
                    ))}
                  </div>

                  {/* Mobile: expandable list */}
                  <div className="md:hidden">
                    {filteredInternal.map((tool, i) => (
                      <ToolListItem
                        key={tool.工具名稱}
                        tool={tool}
                        index={i}
                        onDetail={setSelectedTool}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ── 外部工具 section ── */}
              {showExternal && (
                <section>
                  <div className="flex items-baseline gap-3 md:gap-4 border-b-2 border-foreground pb-2.5 mb-6">
                    <h2 className="font-serif text-xl md:text-2xl font-black text-foreground">外部工具</h2>
                    <span className="text-[10px] tracking-widest text-muted-foreground hidden md:inline">
                      EXTERNAL
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">共 {filteredExternal.length} 個</span>
                  </div>

                  {/* Desktop: grid or list */}
                  <div className="hidden md:block">
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-3 gap-x-7 gap-y-10">
                        {filteredExternal.map((tool, i) => (
                          <ToolCard key={`${tool.工具名稱}-${i}`} tool={tool} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {filteredExternal.map((tool, i) => (
                          <ToolListItem key={`${tool.工具名稱}-${i}`} tool={tool} index={i} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile: list */}
                  <div className="md:hidden">
                    {filteredExternal.map((tool, i) => (
                      <ToolListItem key={`${tool.工具名稱}-${i}`} tool={tool} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {!showInternal && !showExternal && (
                <div className="text-center py-20">
                  <p className="font-serif text-lg text-muted-foreground">
                    {searchQuery ? "找不到符合的工具" : "此分類暫無工具"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Internal tool detail modal ── */}
      <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </div>
  );
};

export default Index;
