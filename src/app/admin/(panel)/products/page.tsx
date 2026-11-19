import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Icon } from "@/components/Icon";
import { ProductVisual } from "@/components/ProductVisual";
import { AutoSelect } from "@/components/site/AutoSelect";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { listCategories, listProducts } from "@/lib/repo";
import { deleteProductAction, toggleProductAction } from "../../actions";

export const metadata: Metadata = { title: "Товары" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const saved = typeof sp.saved === "string" ? sp.saved : "";
  const products = listProducts({ q, category, includeInactive: true, sort: "new" });
  const categories = listCategories();

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Товары</h1>
          <p>{products.length} в списке</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Icon name="plus" size={18} /> Добавить товар
        </Link>
      </div>

      {saved && (
        <div className="notice">
          <Icon name="check" size={18} strokeWidth={2.2} /> Товар «{saved}» сохранён
        </div>
      )}

      <section className="panel glass">
        <form className="toolbar" style={{ padding: 0, marginBottom: 12 }} key={`${q}|${category}`}>
          <label className="toolbar-search">
            <Icon name="search" size={18} className="muted" />
            <input name="q" defaultValue={q} placeholder="Поиск по названию или бренду" />
          </label>
          <AutoSelect name="category" defaultValue={category} className="select">
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.nameRu}</option>
            ))}
          </AutoSelect>
        </form>

        {products.length === 0 ? (
          <p className="muted" style={{ padding: "20px 0" }}>
            Товары не найдены. <Link href="/admin/products/new" style={{ textDecoration: "underline" }}>Добавить первый товар</Link>
          </p>
        ) : (
          <>
            <div className="admin-product-cards">
              {products.map((p) => (
                <article key={p.id} className={`admin-product-card ${p.isActive ? "" : "dim"}`}>
                  <Link href={`/admin/products/${p.id}`} className="p-cell">
                    <span className={`p-thumb tone-${p.tone}`}><ProductVisual product={p} /></span>
                    <span>
                      <b>{p.name}</b>
                      <small>
                        {p.brand}
                        {p.volume ? ` · ${p.volume}` : ""}
                      </small>
                      <small className="admin-product-meta">
                        {p.categoryNameRu ?? "Без категории"} · {formatPrice(p.price)} · {p.stock} шт
                      </small>
                      <span className={`status ${p.isActive ? "on" : "off"}`}>{p.isActive ? "На сайте" : "Скрыт"}</span>
                    </span>
                  </Link>
                  <div className="row-actions">
                    <form action={toggleProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="active" value={p.isActive ? "0" : "1"} />
                      <button className="icon-btn" type="submit" title={p.isActive ? "Скрыть" : "Показать"}>
                        <Icon name={p.isActive ? "eye" : "eyeOff"} size={18} />
                      </button>
                    </form>
                    <Link href={`/admin/products/${p.id}`} className="icon-btn" title="Редактировать">
                      <Icon name="edit" size={18} />
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton className="icon-btn danger" type="submit" title="Удалить" message={`Удалить «${p.name}»?`}>
                        <Icon name="trash" size={18} />
                      </ConfirmButton>
                    </form>
                  </div>
                </article>
              ))}
            </div>

            <div className="table-wrap admin-desktop-only">
              <table className="table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className={p.isActive ? "" : "dim"}>
                      <td>
                        <Link href={`/admin/products/${p.id}`} className="p-cell">
                          <span className={`p-thumb tone-${p.tone}`}><ProductVisual product={p} /></span>
                          <span>
                            <b>{p.name}</b>
                            <small>
                              {p.brand}
                              {p.volume ? ` · ${p.volume}` : ""}
                              {p.isFeatured ? " · Хит" : ""}
                              {p.isNew ? " · Новинка" : ""}
                            </small>
                          </span>
                        </Link>
                      </td>
                      <td>{p.categoryNameRu ?? <span className="muted">—</span>}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <b>{formatPrice(p.price)}</b>
                        {p.oldPrice ? <div className="hint" style={{ paddingLeft: 0, textDecoration: "line-through" }}>{formatPrice(p.oldPrice)}</div> : null}
                      </td>
                      <td>
                        <span className={`status ${p.stock <= 5 ? "low" : ""}`}>{p.stock} шт</span>
                      </td>
                      <td>
                        <span className={`status ${p.isActive ? "on" : "off"}`}>{p.isActive ? "На сайте" : "Скрыт"}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <form action={toggleProductAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="active" value={p.isActive ? "0" : "1"} />
                            <button className="icon-btn" type="submit" title={p.isActive ? "Скрыть с сайта" : "Показать на сайте"}>
                              <Icon name={p.isActive ? "eye" : "eyeOff"} size={18} />
                            </button>
                          </form>
                          <Link href={`/admin/products/${p.id}`} className="icon-btn" title="Редактировать">
                            <Icon name="edit" size={18} />
                          </Link>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <ConfirmButton className="icon-btn danger" type="submit" title="Удалить" message={`Удалить «${p.name}»? Это действие нельзя отменить.`}>
                              <Icon name="trash" size={18} />
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
