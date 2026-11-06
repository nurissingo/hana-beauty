import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getLang } from "@/lib/i18n-server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hana Beauty — корейская косметика в Казахстане",
    template: "%s · Hana Beauty",
  },
  description:
    "Оригинальная корейская косметика с прямыми поставками из Кореи. Розница и опт, доставка по всему Казахстану.",
  openGraph: {
    title: "Hana Beauty — корейская косметика в Казахстане",
    description: "Прямые поставки из Кореи · Оригинал 100% · Опт и розница",
    type: "website",
    locale: "ru_KZ",
  },
};

export const viewport: Viewport = {
  themeColor: "#d2f759",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang === "kz" ? "kk" : "ru"} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
