import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type OrderStatus = "created" | "pending" | "paid" | "failed";

export function cashfreeConfig() {
  const appId = process.env["CASHFREE_APP_ID"];
  const secret = process.env["CASHFREE_SECRET_KEY"];
  const mode = process.env["CASHFREE_ENV"] === "production" ? "production" : "sandbox";
  if (!appId || !secret) throw new Error("Cashfree is not configured");
  const base = mode === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
  return { appId, secret, mode, base } as const;
}

export async function cashfreeFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { appId, secret, base } = cashfreeConfig();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": appId,
      "x-client-secret": secret,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Cashfree API error", res.status, text);
    throw new Error("Payment provider request failed");
  }
  return JSON.parse(text) as T;
}

/** Cashfree signs webhooks as base64(HMAC-SHA256(timestamp + rawBody, secretKey)). */
export function verifyWebhookSignature(rawBody: string, timestamp: string | null, signature: string | null) {
  if (!timestamp || !signature) return false;
  const ts = Number(timestamp);
  // Reject events older than 10 minutes (timestamp is in ms) to limit replays.
  if (Number.isFinite(ts) && Math.abs(Date.now() - ts) > 10 * 60 * 1000) return false;
  const expected = createHmac("sha256", cashfreeConfig().secret).update(timestamp + rawBody).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

function mapStatus(paymentStatus: string): OrderStatus {
  switch (paymentStatus) {
    case "SUCCESS": return "paid";
    case "PENDING":
    case "NOT_ATTEMPTED": return "pending";
    default: return "failed"; // FAILED, USER_DROPPED, CANCELLED, VOID
  }
}

/**
 * Records one payment event exactly once and moves the order forward.
 * Duplicates are ignored; a paid order is never downgraded; amount mismatches are rejected.
 */
export async function applyPaymentEvent(input: {
  eventKey: string;
  orderId: string;
  eventType: string;
  paymentStatus: string;
  paymentAmount: number | null;
  cfPaymentId: string | null;
  payload: unknown;
}): Promise<{ outcome: "duplicate" | "unknown_order" | "amount_mismatch" | "applied"; status?: OrderStatus }> {
  const { data: order } = await supabaseAdmin.from("orders").select("id, status, amount").eq("id", input.orderId).maybeSingle();
  if (!order) return { outcome: "unknown_order" };

  const { error: insertError } = await supabaseAdmin.from("payment_events").insert({
    event_key: input.eventKey,
    order_id: input.orderId,
    event_type: input.eventType,
    payment_status: input.paymentStatus,
    payload: input.payload as never,
  });
  if (insertError) {
    if (insertError.code === "23505") return { outcome: "duplicate", status: order.status as OrderStatus };
    throw insertError;
  }

  let next = mapStatus(input.paymentStatus);
  if (next === "paid" && input.paymentAmount !== null && Math.abs(Number(order.amount) - input.paymentAmount) > 0.009) {
    console.error("Amount mismatch for order", input.orderId);
    return { outcome: "amount_mismatch", status: order.status as OrderStatus };
  }
  if (order.status === "paid") next = "paid";

  const update: { status: OrderStatus; updated_at: string; cf_payment_id?: string } = { status: next, updated_at: new Date().toISOString() };
  if (next === "paid" && input.cfPaymentId) update.cf_payment_id = input.cfPaymentId;
  // Conditional update: never overwrite a paid order, even under concurrent events.
  await supabaseAdmin.from("orders").update(update).eq("id", input.orderId).neq("status", "paid");
  return { outcome: "applied", status: next };
}

interface CfPayment { cf_payment_id: string | number; payment_status: string; payment_amount: number; }

/** Pulls the latest payment attempts from Cashfree (fallback if the webhook is delayed). */
export async function reconcileOrder(orderId: string) {
  const payments = await cashfreeFetch<CfPayment[]>(`/orders/${encodeURIComponent(orderId)}/payments`);
  for (const p of payments) {
    await applyPaymentEvent({
      eventKey: `payment:${p.cf_payment_id}:${p.payment_status}`,
      orderId,
      eventType: "RECONCILE",
      paymentStatus: p.payment_status,
      paymentAmount: Number(p.payment_amount),
      cfPaymentId: String(p.cf_payment_id),
      payload: p,
    });
  }
}
