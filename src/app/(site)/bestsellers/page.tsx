import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/site/ProductCard";
import { getDict } from "@/lib/i18n-server";
import { listProducts } from "@/lib/repo";

export const metadata: Metadata = { title: "Хиты" };

export default async function BestsellersPage() {
  const { t } = await getDict();
  const featured = listProducts({ featured: true, limit: 24 });
  const products = featured.length ? featured : listProducts({ limit: 24 });

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head" data-reveal>
        <p className="eyebrow">{t.sections.bestsellersEyebrow}</p>
        <h1 className="h2">{t.sections.bestsellersTitle}</h1>
        <p className="lead">{t.catalog.subtitle}</p>
      </div>

      <div className="product-grid">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.06} />
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <Link href="/catalog" className="btn btn-glass">
          {t.nav.catalog} <Icon name="arrow" size={16} className="ico-move" />
        </Link>
      </div>
    </div>
  );
}
