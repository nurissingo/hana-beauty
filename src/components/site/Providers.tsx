"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode,
} from "react";
import type { Dict, Lang } from "@/lib/i18n";
import type { CartProduct } from "@/lib/types";

type I18n = { lang: Lang; t: Dict };
const I18nContext = createContext<I18n | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}

export type CartLine = CartProduct & { qty: number };

type Cart = {
  lines: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: CartProduct, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  toast: string | null;
};

const CartContext = createContext<Cart | null>(null);
const STORAGE_KEY = "hb_cart_v1";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;

function readCart(): CartLine[] {
  if (cache === null) {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      cache = Array.isArray(parsed) ? parsed : [];
    } catch {
      cache = [];
    }
  }
  return cache!;
}

function writeCart(update: (prev: CartLine[]) => CartLine[]) {
  cache = update(readCart());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribeCart(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

export function Providers({ lang, t, children }: I18n & { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribeCart, readCart, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const add = useCallback((product: CartProduct, qty = 1) => {
    writeCart((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) => (l.id === product.id ? { ...l, ...product, qty: Math.min(99, l.qty + qty) } : l));
      }
      return [...prev, { ...product, qty }];
    });
    setToast(product.name);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    writeCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((id: number) => writeCart((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => writeCart(() => []), []);

  const cart = useMemo<Cart>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
    return { lines, count, total, ready, isOpen, setOpen, add, setQty, remove, clear, toast };
  }, [lines, ready, isOpen, add, setQty, remove, clear, toast]);

  const i18n = useMemo(() => ({ lang, t }), [lang, t]);

  return (
    <I18nContext.Provider value={i18n}>
      <CartContext.Provider value={cart}>{children}</CartContext.Provider>
    </I18nContext.Provider>
  );
}
