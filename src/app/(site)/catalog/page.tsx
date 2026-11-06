import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { AutoSelect } from "@/components/site/AutoSelect";
import { ProductCard } from "@/components/site/ProductCard";
import { categoryName } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import { listBrands, listCategories, listProducts, type ProductQuery } from "@/lib/repo";

export const metadata: Metadata = { title: "Каталог" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const sorts = ["popular", "new", "price-asc", "price-desc"] as const;

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const pick = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string).trim() : "");
  const q = pick("q").slice(0, 100);
  const category = pick("category");
  const brand = pick("brand");
  const sortRaw = pick("sort");
  const sort = (sorts as readonly string[]).includes(sortRaw) ? (sortRaw as ProductQuery["sort"]) : "popular";

  const { lang, t } = await getDict();
  const categories = listCategories().filter((c) => c.count > 0);
  const brands = listBrands();
  const products = listProducts({ q, category, brand, sort });
  const current = categories.find((c) => c.slug === category);

  const href = (next: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { q, category, brand, sort: sort === "popular" ? "" : sort!, ...next };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return s ? `/catalog?${s}` : "/catalog";
  };

  const sortLabels: Record<string, string> = {
    popular: t.catalog.sortPopular,
    new: t.catalog.sortNew,
    "price-asc": t.catalog.sortPriceAsc,
    "price-desc": t.catalog.sortPriceDesc,
  };

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head" data-reveal>
        <p className="eyebrow">{t.nav.catalog}</p>
        <h1 className="h2">{current ? categoryName(current, lang) : q ? `${t.catalog.searchFor} «${q}»` : t.catalog.title}</h1>
        <p className="lead">{t.catalog.subtitle}</p>
      </div>

      <form action="/catalog" className="toolbar glass" role="search" key={`${q}|${category}|${brand}|${sort}`}>
        {category && <input type="hidden" name="category" value={category} />}
        <label className="toolbar-search">
          <Icon name="search" size={18} className="muted" />
          <input name="q" defaultValue={q} placeholder={t.nav.search} aria-label={t.nav.search} />
        </label>
        <AutoSelect name="brand" defaultValue={brand} className="select" aria-label={t.catalog.brands}>
          <option value="">{t.catalog.allBrands}</option>
          {brands.map((b) => (
            <option key={b.brand} value={b.brand}>
              {b.brand}
            </option>
          ))}
        </AutoSelect>
        <AutoSelect name="sort" defaultValue={sort} className="select" aria-label={t.catalog.sort}>
          {sorts.map((s) => (
            <option key={s} value={s}>
              {sortLabels[s]}
            </option>
          ))}
        </AutoSelect>
      </form>

      <nav className="chips" aria-label={t.sections.categoriesEyebrow}>
        <Link href={href({ category: "" })} className={`chip-link ${!category ? "on" : ""}`}>
          {t.catalog.all}
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={href({ category: c.slug })} className={`chip-link ${category === c.slug ? "on" : ""}`}>
            {categoryName(c, lang)} <small>{c.count}</small>
          </Link>
        ))}
      </nav>

      {products.length > 0 ? (
        <>
          <p className="result-meta">
            {t.catalog.found}: {products.length}
          </p>
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.05} />
            ))}
          </div>
        </>
      ) : (
        <div className="empty glass">
          <div className="ico">
            <Icon name="search" size={28} />
          </div>
          <h2 className="h3">{t.catalog.empty}</h2>
          <p>{t.catalog.emptyText}</p>
          <Link href="/catalog" className="btn btn-primary">
            {t.catalog.reset}
          </Link>
        </div>
      )}
    </div>
  );
}
