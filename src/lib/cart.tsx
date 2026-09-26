import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "./products";

const CART_STORAGE_KEY = "gshoppy-cart-v1";

interface StoredCartLine {
  id: string;
  qty: number;
}

function loadStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry: StoredCartLine) => {
      const product = getProduct(entry?.id);
      const qty = Math.floor(entry?.qty);
      if (!product || !Number.isFinite(qty) || qty <= 0) return [];
      return [{ product, qty: Math.min(99, qty) }];
    });
  } catch {
    return [];
  }
}

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0);

    return {
      lines,
      count,
      subtotal,
      isOpen,
      setOpen,
      add: (product, qty = 1) => {
        const safeQty = Math.max(1, Math.min(99, Math.floor(qty)));
        setLines((prev) => {
          const existing = prev.find((l) => l.product.id === product.id);
          if (existing) {
            return prev.map((l) =>
              l.product.id === product.id
                ? { ...l, qty: Math.min(99, l.qty + safeQty) }
                : l,
            );
          }
          return [...prev, { product, qty: safeQty }];
        });
        setOpen(true);
      },
      remove: (productId) =>
        setLines((prev) => prev.filter((l) => l.product.id !== productId)),
      setQty: (productId, qty) =>
        setLines((prev) =>
          !Number.isFinite(qty) || qty <= 0
            ? prev.filter((l) => l.product.id !== productId)
            : prev.map((l) =>
                l.product.id === productId
                  ? { ...l, qty: Math.min(99, Math.floor(qty)) }
                  : l,
              ),
        ),
      clear: () => setLines([]),
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
