import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { getProductById, listCategories } from "@/lib/repo";
import { deleteProductAction } from "../../../actions";

export const metadata: Metadata = { title: "Редактирование товара" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>{product.name}</h1>
          <p>{product.brand} · ID {product.id}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {product.isActive && (
            <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-glass btn-sm">
              <Icon name="external" size={16} /> На сайте
            </Link>
          )}
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="redirect" value="1" />
            <ConfirmButton className="btn btn-glass btn-sm" message={`Удалить «${product.name}»?`}>
              <Icon name="trash" size={16} /> Удалить
            </ConfirmButton>
          </form>
        </div>
      </div>
      <ProductForm categories={listCategories()} product={product} />
    </>
  );
}
