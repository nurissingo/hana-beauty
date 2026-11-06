import "server-only";
import { getDb } from "./db";
import { buildSearch, normalizeSearch } from "./search";
import type {
  Category, Lead, Order, OrderItem, OrderStatus, Product, Shape, Tone,
} from "./types";

type Row = Record<string, unknown>;

const productSelect = `
  SELECT p.*, c.slug AS category_slug, c.name_ru AS category_name_ru, c.name_kz AS category_name_kz
  FROM products p LEFT JOIN categories c ON c.id = p.category_id
`;

function toProduct(r: Row): Product {
  let images: string[] = [];
  try {
    images = JSON.parse(String(r.images ?? "[]"));
  } catch {
    images = [];
  }
  return {
    id: Number(r.id),
    slug: String(r.slug),
    name: String(r.name),
    brand: String(r.brand ?? ""),
    categoryId: r.category_id == null ? null : Number(r.category_id),
    categorySlug: (r.category_slug as string) ?? null,
    categoryNameRu: (r.category_name_ru as string) ?? null,
    categoryNameKz: (r.category_name_kz as string) ?? null,
    price: Number(r.price),
    oldPrice: r.old_price == null ? null : Number(r.old_price),
    volume: String(r.volume ?? ""),
    shortDesc: String(r.short_desc ?? ""),
    description: String(r.description ?? ""),
    usage: String(r.usage ?? ""),
    ingredients: String(r.ingredients ?? ""),
    skinType: String(r.skin_type ?? ""),
    images,
    stock: Number(r.stock ?? 0),
    isActive: Boolean(r.is_active),
    isFeatured: Boolean(r.is_featured),
    isNew: Boolean(r.is_new),
    shape: String(r.shape) as Shape,
    tone: String(r.tone) as Tone,
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  };
}

export type ProductQuery = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: "popular" | "new" | "price-asc" | "price-desc";
  featured?: boolean;
  isNew?: boolean;
  limit?: number;
  includeInactive?: boolean;
  excludeId?: number;
};

export function listProducts(query: ProductQuery = {}): Product[] {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (!query.includeInactive) where.push("p.is_active = 1");
  if (query.q) {
    where.push("p.search LIKE ? ESCAPE '\\'");
    params.push(`%${normalizeSearch(query.q).replace(/[\\%_]/g, (m) => `\\${m}`)}%`);
  }
  if (query.category) {
    where.push("c.slug = ?");
    params.push(query.category);
  }
  if (query.brand) {
    where.push("p.brand = ?");
    params.push(query.brand);
  }
  if (query.featured) where.push("p.is_featured = 1");
  if (query.isNew) where.push("p.is_new = 1");
  if (query.excludeId) {
    where.push("p.id != ?");
    params.push(query.excludeId);
  }

  const order = {
    popular: "p.is_featured DESC, p.stock > 0 DESC, p.id ASC",
    new: "p.is_new DESC, p.created_at DESC, p.id DESC",
    "price-asc": "p.price ASC",
    "price-desc": "p.price DESC",
  }[query.sort ?? "popular"];

  const sql = `${productSelect} ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${order} ${query.limit ? `LIMIT ${Math.floor(query.limit)}` : ""}`;
  return (getDb().prepare(sql).all(...params) as Row[]).map(toProduct);
}

export function getProductBySlug(slug: string) {
  const row = getDb().prepare(`${productSelect} WHERE p.slug = ? AND p.is_active = 1`).get(slug) as Row | undefined;
  return row ? toProduct(row) : null;
}

export function getProductById(id: number) {
  const row = getDb().prepare(`${productSelect} WHERE p.id = ?`).get(id) as Row | undefined;
  return row ? toProduct(row) : null;
}

export function getProductsByIds(ids: number[]) {
  if (!ids.length) return [];
  const marks = ids.map(() => "?").join(",");
  return (getDb().prepare(`${productSelect} WHERE p.id IN (${marks}) AND p.is_active = 1`).all(...ids) as Row[]).map(toProduct);
}

export function listBrands(): { brand: string; count: number }[] {
  return getDb()
    .prepare("SELECT brand, COUNT(*) AS count FROM products WHERE is_active = 1 AND brand != '' GROUP BY brand ORDER BY count DESC, brand")
    .all()
    .map((r) => ({ brand: String(r.brand), count: Number(r.count) }));
}

export type ProductInput = {
  slug: string;
  name: string;
  brand: string;
  categoryId: number | null;
  price: number;
  oldPrice: number | null;
  volume: string;
  shortDesc: string;
  description: string;
  usage: string;
  ingredients: string;
  skinType: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  shape: Shape;
  tone: Tone;
};

function productParams(p: ProductInput) {
  return [
    p.slug, p.name, p.brand, p.categoryId, p.price, p.oldPrice, p.volume, p.shortDesc,
    p.description, p.usage, p.ingredients, p.skinType, JSON.stringify(p.images), p.stock,
    p.isActive ? 1 : 0, p.isFeatured ? 1 : 0, p.isNew ? 1 : 0, p.shape, p.tone,
    buildSearch(p.name, p.brand, p.shortDesc, p.volume),
  ];
}

export function slugExists(slug: string, exceptId?: number) {
  const row = getDb().prepare("SELECT id FROM products WHERE slug = ?").get(slug) as Row | undefined;
  return Boolean(row && Number(row.id) !== exceptId);
}

export function createProduct(p: ProductInput) {
  const res = getDb().prepare(`
    INSERT INTO products (slug, name, brand, category_id, price, old_price, volume, short_desc,
      description, usage, ingredients, skin_type, images, stock, is_active, is_featured, is_new,
      shape, tone, search)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(...productParams(p));
  return Number(res.lastInsertRowid);
}

export function updateProduct(id: number, p: ProductInput) {
  getDb().prepare(`
    UPDATE products SET slug = ?, name = ?, brand = ?, category_id = ?, price = ?, old_price = ?,
      volume = ?, short_desc = ?, description = ?, usage = ?, ingredients = ?, skin_type = ?,
      images = ?, stock = ?, is_active = ?, is_featured = ?, is_new = ?, shape = ?, tone = ?,
      search = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(...productParams(p), id);
}

export function setProductActive(id: number, active: boolean) {
  getDb().prepare("UPDATE products SET is_active = ?, updated_at = datetime('now') WHERE id = ?").run(active ? 1 : 0, id);
}

export function deleteProduct(id: number) {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function listCategories(): Category[] {
  return getDb()
    .prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) AS count
      FROM categories c ORDER BY c.sort, c.id
    `)
    .all()
    .map((r) => ({
      id: Number(r.id),
      slug: String(r.slug),
      nameRu: String(r.name_ru),
      nameKz: String(r.name_kz),
      sort: Number(r.sort),
      count: Number(r.count),
    }));
}

export function createCategory(c: { slug: string; nameRu: string; nameKz: string; sort: number }) {
  getDb().prepare("INSERT INTO categories (slug, name_ru, name_kz, sort) VALUES (?, ?, ?, ?)").run(c.slug, c.nameRu, c.nameKz, c.sort);
}

export function updateCategory(id: number, c: { nameRu: string; nameKz: string; sort: number }) {
  getDb().prepare("UPDATE categories SET name_ru = ?, name_kz = ?, sort = ? WHERE id = ?").run(c.nameRu, c.nameKz, c.sort, id);
}

export function deleteCategory(id: number) {
  getDb().prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function categorySlugExists(slug: string) {
  return Boolean(getDb().prepare("SELECT id FROM categories WHERE slug = ?").get(slug));
}

function toOrder(r: Row): Order {
  return {
    id: Number(r.id),
    customerName: String(r.customer_name),
    phone: String(r.phone),
    city: String(r.city ?? ""),
    comment: String(r.comment ?? ""),
    items: JSON.parse(String(r.items)) as OrderItem[],
    total: Number(r.total),
    status: String(r.status) as OrderStatus,
    createdAt: String(r.created_at),
  };
}

export function createOrder(o: Omit<Order, "id" | "status" | "createdAt">) {
  const res = getDb()
    .prepare("INSERT INTO orders (customer_name, phone, city, comment, items, total) VALUES (?, ?, ?, ?, ?, ?)")
    .run(o.customerName, o.phone, o.city, o.comment, JSON.stringify(o.items), o.total);
  return Number(res.lastInsertRowid);
}

export function listOrders(status?: OrderStatus): Order[] {
  const rows = status
    ? getDb().prepare("SELECT * FROM orders WHERE status = ? ORDER BY id DESC").all(status)
    : getDb().prepare("SELECT * FROM orders ORDER BY id DESC").all();
  return (rows as Row[]).map(toOrder);
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
}

export function deleteOrder(id: number) {
  getDb().prepare("DELETE FROM orders WHERE id = ?").run(id);
}

export function createLead(l: { name: string; phone: string; company: string; message: string }) {
  getDb().prepare("INSERT INTO leads (name, phone, company, message) VALUES (?, ?, ?, ?)").run(l.name, l.phone, l.company, l.message);
}

export function listLeads(): Lead[] {
  return (getDb().prepare("SELECT * FROM leads ORDER BY is_done ASC, id DESC").all() as Row[]).map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    phone: String(r.phone),
    company: String(r.company ?? ""),
    message: String(r.message ?? ""),
    isDone: Boolean(r.is_done),
    createdAt: String(r.created_at),
  }));
}

export function setLeadDone(id: number, done: boolean) {
  getDb().prepare("UPDATE leads SET is_done = ? WHERE id = ?").run(done ? 1 : 0, id);
}

export function deleteLead(id: number) {
  getDb().prepare("DELETE FROM leads WHERE id = ?").run(id);
}

export function getStats() {
  const db = getDb();
  const one = (sql: string) => Number((db.prepare(sql).get() as Row).n ?? 0);
  return {
    products: one("SELECT COUNT(*) AS n FROM products"),
    activeProducts: one("SELECT COUNT(*) AS n FROM products WHERE is_active = 1"),
    lowStock: one("SELECT COUNT(*) AS n FROM products WHERE is_active = 1 AND stock <= 5"),
    newOrders: one("SELECT COUNT(*) AS n FROM orders WHERE status = 'new'"),
    orders: one("SELECT COUNT(*) AS n FROM orders"),
    revenue: one("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status IN ('confirmed','shipped','done')"),
    newLeads: one("SELECT COUNT(*) AS n FROM leads WHERE is_done = 0"),
  };
}
