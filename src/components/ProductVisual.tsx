import type { Shape, Tone } from "@/lib/types";
import { ProductArt } from "./ProductArt";

type Props = {
  product: { id: number; name: string; brand: string; images: string[]; shape: Shape; tone: Tone };
  index?: number;
  className?: string;
  eager?: boolean;
};

export function ProductVisual({ product, index = 0, className, eager }: Props) {
  const src = product.images[index];
  if (src) {
    return (
      <img
        src={src}
        alt={product.name}
        className={`product-photo ${className ?? ""}`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  return (
    <ProductArt
      shape={product.shape}
      tone={product.tone}
      brand={product.brand}
      uid={String(product.id)}
      className={`product-art ${className ?? ""}`}
    />
  );
}
