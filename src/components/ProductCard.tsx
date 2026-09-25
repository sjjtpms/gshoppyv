import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group flex min-w-0 flex-col rounded-lg border bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block overflow-hidden rounded-md bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={384}
          height={1024}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Star className="size-3.5 fill-primary text-primary" />
        <span className="font-semibold text-foreground">{product.rating}</span>
        <span>({product.reviews})</span>
      </div>

      <h3 className="mt-1.5 font-display text-sm font-semibold leading-snug">
        <Link to="/product/$productId" params={{ productId: product.id }} className="hover:text-primary">
          {product.name}
        </Link>
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
        <Button
          onClick={() => add(product)}
          size="sm"
          className="shrink-0 rounded-full active:scale-95"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
    </article>
  );
}
