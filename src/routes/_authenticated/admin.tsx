import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Orders dashboard — gshoppy admin" },
      { name: "description", content: "Review gshoppy orders, payment statuses, and customer details." },
      { property: "og:title", content: "Orders dashboard — gshoppy admin" },
      { property: "og:description", content: "Review gshoppy orders, payment statuses, and customer details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Item = { id: string; name: string; price: number; qty: number };
type OrderItems = { lines?: Item[]; subtotal?: number; shipping?: number };
type Order = {
  id: string; status: string; amount: number; currency: string; items: unknown;
  customer_name: string; customer_email: string; customer_phone: string;
  cf_payment_id: string | null; created_at: string; updated_at: string;
};

const STATUSES = ["all", "paid", "pending", "failed", "created"] as const;

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  if (s === "paid") return "default";
  if (s === "failed") return "destructive";
  if (s === "pending") return "secondary";
  return "outline";
}

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const role = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });

  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: role.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data as Order[];
    },
  });

  const events = useQuery({
    queryKey: ["admin-events", selected?.id],
    enabled: !!selected,
    queryFn: async () => {
      const { data } = await supabase.from("payment_events")
        .select("event_key, event_type, payment_status, received_at")
        .eq("order_id", selected!.id).order("received_at", { ascending: false });
      return data ?? [];
    },
  });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (orders.data ?? []).filter((o) =>
      (filter === "all" || o.status === filter) &&
      (!term || [o.id, o.customer_name, o.customer_email, o.customer_phone].some((v) => v.toLowerCase().includes(term))),
    );
  }, [orders.data, filter, q]);

  const stats = useMemo(() => {
    const all = orders.data ?? [];
    const paid = all.filter((o) => o.status === "paid");
    return {
      revenue: paid.reduce((s, o) => s + Number(o.amount), 0),
      paid: paid.length,
      pending: all.filter((o) => o.status === "pending" || o.status === "created").length,
      failed: all.filter((o) => o.status === "failed").length,
    };
  }, [orders.data]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (role.isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;

  if (!role.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">No admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as {user.email}, but this account isn't an admin yet.
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  const detail = (selected?.items as OrderItems | undefined) ?? {};
  const items = detail.lines ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => orders.refetch()}>Refresh</Button>
          <Button variant="ghost" onClick={signOut}>Sign out</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Paid revenue", formatPrice(stats.revenue)],
          ["Paid orders", stats.paid],
          ["Awaiting payment", stats.pending],
          ["Failed", stats.failed],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 font-display text-xl font-bold text-card-foreground">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <Input placeholder="Search order ID, name, email, phone" value={q} onChange={(e) => setQ(e.target.value)} className="md:max-w-sm" />
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="p-3">Order</th><th className="p-3">Date</th><th className="p-3">Customer</th>
              <th className="p-3">Amount</th><th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.isLoading && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading orders…</td></tr>}
            {orders.isError && <tr><td colSpan={5} className="p-6 text-center text-destructive">Couldn't load orders.</td></tr>}
            {!orders.isLoading && list.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No orders found.</td></tr>}
            {list.map((o) => (
              <tr key={o.id} className="cursor-pointer border-t border-border hover:bg-muted/50" onClick={() => setSelected(o)}>
                <td className="p-3 font-mono text-xs">{o.id}</td>
                <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleString("en-IN")}</td>
                <td className="p-3"><div className="font-medium text-foreground">{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.customer_email}</div></td>
                <td className="p-3 whitespace-nowrap">{formatPrice(Number(o.amount))}</td>
                <td className="p-3"><Badge variant={statusVariant(o.status)} className="capitalize">{o.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader><SheetTitle className="font-mono text-sm">{selected.id}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-6 text-sm">
                <section>
                  <h3 className="font-semibold text-foreground">Customer</h3>
                  <p className="mt-1">{selected.customer_name}</p>
                  <p className="text-muted-foreground">{selected.customer_email}</p>
                  <p className="text-muted-foreground">{selected.customer_phone}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">Payment</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={statusVariant(selected.status)} className="capitalize">{selected.status}</Badge>
                    <span>{formatPrice(Number(selected.amount))}</span>
                  </div>
                  {selected.cf_payment_id && <p className="mt-1 text-xs text-muted-foreground">Cashfree payment: {selected.cf_payment_id}</p>}
                  <p className="text-xs text-muted-foreground">Updated {new Date(selected.updated_at).toLocaleString("en-IN")}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">Items</h3>
                  <ul className="mt-1 space-y-1">
                    {items.map((it, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span>{it.name} × {it.qty}</span>
                        <span>{formatPrice(it.price * it.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  {detail.shipping != null && <p className="mt-2 flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatPrice(detail.shipping)}</span></p>}
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">Payment history</h3>
                  {events.isLoading ? <p className="text-muted-foreground">Loading…</p> :
                    (events.data?.length ?? 0) === 0 ? <p className="text-muted-foreground">No payment updates yet.</p> : (
                    <ul className="mt-1 space-y-2">
                      {events.data!.map((e) => (
                        <li key={e.event_key} className="rounded-lg border border-border p-2">
                          <div className="flex justify-between"><span>{e.event_type}</span><span className="text-muted-foreground">{e.payment_status}</span></div>
                          <div className="text-xs text-muted-foreground">{new Date(e.received_at).toLocaleString("en-IN")}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
