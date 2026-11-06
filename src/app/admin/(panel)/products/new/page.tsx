import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/repo";

export const metadata: Metadata = { title: "Новый товар" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Новый товар</h1>
          <p>Заполните карточку — товар сразу появится на сайте</p>
        </div>
      </div>
      <ProductForm categories={listCategories()} />
    </>
  );
}
