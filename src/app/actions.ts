"use server";

import { cookies } from "next/headers";
import { whatsappUrl } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { isLang, LANG_COOKIE } from "@/lib/i18n";
import { createLead, createOrder, getProductsByIds } from "@/lib/repo";

export async function setLanguage(lang: string) {
  if (!isLang(lang)) return;
  (await cookies()).set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}

const clean = (value: unknown, max = 500) => String(value ?? "").trim().slice(0, max);

export type PlaceOrderInput = {
  items: { id: number; qty: number }[];
  name: string;
  phone: string;
  city: string;
  comment: string;
  website?: string;
};

export type PlaceOrderResult =
  | { ok: true; id: number; whatsapp: string }
  | { ok: false; error: "required" | "empty" | "generic" };

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  try {
    if (input.website) return { ok: false, error: "generic" };
    const name = clean(input.name, 120);
    const phone = clean(input.phone, 40);
    if (!name || phone.replace(/\D/g, "").length < 6) return { ok: false, error: "required" };

    const wanted = new Map<number, number>();
    for (const item of input.items ?? []) {
      const id = Number(item.id);
      const qty = Math.min(99, Math.max(1, Math.floor(Number(item.qty) || 0)));
      if (Number.isInteger(id) && id > 0) wanted.set(id, (wanted.get(id) ?? 0) + qty);
    }
    const products = getProductsByIds([...wanted.keys()]);
    if (!products.length) return { ok: false, error: "empty" };

    const items = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      qty: wanted.get(p.id) ?? 1,
    }));
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const city = clean(input.city, 120);
    const comment = clean(input.comment, 1000);

    const id = createOrder({ customerName: name, phone, city, comment, items, total });

    // Keep WhatsApp URL short — long wa.me links often fail on mobile browsers
    const message = `Здравствуйте! Заказ #${id} с сайта Hana Beauty (${formatPrice(total)}). Имя: ${name}, тел: ${phone}`;

    return { ok: true, id, whatsapp: whatsappUrl(message) };
  } catch (error) {
    console.error("placeOrder failed", error);
    return { ok: false, error: "generic" };
  }
}

export type LeadState = { status: "idle" | "ok" | "error" };

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (formData.get("website")) return { status: "ok" };
  const name = clean(formData.get("name"), 120);
  const phone = clean(formData.get("phone"), 40);
  if (!name || phone.replace(/\D/g, "").length < 6) return { status: "error" };
  createLead({
    name,
    phone,
    company: clean(formData.get("company"), 200),
    message: clean(formData.get("message"), 2000),
  });
  return { status: "ok" };
}
