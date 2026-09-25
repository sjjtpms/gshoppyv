import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, tileFor } from "@/lib/products";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, setOpen, lines, subtotal, setQty, remove, clear } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setCheckedOut(false);
  }, [isOpen]);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <ShoppingBag className="size-5 shrink-0" />
            <h2 className="truncate font-display text-lg font-bold">
              Your cart
            </h2>
            {lines.length > 0 && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {lines.length} item{lines.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="grid size-9 shrink-0 place-items-center rounded-full border bg-card transition-colors hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>

        {checkedOut ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="size-7" />
            </span>
            <h3 className="font-display text-lg font-bold">Order placed!</h3>
            <p className="text-sm text-muted-foreground">
              Thanks for shopping with Voltra. This is a demo checkout — real
              payments are coming in the next version.
            </p>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="size-7" />
            </span>
            <h3 className="font-display text-lg font-bold">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">
              Browse the store and add a few gadgets you love.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {lines.map(({ product, qty }) => {
                const Icon = product.icon;
                return (
                  <li key={product.id} className="flex gap-3 py-4">
                    <div
                      className={cn(
                        "grid size-14 shrink-0 place-items-center rounded-xl",
                        tileFor(product.category),
                      )}
                    >
                      <Icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">
                          {product.name}
                        </p>
                        <button
                          onClick={() => remove(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatPrice(product.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid size-7 place-items-center rounded-full border bg-card transition-colors hover:bg-accent"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="grid size-7 place-items-center rounded-full border bg-card transition-colors hover:bg-accent"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-bold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout. Free shipping over
                $50.
              </p>
              <button
                onClick={() => {
                  setCheckedOut(true);
                  clear();
                }}
                className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
