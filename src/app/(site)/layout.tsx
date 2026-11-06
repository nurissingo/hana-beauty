import { CartDrawer } from "@/components/site/CartDrawer";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Providers } from "@/components/site/Providers";
import { RevealObserver } from "@/components/site/Reveal";
import { getDict } from "@/lib/i18n-server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict();
  return (
    <Providers lang={lang} t={t}>
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Header />
      <main>{children}</main>
      <Footer t={t} />
      <CartDrawer />
      <RevealObserver />
    </Providers>
  );
}
