type CashfreeInstance = { checkout: (opts: { paymentSessionId: string; redirectTarget?: string }) => Promise<unknown> };
declare global { interface Window { Cashfree?: (opts: { mode: "sandbox" | "production" }) => CashfreeInstance } }

let loading: Promise<void> | null = null;

function loadSdk() {
  if (window.Cashfree) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve();
    s.onerror = () => { loading = null; reject(new Error("Could not load the payment page")); };
    document.head.appendChild(s);
  });
  return loading;
}

export async function openCashfreeCheckout(paymentSessionId: string, mode: "sandbox" | "production") {
  await loadSdk();
  if (!window.Cashfree) throw new Error("Payment page unavailable");
  await window.Cashfree({ mode }).checkout({ paymentSessionId, redirectTarget: "_self" });
}
