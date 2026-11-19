import type { Metadata } from "next";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { listBrands, listManagedBrands } from "@/lib/repo";
import {
  createBrandQuickAction,
  deleteBrandAction,
  toggleBrandHomeAction,
  updateBrandAction,
} from "../../actions";
import { BrandCreateForm } from "./BrandCreateForm";

export const metadata: Metadata = { title: "Бренды" };

export default async function BrandsPage() {
  await requireAdmin();
  const managed = listManagedBrands();
  const productBrands = listBrands();
  const managedNames = new Set(managed.map((b) => b.name.toLowerCase()));
  const suggestions = productBrands.map((b) => b.brand).filter((b) => !managedNames.has(b.toLowerCase()));
  const homeCount = managed.filter((b) => b.showHome).length;

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Бренды</h1>
          <p>
            На главной — до 8 брендов с галочкой «На главной» · сейчас {homeCount}
          </p>
        </div>
      </div>

      <section className="panel glass">
        <h2>Добавить бренд</h2>
        <p className="muted" style={{ marginTop: -8, marginBottom: 14, fontSize: 14 }}>
          Название лучше совпадать с полем «Бренд» у товаров — тогда счётчик верный.
        </p>
        <BrandCreateForm suggestions={suggestions} />
        {suggestions.length > 0 && (
          <div className="brand-suggestions">
            <span className="hint" style={{ paddingLeft: 0 }}>Из товаров ещё не в списке:</span>
            <div className="filters" style={{ marginBottom: 0 }}>
              {suggestions.slice(0, 16).map((name) => (
                <form key={name} action={createBrandQuickAction}>
                  <input type="hidden" name="name" value={name} />
                  <input type="hidden" name="showHome" value={homeCount < 8 ? "1" : "0"} />
                  <input type="hidden" name="sort" value={managed.length} />
                  <button type="submit" className="chip-link">+ {name}</button>
                </form>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="panel glass">
        <h2>Список брендов</h2>
        {managed.length === 0 ? (
          <p className="muted">Пока пусто — добавьте бренды выше.</p>
        ) : (
          <div className="list">
            {managed.map((b) => (
              <div key={b.id} className="brand-admin-row">
                <form action={updateBrandAction} className="inline-form brand-edit-form">
                  <input type="hidden" name="id" value={b.id} />
                  <input name="name" className="input" defaultValue={b.name} required aria-label="Название" />
                  <input name="sort" className="input" defaultValue={b.sort} aria-label="Порядок" inputMode="numeric" />
                  <label className="switch brand-home-switch">
                    <span>На главной</span>
                    <input type="checkbox" name="showHome" value="1" defaultChecked={b.showHome} />
                  </label>
                  <button className="btn btn-glass btn-sm" type="submit">
                    Сохранить <span className="hint">· {b.count} тов.</span>
                  </button>
                </form>
                <form action={toggleBrandHomeAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="home" value={b.showHome ? "0" : "1"} />
                  <button className={`chip-link ${b.showHome ? "on" : ""}`} type="submit">
                    {b.showHome ? "На сайте" : "Скрыт"}
                  </button>
                </form>
                <form action={deleteBrandAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <ConfirmButton
                    className="icon-btn danger"
                    title="Удалить"
                    message={`Удалить бренд «${b.name}» из списка? Товары не удалятся.`}
                  >
                    <Icon name="trash" size={18} />
                  </ConfirmButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
