import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { categories, getCategory } from "@/lib/products";
import { CatalogBrowser } from "@/components/CatalogBrowser";

export const Route = createFileRoute("/category/$slug")({
  beforeLoad: ({ params }) => {
    if (!getCategory(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const category = getCategory(params.slug);
    const name = category?.name ?? "Category";
    const description =
      category?.tagline ??
      "Gadgets, phone accessories, projectors, charging gear and smart-home tech.";
    return {
      meta: [
        { title: `${name} — gshoppy` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — gshoppy` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${name} — gshoppy` },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const category = getCategory(slug);
  if (!category) return null;
  const Icon = category.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All products
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span
          className={`grid size-14 shrink-0 place-items-center rounded-2xl ${category.tile}`}
        >
          <Icon className="size-7" strokeWidth={1.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{category.tagline}</p>
        </div>
      </div>

      <div className="mt-8"><CatalogBrowser fixedCategory={category.slug} /></div>

      <div className="mt-10 flex flex-wrap gap-2 border-t pt-8">
        <span className="mr-2 py-1.5 text-sm font-medium text-muted-foreground">
          Other categories:
        </span>
        {categories
          .filter((c) => c.slug !== category.slug)
          .map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="rounded-full border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              {c.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
