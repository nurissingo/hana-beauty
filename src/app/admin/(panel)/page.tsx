import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductVisual } from "@/components/ProductVisual";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getStats, listOrders, listProducts } from "@/lib/repo";
import { statusLabels } from "./labels";

export default async function Dashboard() {
  await requireAdmin();
  const stats = getStats();
  const orders = listOrders().slice(0, 6);
  const low = listProducts({ includeInactive: false, sort: "popular" }).filter((p) => p.stock <= 5).slice(0, 6);

  const cards = [
    { label: "Товаров на сайте", value: `${stats.activeProducts}`, sub: `всего ${stats.products}`, icon: "box" as const },
    { label: "Новые заказы", value: `${stats.newOrders}`, sub: `всего ${stats.orders}`, icon: "bag" as const },
    { label: "Выручка (подтв.)", value: formatPrice(stats.revenue), sub: "подтверждённые и выполненные", icon: "star" as const },
    { label: "Оптовые заявки", value: `${stats.newLeads}`, sub: "необработанные", icon: "inbox" as const },
  ];

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Обзор</h1>
          <p>Hana Beauty · управление магазином</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Icon name="plus" size={18} /> Добавить товар
        </Link>
      </div>

      <div className="stats">
        {cards.map((c) => (
          <div key={c.label} className="stat glass">
            <div className="label">
              <Icon name={c.icon} size={16} /> {c.label}
            </div>
            <div className="value">{c.value}</div>
            <div className="hint" style={{ paddingLeft: 0, marginTop: 6 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <section className="panel glass">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Последние заказы</h2>
            <Link href="/admin/orders" className="btn btn-ghost btn-sm">Все заказы</Link>
          </div>
          {orders.length === 0 ? (
            <p className="muted">Заказов пока нет. Они появятся здесь, когда покупатели оформят корзину на сайте.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><b>#{o.id}</b></td>
                      <td>
                        {o.customerName}
                        <div className="hint" style={{ paddingLeft: 0 }}>{o.phone}</div>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatPrice(o.total)}</td>
                      <td><span className={`status ${o.status}`}>{statusLabels[o.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel glass">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Заканчиваются</h2>
            <Link href="/admin/products" className="btn btn-ghost btn-sm">Все товары</Link>
          </div>
          {low.length === 0 ? (
            <p className="muted">Все товары в достаточном количестве.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <tbody>
                  {low.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/admin/products/${p.id}`} className="p-cell" style={{ minWidth: 0 }}>
                          <span className={`p-thumb tone-${p.tone}`}><ProductVisual product={p} /></span>
                          <span>
                            <b>{p.name}</b>
                            <small>{p.brand}</small>
                          </span>
                        </Link>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="status low">{p.stock} шт</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
