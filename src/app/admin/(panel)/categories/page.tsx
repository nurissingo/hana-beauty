import type { Metadata } from "next";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/repo";
import { deleteCategoryAction, updateCategoryAction } from "../../actions";
import { CategoryCreateForm } from "./CategoryCreateForm";

export const metadata: Metadata = { title: "Категории" };

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = listCategories();
  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Категории</h1>
          <p>Названия на русском и казахском языках, порядок отображения</p>
        </div>
      </div>

      <section className="panel glass">
        <h2>Новая категория</h2>
        <CategoryCreateForm />
      </section>

      <section className="panel glass">
        <h2>Все категории</h2>
        <div className="list">
          {categories.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <form action={updateCategoryAction} className="inline-form" style={{ flex: 1 }}>
                <input type="hidden" name="id" value={c.id} />
                <input name="nameRu" className="input" defaultValue={c.nameRu} aria-label="Название (RU)" required />
                <input name="nameKz" className="input" defaultValue={c.nameKz} aria-label="Название (KZ)" />
                <input name="sort" className="input" defaultValue={c.sort} aria-label="Порядок" inputMode="numeric" />
                <button className="btn btn-glass btn-sm" type="submit">
                  Сохранить <span className="hint">· {c.count} тов.</span>
                </button>
              </form>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton
                  className="icon-btn danger"
                  title="Удалить"
                  message={`Удалить категорию «${c.nameRu}»? Товары останутся, но без категории.`}
                >
                  <Icon name="trash" size={18} />
                </ConfirmButton>
              </form>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
