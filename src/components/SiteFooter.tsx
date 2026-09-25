import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { categories } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            <span className="font-display text-base font-bold">Voltra</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Everyday gadgets, phone accessories, projectors, charging gear and
            smart-home tech — curated and tested by our team.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="transition-colors hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-display text-sm font-semibold">Support</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Free shipping over $50</li>
            <li>30-day returns</li>
            <li>2-year warranty on all gadgets</li>
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-10">
        © 2026 Voltra. Demo storefront — version 1.
      </div>
    </footer>
  );
}
