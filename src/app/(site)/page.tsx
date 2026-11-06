import Link from "next/link";
import { Icon, WhatsAppIcon, type IconName } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { ProductVisual } from "@/components/ProductVisual";
import { LeadForm } from "@/components/site/LeadForm";
import { ProductCard } from "@/components/site/ProductCard";
import { instagramUrl, whatsappUrl } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { categoryName, productCount } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import { listBrands, listCategories, listProducts } from "@/lib/repo";
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
};

const fallbackArt: { shape: Shape; tone: Tone }[] = [
  { shape: "ampoule", tone: "sage" },
  { shape: "jar", tone: "blush" },
  { shape: "dropper", tone: "lime" },
];

const whyIcons: IconName[] = ["shield", "plane", "box", "sparkle"];

export default async function HomePage() {
  const { lang, t } = await getDict();
  const careSlugs = new Set(["serums", "cleansing", "toners", "creams", "sun", "masks", "body"]);
  const categories = listCategories().filter((c) => c.count > 0 && careSlugs.has(c.slug));
  const featured = listProducts({ featured: true, limit: 8 });
  const fresh = listProducts({ isNew: true, sort: "new", limit: 10 });
  const all = listProducts();
  const brands = listBrands();
  const spotlight = fresh.find((p) => p.isFeatured) ?? featured[0] ?? all[0];
  const bestsellers = featured.length ? featured : all.slice(0, 8);
  const newList = fresh.length ? fresh : listProducts({ sort: "new", limit: 8 });
  const innerBeauty = listProducts({ category: "inner-beauty", limit: 8 });
  const kidsVitamins = listProducts({ category: "kids-vitamins", limit: 8 });

  return (
    <>
      {/* Hero */}
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
              <Link href="/#wholesale" className="btn btn-glass">
                {t.hero.ctaWholesale}
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{all.length}+</strong>
                <span>{t.hero.statProducts}</span>
              </div>
              <div>
                <strong>{brands.length}</strong>
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

      {/* Brands marquee */}
      {brands.length > 0 && (
        <section className="section-tight" style={{ paddingTop: 24 }} aria-label={t.sections.brandsTitle}>
          <div className="container">
            <div className="marquee glass">
              <div className="marquee-track">
                {[0, 1, 2, 3].map((copy) => (
                  <div key={copy} className="marquee-copy" aria-hidden={copy > 0}>
                    {brands.map((b) => (
                      <Link key={b.brand} href={`/catalog?brand=${encodeURIComponent(b.brand)}`} tabIndex={copy > 0 ? -1 : 0}>
                        {b.brand}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories — уход */}
      {categories.length > 0 && (
        <section className="section" style={{ paddingTop: 72 }}>
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

      {/* 1. Популярные бренды из Кореи */}
      <section className="section" id="bestsellers" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <p className="eyebrow">{t.sections.bestsellersEyebrow}</p>
              <h2 className="h2">{t.sections.bestsellersTitle}</h2>
            </div>
            <Link href="/catalog" className="btn btn-glass btn-sm">
              {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
            </Link>
          </div>
          <div className="product-grid">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight */}
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

      {/* 2. Новинки корейского рынка */}
      {newList.length > 0 && (
        <section className="section" id="new" style={{ paddingTop: 0 }}>
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

      {/* 3. INNER BEAUTY */}
      {innerBeauty.length > 0 && (
        <section className="section" id="inner-beauty" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">{t.sections.innerEyebrow}</p>
                <h2 className="h2">{t.sections.innerTitle}</h2>
              </div>
              <Link href="/catalog?category=inner-beauty" className="btn btn-glass btn-sm">
                {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
              </Link>
            </div>
            <div className="product-grid">
              {innerBeauty.map((p, i) => (
                <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.06} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Детские витамины */}
      {kidsVitamins.length > 0 && (
        <section className="section" id="kids-vitamins" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">{t.sections.kidsEyebrow}</p>
                <h2 className="h2">{t.sections.kidsTitle}</h2>
              </div>
              <Link href="/catalog?category=kids-vitamins" className="btn btn-glass btn-sm">
                {t.sections.viewAll} <Icon name="arrow" size={16} className="ico-move" />
              </Link>
            </div>
            <div className="product-grid">
              {kidsVitamins.map((p, i) => (
                <ProductCard key={p.id} product={p} t={t} delay={(i % 4) * 0.06} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About founders */}
      <section className="section" id="about" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="about-story glass" data-reveal>
            <div className="about-photo">
              <img src="/founders.jpg" alt={t.about.photoAlt} />
            </div>
            <div className="about-copy">
              <div>
                <p className="eyebrow">{t.about.eyebrow}</p>
                <h2 className="h2">{t.about.title}</h2>
              </div>
              <p className="lead">{t.about.lead}</p>
              <div className="story">
                {t.about.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
              <div className="about-sign">
                {t.about.closing}
                <strong>{t.about.sign}</strong>
              </div>
            </div>
          </div>
          <div className="why-grid" style={{ marginTop: 28 }}>
            {t.why.items.map((item, i) => (
              <div key={item.title} className="why-card glass" data-reveal style={{ ["--d" as string]: `${i * 0.07}s` }}>
                <div className="ico">
                  <Icon name={whyIcons[i]} size={22} />
                </div>
                <h3 className="h3">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <p className="eyebrow">{t.steps.eyebrow}</p>
              <h2 className="h2">{t.steps.title}</h2>
            </div>
          </div>
          <div className="steps">
            {t.steps.items.map((s, i) => (
              <div key={s.title} className="step glass" data-reveal style={{ ["--d" as string]: `${i * 0.07}s` }}>
                <div className="step-num">0{i + 1}</div>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale */}
      <section className="section" id="wholesale" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="wholesale glass" data-reveal>
            <div style={{ position: "relative" }}>
              <p className="eyebrow">{t.wholesale.eyebrow}</p>
              <h2 className="h2">{t.wholesale.title}</h2>
              <p className="lead">{t.wholesale.text}</p>
              <ul className="checks">
                {t.wholesale.points.map((point) => (
                  <li key={point}>
                    <span>
                      <Icon name="check" size={15} strokeWidth={2.4} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{ paddingTop: 0 }}>
        <div className="container faq-wrap">
          <div data-reveal>
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="h2">{t.faq.title}</h2>
          </div>
          <div className="faq-list">
            {t.faq.items.map((item, i) => (
              <details key={item.q} className="faq-item glass" data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }}>
                <summary>
                  {item.q}
                  <span className="plus">
                    <Icon name="plus" size={16} />
                  </span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="section" id="contacts" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <div className="container">
          <div className="cta glass" data-reveal>
            <p className="eyebrow">{t.contacts.eyebrow}</p>
            <h2 className="h2">{t.contacts.title}</h2>
            <p className="lead">{t.contacts.text}</p>
            <div className="cta-actions">
              <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn-wa">
                <WhatsAppIcon /> {t.contacts.whatsapp}
              </a>
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
