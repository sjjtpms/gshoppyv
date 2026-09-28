import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useCart } from "@/lib/cart";
import { formatPrice, freeShippingThreshold, shippingFor } from "@/lib/products";
import { createCheckout } from "@/lib/checkout.functions";
import { openCashfreeCheckout } from "@/lib/cashfree-sdk";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CartDrawer() {
  const { isOpen, setOpen, lines, subtotal, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startCheckout = useServerFn(createCheckout);
  const shipping = shippingFor(subtotal);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) { setStep("cart"); setError(null); }
  }, [isOpen]);

  async function handlePay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const res = await startCheckout({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? "").replace(/\D/g, "").slice(-10),
          items: lines.map((l) => ({ id: l.product.id, qty: l.qty })),
        },
      });
      // Cart is kept here; it's cleared only after the order page verifies payment.
      await openCashfreeCheckout(res.paymentSessionId, res.mode);
    } catch (e) {
      console.error(e);
      setError("We couldn't start the payment. Check your details and try again.");
      setSubmitting(false);
    }
  }

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

        {step === "details" && lines.length > 0 ? (
          <form onSubmit={handlePay} className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
            <button type="button" onClick={() => setStep("cart")} className="mb-4 inline-flex items-center gap-1 self-start text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Back to cart
            </button>
            <h3 className="font-display text-lg font-bold">Contact details</h3>
            <p className="mt-1 text-sm text-muted-foreground">We'll send your order updates here.</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5"><Label htmlFor="co-name">Full name</Label><Input id="co-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="h-11" /></div>
              <div className="space-y-1.5"><Label htmlFor="co-email">Email</Label><Input id="co-email" name="email" type="email" required maxLength={120} autoComplete="email" className="h-11" /></div>
              <div className="space-y-1.5"><Label htmlFor="co-phone">Mobile number</Label><Input id="co-phone" name="phone" type="tel" inputMode="numeric" required pattern="(\+91)?[\s-]?[6-9][0-9]{9}" placeholder="98765 43210" autoComplete="tel" className="h-11" /></div>
            </div>
            <div className="mt-auto space-y-1 border-t pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
              <div className="flex justify-between font-display text-lg font-bold"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
            </div>
            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={submitting} className="mt-3 w-full rounded-full">
              {submitting ? <><Loader2 className="size-4 animate-spin" /> Opening payment…</> : `Pay ${formatPrice(subtotal + shipping)} with Cashfree`}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">UPI, cards, netbanking & wallets</p>
          </form>
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
                {shipping ? `Shipping ${formatPrice(shipping)} — free over ` : "Free shipping on orders over "}
                {formatPrice(freeShippingThreshold)}.
              </p>
              <Button
                onClick={() => setStep("details")}
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
