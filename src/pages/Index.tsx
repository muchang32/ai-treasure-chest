import { useState, useMemo } from "react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { CategorySidebar } from "@/components/CategorySidebar";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";
import { ToolListItem } from "@/components/ToolListItem";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const { data: tools, isLoading, error } = useGoogleSheets();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = useMemo(() => {
    if (!tools) return [];
    const allCategories = tools.flatMap(tool => tool.工具分類);
    const uniqueCategories = new Set(allCategories.filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [tools]);

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    let filtered = tools;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(tool => tool.工具分類.includes(selectedCategory));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.工具名稱.toLowerCase().includes(query) ||
        tool.功能簡介.toLowerCase().includes(query) ||
        tool.標籤.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [tools, selectedCategory, searchQuery]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">載入失敗</h2>
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
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">

        {/* ══════════════════════════════════
            MOBILE STICKY HEADER
        ══════════════════════════════════ */}
        <div className="md:hidden sticky top-0 z-30 bg-background border-b border-border shadow-sm">
          {/* Title row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}favicon_192.png`} alt="AI精選寶箱" className="w-8 h-8 rounded-md" />
              <span className="text-xl font-bold text-foreground">AI精選寶箱</span>
            </div>
            <SettingsPanel viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Search bar */}
          <div className="px-4 pb-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜尋工具..." />
          </div>

          {/* Horizontal scrollable category tabs */}
          {!isLoading && tools && (
            <div className="flex overflow-x-auto scrollbar-hide px-4 gap-6 border-t border-border/50">
              {["all", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap py-3 text-sm font-medium transition-colors flex-shrink-0 border-b-2 -mb-px",
                    selectedCategory === cat
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat === "all" ? "全部" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════
            DESKTOP HEADER
        ══════════════════════════════════ */}
        <div className="hidden md:block max-w-7xl mx-auto px-8 pt-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">
              {isLoading ? "載入中..." : `共 ${filteredTools.length} 個工具`}
            </p>
            <div className="flex items-center gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜尋工具..." />
              <SettingsPanel viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            CONTENT
        ══════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 md:pt-0 md:pb-8">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Tool count (mobile, below header) */}
          {!isLoading && (
            <p className="md:hidden text-sm text-muted-foreground mb-3">
              共 {filteredTools.length} 個工具
            </p>
          )}

          {!isLoading && filteredTools.length > 0 && (
            <>
              {/* Mobile: always list */}
              <div className="md:hidden flex flex-col gap-3">
                {filteredTools.map((tool, index) => (
                  <ToolListItem key={`${tool.工具名稱}-${index}`} tool={tool} />
                ))}
              </div>

              {/* Desktop: grid or list */}
              <div className="hidden md:block">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool, index) => (
                      <ToolCard key={`${tool.工具名稱}-${index}`} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {filteredTools.map((tool, index) => (
                      <ToolListItem key={`${tool.工具名稱}-${index}`} tool={tool} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty state */}
          {!isLoading && filteredTools.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? "找不到符合的工具" : "此分類暫無工具"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
