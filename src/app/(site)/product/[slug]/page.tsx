import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { BuyBox } from "@/components/site/AddToCart";
import { Gallery } from "@/components/site/Gallery";
import { ProductCard, toCartProduct } from "@/components/site/ProductCard";
import { whatsappUrl } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { categoryName } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import { getProductBySlug, listProducts } from "@/lib/repo";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.brand} ${product.name}`,
    description: product.shortDesc || product.description.slice(0, 160),
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const { lang, t } = await getDict();
  let related = product.categorySlug
    ? listProducts({ category: product.categorySlug, excludeId: product.id, limit: 4 })
    : [];
  if (related.length < 4) {
    const extra = listProducts({ featured: true, excludeId: product.id, limit: 8 }).filter(
      (p) => !related.some((r) => r.id === p.id),
    );
    related = [...related, ...extra].slice(0, 4);
  }

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const stockClass = product.stock <= 0 ? "out" : product.stock <= 5 ? "low" : "";
  const stockLabel = product.stock <= 0 ? t.product.outOfStock : product.stock <= 5 ? t.product.lowStock : t.product.inStock;
  const consultText = `Здравствуйте! Интересует ${product.brand} ${product.name} (${formatPrice(product.price)})`;

  const sections = [
    { title: t.product.description, body: product.description },
    { title: t.product.usage, body: product.usage },
    { title: t.product.ingredients, body: product.ingredients },
  ].filter((s) => s.body);

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <nav className="crumbs" aria-label="Breadcrumbs">
        <Link href="/catalog">{t.product.back}</Link>
        {product.categorySlug && (
          <>
            <span>/</span>
            <Link href={`/catalog?category=${product.categorySlug}`}>
              {categoryName({ nameRu: product.categoryNameRu, nameKz: product.categoryNameKz }, lang)}
            </Link>
          </>
        )}
      </nav>

      <div className="pdp">
        <Gallery
          product={product}
          badges={
            <>
              {product.isNew && <span className="tag tag-dark">{t.product.new}</span>}
              {product.isFeatured && <span className="tag">{t.product.hit}</span>}
              {discount > 0 && <span className="tag tag-honey">−{discount}%</span>}
            </>
          }
        />

        <div>
          <div className="pdp-info glass" data-reveal>
            <Link href={`/catalog?brand=${encodeURIComponent(product.brand)}`} className="pdp-brand">
              {product.brand}
            </Link>
            <h1 className="pdp-title">{product.name}</h1>
            {product.shortDesc && <p className="lead">{product.shortDesc}</p>}

            <div className="pdp-price">
              <span className="price">{formatPrice(product.price)}</span>
              {discount > 0 && <s className="price-old" style={{ fontSize: 17 }}>{formatPrice(product.oldPrice!)}</s>}
            </div>
            <span className={`stock ${stockClass}`}>{stockLabel}</span>

            <div className="specs">
              {product.volume && (
                <div className="spec">
                  <b>{t.product.volume}</b>
                  {product.volume}
                </div>
              )}
              {product.skinType && (
                <div className="spec">
                  <b>{t.product.skinType}</b>
                  {product.skinType}
                </div>
              )}
              <div className="spec">
                <b>{t.product.brand}</b>
                {product.brand}
              </div>
            </div>

            <BuyBox product={toCartProduct(product)} />

            <div className="perks">
              <div>
                <span className="p-ico"><Icon name="shield" size={18} /></span>
                {t.product.original}
              </div>
              <div>
                <span className="p-ico"><Icon name="truck" size={18} /></span>
                {t.product.delivery}
              </div>
              <a href={whatsappUrl(consultText)} target="_blank" rel="noreferrer">
                <span className="p-ico"><WhatsAppIcon size={18} /></span>
                {t.product.consult}
                <Icon name="external" size={14} className="muted" />
              </a>
            </div>
          </div>

          {sections.length > 0 && (
            <div className="details">
              {sections.map((s, i) => (
                <details key={s.title} className="faq-item glass" open={i === 0}>
                  <summary>
                    {s.title}
                    <span className="plus"><Icon name="plus" size={16} /></span>
                  </summary>
                  <p>{s.body}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" style={{ paddingBottom: 40 }}>
          <div className="section-head" data-reveal>
            <h2 className="h2">{t.product.related}</h2>
          </div>
          <div className="product-grid">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} t={t} delay={i * 0.06} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
