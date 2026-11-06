"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { placeOrder } from "@/app/actions";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { ProductVisual } from "@/components/ProductVisual";
import { formatPrice } from "@/lib/format";
import { productCount } from "@/lib/i18n";
import { useCart, useI18n } from "./Providers";

type View = "cart" | "checkout" | "success";

export function CartDrawer() {
  const { t, lang } = useI18n();
  const cart = useCart();
  const [view, setView] = useState<View>("cart");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: number; whatsapp: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart]);

  const close = () => {
    cart.setOpen(false);
    if (view === "success") setTimeout(() => setView("cart"), 400);
  };

  const submit = (form: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await placeOrder({
        items: cart.lines.map((l) => ({ id: l.id, qty: l.qty })),
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        city: String(form.get("city") ?? ""),
        comment: String(form.get("comment") ?? ""),
        website: String(form.get("website") ?? ""),
      });
      if (res.ok) {
        setResult({ id: res.id, whatsapp: res.whatsapp });
        setView("success");
        cart.clear();
      } else {
        setError(res.error === "required" ? t.cart.errorRequired : t.cart.errorGeneric);
      }
    });
  };

  const title = view === "checkout" ? t.cart.checkout : view === "success" ? t.cart.successTitle : t.cart.title;

  return (
    <>
      <div className={`drawer-backdrop ${cart.isOpen ? "open" : ""}`} onClick={close} aria-hidden="true" />
      <aside className={`drawer glass-strong ${cart.isOpen ? "open" : ""}`} aria-label={t.cart.title} aria-hidden={!cart.isOpen}>
        <div className="drawer-head">
          <h3>
            {title}
            {view === "cart" && cart.count > 0 && <small>{productCount(cart.count, lang)}</small>}
          </h3>
          <button type="button" className="icon-btn" onClick={close} aria-label={t.nav.close}>
            <Icon name="close" />
          </button>
        </div>

        {view === "success" && result ? (
          <div className="drawer-body" style={{ textAlign: "center" }}>
            <div className="success-ico">
              <Icon name="check" size={34} strokeWidth={2.2} />
            </div>
            <p className="muted" style={{ margin: "0 auto 28px", maxWidth: 340 }}>
              {t.cart.successText.replace("{id}", String(result.id))}
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              <a href={result.whatsapp} target="_blank" rel="noreferrer" className="btn btn-wa btn-block">
                <WhatsAppIcon /> {t.cart.whatsapp}
              </a>
              <button type="button" className="btn btn-glass btn-block" onClick={close}>
                {t.cart.continue}
              </button>
            </div>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="drawer-body">
            <div className="drawer-empty">
              <div className="ico">
                <Icon name="bag" size={30} />
              </div>
              <h3 className="h3">{t.cart.empty}</h3>
              <p>{t.cart.emptyText}</p>
              <Link href="/catalog" className="btn btn-primary" onClick={close}>
                {t.cart.toCatalog} <Icon name="arrow" size={18} className="ico-move" />
              </Link>
            </div>
          </div>
        ) : view === "checkout" ? (
          <form action={submit} className="drawer-body form" style={{ alignContent: "start" }}>
            <div className="field">
              <label htmlFor="c-name">{t.cart.name} *</label>
              <input id="c-name" name="name" className="input" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="c-phone">{t.cart.phone} *</label>
              <input id="c-phone" name="phone" className="input" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 7__ ___ __ __" />
            </div>
            <div className="field">
              <label htmlFor="c-city">{t.cart.city}</label>
              <input id="c-city" name="city" className="input" autoComplete="address-level2" />
            </div>
            <div className="field">
              <label htmlFor="c-comment">{t.cart.comment}</label>
              <textarea id="c-comment" name="comment" className="input" rows={3} />
            </div>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {error && <p className="form-error">{error}</p>}
            <div className="total-row" style={{ marginTop: 6 }}>
              <span>{t.cart.total}</span>
              <strong>{formatPrice(cart.total)}</strong>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
              {pending ? t.cart.sending : t.cart.submit}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setView("cart")}>
              <Icon name="back" size={16} /> {t.cart.back}
            </button>
            <p className="muted" style={{ fontSize: 13, textAlign: "center", margin: 0 }}>{t.cart.note}</p>
          </form>
        ) : (
          <>
            <div className="drawer-body">
              {cart.lines.map((line) => (
                <div className="cart-item" key={line.id}>
                  <Link href={`/product/${line.slug}`} className={`cart-thumb tone-${line.tone}`} onClick={close}>
                    <ProductVisual product={{ ...line, name: line.name }} />
                  </Link>
                  <div>
                    <div className="card-brand">{line.brand}</div>
                    <Link href={`/product/${line.slug}`} className="cart-item-name" onClick={close}>
                      {line.name}
                    </Link>
                    <div className="cart-item-row">
                      <div className="qty sm">
                        <button type="button" onClick={() => cart.setQty(line.id, line.qty - 1)} aria-label="−">
                          <Icon name="minus" size={16} />
                        </button>
                        <span>{line.qty}</span>
                        <button type="button" onClick={() => cart.setQty(line.id, line.qty + 1)} aria-label="+">
                          <Icon name="plus" size={16} />
                        </button>
                      </div>
                      <strong>{formatPrice(line.price * line.qty)}</strong>
                    </div>
                    <button type="button" className="link-btn" onClick={() => cart.remove(line.id)} style={{ marginTop: 6 }}>
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="total-row">
                <span>{t.cart.total}</span>
                <strong>{formatPrice(cart.total)}</strong>
              </div>
              <button type="button" className="btn btn-primary btn-block" onClick={() => setView("checkout")}>
                {t.cart.checkout} <Icon name="arrow" size={18} className="ico-move" />
              </button>
            </div>
          </>
        )}
      </aside>

      <div className={`toast glass-strong ${cart.toast ? "show" : ""}`} role="status" aria-live="polite">
        <span className="t-ico">
          <Icon name="check" size={16} strokeWidth={2.4} />
        </span>
        {cart.toast} — {t.product.added.toLowerCase()}
      </div>
    </>
  );
}
