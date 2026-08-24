'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type CartLine = {
  id: number;
  handle: string;
  name: string;
  pricePence: number;
  image: string | null;
  qty: number;
};

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotalPence: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, 'qty'>, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = 'moves_cart_v1';
const CartCtx = createContext<CartValue | null>(null);

export function useCart(): CartValue {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist after hydration so we never overwrite storage with the empty
  // initial state before the load effect has run.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full / unavailable — cart still works for the session */
    }
  }, [lines, hydrated]);

  const add: CartValue['add'] = (line, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (existing) {
        return prev.map((l) => (l.id === line.id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { ...line, qty }];
    });
    setOpen(true);
  };

  const setQty: CartValue['setQty'] = (id, qty) =>
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );

  const remove: CartValue['remove'] = (id) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setLines([]);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotalPence = lines.reduce((s, l) => s + l.pricePence * l.qty, 0);
    return { lines, count, subtotalPence, open, setOpen, add, setQty, remove, clear };
  }, [lines, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

/** Pence → "£2,400.00" (client-safe; the server has its own formatter). */
export function formatPence(pence: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}
