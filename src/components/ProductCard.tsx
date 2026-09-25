import { Plus, Star } from "lucide-react";
import { formatPrice, tileFor, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const Icon = product.icon;

  return (
    <div className="group flex flex-col rounded-2xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className={cn(
          "relative flex h-32 items-center justify-center rounded-xl",
          tileFor(product.category),
        )}
      >
        <Icon className="size-12" strokeWidth={1.5} />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
            {product.badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Star className="size-3.5 fill-primary text-primary" />
        <span className="font-semibold text-foreground">{product.rating}</span>
        <span>({product.reviews})</span>
      </div>

      <h3 className="mt-1.5 font-display text-sm font-semibold leading-snug">
        {product.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
        {product.blurb}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 pt-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-base font-bold">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <button
          onClick={() => add(product)}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95"
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </div>
    </div>
  );
}
