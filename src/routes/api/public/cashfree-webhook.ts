import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  type: z.string(),
  data: z.object({
    order: z.object({ order_id: z.string() }),
    payment: z.object({
      cf_payment_id: z.union([z.string(), z.number()]),
      payment_status: z.string(),
      payment_amount: z.number().optional(),
    }).optional(),
  }),
});

export const Route = createFileRoute("/api/public/cashfree-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifyWebhookSignature, applyPaymentEvent } = await import("@/lib/cashfree.server");
        const raw = await request.text();
        const ok = verifyWebhookSignature(raw, request.headers.get("x-webhook-timestamp"), request.headers.get("x-webhook-signature"));
        if (!ok) return new Response("Invalid signature", { status: 401 });

        let parsed;
        try { parsed = payloadSchema.parse(JSON.parse(raw)); } catch { return new Response("Bad payload", { status: 400 }); }
        const payment = parsed.data.payment;
        // Non-payment events (e.g. refunds) are acknowledged but not acted on.
        if (!payment) return new Response("ignored");

        const result = await applyPaymentEvent({
          eventKey: `payment:${payment.cf_payment_id}:${payment.payment_status}`,
          orderId: parsed.data.order.order_id,
          eventType: parsed.type,
          paymentStatus: payment.payment_status,
          paymentAmount: payment.payment_amount ?? null,
          cfPaymentId: String(payment.cf_payment_id),
          payload: JSON.parse(raw),
        });
        // Always 200 for verified events (including duplicates) so Cashfree stops retrying.
        return Response.json({ received: true, outcome: result.outcome });
      },
    },
  },
});
