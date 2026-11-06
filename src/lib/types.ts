export const SHAPES = ["tube", "dropper", "pump", "jar", "pouch", "ampoule"] as const;
export const TONES = ["lime", "honey", "sage", "ivory", "blush", "olive"] as const;
export const ORDER_STATUSES = ["new", "confirmed", "shipped", "done", "cancelled"] as const;

export type Shape = (typeof SHAPES)[number];
export type Tone = (typeof TONES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Category = {
  id: number;
  slug: string;
  nameRu: string;
  nameKz: string;
  sort: number;
  count: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categoryId: number | null;
  categorySlug: string | null;
  categoryNameRu: string | null;
  categoryNameKz: string | null;
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
  createdAt: string;
  updatedAt: string;
};

export type CartProduct = Pick<
  Product,
  "id" | "slug" | "name" | "brand" | "price" | "volume" | "images" | "shape" | "tone" | "stock"
>;

export type OrderItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  qty: number;
};

export type Order = {
  id: number;
  customerName: string;
  phone: string;
  city: string;
  comment: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type Lead = {
  id: number;
  name: string;
  phone: string;
  company: string;
  message: string;
  isDone: boolean;
  createdAt: string;
};
