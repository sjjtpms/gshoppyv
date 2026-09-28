import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getProduct, shippingFor } from "./products";

const checkoutInput = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  items: z.array(z.object({ id: z.string().max(60), qty: z.number().int().min(1).max(99) })).min(1).max(50),
});

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutInput.parse(data))
  .handler(async ({ data }) => {
    const { cashfreeFetch, cashfreeConfig } = await import("./cashfree.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Prices always come from the server-side catalog, never from the browser.
    const items = data.items.map((line) => {
      const product = getProduct(line.id);
      if (!product) throw new Error("A product in your cart is no longer available");
      return { id: product.id, name: product.name, price: product.price, qty: line.qty };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = shippingFor(subtotal);
    const amount = subtotal + shipping;

    const orderId = `gs_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const { error } = await supabaseAdmin.from("orders").insert({
      id: orderId, amount, items: { lines: items, subtotal, shipping } as never,
      customer_name: data.name, customer_email: data.email, customer_phone: data.phone,
    });
    if (error) { console.error(error); throw new Error("Could not create your order"); }

    const origin = new URL(getRequest().url).origin;
    const cf = await cashfreeFetch<{ payment_session_id: string }>("/orders", {
      method: "POST",
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: data.phone,
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.phone,
        },
        order_meta: {
          return_url: `${origin}/order/${orderId}`,
          notify_url: `${origin}/api/public/cashfree-webhook`,
        },
      }),
    });
    return { orderId, paymentSessionId: cf.payment_session_id, mode: cashfreeConfig().mode };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ orderId: z.string().regex(/^gs_\d+_[a-f0-9]{8}$/) }).parse(data))
  .handler(async ({ data }) => {
    const { reconcileOrder } = await import("./cashfree.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    try { await reconcileOrder(data.orderId); } catch (e) { console.error("reconcile failed", e); }
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, status, amount, items, customer_name, created_at")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order) return null;
    const items = order.items as { lines: { id: string; name: string; price: number; qty: number }[]; subtotal: number; shipping: number };
    return {
      id: order.id,
      status: order.status as "created" | "pending" | "paid" | "failed",
      amount: Number(order.amount),
      firstName: order.customer_name.split(" ")[0] ?? "",
      createdAt: order.created_at,
      lines: items.lines,
      subtotal: items.subtotal,
      shipping: items.shipping,
    };
  });
