import Link from "next/link";
import { ProductVisual } from "@/components/ProductVisual";
import { formatPrice } from "@/lib/format";
import type { Dict } from "@/lib/i18n";
import type { CartProduct, Product } from "@/lib/types";
import { AddToCartIcon } from "./AddToCart";

export function toCartProduct(p: Product): CartProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    volume: p.volume,
    images: p.images.slice(0, 1),
    shape: p.shape,
    tone: p.tone,
    stock: p.stock,
  };
}

export function ProductCard({ product, t, delay = 0 }: { product: Product; t: Dict; delay?: number }) {
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="card glass" data-reveal style={{ ["--d" as string]: `${delay}s` }}>
      <Link href={`/product/${product.slug}`} className="card-link">
        <div className={`card-media tone-${product.tone}`}>
          <div className="card-badges">
            {product.isNew && <span className="tag tag-dark">{t.product.new}</span>}
            {product.isFeatured && !product.isNew && <span className="tag">{t.product.hit}</span>}
            {discount > 0 && <span className="tag tag-honey">−{discount}%</span>}
          </div>
          <ProductVisual product={product} />
        </div>
        <div className="card-body">
          <span className="card-brand">{product.brand}</span>
          <h3 className="card-title">{product.name}</h3>
          <span className="card-volume">{product.volume}</span>
          <div className="card-foot">
            <div>
              <span className="price">{formatPrice(product.price)}</span>
              {discount > 0 && <s className="price-old">{formatPrice(product.oldPrice!)}</s>}
            </div>
          </div>
        </div>
      </Link>
      <AddToCartIcon product={toCartProduct(product)} />
    </article>
  );
}
