"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/site/Header";
import { logout } from "../actions";

const items: { href: string; label: string; short: string; icon: IconName; badge?: "orders" | "leads"; exact?: boolean }[] = [
  { href: "/admin", label: "Обзор", short: "Обзор", icon: "grid", exact: true },
  { href: "/admin/products", label: "Товары", short: "Товары", icon: "box", exact: true },
  { href: "/admin/orders", label: "Заказы", short: "Заказы", icon: "bag", badge: "orders" },
  { href: "/admin/leads", label: "Заявки", short: "Заявки", icon: "inbox", badge: "leads" },
  { href: "/admin/categories", label: "Категории", short: "Катег.", icon: "tag" },
  { href: "/admin/brands", label: "Бренды", short: "Бренд", icon: "star" },
];

export function AdminNav({ newOrders, newLeads }: { newOrders: number; newLeads: number }) {
  const pathname = usePathname();
  const badgeOf = (key?: "orders" | "leads") =>
    key === "orders" ? newOrders : key === "leads" ? newLeads : 0;

  const isOn = (href: string, exact?: boolean) =>
    exact
      ? pathname === href || (href === "/admin/products" && /^\/admin\/products\/\d+/.test(pathname))
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <aside className="admin-side glass">
        <Logo />
        <nav className="admin-nav">
          {items.map((item) => (
            <AdminNavLink key={item.href} href={item.href} className={isOn(item.href, item.exact) ? "on" : ""}>
              <Icon name={item.icon} size={18} />
              {item.label}
              {badgeOf(item.badge) > 0 ? <span className="n">{badgeOf(item.badge)}</span> : null}
            </AdminNavLink>
          ))}
          <AdminNavLink href="/admin/products/new" className={pathname === "/admin/products/new" ? "on" : ""}>
            <Icon name="plus" size={18} /> Добавить товар
          </AdminNavLink>
        </nav>
        <div className="bottom">
          <Link href="/" className="side-btn" target="_blank">
            <Icon name="external" size={18} /> Открыть сайт
          </Link>
          <form action={logout}>
            <button type="submit" className="side-btn">
              <Icon name="logout" size={18} /> Выйти
            </button>
          </form>
        </div>
      </aside>

      <header className="admin-mobile-bar glass">
        <Logo />
        <div className="admin-mobile-bar-actions">
          <Link href="/" className="icon-btn" aria-label="Сайт" target="_blank">
            <Icon name="external" size={18} />
          </Link>
          <form action={logout}>
            <button type="submit" className="icon-btn" aria-label="Выйти">
              <Icon name="logout" size={18} />
            </button>
          </form>
        </div>
      </header>

      <nav className="admin-tabbar glass" aria-label="Админ меню">
        {items.map((item) => (
          <AdminNavLink key={item.href} href={item.href} className={isOn(item.href, item.exact) ? "on" : ""}>
            <Icon name={item.icon} size={20} />
            <span>{item.short}</span>
            {badgeOf(item.badge) > 0 ? <i className="tab-badge">{badgeOf(item.badge)}</i> : null}
          </AdminNavLink>
        ))}
      </nav>

      <Link href="/admin/products/new" className="admin-fab btn btn-primary" aria-label="Добавить товар">
        <Icon name="plus" size={22} />
      </Link>
    </>
  );
}
