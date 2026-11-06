"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { CartProduct } from "@/lib/types";
import { useCart, useI18n } from "./Providers";

export function AddToCartIcon({ product }: { product: CartProduct }) {
  const cart = useCart();
  const { t } = useI18n();
  const inCart = cart.lines.some((l) => l.id === product.id);
  return (
    <button
      type="button"
      className={`card-add ${inCart ? "done" : ""}`}
      aria-label={t.product.addToCart}
      onClick={() => cart.add(product)}
    >
      <Icon name={inCart ? "check" : "plus"} size={20} strokeWidth={2.2} />
    </button>
  );
}

export function BuyBox({ product }: { product: CartProduct }) {
  const cart = useCart();
  const { t } = useI18n();
  const [qty, setQty] = useState(1);
  const inCart = cart.lines.some((l) => l.id === product.id);

  return (
    <div className="buy-row">
      <div className="qty">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="−">
          <Icon name="minus" size={18} />
        </button>
        <span>{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="+">
          <Icon name="plus" size={18} />
        </button>
      </div>
      <button type="button" className={`btn ${inCart ? "btn-lime" : "btn-primary"}`} style={{ flex: 1 }} onClick={() => cart.add(product, qty)}>
        <Icon name={inCart ? "check" : "bag"} size={18} /> {inCart ? t.product.added : t.product.addToCart}
      </button>
      <button
        type="button"
        className="btn btn-glass"
        onClick={() => {
          if (!inCart) cart.add(product, qty);
          cart.setOpen(true);
        }}
      >
        {t.product.buyNow}
      </button>
    </div>
  );
}
