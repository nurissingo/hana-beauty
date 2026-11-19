import Link from "next/link";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductCard } from "@/components/site/ProductCard";
import { instagramUrl, whatsappUrl } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { categoryName, productCount } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import { listBrands, listCategories, listHomeBrands, listProducts } from "@/lib/repo";
import type { Shape, Tone } from "@/lib/types";

const categoryArt: Record<string, { shape: Shape; tone: Tone }> = {
  serums: { shape: "dropper", tone: "honey" },
  cleansing: { shape: "tube", tone: "sage" },
  toners: { shape: "pump", tone: "ivory" },
  creams: { shape: "jar", tone: "lime" },
  sun: { shape: "tube", tone: "honey" },
  masks: { shape: "pouch", tone: "lime" },
  body: { shape: "pump", tone: "blush" },
  "inner-beauty": { shape: "ampoule", tone: "blush" },
  "kids-vitamins": { shape: "jar", tone: "lime" },
  luxury: { shape: "jar", tone: "honey" },
  cosmetology: { shape: "pump", tone: "olive" },
};

const fallbackArt: { shape: Shape; tone: Tone }[] = [
  { shape: "ampoule", tone: "sage" },
  { shape: "jar", tone: "blush" },
  { shape: "dropper", tone: "lime" },
];

export default async function HomePage() {
  const { lang, t } = await getDict();
  const careSlugs = new Set(["serums", "cleansing", "toners", "creams", "sun", "masks", "body"]);
  const categories = listCategories().filter((c) => c.count > 0 && careSlugs.has(c.slug));
  const allCats = listCategories();
  const featured = listProducts({ featured: true, limit: 4 });
  const fresh = listProducts({ isNew: true, sort: "new", limit: 6 });
  const all = listProducts();
  const brandsAll = listBrands();
  const brands = listHomeBrands(8);
  const spotlight = fresh.find((p) => p.isFeatured) ?? featured[0] ?? all[0];
  const bestsellers = featured.length ? featured : all.slice(0, 4);
  const newList = fresh.length ? fresh : listProducts({ sort: "new", limit: 6 });

  const deptDefs = [
    { slug: "inner-beauty", eyebrow: t.sections.innerEyebrow, title: t.sections.innerTitle },
    { slug: "kids-vitamins", eyebrow: t.sections.kidsEyebrow, title: t.sections.kidsTitle },
    { slug: "luxury", eyebrow: t.sections.luxuryEyebrow, title: t.sections.luxuryTitle },
    { slug: "cosmetology", eyebrow: t.sections.cosmetologyEyebrow, title: t.sections.cosmetologyTitle },
  ] as const;

  const departments = deptDefs
    .map((d, i) => {
      const cat = allCats.find((c) => c.slug === d.slug);
      if (!cat || cat.count === 0) return null;
      return {
        ...d,
        count: cat.count,
        art: categoryArt[d.slug] ?? fallbackArt[i % fallbackArt.length],
      };
    })
    .filter(Boolean) as Array<{
    slug: string;
    eyebrow: string;
    title: string;
    count: number;
    art: { shape: Shape; tone: Tone };
  }>;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy intro">
            <span className="pill glass">
              <span className="pill-dot">
                <Icon name="sparkle" size={13} strokeWidth={2} />
              </span>
              {t.hero.eyebrow}
            </span>
            <h1 className="display">
              {t.hero.title1}
              <br />
              <span className="text-gradient">{t.hero.title2}</span>
            </h1>
            <p className="lead">{t.hero.subtitle}</p>
            <div className="hero-cta">
              <Link href="/catalog" className="btn btn-primary">
                {t.hero.ctaCatalog} <Icon name="arrow" size={18} className="ico-move" />
              </Link>
              <Link href="/wholesale" className="btn btn-glass">
                {t.hero.ctaWholesale}
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{all.length}+</strong>
                <span>{t.hero.statProducts}</span>
              </div>
              <div>
                <strong>{brandsAll.length}</strong>
                <span>{t.hero.statBrands}</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>{t.hero.statOriginal}</span>
              </div>
            </div>
          </div>

          <div className="stage intro" style={{ ["--d" as string]: "0.15s" }}>
            <div className="stage-ring" />
            <div className="stage-orb" />
            <div className="stage-podium" />
            <div className="stage-drop" />
            <div className="stage-item a">
              <ProductArt shape="dropper" tone="honey" brand="Seoul" uid="hero-a" />
            </div>
            <div className="stage-item b">
              <ProductArt shape="tube" tone="lime" brand="Hana Beauty" uid="hero-b" />
            </div>
            <div className="stage-item c">
              <ProductArt shape="jar" tone="ivory" brand="K-Beauty" uid="hero-c" />
            </div>
            <div className="chip one glass-strong">
              <span className="chip-ico">
                <Icon name="shield" size={20} />
              </span>
              <div>
                <strong>{t.hero.chipOriginal}</strong>
                <span>{t.hero.chipOriginalSub}</span>
              </div>
            </div>
            <div className="chip two glass-strong">
              <span className="chip-ico">
                <Icon name="plane" size={20} />
              </span>
              <div>
                <strong>{t.hero.chipDelivery}</strong>
                <span>{t.hero.chipDeliverySub}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="section" style={{ paddingTop: 48 }} aria-label={t.sections.brandsTitle}>
          <div className="container" data-reveal>
            <div className="section-head">
              <div>
                <p className="eyebrow">{t.sections.brandsEyebrow}</p>
                <h2 className="h2">{t.sections.brandsTitle}</h2>
              </div>
              <Link href="/catalog" className="btn btn-glass btn-sm">
                {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
              </Link>
            </div>
            <div className="brand-grid brand-grid-home">
              {brands.map((b) => (
                <Link
                  key={b.brand}
                  href={`/catalog?brand=${encodeURIComponent(b.brand)}`}
                  className="brand-card glass"
                >
                  <strong>{b.brand}</strong>
                  <span>{productCount(b.count, lang)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">{t.sections.categoriesEyebrow}</p>
                <h2 className="h2">{t.sections.categoriesTitle}</h2>
              </div>
              <Link href="/catalog" className="btn btn-glass btn-sm">
                {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
              </Link>
            </div>
            <div className="cat-grid">
              {categories.map((c, i) => {
                const art = categoryArt[c.slug] ?? fallbackArt[i % fallbackArt.length];
                const isLast = i > 0 && i === categories.length - 1;
                const restDesktop = (categories.length - 1) % 4;
                const restMobile = (categories.length - 1) % 2;
                return (
                  <Link
                    key={c.id}
                    href={`/catalog?category=${c.slug}`}
                    className="cat-card glass"
                    data-reveal
                    style={{
                      ["--d" as string]: `${i * 0.05}s`,
                      ["--span" as string]: isLast && restDesktop ? 5 - restDesktop : 1,
                      ["--span-m" as string]: isLast && restMobile ? 2 : 1,
                    }}
                  >
                    <div>
                      <h3>{categoryName(c, lang)}</h3>
                      <span className="count">{productCount(c.count, lang)}</span>
                    </div>
                    <span className="go">
                      <Icon name="arrow" size={16} />
                    </span>
                    <div className="cat-art">
                      <ProductArt shape={art.shape} tone={art.tone} brand="Hana" uid={`cat-${c.id}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <p className="eyebrow">{t.sections.bestsellersEyebrow}</p>
              <h2 className="h2">{t.sections.bestsellersTitle}</h2>
            </div>
            <Link href="/bestsellers" className="btn btn-glass btn-sm">
              {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
            </Link>
          </div>
          <div className="scroller">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {spotlight && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="feature" data-reveal>
              <div className="feature-copy">
                <p className="eyebrow">
                  {spotlight.isNew ? t.product.new : t.product.hit} · {spotlight.brand}
                </p>
                <h2 className="h2">{spotlight.name}</h2>
                <p className="lead">{spotlight.shortDesc || spotlight.description}</p>
                <div className="feature-price">
                  {formatPrice(spotlight.price)}
                  {spotlight.oldPrice && spotlight.oldPrice > spotlight.price && <s>{formatPrice(spotlight.oldPrice)}</s>}
                </div>
                <div className="hero-cta" style={{ marginTop: 0 }}>
                  <Link href={`/product/${spotlight.slug}`} className="btn btn-lime">
                    {t.product.more} <Icon name="arrow" size={18} className="ico-move" />
                  </Link>
                  <Link href="/catalog?sort=new" className="btn btn-glass">
                    {t.catalog.sortNew}
                  </Link>
                </div>
              </div>
              <div className="feature-visual">
                <div className="glass-disc" />
                <ProductVisual product={spotlight} />
              </div>
            </div>
          </div>
        </section>
      )}

      {newList.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">{t.sections.newEyebrow}</p>
                <h2 className="h2">{t.sections.newTitle}</h2>
              </div>
              <Link href="/catalog?sort=new" className="btn btn-glass btn-sm">
                {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
              </Link>
            </div>
            <div className="scroller">
              {newList.map((p, i) => (
                <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.06} />
              ))}
            </div>
          </div>
        </section>
      )}

      {departments.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">{t.sections.deptsEyebrow}</p>
                <h2 className="h2">{t.sections.deptsTitle}</h2>
              </div>
              <Link href="/catalog" className="btn btn-glass btn-sm">
                {t.nav.catalog} <Icon name="arrow" size={16} className="ico-move" />
              </Link>
            </div>
            <div className="cat-grid">
              {departments.map((d, i) => (
                <Link
                  key={d.slug}
                  href={`/catalog?category=${d.slug}`}
                  className="cat-card glass"
                  data-reveal
                  style={{
                    ["--d" as string]: `${i * 0.05}s`,
                    ["--span" as string]: 1,
                    ["--span-m" as string]: 1,
                  }}
                >
                  <div>
                    <h3>{d.eyebrow}</h3>
                    <span className="count">{productCount(d.count, lang)}</span>
                  </div>
                  <span className="go">
                    <Icon name="arrow" size={16} />
                  </span>
                  <div className="cat-art">
                    <ProductArt shape={d.art.shape} tone={d.art.tone} brand="Hana" uid={`dept-${d.slug}`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <div className="container">
          <div className="cta glass" data-reveal>
            <p className="eyebrow">{t.contacts.eyebrow}</p>
            <h2 className="h2">{t.contacts.title}</h2>
            <p className="lead">{t.contacts.text}</p>
            <div className="cta-actions">
              <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn-wa">
                <WhatsAppIcon /> {t.contacts.whatsapp}
              </a>
              <Link href="/about" className="btn btn-glass">
                {t.nav.about}
              </Link>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="btn btn-glass">
                <Icon name="instagram" size={18} /> {t.contacts.instagram}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
