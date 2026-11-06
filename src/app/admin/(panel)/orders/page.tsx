import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { AutoSelect } from "@/components/site/AutoSelect";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { listOrders } from "@/lib/repo";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { deleteOrderAction, setOrderStatusAction } from "../../actions";
import { statusLabels } from "../labels";

export const metadata: Metadata = { title: "Заказы" };

function waLink(phone: string, text: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10) digits = `7${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function formatDate(value: string) {
  const d = new Date(`${value.replace(" ", "T")}Z`);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty" });
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const current = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const orders = listOrders(current);

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Заказы</h1>
          <p>Заявки из корзины на сайте</p>
        </div>
      </div>

      <div className="filters">
        <Link href="/admin/orders" className={`chip-link ${!current ? "on" : ""}`}>Все</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`chip-link ${current === s ? "on" : ""}`}>
            {statusLabels[s]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <section className="panel glass">
          <p className="muted">Заказов нет.</p>
        </section>
      ) : (
        <div className="list">
          {orders.map((o) => (
            <article key={o.id} className="order">
              <div className="order-head">
                <h3>Заказ #{o.id}</h3>
                <span className={`status ${o.status}`}>{statusLabels[o.status]}</span>
                <span className="meta">{formatDate(o.createdAt)}</span>
                <strong style={{ marginLeft: "auto", fontSize: 18 }}>{formatPrice(o.total)}</strong>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14.5 }}>
                <span><Icon name="user" size={15} className="muted" /> {o.customerName}</span>
                <a href={`tel:${o.phone}`}><Icon name="phone" size={15} className="muted" /> {o.phone}</a>
                {o.city && <span>📍 {o.city}</span>}
              </div>
              {o.comment && <p className="muted" style={{ margin: "8px 0 0", fontSize: 14 }}>«{o.comment}»</p>}
              <div className="order-items">
                {o.items.map((i) => (
                  <div key={i.id}>
                    <span>{i.brand} {i.name} × {i.qty}</span>
                    <span style={{ whiteSpace: "nowrap" }}>{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="order-foot">
                <form action={setOrderStatusAction}>
                  <input type="hidden" name="id" value={o.id} />
                  <AutoSelect name="status" defaultValue={o.status} className="select" key={o.status}>
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </AutoSelect>
                </form>
                <a
                  className="btn btn-wa btn-sm"
                  target="_blank"
                  rel="noreferrer"
                  href={waLink(o.phone, `Здравствуйте, ${o.customerName}! Это Hana Beauty, по вашему заказу #${o.id} на ${formatPrice(o.total)}.`)}
                >
                  <WhatsAppIcon size={16} /> Написать
                </a>
                <form action={deleteOrderAction} style={{ marginLeft: "auto" }}>
                  <input type="hidden" name="id" value={o.id} />
                  <ConfirmButton className="icon-btn danger" title="Удалить" message={`Удалить заказ #${o.id}?`}>
                    <Icon name="trash" size={18} />
                  </ConfirmButton>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
