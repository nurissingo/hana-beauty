import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getStats } from "@/lib/repo";
import { AdminNav } from "./AdminNav";
import "../admin.css";

export const metadata: Metadata = {
  applicationName: "Hana Admin",
  title: { default: "Админ-панель", template: "%s · Админ" },
  robots: { index: false },
  appleWebApp: {
    capable: true,
    title: "Hana Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icons/admin-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/admin/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/admin-manifest.webmanifest",
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
        <AdminNav newOrders={stats.newOrders} newLeads={stats.newLeads} />
        <div className="admin-main">{children}</div>
      </div>
    </>
  );
}
