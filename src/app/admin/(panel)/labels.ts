import type { OrderStatus, Shape, Tone } from "@/lib/types";

export const statusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  shipped: "Отправлен",
  done: "Выполнен",
  cancelled: "Отменён",
};

export const shapeLabels: Record<Shape, string> = {
  tube: "Туба",
  dropper: "Пипетка",
  pump: "Помпа",
  jar: "Баночка",
  pouch: "Маска",
  ampoule: "Ампула",
};

export const toneLabels: Record<Tone, { label: string; color: string }> = {
  lime: { label: "Лайм", color: "#cbd16b" },
  honey: { label: "Мёд", color: "#e8b52f" },
  sage: { label: "Шалфей", color: "#a9b48b" },
  ivory: { label: "Айвори", color: "#efe9d6" },
  blush: { label: "Пудра", color: "#e8c8b2" },
  olive: { label: "Олива", color: "#59633a" },
};
