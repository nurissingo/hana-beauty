import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/site/Header";
import { requireAdmin } from "@/lib/auth";
import { getStats } from "@/lib/repo";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";
import "../admin.css";

export const metadata: Metadata = {
  title: { default: "Админ-панель", template: "%s · Админ" },
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const stats = getStats();
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="admin">
        <aside className="admin-side glass">
          <Logo />
          <AdminNav newOrders={stats.newOrders} newLeads={stats.newLeads} />
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
        <div className="admin-main">{children}</div>
      </div>
    </>
  );
}
