import { useEffect, useRef } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { getOrder } from "@/lib/checkout.functions";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({
    meta: [
      { title: "Your order — gshoppy" },
      { name: "description", content: "Payment status and order confirmation for your gshoppy purchase." },
      { property: "og:title", content: "Your order — gshoppy" },
      { property: "og:description", content: "Payment status and order confirmation for your gshoppy purchase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const fetchOrder = useServerFn(getOrder);
  const { clear } = useCart();
  const cleared = useRef(false);
  const started = useRef(Date.now());

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder({ data: { orderId } }),
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      const waiting = s === "created" || s === "pending";
      return waiting && Date.now() - started.current < 3 * 60 * 1000 ? 4000 : false;
    },
  });

  // Empty the cart only once the payment is verified as paid.
  useEffect(() => {
    if (order?.status === "paid" && !cleared.current) {
      cleared.current = true;
      clear();
    }
  }, [order?.status, clear]);

  if (isLoading) {
    return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }
  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Order not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back to the store</Link>
      </div>
    );
  }

  const view = {
    paid: { icon: CheckCircle2, tone: "text-primary bg-primary/10", title: `Thank you${order.firstName ? `, ${order.firstName}` : ""}! Your order is confirmed.`, text: "Payment received. We'll ship your gadgets within 1–2 business days." },
    pending: { icon: Clock, tone: "text-muted-foreground bg-muted", title: "Payment is processing", text: "Your bank hasn't confirmed yet. This page updates automatically — your cart is kept until payment is confirmed." },
    created: { icon: Clock, tone: "text-muted-foreground bg-muted", title: "Waiting for payment", text: "We haven't received a payment for this order yet. Your cart is still saved." },
    failed: { icon: XCircle, tone: "text-destructive bg-destructive/10", title: "Payment didn't go through", text: "No money was taken for this order. Your cart is still saved — you can try again." },
  }[order.status];
  const Icon = view.icon;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <span className={`mx-auto grid size-16 place-items-center rounded-full ${view.tone}`}><Icon className="size-8" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{view.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{view.text}</p>
        <p className="mt-3 text-xs text-muted-foreground">Order number <span className="font-mono font-semibold text-foreground">{order.id}</span></p>
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-5">
        <ul className="divide-y">
          {order.lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-3 py-2 text-sm">
              <span>{l.name} × {l.qty}</span><span className="font-medium">{formatPrice(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{order.shipping ? formatPrice(order.shipping) : "Free"}</span></div>
          <div className="flex justify-between font-display text-lg font-bold"><span>{order.status === "paid" ? "Paid" : "Total"}</span><span>{formatPrice(order.amount)}</span></div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button asChild className="rounded-full"><Link to="/">Continue shopping</Link></Button>
      </div>
    </div>
  );
}
