import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, compatibilityOptions, products, type CategorySlug, type Compatibility } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const priceBands = [
  { value: "all", label: "Any price" },
  { value: "under-25", label: "Under $25" },
  { value: "25-50", label: "$25–$50" },
  { value: "over-50", label: "$50+" },
];

export function CatalogBrowser({ fixedCategory }: { fixedCategory?: CategorySlug }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(fixedCategory ?? "all");
  const [price, setPrice] = useState("all");
  const [compatibility, setCompatibility] = useState<string>("all");
  const [urlReady, setUrlReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const applyUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      if (!fixedCategory) setCategory(params.get("category") ?? "all");
      setPrice(params.get("price") ?? "all");
      setCompatibility(params.get("compatibility") ?? "all");
      setUrlReady(true);
    };
    applyUrl();
    window.addEventListener("popstate", applyUrl);
    return () => window.removeEventListener("popstate", applyUrl);
  }, [fixedCategory]);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (!fixedCategory && category !== "all") params.set("category", category);
    if (price !== "all") params.set("price", price);
    if (compatibility !== "all") params.set("compatibility", compatibility);
    const next = params.size > 0 ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState(window.history.state, "", next);
  }, [category, compatibility, fixedCategory, price, query, urlReady]);

  const filtered = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.blurb} ${product.compatibility.join(" ")}`.toLowerCase();
    const matchesQuery = text.includes(query.trim().toLowerCase());
    const matchesCategory = (fixedCategory ?? category) === "all" || product.category === (fixedCategory ?? category);
    const matchesCompatibility = compatibility === "all" || product.compatibility.includes(compatibility as Compatibility);
    const matchesPrice = price === "all" || (price === "under-25" && product.price < 25) || (price === "25-50" && product.price >= 25 && product.price <= 50) || (price === "over-50" && product.price > 50);
    return matchesQuery && matchesCategory && matchesCompatibility && matchesPrice;
  }), [category, compatibility, fixedCategory, price, query]);

  const hasFilters = query !== "" || (!fixedCategory && category !== "all") || price !== "all" || compatibility !== "all";
  const reset = () => { setQuery(""); setCategory(fixedCategory ?? "all"); setPrice("all"); setCompatibility("all"); };
  const activeFilterCount = Number(!fixedCategory && category !== "all") + Number(price !== "all") + Number(compatibility !== "all");

  return (
    <div>
      <div className="rounded-lg border bg-card p-3 shadow-sm sm:p-4">
        <Button variant="outline" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} aria-controls="catalog-filters" className="flex h-12 w-full justify-between text-sm sm:hidden">
          <span className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-primary" /> Filters {activeFilterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{activeFilterCount}</span>}</span>
          <span className="text-muted-foreground">{filtersOpen ? "Done" : "Show"}</span>
        </Button>
        <div className="mb-3 hidden items-center gap-2 text-sm font-semibold sm:flex">
          <SlidersHorizontal className="size-4 text-primary" /> Find your gear
        </div>
        <div id="catalog-filters" className={`${filtersOpen ? "grid" : "hidden"} mt-3 gap-3 sm:mt-0 sm:grid sm:grid-cols-2 lg:grid-cols-[minmax(240px,1.5fr)_repeat(3,minmax(150px,1fr))_auto]`}>
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search gadgets..." aria-label="Search products" className="h-10 pl-9" />
          </div>
          {!fixedCategory && (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 w-full sm:h-10" aria-label="Filter by category"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}</SelectContent>
            </Select>
          )}
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="h-12 w-full sm:h-10" aria-label="Filter by price"><SelectValue /></SelectTrigger>
            <SelectContent>{priceBands.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={compatibility} onValueChange={setCompatibility}>
            <SelectTrigger className="h-12 w-full sm:h-10" aria-label="Filter by compatibility"><SelectValue placeholder="Compatibility" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All compatibility</SelectItem>{compatibilityOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
          </Select>
          {hasFilters && <Button variant="ghost" onClick={reset} className="h-12 sm:h-10"><X className="size-4" /> Reset</Button>}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground"><strong className="text-foreground">{filtered.length}</strong> product{filtered.length === 1 ? "" : "s"}</p>
      </div>
      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-4 border-y py-16 text-center">
          <Search className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-3 font-display text-lg font-semibold">No matching gadgets</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or clear your filters.</p>
          <Button variant="outline" onClick={reset} className="mt-4">Clear filters</Button>
        </div>
      )}
    </div>
  );
}