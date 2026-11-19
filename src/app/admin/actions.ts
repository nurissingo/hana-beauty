"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import {
  brandNameExists, categorySlugExists, createBrand, createCategory, createProduct,
  deleteBrand, deleteCategory, deleteLead, deleteOrder, deleteProduct, getProductById,
  setBrandHome, setLeadDone, setProductActive, slugExists, updateBrand, updateCategory,
  updateOrderStatus, updateProduct, type ProductInput,
} from "@/lib/repo";
import { ORDER_STATUSES, SHAPES, TONES, type OrderStatus, type Shape, type Tone } from "@/lib/types";
import { removeUpload, saveUpload } from "@/lib/uploads";

const attempts = new Map<string, { count: number; until: number }>();

export type FormState = { error?: string };

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.count >= 8 && entry.until > now) {
    return { error: "Слишком много попыток. Попробуйте через 15 минут." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    const next = entry && entry.until > now ? entry.count + 1 : 1;
    attempts.set(ip, { count: next, until: now + 15 * 60 * 1000 });
    await new Promise((r) => setTimeout(r, 600));
    return {
      error: process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD
        ? "ADMIN_PASSWORD не задан в переменных окружения."
        : "Неверный пароль",
    };
  }
  attempts.delete(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const str = (fd: FormData, key: string, max = 5000) => String(fd.get(key) ?? "").trim().slice(0, max);
const int = (fd: FormData, key: string) => {
  const raw = str(fd, key).replace(/\s/g, "");
  if (!raw) return null;
  const n = Math.round(Number(raw));
  return Number.isFinite(n) ? n : NaN;
};

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const id = int(fd, "id");
  const existing = id ? getProductById(id) : null;
  if (id && !existing) return { error: "Товар не найден" };

  const name = str(fd, "name", 200);
  const brand = str(fd, "brand", 80);
  const price = int(fd, "price");
  const oldPrice = int(fd, "oldPrice");
  const stock = int(fd, "stock");
  const categoryRaw = int(fd, "categoryId");

  if (!name) return { error: "Укажите название товара" };
  if (price === null || Number.isNaN(price) || price < 0) return { error: "Укажите корректную цену" };
  if (oldPrice !== null && (Number.isNaN(oldPrice) || oldPrice < 0)) return { error: "Старая цена указана неверно" };
  if (stock !== null && Number.isNaN(stock)) return { error: "Остаток указан неверно" };

  let slug = slugify(str(fd, "slug", 120) || `${brand} ${name}`) || `product-${Date.now()}`;
  if (slugExists(slug, existing?.id)) {
    let n = 2;
    while (slugExists(`${slug}-${n}`, existing?.id)) n++;
    slug = `${slug}-${n}`;
  }

  const kept = fd
    .getAll("keepImages")
    .map(String)
    .filter((u) => existing?.images.includes(u));

  const urls = str(fd, "imageUrls", 4000)
    .split(/\s+/)
    .filter((u) => /^https?:\/\/\S+$/i.test(u))
    .slice(0, 10);

  const files = fd.getAll("newImages").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: string[] = [];
  try {
    for (const file of files.slice(0, 12)) uploaded.push(await saveUpload(file));
  } catch (error) {
    await Promise.all(uploaded.map(removeUpload));
    return { error: error instanceof Error ? error.message : "Не удалось загрузить фото" };
  }

  const shape = SHAPES.includes(str(fd, "shape") as Shape) ? (str(fd, "shape") as Shape) : "tube";
  const tone = TONES.includes(str(fd, "tone") as Tone) ? (str(fd, "tone") as Tone) : "lime";

  const input: ProductInput = {
    slug,
    name,
    brand,
    categoryId: categoryRaw && !Number.isNaN(categoryRaw) ? categoryRaw : null,
    price,
    oldPrice: oldPrice && oldPrice > 0 ? oldPrice : null,
    volume: str(fd, "volume", 60),
    shortDesc: str(fd, "shortDesc", 300),
    description: str(fd, "description"),
    usage: str(fd, "usage"),
    ingredients: str(fd, "ingredients"),
    skinType: str(fd, "skinType", 120),
    images: [...kept, ...uploaded, ...urls],
    stock: stock ?? 0,
    isActive: fd.get("isActive") === "on",
    isFeatured: fd.get("isFeatured") === "on",
    isNew: fd.get("isNew") === "on",
    shape,
    tone,
  };

  if (existing) {
    updateProduct(existing.id, input);
    await Promise.all(existing.images.filter((u) => !input.images.includes(u)).map(removeUpload));
  } else {
    createProduct(input);
  }

  refreshSite();
  redirect(`/admin/products?saved=${encodeURIComponent(name)}`);
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const product = getProductById(id);
  if (!product) return;
  deleteProduct(id);
  await Promise.all(product.images.map(removeUpload));
  refreshSite();
  if (fd.get("redirect")) redirect("/admin/products");
}

export async function toggleProductAction(fd: FormData) {
  await requireAdmin();
  setProductActive(Number(fd.get("id")), fd.get("active") === "1");
  refreshSite();
}

export async function createCategoryAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const nameRu = str(fd, "nameRu", 80);
  const nameKz = str(fd, "nameKz", 80) || nameRu;
  if (!nameRu) return { error: "Укажите название" };
  let slug = slugify(str(fd, "slug", 60) || nameRu) || `cat-${Date.now()}`;
  if (categorySlugExists(slug)) slug = `${slug}-${Date.now().toString(36)}`;
  createCategory({ slug, nameRu, nameKz, sort: int(fd, "sort") || 0 });
  refreshSite();
  return {};
}

export async function updateCategoryAction(fd: FormData) {
  await requireAdmin();
  const nameRu = str(fd, "nameRu", 80);
  if (!nameRu) return;
  updateCategory(Number(fd.get("id")), { nameRu, nameKz: str(fd, "nameKz", 80) || nameRu, sort: int(fd, "sort") || 0 });
  refreshSite();
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin();
  deleteCategory(Number(fd.get("id")));
  refreshSite();
}

export async function createBrandAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(fd, "name", 80);
  if (!name) return { error: "Укажите название бренда" };
  if (brandNameExists(name)) return { error: "Такой бренд уже есть" };
  createBrand(name, int(fd, "sort") || 0, fd.get("showHome") === "1");
  refreshSite();
  return {};
}

export async function createBrandQuickAction(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name", 80);
  if (!name || brandNameExists(name)) return;
  createBrand(name, int(fd, "sort") || 0, fd.get("showHome") === "1");
  refreshSite();
}

export async function updateBrandAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const name = str(fd, "name", 80);
  if (!id || !name) return;
  if (brandNameExists(name, id)) return;
  updateBrand(id, {
    name,
    sort: int(fd, "sort") || 0,
    showHome: fd.get("showHome") === "1",
  });
  refreshSite();
}

export async function toggleBrandHomeAction(fd: FormData) {
  await requireAdmin();
  setBrandHome(Number(fd.get("id")), fd.get("home") === "1");
  refreshSite();
}

export async function deleteBrandAction(fd: FormData) {
  await requireAdmin();
  deleteBrand(Number(fd.get("id")));
  refreshSite();
}

export async function setOrderStatusAction(fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return;
  updateOrderStatus(Number(fd.get("id")), status);
  revalidatePath("/admin", "layout");
}

export async function deleteOrderAction(fd: FormData) {
  await requireAdmin();
  deleteOrder(Number(fd.get("id")));
  revalidatePath("/admin", "layout");
}

export async function toggleLeadAction(fd: FormData) {
  await requireAdmin();
  setLeadDone(Number(fd.get("id")), fd.get("done") === "1");
  revalidatePath("/admin", "layout");
}

export async function deleteLeadAction(fd: FormData) {
  await requireAdmin();
  deleteLead(Number(fd.get("id")));
  revalidatePath("/admin", "layout");
}
