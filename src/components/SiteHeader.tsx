import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, Zap } from "lucide-react";
import { categories } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const syncSearch = () => setSearch(new URLSearchParams(window.location.search).get("q") ?? "");
    syncSearch();
    window.addEventListener("popstate", syncSearch);
    return () => window.removeEventListener("popstate", syncSearch);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2 sm:flex sm:justify-between sm:px-6 sm:py-3 lg:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="size-5" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight">
            gshoppy
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <Button
          onClick={() => setOpen(true)}
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          variant="outline"
          size="icon"
          className="relative size-10 shrink-0 rounded-full"
        >
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </div>
      <form method="get" action="/#shop" role="search" className="border-t px-4 py-2 sm:hidden">
        <div className="mx-auto flex h-11 max-w-7xl items-center rounded-md border bg-card focus-within:ring-2 focus-within:ring-ring">
          <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            name="q"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search gadgets"
            aria-label="Search gadgets"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon" variant="ghost" aria-label="Submit search" className="size-11 shrink-0">
            <Search className="size-5" />
          </Button>
        </div>
      </form>
    </header>
  );
}
