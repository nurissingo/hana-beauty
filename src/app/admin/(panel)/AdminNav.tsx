"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";

export function AdminNav({ newOrders, newLeads }: { newOrders: number; newLeads: number }) {
  const pathname = usePathname();
  const items: { href: string; label: string; icon: IconName; badge?: number; exact?: boolean }[] = [
    { href: "/admin", label: "Обзор", icon: "grid", exact: true },
    { href: "/admin/products", label: "Товары", icon: "box", exact: true },
    { href: "/admin/products/new", label: "Добавить товар", icon: "plus" },
    { href: "/admin/categories", label: "Категории", icon: "tag" },
    { href: "/admin/orders", label: "Заказы", icon: "bag", badge: newOrders },
    { href: "/admin/leads", label: "Оптовые заявки", icon: "inbox", badge: newLeads },
  ];

  const isOn = (href: string, exact?: boolean) =>
    exact ? pathname === href || (href === "/admin/products" && /^\/admin\/products\/\d+/.test(pathname)) : pathname.startsWith(href);

  return (
    <nav className="admin-nav">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={isOn(item.href, item.exact) ? "on" : ""}>
          <Icon name={item.icon} size={18} />
          {item.label}
          {item.badge ? <span className="n">{item.badge}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
