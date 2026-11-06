import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/site/Header";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import "../admin.css";

export const metadata: Metadata = { title: "Вход в админ-панель", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="login-wrap">
        <div className="login-card glass-strong">
          <Logo />
          <h1>Админ-панель</h1>
          <p className="muted" style={{ margin: "0 0 24px" }}>
            Управление товарами, заказами и заявками
          </p>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
