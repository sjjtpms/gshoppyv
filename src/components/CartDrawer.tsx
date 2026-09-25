import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <Button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            variant="outline"
            size="icon"
            className="shrink-0 rounded-full"
          >
            <X className="size-4" />
          </Button>
        </div>

        {checkedOut ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="size-7" />
            </span>
            <h3 className="font-display text-lg font-bold">Order placed!</h3>
            <p className="text-sm text-muted-foreground">
              Thanks for shopping with gshoppy. This is a demo checkout — real
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
            <Button
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full"
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {lines.map(({ product, qty }) => {
                return (
                  <li key={product.id} className="flex gap-3 py-4">
                    <img src={product.image} alt="" loading="lazy" width={56} height={72} className="size-14 shrink-0 rounded-md bg-muted object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">
                          {product.name}
                        </p>
                        <Button
                          onClick={() => remove(product.id)}
                          aria-label={`Remove ${product.name}`}
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatPrice(product.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <Button
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full"
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={qty}
                          onChange={(event) => setQty(product.id, Number(event.target.value))}
                          aria-label={`Quantity for ${product.name}`}
                          className="h-8 w-12 rounded-md border bg-background text-center text-sm font-semibold"
                        />
                        <Button
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full"
                        >
                          <Plus className="size-3.5" />
                        </Button>
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
              <Button
                onClick={() => {
                  setCheckedOut(true);
                  clear();
                }}
                size="lg"
                className="mt-3 w-full rounded-full"
              >
                Secure checkout
              </Button>
              <Button variant="ghost" onClick={clear} className="mt-1 w-full text-muted-foreground">Clear cart</Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
