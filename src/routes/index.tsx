import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Voltra — Gadgets & Accessories Store",
      },
      {
        name: "description",
        content:
          "Shop everyday gadgets, phone accessories, projectors, charging gear and smart-home tech. Clean, curated and shipped fast.",
      },
      { property: "og:title", content: "Voltra — Gadgets & Accessories Store" },
      {
        property: "og:description",
        content:
          "Everyday gadgets, phone accessories, projectors, charging gear and smart-home tech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Voltra — Gadgets & Accessories Store" },
      {
        name: "twitter:description",
        content:
          "Everyday gadgets, phone accessories, projectors, charging gear and smart-home tech.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<string>("all");
  const visible =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pt-16">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            New season drop — free shipping over $50
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Everyday tech that just works.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            Gadgets, phone accessories, projectors, charging gear and
            smart-home picks — curated, tested, and shipped fast.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop all products
              <ArrowRight className="size-4" />
            </a>
            <Link
              to="/category/$slug"
              params={{ slug: "projectors" }}
              className="inline-flex items-center rounded-full border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Explore projectors
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Free shipping over $50
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              2-year warranty
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Tested by our team
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border shadow-xl">
          <img
            src={heroImg}
            alt="Flat-lay of gadgets: phone with wallet, earbuds, projector, cable, smart bulb and power bank"
            width={1600}
            height={900}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = c.icon;
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-xl",
                    c.tile,
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold leading-snug">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {count} products
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Shop all gadgets
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {visible.length} product{visible.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:justify-end">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => (
              <button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active === c.slug
                    ? "bg-foreground text-background"
                    : "border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
